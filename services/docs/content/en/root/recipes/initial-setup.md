---
title: "Initial Host Setup"
description: "Setting up a fresh Debian host from scratch."
weight: 1
---

Hardened setup for a fresh Debian host from zero to deployment.

## Setup Procedure

{{% steps %}}

### System User & Privileges

The `adam` user handles all administrative tasks. SSH-key authentication and passwordless `sudo` via the `wheel` group minimize friction while maintaining security.

**Create the Admin User**

```bash
# Create the user with a bash shell
useradd -m -s /bin/bash adam

# Create the wheel group (common for cross-distro consistency)
groupadd wheel

# Create a modular sudoers file with safety checks
# This allows members of 'wheel' to run sudo without a password
echo "%wheel ALL=(ALL) NOPASSWD: ALL" | sudo visudo -c -f /etc/sudoers.d/99-root-ermnvldmr

# Add adam to the necessary groups
usermod -aG wheel,docker adam
```

### SSH Hardening & Key Management

Passwords are disabled. Access is strictly via SSH keys.

**Secure SSH Directory**

Set strict permissions immediately to prevent the SSH daemon from rejecting the keys.

```bash
# Setup directories as root for the adam user
mkdir -p /home/adam/.ssh
chmod 700 /home/adam/.ssh

# Add your public key (Replace [PASTE_PUB_KEY_HERE])
echo "[PASTE_PUB_KEY_HERE]" > /home/adam/.ssh/authorized_keys
chmod 600 /home/adam/.ssh/authorized_keys
chown -R adam:adam /home/adam/.ssh
```

**Harden SSH Daemon**

Modify the SSH configuration to change the default port and disable password entry.

```bash
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
# Generate a host-specific SSH key (no passphrase for automation)
ssh-keygen -t ed25519 -f /home/adam/.ssh/adam-at-deytenit_github_com_ed25519 -N ""

# Display the public key to be added to GitHub (Settings > Deploy Keys)
cat /home/adam/.ssh/adam-at-deytenit_github_com_ed25519.pub
```

> [!TIP]
> Add the output above to the [GitHub: Repository Deploy Keys](https://github.com/deytenit/root.ermnvldmr.com/settings/keys) with **read access**.

### Install Docker Engine

Install the standard Docker Engine for Debian.

```bash
# Follow official guide: https://docs.docker.com/engine/install/debian/
# Once installed, verify (Adam can run this without sudo now)
docker run --rm hello-world
```

### Repository Deployment

Clone the infrastructure repository and initialize the node.

```bash
# Setup the service directory
export REPO_DIR="/srv/root.ermnvldmr.com"
sudo mkdir -p $REPO_DIR
sudo chown adam:adam $REPO_DIR

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
# Run the sequence for your specific node
./$NODE/.host/.scripts/00-base
./$NODE/.host/.scripts/10-ufw
./$NODE/.host/.scripts/20-crowd
./$NODE/.host/.scripts/30-cron
```

### Storage & Hardening

Define the data tiers and secure the environment by creating non-root users for containerized services.

```bash
# Create (or mount) storage directories
sudo mkdir -p /srv/com-ermnvldmr-root-$NODE-{tier1,tier2,tier3}

# Setup tiers and non-root users
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
