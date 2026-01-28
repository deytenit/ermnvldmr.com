---
title: Getting Started
weight: 1
---

**Quetza** is a modular Discord bot framework built with TypeScript that enables developers to build feature-rich Discord applications through self-contained, composable modules.

## What is Quetza?

Quetza provides an architectural foundation that transforms feature development from core modification into module addition. It solves the problem of rigid bot design by inverting dependency structures—the core knows nothing about modules, yet modules have full access to capabilities through defined contracts.

## The Core Philosophy

### The Problem
Traditional monolithic bots suffer from brittleness. Adding features requires modifying core logic, intertwining dependencies, and managing growing codebases that are difficult to test or change.

### The Solution
Quetza treats modules as plugins.
- **Zero-Touch Extension:** Add features by creating a folder. No core code modification required.
- **Isolation:** Modules operate independently.
- **Composition:** Enable/disable features by simply adding or removing module folders.

## High-Level Architecture

Quetza consists of three primary layers:

1. **Foundation Layer**: The `Discord.js` client extended with module-aware registries (Commands, Events, Modules). It acts as a service locator.
2. **Module Layer**: Self-contained feature packages. Each module exposes its own commands and events via a standardized file structure.
3. **Service Layer**: Optional **Controllers** that manage stateful business logic (e.g., audio players, conversation context) across guilds.

## Key Concepts

### Mental Model
To work effectively with Quetza, adopt this framework:

*   **Modules are Plugins:** Independent folders discovered at runtime.
*   **Commands are Endpoints:** Stateless handlers acting like REST API endpoints.
*   **Events are Observers:** Reactive logic subscribing to Discord lifecycle events.
*   **Controllers are Services:** Stateful managers bridging the gap between stateless commands and persistent behavior.

### System Boundaries
Understanding constraints is critical for design:
*   **No Persistence:** In-memory state is lost on restart. External storage is required for persistence.
*   **No Inter-Module Communication:** Modules cannot directly invoke each other, ensuring loose coupling.
*   **No Dynamic Loading:** Modules are loaded only at startup.

## Architectural Invariants

Quetza trades flexibility for predictability through strict conventions:

*   **Convention-Based Discovery:** Modules *must* follow the directory structure (`module.ts`, `commands/`, `events/`) to be loaded.
*   **Single-Phase Initialization:** All loading happens before the Discord connection is established.
*   **Interface Compliance:** All commands and events must export specific interfaces to be registered.

---
**See also:**
- [Discord.js Documentation](https://discord.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
