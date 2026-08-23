---
title: "Автоматизация Golden Image"
weight: 3
type: docs
---

Сборочный пайплайн Golden Image автоматизирует создание стандартизированных и защищенных образов виртуальных машин Debian 12 с предустановленным кластером K3s.

---

## 1. Конфигурация Packer и скрипты провижининга

Конфигурация сборок расположена в каталоге [`ci/packer/`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/) и использует builder `qemu`.

### Основные компоненты:
* **[`debian-12-k3s.pkr.hcl`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/debian-12-k3s.pkr.hcl)**: HCL-шаблон Packer, задающий параметры виртуальной машины (CPU, RAM, диск 10GB qcow2, образ Debian 12 Netinst, параметры загрузки и скрипты).
* **[`http/preseed.cfg`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/http/preseed.cfg)**: Правила автоматической неинтерактивной установки Debian через Preseed.
* **[`scripts/01-base-system.sh`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/scripts/01-base-system.sh)**: Установка базовых утилит, принудительное включение cloud-init (`/etc/cloud/ds-identify.cfg`), оптимизация сетевого стека и настройка fail2ban.
* **[`scripts/02-install-k3s.sh`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/scripts/02-install-k3s.sh)**: Скачивание и установка бинарного файла K3s (`INSTALL_K3S_SKIP_ENABLE=true`, `INSTALL_K3S_SKIP_START=true`) в `/usr/local/bin/k3s` без запуска сервиса во время сборки.
* **[`scripts/03-cleanup.sh`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/packer/scripts/03-cleanup.sh)**: Сброс идентификаторов машины (`/etc/machine-id`, `/var/lib/dbus/machine-id`, хостовые ключи SSH), очистка кэшей apt и зануление свободного места на диске.

---

## 2. Автоматизация в GitHub Actions

Сборка образов запускается пайплайном `.github/workflows/ci-next-build-golden-image.yml`.

### Этапы workflow:
1. **Валидация скриптов**: Проверка синтаксиса bash (`bash -n ci/packer/scripts/*.sh`) и форматирования Packer (`packer fmt -check`).
2. **Сборка образа**:
   * Инициализация плагинов (`packer init`).
   * Сборка в headless QEMU (`packer build`).
   * Сжатие артефакта в формат `qcow2`.
3. **Загрузка в S3 и контроль квот**:
   * Настройка AWS S3 CLI для работы с Yandex Cloud Object Storage.
   * **Автоматическая очистка**: Удаление устаревших образов в префиксе `dev/images/com-ermnvldmr-debian-12-k3s-amd64-*.qcow2` для предотвращения переполнения квоты бакета.
   * **Загрузка**: Сохранение нового образа:
     ```text
     s3://<bucket>/dev/images/com-ermnvldmr-debian-12-k3s-amd64-<git_short_sha>.qcow2
     ```

---

## 3. Схема именования образов

Имя образа жестко связано с коммитом Git:

```text
com-ermnvldmr-debian-12-k3s-amd64-<short_sha>.qcow2
```

Пример: `com-ermnvldmr-debian-12-k3s-amd64-f4ba6d1.qcow2`

---

## 4. Развертывание через Cloud-Init

Для запуска виртуальной машины в Yandex Cloud из готового образа:
1. Передайте заполненный шаблон [`user-data.template.yaml`](file:///home/deytenit/Source/repos/deytenit/ermnvldmr.com/ci/cloud-init/user-data.template.yaml) в метаданные инстанса в поле `user-data`.
2. Cloud-init автоматически выполнит `/usr/local/bin/bootstrap-cluster.sh` при первом старте.
3. Инстанс настроит сеть, смонтирует постоянный SSD, запустит K3s, установит Flux и поднимет все сервисы примерно за 90 секунд.
