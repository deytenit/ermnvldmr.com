---
title: Начало работы с узлом apex
description: Начальная настройка репозитория узла и перевод хоста под управление apex.
weight: 5
---

В этом руководстве показано, как настроить новый хост: от клонирования репозитория [узла](/apex/glossary#node) до запуска рабочего стека сервисов. Предполагается, что репозиторий узла уже создан; если его нужно собрать с нуля, см. [Руководство: Сборка репозитория узла](/apex/guides/node-repository).

## Предварительные требования

- Хост на базе Debian. Подойдёт любой FQDN: [идентичность узла](/apex/glossary#node-identity) задаётся явно в `node.env` (`APEX_NODE_FQDN`, `APEX_NODE_HOST`, `APEX_SUBNET`), а не выводится из имени хоста.
- `git` и Python 3 — [движок](/apex/glossary#engine) использует только стандартную библиотеку, `pip` не нужен.
- Docker с Compose версии 2.20 или новее ([базовая композиция](/apex/glossary#core-composition) подключается через директиву `include:`).
- Учётная запись с правами sudo для входа на хост.
- Три хранилища под [уровни](/apex/glossary#tier) (например, три точки монтирования).

## Начальная настройка

{{% steps %}}

### Склонируйте репозиторий узла

```bash
git clone --recurse-submodules git@github.com:<owner>/<node-repo>.git
cd <node-repo>
./init.sh
source ~/.bashrc
```

Скрипт `init.sh` инициализирует субмодуль `commons/`, настраивает `core.hooksPath` на `commons/githooks`, помечает чекаут как `safe.directory` и добавляет `commons/` в начало `PATH` (лаунчер находится в `commons/apex`).

### Проверьте обнаружение действий

```bash
apex --help
```

В списке отображается каждое действие [commons](/apex/glossary#commons) плюс любые локальные [проприетарные модули](/apex/glossary#proprietaries) узла с меткой `(local)`. Если в `node.env` не задан `APEX_NODE_FQDN`, движок выводит предупреждение и использует имя хоста ОС. На рабочей станции это безобидно, но на самом узле задайте `APEX_NODE_FQDN` явно. Параметр `APEX_SUBNET` обязателен: без него движок завершит работу с кодом `66`.

### Свяжите уровни хранилища

```bash
apex tiers/link <tier1-path> <tier2-path> <tier3-path>
```

Команда создаёт ссылки `compositions/@tierN` на уровне узла, каталоги уровней и ссылки `@tierN` для каждого проекта, а также области `shared/`. При успешном выполнении выводится сообщение `@tier setup completed.`.

### Заведите пользователей проектов

```bash
apex tiers/useradd
apex tiers/chown
```

Команда `tiers/useradd` создаёт по одному системному пользователю `noroot-<project>` для каждой композиции и общую группу `noroot-shared`, а также прописывает `APEX_UID`, `APEX_GID` и `APEX_SHARED_GID` в `.env` каждого проекта. Затем `tiers/chown` выставляет права по матрице владения (см. [Концепция: Многоуровневое хранилище](/apex/concepts/tiered-storage)) и выводит сообщение `Permissions applied.`.

### Доставьте секреты и окружение

Доставьте расшифрованные файлы `.env` с рабочей станции скриптом `scripts/secrets` или заполните `compositions/apex/.env` напрямую:

```ini {filename="compositions/apex/.env"}
COMPOSE_PROFILES=adguard,xray,alloy
APEX_TRAEFIK_DIRECT_IP=198.18.0.10
APEX_RESTIC_REPOSITORY=s3:<endpoint>/<bucket>/<node>
APEX_RESTIC_PASSWORD=...
APEX_RESTIC_AWS_ACCESS_KEY_ID=...
APEX_RESTIC_AWS_SECRET_ACCESS_KEY=...
APEX_TRAEFIK_CF_DNS_API_TOKEN=...
APEX_TRAEFIK_ACME_EMAIL=...
APEX_OBS_BASIC_AUTH_PASS=...   # только когда включён профиль наблюдаемости alloy
```

Секреты и конфигурационные параметры хранятся вместе в `.env` (в Git они версионируются зашифрованными в виде `.enc.env`). Запустите `apex config/env --sync`, чтобы добавить синтезированные переменные узла в управляемый блок.

### Настройте хост

```bash
apex configure
```

Команда запускает все действия `configure/*` в строгом порядке: `base`, `ufw`, `crowdsec`, `cron`, `systemd`, `routing`. Каждый шаг можно выполнить и отдельно; некоторые из них поддерживают флаг `--dry-run` (см. [Руководство: Эксплуатация узла](/apex/guides/host-operations)).

### Поднимите стек

```bash
apex compose up
```

Сначала запускается базовая композиция (она создаёт общие сети), затем — композиции отдельных сервисов в алфавитном порядке.

{{% /steps %}}

## Проверка

- `apex --help` выводит список действий без предупреждений на работающем хосте.
- `docker ps` показывает базовые контейнеры (`apex-traefik`, `apex-socket-proxy` и дополнительные сервисы активных профилей), а также якорный контейнер каждого проекта.
- `apex utils/lint-docker-compose` завершается сообщением `Anchor IP validation passed.`.

---

**См. также:**

- [Руководство: Сборка репозитория узла](/apex/guides/node-repository)
- [Концепция: Архитектура фреймворка](/apex/concepts/architecture)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
