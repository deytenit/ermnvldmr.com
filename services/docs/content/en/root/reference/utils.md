---
title: Utility Actions
description: Common helper scripts for maintenance, validation, and certificate management.
weight: 56
---

Utility actions provide common helper functions for node maintenance, validation, and project-specific tasks.

## Core Utility Actions {#actions}

| Action | Description |
| :--- | :--- |
| `utils/extract-traefik-certs` | Extracts SSL/TLS certificates and private keys from Traefik's `acme.json` storage. |
| `utils/generate-happ-subscriptions` | Automatically generates HApp subscription files based on current project metadata. |
| `utils/lint-docker-compose` | Performs a static analysis of all `docker-compose.yml` files to ensure they meet the framework's standards. |

## Certificate Management (`utils/extract-traefik-certs`) {#certificates}

Traefik stores its ACME-issued certificates (like those from Let's Encrypt) in a single `acme.json` file. The `utils/extract-traefik-certs` action parses this file and extracts individual `fullchain.pem` and `privkey.pem` files.

This is particularly useful when other services (e.g., mail servers, non-Dockerized applications) require the same SSL certificates.

## Quality Assurance (`utils/lint-docker-compose`) {#linting}

To maintain consistency and security, the `utils/lint-docker-compose` action validates all compose files across the infrastructure. It checks for:

- **Naming Standards**: Ensures project names and container names follow the `{node}-{project}` convention.
- **Security Context**: Flags containers running as `root` without a justified override.
- **Resource Constraints**: Identifies services lacking CPU or memory limits.
- **Label Standards**: Validates required labels for routing (e.g., [Traefik](https://traefik.io/)) and [CrowdSec](/root/concepts/security-model#crowdsec).

---

**See also:**

- [Concept: Infrastructure Principles](/root/concepts/principles)
- [Concept: Security & Privilege Isolation](/root/concepts/security-model)
