---
title: "GitOps & Release Engine"
weight: 4
type: docs
---

The platform uses a declarative GitOps model powered by **Flux v2** and **Kustomize**, with automated post-deployment rollout validation across all production workloads.

---

## 1. Monorepo GitOps Layout

All Kubernetes manifests are located in [`ci/k8s/`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/k8s/):

```text
ci/k8s/
├── apps/                        # Application workloads
│   ├── docs/                    # Hugo documentation service
│   ├── postgres/                # PostgreSQL 16 StatefulSet & S3 backup CronJob
│   ├── umami/                   # Umami web analytics
│   └── www/                     # React 19 primary website
├── base/                        # Base cluster resources
│   └── namespaces/              # `com-ermnvldmr` namespace definition
├── clusters/                    # Flux cluster root definitions
│   └── production/              # Root Kustomization point for production
└── infrastructure/              # Shared cluster infrastructure
    ├── cert-manager/            # Cert-Manager v1.17.0 & Let's Encrypt ClusterIssuer
    └── networking/              # Traefik Ingress routing rules
```

---

## 2. Release Workflows & Continuous Deployment

### Service Deployment Modes:

1. **`services/docs` (Continuous Deployment)**:
   * **Trigger**: Push to `next` modifying `services/docs/**`.
   * **Workflow**: `.github/workflows/services-docs-next-required.yml`.
   * **Action**: Builds Docker image, updates `ci/k8s/apps/docs/kustomization.yaml`, commits to `next`, and runs automated `verify-rollout`.

2. **`services/www` (Semantic Release Dispatch)**:
   * **Trigger**: Dispatched via `.github/workflows/services-www-releases-dispatch-release.yml`.
   * **Standard Mode**: Runs full verification suite (Vitest, Storybook Playwright, Lint, Typecheck, Build) ➔ Tags git release ➔ Pushes image to GHCR ➔ Updates GitOps tag ➔ Runs `verify-rollout`.
   * **Fast-Track Mode (`skip_ci: true`)**: Bypasses test suites for emergency deploys and rollbacks, immediately building the image, updating GitOps, and verifying the production rollout.

---

## 3. Automated Post-Deployment Verification (`/version.json`)

To guarantee that a deployment has actually completed and is serving user traffic:
1. Every container image includes a generated `/usr/share/nginx/html/version.json` with `COMMIT_SHA` and `VERSION` build metadata.
2. Nginx serves `/version.json` with `Cache-Control: no-store, no-cache, must-revalidate`.
3. The `verify-rollout` GitHub Actions job polls the public endpoint (`https://www.ermnvldmr.com/version.json` or `https://docs.ermnvldmr.com/version.json`) every 10 seconds (up to 5 minutes) until the live production commit matches the deployed commit.

```bash
TARGET_COMMIT="sha-26f0c23"
for i in {1..30}; do
  LIVE_COMMIT=$(curl -sf https://www.ermnvldmr.com/version.json | jq -r '.commit')
  if [ "$LIVE_COMMIT" = "$TARGET_COMMIT" ]; then
    echo "✅ Production rollout verified!"
    exit 0
  fi
  sleep 10
done
```

---

## 4. Rollback Strategy

* **Git Revert (Standard)**: Revert the deployment commit in Git and push to `next`.
* **GitOps Script**: Run `bash ci/scripts/deploy-gitops.sh <service> <previous_tag>`.
* **Emergency Kubernetes Rollback**: Run `kubectl rollout undo deployment/<service> -n com-ermnvldmr` on the cluster for instant 2-second rollback.
