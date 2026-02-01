---
title: Module Development Workflow
weight: 1
---

**Goal:** Create a new feature for the Quetza bot by implementing a self-contained module.

## 1. Conceptualization Phase

Before writing code, determine the module's architecture:

- **Simple Command:** Needs only a `commands/` folder (e.g., utility commands).
- **Reactive Logic:** Needs `events/` to listen to Discord lifecycles (e.g., welcome messages).
- **Stateful Feature:** Needs a **Controller** to manage state across guilds (e.g., music player).

## 2. Structure Establishment

Create the module directory structure. The presence of these files triggers automatic discovery.

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

## 3. Implementation Steps

{{% steps %}}

### Step 1: Create the Manifest

Create `module.ts` to declare the module.

```typescript
// src/modules/my-feature/module.ts
export const name = 'my-feature';
export const description = 'Adds cool feature capabilities';
// Optional: export const controller = new MyFeatureController();
```

### Step 2: Implement Commands

Create command files in `commands/`. Each file exports data and an executor.

```typescript
// src/modules/my-feature/commands/ping.ts
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!');

export async function execute(interaction) {
  await interaction.reply('Pong!');
}
```

### Step 3: Implement Events (Optional)

Create event handlers in `events/` to observe Discord state.

```typescript
// src/modules/my-feature/events/ready.ts
import { Events } from 'discord.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(client) {
  console.log(`Ready! Logged in as ${client.user.tag}`);
}
```

### Step 4: Define Controller (Optional)

For stateful logic, implement a controller in `lib/` and export it in `module.ts`.

### Step 5: Validate

Restart the bot.

1.  Check logs for "Loaded module: my-feature".
2.  Verify the command `/ping` appears in Discord.

{{% /steps %}}

## Integration Patterns

| Pattern              | Use Case                              | Components                     |
| :------------------- | :------------------------------------ | :----------------------------- |
| **Simple Command**   | Stateless utilities (Ping, Dice Roll) | `commands/` only               |
| **Stateful Service** | Music, RPGs, Economy                  | `commands/` + `lib/Controller` |
| **Event-Driven**     | Auto-moderation, Logging              | `events/` only                 |
| **Hybrid**           | Complex features (AI Chat)            | All components                 |

---

**See also:**

- [Discord.js Guide: Slash Commands](https://discordjs.guide/creating-your-bot/slash-commands.html)
