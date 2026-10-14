# AWS VPC (Virtual Private Cloud) — Networking

## 1. What is VPC?
Amazon Virtual Private Cloud (Amazon VPC) enables you to provision a logically isolated, customizable virtual network in the AWS cloud. You maintain complete control over IP address ranges, subnets, route tables, and network gateways.

---

## 2. Core VPC Networking Components

| Component | Responsibility | Typical Configuration |
|---|---|---|
| **CIDR Block** | IP address range assigned to the VPC | `10.0.0.0/16` (65,536 private IPv4 addresses) |
| **Subnets** | Segmented IP partitions within an Availability Zone | Public (`10.0.1.0/24`), Private (`10.0.2.0/24`) |
| **Route Table** | Set of rules determining where network traffic is directed | Route `0.0.0.0/0` -> `igw-xxx` |
| **Internet Gateway (IGW)** | Horizontally scaled VPC component enabling Internet access | Attached directly to VPC; handles IPv4 NAT |
| **NAT Gateway** | Enables private subnets to reach Internet for updates | Deployed in Public Subnet with an Elastic IP |
| **Security Groups** | Stateful firewall at the instance/ENI level | Operates at Layer 4 (Ports, Protocols) |
| **Network ACLs (NACL)** | Stateless subnet-level firewall | Evaluates numbered rules in order (Allow/Deny) |

---

## 3. Public vs Private Subnets

```text
               +-------------------------------------------------------+
               |                       VPC                             |
               |                                                       |
               |   +-----------------------+   Internet Gateway (IGW)  |
Internet <========>|     PUBLIC SUBNET     |<==========================+
               |   |   (Web Server / NAT)  |                           |
               |   +-----------▲-----------+                           |
               |               │ NAT Route                             |
               |   +-----------▼-----------+                           |
               |   |    PRIVATE SUBNET     | (No direct route to IGW)  |
               |   | (Backend DB / Redis)  |                           |
               |   +-----------------------+                           |
               +-------------------------------------------------------+
```

| Criteria | Public Subnet | Private Subnet |
|---|---|---|
| **Route to Internet** | Route table has `0.0.0.0/0` -> Internet Gateway | Route table has `0.0.0.0/0` -> NAT Gateway (or none) |
| **Public IP Assignment** | Auto-assign public IPv4 enabled | Auto-assign public IPv4 disabled |
| **Workloads Hosted** | ALBs, Bastion Hosts, NAT Gateways | Application servers, RDS databases, EKS worker nodes |

---

## 4. Security Groups vs Network ACLs (NACLs)

| Feature | Security Group (SG) | Network ACL (NACL) |
|---|---|---|
| **Operating Level** | Instance / ENI level | Subnet boundary level |
| **State Nature** | **Stateful** (Return traffic automatically allowed) | **Stateless** (Inbound & Outbound evaluated separately) |
| **Rule Types** | Supports **Allow** rules only | Supports both **Allow** and **Deny** rules |
| **Rule Order** | Evaluates all rules simultaneously | Evaluates numbered rules in sequential order |

---

## 5. Common Use Cases
- **Standard 3-Tier Web Architecture**: Public subnets for load balancers, private subnets for app servers, isolated database subnets.
- **Hybrid Cloud Connectivity**: Connecting on-premises data centers to AWS via AWS Site-to-Site VPN or AWS Direct Connect.
- **Multi-VPC Peering & Transit Gateway**: Interconnecting hundreds of microservice VPCs across accounts centrally.
