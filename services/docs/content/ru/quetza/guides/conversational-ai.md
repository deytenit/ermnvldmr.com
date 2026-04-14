---
title: Интеграция разговорного ИИ
weight: 4
---

**Цель:** Интегрировать большие языковые модели (LLM), управляя контекстом и ограничениями тайм-аута Discord.

## 1. Стратегия управления контекстом

Разговоры требуют истории, чтобы быть связными.

- **Область видимости (Scoping):** `Map<GuildID, Map<UserID, Message[]>>`
  - **Ключ гильдии (Guild Key):** Предотвращает утечки между серверами.
  - **Ключ пользователя (User Key):** Предотвращает путаницу между пользователями в публичных каналах.
- **Жизненный цикл:** Реализуйте "скользящее окно" (например, последние 50 сообщений) для предотвращения разрастания контекста.

## 2. Потоковая передача ответов

LLM работают медленно, а Discord требует быстрых ответов (тайм-аут 3 секунды).

{{% steps %}}

### Шаг 1: Отложенное взаимодействие (Defer Interaction)

Немедленно вызовите `interaction.deferReply()`. Это даст вам 15 минут.

### Шаг 2: Вызов LLM

Асинхронно вызовите ваш ИИ-сервис.

### Шаг 3: Редактирование ответа

Когда данные поступят, используйте `interaction.editReply(content)`.
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
> **Затраты на API:**
> API ИИ часто тарифицируются по токенам. Внедрите строгие лимиты запросов (rate limits) для пользователей в вашем Контроллере, чтобы предотвратить злоупотребления.
