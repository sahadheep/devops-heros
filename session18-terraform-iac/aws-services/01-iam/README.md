# AWS IAM (Identity and Access Management) — Governance

## 1. What is IAM?
AWS Identity and Access Management (IAM) is a foundational web service that provides centralized access control, authentication, and authorization for AWS resources and APIs. IAM is a **global** service with no region selection required.

---

## 2. Core IAM Concepts

| Concept | Definition | Example / Use Case |
|---|---|---|
| **Users** | An identity representing a specific human or system requiring long-term access | Developer `sahadheep` with console access |
| **Groups** | A collection of IAM users used to attach permissions collectively | `DevOps-Admins`, `Developers`, `Auditors` |
| **Roles** | An identity with temporary security credentials assumed by trusted entities | EC2 instance role accessing S3, Lambda execution role |
| **Policies** | JSON documents defining explicit `Allow` or `Deny` permissions | Managed policies (`AmazonS3ReadOnlyAccess`) |
| **Permissions** | Rules specifying actions allowed on specific resource ARNs | `"Action": ["s3:GetObject"], "Resource": "arn:aws:s3:::*"` |

---

## 3. Principle of Least Privilege
- **Definition**: Granting only the bare minimum permissions necessary to perform a designated task, for only the duration required.
- **Implementation**:
  - Never grant `AdministratorAccess` or `*:*` for day-to-day operations.
  - Use resource-level ARNs instead of wildcards (`arn:aws:s3:::my-bucket/*`).
  - Restrict actions to specific read/write operations (e.g., `s3:PutObject`).

---

## 4. Sample IAM Policy (JSON)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWriteDemoBucket",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::sahadheep-terraform-s3-demo-bucket",
        "arn:aws:s3:::sahadheep-terraform-s3-demo-bucket/*"
      ]
    }
  ]
}
```

---

## 5. IAM Best Practices
1. **Root Account Security**: Lock away the root user credentials; enable hardware MFA; never use root for daily tasks.
2. **Individual Credentials**: Create individual IAM users with strong password policies and MFA enabled.
3. **Use Groups**: Assign permissions to groups, then add users to groups.
4. **Use Roles for Services**: Never embed AWS access keys inside applications; use IAM Roles with EC2, ECS, or Lambda.
5. **Rotate Access Keys Regularly**: Rotate API access keys every 90 days.
6. **Auditing with Access Advisor & IAM Policy Simulator**: Regularly review unused permissions and remove inactive credentials.

---

## 6. Common Use Cases
- Delegating cross-account access securely without sharing passwords.
- Granting GitHub Actions temporary deploy credentials via OIDC (OpenID Connect).
- Enforcing organization-wide compliance with Service Control Policies (SCPs) in AWS Organizations.
