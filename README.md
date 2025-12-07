# 🚀 Multi-Tier ECS Fargate Deployment (React Frontend + Node Backend)

This project is a fully containerized **multi-tier application** deployed on **AWS ECS Fargate**, powered by a complete **CI/CD pipeline using Jenkins**, **Docker**, and **Amazon ECR**.  
It follows real production standards: secure IAM roles, isolated VPC networking, ALB routing, rolling deployments, and CloudWatch logging.

All sensitive values such as **AWS Account ID**, **region**, **ECR URIs**, **ALB DNS**, **cluster names**, and **service names** are masked.

---

# 🏗️ Architecture Overview

This project consists of:

### **Compute**
- AWS ECS Fargate Cluster  
- Two ECS Services:
  - **frontend-service** (React → served via Nginx)
  - **backend-service** (Node.js API)
- Each service runs as a separate **Task Definition**

### **Networking**
- VPC with public + private subnets  
- **Public ALB** → routes to Frontend tasks  
- **Internal ALB** → routes to Backend tasks  
- Security-groups-based tier isolation  
- NAT Gateway or VPC Endpoints for private subnets  

### **Container Registry**
- Amazon ECR repositories:
  - `frontend-repo` → `xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/frontend-repo`
  - `backend-repo`  → `xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/backend-repo`

### **IAM**
- ECS Task Execution Role  
- ECS Task Role  
- Jenkins EC2 IAM Role  
- Least-privilege access for ECR, ECS, CloudWatch

### **CI/CD**
- Jenkins pipeline:
  - Clone repo  
  - Build Docker images  
  - Tag + Push to ECR  
  - Update ECS task definitions  
  - Trigger rolling deployment  
  - Health-checked release  

---

# 🖼️ Architecture Diagram

```
Insert your architecture diagram here:
                          ┌──────────────────────────┐
                          │         Internet         │
                          └──────────────────────────┘
                                      │
                                      ▼
                      ┌───────────────────────────────────┐
                      │     Public ALB (frontend-alb)     │
                      │  DNS: frontend-alb-xxxx.elb...    │
                      └───────────────────────────────────┘
                                      │  (HTTP /)
                                      ▼
        ┌───────────────────────────────────────────────────────────────────┐
        │                         VPC (10.0.0.0/16)                         │
        │                                                                   │

        │   ┌──────────────────────── PUBLIC SUBNETS ─────────────────────┐ │
        │   │                                                             │ │
        │   │   ┌───────────────────────┐   ┌───────────────────────┐     │ │
        │   │   │  FE Task (Fargate)    │   │  FE Task (Fargate)    │     │ │
        │   │   │  frontend-service     │   │  frontend-service     │     │ │
        │   │   │  Port: 80             │   │  Port: 80             │     │ │
        │   │   └───────────────────────┘   └───────────────────────┘     │ │
        │   │                                                             │ │
        │   │        ┌──────────────────────────────────────────┐         │ │
        │   │        │ FRONTEND TARGET GROUP (HTTP:80)          │         │ │
        │   │        └──────────────────────────────────────────┘         │ │
        │   └─────────────────────────────────────────────────────────────┘ │

        │   ┌────────────────────── PRIVATE SUBNETS ──────────────────────┐ │
        │   │                                                             │ │
        │   │   ┌───────────────────────┐   ┌───────────────────────┐     │ │
        │   │   │  BE Task (Fargate)    │   │  BE Task (Fargate)    │     │ │
        │   │   │  backend-service      │   │  backend-service      │     │ │
        │   │   │  Port: 5001           │   │  Port: 5001           │     │ │
        │   │   └───────────────────────┘   └───────────────────────┘     │ │
        │   │                                                             │ │
        │   │        ┌──────────────────────────────────────────┐         │ │
        │   │        │ BACKEND TARGET GROUP (HTTP:5001)         │         │ │
        │   │        └──────────────────────────────────────────┘         │ │
        │   │                                                             │ │
        │   │        ┌──────────────────────────────────────────┐         │ │
        │   │        │ INTERNAL ALB (backend-alb)               │         │ │
        │   │        │ DNS: internal-backend-alb-xxxx.elb...    │         │ │
        │   │        └──────────────────────────────────────────┘         │ │
        │   └─────────────────────────────────────────────────────────────┘ │

        │    FE → BE Calls:
        │       Frontend → http://internal-backend-alb/api/message         │
        │                                                                   │
        └───────────────────────────────────────────────────────────────────┘

Extra Components:
 ┌────────────────────────────────────────────────────────────────────────┐
 │ ECR (frontend + backend repos) for images                              │
 │ IAM Task Role for image pulls                                          │
 │ VPC Endpoints (optional: ECR, S3, Logs) for private-only networking    │
 │ NAT Gateway (only if FE needs outbound Internet)                       │
 └────────────────────────────────────────────────────────────────────────┘
```

