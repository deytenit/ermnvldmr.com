packer {
  required_plugins {
    qemu = {
      version = ">= 1.1.0"
      source  = "github.com/hashicorp/qemu"
    }
  }
}

variable "debian_cloud_image_url" {
  type    = string
  default = "https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-nocloud-amd64.qcow2"
}

variable "debian_cloud_image_checksum" {
  type    = string
  default = "file:https://cloud.debian.org/images/cloud/bookworm/latest/SHA512SUMS"
}

variable "vm_name" {
  type    = string
  default = "com-ermnvldmr-debian-12-k3s-amd64.qcow2"
}

variable "accelerator" {
  type    = string
  default = "kvm"
}

source "qemu" "debian_k3s" {
  iso_url           = var.debian_cloud_image_url
  iso_checksum      = var.debian_cloud_image_checksum
  disk_image        = true
  disk_size         = "10G"
  format            = "qcow2"
  output_directory  = "output-qemu"
  shutdown_command  = "echo 'packer' | sudo -S shutdown -P now"
  accelerator       = var.accelerator
  cd_files          = ["ci/packer/cidata/user-data", "ci/packer/cidata/meta-data"]
  cd_label          = "cidata"
  ssh_username      = "debian"
  ssh_password      = "packer"
  ssh_timeout       = "5m"
  vm_name           = var.vm_name
  net_device        = "virtio-net"
  disk_interface    = "virtio"
  headless          = true

  qemuargs = [
    ["-m", "2048M"],
    ["-smp", "2"]
  ]
}

build {
  sources = ["source.qemu.debian_k3s"]

  provisioner "shell" {
    execute_command = "echo 'packer' | sudo -S sh -c '{{ .Vars }} {{ .Path }}'"
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
