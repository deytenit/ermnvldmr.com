---
title: Интеграция разговорного ИИ
weight: 4
---

**Цель:** подключить большие языковые модели (LLM), настроить управление контекстом и уложиться в тайм-ауты Discord.

## 1. Стратегия управления контекстом

Чтобы диалог оставался связным, модели нужна история сообщений:

- **Область видимости (Scoping):** `Map<GuildID, Map<UserID, Message[]>>`
  - **Ключ сервера (Guild Key):** изолирует контекст и защищает от утечек данных между серверами.
  - **Ключ пользователя (User Key):** разделяет реплики разных участников в публичных каналах.
- **Жизненный цикл:** настройте «скользящее окно» (например, последние 50 сообщений), чтобы контекст не разрастался.

## 2. Потоковая передача ответов

LLM генерируют ответ постепенно, а Discord ждёт реакции не дольше 3 секунд.

{{% steps %}}

### Шаг 1: Отложенный ответ (Defer Interaction)

Сразу вызовите `interaction.deferReply()`. Это продлит время ожидания ответа до 15 минут.

### Шаг 2: Запрос к LLM

Асинхронно отправьте запрос к ИИ-сервису.

### Шаг 3: Отправка ответа

Когда ответ готов, вызовите `interaction.editReply(content)`.
{{% /steps %}}

## 3. Пример реализации

```typescript
// commands/chat.ts
export async function execute(interaction, controller) {
  // 1. Отложить ответ
  await interaction.deferReply();

  // 2. Обработка
  const history = controller.getHistory(interaction.guildId, interaction.user.id);
  const response = await aiService.generate(interaction.options.getString('prompt'), history);

  // 3. Ответ
  await interaction.editReply(response);
  controller.updateHistory(interaction.guildId, interaction.user.id, response);
}
```

> [!WARNING]
> **Расходы на API:**
> Провайдеры ИИ обычно тарифицируют запросы по токенам. Настройте в контроллере строгие лимиты запросов (rate limits) для пользователей, чтобы избежать лишних расходов.
