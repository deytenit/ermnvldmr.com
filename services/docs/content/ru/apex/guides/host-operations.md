---
title: Эксплуатация узла
description: "Операции day-2: конфигурирование, композиции, резервные копии и синхронизация репозитория."
weight: 24
---

**Контекст:** после первоначальной настройки [узел](/apex/glossary#node) управляется исключительно через [движок](/apex/glossary#engine). В&nbsp;этом руководстве описаны регулярные операции и&nbsp;их фактические действия на&nbsp;хосте.

## Конфигурирование хоста {#configure}

Команда `apex configure` выполняет все шаги настройки в&nbsp;строгой последовательности. Если изменился только один слой, нужный шаг можно вызвать отдельно:

| Шаг | Эффект |
|---|---|
| `configure/base` | Готовит базовую систему Debian: обновляет списки пакетов, ставит базовые утилиты (`curl`, `wget`, `git`, `rsyslog`), запускает службу rsyslog, устанавливает `ufw` и&nbsp;вспомогательный скрипт `ufw-docker` в&nbsp;`~/.local/bin/ufw-docker`. |
| `configure/ufw` | Применяет правила хоста, настраивает цепочки правил ядра и&nbsp;пробрасывает правила для&nbsp;контейнеров через `ufw-docker`. Поддерживает флаг `--dry-run`. |
| `configure/crowdsec` | Устанавливает CrowdSec (если он ещё не&nbsp;поставлен), копирует `configs/crowdsec/` в&nbsp;`/etc/crowdsec/`, ставит коллекции и&nbsp;firewall bouncer (если включён в&nbsp;настройках). Поддерживает флаг `--dry-run`. |
| `configure/cron` | Рендерит `configs/cron/crontab` через шаблонизатор и&nbsp;устанавливает расписание. Предусмотрены предпросмотр, аварийная остановка при&nbsp;пустом результате (код выхода&nbsp;65) и&nbsp;откат при&nbsp;ошибке установки. Поддерживает флаг `--dry-run`. |
| `configure/systemd` | Рендерит файлы первого уровня из&nbsp;`configs/systemd/` в&nbsp;`/etc/systemd/system/`, перезагружает конфигурацию systemd (daemon-reload) и&nbsp;активирует каждый юнит `.service`. Поддерживает флаг `--dry-run`. |
| `configure/routing` | Включает пересылку IP-пакетов (forwarding), задаёт правило и&nbsp;таблицу маршрутизации (policy-routing) по&nbsp;метке fwmark для&nbsp;границы анклава. Шаг идемпотентен. |

После `configure/ufw` обязательно перезапустите службу: `sudo systemctl restart ufw`. Действие выведет напоминание и&nbsp;проверит, что порт SSH остаётся открытым.

## Жизненный цикл композиции {#compose}

```bash
apex compose up            # сначала core, затем сервисы по алфавиту
apex compose down          # обратный порядок
apex compose restart
apex compose up --dry-run  # только напечатать команды
```

Все дополнительные аргументы движок передаёт напрямую в&nbsp;`docker compose` каждого проекта. Файлы `.env` и&nbsp;`apex.env` проектных каталогов подставляются автоматически при&nbsp;их наличии.

## Резервные копии {#backups}

```bash
apex backup/run "$(cat <path-to-telegram-url-file>)"
```

Команда запускает [resticontainer](https://github.com/deytenit/resticontainer) в&nbsp;режиме one-shot под&nbsp;профилем compose `manual`. Процесс проходит следующие этапы:

1. Инициализирует репозиторий (если он ещё не&nbsp;создан).
2. Считывает compose-метки `restic.*` (`restic.enable`, `restic.backup.paths` и&nbsp;т.&nbsp;д.), чтобы определить, какие сервисы и&nbsp;пути нужно сохранять.
3. Создаёт единый снимок restic для&nbsp;всех выбранных путей хоста (`--host`&nbsp;= `APEX_NODE_HOST`, `--compression max`).
4. Применяет политику хранения (`forget --prune`) и&nbsp;отправляет уведомление.

Если ни&nbsp;один сервис с&nbsp;меткой `restic.*` не&nbsp;сформировал нового снимка, действие завершается с&nbsp;ошибкой. Полный процесс описан в&nbsp;разделе [Concept: Tiered storage](/apex/concepts/tiered-storage#backups). Чтобы резервное копирование и&nbsp;отправка отчётов в&nbsp;Telegram выполнялись автономно, добавьте команду в&nbsp;`configs/cron/crontab`.

## Синхронизация репозитория (capture-up) {#sync}

```bash
apex sync/repository <telegram-bot-url>
```

Действие фиксирует изменения рабочей копии в&nbsp;ветке `sync/<node>`, выполняет rebase на&nbsp;`origin/main` и&nbsp;отправляет ветку через force-push с&nbsp;lease. Затем CI автоматически вливает изменения обратно в&nbsp;`main`. Этот механизм (capture-up) сохраняет актуальное состояние узла в&nbsp;репозиторий.

Действие прерывается с&nbsp;подробным сообщением, если подмодуль commons содержит незакоммиченные изменения или каталог `compositions/` отсутствует. При&nbsp;конфликтах rebase выполнение останавливается для&nbsp;ручного вмешательства. Подробнее архитектурная модель описана в&nbsp;разделе [Concept: Framework architecture](/apex/concepts/architecture#capture-up).

## Мониторинг обновлений {#updates}

```bash
apex sync/packages <telegram-bot-url>
```

Формирует единую сводку в&nbsp;Telegram о&nbsp;доступных обновлениях пакетов apt и&nbsp;устаревших образах контейнеров (локальные дайджесты сравниваются с&nbsp;реестром через `skopeo`). Действие ничего не&nbsp;меняет на&nbsp;хосте&nbsp;— это исключительно плановая проверка.

## Извлечение сертификатов {#certs}

```bash
apex utils/extract-traefik-certs <acme.json> <dest-dir> [telegram-bot-url]
```

Экспортирует сертификаты из&nbsp;ACME-хранилища граничного прокси в&nbsp;пары `fullchain.pem` и&nbsp;`privkey.pem` для&nbsp;каждого домена (с&nbsp;помощью утилиты в&nbsp;контейнере). Скрипт ограничивает права доступа к&nbsp;ключам до&nbsp;`600` и&nbsp;передаёт владение файлами запустившему пользователю. Это нужно сервисам, которым требуются исходные PEM-файлы вместо готового TLS-соединения от&nbsp;прокси.

---

**См.&nbsp;также:**

- [Getting started with an apex node](/apex/getting-started)
- [Reference: Actions](/apex/reference/actions)
- [Docs: Troubleshooting](/apex/troubleshooting)
