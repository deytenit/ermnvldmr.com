---
title: Разработка действий
description: Создавайте, переопределяйте и тестируйте действия движка в commons или proprietaries.
weight: 22
---

**Контекст:** вся автоматизация устроена в виде [действий](/apex/glossary#action) — по одному Python-модулю на каждое действие, диспетчеризуемых по пути к файлу. Общий код находится в каталоге [commons](/apex/glossary#commons) `actions/` («commons» — общий репозиторий), а специфика конкретного узла — в его `proprietaries/actions/`. Оба дерева используют единый контракт, а запускатель добавляет оба каталога в `sys.path`. Поэтому локальное действие импортирует `engine.*` точно так же, как и действие из commons.

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

Путь к файлу задаёт имя действия: модуль выше вызывается как `apex utils/example`. Верните `0` или `None` при успехе, целое число — для конкретного кода выхода, либо выбросьте `SystemExit(code)`. [Соглашение о кодах выхода](/apex/concepts/actions-and-overlay#exit-codes): `64` — ошибка использования, `65` — ошибка данных, `66` — отсутствие входных данных, `1` — общая ошибка.

## Соглашения для фоновых действий {#unattended}

Действия, которые запускаются по cron без надзора оператора, следуют двум правилам, чтобы сбои отправляли оповещение, а не исчезали бесследно:

- **Оберните тело** в `try/except Exception` и отправьте `ctx.notify.error(...)` перед тем как выбросить `SystemExit(1)` — это Python-аналог перехвата `ERR` в shell.
- **Привяжите код выхода к итоговому уведомлению**: методы `ctx.notify.*` возвращают `False`, если доставить сообщение не удалось. Запуск, чьё статусное сообщение не дошло, всё равно должен завершиться с кодом 1.

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

Проприетарный файл с тем же относительным путём, что и действие из commons, полностью перекрывает его. Внутри переопределяющего модуля вызов `ctx.commons.run(args)` обращается к исходной реализации из commons — по паттерну обёртки:

```python {filename="proprietaries/actions/sync/packages.py"}
from engine.descriptor import Meta, Arg

METADATA = Meta(summary="sync/packages с локальным для узла предварительным шагом.",
                args=[Arg("telegram_bot_url", "Telegram Bot URL")])

def run(ctx, args):
    ctx.log.info("Локальная для узла подготовка...")
    return ctx.commons.run(args)          # делегирование реализации из commons
```

Чтобы отключить действие на конкретном узле, укажите `DISABLED = "reason"` на верхнем уровне модуля. Диспетчер отклонит запуск такого действия с кодом выхода 1, а в общем списке появится отметка `[DISABLED: reason]`.

## Тестирование {#testing}

Набор тестов commons построен на стандартном модуле `unittest`:

```bash
./tests/run.sh          # python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Изменения в движке должны сохранять тесты зелёными. Быстрая smoke-проверка для любого действия (как из commons, так и проприетарного) — запуск со справкой: команда `apex <name> --help` должна завершаться с кодом 0. Это подтверждает, что модуль синтаксически корректен, объект `METADATA` сформирован без ошибок, а механизм обнаружения находит действие.

Хук pre-commit в commons (скрипт `init.sh` подключает его через `core.hooksPath`) запускает `apex utils/lint-docker-compose --hook` для подготовленных (staged) compose-файлов, поэтому ошибки в композициях отлавливаются ещё на этапе коммита.

---

**См. также:**

- [Concept: Actions and the overlay](/apex/concepts/actions-and-overlay)
- [Concept: The execution context](/apex/concepts/execution-context)
- [Reference: Engine API](/apex/reference/engine-api)
