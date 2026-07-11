---
title: Эксплуатация узла
description: "Операции day-2: конфигурирование, композиции, резервные копии и синхронизация репозитория."
weight: 24
---

**Контекст:** после первоначальной настройки [узел](/apex/glossary#node) эксплуатируется полностью через [движок](/apex/glossary#engine). Это руководство охватывает повторяющиеся операции и то, что каждая из них фактически делает на хосте.

## Конфигурирование хоста {#configure}

`apex configure` запускает полный набор конфигурирования в фиксированном порядке; каждый шаг вызывается индивидуально, когда изменился только один слой:

| Шаг | Эффект |
|---|---|
| `configure/base` | Обеспечивает базу Debian: обновление индекса пакетов, необходимые пакеты (`curl`, `wget`, `git`, `rsyslog`), запущенный rsyslog, установленный `ufw` и вспомогательный скрипт `ufw-docker` в `~/.local/bin/ufw-docker`. |
| `configure/ufw` | Применяет правила хоста, внедряет управляемые блоки правил уровня ядра, применяет правила контейнеров через `ufw-docker`. Поддерживает `--dry-run`. |
| `configure/crowdsec` | Устанавливает CrowdSec, если он отсутствует, разворачивает `configs/crowdsec/` в `/etc/crowdsec/`, устанавливает коллекции и firewall bouncer, если он настроен. Поддерживает `--dry-run`. |
| `configure/cron` | Рендерит `configs/cron/crontab` через слой шаблонов и устанавливает его — с предпросмотром, отказом при пустом рендере (код выхода `65`) и откатом при неудачной установке. Поддерживает `--dry-run`. |
| `configure/systemd` | Рендерит файлы верхнего уровня из `configs/systemd/` в `/etc/systemd/system/`, затем выполняет daemon-reload и включает каждый `.service`. Поддерживает `--dry-run`. |
| `configure/routing` | Включает IP-форвардинг и устанавливает правило и таблицу policy-routing по fwmark, используемые границей анклава; идемпотентно. |

После `configure/ufw` намеренно перезапустите `ufw` (`sudo systemctl restart ufw`) — действие напоминает об этом и предупреждает, что порт SSH уже должен быть разрешён.

## Жизненный цикл композиции {#compose}

```bash
apex compose up            # сначала core, затем сервисы по алфавиту
apex compose down          # обратный порядок
apex compose restart
apex compose up --dry-run  # только напечатать команды
```

Дополнительные аргументы передаются в `docker compose` для каждого проекта. Файлы `.env` и `apex.env` каждого проекта подставляются автоматически, если они присутствуют.

## Резервные копии {#backups}

```bash
apex backup/run "$(cat <path-to-telegram-url-file>)"
```

Запускает [resticontainer](https://github.com/deytenit/resticontainer) в режиме one-shot под профилем compose `manual`: init-if-needed, затем управляемое метками резервное копирование, которое определяет намерение каждого сервиса из его меток compose `restic.*` (`restic.enable`, `restic.backup.paths`, …), делает снимок объединения разрешённых путей хоста в одном запуске restic (`--host` = `APEX_NODE_HOST`, `--compression max`), применяет политику хранения (`forget --prune`) и уведомляет. Он отказывается сообщать об успехе, если ни один сервис с меткой `restic.*` не создал нового снимка. Полный процесс описан в [Concept: Tiered storage](/apex/concepts/tiered-storage#backups). Запланируйте его в `configs/cron/crontab`, чтобы запуск и его результат в Telegram проходили без надзора.

## Синхронизация репозитория (capture-up) {#sync}

```bash
apex sync/repository <telegram-bot-url>
```

Коммитит рабочую копию в `sync/<node>`, выполняет rebase на `origin/main` и force-push с lease; CI сворачивает ветку обратно в `main`. «capture-up» — механизм захвата состояния узла обратно в репозиторий. Действие отказывается выполняться — с постраничной ошибкой — когда сабмодуль commons «грязный» или дерево `compositions/` отсутствует, и аккуратно прерывается при конфликте rebase (требуется ручное вмешательство). См. [Concept: Framework architecture](/apex/concepts/architecture#capture-up) для описания модели.

## Осведомлённость об обновлениях {#updates}

```bash
apex sync/packages <telegram-bot-url>
```

Сообщает об ожидающих apt-обновлениях и устаревших образах контейнеров (локальные дайджесты сравниваются с реестром через `skopeo`) в едином дайджесте Telegram. Он ничего не изменяет на хосте — это плановая проверка осведомлённости.

## Извлечение сертификатов {#certs}

```bash
apex utils/extract-traefik-certs <acme.json> <dest-dir> [telegram-bot-url]
```

Выгружает хранилище ACME граничного прокси в пары `fullchain.pem`/`privkey.pem` по каждому домену (через контейнеризованный dumper), ограничивает права на ключи до `600` и переназначает владельца вывода вызывающему пользователю — для сервисов, которым нужен «сырой» PEM-материал вместо TLS, терминируемого прокси.

---

**См. также:**

- [Getting started with an apex node](/apex/getting-started)
- [Reference: Actions](/apex/reference/actions)
- [Docs: Troubleshooting](/apex/troubleshooting)
