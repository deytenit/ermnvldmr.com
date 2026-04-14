---
title: Diagnostics Guide
weight: 1
---

**Goal:** Identify and fix common pitfalls in Quetza development.

## 1. Module Discovery Failures

**Symptom:** The bot starts, but my module is ignored.
**Cause:** Violation of filesystem conventions.

{{% details title="Checklist: Directory Structure" closed="false" %}}

- [ ] Does `src/modules/<name>/` exist?
- [ ] Does `module.ts` export `name`?
- [ ] Are commands in `commands/` (not `cmds/`)?
- [ ] Did you run `pnpm build`? (Quetza runs from `dist/`).
      {{% /details %}}

## 2. Command Registration Issues

**Symptom:** `/command` does not appear in Discord.

### Global vs. Test Guild Registration

- **Global:** Commands pushed to the application globally can take up to 1 hour to propagate and are subject to stricter rate limits.
- **Test Guild:** Quetza automatically pushes commands to a specific guild in development mode for instant updates.
  - **Requirement:** Ensure `NODE_ENV=development` and `DEV_GUILD_ID` is correctly set in your `.env`.

### Rate Limits

Frequent updates to global commands may trigger Discord's rate limits. Use a test guild for iterative development.

## 3. Interaction Failures

**Symptom:** "The application did not respond".
**Cause:** Command took > 3 seconds without deferral.

**Solution:**

```typescript
// BAD
await longRunningTask();
await interaction.reply('Done'); // Too late!

// GOOD
await interaction.deferReply();
await longRunningTask();
await interaction.editReply('Done');
```

## 4. State Management Leaks

**Symptom:** Bot memory usage grows; cross-server weirdness.
**Cause:** Storing state globally instead of per-guild.

**Diagnostic:**
Check your Controller.

- ❌ `private player: AudioPlayer;` (Shared by everyone!)
- ✅ `private players = new Map<string, AudioPlayer>();` (Scoped by ID).

## 5. Event Handling

**Symptom:** Events fire multiple times or not at all.

- **Multiple:** Events are additive. Did you register the same handler in two modules?
- **None:** Did you export `name` and `execute` correctly?

> [!TIP]
> **Debug Mode:**
> Enable verbose logging to see exactly which modules and commands are loaded at startup.
