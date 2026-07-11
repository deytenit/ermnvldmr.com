---
title: Концепции
description: "Архитектура, идентичность, действия, контекст выполнения, композиции, хранилище, адресация и безопасность."
weight: 10
---

Теоретические основы фреймворка операций флота apex: как [узел](/apex/glossary#node) объявляет свою [идентичность](/apex/concepts/node-identity), как выполняются [действия](/apex/glossary#action) и как узел организует свои сервисы, хранилище и адресацию.

{{% cards %}}
{{< card link="architecture" title="Архитектура" icon="share" subtitle="Слои движка, commons и configs и как они сочетаются друг с другом." >}}
{{< card link="node-identity" title="Идентичность узла" icon="finger-print" subtitle="Как узел объявляет, кто он и где ему место." >}}
{{< card link="actions-and-overlay" title="Действия и оверлей" icon="lightning-bolt" subtitle="Общие действия и локальные переопределения узла." >}}
{{< card link="execution-context" title="Контекст выполнения" icon="terminal" subtitle="Окружение, которое каждое действие получает во время выполнения." >}}
{{< card link="compositions" title="Композиции" icon="cube" subtitle="Как стеки сервисов объявляются и разворачиваются на каждом узле." >}}
{{< card link="tiered-storage" title="Многоуровневое хранилище" icon="database" subtitle="Стандартизированная классификация хранилища для данных сервисов." >}}
{{< card link="addressing" title="Адресация" icon="globe-alt" subtitle="Подсеть узла, якорные IP и соглашение об анклаве." >}}
{{< card link="security-model" title="Модель безопасности" icon="shield-check" subtitle="Изоляция привилегий и усиление защиты сети." >}}
{{% /cards %}}

---

**См. также:**

- [Руководства: Эксплуатация флота apex](/apex/guides)
- [Справочник: Команды и интерфейсы](/apex/reference)
