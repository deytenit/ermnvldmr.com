---
title: "Создание узла (First Node)"
description: Практическое руководство по созданию вашего первого узла и подключению общих модулей.
weight: 25
---

**Цель:** Создать репозиторий конфигураций для вашей собственной инфраструктуры, подключить общие модули в качестве подмодуля (submodule) и запустить первый базовый узел.

## 1. Создание репозитория конфигураций

Ваша инфраструктура должна управляться из единого Git-репозитория. Этот репозиторий будет содержать конфигурации для всех ваших серверов (узлов).

{{% steps %}}

### Шаг 1: Инициализация репозитория

Создайте новую директорию и инициализируйте Git.

```bash
mkdir my-infrastructure
cd my-infrastructure
git init
```

### Шаг 2: Добавление общих модулей как подмодуля

Общие модули (`ermnvldmr.com-root-commons`) должны располагаться по пути `.operator/shared`.

```bash
mkdir -p .operator
git submodule add https://github.com/deytenit/ermnvldmr.com-root-commons.git .operator/shared
```

### Шаг 3: Создание загрузочного скрипта (Bootstrap)

Создайте файл `init.sh` в корне вашего репозитория. Этот скрипт свяжет общие модули с вашим локальным окружением.

```bash filename="init.sh"
#!/usr/bin/env bash
# init.sh

# Загрузка общих утилит из подмодуля
source "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)/.operator/shared/scripts/lib/common.sh"

SCRIPT_NAME="init"

navigate_to_repo_root

log_info "Настройка Git hooks..."
git config core.hooksPath .operator/shared/githooks
git config --global --add safe.directory "${REPO_ROOT}"

log_info "Настройка PATH для диспетчера root..."
ABSOLUTE_RUN_DIR="$(realpath "${REPO_ROOT}/.operator/shared/scripts/run")"
BASHRC_ENTRY="export PATH=\"${ABSOLUTE_RUN_DIR}:\$PATH\""

sed -i '/\.operator\/shared\/scripts\/run/d' ~/.bashrc
echo "$BASHRC_ENTRY" >> ~/.bashrc
log_info "Готово. Выполните 'source ~/.bashrc' или перезайдите в терминал."
```

Сделайте его исполняемым:
```bash
chmod +x init.sh
```

{{% /steps %}}

## 2. Определение вашего первого узла

Узел (Node) — это папка в корне репозитория, которая представляет один физический или виртуальный сервер.

### Структура узла

Давайте создадим узел с именем `daedalus`. Внутри него мы определим конфигурацию оператора (например, для резервного копирования) и базовый сервис.

```bash
mkdir -p daedalus/.operator/configs/{cron,crowdsec,systemd,ufw/docker,ufw/host}
mkdir -p daedalus/root
```

### Базовые настройки (Опционально)

Вы можете добавить файлы конфигурации (например, правила UFW или crontab) в директорию `daedalus/.operator/configs/`. Например, простой crontab:

```bash filename="daedalus/.operator/configs/cron/crontab.template"
# Запуск резервного копирования каждую ночь в 3:00
0 3 * * * root sync tiers daedalus
```

## 3. Настройка сервисов (Docker Compose)

Фреймворк опирается на `docker-compose.yml`.

### Инфраструктурный уровень (Узел оператора)

Файл `daedalus/docker-compose.yml` запускает инфраструктурные утилиты, такие как `restic` для бекапов или VPN-агенты. Этот compose-файл имеет прямой доступ к файловой системе через монтирование директорий `@tierX`.

```yaml filename="daedalus/docker-compose.yml"
name: 'operator'

services:
  restic:
    image: restic/restic:0.18.1
    container_name: operator-restic
    volumes:
      # Пример: монтирование данных для резервного копирования (Только для чтения)
      - ./@tier2/my-app/data:/data/@tier2/my-app/data:ro
      - ./@tier3/.operator/restic/cache:/var/restic-cache
    environment:
      RESTIC_REPOSITORY: "s3:example.com/my-bucket/daedalus"
      RESTIC_PASSWORD: "${RESTIC_PASSWORD?error}"
      # Данные AWS...
    network_mode: "host"
    entrypoint: [ "restic" ]
```

### Корневой уровень (Root)

Проект `root` обычно содержит обратные прокси (Traefik) и сервисы, к которым обращаются другие проекты.

```yaml filename="daedalus/root/docker-compose.yml"
name: root

services:
  socket-proxy:
    image: tecnativa/docker-socket-proxy:0
    container_name: root-socket-proxy
    user: "0:0"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      CONTAINERS: 1
      SERVICES: 1
      TASKS: 1
    networks:
      socket: {}
    restart: unless-stopped

  traefik:
    image: traefik:3.6
    container_name: root-traefik
    # UID и GID подставляются автоматически фреймворком после команды 'root tiers useradd'
    user: "${UID?error}:${GID?error}"
    group_add:
      - "${SHARED_GID?error}"
    depends_on:
      - socket-proxy
    volumes:
      - ./@tier1/shared/root/traefik/letsencrypt:/letsencrypt
      - ./@tier3/traefik/logs:/logs
      - ./@tier1/traefik/dynamic:/etc/traefik/dynamic:ro
    ports:
      - '0.0.0.0:80:80'
      - '0.0.0.0:443:443'
    networks:
      proxy: {}
      socket: {}
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.network=root-proxy"
      - "--providers.docker.endpoint=tcp://root-socket-proxy:2375"
    restart: unless-stopped

networks:
  proxy:
    name: root-proxy
    internal: true
    driver: bridge
  socket:
    name: root-socket
    internal: true
    driver: bridge
```

## 4. Развертывание

Теперь, когда структура создана:

1. Закоммитьте и отправьте (push) этот репозиторий на ваш Git-сервер (например, GitHub).
2. Зайдите на ваш VPS.
3. Следуйте руководству по [Установке (Installation)](/root/guides/installation), используя URL вашего нового репозитория.

---

**См. также:**

- [Руководство: Установка на новый хост](/root/guides/installation)
- [Концепция: Архитектура инфраструктуры](/root/concepts/architecture)
