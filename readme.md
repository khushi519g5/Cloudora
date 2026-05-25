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

### 📚 Recommendation Engine
Tracks user interactions (views, clicks)
Suggests relevant learning resources
Uses behavioral signals and engagement metrics

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


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/resource-recommendation-system.git
cd resource-recommendation-system

 Start AI Backend (FastAPI)
cd backend-ai
uvicorn app:app --reload --port 8000

Start Main Backend (Node.js)
cd backend
npm start

 Start Frontend (React)
cd frontend
npm run dev

---

###  🎯 Project Highlights

Real-world recommendation system
Hybrid backend architecture (Node + FastAPI)
Activity-based personalization
Analytics-driven insights
Modular and scalable design
