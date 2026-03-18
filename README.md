# 🚀 End-to-End DevOps GitOps Project (Docker + Kubernetes + Helm + ArgoCD)

## 📌 Overview

This project demonstrates a **complete real-world DevOps workflow** using:

* Docker (containerization)
* Kubernetes (Minikube)
* Helm (package management)
* ArgoCD (GitOps deployment)
* GitHub Actions (CI automation)

👉 The goal is to implement a **fully automated CI/CD + GitOps pipeline** where:

* Code changes trigger image builds
* Image updates are stored in Git
* ArgoCD automatically deploys to Kubernetes

---

## 🧱 Architecture

```
Developer → GitHub → CI Pipeline → Docker Hub → GitOps Repo → ArgoCD → Kubernetes
```

---

## 🛠️ Technologies Used

* Docker
* Kubernetes (Minikube)
* Helm
* ArgoCD
* GitHub Actions
* Node.js (sample app)

---

## 📦 Step 1: Application Setup

Created a simple Node.js app:

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('DevOps Project Running 🚀');
});

app.listen(3000);
```

---

## 🐳 Step 2: Dockerization

Dockerfile:

```Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "index.js"]
```

Build & run:

```bash
docker build -t devops-app:v1 .
docker run -p 3000:3000 devops-app:v1
```

---

## ☁️ Step 3: Push to Docker Hub

```bash
docker tag devops-app:v1 sagarbindudash/devops-app:v1
docker push sagarbindudash/devops-app:v1
```

---

## 🔄 Step 4: CI Automation (GitHub Actions)

Workflow:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  docker:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: sagarbindudash/devops-app:${{ github.run_number }}
```

---

## ☸️ Step 5: Kubernetes Setup (Minikube)

```bash
minikube start
kubectl get nodes
```

---

## 📦 Step 6: Helm Deployment

```bash
helm create devops-chart
```

### values.yaml

```yaml
image:
  repository: sagarbindudash/devops-app
  tag: "1"
  pullPolicy: Always
```

### Key Fixes:

* containerPort → 3000
* targetPort → 3000

Deploy:

```bash
helm install devops-app .
```

Access:

```bash
kubectl port-forward svc/devops-app-devops-chart 8080:3000
```

---

## 🚀 Step 7: ArgoCD Setup

```bash
kubectl create namespace argocd

kubectl apply -n argocd -f \
https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Access UI:

```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

Login:

* Username: admin
* Password: (generated/reset manually)

---

## 📂 Step 8: GitOps Repository

👉 GitOps Repo:
https://github.com/sagarbindudash/devops-gitops

Push Helm chart:

```bash
git init
git add .
git commit -m "helm chart"
git remote add origin https://github.com/sagarbindudash/devops-gitops.git
git push -u origin main
```

---

## 🔗 Step 9: ArgoCD Application

Configured in ArgoCD UI:

* Repo: devops-gitops
* Path: `.`
* Cluster: default
* Namespace: default

Enabled:

* Auto Sync ✅
* Self Heal ✅
* Prune ✅

---

## 🔥 Step 10: GitOps in Action

Update `values.yaml`:

```yaml
tag: "2"
```

Push changes:

```bash
git commit -am "update image"
git push
```

👉 ArgoCD automatically:

* Detects change
* Syncs application
* Deploys new version

---

# 🐞 Troubleshooting (Real Issues Faced)

---

## ❌ 1. ErrImagePull

**Issue:**

```
pull access denied
```

**Fix:**

* Incorrect image tag
* Updated `values.yaml` with correct tag

---

## ❌ 2. Port Forward Error

**Issue:**

```
connection refused
```

**Fix:**

* App runs on port 3000
* Updated:

```yaml
containerPort: 3000
targetPort: 3000
```

---

## ❌ 3. Helm YAML Error

**Issue:**

```
cannot unmarshal string
```

**Fix:**

* Correct YAML indentation

---

## ❌ 4. ArgoCD Login Failed

**Issue:**

* Password not working

**Fix:**

* Reset via `argocd-secret`

---

## ❌ 5. Repo Not Accessible

**Issue:**

```
repository not found
```

**Fix:**

* Made repo public OR
* Added GitHub token

---

## ❌ 6. Minikube Cluster Errors

**Issue:**

* API server not reachable

**Fix:**

```bash
minikube delete
minikube start
```

---

# 🧠 Key Learnings

* GitOps = Git is the single source of truth
* ArgoCD continuously syncs desired state
* No manual deployments required
* YAML indentation is critical
* Port mismatches are common issues

---


# 🚀 Future Enhancements

* Add Prometheus + Grafana monitoring
  <img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/73b6c2af-0e0b-4252-abac-e27752a405ae" />

* Implement Ingress (custom domain)
* Add HPA (autoscaling)
* Automate Helm updates via CI pipeline

---

# 👨‍💻 Author

Sagar Bindu Dash
DevOps Engineer

---
