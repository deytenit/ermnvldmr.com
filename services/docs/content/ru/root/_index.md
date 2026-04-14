---
title: Documentation of ermnvldmr.com root deployment commons
description: Документация общих модулей корневой инфраструктуры ermnvldmr.com.
weight: 1
type: docs
cascade:
  type: docs
---

Фреймворк `ermnvldmr.com-root-commons` предоставляет среду развертывания с минимальными зависимостями для независимых self-hosted проектов.

Общая логика, скрипты и шаблоны развертывания, используемые в различных приложениях, хранятся в репозитории [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons).

## Основные возможности

- **Smart Dispatcher**: Единая точка входа (`root`) для всех задач оркестрации.
- **Tiered Storage**: Стандартизированная классификация для конфигураций, данных и логов.
- **Privilege Isolation**: Изоляция привилегий через выделенных non-root пользователей для каждого проекта.
- **Namespaced Libraries**: Явные модульные Bash-утилиты для обеспечения согласованной автоматизации.

## Разделы

{{% cards %}}
{{< card link="concepts" title="Концепции" icon="book-open" subtitle="Теоретические основы, архитектура и модели безопасности." >}}
{{< card link="guides" title="Руководства" icon="map" subtitle="Пошаговые инструкции по установке и разработке Action-скриптов." >}}
{{< card link="reference" title="Справочник" icon="code" subtitle="API и технические справочники для разработчиков." >}}
{{% /cards %}}

---

**See also:**

- [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons)
