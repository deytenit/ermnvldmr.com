---
title: Architecture & Philosophy
weight: 1
---

**Goal:** Understand the core design principles that drive Quetza's modularity.

## Design Philosophies

### Convention Over Configuration

Quetza minimizes boilerplate by relying on strict folder structures.

- **No central registry:** The filesystem _is_ the registry.
- **Result:** You don't update a config file to add a module; you just create the folder.

### Composition Over Inheritance

Modules are composed of capabilities, not inherited from a base class.

- **Flexibility:** Modules can use any internal architecture (Functional, OOP) as long as they export the required interfaces.

### Isolation Over Integration

Modules cannot directly invoke each other.

- **Why:** Prevents tight coupling.
- **Benefit:** You can delete any module without breaking the rest of the bot.

## Core Entities

| Entity         | Role                           | Lifecycle                     |
| :------------- | :----------------------------- | :---------------------------- |
| **Client**     | Service Locator & Orchestrator | Singleton. Runs the show.     |
| **Module**     | Namespace for features         | Loaded at startup.            |
| **Command**    | User Interaction Endpoint      | Stateless. Request/Response.  |
| **Event**      | Reactive Observer              | Subscribed at startup.        |
| **Controller** | State Manager                  | Persists across interactions. |

---

**See also:**

- [Service Locator Pattern](https://en.wikipedia.org/wiki/Service_locator_pattern)
- [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern)
