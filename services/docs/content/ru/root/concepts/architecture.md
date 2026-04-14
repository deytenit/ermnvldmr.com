---
title: Архитектура инфраструктуры
description: Децентрализованная модель оркестрации и структура развертывания.
weight: 10
---

Фреймворк Root работает на децентрализованной модели оркестрации, разработанной для независимых, самодостаточных проектов. Он обеспечивает строгое разделение между оркестратором («мозгом») и задачами автоматизации («мышцами»).

## Основная философия {#philosophy}

Фреймворк построен на принципе **Smart Root, Stupid Actions** («Умный Root, глупые Action-скрипты»). Такой дизайн гарантирует, что отдельные скрипты автоматизации остаются декларативными и не знают о глобальном состоянии системы, в то время как центральный диспетчер берет на себя разрешение окружения и инициализацию библиотек.

### Smart Root (Диспетчер)

Точка входа `root` является единственным интерфейсом для пользователей. Она отвечает за:

- **Разрешение окружения** &rarr; Поиск репозиториев `commons` и `configs`.
- **Подготовка библиотек** &rarr; Разовая загрузка пространств имен (modules) библиотек.
- **Установление контекста** &rarr; Определение целевого [Узла (Node)](/root/glossary#node) и связанных с ним путей.

### Stupid Actions (Задачи)

[Action-скрипты (Actions)](/root/glossary#action) — это декларативные скрипты, расположенные в `scripts/actions/`. Они называются «глупыми», потому что:

- Они не вычисляют пути и не ищут репозитории.
- Они полностью зависят от переменных окружения `ROOT_`.
- Они фокусируются исключительно на одной атомарной задаче (например, `compose`, `ufw`).

## Модель развертывания {#deployment}

Они обычно развертываются как общий репозиторий [Commons](/root/glossary#commons), подключенный как Git-субмодуль внутри репозитория конфигураций. Движок, на котором построена эта общая инфраструктура, размещен по адресу [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons).

{{< filetree/container >}}
{{< filetree/folder name="configs-repo" state="open" >}}
  {{< filetree/folder name=".operator" state="open" >}}
    {{< filetree/folder name="shared (submodule)" state="open" >}}
      {{< filetree/folder name="scripts" >}}
        {{< filetree/folder name="run" >}}
          {{< filetree/file name="root (dispatcher)" >}}
        {{< /filetree/folder >}}
        {{< filetree/folder name="lib" >}}
          {{< filetree/file name="shared libraries" >}}
        {{< /filetree/folder >}}
        {{< filetree/folder name="actions" >}}
          {{< filetree/file name="shared actions" >}}
        {{< /filetree/folder >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="local" state="open" >}}
      {{< filetree/folder name="scripts" >}}
        {{< filetree/folder name="actions" >}}
          {{< filetree/file name="node-specific overrides" >}}
        {{< /filetree/folder >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/folder name="daedalus (node)" >}}
    {{< filetree/file name="docker-compose.yml" >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="init.sh (bootstrap)" >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

---

**See also:**

- [Concept: The ROOT_ API](/root/reference/root-api)
- [Guide: Installation](/root/guides/installation)
- [GitHub: ermnvldmr.com-root-commons](https://github.com/deytenit/ermnvldmr.com-root-commons)
-commons)
