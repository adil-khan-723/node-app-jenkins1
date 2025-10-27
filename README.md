# DevOps Full Stack Project (React + Node + Docker)

This project demonstrates a simple **Full Stack Application** setup with **React (frontend)**, **Node.js (backend)**, and **MongoDB**, all containerized with **Docker** and orchestrated via **Docker Compose**.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- Docker & Docker Compose  
- Node.js (optional, for local testing)  
- Git  

---

## 📁 Project Overview

- **Frontend:** React app  
- **Backend:** Node.js + Express + MongoDB  
- **Database:** MongoDB (Docker container)  
- **Reverse Proxy:** Optional Nginx (can be added later)  

---

## 🧩 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/devops-fullstack-app.git
cd devops-fullstack-app
```

### 2. Folder Structure
```
frontend/     → React app
backend/      → Node.js + Express app
docker-compose.yml
```

---

## 🐳 Docker Setup

### 3. Build and Run Containers
From the project root directory:
```bash
docker-compose up --build
```

### 4. Access the App
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000  

---

## ⚙️ Environment Variables

You can configure your own `.env` files for:
- `frontend/.env`
- `backend/.env`

Example for backend `.env`:
```
MONGO_URI=mongodb://mongo:27017/mydb
PORT=5000
```

---

## 🔧 Docker Compose Overview

The `docker-compose.yml` connects:
- **frontend** → built from `frontend/Dockerfile`
- **backend** → built from `backend/Dockerfile`
- **mongo** → official MongoDB image

Ensure to include the `depends_on` property:
```yaml
depends_on:
  - backend
  - mongo
```

---

## 🧾 Git Ignore Setup

### Frontend:
`.gitignore` automatically created by `create-react-app`.

### Backend:
Manually create a `.gitignore` file with:
```
node_modules/
.env
```

---

## 🧹 Cleanup

To stop and remove all containers:
```bash
docker-compose down
```

To remove volumes as well:
```bash
docker-compose down -v
```

---

## 🧠 Notes

- Make sure ports `3000`, `5000`, and `27017` are free before running.  
- Use `.env` files for sensitive data.  
- You can extend this project with Nginx, CI/CD, and testing workflows.

---

## 🧰 Tech Stack
- React  
- Node.js + Express  
- MongoDB  
- Docker + Docker Compose  