# Fully Qualified Domain Name (FQDN) in Kubernetes

## 1. What is FQDN?

A **Fully Qualified Domain Name (FQDN)** is the complete, unambiguous domain name that specifies the exact location of a host in the Domain Name System (DNS) hierarchy. It includes all domain levels, from the hostname up to the top-level domain (TLD).

In traditional networking, an example is `mail.google.com.`. In Kubernetes, every Service and Pod gets an internal FQDN automatically assigned by the cluster DNS service (CoreDNS).

---

## 2. Kubernetes Service DNS Structure

In Kubernetes, every Service created in a cluster is assigned a consistent DNS record with the following FQDN pattern:

```text
<service-name>.<namespace>.svc.cluster.local
```

### Breakdown of Components:
1. **`<service-name>`**: The `metadata.name` defined in the Service YAML (e.g. `backend-service`).
2. **`<namespace>`**: The namespace where the Service resides (e.g. `default`, `prod`, `dev`).
3. **`svc`**: Indicates that the DNS record belongs to a Kubernetes Service.
4. **`cluster.local`**: The default cluster domain suffix configured during cluster initialization.

---

## 3. Kubernetes DNS Naming Convention & Search Domains

When a Pod runs in Kubernetes, `kubelet` automatically injects `/etc/resolv.conf` into every container with cluster search domains:

```text
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

Because of these search paths, applications can communicate using shortened domain names without typing the full FQDN:
- **Same Namespace**: `http://backend-service:8080` (resolves via `default.svc.cluster.local`).
- **Cross Namespace**: `http://backend-service.prod:8080` (resolves via `prod.svc.cluster.local`).
- **Full Absolute FQDN**: `http://backend-service.prod.svc.cluster.local:8080` (resolves directly without search domain traversal).

---

## 4. Namespace-Based DNS Resolution

```
+------------------------------------+      +------------------------------------+
|         NAMESPACE: DEV             |      |         NAMESPACE: PROD            |
|                                    |      |                                    |
|   [ Frontend Pod ]                 |      |   [ Backend Service ]              |
|          |                         |      |         |                          |
|          +------------------------------------------+                          |
|             http://backend.prod:8080           |                               |
|                                                v                               |
|                                           [ Pod 1 ]  [ Pod 2 ]                 |
+------------------------------------+      +------------------------------------+
```

1. **Same-namespace query**: A pod in `dev` querying `auth-service` reaches `auth-service.dev.svc.cluster.local`.
2. **Cross-namespace query**: A pod in `dev` querying `auth-service.prod` reaches `auth-service.prod.svc.cluster.local`.

---

## 5. Pod-to-Service Communication Flow

1. The client container in Pod A calls `http://payment-service:8080`.
2. The container sends a UDP DNS request to CoreDNS (`10.96.0.10:53`).
3. CoreDNS matches `payment-service.default.svc.cluster.local` and returns the virtual ClusterIP (e.g. `10.104.20.50`).
4. Pod A sends TCP packets to `10.104.20.50:8080`.
5. The local worker node's `kube-proxy` (via iptables/IPVS) translates the virtual IP to an actual healthy backend Pod IP (e.g. `10.244.1.25:8080`).

---

## 6. Real Examples of Kubernetes FQDNs

| Resource Type | Example FQDN | Resolves To |
|---|---|---|
| Standard ClusterIP Service | `mysql.database.svc.cluster.local` | Virtual ClusterIP (`10.100.5.15`) |
| Headless Service (Direct Service Record) | `mongodb-headless.db.svc.cluster.local` | Multiple Pod IPs (`10.244.0.5`, `10.244.1.9`) |
| StatefulSet Individual Pod | `redis-0.redis-headless.cache.svc.cluster.local` | Dedicated IP of pod `redis-0` |
| ExternalName Service | `payments.billing.svc.cluster.local` | CNAME alias `api.stripe.com` |
