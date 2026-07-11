---
title: Добавление композиции сервисов
description: "Подключите новый проект к узлу: якорный IP, сети, уровни и линтинг."
weight: 23
---

**Контекст:** проект присоединяется к [узлу](/apex/glossary#node) как один каталог в `compositions/`, содержащий написанный вручную файл compose. Контракт фреймворка для этого файла невелик: статический [якорный IP](/apex/glossary#anchor-ip) в сети `direct`, ссылки на внешние сети по ключу и пути к данным относительно уровней.

{{% steps %}}

### Выделите якорный адрес

Выберите следующий свободный адрес `.20` или выше в /24 узла и запишите его в `compositions/ADDRESSING.md`. Адреса `.10`–`.19` зарезервированы для [базовой композиции](/apex/glossary#core-composition) (см. [Concept: Fleet addressing scheme](/apex/concepts/addressing)).

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

- **Один якорь на проект** держит статический `ipv4_address` в `direct`; sidecar-контейнеры разделяют его сетевое пространство имён через `network_mode: service:<anchor>`.
- **На сети ссылаются по ключу** (`direct`, `enclave`, `socket`) с `external: true` — их определения принадлежат базовой композиции.
- **Членство в `enclave` плюс метки traefik** публикуют сервис через граничный прокси; прокси обнаруживает его через socket-прокси, никогда через опубликованные порты.
- **Пути к данным относительны уровням** (`./@tierN/...`) и разрешаются через симлинки, создаваемые `tiers/link`.
- **Резервное копирование включается по выбору через метки `restic.*`.** `apex backup/run` управляет [resticontainer](https://github.com/deytenit/resticontainer), который определяет, что снимать, из меток compose: `restic.enable=true` помечает сервис, `restic.backup.paths=<container-path>` называет монтирования для резервного копирования (resticontainer разрешает их в пути хоста). Сервис без меток `restic.*` просто не резервируется. Резервируйте конфигурацию только там, где данные восстановимы.
- Тройка `${APEX_UID...}` берётся из `.env` проекта, поддерживаемого `tiers/useradd`.

### Обеспечьте хранилище и идентичность

```bash
apex tiers/link <tier1> <tier2> <tier3>
apex tiers/useradd
apex tiers/chown
```

Повторный запуск тройки идемпотентен; он подхватывает новый проект, создаёт его каталоги уровней и `.env`, обеспечивает его пользователя `noroot-<project>` и применяет матрицу владения.

### Линтинг

```bash
apex utils/lint-docker-compose
```

Проверяет каждый якорный IP (корректность формы, уникальность, нахождение внутри подсети узла) и запускает линтер compose по репозиторию. Pre-commit-хук обеспечивает тот же линтинг для staged-файлов compose.

### Разверните

```bash
apex compose up
```

Базовая композиция уже поднята; новый проект стартует в своём алфавитном слоте. Проверьте с помощью `docker ps` и, если сервис проксируется, через его маршрут на границе.

{{% /steps %}}

## Заметки

- Внутренние секреты сервиса (например, пароль базы данных) размещаются в собственном `.env` проекта в хранилище уровня 1, рядом с автоматически внедряемым блоком UID.
- Никогда не определяйте `direct`/`enclave`/`socket` внутри файла проекта — второе определение будет конкурировать с базовой композицией за владение сетью.

---

**См. также:**

- [Concept: Compositions and the shared core](/apex/concepts/compositions)
- [Concept: Tiered storage and privilege isolation](/apex/concepts/tiered-storage)
- [Concept: Fleet addressing scheme](/apex/concepts/addressing)
