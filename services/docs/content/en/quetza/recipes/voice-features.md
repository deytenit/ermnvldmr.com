---
title: Interactive Voice Features
weight: 1
---


**Goal:** Implement sophisticated voice interactions that respect guild boundaries and manage ephemeral resources.

## 1. Resource Scoping Strategy
Voice features **MUST** be scoped to the Guild.
*   **Pattern:** The Controller maintains a `Map<GuildID, Player>`.
*   **Behavior:**
    *   **Join:** Create a Player for `Guild A` if none exists.
    *   **Leave:** Destroy the Player and release connections.
    *   **Isolation:** Commands in `Guild B` never affect `Guild A`.

## 2. Command Orchestration
Voice features require a suite of commands coordinated via the Controller.

| Command | Action | Controller Logic |
| :--- | :--- | :--- |
| `/join` | Connect to channel | `createPlayer(guildId, channelId)` |
| `/play` | Add track to queue | `getPlayer(guildId).enqueue(track)` |
| `/stop` | Disconnect | `destroyPlayer(guildId)` |

## 3. State Persistence
Audio sessions are ephemeral.
*   **Transient State:** Active audio stream (Lost on disconnect).
*   **Durable State:** Queue/Playlist (Persisted in Controller until restart).

> [!TIP]
> **Resilience:** Separate the *Queue* logic from the *Voice Connection* logic. This allows the bot to reconnect without losing the user's playlist.

## 4. Implementation Sketch

```typescript
// lib/MusicController.ts
class MusicController {
  private players = new Map<string, AudioPlayer>();

  getPlayer(guildId: string): AudioPlayer {
    if (!this.players.has(guildId)) {
      this.players.set(guildId, new AudioPlayer());
    }
    return this.players.get(guildId);
  }

  destroyPlayer(guildId: string) {
    this.players.get(guildId)?.disconnect();
    this.players.delete(guildId);
  }
}
```

---

**See also:**
- [Discord.js Voice Guide](https://discordjs.guide/voice/)
