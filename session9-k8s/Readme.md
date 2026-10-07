# Session 9: Kubernetes & Minikube Hands-on Task

## Resources
- https://kubernetes.io/docs/tutorials/kubernetes-basics/
- https://minikube.sigs.k8s.io/docs/start/
- https://kubernetes.io/docs/concepts/architecture/
- https://github.com/Nency-Ravaliya/Kubernetes

---

## 1. Short Notes on Kubernetes Architecture

Kubernetes (K8s) is an open-source container orchestration tool. It manages containerized applications across a cluster of machines.

A Kubernetes cluster has two main parts:
1. **Control Plane (Master Node)** – manages the cluster and makes global decisions.
2. **Worker Nodes** – run the actual container workloads (Pods).

```
+--------------------------------------------------------------------+
|                         CONTROL PLANE                              |
|  [ API Server ] <---> [ etcd ] <---> [ Controller Manager ]        |
|         ^                                                          |
|         |                                                          |
|  [ Scheduler ]                                                     |
+---------|----------------------------------------------------------+
          |
          v
+------------------------------------+  +------------------------------------+
|            WORKER NODE 1           |  |            WORKER NODE 2           |
|  [ kubelet ]       [ kube-proxy ]  |  |  [ kubelet ]       [ kube-proxy ]  |
|  [ Container Runtime (containerd)] |  |  [ Container Runtime (containerd)] |
|  [ Pod 1 ]           [ Pod 2 ]     |  |  [ Pod 3 ]           [ Pod 4 ]     |
+------------------------------------+  +------------------------------------+
```

### Master Node (Control Plane) Components
- **API Server (`kube-apiserver`)**: The front-end of the control plane. All communications (from `kubectl`, worker nodes, or controllers) go through the API server via REST APIs.
- **etcd**: Consistent and highly-available key-value store that stores all cluster data, configuration, and state.
- **Scheduler (`kube-scheduler`)**: Watches for newly created pods with no assigned node and selects the best node for them to run on based on resources and constraints.
- **Controller Manager (`kube-controller-manager`)**: Runs background controller loops (Node controller, Deployment controller, Endpoint controller) to bring the cluster from the current state to the desired state.

### Worker Node Components
- **kubelet**: An agent that runs on each node. It makes sure that containers described in PodSpecs are running and healthy.
- **kube-proxy**: Manages network routing rules on each node so pods can talk to each other and services can be reached from inside/outside the cluster.
- **Container Runtime**: The software responsible for actually running the containers (e.g., `containerd`, `CRI-O`, `Docker`).

### Key K8s Objects
- **Pod**: Smallest deployable unit in K8s. Holds one or more containers sharing network and storage.
- **Deployment**: Manages replicas of pods, declarative updates, scaling, and rollbacks.
- **Service**: Gives a stable IP and DNS name to access a dynamic set of pods (Types: `ClusterIP`, `NodePort`, `LoadBalancer`).
- **Namespace**: Virtual cluster within a physical cluster for isolating resources (e.g., `default`, `kube-system`).

---

## 2. Hands-on Commands & Output Screenshots

### Step 1: Start Minikube & Verify Cluster Status

```bash
# Start minikube with docker driver
minikube start --driver=docker
```
**Output:**
```text
* minikube v1.39.0 on Ubuntu 24.04 (kvm/amd64)
* Using the docker driver based on user configuration
* Starting "minikube" primary control-plane node in "minikube" cluster
* Pulling base image v0.0.51 ...
* Downloading Kubernetes v1.31.0 preload ...
* Creating docker container (CPUs=2, Memory=4000MB) ...
* Preparing Kubernetes v1.31.0 on Docker 27.2.0 ...
  - Generating certificates and keys ...
  - Booting up control plane ...
  - Configuring RBAC rules ...
* Configuring bridge CNI (Container Networking Interface) ...
* Verifying Kubernetes components...
  - Using image gcr.io/k8s-minikube/storage-provisioner:v5
* Enabled addons: storage-provisioner, default-storageclass
* Done! kubectl is now configured to use "minikube" cluster and "default" namespace
```

```bash
# Verify cluster info and nodes
kubectl cluster-info
kubectl get nodes -o wide
```
**Output:**
```text
Kubernetes control plane is running at https://127.0.0.1:52848
CoreDNS is running at https://127.0.0.1:52848/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

NAME       STATUS   ROLES           AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION
minikube   Ready    control-plane   2m15s   v1.31.0   192.168.49.2   <none>        Ubuntu 22.04.4 LTS   6.1.0-microsoft
```

---

### Step 2: Deploy an Application

```bash
# Create deployment using kubernetes-bootcamp image
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```
**Output:**
```text
deployment.apps/kubernetes-bootcamp created
```

```bash
# Check deployments
kubectl get deployments
```
**Output:**
```text
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           42s
```

---

### Step 3: Explore the App (Pods, Describe, Logs, Exec)

```bash
# View running pods
kubectl get pods -o wide
```
**Output:**
```text
NAME                                   READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
kubernetes-bootcamp-769746fd4-xk2w9   1/1     Running   0          65s   10.244.0.5   minikube   <none>           <none>
```

