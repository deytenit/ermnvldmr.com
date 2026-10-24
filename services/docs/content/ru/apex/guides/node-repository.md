---
title: Сборка репозитория узла
description: Соберите четыре опоры, зафиксируйте commons и подключите поток capture-up.
weight: 21
---

**Контекст:** у&nbsp;каждого [узла](/apex/glossary#node)&nbsp;— ровно один репозиторий. Название репозитория может быть любым: [идентичность](/apex/glossary#node-identity) задаётся явно в&nbsp;файле `node.env`, поэтому имя репозитория служит лишь удобным обозначением. В&nbsp;этом руководстве мы пошагово соберём такой репозиторий с&nbsp;нуля.

{{% steps %}}

### Инициализируйте репозиторий и&nbsp;зафиксируйте commons

```bash
git init <node-repo> && cd <node-repo>
git submodule add <commons-url> commons
( cd commons && git fetch --tags && git checkout <release-tag> )
git add .gitmodules commons
mkdir -p proprietaries/actions proprietaries/lib configs compositions/apex .github/workflows
```

Ссылка gitlink фиксирует точную версию движка, на&nbsp;которой работает узел. Чтобы обновить движок в&nbsp;будущем, достаточно переключиться на&nbsp;новый тег внутри каталога `commons/` и&nbsp;закоммитить смещение указателя.

### Объявите идентичность

```ini {filename="node.env"}
APEX_NODE_FQDN=node1.example.com
APEX_NODE_HOST=node1.example.com
APEX_SUBNET=198.18.16.0/24
APEX_GIT_AUTHOR_NAME=apex [bot]
APEX_GIT_AUTHOR_EMAIL=apex@localhost
```

Файл `node.env` явно задаёт параметры идентификации узла (доменная зона не&nbsp;подразумевается заранее):

- `APEX_NODE_FQDN`&nbsp;— FQDN хоста для&nbsp;маршрутизации Traefik по&nbsp;правилу `Host()` (если не&nbsp;указан, движок выведет предупреждение и&nbsp;возьмёт имя хоста из&nbsp;ОС).
- `APEX_NODE_HOST`&nbsp;— публичный адрес хоста для&nbsp;параметра `--host` резервного копирования и&nbsp;метки `instance` в&nbsp;системе мониторинга и&nbsp;уведомлениях (по&nbsp;умолчанию совпадает с&nbsp;`APEX_NODE_FQDN`). Первая часть FQDN до&nbsp;точки используется как короткое имя (`name`) узла.
- `APEX_SUBNET`&nbsp;— выделенная подсеть /24 для&nbsp;внутренней сети `direct`. Параметр **обязателен**: без&nbsp;него запуск завершится с&nbsp;кодом&nbsp;66 (см. [Concept: Fleet addressing scheme](/apex/concepts/addressing)).
- `APEX_GIT_AUTHOR_NAME` и&nbsp;`APEX_GIT_AUTHOR_EMAIL`&nbsp;— имя и&nbsp;почта сервисного бота capture-up (если не&nbsp;заданы, применяются значения по&nbsp;умолчанию).

### Напишите базовую обёртку и&nbsp;файлы переменных окружения

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

Файл `apex.env` хранит только публичные параметры конфигурации, которые безопасно коммитить в&nbsp;репозиторий. Переменная `COMPOSE_PROFILES` определяет набор опциональных базовых сервисов: `adguard`, `xray`, `alloy` (агент сбора метрик и&nbsp;логов) и&nbsp;`manual` (разовые запуски бэкапа); список может быть пустым.

Все секреты, которые нельзя хранить в&nbsp;Git, задокументируйте в&nbsp;`compositions/apex/SECRETS.md`. Это поможет при&nbsp;развёртывании нового узла заполнить локальный файл `.env`: пароль `APEX_RESTIC_PASSWORD`, ключи доступа к&nbsp;S3, токен `APEX_TRAEFIK_CF_DNS_API_TOKEN`, почту `APEX_TRAEFIK_ACME_EMAIL`, а&nbsp;также `APEX_OBS_BASIC_AUTH_PASS` (если включён мониторинг).

### Настройте правила игнорирования для&nbsp;Git

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

Скрипт `init.sh` подготавливает свежий клон репозитория на&nbsp;хосте: выполняет `git submodule update --init --recursive`, настраивает хуки `git config core.hooksPath commons/githooks`, добавляет репозиторий в&nbsp;доверенные (`git config --global --add safe.directory <repo>`) и&nbsp;прописывает `<repo>/commons` в&nbsp;переменную `PATH` командной оболочки, чтобы утилита `apex` была доступна глобально. Не&nbsp;забудьте выставить флаг исполняемого файла: `chmod +x init.sh`.

### Заведите реестр адресации

Создайте файл `compositions/ADDRESSING.md` с&nbsp;подсетью узла (`APEX_SUBNET`) и&nbsp;схемой распределения адресов: диапазоны `.10`–`.19` зарезервированы за&nbsp;базовыми сервисами (core), а&nbsp;`.20` и&nbsp;выше выделяются под&nbsp;проекты. Все назначаемые в&nbsp;будущем [якорные IP](/apex/glossary#anchor-ip) фиксируются в&nbsp;этом документе.

### Подключите CI capture-up

Настройте периодический CI-workflow, который автоматически вливает ветку `sync/<node>` в&nbsp;`main` (если ветка существует) с&nbsp;авторством бота. Шаг checkout должен выполняться **без** загрузки подмодулей: слияние только сдвигает указатель `commons`, а&nbsp;SSH-ссылка на&nbsp;подмодуль недоступна по&nbsp;стандартному CI-токену. Полный цикл описан в&nbsp;разделе [Concept: Framework architecture](/apex/concepts/architecture) ([capture-up](/apex/glossary#capture-up)).

### Проверьте работу

```bash
./commons/apex --help
```

В&nbsp;списке должны появиться все базовые действия из&nbsp;commons, а&nbsp;позже&nbsp;— и&nbsp;локальные действия из&nbsp;proprietaries. При&nbsp;запуске вне хоста (до&nbsp;заполнения `node.env`) появится предупреждение о&nbsp;том, что `APEX_NODE_FQDN` не&nbsp;задан: в&nbsp;этом случае движок подставит системное имя хоста. При&nbsp;этом переменная `APEX_SUBNET` обязательно должна быть указана, иначе выполнение завершится с&nbsp;кодом&nbsp;66. Закоммитьте подготовленный репозиторий в&nbsp;ветку `main`.

{{% /steps %}}

## Заметки

- Каталог `proprietaries/` изначально может быть пустым (сохраните структуру с&nbsp;помощью файлов `.gitkeep`): движок корректно работает без&nbsp;пользовательских переопределений.
- Переносите конфигурационные файлы хоста в&nbsp;`configs/` (`ufw/`, `cron/crontab`, `systemd/`, `crowdsec/`) по&nbsp;мере подключения шагов `configure/*`. Действия считывают шаблоны из&nbsp;`configs/` напрямую.

---

**См.&nbsp;также:**

- [Getting started with an apex node](/apex/getting-started)
- [Concept: Framework architecture](/apex/concepts/architecture)
- [Guide: Add a service composition](/apex/guides/service-composition)
