---
title: Сборка репозитория узла
description: Соберите четыре опоры, зафиксируйте commons и подключите поток capture-up.
weight: 21
---

**Контекст:** каждый [узел](/apex/glossary#node) получает ровно один репозиторий. Выбирайте любое имя репозитория — [идентичность](/apex/glossary#node-identity) объявляется явно в `node.env`, поэтому имя репозитория — это соглашение, а не функциональный ввод. Это руководство собирает такой репозиторий с нуля.

{{% steps %}}

### Инициализируйте репозиторий и зафиксируйте commons

```bash
git init <node-repo> && cd <node-repo>
git submodule add <commons-url> commons
( cd commons && git fetch --tags && git checkout <release-tag> )
git add .gitmodules commons
mkdir -p proprietaries/actions proprietaries/lib configs compositions/apex .github/workflows
```

Gitlink фиксирует точную версию движка, которую запускает узел. Обновление в дальнейшем означает checkout более нового тега внутри `commons/` и коммит перемещённого указателя.

### Объявите идентичность

```ini {filename="node.env"}
APEX_NODE_FQDN=node1.example.com
APEX_NODE_HOST=node1.example.com
APEX_SUBNET=198.18.16.0/24
APEX_GIT_AUTHOR_NAME=apex [bot]
APEX_GIT_AUTHOR_EMAIL=apex@localhost
```

`node.env` объявляет идентичность узла явно — не предполагается никакой формы домена. `APEX_NODE_FQDN` — это реальный FQDN, используемый для маршрутизации traefik по `Host()` (fallback: имя хоста ОС, с предупреждением). `APEX_NODE_HOST` — это публичное имя хоста, используемое для `--host` резервного копирования и метки `instance` наблюдаемости/уведомлений (по умолчанию: `APEX_NODE_FQDN`); короткое `name` узла — это его первая метка. `APEX_SUBNET` — это /24 узла для сети `direct` и является **обязательным** — отсутствующее значение приводит к выходу с кодом `66` (см. [Concept: Fleet addressing scheme](/apex/concepts/addressing)). `APEX_GIT_AUTHOR_NAME`/`APEX_GIT_AUTHOR_EMAIL` — это идентичность бота capture-up (общие значения по умолчанию, если не заданы).

### Напишите базовую обёртку и её env-файлы

```yaml {filename="compositions/apex/docker-compose.yml"}
name: apex
include:
  - ../../commons/compositions/apex/docker-compose.yml
```

```ini {filename="compositions/apex/apex.env"}
APEX_TRAEFIK_DIRECT_IP=198.18.16.10
APEX_RESTIC_REPOSITORY=s3:<endpoint>/<bucket>/<node>
COMPOSE_PROFILES=adguard,xray,alloy
# цели push-наблюдаемости (только когда включён профиль alloy)
APEX_PROM_PUSH_URL=https://<central-host>/api/v1/push
APEX_LOKI_PUSH_URL=https://<central-host>/loki/api/v1/push
APEX_OBS_BASIC_AUTH_USER=<node-user>
# опциональные скаляры со значениями compose по умолчанию:
# TZ=Etc/UTC
# APEX_RESTIC_COMPRESSION=max
# APEX_RESTIC_AWS_REGION=us-east-1        # задайте для любого не-AWS S3-хранилища
# APEX_RESTIC_AWS_ENDPOINT=                # напр., URL S3-совместимого эндпоинта
```

`apex.env` содержит только коммитируемые несекретные скаляры. `COMPOSE_PROFILES` выбирает, какие опциональные базовые сервисы запускает этот узел — `adguard`, `xray`, `alloy` (агент push-наблюдаемости) и `manual` (одноразовые резервные копии) — и может быть пустым. Задокументируйте некоммитируемые секретные ключи в `compositions/apex/SECRETS.md`, чтобы оператор на свежем хосте знал, что заполнить в `.env` (`APEX_RESTIC_PASSWORD`, ключи доступа S3, `APEX_TRAEFIK_CF_DNS_API_TOKEN`, `APEX_TRAEFIK_ACME_EMAIL` и `APEX_OBS_BASIC_AUTH_PASS`, когда наблюдаемость включена).

### Игнорируйте то, чему никогда не место в git

```gitignore {filename=".gitignore"}
**/@tier1
**/@tier2
**/@tier3
**/.env
!compositions/apex/apex.env
__pycache__/
*.pyc
```

### Добавьте bootstrap-скрипт

`init.sh` подготавливает свежий клон на хосте: `git submodule update --init --recursive`, `git config core.hooksPath commons/githooks`, `git config --global --add safe.directory <repo>` и добавляет `<repo>/commons` в начало `PATH` в login-shell, чтобы `apex` разрешался. Пометьте его исполняемым.

### Заведите реестр адресации

Создайте `compositions/ADDRESSING.md` с подсетью узла (`APEX_SUBNET`) и зарезервированными диапазонами (`.10`–`.19` — core, `.20`+ — сервисы). Каждый [якорный IP](/apex/glossary#anchor-ip), выделяемый позднее, записывается здесь.

### Подключите CI capture-up

Добавьте плановый workflow, который сливает `sync/<node>` в `main`, когда ветка существует, коммитя под идентичностью бота. Выполняйте checkout **без** сабмодулей — слияние лишь перемещает указатель commons, а submodule-URL по SSH не извлекается с CI-токеном по умолчанию. См. [Concept: Framework architecture](/apex/concepts/architecture) для полного цикла [capture-up](/apex/glossary#capture-up).

### Проверьте

```bash
./commons/apex --help
```

В списке должно отображаться каждое действие из commons (плюс ваши proprietaries, после их добавления). Вне хоста — до заполнения `node.env` — ожидайте безобидное предупреждение о том, что `APEX_NODE_FQDN` не задан (движок откатывается к имени хоста ОС); `APEX_SUBNET` при этом всё равно должен быть задан, иначе движок завершится с кодом `66`. Закоммитьте собранный репозиторий в `main`.

{{% /steps %}}

## Заметки

- Опора `proprietaries/` может начинаться пустой (сохраняйте её присутствие с помощью файлов `.gitkeep`); движок корректно обрабатывает отсутствующий оверлей.
- Переносите источники конфигурации хоста в `configs/` (`ufw/`, `cron/crontab`, `systemd/`, `crowdsec/`) по мере того как узел принимает каждый шаг `configure/*` — действия потребляют `configs/` дословно через слой шаблонов.

---

**См. также:**

- [Getting started with an apex node](/apex/getting-started)
- [Concept: Framework architecture](/apex/concepts/architecture)
- [Guide: Add a service composition](/apex/guides/service-composition)
