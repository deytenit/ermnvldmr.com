---
title: Справочник API движка
description: API дескрипторов и ctx, доступные авторам действий.
weight: 34
---

Инструменты для разработки [действий](/apex/glossary#action): дескрипторы аргументов в `engine.descriptor` и методы контекста выполнения. Концептуальные основы описаны в разделе [Концепция: Контекст выполнения](/apex/concepts/execution-context).

## Дескрипторы {#descriptors}

```python
from engine.descriptor import Meta, Arg, Opt, Flag, Rest
```

| Класс | Сигнатура | Сопоставление с argparse |
|---|---|---|
| `Meta` | `Meta(summary, args=[])` | Управляет как кратким описанием в перечислении, так и парсером. |
| `Arg` | `Arg(name, help="", required=True)` | Позиционный аргумент; `required=False` → `nargs="?"`, по умолчанию `None`. |
| `Opt` | `Opt(name, help="", default=None)` | Параметр со значением (`--name VALUE`) и значением по умолчанию. |
| `Flag` | `Flag(name, help="")` | Логический флаг `store_true`. |
| `Rest` | `Rest(name, help="")` | Жадный остаток аргументов (`argparse.REMAINDER`). |

Ошибки использования приводят к выходу с кодом `64` вместо стандартного для argparse кода `2`.

> [!WARNING]
> `Rest` захватывает *всё* после первого позиционного аргумента — включая флаги. `Flag`, объявленный рядом с `Rest`, распознаётся только *перед* позиционным аргументом; действие, которое должно принимать свой флаг в любом месте, обязано само извлечь его из остатка (действие `compose` делает именно так для `--dry-run`).

## ctx.log {#log}

`info(msg)` · `warn(msg)` · `success(msg)` → stdout; `error(msg)` → stderr. Все строки выводятся с префиксом `[<node>] [<action>] [LEVEL]`.

## ctx.sys {#sys}

| Метод | Поведение |
|---|---|
| `run(cmd, check=True, capture=False, cwd=None, env=None, input=None)` | Обёртка над `subprocess.run`, возвращающая `CompletedProcess`; `capture=True` собирает текстовые потоки stdout/stderr. |
| `sudo(cmd, **kw)` | `run(["sudo", *cmd])`. |
| `ok(cmd, **kw)` | `True` тогда и только тогда, когда код возврата `0`; никогда не вызывает исключений. |
| `service_exists(name)` / `service_is_active(name)` / `service_is_enabled(name)` | Запросы к юнитам systemd. |
| `start_and_enable(name)` | Запуск и включение при необходимости; возвращает итоговое состояние активности. |
| `ensure_running(name)` | Выполняет `enable --now`, если сервис неактивен. |
| `restart(name)` / `reload(name, dry_run=False)` / `daemon_reload()` | Управление жизненным циклом сервиса. |
| `wait_for(name, timeout=30, interval=2)` | Опрашивает статус, пока сервис не станет активным. |
| `install_packages(packages)` | Для каждого пакета: пропускает, если бинарный файл уже есть в `PATH`, иначе выполняет `apt-get update -y` и `apt-get install -y`. |

## ctx.tpl {#tpl}

| Метод | Поведение |
|---|---|
| `render(path, vars)` | Рендерит один файл (относительные пути отсчитываются от `configs/`); семантика `safe_substitute` — неизвестные переменные сохраняются как есть. |
| `render_dir(rel_dir, vars)` | Рендерит каждый файл в поддереве `configs/`; возвращает `{relative_path: content}`. |

## ctx.host {#host}

| Метод | Поведение |
|---|---|
| `backup(path, sudo=False)` | Копирует файл в `<path>.<epoch>.bak`; возвращает путь к резервной копии или `None`. |
| `write_file(path, content, backup=True, dry_run=False, sudo=False)` | Атомарная запись через временный файл (права `0644`); опциональное создание резервной копии; при `sudo=True` сохраняются права целевого файла. |
| `inject_block(target, content, start, end, anchor=None, old_pairs=(), dry_run=False, sudo=True)` | Заменяет управляемый блок по маркерам: удаляет текущие и устаревшие блоки, вставляет новый блок после первой строки-якоря. Возвращает `False`, если якорь отсутствует. Если целевой файл не найден, завершается с ошибкой. |
| `install_crontab(text, dry_run=False)` | Создаёт резервную копию crontab, завершается с ошибкой при пустом результате рендеринга (`SystemExit(65)`), выводит предпросмотр, устанавливает crontab через `crontab -` и восстанавливает прежнюю версию при сбое (`SystemExit(1)`). |

## ctx.ufw {#ufw}

`apply(rules_dir, config_dir=None, dry_run=False)` — полная настройка межсетевого экрана: проверка каталогов (выход с кодом `66`), проверка утилит (`ufw`, `ufw-docker`), применение правил хоста, внедрение управляемого блока в `/etc/ufw/before.rules` и `after.rules`, а также применение правил контейнеров из файлов `*.rules`.

## ctx.crowdsec {#crowdsec}

`ensure_installed()` · `deploy(configs_subdir, vars, dry_run=False)` · `install_collections(collections)`.

## ctx.systemd {#systemd}

`deploy_units(configs_subdir, vars, dry_run=False)` — рендерит файлы верхнего уровня (не скрытые) из подкаталога в `/etc/systemd/system/`, затем выполняет daemon-reload и `enable --now` для каждого сервиса `.service`.

## ctx.notify {#notify}

`telegram(title, bot_url, message, node=None, level="INFO")` плюс вспомогательные методы `success` / `error` / `info` / `warn`. Все методы возвращают `bool`: `True` — только если сообщение доставлено. При пустом `bot_url` выводится предупреждение в лог и возвращается `False`. Поле `instance` в оповещении по умолчанию содержит публичный хост узла (`APEX_NODE_HOST`), префикс домена или узла к нему не добавляется.

## ctx.paths и ctx.node {#paths}

`ctx.paths`: `repo_root`, `commons`, `proprietaries`, `configs`, `compositions`, `core`, `tier1..3`, `stier1..3`, `root_tier1..3`. `ctx.node`: запись идентичности (`name`, `subnet`, `fqdn`, `host`) или `None` в checkout автономного commons. `ctx.vars()`: окружение шаблонов/compose (см. [Справочник: Переменные окружения](/apex/reference/environment)). `ctx.commons.run(args)`: делегирование затенённому действию commons — допустимо только в переопределяющем проприетарном модуле.

---

**См. также:**

- [Концепция: Контекст выполнения](/apex/concepts/execution-context)
- [Руководство: Разработка действий](/apex/guides/action-development)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
