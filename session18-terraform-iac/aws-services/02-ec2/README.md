# AWS EC2 (Elastic Compute Cloud) — Compute

## 1. What is EC2?
Amazon Elastic Compute Cloud (Amazon EC2) provides resizable, secure virtual servers (known as instances) in the cloud. It eliminates upfront hardware investments and enables rapid capacity scaling on demand.

---

## 2. Core EC2 Building Blocks

| Component | Purpose | Description |
|---|---|---|
| **AMI (Amazon Machine Image)** | Operating System Template | Pre-configured template containing OS, software packages, and boot volume config (e.g., Ubuntu 24.04, Amazon Linux 2023). |
| **Instance Types** | Hardware Sizing | Combinations of CPU, memory, storage, and networking. Families include: General Purpose (`t4g`, `m6i`), Compute Optimized (`c7g`), Memory Optimized (`r7g`). |
| **Key Pairs** | SSH / RDP Authentication | Public/private key pair used to securely log in to instances without passwords (`ssh -i key.pem ubuntu@<ip>`). |
| **Security Groups** | Virtual Firewall | Stateful firewall controlling inbound/outbound network traffic at the instance interface level. |
| **EBS (Elastic Block Store)** | Persistent Block Storage | High-performance network-attached block storage volumes retained independently of instance termination (e.g., `gp3`, `io2`). |

---

## 3. Public vs Private IP Addresses

| Feature | Public IPv4 | Private IPv4 | Elastic IP (EIP) |
|---|---|---|---|
| **Routability** | Accessible over public Internet | Reachable only within VPC / VPN | Static public IP over Internet |
| **Persistence** | Changes upon instance Stop/Start | Retained until instance termination | Stays assigned until released |
| **Primary Use** | Web servers, public load balancers | Backend databases, microservices | Static public endpoints |

---

## 4. EC2 Instance Lifecycle

```text
Launch ──► Pending ──► Running ──► Stopping ──► Stopped ──► Terminated
                          │                       │
                          ▼                       ▼
                       Reboot                 Start (new IP)
```
- **Running**: Active virtual machine billed per second.
- **Stopped**: CPU and RAM released; EBS storage charges persist; public IPv4 is released.
- **Terminated**: Instance permanently destroyed; root EBS volume deleted (if `DeleteOnTermination: true`).

---

## 5. Security Groups Configuration Rules
- **Stateful**: Return traffic is automatically allowed regardless of inbound rules.
- **Default Behavior**: All inbound traffic is blocked; all outbound traffic is allowed.
- **Rule Example**:
  - Inbound: Port 22 (SSH) from `MyIP/32`
  - Inbound: Port 80 (HTTP) & 443 (HTTPS) from `0.0.0.0/0`

---

## 6. Common Use Cases
- Hosting microservices, APIs, and monolithic web applications.
- Running self-hosted CI/CD runners (e.g., GitHub Actions self-hosted runners).
- Big data processing, machine learning training, and high-performance computing (HPC).