---

# 📂 Repository Structure

```
node-app-ecs-deployment/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── routes/
│   └── tests/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── …
│
├── docker-compose.yml
│
├── Jenkinsfile
├── Jenkinsfile_local
├── Jenkinsfile_local_deploy
│
└── ecs-task-definitions/
    ├── backend.json
    └── frontend.json
```

---

# 🧪 Local Development (docker-compose)

Run both services locally:

```
docker-compose up --build
```

- Frontend → http://localhost:3000  
- Backend → http://localhost:5001  
- Internal API calls tested locally  

---

# 🐳 Dockerfiles

### **Backend Dockerfile**

- Base: `node:18-alpine`  
- Install dependencies  
- Copy code  
- Expose port `5001`  
- Start Node server  

### **Frontend Dockerfile (Multi-Stage)**

- Stage 1: Build React  
- Stage 2: Serve using Nginx  
- Expose port `80`  

---

# 🔐 Image Tagging Strategy

- `latest`  
- `build-${BUILD_NUMBER}`  
- `${GIT_COMMIT}`  

---

# 🔄 CI/CD Pipeline (Jenkins → ECR → ECS)

### **Pipeline Stages**
1. Checkout code  
2. Install backend dependencies  
3. Install frontend dependencies  
4. Build Docker images  
5. Tag & Push images to ECR  
6. Register updated ECS task definitions  
7. Update ECS services  
8. Rolling deployment with ALB health checks  

### **Masked Env Vars (example)**
```
AWS_REGION=xx-xxxx-x
AWS_ACCOUNT_ID=xxxxxxxxxxxx
FRONTEND_ECR=xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/frontend-repo
BACKEND_ECR=xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/backend-repo
ECS_CLUSTER=ecs-cluster-xxxxx
FRONTEND_SERVICE=frontend-svc-xxxxx
BACKEND_SERVICE=backend-svc-xxxxx
```

---

# 🧩 ECS Task Definitions (Masked Examples)

### **frontend.json**
```
{
  "family": "frontend-task-xxxxx",
  "executionRoleArn": "arn:aws:iam::xxxxxxxxxxxx:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::xxxxxxxxxxxx:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/frontend-repo:latest",
      "portMappings": [{ "containerPort": 80 }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": "xx-xxxx-x",
          "awslogs-group": "/ecs/frontend",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512"
}
```

### **backend.json**
```
{
  "family": "backend-task-xxxxx",
  "executionRoleArn": "arn:aws:iam::xxxxxxxxxxxx:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::xxxxxxxxxxxx:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/backend-repo:latest",
      "portMappings": [{ "containerPort": 5001 }],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-region": "xx-xxxx-x",
          "awslogs-group": "/ecs/backend",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ],
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512"
}
```

---

# 🔒 Security Group Design (All Masked)

### **Frontend SG (`sg-frontend-xxxxx`)**
- Inbound:
  - `80` from ALB SG (`sg-alb-public-xxxxx`)
- Outbound:
  - `80` to backend SG

### **Backend SG (`sg-backend-xxxxx`)**
- Inbound:
  - `5001` from frontend SG
- Outbound:
  - NAT or VPC endpoint

### **ALB Public SG (`sg-alb-public-xxxxx`)**
- Inbound: `80` from `0.0.0.0/0`

### **ALB Internal SG (`sg-alb-internal-xxxxx`)**
- Inbound: `80` from frontend SG

---

# 🌐 VPC & Networking

### **VPC CIDR**
```
10.0.0.0/16
```

### **Subnets**
- Public Subnets → ALB  
- Private Subnets → ECS tasks  

### **Routing**
- Public Route Table → IGW  
- Private Route Table → NAT or VPC endpoints  

### **Optional Endpoints**
- ECR  
- S3  
- Logs  

---

# 📊 Rolling Deployment Behavior

- **desiredCount:** 2  
- **minHealthyPercent:** 100  
- **maxPercent:** 200  

Flow:
1. New tasks start  
2. ALB waits for health checks  
3. Old tasks drain  
4. Traffic shifts  
5. Zero downtime  

---

# 📸 Screenshots (Add Later)

Add:
- ECS service page  
- Target groups  
- Healthy tasks  
- Jenkins pipeline  
- ALB output  
- Frontend running  

---

# 📘 What I Learned

- Multi-tier architecture  
- Inter-service communication via internal ALB  
- Secure IAM role patterns (execution vs task role)  
- CI/CD for microservices using Jenkins  
- ECS Fargate task definitions  
- Rolling deployments with ALB  
- Containerization of full-stack apps  
- VPC networking + subnet isolation  

---

# 📌 Notes

- All AWS ARNs, DNS names, ECR URIs, cluster/service names, and account IDs are masked for security.
- Replace masked placeholders after deployment.

---
