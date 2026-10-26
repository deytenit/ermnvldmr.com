---
title: Добавление композиции сервисов
description: "Подключите новый проект к узлу: якорный IP, сети, уровни и линтинг."
weight: 23
---

**Контекст:** проект подключается к [узлу](/apex/glossary#node) в виде отдельного каталога в `compositions/` со своим compose-файлом. Требования фреймворка к этому файлу минимальны: статический [якорный IP](/apex/glossary#anchor-ip) в сети `direct`, подключение к внешним сетям по имени и пути к данным относительно уровней хранения.

{{% steps %}}

### Выделите якорный адрес

Выберите следующий свободный адрес `.20` или выше в подсети узла и зафиксируйте его в `compositions/ADDRESSING.md`. Диапазон `.10`–`.19` зарезервирован для [базовой композиции](/apex/glossary#core-composition) (см. [Concept: Fleet addressing scheme](/apex/concepts/addressing)).

### Напишите файл compose

```yaml {filename="compositions/<project>/docker-compose.yml"}
name: <project>
services:
  <anchor>:
    image: ...
    container_name: <project>-<anchor>
    user: "${APEX_UID?error}:${APEX_GID?error}"
    group_add:
      - "${APEX_SHARED_GID?error}"
    volumes:
      - ./@tier1/<anchor>/config:/config
      - ./@tier2/<anchor>/data:/data
    networks:
      direct:
        ipv4_address: 198.18.0.20
      enclave: {}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.<project>.rule=Host(`...`)"
      - "traefik.http.services.<project>.loadbalancer.server.port=8080"
      # намерение резервного копирования (resticontainer, определяется из меток restic.*)
      - "restic.enable=true"
      - "restic.backup.paths=/config"
    restart: unless-stopped

  <sidecar>:
    image: ...
    network_mode: "service:<anchor>"

networks:
  direct:
    external: true
  enclave:
    external: true
```

Применяемые соглашения:

- **Один якорь на проект**: контейнер-якорь получает постоянный `ipv4_address` в сети `direct`, а вспомогательные sidecar-контейнеры используют его сетевой стек через `network_mode: service:<anchor>`.
- **Внешние сети подключаются по имени**: для сетей `direct`, `enclave` и `socket` указывается `external: true`, поскольку они объявляются в базовой композиции.
- **Публикация через `enclave` и метки Traefik**: подключение к сети `enclave` вместе с метками маршрутизации открывает сервис через граничный прокси. Прокси связывается с ним через socket-прокси, без проброса портов наружу.
- **Пути к данным привязаны к уровням**: пути вида `./@tierN/...` разрешаются через символические ссылки, которые создаёт действие `tiers/link`.
- **Резервное копирование настраивается метками `restic.*`**: действие `apex backup/run` запускает утилиту [resticontainer](https://github.com/deytenit/resticontainer). Сервис помечается меткой `restic.enable=true`, а пути монтирования для бэкапа перечисляются в `restic.backup.paths=<container-path>` (resticontainer сопоставляет их с путями на хосте). Сервисы без этих меток игнорируются. Сохраняйте только восстановимые данные и конфигурацию.
- **Идентификаторы UID и GID**: переменные `${APEX_UID...}` берутся из файла `.env` проекта, который формирует действие `tiers/useradd`.

### Настройте хранилище и права доступа

```bash
apex tiers/link <tier1> <tier2> <tier3>
apex tiers/useradd
apex tiers/chown
```

Повторный запуск этих команд идемпотентен: движок находит новый проект, создаёт для него каталоги хранения и файл `.env`, заводит системного пользователя `noroot-<project>` и выставляет права доступа.

### Проверьте конфигурацию

```bash
apex utils/lint-docker-compose
```

Действие проверяет корректность, уникальность и принадлежность подсети для каждого якорного IP, после чего запускает проверку compose-файлов по всему репозиторию. Тот же линтинг автоматически выполняется хуком pre-commit для всех подготовленных к коммиту файлов.

### Разверните сервисы

```bash
apex compose up
```

Базовая композиция уже работает, поэтому новый проект запустится в порядке своей очереди по алфавиту. Проверьте статус контейнеров через `docker ps`, а доступность маршрута — через граничный прокси.

{{% /steps %}}

## Заметки

- Секретные данные проекта (например, пароль к базе данных) хранятся в собственном `.env` на уровне 1 (@tier1), рядом с автоматически сгенерированным блоком UID.
- Не объявляйте сети `direct`, `enclave` и `socket` заново внутри файла проекта: дублирование определений приведёт к конфликту с базовой композицией за управление сетью.

---

**См. также:**

- [Concept: Compositions and the shared core](/apex/concepts/compositions)
- [Concept: Tiered storage and privilege isolation](/apex/concepts/tiered-storage)
- [Concept: Fleet addressing scheme](/apex/concepts/addressing)
