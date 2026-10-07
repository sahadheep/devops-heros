# CoreDNS in Kubernetes Architecture & Service Discovery

## 1. What is CoreDNS?

**CoreDNS** is a flexible, extensible, and high-performance DNS server written in Go that acts as the default internal cluster DNS system in modern Kubernetes clusters (replacing the legacy kube-dns).

It is deployed as a Kubernetes Deployment within the `kube-system` namespace, managed by a ReplicaSet with 2 replicas for high availability, and exposed through a Service named `kube-dns` on port 53 (TCP/UDP).

---

## 2. Why Kubernetes Uses CoreDNS

1. **Lightweight & Fast**: Compiled into a single statically linked binary with low memory footprint and high query throughput.
2. **Plugin Architecture**: Functionality is modular. CoreDNS builds its feature set through chained plugins (`kubernetes`, `forward`, `cache`, `errors`, `health`, `metrics`).
3. **Dynamic API Watching**: Integrates directly with the Kubernetes API Server to automatically update DNS records when Services, Endpoints, or Pods are created, scaled, or deleted.

---

## 3. How Service Discovery Works in Kubernetes

Service Discovery allows applications to discover and connect to dynamic microservices automatically without hardcoding IP addresses.

```
       [ Client Pod ]
             |
             | 1. DNS Query: "auth-service"
             v
      [ CoreDNS (kube-dns) ]  <--- (2. Watches K8s API Server for new Services/Pods)
             |
             | 3. Returns ClusterIP (10.100.1.20)
             v
       [ Client Pod ]
             |
             | 4. TCP Packet to 10.100.1.20
             v
       [ kube-proxy ]  (iptables / IPVS translates to Pod IP)
             |
             +--------------------+
             |                    |
             v                    v
      [ auth-pod-1 ]       [ auth-pod-2 ]
```

1. CoreDNS watches the Kubernetes API Server for changes in `Service` and `EndpointSlice` objects.
2. When a Service is created, CoreDNS immediately registers an `A` record for `<service>.<namespace>.svc.cluster.local`.
3. When client pods query the service name, CoreDNS responds with the virtual ClusterIP.
4. `kube-proxy` on the local node routes the traffic to an active, ready backend pod.

---

## 4. How DNS Queries are Resolved

When a process inside a pod makes a network call:

1. **Local Pod Resolver**: Inspects `/etc/resolv.conf` and determines whether the name contains fewer than 5 dots (`ndots:5`).
2. **Search Domain Expansion**: Appends search domains sequentially (`default.svc.cluster.local` -> `svc.cluster.local` -> `cluster.local`).
3. **CoreDNS Lookup**: Sends the query to the nameserver IP `10.96.0.10:53`.
4. **Internal vs External Routing**:
   - If the query matches `*.cluster.local`, the `kubernetes` plugin resolves it from internal cluster state.
   - If the query is an external domain (e.g. `api.github.com`), the `forward` plugin forwards it to the host node's `/etc/resolv.conf` upstream DNS servers (e.g. `8.8.8.8`).
5. **Caching**: CoreDNS caches the response according to TTL settings and returns the IP to the client pod.

---

## 5. CoreDNS Configuration (`Corefile`)

CoreDNS is configured via a ConfigMap named `coredns` in `kube-system`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
           lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
           ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

### Key Plugins Explained:
- **`kubernetes`**: Serves DNS queries for Kubernetes services and pods.
- **`forward . /etc/resolv.conf`**: Forwards non-cluster domain queries to external DNS servers.
- **`cache 30`**: Caches DNS query responses for 30 seconds to minimize load on the API server.
- **`errors`**: Logs query errors to stdout for troubleshooting.
- **`health` & `ready`**: Exposes HTTP health check endpoints (`:8080/health`, `:8181/ready`).

---

## 6. How to Troubleshoot DNS Issues

When pods fail to resolve service domain names, use this systematic checklist:

### 1. Check CoreDNS Pod Status
```bash
kubectl get pods -n kube-system -l k8s-app=kube-dns
```
Ensure both CoreDNS replicas are in `Running` state.

### 2. Inspect CoreDNS Logs
```bash
kubectl logs -n kube-system -l k8s-app=kube-dns -f
```
Look for upstream forwarding timeouts, network unreachability, or syntax errors.

### 3. Test DNS Resolution using a Debug Pod
```bash
kubectl run dnsutils --image=tutum/dnsutils --rm -it --restart=Never -- bash

# Inside the debug container:
nslookup kubernetes.default
nslookup <service-name>
dig @10.96.0.10 <service-name>.default.svc.cluster.local
```

### 4. Verify Pod's `/etc/resolv.conf`
```bash
kubectl exec <pod-name> -- cat /etc/resolv.conf
```
Ensure `nameserver` points to the `kube-dns` service IP (`10.96.0.10`).
