---
title: 'Начальная настройка хоста'
description: 'Настройка чистого хоста Debian с нуля.'
weight: 1
---

Защищенная настройка чистого хоста Debian от нуля до развертывания.

## Процедура настройки

{{% steps %}}

### Основные пакеты

Сначала установите `sudo` и `docker-ce`. Это необходимо, так как последующая настройка пользователя опирается на группу `docker` и конфигурацию `sudo`.

**Установка Sudo**

```bash
# От имени root:
apt update && apt install sudo -y
```

**Установка Docker**

Следуйте [официальному руководству по установке Docker для Debian](https://docs.docker.com/engine/install/debian/), чтобы установить последнюю версию Docker Engine.

### Системный пользователь и привилегии

Пользователь `adam` выполняет все административные задачи. Аутентификация по SSH-ключу и беспарольный `sudo` через группу `wheel` минимизируют трение при сохранении безопасности.

**Создание администратора**

```bash
# От имени root:
# Создать пользователя с оболочкой bash
useradd -m -s /bin/bash adam

# Создать группу wheel (общепринято для единообразия между дистрибутивами)
groupadd wheel

# Создать модульный файл sudoers
# Это позволяет членам группы 'wheel' запускать sudo без пароля
echo "%wheel ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/99-root-ermnvldmr

# Проверить синтаксис
visudo -c -f /etc/sudoers.d/99-root-ermnvldmr

# Добавить adam в необходимые группы
usermod -aG wheel,docker adam
```

### Настройка Swap

Настройте файл подкачки (swap), чтобы обеспечить стабильность системы во время операций, требующих большого объема памяти.

```bash
# От имени root:
# Создать файл подкачки размером 2 ГБ (измените размер при необходимости)
fallocate -l 2G /swap
chmod 600 /swap
mkswap /swap
swapon /swap

# Сделать его постоянным
echo '/swap none swap sw 0 0' >> /etc/fstab
```

### SSH Доступ и Усиление

Пароли отключены. Доступ осуществляется строго по SSH-ключам.

**Авторизация ключа оператора**

Импортируйте ваш локальный публичный ключ для пользователя `adam`.

```bash
# От имени root:
# Настроить директории
mkdir -p /home/adam/.ssh
chmod 700 /home/adam/.ssh

# Добавьте свой публичный ключ (Замените [PASTE_PUB_KEY_HERE])
echo "[PASTE_PUB_KEY_HERE]" > /home/adam/.ssh/authorized_keys
chmod 600 /home/adam/.ssh/authorized_keys
chown -R adam:adam /home/adam/.ssh
```

**Доступ со стороны оператора**

Настройте вашу локальную машину для удобного доступа к хосту.

```bash
# ~/.ssh/config на стороне оператора
Host daedalus.root.ermnvldmr.com
  Port 2222
  User adam
  IdentityFile ~/.ssh/adam_root_ermnvldmr_com_ed25519
```

**Усиление демона SSH**

Измените конфигурацию SSH, чтобы сменить порт по умолчанию и отключить вход по паролю.

```bash
# От имени root:
# Создать выделенный файл конфигурации
cat <<EOF > /etc/ssh/sshd_config.d/99-root-ermnvldmr.conf
Port 2222
PasswordAuthentication no
PermitEmptyPasswords no
AllowUsers adam
EOF

# Проверить синтаксис перед перезапуском, чтобы избежать блокировки
sshd -t && systemctl restart ssh
```

### Доступ к GitHub (Deploy Key)

Хосту требуется собственная идентификация для загрузки обновлений из репозитория GitHub.

```bash
# От имени root:
# Сгенерировать специфичный для хоста SSH-ключ (без парольной фразы для автоматизации)
sudo -u adam ssh-keygen -t ed25519 -f /home/adam/.ssh/github_ed25519 -N ""

# Настроить SSH для использования этого ключа для GitHub
cat <<EOF | sudo -u adam tee /home/adam/.ssh/config
Host github.com
  AddKeysToAgent yes
  IdentityFile ~/.ssh/github_ed25519
EOF

# Отобразить публичный ключ для добавления в GitHub (Settings > Deploy Keys)
cat /home/adam/.ssh/github_ed25519.pub
```

> [!TIP]
> Добавьте вывод выше в [GitHub: Repository Deploy Keys](https://github.com/deytenit/root.ermnvldmr.com/settings/keys) с правами **read access**.

### Развертывание репозитория

Клонируйте инфраструктурный репозиторий и инициализируйте узел.

```bash
# От имени root:
# Настроить директорию сервиса
export REPO_DIR="/srv/root.ermnvldmr.com"
mkdir -p $REPO_DIR
chown adam:adam $REPO_DIR

# Клонировать от имени пользователя adam
sudo -u adam git clone git@github.com:deytenit/root.ermnvldmr.com.git $REPO_DIR

# Инициализировать узел (Установите имя вашего узла, например, daedalus)
export NODE="daedalus"
cd $REPO_DIR
sudo -u adam ./init.sh
```

**Специфичная для узла конфигурация**

Запустите скрипты инициализации по порядку:

```bash
# От имени root:
# Выполните последовательность для вашего конкретного узла
cd $REPO_DIR
./$NODE/.host/.scripts/00-base
./$NODE/.host/.scripts/10-ufw
./$NODE/.host/.scripts/20-crowd
./$NODE/.host/.scripts/30-cron
```

### Хранение и усиление безопасности

Определите уровни данных (tiers) и защитите среду, создав непривилегированных пользователей для контейнеризированных сервисов.

```bash
# От имени root:
# Создать (или примонтировать) директории хранилища
mkdir -p /srv/com-ermnvldmr-root-$NODE-{tier1,tier2,tier3}

# Настроить уровни и непривилегированных пользователей
cd $REPO_DIR
sudo -u adam .scripts/ops/setup-tiers $NODE
  /srv/com-ermnvldmr-root-$NODE-tier1
  /srv/com-ermnvldmr-root-$NODE-tier2
  /srv/com-ermnvldmr-root-$NODE-tier3

sudo -u adam .scripts/ops/setup-noroot-users $NODE
```

{{% /steps %}}

---

**См. также:**

- [Doc: Docker - Install on Debian](https://docs.docker.com/engine/install/debian/)
- [GitHub: root.ermnvldmr.com](https://github.com/deytenit/root.ermnvldmr.com)
