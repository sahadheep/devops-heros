# AWS Database Services — DynamoDB (NoSQL) & RDS (Relational)

A comprehensive comparison and operational overview of Amazon DynamoDB and Amazon Relational Database Service (Amazon RDS).

---

# Part 1: Amazon DynamoDB (NoSQL)

## 1. What is DynamoDB?
Amazon DynamoDB is a fully managed, serverless, key-value and document NoSQL database designed to deliver single-digit millisecond latency at any scale with automatic data replication across three Availability Zones.

## 2. Core DynamoDB Concepts

| Concept | Definition | Relational Analogy |
|---|---|---|
| **Table** | A collection of data records | Table |
| **Item** | A single record uniquely identifiable by a primary key | Row |
| **Attribute** | A fundamental data element (schema-less) | Column |
| **Partition Key (PK)** | Mandatory hash attribute determining physical partition storage | Primary Key |
| **Sort Key (SK)** | Optional range attribute sorting items sharing the same PK | Composite Primary Key |

### Primary Key Configurations
1. **Simple Primary Key**: Partition key only (e.g., `UserId`).
2. **Composite Primary Key**: Partition key + Sort key (e.g., `UserId` [PK] + `Timestamp` [SK]).

## 3. DynamoDB Use Cases
- **Terraform State Locking**: Acquires distributed write locks during `terraform apply` using a `LockID` attribute.
- **Session State Management**: High-volume, low-latency user sessions with Time-to-Live (TTL) expiration.
- **Mobile Gaming Leaderboards & IoT Sensor Ingestion**: Hundreds of thousands of writes per second with automatic scaling.

---

# Part 2: Amazon RDS (Relational Database Service)

## 1. What is RDS?
Amazon RDS is a fully managed relational database service that automates administrative tasks such as hardware provisioning, database setup, patching, automated backups, and failure recovery.

## 2. Core RDS Concepts & Architecture

| Concept | Purpose | Details |
|---|---|---|
| **Supported Engines** | SQL Dialects | PostgreSQL, MySQL, MariaDB, Oracle, Microsoft SQL Server, Amazon Aurora |
| **DB Instance Class** | Compute & Memory | Standard (`db.m6g`), Memory-Optimized (`db.r6g`), Burstable (`db.t4g`) |
| **Security** | Isolation & Access Control | Encrypted at rest via AWS KMS (AES-256), isolated inside private VPC subnets with DB Subnet Groups |
| **Automated Backups** | Point-in-Time Recovery (PITR) | Automated daily snapshots + transaction logs retained up to 35 days |
| **Multi-AZ Deployment** | High Availability & Failover | Synchronous standby replica in another AZ; automatic failover within 60-120s |
| **Read Replicas** | Read Scalability | Asynchronous read-only copies (up to 15) offloading read-heavy workloads |

---

# Part 3: DynamoDB vs RDS Architectural Comparison

| Dimension | Amazon DynamoDB | Amazon RDS |
|---|---|---|
| **Data Model** | NoSQL (Key-Value / Document) | Relational (SQL Tables with Foreign Keys) |
| **Schema** | Flexible / Dynamic schema | Strict, predefined schema |
| **Scaling** | Horizontal (Serverless on-demand or provisioned) | Vertical instance resizing + Horizontal Read Replicas |
| **Latency** | Single-digit milliseconds | Single-digit to tens of milliseconds |
| **Complex Joins / ACID** | Limited joins; ACID transactions supported | Full SQL syntax, complex joins, subqueries |
| **Typical Workloads** | High throughput, simple lookups, IoT, state locks | ERP, CRM, transactional banking, e-commerce orders |
