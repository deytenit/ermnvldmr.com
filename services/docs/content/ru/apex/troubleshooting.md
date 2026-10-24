---
title: Устранение неполадок
description: Симптомы, диагностика и исправление типовых сбоев apex.
weight: 40
---

Типовые сбои в работе [движка](/apex/glossary#engine), точные сообщения из логов и способы их устранения.

## APEX_NODE_FQDN откатывается к имени хоста {#fqdn-fallback}

**Симптомы:** каждое действие пишет в лог `APEX_NODE_FQDN not set in node.env; using hostname '<fqdn>'.`

**Диагностика:** в `node.env` не задан `APEX_NODE_FQDN`, поэтому движок взял FQDN из имени хоста ОС. Если имя хоста совпадает с целевым FQDN, это не повредит работе. В противном случае маршрутизация Traefik по правилу `Host()` получит неверное доменное имя.

**Решение:** явно укажите `APEX_NODE_FQDN` в файле `node.env` в корне репозитория (например, `APEX_NODE_FQDN=node1.example.com`).

## Разрешение идентичности завершается с кодом 66 {#identity-66}

**Симптомы:** `identity: APEX_NODE_FQDN missing from node.env and no hostname` или `identity: APEX_SUBNET missing from node.env`, код выхода `66`.

**Диагностика:** не удалось определить обязательный параметр идентичности. Первое сообщение указывает, что ни в `node.env`, ни в имени хоста ОС нет FQDN; второе — что не задана подсеть `APEX_SUBNET`. Движок не пытается угадывать эти значения.

**Решение:** укажите нужные переменные в файле `node.env` в корне репозитория: задайте `APEX_SUBNET` и `APEX_NODE_FQDN` (либо настройте корректное имя хоста в ОС).

## configure/ufw завершается с кодом 66 {#ufw-66}

**Симптомы:** `Rules directory does not exist: ...` или `Config directory does not exist: ...`, код выхода `66`.

**Диагностика:** отсутствует одна из директорий: `configs/ufw/docker/` либо `configs/ufw/host/`. Это свидетельствует о нарушении структуры каталогов, а не об осознанном отключении правил.

**Решение:** создайте недостающую директорию (она может быть пустой: в этом случае `docker/` лишь выведет предупреждение `No .rules files found ... nothing to apply.` и продолжит выполнение).

## Отсутствует инструментарий ufw {#ufw-tools}

**Симптомы:** `ufw not installed/working via sudo. Run configure/base first.` или `ufw-docker not found at ~/.local/bin/ufw-docker. Run configure/base first.`, код выхода `1`.

**Диагностика:** не установлены компоненты, необходимые для настройки фаервола.

**Решение:** запустите `apex configure/base`, затем повторите вызов `apex configure/ufw`.

## Установка crontab отклонена или откачена {#cron}

**Симптомы:** `Rendered crontab is empty; aborting (previous kept).` (код выхода `65`) или `crontab install failed; restoring previous.` (код выхода `1`).

**Диагностика:** сгенерированный файл `configs/cron/crontab` оказался пустым (ошибка в шаблоне или переменных: неизвестные `$VARS` остаются как есть и не очищают файл) либо утилита `crontab` отклонила синтаксис.

**Решение:** проверьте вывод предпросмотра, исправьте шаблон и запустите `apex configure/cron` заново. В обоих случаях предыдущая версия crontab остаётся без изменений.

## sync/repository прерывается {#sync-aborts}

**Симптомы:** `Commons submodule at <path> has uncommitted changes. Aborting.` или `Directory '<repo>/compositions' does not exist. Cannot sync.`, код выхода `1`.

**Диагностика:** операция [capture-up](/apex/glossary#capture-up) прерывается, чтобы не фиксировать некорректное состояние репозитория (незакоммиченные изменения в субмодуле или отсутствующий каталог [композиций](/apex/glossary#compositions)).

**Решение:** при наличии изменений в субмодуле сбросьте их командой `git -C commons checkout -- .` (либо зафиксируйте намеренное обновление субмодуля в коммите). Если отсутствует дерево каталогов, восстановите чекаут до следующего планового запуска.

## Telegram не доставлен {#telegram}

**Симптомы:** в логе появляется `Telegram Bot URL not provided. Skipping notification.` или `Failed to send Telegram notification: <error>`. При этом действия, отправляющие уведомления (`backup/run`, `sync/repository`, `sync/packages`), завершаются с кодом `1`, даже если основная задача выполнена.

**Диагностика:** не указан URL бота либо сбой произошёл при отправке запроса (проблемы с сетью, прокси или отозванный токен). Ненулевой код возврата предусмотрен намеренно: автоматическая задача, о результате которой невозможно сообщить, считается неудачной.

**Решение:** проверьте файл с URL бота, доступность сети и прокси, а также валидность токена. Затем выполните команду вручную, чтобы проверить доставку.

## docker compose отклоняет базовую обёртку {#compose-include}

**Симптомы:** команда `docker compose` сообщает об ошибке на директиве `include` при обработке `compositions/apex/docker-compose.yml`.

**Диагностика:** [базовая композиция](/apex/glossary#core-composition) подключается через директиву `include:`, для которой требуется Docker Compose версии 2.20 или новее.

**Решение:** обновите плагин Compose (проверить текущую версию можно командой `docker compose version`).

---

**См. также:**

- [Справочник: CLI](/apex/reference/cli)
- [Руководство: Эксплуатация узла](/apex/guides/host-operations)
- [GitHub: apex.ermnvldmr.com](https://github.com/deytenit/apex.ermnvldmr.com)
