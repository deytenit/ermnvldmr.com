---
title: Процесс разработки модуля
weight: 1
---

**Цель:** Создать новую функцию для бота Quetza путем реализации самодостаточного модуля.

## 1. Фаза концептуализации

Перед написанием кода определите архитектуру модуля:

- **Простая команда:** Требуется только папка `commands/` (например, служебные команды).
- **Реактивная логика:** Нужна папка `events/` для прослушивания жизненного цикла Discord (например, приветственные сообщения).
- **Функция с состоянием:** Требуется **Контроллер** (Controller) для управления состоянием на разных серверах (например, музыкальный плеер).

## 2. Создание структуры

Создайте структуру директорий модуля. Наличие этих файлов запускает автоматическое обнаружение.

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

## 3. Шаги реализации

{{% steps %}}

### Шаг 1: Создание манифеста

Создайте `module.ts` для объявления модуля.

```typescript
// src/modules/my-feature/module.ts
export const name = 'my-feature';
export const description = 'Добавляет крутые возможности';
// Опционально: export const controller = new MyFeatureController();
```

### Шаг 2: Реализация команд

Создайте файлы команд в папке `commands/`. Каждый файл экспортирует данные и функцию-исполнитель (executor).

```typescript
// src/modules/my-feature/commands/ping.ts
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Отвечает Pong!');

export async function execute(interaction) {
  await interaction.reply('Pong!');
}
```

### Шаг 3: Реализация событий (Опционально)

Создайте обработчики событий в `events/` для отслеживания состояния Discord.

```typescript
// src/modules/my-feature/events/ready.ts
import { Events } from 'discord.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(client) {
  console.log(`Ready! Logged in as ${client.user.tag}`);
}
```

### Шаг 4: Определение контроллера (Опционально)

Для логики, требующей сохранения состояния, реализуйте контроллер в папке `lib/` и экспортируйте его в `module.ts`.

### Шаг 5: Валидация

Перезапустите бота.

1.  Проверьте логи на наличие "Loaded module: my-feature".
2.  Убедитесь, что команда `/ping` появилась в Discord.

{{% /steps %}}

## Шаблоны интеграции

| Паттерн | Сценарий использования | Компоненты |
| :--- | :--- | :--- |
| **Простая команда** | Утилиты без состояния (Ping, Бросок кубиков) | Только `commands/` |
| **Сервис с состоянием** | Музыка, RPG, Экономика | `commands/` + `lib/Controller` |
| **Событийно-ориентированный** | Автомодерация, Логирование | Только `events/` |
| **Гибридный** | Сложные функции (ИИ-чат) | Все компоненты |

---

**См. также:**

- [Руководство Discord.js: Slash-команды](https://discordjs.guide/creating-your-bot/slash-commands.html)
