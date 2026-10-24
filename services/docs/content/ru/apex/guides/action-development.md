---
title: Разработка действий
description: Создавайте, переопределяйте и тестируйте действия движка в commons или proprietaries.
weight: 22
---

**Контекст:** вся автоматизация устроена в&nbsp;виде [действий](/apex/glossary#action)&nbsp;— по&nbsp;одному Python-модулю на&nbsp;каждое действие, диспетчеризуемых по&nbsp;пути к&nbsp;файлу. Общий код находится в&nbsp;каталоге [commons](/apex/glossary#commons) `actions/` («commons»&nbsp;— общий репозиторий), а&nbsp;специфика конкретного узла&nbsp;— в&nbsp;его `proprietaries/actions/`. Оба дерева используют единый контракт, а&nbsp;запускатель добавляет оба каталога в&nbsp;`sys.path`. Поэтому локальное действие импортирует `engine.*` точно так&nbsp;же, как и&nbsp;действие из&nbsp;commons.

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

Путь к&nbsp;файлу задаёт имя действия: модуль выше вызывается как `apex utils/example`. Верните `0` или `None` при&nbsp;успехе, целое число&nbsp;— для&nbsp;конкретного кода выхода, либо выбросьте `SystemExit(code)`. [Соглашение о&nbsp;кодах выхода](/apex/concepts/actions-and-overlay#exit-codes): `64`&nbsp;— ошибка использования, `65`&nbsp;— ошибка данных, `66`&nbsp;— отсутствие входных данных, `1`&nbsp;— общая ошибка.

## Соглашения для фоновых действий {#unattended}

Действия, которые запускаются по&nbsp;cron без&nbsp;надзора оператора, следуют двум правилам, чтобы сбои отправляли оповещение, а&nbsp;не&nbsp;исчезали бесследно:

- **Оберните тело** в&nbsp;`try/except Exception` и&nbsp;отправьте `ctx.notify.error(...)` перед тем как выбросить `SystemExit(1)`&nbsp;— это Python-аналог перехвата `ERR` в&nbsp;shell.
- **Привяжите код выхода к&nbsp;итоговому уведомлению**: методы `ctx.notify.*` возвращают `False`, если доставить сообщение не&nbsp;удалось. Запуск, чьё статусное сообщение не&nbsp;дошло, всё равно должен завершиться с&nbsp;кодом&nbsp;1.

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

Проприетарный файл с&nbsp;тем&nbsp;же относительным путём, что и&nbsp;действие из&nbsp;commons, полностью перекрывает его. Внутри переопределяющего модуля вызов `ctx.commons.run(args)` обращается к&nbsp;исходной реализации из&nbsp;commons&nbsp;— по&nbsp;паттерну обёртки:

```python {filename="proprietaries/actions/sync/packages.py"}
from engine.descriptor import Meta, Arg

METADATA = Meta(summary="sync/packages с локальным для узла предварительным шагом.",
                args=[Arg("telegram_bot_url", "Telegram Bot URL")])

def run(ctx, args):
    ctx.log.info("Локальная для узла подготовка...")
    return ctx.commons.run(args)          # делегирование реализации из commons
```

Чтобы отключить действие на&nbsp;конкретном узле, укажите `DISABLED = "reason"` на&nbsp;верхнем уровне модуля. Диспетчер отклонит запуск такого действия с&nbsp;кодом выхода&nbsp;1, а&nbsp;в&nbsp;общем списке появится отметка `[DISABLED: reason]`.

## Тестирование {#testing}

Набор тестов commons построен на&nbsp;стандартном модуле `unittest`:

```bash
./tests/run.sh          # python3 -m unittest discover -s tests -p 'test_*.py' -v
```

Изменения в&nbsp;движке должны сохранять тесты зелёными. Быстрая smoke-проверка для&nbsp;любого действия (как из&nbsp;commons, так и&nbsp;проприетарного)&nbsp;— запуск со&nbsp;справкой: команда `apex <name> --help` должна завершаться с&nbsp;кодом&nbsp;0. Это подтверждает, что модуль синтаксически корректен, объект `METADATA` сформирован без&nbsp;ошибок, а&nbsp;механизм обнаружения находит действие.

Хук pre-commit в&nbsp;commons (скрипт `init.sh` подключает его через `core.hooksPath`) запускает `apex utils/lint-docker-compose --hook` для&nbsp;подготовленных (staged) compose-файлов, поэтому ошибки в&nbsp;композициях отлавливаются ещё на&nbsp;этапе коммита.

---

**См.&nbsp;также:**

- [Concept: Actions and the overlay](/apex/concepts/actions-and-overlay)
- [Concept: The execution context](/apex/concepts/execution-context)
- [Reference: Engine API](/apex/reference/engine-api)
