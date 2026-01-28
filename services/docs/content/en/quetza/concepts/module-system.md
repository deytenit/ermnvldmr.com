---
title: The Module System
weight: 2
---


**Goal:** Define the vocabulary and mechanics of Quetza's primary abstraction unit.

## System Vocabulary

### Module Declaration
The `module.ts` file acts as the manifest. It is the entry point for discovery.
```typescript
export const name = 'my-module'; // ID
export const description = '...'; // Doc
```

### Command Registration
Occurs during the `ready` event.
1.  Quetza scans all `commands/` folders.
2.  Compiles `ApplicationCommandData`.
3.  PUTs the payload to Discord's API.

### Controller Injection
State is injected, not imported.
```typescript
// The framework calls this:
execute(client, interaction, controller)
```
*   **Why?** Allows the framework to manage the controller's lifecycle (singleton per module).

## State Management Philosophy

### Ephemeral by Default
Quetza provides **no built-in database**.
*   **Memory:** Controllers store state in JS `Map` or `Set` objects.
*   **Restart:** All state is lost when the process exits.
*   **Persistence:** Must be implemented manually (e.g., SQLite, Redis) inside the Controller.

### Scope as Key
State must be keyed by its boundary.
*   `Map<GuildID, ...>` - Server specific (Most common).
*   `Map<UserID, ...>` - User specific (DM bots).

## Error Handling Model

**Fail Fast & Friendly.**
*   **Validation:** Check permissions/inputs immediately.
*   **User-Facing:** "You don't have permission" (Not "Error: 403").
*   **Isolation:** A crash in `/ping` catches itself and doesn't kill the bot.

---
**See also:**
- [Discord Interaction Lifecycle](https://discord.com/developers/docs/interactions/receiving-and-responding)
