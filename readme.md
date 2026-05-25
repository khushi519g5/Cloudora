# 📚 Cloudora


**Author:** Khushi Mittal

---

## 🚀 Overview

A full-stack intelligent learning platform that tracks user activity and recommends personalized educational resources using a behavior-driven recommendation engine.

The system combines:

Activity tracking
Recommendation logic
Analytics
Notification system
RAG-based retrieval for intelligent resource suggestions

It helps students discover relevant learning materials based on interactions and semantic similarity.

## ✨ Key Features

### 👤 Authentication & Roles
- Secure login system
- Role-based access (Student / Admin)
- Protected routes

---

### 📚 Resource Management
- Add and manage learning resources
- Each resource contains:
  - Name
  - URL
  - Category (optional)
- Tracks resource views and engagement

---

### 🔥 Trending System
- Identifies popular resources automatically
- Based on user activity and views

---

### 🧠 Recommendation System
- Tracks user behavior (views, clicks)
- Suggests relevant resources dynamically
- Personalized recommendations per user

---

### 📊 Analytics Dashboard
- User activity insights
- Resource engagement statistics
- Most viewed resources
- System usage tracking

---

### 🔔 Notification System
- New resource notifications
- Recommendation alerts
- Read / unread status support

---

### 📄 RAG-based Document Q&A System
Admin uploads PDF documents
System processes and chunks documents
Embedding-based retrieval finds relevant sections
LLM answers user questions using selected document context
Enables AskAI-style intelligent document interaction


## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge&logo=bootstrap)
![Axios](https://img.shields.io/badge/Axios-API-green?style=for-the-badge)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-teal?style=for-the-badge&logo=fastapi)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge&logo=mongodb)

---


Cloudora/
│── .idea/              # IDE configuration files
│── Backend/            # Node.js main backend (APIs, auth, business logic)
│── Backend-AI/         # Python/FastAPI AI backend (RAG / ML / AI services)
│── Frontend/           # React frontend (UI, pages, components)
│── package.json        # Root dependencies (if any)
│── .gitignore          # Git ignored files
│── README.md           # Project documentation

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/resource-recommendation-system.git
cd resource-recommendation-system
---
1. Start AI Backend (FastAPI)
cd backend-ai
uvicorn app:app --reload --port 8000
---
2. Start Main Backend (Node.js)
cd backend
npm start
---
3. Start Frontend (React)
cd frontend
npm run dev

---

###  🎯 Project Highlights

Real-world recommendation system
Hybrid backend architecture (Node + FastAPI)
Activity-based personalization
Analytics-driven insights
Modular and scalable design


🔐 Environment Variables

Cloudora uses separate environment configurations for each service.

📦 Backend (Node.js)

Create a .env file inside Backend/:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

🧠 Backend-AI (FastAPI)

Create a .env file inside Backend-AI/:

OPENAI_API_KEY=your_openai_key_if_used

🌐 Frontend (React)

Create a .env file inside Frontend/:

REACT_APP_API_URL=http://localhost:5000

