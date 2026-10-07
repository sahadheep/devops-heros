# Task 1: Kubernetes Volumes & Persistent Storage

Kubernetes storage decouples persistent data from ephemeral container lifecycles.

---

## 1. emptyDir Volume
- **Concept**: An ephemeral temporary volume created when a Pod is assigned to a Node. It exists as long as that Pod runs on that node.
- **Use Cases**: Temporary scratch space, cache directories, and sharing data between multiple containers inside the same Pod.
- **Lifecycle**: Erased permanently when the Pod is deleted or evicted.

### Example YAML:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: emptydir-demo
spec:
  containers:
  - name: writer
    image: alpine
    command: ["/bin/sh", "-c", "echo 'Cached Data' > /cache/data.txt; sleep 3600"]
    volumeMounts:
    - name: cache-vol
      mountPath: /cache
  - name: reader
    image: alpine
    command: ["/bin/sh", "-c", "sleep 5; cat /cache/data.txt; sleep 3600"]
    volumeMounts:
    - name: cache-vol
      mountPath: /cache
  volumes:
  - name: cache-vol
    emptyDir: {}
```

---

## 2. hostPath Volume
- **Concept**: Mounts a file or directory from the host worker node's filesystem directly into the container.
- **Use Cases**: System daemons, log collectors (Fluentd accessing `/var/log`), container monitoring agents (cAdvisor accessing `/var/lib/docker`).
- **Limitation**: Tightly couples the Pod to a specific node; if the pod moves to another node, data will not follow.

### Example YAML:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-demo
spec:
  containers:
  - name: log-collector
    image: alpine
    command: ["sleep", "3600"]
    volumeMounts:
    - name: node-logs
      mountPath: /var/log/host
      readOnly: true
  volumes:
  - name: node-logs
    hostPath:
      path: /var/log
      type: Directory
```

---

## 3. PersistentVolume (PV)
- **Concept**: A cluster-scoped storage resource provisioned by an administrator or dynamically through a StorageClass. It has an independent lifecycle from any individual Pod that uses it.
- **Properties**: Capacity, Access Modes (`ReadWriteOnce`, `ReadOnlyMany`, `ReadWriteMany`), Reclaim Policy (`Retain`, `Delete`, `Recycle`).

### Example YAML:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: task-pv-volume
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: "/mnt/data"
```

---

## 4. PersistentVolumeClaim (PVC)
- **Concept**: A user's request for storage. Pods do not claim PVs directly; instead, they reference a PVC. Kubernetes binds the PVC to a matching available PV.
- **Binding Criteria**: Matching storage capacity, access modes, and StorageClass name.

### Example YAML:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: task-pv-claim
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

---

## 5. StorageClass & Dynamic Provisioning
- **Concept**: StorageClass enables **Dynamic Provisioning**, eliminating the need for cluster administrators to pre-provision storage disks manually.
- **How Dynamic Provisioning Works**:
  1. A user applies a PVC requesting a specific `StorageClass` (e.g., `gp3` on AWS, `standard` on GCP/Minikube).
  2. The CSI (Container Storage Interface) driver automatically provisions the backend cloud volume on demand.
  3. A corresponding PersistentVolume is automatically created and bound to the PVC in seconds.

### Example YAML:
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ebs
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp3
```
