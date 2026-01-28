---
title: Deployment & Operations
weight: 2
---


**Goal:** Configure, deploy, and monitor a Quetza bot instance.

## 1. Environment Preparation
Quetza relies on environment variables for configuration. **Never** commit these to version control.

| Variable | Description | Required |
| :--- | :--- | :--- |
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal | **Yes** |
| `CLIENT_ID` | Application ID for slash command registration | **Yes** |
| `LLAMA_API_KEY` | Required if using the AI module | No |

## 2. Deployment Strategies

{{< tabs items="Docker (Recommended),Source" >}}
  {{< tab >}}
**Docker** ensures a consistent runtime environment.

1.  **Build** the image:
    ```bash
    docker build -t quetza-bot .
    ```

2.  **Run** the container:
    ```bash
    docker run -d \
      --env-file .env \
      --name quetza \
      quetza-bot
    ```
  {{< /tab >}}
  {{< tab >}}
**Source** deployment is useful for development.

1.  **Install** dependencies:
    ```bash
    pnpm install
    ```

2.  **Build** the project:
    ```bash
    pnpm build
    ```

3.  **Start** the bot:
    ```bash
    pnpm start
    ```
  {{< /tab >}}
{{< /tabs >}}

## 3. Operational Monitoring

Once running, use these mechanisms to check health:

*   **Logs:** Check standard output (Docker logs) for initialization errors.
*   **`/ping` Command:** Verifies network latency and API responsiveness.
*   **`/modules` Command:** Lists all loaded modules to confirm feature availability.

> [!WARNING]
> **Scaling Constraint:**
> Quetza follows a single-instance-per-token model. Do not run multiple instances with the same token, as this will cause WebSocket conflicts.

---
**See also:**
- [Docker Documentation](https://docs.docker.com/)
- [Discord Developer Portal](https://discord.com/developers/applications)
