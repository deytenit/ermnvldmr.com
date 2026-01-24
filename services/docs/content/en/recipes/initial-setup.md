---
title: "Initial Host Setup"
description: "Setting up a fresh Debian host from scratch"
weight: 1
type: docs
---

How to set up a fresh Debian host from zero to deployment.

## Add Adam User and Wheel Group

Adam is a core user on each of the system.
It does not has password,
hence only connection via ssh is available,
providing a password-less sudo.

```bash
# Add adam user
useradd -m -s '/bin/bash' adam

# Add wheel group for password-less sudo
groupadd wheel
vi /etc/sudoers.d/99-root-ermnvldmr
```

Fill file with the content:

```visudo
%wheel         ALL = (ALL) NOPASSWD: ALL
```

## Configure SSH

Hardening SSHD,
even stupidly changing port.

```bash
# Move public ssh key of user adam to the server
vi /home/adam/.ssh/authorized_keys

# Create additional ssh rules
vi /etc/ssh/sshd_config.d/99-root-ermnvldmr.conf
```

With the following content:

```conf
Port 2222
PasswordAuthentication no
PermitEmptyPasswords no
AllowUsers adam
```

## Install Docker

Follow the official Docker installation guide for Debian --
[docs.docker.com](https://docs.docker.com/engine/install/debian/)

Test Docker installation:

```bash
docker --version
docker compose version
```

## Clone the root.ermnvldmr.com Repository

```bash
# Clone to your preferred location
cd /srv
sudo mkdir root.ermnvldmr.com
sudo chown adam:adam root.ermnvldmr.com

# Clone the repository
git clone git@github.com:deytenit/root.ermnvldmr.com.git root.ermnvldmr.com

# Run the repository initialization
./init.sh
```

## Setup node

> [!IMPORTANT]
> From now on `$NODE` equals node name of the server you are setting up.

> [!NOTE]
> More about root.ermnvldmr.com compositions repository -- [github.com](https://github.com/)

Run node-specific scripts in $NODE/.host/.scripts
in order of their numbering:

```bash
# For example for node daedalus

# Setting up the base components
./daedalus/.host/.scripts/00-base
# Setting up ufw with rules defined in ./daedalus/.host/ufw
./daedalus/.host/.scripts/10-ufw
# Setting up crowdsec with rules defined in ./daedalus/.host/crowd
./daedalus/.host/.scripts/20-crowd
# Setting up cron with tasks defined in ./daedalus/.host/cron
./daedalus/.host/.scripts/30-cron
```

## Setup Storage Tiers

You need to decide where to store your data tiers:

```bash
# Create storage directories
sudo mkdir -p /srv/com-ermnvldmr-root-$NODE-{tier1,tier2,tier3}

# Setup tiers for the node
.scripts/ops/setup-tiers $NODE \
  /srv/com-ermnvldmr-root-$NODE-tier1 \
  /srv/com-ermnvldmr-root-$NODE-tier2 \
  /srv/com-ermnvldmr-root-$NODE-tier3
```

## Setup noroot-users

To harden the containers running on the node,
we create series of noroot-users and shared group
for each project in the compose repository node directory.

```bash
# Setup noroot-users for the node
.scripts/ops/setup-noroot-users $NODE
```
