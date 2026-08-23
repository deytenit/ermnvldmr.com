---
title: "Эксплуатация и регламенты"
weight: 5
type: docs
---

Практическое руководство и регламенты для администрирования, отладки и обслуживания продакшен-кластера `ermnvldmr.com`.

---

## 1. Удаленный SSH-доступ

Подключение к виртуальной машине осуществляется под учетной записью `adam`:

```bash
ssh -i ~/.ssh/adam_ermnvldmr_com_ed25519 adam@158.160.205.138
```

Пользователь `adam` имеет права `sudo` без пароля и преднастроенный доступ к `kubectl` через `~/.kube/config`.

---

## 2. Диагностика состояния кластера

### Проверка статуса подов
```bash
kubectl get pods -n com-ermnvldmr -o wide
```

### Проверка Ingress и TLS-сертификатов
```bash
kubectl get certificates -n com-ermnvldmr
kubectl get ingress -n com-ermnvldmr
```

### Проверка синхронизации Flux GitOps
```bash
kubectl get gitrepositories -n flux-system
kubectl get kustomizations -n flux-system
```

### Принудительный запуск синхронизации GitOps
```bash
kubectl annotate --overwrite kustomization -n flux-system cluster-sync reconcile.fluxcd.io/requestedAt="$(date +%s)"
```

---

## 3. Управление секретами через SOPS + Age

Все файлы секретов (`*.sops.yaml`) хранятся в репозитории Git в зашифрованном виде с использованием асимметричных ключей Age.

### Конфигурация SOPS (`.sops.yaml`):
```yaml
creation_rules:
  - path_regex: 'ci/k8s/.*secret.*\.yaml$'
    encrypted_regex: '^(data|stringData)$'
    age: 'age1jpa7hqyzzdfq7lvnw3l8qy6648mtjgpcqnljl5jz92dcqjrnsqfsn7m0fl'
```

> **Важно**: Параметр `encrypted_regex` оставляет `apiVersion`, `kind` и `metadata.name` открытыми, что предотвращает ошибки синтаксического разбора в Kustomize и Flux.

### Шифрование секрета
```bash
sops --encrypt --in-place ci/k8s/apps/postgres/secret.sops.yaml
```

### Редактирование зашифрованного секрета
```bash
sops ci/k8s/apps/postgres/secret.sops.yaml
```

---

## 4. Хранилище PostgreSQL и резервное копирование в S3

### Архитектура постоянного хранения
* Данные PostgreSQL размещены на постоянном томе PVC (5Gi) на диске `/dev/vdb` (смонтированном в `/var/lib/rancher/k3s/storage`).
* Данные сохраняются при перезагрузках виртуальной машины и перезапусках подов.

### Автоматический бэкап в S3 (CronJob)
* Манифест: [`ci/k8s/apps/postgres/backup-cronjob.yaml`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/k8s/apps/postgres/backup-cronjob.yaml).
* Расписание: ежедневно в 03:00 UTC (`0 3 * * *`).
* Делает дамп `pg_dump` со сжатием gzip и отправляет его в `s3://<bucket>/backups/postgres/`.

### Ручной запуск бэкапа
```bash
kubectl create job --from=cronjob/postgres-backup manual-backup-$(date +%s) -n com-ermnvldmr
```

---

## 5. Настройки SSL/TLS в Cloudflare

* **Режим SSL**: **Full (strict)**
* **Правило исключения для HTTPS Redirect**: Обязательно наличие правила для исключения ACME HTTP-01 challenge:
  ```text
  http.request.scheme eq "http" and not starts_with(http.request.uri.path, "/.well-known/acme-challenge/")
  ```
  Это позволяет cert-manager продлевать сертификаты Let's Encrypt по порту 80 без блокировок и редиректов.
