---
title: Сборка репозитория узла
description: Соберите четыре опоры, зафиксируйте commons и подключите поток capture-up.
weight: 21
---

**Контекст:** у каждого [узла](/apex/glossary#node) — ровно один репозиторий. Название репозитория может быть любым: [идентичность](/apex/glossary#node-identity) задаётся явно в файле `node.env`, поэтому имя репозитория служит лишь удобным обозначением. В этом руководстве мы пошагово соберём такой репозиторий с нуля.

{{% steps %}}

### Инициализируйте репозиторий и зафиксируйте commons

```bash
git init <node-repo> && cd <node-repo>
git submodule add <commons-url> commons
( cd commons && git fetch --tags && git checkout <release-tag> )
git add .gitmodules commons
mkdir -p proprietaries/actions proprietaries/lib configs compositions/apex .github/workflows
```

Ссылка gitlink фиксирует точную версию движка, на которой работает узел. Чтобы обновить движок в будущем, достаточно переключиться на новый тег внутри каталога `commons/` и закоммитить смещение указателя.

### Объявите идентичность

```ini {filename="node.env"}
APEX_NODE_FQDN=node1.example.com
APEX_NODE_HOST=node1.example.com
APEX_SUBNET=198.18.16.0/24
APEX_GIT_AUTHOR_NAME=apex [bot]
APEX_GIT_AUTHOR_EMAIL=apex@localhost
```

Файл `node.env` явно задаёт параметры идентификации узла (доменная зона не подразумевается заранее):

- `APEX_NODE_FQDN` — FQDN хоста для маршрутизации Traefik по правилу `Host()` (если не указан, движок выведет предупреждение и возьмёт имя хоста из ОС).
- `APEX_NODE_HOST` — публичный адрес хоста для параметра `--host` резервного копирования и метки `instance` в системе мониторинга и уведомлениях (по умолчанию совпадает с `APEX_NODE_FQDN`). Первая часть FQDN до точки используется как короткое имя (`name`) узла.
- `APEX_SUBNET` — выделенная подсеть /24 для внутренней сети `direct`. Параметр **обязателен**: без него запуск завершится с кодом 66 (см. [Concept: Fleet addressing scheme](/apex/concepts/addressing)).
- `APEX_GIT_AUTHOR_NAME` и `APEX_GIT_AUTHOR_EMAIL` — имя и почта сервисного бота capture-up (если не заданы, применяются значения по умолчанию).

### Напишите базовую обёртку и файлы переменных окружения

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

Файл `apex.env` хранит только публичные параметры конфигурации, которые безопасно коммитить в репозиторий. Переменная `COMPOSE_PROFILES` определяет набор опциональных базовых сервисов: `adguard`, `xray`, `alloy` (агент сбора метрик и логов) и `manual` (разовые запуски бэкапа); список может быть пустым.

Все секреты, которые нельзя хранить в Git, задокументируйте в `compositions/apex/SECRETS.md`. Это поможет при развёртывании нового узла заполнить локальный файл `.env`: пароль `APEX_RESTIC_PASSWORD`, ключи доступа к S3, токен `APEX_TRAEFIK_CF_DNS_API_TOKEN`, почту `APEX_TRAEFIK_ACME_EMAIL`, а также `APEX_OBS_BASIC_AUTH_PASS` (если включён мониторинг).

### Настройте правила игнорирования для Git

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

Скрипт `init.sh` подготавливает свежий клон репозитория на хосте: выполняет `git submodule update --init --recursive`, настраивает хуки `git config core.hooksPath commons/githooks`, добавляет репозиторий в доверенные (`git config --global --add safe.directory <repo>`) и прописывает `<repo>/commons` в переменную `PATH` командной оболочки, чтобы утилита `apex` была доступна глобально. Не забудьте выставить флаг исполняемого файла: `chmod +x init.sh`.

### Заведите реестр адресации

Создайте файл `compositions/ADDRESSING.md` с подсетью узла (`APEX_SUBNET`) и схемой распределения адресов: диапазоны `.10`–`.19` зарезервированы за базовыми сервисами (core), а `.20` и выше выделяются под проекты. Все назначаемые в будущем [якорные IP](/apex/glossary#anchor-ip) фиксируются в этом документе.

### Подключите CI capture-up

Настройте периодический CI-workflow, который автоматически вливает ветку `sync/<node>` в `main` (если ветка существует) с авторством бота. Шаг checkout должен выполняться **без** загрузки подмодулей: слияние только сдвигает указатель `commons`, а SSH-ссылка на подмодуль недоступна по стандартному CI-токену. Полный цикл описан в разделе [Concept: Framework architecture](/apex/concepts/architecture) ([capture-up](/apex/glossary#capture-up)).

### Проверьте работу

```bash
./commons/apex --help
```

В списке должны появиться все базовые действия из commons, а позже — и локальные действия из proprietaries. При запуске вне хоста (до заполнения `node.env`) появится предупреждение о том, что `APEX_NODE_FQDN` не задан: в этом случае движок подставит системное имя хоста. При этом переменная `APEX_SUBNET` обязательно должна быть указана, иначе выполнение завершится с кодом 66. Закоммитьте подготовленный репозиторий в ветку `main`.

{{% /steps %}}

## Заметки

- Каталог `proprietaries/` изначально может быть пустым (сохраните структуру с помощью файлов `.gitkeep`): движок корректно работает без пользовательских переопределений.
- Переносите конфигурационные файлы хоста в `configs/` (`ufw/`, `cron/crontab`, `systemd/`, `crowdsec/`) по мере подключения шагов `configure/*`. Действия считывают шаблоны из `configs/` напрямую.

---

**См. также:**

- [Getting started with an apex node](/apex/getting-started)
- [Concept: Framework architecture](/apex/concepts/architecture)
- [Guide: Add a service composition](/apex/guides/service-composition)
