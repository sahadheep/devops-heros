# AWS S3 (Simple Storage Service) — Object Storage

## 1. What is S3?
Amazon Simple Storage Service (Amazon S3) is an industry-leading object storage service offering 99.999999999% (11 9's) of data durability, high availability, virtually unlimited scalability, and robust security.

---

## 2. Core S3 Concepts

| Concept | Definition | Key Characteristics |
|---|---|---|
| **Buckets** | Top-level containers for storing objects | Globally unique name across all AWS accounts; tied to a specific AWS region. |
| **Objects** | Fundamental entities stored in S3 | Consists of data (0 bytes to 5 TB), metadata (key-value pairs), and unique key identifier. |
| **Versioning** | Preserves multiple variants of an object | Protects against unintended overwrites or accidental deletions via delete markers. |
| **Lifecycle Policies** | Automated tiering and expiration rules | Moves older objects to cheaper storage tiers (e.g., Glacier after 30 days) and deletes expired logs. |
| **Encryption** | Data protection at rest and in transit | At rest: SSE-S3 (AES-256), SSE-KMS, SSE-C. In transit: HTTPS (TLS 1.2+). |
| **Bucket Policies** | Resource-based JSON access policies | Controls access per bucket, prefix, IP address range, or requires SSL enforcement. |

---

## 3. S3 Storage Classes Matrix

| Storage Class | Availability | Retrieval Fee | Minimum Duration | Ideal Use Case |
|---|---|---|---|---|
| **S3 Standard** | 99.99% | None | None | Frequently accessed data, active websites |
| **S3 Intelligent-Tiering** | 99.9% | None | 30 days | Data with unpredictable or unknown access patterns |
| **S3 Standard-IA** | 99.9% | Per GB retrieved | 30 days | Long-lived backups accessed once/twice a month |
| **S3 One Zone-IA** | 99.5% | Per GB retrieved | 30 days | Re-creatable secondary backups |
| **S3 Glacier Flexible** | 99.99% | Per GB retrieved | 90 days | Archival data retrievable in minutes to hours |
| **S3 Glacier Deep Archive** | 99.99% | Per GB retrieved | 180 days | Regulatory compliance archives (retrieval: 12-48h) |

---

## 4. Sample S3 Bucket Policy (Enforce HTTPS)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureHTTPConnections",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::sahadheep-terraform-s3-demo-bucket",
        "arn:aws:s3:::sahadheep-terraform-s3-demo-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

---

## 5. Common Use Cases
- **Terraform Remote State Backend**: Storing `terraform.tfstate` with S3 versioning and DynamoDB state locking.
- **Static Website Hosting**: Hosting single-page web applications (React, Vue, HTML/CSS).
- **Data Lake Storage**: Centralized storage for analytics pipelines (Athena, EMR, Redshift Spectrum).
- **Backup & Disaster Recovery**: Secondary off-site retention for database snapshots and VM backups.
