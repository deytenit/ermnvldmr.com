---
title: Операции настройки (Configure)
description: Подготовка хоста, движок шаблонов и конфигурация на уровне системы.
weight: 53
---

Операции настройки используются для подготовки хоста и обслуживания системных сервисов. Они в значительной степени полагаются на встроенный движок шаблонов для генерации декларативных конфигурационных файлов.

## Движок шаблонов {#template-engine}

Общие модули используют `envsubst` (из пакета `gettext-base`) для рендеринга шаблонов. Это позволяет использовать стандартные переменные окружения Bash непосредственно в ваших конфигурационных файлах.

### Соглашения по шаблонам

- **Расширение файлов**: Шаблоны обычно используют расширение `.template` (например, `crontab.template`).
- **Синтаксис переменных**: Используйте `${VARIABLE_NAME}` или `$VARIABLE_NAME` для подстановки значений.
- **Автоматический поиск**: Многие действия автоматически ищут шаблоны в определенных директориях внутри репозитория [Configs](/root/glossary#configs).

### Вспомогательные функции рендеринга

Библиотека `root_template.sh` предоставляет несколько вспомогательных функций:

- `root_template_render <input> <output>`: Рендерит один файл.
- `root_template_render_directory <src> <dest>`: Рекурсивно рендерит всю структуру директории.
- `root_template_crontab <template>`: Рендерит и устанавливает crontab для текущего пользователя.

## Основные операции настройки {#actions}

| Операция | Описание |
| :--- | :--- |
| `configure/base` | Устанавливает основные пакеты (`sudo`, `ufw`, `docker`) и настраивает базовых системных пользователей. |
| `configure/cron` | Рендерит и устанавливает специфичные для узла crontab-файлы. |
| `configure/crowdsec` | Настраивает агента CrowdSec и баунсеры (bouncers). |
| `configure/routing` | Настраивает маршрутизацию на уровне системы и сети-мосты (bridge networks). |
| `configure/systemd` | Устанавливает и активирует юниты сервисов systemd. |
| `configure/ufw` | Рендерит и применяет правила брандмауэра с помощью UFW и `ufw-docker`. |

## Пример: Шаблон Nginx {#example}

```nginx filename="nginx.conf.template"
# Этот шаблон использует переменную окружения ROOT_NODE
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Подставляется из окружения
    server_name ${ROOT_NODE}.example.com;
}
```

---

**See also:**

- [Концепция: Архитектура инфраструктуры](/root/concepts/architecture)
- [Справочник: Справочник ROOT_ API Reference](/root/reference/root-api)
