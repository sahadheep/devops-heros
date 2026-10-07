# Session 11: Kubernetes Networking & Services

## Resources
- https://github.com/Nency-Ravaliya/Kubernetes
- https://kubernetes.io/docs/concepts/services-networking/service/
- https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/

---

# Task 1: Kubernetes Services (All 5 Types)

A Kubernetes Service is an abstraction that defines a logical set of Pods and a policy by which to access them (with stable IP and DNS names).

```
                              +------------------------+
                              |    CLIENT TRAFFIC      |
                              +------------------------+
                                          |
                      +-------------------+-------------------+
                      |                   |                   |
                      v                   v                   v
              [ LoadBalancer ]       [ NodePort ]       [ ClusterIP ]
              (Cloud External IP)    (NodeIP:30000+)    (Internal Only)
                      |                   |                   |
                      +-------------------+-------------------+
                                          |
                                          v
                                    [ Endpoints ]
                                          |
                        +-----------------+-----------------+
                        |                                   |
                        v                                   v
                 [ Backend Pod 1 ]                   [ Backend Pod 2 ]
```

---

## 01. ClusterIP Service
ClusterIP is the default Service type. It gives the Service an internal virtual IP address reachable only from within the Kubernetes cluster.

### Commands Used:
```bash
kubectl apply -f 01-clusterip/app-deployment.yaml
kubectl apply -f 01-clusterip/service.yaml
kubectl get svc backend-service -o wide
kubectl exec client-pod -- curl -s http://backend-service:8080
```

### Observation & Explanation:
The backend deployment was exposed internally via ClusterIP `10.104.45.180`. The client pod successfully connected using the internal DNS name `backend-service:8080`. External traffic cannot reach this IP.

![ClusterIP Service](01-clusterip.png)

---

## 02. NodePort Service
NodePort exposes the Service on each worker node's IP address at a static port (in range `30000-32767`). External clients can access the application via `<NodeIP>:<NodePort>`.

### Commands Used:
```bash
kubectl apply -f 02-nodeport/app-deployment.yaml
kubectl apply -f 02-nodeport/service.yaml
kubectl get svc web-nodeport-service
curl -s http://192.168.49.2:30080
```

### Observation & Explanation:
The NodePort service opened port `30080` across all cluster nodes. Sending an HTTP request from outside the cluster directly to `192.168.49.2:30080` routed traffic to the healthy web pod.

![NodePort Service](02-nodeport.png)

---

## 03. LoadBalancer Service
LoadBalancer integrates with cloud providers (AWS, GCP, Azure) or bare-metal balancers (MetalLB) to provision a dedicated external cloud load balancer IP.

### Commands Used:
```bash
kubectl apply -f 03-loadbalancer/app-deployment.yaml
kubectl apply -f 03-loadbalancer/service.yaml
kubectl get svc frontend-lb-service
curl -s http://192.168.49.95:80
```

### Observation & Explanation:
The LoadBalancer service received an external public IP (`192.168.49.95`). Traffic sent to port 80 was automatically distributed across all backend pod replicas.

![LoadBalancer Service](03-loadbalancer.png)

---

## 04. ExternalName Service
ExternalName maps a Kubernetes Service to an external DNS name (like `api.github.com` or an external Amazon RDS endpoint) using a DNS CNAME record, without any proxying or pod selectors.

### Commands Used:
```bash
kubectl apply -f 04-externalname/service.yaml
kubectl get svc external-api-service
kubectl exec client-pod -- nslookup external-api-service
```

### Observation & Explanation:
Querying `external-api-service` inside the cluster returned a CNAME record pointing directly to `api.github.com`, enabling microservices to refer to external dependencies with a static internal name.

![ExternalName Service](04-externalname.png)

---

## 05. Headless Service (`clusterIP: None`)
Headless Service defines `clusterIP: None` and does not allocate a single virtual cluster IP. Instead, DNS returns the direct IP addresses of all backing pods (or individual SRV records for StatefulSets).

### Commands Used:
```bash
kubectl apply -f 05-headless/service.yaml
kubectl apply -f 05-headless/app-statefulset.yaml
kubectl get svc database-headless
kubectl exec client-pod -- nslookup database-headless
```

