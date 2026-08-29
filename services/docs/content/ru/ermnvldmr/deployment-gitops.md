---
title: "GitOps и пайплайн релизов"
weight: 4
type: docs
---

Платформа использует декларативную модель GitOps на базе **Flux v2** и **Kustomize** со встроенной автоматической проверкой раскатки сервисов в продакшене.

---

## 1. Структура GitOps-манифестов

Все манифесты Kubernetes расположены в каталоге [`ci/k8s/`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/k8s/):

```text
ci/k8s/
├── apps/                        # Сервисы и приложения
│   ├── docs/                    # Документация на Hugo
│   ├── postgres/                # PostgreSQL 16 StatefulSet и бэкап-CronJob
│   ├── umami/                   # Аналитика Umami
│   └── www/                     # Основной сайт на React 19
├── base/                        # Базовые ресурсы
│   └── namespaces/              # Определение неймспейса `com-ermnvldmr`
├── clusters/                    # Точки входа для Flux
│   └── production/              # Корневая Kustomization продакшена
└── infrastructure/              # Кластерная инфраструктура
    ├── cert-manager/            # Cert-Manager v1.17.0 и ClusterIssuer Let's Encrypt
    └── networking/              # Правила маршрутизации Traefik Ingress
```

---

## 2. Пайплайны развертывания и релизов

### Режимы деплоя сервисов:

1. **`services/docs` (Непрерывный деплой)**:
   * **Триггер**: Push в ветку `next` с изменениями в `services/docs/**`.
   * **Workflow**: `.github/workflows/services-docs-next-required.yml`.
   * **Действие**: Сборка Docker-образа, обновление `ci/k8s/apps/docs/kustomization.yaml`, коммит в `next` и запуск задачи `verify-rollout`.

2. **`services/www` (Trunk-Based CD с релизным гейтом CalVer)**:
   * **Триггер**: Push в ветку `next` с изменениями в `services/www/**` или зависимых пакетах (`packages/ui/**`, `packages/stl/**`, `packages/i18n/**`), либо ручной `workflow_dispatch`.
   * **Workflow**: `.github/workflows/services-www-next-required.yml`.
   * **Пайплайн**: Полный цикл тестов и проверок (Vitest, Storybook Playwright, Lint, Typecheck, Build) ➔ Сборка Docker-образа с тегом `sha-<commit>` ➔ Гейт подтверждения (`services-www-releases-publish`) выставляет тег CalVer `YYYY.MM.MICRO` в Git и GHCR ➔ Гейт подтверждения (`services-www-releases-deploy`) обновляет GitOps ➔ Проверка раскатки через `verify-rollout`.

---

## 3. Автоматическая проверка раскатки (`/version.json`)

Для 100% уверенности в том, что релиз дошел до пользователей:
1. Каждый Docker-образ содержит файл `/usr/share/nginx/html/version.json` со значениями `COMMIT_SHA` и `VERSION`.
2. Nginx отдает `/version.json` с заголовками `Cache-Control: no-store, no-cache, must-revalidate`.
3. Шаг `verify-rollout` в GitHub Actions опрашивает публичный адрес (`https://www.ermnvldmr.com/version.json` или `https://docs.ermnvldmr.com/version.json`) каждые 10 секунд (до 5 минут), пока коммит в продакшене не совпадет с задеплоенным.

```bash
TARGET_COMMIT="sha-26f0c23"
for i in {1..30}; do
  LIVE_COMMIT=$(curl -sf https://www.ermnvldmr.com/version.json | jq -r '.commit')
  if [ "$LIVE_COMMIT" = "$TARGET_COMMIT" ]; then
    echo "✅ Раскатка в продакшене подтверждена!"
    exit 0
  fi
  sleep 10
done
```

---

## 4. Стратегия отката (Rollback)

* **Git Revert (Стандартный)**: Создание revert-коммита для деплой-коммита и пуш в `next`.
* **GitOps-скрипт**: Запуск `bash ci/scripts/deploy-gitops.sh <service> <previous_tag>`.
* **Экстренный откат в кластере**: Команда `kubectl rollout undo deployment/<service> -n com-ermnvldmr` для мгновенного переключения трафика.
