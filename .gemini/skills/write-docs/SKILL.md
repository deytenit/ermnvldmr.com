---
name: write-docs
description: Use when creating, updating, or refactoring technical documentation, developer guides, API references, or Hugo Hextra pages
---

# Write Technical Documentation (ASD-STE100 & Hextra Standard)

## Overview
Technical documentation must be unambiguous, direct, and easy to translate. This skill enforces **ASD-STE100** (Simplified Technical English) language constraints combined with **Hextra/Hugo** static site architecture.

Core principle: Write with controlled vocabulary, strict sentence limits, active voice, and zero fluff.

## ASD-STE100 Language Rules

### 1. Grammar & Sentence Constraints

| Rule | Constraint | Example |
| :--- | :--- | :--- |
| **Procedural Sentence Length** | Maximum **20 words** per sentence for steps, commands, or instructions. | ✅ "Run `hugo server`. Open the local preview link." (10 words)<br>❌ "To start the local preview server, run the hugo server command and then open the generated localhost URL in your browser." (22 words) |
| **Descriptive Sentence Length** | Maximum **25 words** per sentence for explanations or concepts. | ✅ "Hugo compiles markdown files into static HTML. The Hextra theme provides search and layout components." (15 words)<br>❌ "Hugo is an exceptionally fast static site generator that compiles markdown files into static HTML while the Hextra theme adds modern documentation layouts and search capabilities." (26 words) |
| **Voice** | **Active voice** only. Avoid passive voice. | ✅ "The worker node drops expired messages."<br>❌ "Expired messages are dropped by the worker node." |
| **Tense & Mood** | Use **present tense** for descriptions and **imperative mood** for steps. | ✅ "Click **Save**. The server restarts."<br>❌ "You will click Save, after which the server will be restarting." |
| **Noun Clusters** | Maximum **3 sequential nouns**. Unpack longer clusters using prepositions. | ✅ "Index file for site search" (4 words, 2 nouns)<br>❌ "Site search index configuration file" (5 sequential nouns) |

### 2. Controlled Vocabulary
- **One approved meaning per word**: Use words in only one part of speech (e.g. *close* as verb, never adjective; use *near* or *adjacent* instead).
- **Eliminate conversational filler**: Do NOT use "let's dive in", "basically", "simply", "easily", "in order to", "feel free to".
- **Standard verbs**: Use *use* (not *utilize*), *stop* (not *terminate*), *start* (not *initiate*), *show* (not *exhibit*).
- **No metaphors or jargon**: Write explicit, literal statements.

## Hextra & Hugo Formatting

### 1. Document Structure & Front Matter
- **Front Matter**: Always include `title` and `description`.
- **Top-level Header**: **MUST NOT** include `# Title` in the markdown body. Hextra automatically renders H1 from front matter `title`.
- **Admonitions**: Use GitHub alerts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!CAUTION]`).

### 2. Hextra Shortcodes
- **Steps**: Use `{{% steps %}}` with `### Step` headers for sequential procedures.
- **Tabs**: Use `{{< tabs >}}` for alternative paths (e.g. OS, languages).
- **Details**: Use `{{% details title="..." %}}` for large code dumps, raw logs, or edge cases.

### 3. Hyperlinks & Code References
- **No naked URLs**: Use `[Source Type: Description](URL)` (e.g. `[RFC: HTTP/2 Specification](https://tools.ietf.org/html/rfc7540)`).
- **Inline code**: Use backticks for filenames (`hugo.yaml`), functions (`init()`), variables (`port`), and commands.

## Document Templates (Skeletons)

### Quick Start
1. **Prerequisites**: Bullet list.
2. **Steps**: Use `{{% steps %}}`. Keep steps under 20 words each.
3. **Verification**: Direct command or test to check success.

### Procedure / How-to
1. **Objective**: 1 sentence explanation (<25 words).
2. **Procedure**: Numbered steps or `{{% steps %}}`.
3. **Expected Result**: Direct verification.

### Troubleshooting
1. **Symptom**: Concrete error message or behavior.
2. **Cause**: Direct explanation of root failure.
3. **Solution**: Imperative repair steps.

## Red Flags & Rationalization Table

| Excuse / Rationalization | Reality |
| :--- | :--- |
| "A longer sentence makes it flow better." | Long sentences cause translation errors and slow reading. Split into two sentences under 20/25 words. |
| "Passive voice sounds more formal." | Passive voice creates ambiguity about who or what performs the action. Use active voice. |
| "The noun cluster is standard industry jargon." | 4+ sequential nouns confuse non-native speakers. Unpack with prepositions. |
| "I added H1 because markdown needs a main title." | Hextra generates H1 from Front Matter. Duplicate H1 breaks page layout. |

## Verification Checklist
- [ ] Procedural sentences are **20 words or fewer**.
- [ ] Descriptive sentences are **25 words or fewer**.
- [ ] Every step uses **imperative active voice**.
- [ ] Noun clusters contain **3 or fewer sequential nouns**.
- [ ] No conversational filler ("basically", "let's dive in").
- [ ] No top-level `# H1` header in markdown body.
- [ ] All links have descriptive text and source types.
