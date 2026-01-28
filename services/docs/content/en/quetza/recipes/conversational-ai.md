---
title: Conversational AI Integration
weight: 2
---


**Goal:** Integrate Large Language Models (LLMs) while managing context and Discord's timeout constraints.

## 1. Context Management Strategy
Conversations require history to be coherent.
*   **Scoping:** `Map<GuildID, Map<UserID, Message[]>>`
    *   **Guild Key:** Prevents cross-server leaks.
    *   **User Key:** Prevents cross-user confusion in public channels.
*   **Lifecycle:** Implement a rolling window (e.g., last 50 messages) to prevent context bloat.

## 2. Response Streaming
LLMs are slow; Discord is fast (3s timeout).

{{% steps %}}
### Step 1: Defer Interaction
Immediately call `interaction.deferReply()`. This buys you 15 minutes.

### Step 2: Invoke LLM
Call your AI service asynchronously.

### Step 3: Edit Response
When data arrives, use `interaction.editReply(content)`.
{{% /steps %}}

## 3. Implementation Sketch

```typescript
// commands/chat.ts
export async function execute(interaction, controller) {
  // 1. Defer
  await interaction.deferReply();

  // 2. Process
  const history = controller.getHistory(interaction.guildId, interaction.user.id);
  const response = await aiService.generate(interaction.options.getString('prompt'), history);

  // 3. Respond
  await interaction.editReply(response);
  controller.updateHistory(interaction.guildId, interaction.user.id, response);
}
```

> [!WARNING]
> **API Costs:**
> AI APIs are often billed by token. Implement strict user-based rate limits in your Controller to prevent abuse.
