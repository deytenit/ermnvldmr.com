---
title: Разработка действий
description: Пишите, переопределяйте и тестируйте действия движка в commons или proprietaries.
weight: 22
---

**Контекст:** вся автоматизация поставляется в виде [действий](/apex/glossary#action) — по одному Python-модулю на каждое, диспетчеризуемых по пути. Общее поведение размещается в [commons](/apex/glossary#commons) `actions/` («commons» — общий репозиторий); всё, что специфично для узла, размещается в `proprietaries/actions/` этого узла. Оба используют идентичный контракт, а запускатель помещает оба дерева в `sys.path`, поэтому проприетарное действие импортирует `engine.*` точно так же, как и действие из commons.

## Минимальное действие {#minimal}

```python {filename="proprietaries/actions/utils/example.py"}
"""Однострочный docstring модуля, описывающий действие."""
import os
from engine.descriptor import Meta, Arg, Flag

METADATA = Meta(
    summary="Скопировать отрендеренную конфигурацию на место.",
    args=[Arg("target_dir", "Каталог назначения"),
          Flag("--dry-run", "Только предпросмотр.")],
)

def run(ctx, args):
    if not os.path.isdir(args.target_dir):
        ctx.log.error(f"Нет такого каталога: {args.target_dir}")
        raise SystemExit(66)
    content = ctx.tpl.render("example/config", ctx.vars())
    ctx.host.write_file(os.path.join(args.target_dir, "config"), content,
                        dry_run=args.dry_run, sudo=True)
    ctx.log.success("Конфигурация развёрнута.")
```

Путь к файлу — это его имя: модуль выше диспетчеризуется как `apex utils/example`. Верните `0`/`None` для успеха, целое число для конкретного кода выхода или возбудите `SystemExit(code)`; [соглашение о кодах выхода](/apex/concepts/actions-and-overlay#exit-codes) таково: `64` — ошибка использования, `65` — ошибка данных, `66` — отсутствующий ввод, `1` — общая ошибка.

## Соглашения для действий без надзора {#unattended}

Действия, запускаемые из cron, следуют двум правилам, чтобы сбои приводили к оповещению, а не исчезали бесследно:

- **Оберните тело** в `try/except Exception` и отправьте `ctx.notify.error(...)` перед повторным возбуждением как `SystemExit(1)` — Python-эквивалент shell-ловушки ERR.
- **Привяжите код выхода к финальному уведомлению**: `ctx.notify.*` возвращает `False` при неудачной доставке; завершённый запуск, чьё статусное сообщение так и не пришло, всё равно должен завершиться с кодом `1`.

```python
    try:
        ...работа...
        log.success("Готово.")
        if not ctx.notify.success(TITLE, url, "Готово.", node):
            raise SystemExit(1)
    except SystemExit:
        raise
    except Exception as e:
        log.error(f"{type(e).__name__}: {e}")
        ctx.notify.error(TITLE, url, f"Критическая ошибка: {e}", node)
        raise SystemExit(1)
```

## Переопределение, обёртывание, отключение {#override}

Проприетарный файл с тем же относительным путём, что и действие из commons, полностью затеняет его. Внутри затеняющего модуля `ctx.commons.run(args)` вызывает затенённую реализацию — паттерн обёртывания:

```python {filename="proprietaries/actions/sync/packages.py"}
from engine.descriptor import Meta, Arg

METADATA = Meta(summary="sync/packages с локальным для узла предварительным шагом.",
                args=[Arg("telegram_bot_url", "Telegram Bot URL")])

def run(ctx, args):
    ctx.log.info("Локальная для узла подготовка...")
    return ctx.commons.run(args)          # делегирование реализации из commons
```

Чтобы вывести действие из эксплуатации на одном узле, присвойте `DISABLED = "reason"` на верхнем уровне модуля: диспетчеризация отклонит его (код выхода `1`), а в списке отобразится `[DISABLED: reason]`.

## Тестирование {#testing}

Набор тестов commons использует stdlib `unittest`:

```bash
./tests/run.sh          # python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Изменения движка должны сохранять набор тестов «зелёным». Дешёвая smoke-проверка для любого действия — из commons или проприетарного — это его парсер: `apex <name> --help` должен завершиться с кодом `0`, что доказывает, что модуль разбирается, его `METADATA` корректно сформирован, и его видит механизм обнаружения.

Pre-commit-хук commons (подключаемый `init.sh` через `core.hooksPath`) запускает `apex utils/lint-docker-compose --hook` для staged-файлов compose, поэтому изменения композиций линтуются в момент коммита.

---

**См. также:**

- [Concept: Actions and the overlay](/apex/concepts/actions-and-overlay)
- [Concept: The execution context](/apex/concepts/execution-context)
- [Reference: Engine API](/apex/reference/engine-api)
