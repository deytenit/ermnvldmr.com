packer {
  required_plugins {
    qemu = {
      version = ">= 1.1.0"
      source  = "github.com/hashicorp/qemu"
    }
  }
}

variable "debian_iso_url" {
  type    = string
  default = "https://cdimage.debian.org/cdimage/archive/12.8.0/amd64/iso-cd/debian-12.8.0-amd64-netinst.iso"
}

variable "debian_iso_checksum" {
  type    = string
  default = "file:https://cdimage.debian.org/cdimage/archive/12.8.0/amd64/iso-cd/SHA512SUMS"
}

variable "vm_name" {
  type    = string
  default = "com-ermnvldmr-debian-12-k3s-amd64.qcow2"
}

variable "accelerator" {
  type    = string
  default = "kvm"
}

variable "efi_firmware_code" {
  type    = string
  default = "/usr/share/OVMF/OVMF_CODE.fd"
}

variable "efi_firmware_vars" {
  type    = string
  default = "/usr/share/OVMF/OVMF_VARS.fd"
}

source "qemu" "debian_k3s" {
  iso_url           = var.debian_iso_url
  iso_checksum      = var.debian_iso_checksum
  output_directory  = "output-qemu"
  shutdown_command  = "echo 'packer' | sudo -S shutdown -P now"
  disk_size         = "10G"
  format            = "qcow2"
  accelerator       = var.accelerator
  http_directory    = "ci/packer/http"
  ssh_username      = "root"
  ssh_password      = "packer"
  ssh_timeout       = "25m"
  vm_name           = var.vm_name
  net_device        = "virtio-net"
  disk_interface    = "virtio"
  efi_boot          = true
  efi_firmware_code = var.efi_firmware_code
  efi_firmware_vars = var.efi_firmware_vars

  qemuargs = [
    ["-m", "2048M"],
    ["-smp", "2"],
    ["-serial", "mon:stdio"]
  ]

  boot_wait = "5s"
  boot_command = [
    "<wait><wait><wait>c<wait>",
    "linux /install.amd/vmlinuz auto=true priority=critical preseed/url=http://{{ .HTTPIP }}:{{ .HTTPPort }}/preseed.cfg --- quiet<enter>",
    "initrd /install.amd/initrd.gz<enter>",
    "boot<enter>"
  ]
}

build {
  sources = ["source.qemu.debian_k3s"]

  provisioner "shell" {
    scripts = [
      "ci/packer/scripts/01-base-system.sh",
      "ci/packer/scripts/02-install-k3s.sh",
      "ci/packer/scripts/03-cleanup.sh"
    ]
  }

  post-processor "shell-local" {
    inline = [
      "echo 'Optimizing qcow2 image with 2M cluster size...'",
      "qemu-img convert -f qcow2 -O qcow2 -o cluster_size=2M -c output-qemu/${var.vm_name} output-qemu/debian-12-k3s-optimized.qcow2",
      "mv output-qemu/debian-12-k3s-optimized.qcow2 output-qemu/${var.vm_name}"
    ]
  }
}
