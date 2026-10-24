---
title: Добавление композиции сервисов
description: "Подключите новый проект к узлу: якорный IP, сети, уровни и линтинг."
weight: 23
---

**Контекст:** проект подключается к&nbsp;[узлу](/apex/glossary#node) в&nbsp;виде отдельного каталога в&nbsp;`compositions/` со&nbsp;своим compose-файлом. Требования фреймворка к&nbsp;этому файлу минимальны: статический [якорный IP](/apex/glossary#anchor-ip) в&nbsp;сети `direct`, подключение к&nbsp;внешним сетям по&nbsp;имени и&nbsp;пути к&nbsp;данным относительно уровней хранения.

{{% steps %}}

### Выделите якорный адрес

Выберите следующий свободный адрес `.20` или выше в&nbsp;подсети узла и&nbsp;зафиксируйте его в&nbsp;`compositions/ADDRESSING.md`. Диапазон `.10`–`.19` зарезервирован для&nbsp;[базовой композиции](/apex/glossary#core-composition) (см. [Concept: Fleet addressing scheme](/apex/concepts/addressing)).

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
        ipv4_address: 198.18.16.20
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

- **Один якорь на&nbsp;проект**: контейнер-якорь получает постоянный `ipv4_address` в&nbsp;сети `direct`, а&nbsp;вспомогательные sidecar-контейнеры используют его сетевой стек через `network_mode: service:<anchor>`.
- **Внешние сети подключаются по&nbsp;имени**: для&nbsp;сетей `direct`, `enclave` и&nbsp;`socket` указывается `external: true`, поскольку они объявляются в&nbsp;базовой композиции.
- **Публикация через `enclave` и&nbsp;метки Traefik**: подключение к&nbsp;сети `enclave` вместе с&nbsp;метками маршрутизации открывает сервис через граничный прокси. Прокси связывается с&nbsp;ним через socket-прокси, без&nbsp;проброса портов наружу.
- **Пути к&nbsp;данным привязаны к&nbsp;уровням**: пути вида `./@tierN/...` разрешаются через символические ссылки, которые создаёт действие `tiers/link`.
- **Резервное копирование настраивается метками `restic.*`**: действие `apex backup/run` запускает утилиту [resticontainer](https://github.com/deytenit/resticontainer). Сервис помечается меткой `restic.enable=true`, а&nbsp;пути монтирования для&nbsp;бэкапа перечисляются в&nbsp;`restic.backup.paths=<container-path>` (resticontainer сопоставляет их с&nbsp;путями на&nbsp;хосте). Сервисы без&nbsp;этих меток игнорируются. Сохраняйте только восстановимые данные и&nbsp;конфигурацию.
- **Идентификаторы UID и&nbsp;GID**: переменные `${APEX_UID...}` берутся из&nbsp;файла `.env` проекта, который формирует действие `tiers/useradd`.

### Настройте хранилище и&nbsp;права доступа

```bash
apex tiers/link <tier1> <tier2> <tier3>
apex tiers/useradd
apex tiers/chown
```

Повторный запуск этих команд идемпотентен: движок находит новый проект, создаёт для&nbsp;него каталоги хранения и&nbsp;файл `.env`, заводит системного пользователя `noroot-<project>` и&nbsp;выставляет права доступа.

### Проверьте конфигурацию

```bash
apex utils/lint-docker-compose
```

Действие проверяет корректность, уникальность и&nbsp;принадлежность подсети для&nbsp;каждого якорного IP, после чего запускает проверку compose-файлов по&nbsp;всему репозиторию. Тот&nbsp;же линтинг автоматически выполняется хуком pre-commit для&nbsp;всех подготовленных к&nbsp;коммиту файлов.

### Разверните сервисы

```bash
apex compose up
```

Базовая композиция уже работает, поэтому новый проект запустится в&nbsp;порядке своей очереди по&nbsp;алфавиту. Проверьте статус контейнеров через `docker ps`, а&nbsp;доступность маршрута&nbsp;— через граничный прокси.

{{% /steps %}}

## Заметки

- Секретные данные проекта (например, пароль к&nbsp;базе данных) хранятся в&nbsp;собственном `.env` на&nbsp;уровне 1&nbsp;(@tier1), рядом с&nbsp;автоматически сгенерированным блоком UID.
- Не&nbsp;объявляйте сети `direct`, `enclave` и&nbsp;`socket` заново внутри файла проекта: дублирование определений приведёт к&nbsp;конфликту с&nbsp;базовой композицией за&nbsp;управление сетью.

---

**См.&nbsp;также:**

- [Concept: Compositions and the shared core](/apex/concepts/compositions)
- [Concept: Tiered storage and privilege isolation](/apex/concepts/tiered-storage)
- [Concept: Fleet addressing scheme](/apex/concepts/addressing)
