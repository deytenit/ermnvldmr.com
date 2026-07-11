---
title: Устранение неполадок
description: Симптомы, диагностика и исправление типовых сбоев apex.
weight: 40
---

Режимы сбоев, о которых сообщает [движок](/apex/glossary#engine), с точными строками лога, которые он выводит.

## APEX_NODE_FQDN откатывается к имени хоста {#fqdn-fallback}

**Симптомы:** каждое действие пишет в лог `APEX_NODE_FQDN not set in node.env; using hostname '<fqdn>'.`

**Диагностика:** в `node.env` не задан `APEX_NODE_FQDN`, поэтому движок вывел FQDN из имени хоста ОС. На узле, чьё имя хоста и есть предполагаемый FQDN, это безобидно; в противном случае маршрутизация traefik `Host()` будет использовать неверное имя.

**Решение:** задайте `APEX_NODE_FQDN` явно в `node.env` в корне репозитория (например, `APEX_NODE_FQDN=node1.example.com`).

## Разрешение идентичности завершается с кодом 66 {#identity-66}

**Симптомы:** `identity: APEX_NODE_FQDN missing from node.env and no hostname` или `identity: APEX_SUBNET missing from node.env`, код выхода `66`.

**Диагностика:** обязательное поле идентичности не удаётся разрешить. Первая строка означает, что ни `APEX_NODE_FQDN`, ни имя хоста ОС не дают FQDN; вторая означает, что отсутствует `APEX_SUBNET`. Движок отказывается угадывать.

**Решение:** создайте или дополните `node.env` в корне репозитория — задайте `APEX_SUBNET` и задайте `APEX_NODE_FQDN` (либо убедитесь, что имя хоста ОС пригодно к использованию).

## configure/ufw завершается с кодом 66 {#ufw-66}

**Симптомы:** `Rules directory does not exist: ...` или `Config directory does not exist: ...`, код выхода `66`.

**Диагностика:** отсутствует ровно одна из директорий `configs/ufw/docker/` или `configs/ufw/host/` — это сломанная структура конфигурации, а не намеренно оставленный без правил узел.

**Решение:** восстановите отсутствующую директорию (пустая допустима: пустой `docker/` выводит предупреждение `No .rules files found ... nothing to apply.` и продолжает работу).

## Отсутствует инструментарий ufw {#ufw-tools}

**Симптомы:** `ufw not installed/working via sudo. Run configure/base first.` или `ufw-docker not found at ~/.local/bin/ufw-docker. Run configure/base first.`, код выхода `1`.

**Диагностика:** отсутствуют предварительные требования слоя фаервола.

**Решение:** запустите `apex configure/base`, затем повторите `apex configure/ufw`.

## Установка crontab отклонена или откачена {#cron}

**Симптомы:** `Rendered crontab is empty; aborting (previous kept).` (код выхода `65`) или `crontab install failed; restoring previous.` (код выхода `1`).

**Диагностика:** отрендеренный `configs/cron/crontab` оказался пустым (проблема шаблона/переменной — помните, что неизвестные `$VARS` остаются буквальными, они не обнуляют файл) или `crontab` отклонил синтаксис.

**Решение:** изучите выведенный предпросмотр, исправьте шаблон, повторно запустите `apex configure/cron`. Предыдущий crontab остаётся целым в обоих случаях.

## sync/repository прерывается {#sync-aborts}

**Симптомы:** `Commons submodule at <path> has uncommitted changes. Aborting.` или `Directory '<repo>/compositions' does not exist. Cannot sync.`, код выхода `1`.

**Диагностика:** коммит [capture-up](/apex/glossary#capture-up) отказывается фиксировать сломанный чекаут — грязный закреплённый субмодуль или отсутствующее дерево [композиций](/apex/glossary#compositions).

**Решение:** для грязного субмодуля — `git -C commons checkout -- .` (или закоммитьте намеренное перемещение пина); для отсутствующего дерева — восстановите чекаут до следующего планового запуска.

## Telegram не доставлен {#telegram}

**Симптомы:** `Telegram Bot URL not provided. Skipping notification.` или `Failed to send Telegram notification: <error>` — и действия, зависящие от уведомлений (`backup/run`, `sync/repository`, `sync/packages`), завершаются с кодом `1`, даже если их работа выполнена успешно.

**Диагностика:** аргумент с URL бота был пустым или отправка не удалась (сеть, прокси, отозванный токен). Ненулевой код выхода сделан намеренно: автоматический запуск, статус которого нельзя сообщить, считается неуспешным.

**Решение:** проверьте файл-источник URL, который читает строка cron, доступность сети/прокси и токен бота; повторите запуск вручную, чтобы подтвердить доставку.

## docker compose отклоняет базовую обёртку {#compose-include}

**Симптомы:** `docker compose` выдаёт ошибку на ключевом слове `include` при вычислении `compositions/apex/docker-compose.yml`.

**Диагностика:** [базовая композиция](/apex/glossary#core-composition) подключается через `include:`, что требует Docker Compose v2.20+.

**Решение:** обновите плагин Compose (`docker compose version` для проверки).

---

**См. также:**

- [Справочник: CLI](/apex/reference/cli)
- [Руководство: Эксплуатация узла](/apex/guides/host-operations)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