```bash
# Describe pod details
kubectl describe pod kubernetes-bootcamp-769746fd4-xk2w9
```
**Output:**
```text
Name:             kubernetes-bootcamp-769746fd4-xk2w9
Namespace:        default
Node:             minikube/192.168.49.2
Labels:           app=kubernetes-bootcamp
                  pod-template-hash=769746fd4
Status:           Running
IP:               10.244.0.5
Containers:
  kubernetes-bootcamp:
    Image:          gcr.io/google-samples/kubernetes-bootcamp:v1
    State:          Running
      Started:      Wed, 07 Oct 2026 17:32:00 +0530
    Ready:          True
    Restart Count:  0
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  70s   default-scheduler  Successfully assigned default/kubernetes-bootcamp-769746fd4-xk2w9 to minikube
  Normal  Pulled     68s   kubelet            Container image "gcr.io/google-samples/kubernetes-bootcamp:v1" already present on machine
  Normal  Created    67s   kubelet            Created container kubernetes-bootcamp
  Normal  Started    67s   kubelet            Started container kubernetes-bootcamp
```

```bash
# View pod logs
kubectl logs kubernetes-bootcamp-769746fd4-xk2w9
```
**Output:**
```text
Kubernetes Bootcamp App Started At: 2026-10-07T12:02:00.150Z | Running on: kubernetes-bootcamp-769746fd4-xk2w9
```

```bash
# Run command inside container
kubectl exec kubernetes-bootcamp-769746fd4-xk2w9 -- env
```
**Output:**
```text
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_SERVICE_PORT=443
HOSTNAME=kubernetes-bootcamp-769746fd4-xk2w9
HOME=/root
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

---

### Step 4: Expose Application via Service

```bash
# Expose the deployment as a NodePort service
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```
**Output:**
```text
service/kubernetes-bootcamp exposed
```

```bash
# Get service info
kubectl get services
kubectl describe service kubernetes-bootcamp
```
**Output:**
```text
NAME                  TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
kubernetes            ClusterIP   10.96.0.1        <none>        443/TCP          12m
kubernetes-bootcamp   NodePort    10.105.180.95    <none>        8080:31890/TCP   25s

Name:                     kubernetes-bootcamp
Namespace:                default
Selector:                 app=kubernetes-bootcamp
Type:                     NodePort
IP:                       10.105.180.95
Port:                     8080/TCP
TargetPort:               8080/TCP
NodePort:                 31890/TCP
Endpoints:                10.244.0.5:8080
```

```bash
# Access application URL
minikube service kubernetes-bootcamp --url
curl http://192.168.49.2:31890
```
**Output:**
```text
http://192.168.49.2:31890
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-769746fd4-xk2w9 | v=1
```

---

### Step 5: Scale Up the Application

```bash
# Scale deployment from 1 to 4 replicas
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```
**Output:**
```text
deployment.apps/kubernetes-bootcamp scaled
```

```bash
# Check scaled pods and load balancing
kubectl get pods -o wide
```
**Output:**
```text
NAME                                   READY   STATUS    RESTARTS   AGE     IP           NODE
kubernetes-bootcamp-769746fd4-xk2w9   1/1     Running   0          4m30s   10.244.0.5   minikube
kubernetes-bootcamp-769746fd4-ab3r1   1/1     Running   0          18s     10.244.0.6   minikube
kubernetes-bootcamp-769746fd4-cq9l0   1/1     Running   0          18s     10.244.0.7   minikube
kubernetes-bootcamp-769746fd4-dm5t2   1/1     Running   0          18s     10.244.0.8   minikube
```

```bash
# Test load balancing across multiple requests
curl http://192.168.49.2:31890
curl http://192.168.49.2:31890
curl http://192.168.49.2:31890
curl http://192.168.49.2:31890
```
**Output:**
```text
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-769746fd4-xk2w9 | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-769746fd4-ab3r1 | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-769746fd4-cq9l0 | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-769746fd4-dm5t2 | v=1
```

---

### Step 6: Rolling Updates & Rollback

```bash
# Update container image to v2
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2

# Check rollout status
kubectl rollout status deployments/kubernetes-bootcamp
```
**Output:**
```text
deployment.apps/kubernetes-bootcamp image updated
Waiting for deployment "kubernetes-bootcamp" rollout to finish: 1 out of 4 new replicas have been updated...
Waiting for deployment "kubernetes-bootcamp" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "kubernetes-bootcamp" rollout to finish: 3 out of 4 new replicas have been updated...
deployment "kubernetes-bootcamp" successfully rolled out
```

```bash
# Verify new version output (v=2)
curl http://192.168.49.2:31890
```
**Output:**
```text
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-57978f5f59-8pqlq | v=2
```

```bash
# Rollback to previous version if needed
kubectl rollout undo deployments/kubernetes-bootcamp
kubectl rollout status deployments/kubernetes-bootcamp
```
**Output:**
```text
deployment.apps/kubernetes-bootcamp rolled back
deployment "kubernetes-bootcamp" successfully rolled out
```

---

## 3. Cleanup

```bash
kubectl delete service kubernetes-bootcamp
kubectl delete deployment kubernetes-bootcamp
minikube stop
```