### Observation & Explanation:
Running `nslookup database-headless` returned the individual IP addresses of each replica (`database-0` at `10.244.0.14` and `database-1` at `10.244.0.15`), enabling direct peer-to-peer communication needed for databases (Cassandra, Redis, MongoDB).

![Headless Service](05-headless.png)

---

# Task 2: Kubernetes Object Comparisons

## 1. Deployment vs ReplicaSet

| Feature | ReplicaSet | Deployment |
|---|---|---|
| **Purpose** | Ensures a specified number of identical pod replicas are running at all times. | High-level declarative controller for managing Pods and ReplicaSets with zero-downtime updates. |
| **Pod Management** | Manages pods directly through label selectors. | Manages underlying ReplicaSets, which in turn manage pods. |
| **Scaling** | Supports manual scaling (`kubectl scale rs`). | Supports declarative scaling and Auto-scaling (HPA). |
| **Rolling Updates** | Cannot perform rolling updates natively; requires manual pod recreation. | Natively handles zero-downtime rolling updates, pause/resume, and rollbacks (`kubectl rollout undo`). |
| **Relationship** | The lower-level building block. | Creates, owns, and coordinates multiple ReplicaSets (old vs new version). |

---

## 2. Deployment vs DaemonSet vs StatefulSet

| Feature | Deployment | DaemonSet | StatefulSet |
|---|---|---|---|
| **Use Cases** | Stateless web apps, APIs, microservices. | Node-level background agents (logging, monitoring, storage drivers). | Stateful applications (databases, message queues: Postgres, Kafka, Redis). |
| **Pod Creation** | Randomly named pods (`app-759cf8-xk9l2`) created concurrently in any order. | One pod per matched worker node in the cluster. | Ordered, deterministic named pods (`db-0`, `db-1`, `db-2`) created sequentially. |
| **Scaling** | Scaled up or down randomly. | Automatically scales as nodes are added or removed from the cluster. | Scaled up or down sequentially in strict ordered reverse index. |
| **Networking** | Ephemeral pod IPs behind a shared Service. | Direct host port or node-level network. | Stable dedicated network identity and DNS FQDN for each pod (`pod-0.headless-svc`). |
| **Storage** | Ephemeral storage or shared ReadWriteMany volumes. | HostPath or local storage. | Dedicated, persistent storage per pod using VolumeClaimTemplates (`pvc-db-0`). |
| **Examples** | Nginx, Node.js, Spring Boot API. | Fluentd, Prometheus Node Exporter, kube-proxy. | PostgreSQL HA, MongoDB ReplicaSet, Elasticsearch. |

---

## 3. ReplicaSet vs Service

1. **ReplicaSet Responsibility**: Focuses entirely on **pod lifecycle and quantity**. It monitors pod health and maintains the desired number of running replicas. It does not provide network routing, DNS names, or load balancing.
2. **Service Responsibility**: Focuses entirely on **networking and discovery**. It creates a persistent virtual IP (ClusterIP) and DNS entry that routes incoming traffic to healthy pods via Endpoints/EndpointSlices.
3. **Why a Service is Required**: Pods in Kubernetes are ephemeral and dynamic; their IP addresses change every time they are restarted or updated. A Service provides a single, permanent endpoint so other applications do not need to track changing pod IPs.
4. **How Traffic Reaches Pods**:
   - The Service uses `selector: app=my-app` to match labels on pods.
   - The Endpoints controller tracks matching ready pod IPs and populates the EndpointSlice object.
   - `kube-proxy` on worker nodes programs iptables / IPVS rules so packets to the Service IP are load-balanced across the real pod IPs.

---

# Additional Documentation Modules

- **Task 3: [FQDN Documentation Guide](fqdn/README.md)** (Kubernetes Service DNS, naming conventions, search domains, cross-namespace resolution, and real examples).
- **Task 4: [CoreDNS Documentation Guide](coredns/README.md)** (CoreDNS architecture, plugin pipeline, query resolution flow, Corefile configuration, and DNS troubleshooting steps).
