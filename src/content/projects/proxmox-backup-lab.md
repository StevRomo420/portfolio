---
order: 2
code: PROD-002
title: Proxmox Backup Infrastructure
subtitle: Production Virtualization / Backup & Recovery
status: IN PRODUCTION
featured: false
stack: [Proxmox VE, Windows Server, NFS, vzdump]
summary: I built this production backup path to store Proxmox VM backups on a Windows Server NFS repository and make restores easy to verify.
architectureImage: /images/proxmox-backup-production-architecture.svg
architectureMobileImage: /images/proxmox-backup-production-architecture-mobile.svg
architectureCaption: BACKUP AND RECOVERY ARCHITECTURE
---

I built and maintain this backup setup for virtual machines running in production. The work went beyond mounting an NFS share: I had to account for identity mapping, failed mounts, transfer reliability and restore testing.

For a recovery, I select an available backup from Proxmox, restore the virtual machine and check that it boots and provides the expected services.

The diagram is intentionally simplified. I left out hostnames, network details, storage paths, capacity, schedules, retention settings and configuration values to protect the organization.
