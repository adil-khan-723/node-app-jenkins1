# 🚀 Multi-Tier ECS Fargate Deployment (React Frontend + Node Backend)

This project is a fully containerized **multi-tier application** deployed on **AWS ECS Fargate**, including:
- React Frontend
- Node.js Backend API
- Public and Internal ALBs
- Secure VPC architecture
- Private networking
- Manual deployments through AWS Console only

This project demonstrates production-grade AWS knowledge:  
VPC networking, subnets, ALBs, ECR, ECS Fargate, IAM, security groups, load balancing, internal service communication, and rolling updates.

All AWS-sensitive values are masked:  
**AWS Account ID**, **region**, **ECR URIs**, **ALB DNS**, **cluster names**, **service names**.

---------------------------------------------------------------------

# 🏗️ Architecture Overview (Console Deployment)

### **Compute**
- ECS Fargate Cluster  
- `frontend-service` – runs React 
- `backend-service` – runs Node.js API  
- Each deployed using **AWS Console → Task Definition → Service → Deploy**

### **Networking**
- 1 VPC → 10.0.0.0/16
- 2 Public Subnets (Frontend)
- 2 Private Subnets (Backend)
- Public ALB → Frontend Tasks
- Internal ALB → Backend Tasks
- Frontend → Backend communication via internal ALB DNS
- NAT/VPC Endpoints (optional)

### **Container Registry**
- Two ECR repositories:
  - `frontend-repo`
  - `backend-repo`

### **IAM**
- ECS Task Execution Role  
- ECS Task Role  
- EC2/Jenkins roles (optional for image builds)

### **Deployment Method**
- **Everything deployed manually using the AWS Console**
- Docker images built on EC2 and pushed to ECR manually  
- Tasks and Services created through ECS Console  
- Load balancers created through EC2 Console  
- Target groups configured manually  
- No automatic CI/CD is used in this project

---------------------------------------------------------------------

# 🖼️ Architecture Diagram (ASCII)

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
```
Extra Components:
 ┌────────────────────────────────────────────────────────────────────────┐
 │ ECR (frontend + backend repos) for images                              │
 │ IAM Task Role for ECR pull                                             │
 │ VPC Endpoints (optional: ECR, S3, Logs)                                │
 │ NAT Gateway (only if FE needs Internet access)                         │
 └────────────────────────────────────────────────────────────────────────┘
```
---------------------------------------------------------------------

# 📂 Repository Structure
```
node-app-ecs-deployment/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── routes/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│
├── docker-compose.yml
├── Jenkinsfile_local (optional)
└── ecs-task-definitions/
    ├── backend.json
    └── frontend.json
```
---------------------------------------------------------------------

# 🧪 Local Development (docker-compose)

Run both services locally:

docker-compose up --build

- Frontend → http://localhost:3000  
- Backend → http://localhost:5001  
- React → Node API tested locally  

---------------------------------------------------------------------

# 🐳 Dockerfiles Overview

### Backend Dockerfile
- Node.js 18 Alpine  
- Installs dependencies  
- Exposes port 5001  

### Frontend Dockerfile (Multi-Stage)
- Stage 1: React build  
- Stage 2: Nginx serving static files  
- Exposes port 80  

---------------------------------------------------------------------

# 🔐 Image Tagging Strategy
- latest  
- build-{timestamp}  
- commit-hash  

---------------------------------------------------------------------

# 📦 Manual Deployment Flow (AWS Console Only)

### 1. Build Docker images (EC2 or local)
docker build -t frontend .
docker build -t backend .

### 2. Tag for ECR
```
docker tag frontend:latest xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/frontend-repo:latest
docker tag backend:latest  xxxxxxxxxxxx.dkr.ecr.xx-xxxx-x.amazonaws.com/backend-repo:latest
```
### 3. Push to ECR
```
aws ecr get-login-password | docker login …
docker push …
```
### 4. Create Task Definitions (console)
- Add container ports  
- Use awsvpc mode  
- Assign task roles  

### 5. Create Target Groups (frontend TG + backend TG)

### 6. Create ALBs  
- Public ALB → Frontend TG  
- Internal ALB → Backend TG  

### 7. Create ECS Services (console)
- frontend-service in public subnets  
- backend-service in private subnets  
- Attach correct ALB target groups  
- Set desired count = 2  

### 8. Test Routing  
- Frontend calls backend via ALB:
  http://internal-backend-alb/api/message

---------------------------------------------------------------------

# 🔒 Security Group Rules

### Frontend SG
Inbound:
- 80 from ALB Public SG

Outbound:
- 80 to Backend SG

### Backend SG
Inbound:
- 5001 from Frontend SG

Outbound:
- NAT or VPC endpoints

### Public ALB SG
Inbound:
- 80 from world (0.0.0.0/0)

### Internal ALB SG
Inbound:
- 80 from Frontend SG

---------------------------------------------------------------------

# 📊 Rolling Deployment Behavior (Console)

- desiredCount: 2  
- minHealthyPercent: 100  
- maxPercent: 200  

AWS launched new tasks → waits for health → drains old → replaces → zero downtime.

---------------------------------------------------------------------

# 📸 Screenshots (to add)
- ALB page  
- ECS service  
- Task health  
- Private subnets  
- React frontend output  

---------------------------------------------------------------------

# 📘 Learnings

- Multi-tier AWS architecture  
- Inter-service communication through Internal ALB  
- Secure private/public subnet design  
- ECS task design  
- ALB listener rules  
- Zero downtime deployments  
- Networking fundamentals: SG, TG, ALB, subnets  
- Real-world Docker → ECR → ECS flow  

---------------------------------------------------------------------

# 📌 Notes

- All ARNs, IDs, DNS names are masked.  
- Replace placeholders in your own deployment.

---------------------------------------------------------------------
