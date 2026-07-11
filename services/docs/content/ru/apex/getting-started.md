---
title: Начало работы с узлом apex
description: Начальная настройка репозитория узла и перевод хоста под управление apex.
weight: 5
---

Это краткое руководство проведёт новый хост от склонированного репозитория [узла](/apex/glossary#node) до работающего стека сервисов. Предполагается, что репозиторий узла уже существует — чтобы собрать его с нуля, см. [Руководство: Сборка репозитория узла](/apex/guides/node-repository).

## Предварительные требования

- Хост на базе Debian. Подойдёт любой FQDN — [идентичность узла](/apex/glossary#node-identity) объявляется явно в `node.env` (`APEX_NODE_FQDN`, `APEX_NODE_HOST`, `APEX_SUBNET`), а не выводится из обязательного формата имени хоста.
- `git` и Python 3 — [движок](/apex/glossary#engine) использует только стандартную библиотеку; `pip` никогда не требуется.
- Docker с Compose версии v2.20 или новее ([базовая композиция](/apex/glossary#core-composition) подключается через директиву `include:`).
- Пользователь для входа с возможностью sudo.
- Три места хранения для [уровней](/apex/glossary#tier) (например, три точки монтирования).

## Начальная настройка

{{% steps %}}

### Склонируйте репозиторий узла

```bash
git clone --recurse-submodules git@github.com:<owner>/<node-repo>.git
cd <node-repo>
./init.sh
source ~/.bashrc
```

`init.sh` инициализирует субмодуль `commons/`, указывает `core.hooksPath` на `commons/githooks`, помечает чекаут как `safe.directory` и добавляет `commons/` в начало `PATH` — лаунчер находится в `commons/apex`.

### Проверьте обнаружение действий

```bash
apex --help
```

В списке отображается каждое действие [commons](/apex/glossary#commons) плюс любые локальные [проприетарные модули](/apex/glossary#proprietaries) узла с меткой `(local)`. Когда в `node.env` отсутствует `APEX_NODE_FQDN`, движок выводит предупреждение и откатывается к имени хоста ОС — безобидно на рабочей станции, но на самом узле задайте `APEX_NODE_FQDN` явно. (`APEX_SUBNET` обязателен: если он отсутствует, движок завершается с кодом `66`.)

### Свяжите уровни хранилища

```bash
apex tiers/link <tier1-path> <tier2-path> <tier3-path>
```

Создаёт ссылки `compositions/@tierN` уровня узла, директории уровней и ссылки `@tierN` для каждого проекта, области `shared/` и символьную ссылку `.env` каждого проекта в уровень 1. Успех завершается сообщением `@tier setup completed.`

### Заведите пользователей проектов

```bash
apex tiers/useradd
apex tiers/chown
```

`tiers/useradd` создаёт по одному системному пользователю `noroot-<project>` на каждую композицию плюс группу `noroot-shared`, а также добавляет `APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` в `.env` каждого проекта. Затем `tiers/chown` применяет матрицу владения (см. [Концепция: Многоуровневое хранилище](/apex/concepts/tiered-storage)) и завершается сообщением `Permissions applied.`

### Заполните базовые секреты

Отредактируйте `compositions/apex/.env` (символьная ссылка в хранилище уровня 1, никогда не коммитится), указав ключи, задокументированные в файле `SECRETS.md` репозитория узла:

```ini {filename="compositions/apex/.env"}
APEX_RESTIC_PASSWORD=...
APEX_RESTIC_AWS_ACCESS_KEY_ID=...
APEX_RESTIC_AWS_SECRET_ACCESS_KEY=...
APEX_TRAEFIK_CF_DNS_API_TOKEN=...
APEX_TRAEFIK_ACME_EMAIL=...
APEX_OBS_BASIC_AUTH_PASS=...   # только когда включён профиль наблюдаемости alloy
```

`APEX_UID`/`APEX_GID`/`APEX_SHARED_GID` уже присутствуют — `tiers/useradd` поддерживает их между комментариями-маркерами. Несекретные скалярные значения (`APEX_RESTIC_REPOSITORY`, push-URL-ы, `COMPOSE_PROFILES`, `TZ`, …) хранятся в коммитируемом `compositions/apex/apex.env` — см. [Руководство: Сборка репозитория узла](/apex/guides/node-repository).

### Настройте хост

```bash
apex configure
```

Запускает каждое действие `configure/*` в фиксированном порядке: `base`, `ufw`, `crowdsec`, `cron`, `systemd`, `routing`. Каждый шаг можно вызвать и по отдельности; некоторые принимают `--dry-run`. См. [Руководство: Эксплуатация узла](/apex/guides/host-operations).

### Поднимите стек

```bash
apex compose up
```

Сначала поднимается базовая композиция (она владеет сетями), затем каждая композиция сервиса в алфавитном порядке.

{{% /steps %}}

## Проверка

- `apex --help` выводит список действий без предупреждений на работающем хосте.
- `docker ps` показывает базовые контейнеры (`apex-traefik`, `apex-socket-proxy` плюс любые сервисы, включённые профилями) и якорь каждого проекта.
- `apex utils/lint-docker-compose` сообщает `Anchor IP validation passed.`

---

**См. также:**

- [Руководство: Сборка репозитория узла](/apex/guides/node-repository)
- [Концепция: Архитектура фреймворка](/apex/concepts/architecture)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
