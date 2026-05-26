
# 📚 Cloudora

**Author:** Khushi Mittal

---

## 🚀 Overview

Cloudora is a full-stack intelligent learning platform that tracks user activity and delivers personalized educational resources using a behavior-driven recommendation system.

It combines:

* Activity tracking
* Recommendation engine
* Analytics dashboard
* Notification system
* RAG-based document Q&A (AI assistant)

---

## ✨ Key Features

### 👤 Authentication & Roles

* Secure authentication system
* Role-based access (Student / Admin)
* Protected routes

---

### 📚 Resource Management

* Add and manage learning resources
* Fields:

  * Name
  * URL
  * Category (optional)
* Tracks views and engagement

---

### 🔥 Trending System

* Auto-detects popular resources
* Based on user interactions and views

---

### 🧠 Recommendation System

* Tracks user behavior (clicks, views)
* Generates personalized recommendations
* Dynamic ranking of resources

---

### 📊 Analytics Dashboard

* User activity insights
* Resource engagement metrics
* Most viewed resources
* System usage statistics

---

### 🔔 Notification System

* New resource alerts
* Recommendation notifications
* Read / unread status support

---

### 📄 RAG-based Document Q&A

* Upload PDF documents (Admin)
* Automatic chunking & embedding
* Semantic search over documents
* LLM-powered contextual answers

---
---

### 💬 Real-time Chat System (WebSocket)
- Live chat between users / admin (based on roles)
- Built using WebSockets for real-time communication
- Instant message delivery without page refresh
- Persistent connection for low-latency interaction

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge\&logo=react)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge\&logo=bootstrap)
![Axios](https://img.shields.io/badge/Axios-API-green?style=for-the-badge)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge\&logo=node.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-teal?style=for-the-badge\&logo=fastapi)
![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-orange?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black?style=for-the-badge&logo=socketdotio)

### Database

![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=for-the-badge\&logo=mongodb)

---

## 🖥️ UI Preview

<p align="center">
  <img src="frontend\src\assets\analytics.png" alt="ANALYTICS Page" width="480"/>  
  <img src="frontend\src\assets\askai.png" alt="ASKAI Page" width="500"/>  
  <img src="frontend\src\assets\dashboard.png" alt="dashboard page " width="500"/>
  <img src="frontend\src\assets\recommendations.png" alt="Recommendation Page" width="500"/>
  <img src="frontend\src\assets\chats.png" alt="Chats Page" width="500"/>
</p>



## 📁 Project Structure

```bash
Cloudora/
│── Backend/            # Node.js backend (APIs, auth, logic)
│── Backend-AI/         # FastAPI backend (RAG / AI services)
│── Frontend/           # React frontend (UI)
│── .idea/              # IDE config files
│── package.json        # Root dependencies (if any)
│── .gitignore
│── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/cloud-student-resource-platform.git
cd cloud-student-resource-platform
```

---

### 2️⃣ Start AI Backend (FastAPI)

```bash
cd Backend-AI
uvicorn app:app --reload --port 8000
```

---

### 3️⃣ Start Main Backend (Node.js)

```bash
cd Backend
npm install
npm start
```

---

### 4️⃣ Start Frontend (React)

```bash
cd Frontend
npm install
npm run dev
```

---

## 🎯 Project Highlights

* Real-world recommendation system
* Hybrid architecture (Node.js + FastAPI)
* Activity-based personalization
* Analytics-driven insights
* Modular and scalable design

---

## 🔐 Environment Variables

### Backend (Node.js)

Create `Backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

### Backend-AI (FastAPI)

Create `Backend-AI/.env`:

```env
OPENAI_API_KEY=your_openai_key
```

---

### Frontend (React)

Create `Frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

---




