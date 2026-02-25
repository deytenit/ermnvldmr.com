---
title: 'Initial Host Setup'
description: 'Setting up a fresh Debian host from scratch.'
weight: 1
---

Hardened setup for a fresh Debian host from zero to deployment.

## Setup Procedure

{{% steps %}}

### Essential Packages

Install `sudo` and `docker-ce` first. This is necessary because the subsequent user setup relies on the `docker` group and `sudo` configuration.

**Install Sudo**

```bash
# As root:
apt update && apt install sudo -y
```

**Install Docker**

Follow the [Official Docker Installation Guide for Debian](https://docs.docker.com/engine/install/debian/) to install the latest Docker Engine.

### System User & Privileges

The `adam` user handles all administrative tasks. SSH-key authentication and passwordless `sudo` via the `wheel` group minimize friction while maintaining security.

**Create the Admin User**

```bash
# As root:
# Create the user with a bash shell
useradd -m -s /bin/bash adam

# Create the wheel group (common for cross-distro consistency)
groupadd wheel

# Create a modular sudoers file
# This allows members of 'wheel' to run sudo without a password
echo "%wheel ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/99-root-ermnvldmr

# Validate syntax
visudo -c -f /etc/sudoers.d/99-root-ermnvldmr

# Add adam to the necessary groups
usermod -aG wheel,docker adam
```

### Swap Setup

Configure a swap file to ensure system stability during memory-intensive operations.

```bash
# As root:
# Create a 2GB swap file (adjust size as needed)
fallocate -l 2G /swap
chmod 600 /swap
mkswap /swap
swapon /swap

# Make it permanent
echo '/swap none swap sw 0 0' >> /etc/fstab
```

### SSH Access & Hardening

Passwords are disabled. Access is strictly via SSH keys.

**Authorize Operator Key**

Import your local public key to the `adam` user.

```bash
# As root:
# Setup directories
mkdir -p /home/adam/.ssh
chmod 700 /home/adam/.ssh

# Add your public key (Replace [PASTE_PUB_KEY_HERE])
echo "[PASTE_PUB_KEY_HERE]" > /home/adam/.ssh/authorized_keys
chmod 600 /home/adam/.ssh/authorized_keys
chown -R adam:adam /home/adam/.ssh
```

**Operator Side Access**

Configure your local machine for easy access to the host.

```bash
# ~/.ssh/config on operator side
Host daedalus.root.ermnvldmr.com
  Port 2222
  User adam
  IdentityFile ~/.ssh/adam_root_ermnvldmr_com_ed25519
```

**Harden SSH Daemon**

Modify the SSH configuration to change the default port and disable password entry.

```bash
# As root:
# Create a dedicated override config
cat <<EOF > /etc/ssh/sshd_config.d/99-root-ermnvldmr.conf
Port 2222
PasswordAuthentication no
PermitEmptyPasswords no
AllowUsers adam
EOF

# Validate syntax before restarting to avoid lockout
sshd -t && systemctl restart ssh
```

### GitHub Access (Deploy Key)

The host requires its own identity to pull updates from the GitHub repository.

```bash
# As root:
# Generate a host-specific SSH key (no passphrase for automation)
sudo -u adam ssh-keygen -t ed25519 -f /home/adam/.ssh/github_ed25519 -N ""

# Configure SSH to use this key for GitHub
cat <<EOF | sudo -u adam tee /home/adam/.ssh/config
Host github.com
  AddKeysToAgent yes
  IdentityFile ~/.ssh/github_ed25519
EOF

# Display the public key to be added to GitHub (Settings > Deploy Keys)
cat /home/adam/.ssh/github_ed25519.pub
```

> [!TIP]
> Add the output above to the [GitHub: Repository Deploy Keys](https://github.com/deytenit/root.ermnvldmr.com/settings/keys) with **read access**.

### Repository Deployment

Clone the infrastructure repository and initialize the node.

```bash
# As root:
# Setup the service directory
export REPO_DIR="/srv/root.ermnvldmr.com"
mkdir -p $REPO_DIR
chown adam:adam $REPO_DIR

# Clone as the adam user
sudo -u adam git clone git@github.com:deytenit/root.ermnvldmr.com.git $REPO_DIR

# Initialize node (Set your node name, e.g., daedalus)
export NODE="daedalus"
cd $REPO_DIR
sudo -u adam ./init.sh
```

**Node-Specific Configuration**

Run the staged initialization scripts in order:

```bash
# As root:
# Run the sequence for your specific node
cd $REPO_DIR
./$NODE/.host/.scripts/00-base
./$NODE/.host/.scripts/10-ufw
./$NODE/.host/.scripts/20-crowd
./$NODE/.host/.scripts/30-cron
```

### Storage & Hardening

Define the data tiers and secure the environment by creating non-root users for containerized services.

```bash
# As root:
# Create (or mount) storage directories
mkdir -p /srv/com-ermnvldmr-root-$NODE-{tier1,tier2,tier3}

# Setup tiers and non-root users
cd $REPO_DIR
sudo -u adam .scripts/ops/setup-tiers $NODE \
  /srv/com-ermnvldmr-root-$NODE-tier1 \
  /srv/com-ermnvldmr-root-$NODE-tier2 \
  /srv/com-ermnvldmr-root-$NODE-tier3

sudo -u adam .scripts/ops/setup-noroot-users $NODE
```

{{% /steps %}}

---

**See also:**

- [Doc: Docker - Install on Debian](https://docs.docker.com/engine/install/debian/)
- [GitHub: root.ermnvldmr.com](https://github.com/deytenit/root.ermnvldmr.com)
