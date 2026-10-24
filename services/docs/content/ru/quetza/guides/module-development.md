---
title: Разработка модуля
weight: 1
---

**Цель:** добавить новую возможность в бота Quetza в виде изолированного модуля.

## 1. Проектирование модуля

Перед написанием кода выберите подходящую структуру модуля:

- **Простая команда:** достаточно каталога `commands/` (например, для служебных команд).
- **Реактивная логика:** нужен каталог `events/` для обработки событий Discord (например, приветственных сообщений).
- **Логика с состоянием:** понадобится контроллер (`Controller`) для управления состоянием между серверами (например, для музыкального плеера).

## 2. Структура каталогов

Создайте дерево каталогов модуля. Quetza автоматически найдёт и загрузит нужные файлы:

{{< filetree/container >}}
{{< filetree/folder name="src" state="open" >}}
{{< filetree/folder name="modules" state="open" >}}
{{< filetree/folder name="my-feature" state="open" >}}
{{< filetree/file name="module.ts" >}}
{{< filetree/folder name="commands" >}} {{< /filetree/folder >}}
{{< filetree/folder name="events" >}} {{< /filetree/folder >}}
{{< filetree/folder name="lib" >}} {{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## 3. Порядок реализации

{{% steps %}}

### Шаг 1: Манифест модуля

Создайте `module.ts` с описанием модуля:

```typescript
// src/modules/my-feature/module.ts
export const name = 'my-feature';
export const description = 'Добавляет крутые возможности';
// Опционально: export const controller = new MyFeatureController();
```

### Шаг 2: Команды

Создайте файлы команд в каталоге `commands/`. Каждый файл экспортирует описание команды и функцию выполнения (`execute`).

```typescript
// src/modules/my-feature/commands/ping.ts
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Отвечает Pong!');

export async function execute(interaction) {
  await interaction.reply('Pong!');
}
```

### Шаг 3: Обработчики событий (опционально)

Создайте обработчики в каталоге `events/`, чтобы реагировать на события Discord:

```typescript
// src/modules/my-feature/events/ready.ts
import { Events } from 'discord.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(client) {
  console.log(`Ready! Logged in as ${client.user.tag}`);
}
```

### Шаг 4: Контроллер (опционально)

Если модулю нужно хранить состояние, создайте класс контроллера в каталоге `lib/` и экспортируйте его в `module.ts`.

### Шаг 5: Проверка

Перезапустите бота:

1.  Найдите в логах строку «Loaded module: my-feature».
2.  Убедитесь, что команда `/ping` появилась и работает в Discord.

{{% /steps %}}

## Шаблоны интеграции

| Шаблон | Назначение | Состав |
| :--- | :--- | :--- |
| **Простая команда** | Утилиты без сохранения состояния (`/ping`, бросок кубика) | Только `commands/` |
| **Сервис с состоянием** | Музыка, ролевые игры, экономика | `commands/` + `lib/Controller` |
| **Событийная логика** | Автомодерация, логирование | Только `events/` |
| **Гибридный модуль** | Сложные сценарии (например, ИИ-чат) | Все компоненты |

---

**См. также:**

- [Руководство Discord.js: слэш-команды](https://discordjs.guide/creating-your-bot/slash-commands.html)
