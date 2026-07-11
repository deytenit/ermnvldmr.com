---
title: Справочник API движка
description: API дескрипторов и ctx, доступные авторам действий.
weight: 34
---

Поверхность, с которой программирует автор [действия](/apex/glossary#action): дескрипторы аргументов в `engine.descriptor` и члены контекста выполнения. Концептуальная основа — в [Концепция: Контекст выполнения](/apex/concepts/execution-context).

## Дескрипторы {#descriptors}

```python
from engine.descriptor import Meta, Arg, Opt, Flag, Rest
```

| Класс | Сигнатура | Сопоставление с argparse |
|---|---|---|
| `Meta` | `Meta(summary, args=[])` | Управляет как кратким описанием в перечислении, так и парсером. |
| `Arg` | `Arg(name, help="", required=True)` | Позиционный; `required=False` → `nargs="?"`, по умолчанию `None`. |
| `Opt` | `Opt(name, help="", default=None)` | Опция со значением (`--name VALUE`) со значением по умолчанию. |
| `Flag` | `Flag(name, help="")` | Логический флаг `store_true`. |
| `Rest` | `Rest(name, help="")` | Жадный остаток (`argparse.REMAINDER`). |

Ошибки использования приводят к выходу `64` вместо стандартного для argparse `2`.

> [!WARNING]
> `Rest` захватывает *всё* после первого позиционного аргумента — включая флаги. `Flag`, объявленный рядом с `Rest`, распознаётся только *перед* позиционным аргументом; действие, которое должно принимать свой флаг в любом месте, обязано само вырезать его из остатка (действие `compose` делает именно это для `--dry-run`).

## ctx.log {#log}

`info(msg)` · `warn(msg)` · `success(msg)` → stdout; `error(msg)` → stderr. Все строки несут префикс `[<node>] [<action>] [LEVEL]`.

## ctx.sys {#sys}

| Метод | Поведение |
|---|---|
| `run(cmd, check=True, capture=False, cwd=None, env=None, input=None)` | Обёртка над `subprocess.run`, возвращающая `CompletedProcess`; `capture=True` собирает текстовые stdout/stderr. |
| `sudo(cmd, **kw)` | `run(["sudo", *cmd])`. |
| `ok(cmd, **kw)` | `True` тогда и только тогда, когда код возврата `0`; никогда не вызывает исключение. |
| `service_exists(name)` / `service_is_active(name)` / `service_is_enabled(name)` | Запросы к юнитам systemd. |
| `start_and_enable(name)` | Запуск + включение при необходимости; возвращает итоговое активное состояние. |
| `ensure_running(name)` | `enable --now`, когда неактивен. |
| `restart(name)` / `reload(name, dry_run=False)` / `daemon_reload()` | Жизненный цикл сервиса. |
| `wait_for(name, timeout=30, interval=2)` | Опрашивать, пока не станет активным. |
| `install_packages(packages)` | Для каждого пакета: пропустить, когда его бинарник в `PATH`, иначе `apt-get update -y` + `apt-get install -y`. |

## ctx.tpl {#tpl}

| Метод | Поведение |
|---|---|
| `render(path, vars)` | Отрендерить один файл (относительные пути разрешаются относительно `configs/`); семантика `safe_substitute` — неизвестные переменные остаются буквальными. |
| `render_dir(rel_dir, vars)` | Отрендерить каждый файл в поддереве `configs/`; возвращает `{relative_path: content}`. |

## ctx.host {#host}

| Метод | Поведение |
|---|---|
| `backup(path, sudo=False)` | Скопировать файл в `<path>.<epoch>.bak`; возвращает путь резервной копии или `None`. |
| `write_file(path, content, backup=True, dry_run=False, sudo=False)` | Атомарная установка через временный файл (режим `0644`); опциональная предварительная резервная копия; вариант `sudo` сохраняет режим существующей цели. |
| `inject_block(target, content, start, end, anchor=None, old_pairs=(), dry_run=False, sudo=True)` | Замена управляемого блока по маркерам; удаляет текущие и устаревшие блоки, вставляет после первой строки-якоря; `False`, когда якорь отсутствует; отсутствующая цель — ошибка. |
| `install_crontab(text, dry_run=False)` | Снимок, отказ при пустом рендере (`SystemExit(65)`), предпросмотр, установка через `crontab -`, восстановление снимка при сбое (`SystemExit(1)`). |

## ctx.ufw {#ufw}

`apply(rules_dir, config_dir=None, dry_run=False)` — полный проход межсетевого экрана: проверки каталогов (выход `66`), проверки инструментов (`ufw`, `ufw-docker`), правила хоста, внедрение управляемого блока в `/etc/ufw/before.rules` и `after.rules`, правила контейнеров из файлов `*.rules`.

## ctx.crowdsec {#crowdsec}

`ensure_installed()` · `deploy(configs_subdir, vars, dry_run=False)` · `install_collections(collections)`.

## ctx.systemd {#systemd}

`deploy_units(configs_subdir, vars, dry_run=False)` — отрендерить файлы верхнего уровня (не скрытые) поддерева в `/etc/systemd/system/`, затем выполнить daemon-reload и `enable --now` для каждого `.service`.

## ctx.notify {#notify}

`telegram(title, bot_url, message, node=None, level="INFO")` плюс сокращения `success` / `error` / `info` / `warn`. Все возвращают `bool` — `True` только когда сообщение было доставлено; пустой `bot_url` логирует предупреждение и возвращает `False`. Поле `instance` в оповещении по умолчанию равно публичному хосту узла (`APEX_NODE_HOST`) — префикс домена или узла не применяется.

## ctx.paths и ctx.node {#paths}

`ctx.paths`: `repo_root`, `commons`, `proprietaries`, `configs`, `compositions`, `core`, `tier1..3`, `stier1..3`, `root_tier1..3`. `ctx.node`: запись идентичности (`name`, `subnet`, `fqdn`, `host`) или `None` в checkout автономного commons. `ctx.vars()`: окружение шаблонов/compose (см. [Справочник: Переменные окружения](/apex/reference/environment)). `ctx.commons.run(args)`: делегирование затенённому действию commons — допустимо только в переопределяющем проприетарном модуле.

---

**См. также:**

- [Концепция: Контекст выполнения](/apex/concepts/execution-context)
- [Руководство: Разработка действий](/apex/guides/action-development)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
