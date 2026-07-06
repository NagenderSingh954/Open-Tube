# 🎥 YouTube Clone

A full-stack YouTube-inspired video sharing platform built using the MERN stack. Users can upload videos, watch content, like videos, subscribe to channels, and interact through comments. The project focuses on recreating the core functionality of YouTube while providing a modern and responsive user interface.

---

## 🚀 Features

### 👤 User Authentication

* User registration and login
* JWT-based authentication
* Secure password hashing
* Persistent user sessions

### 🎬 Video Management

* Upload videos with thumbnails
* Watch videos in a dedicated player
* View video details
* Track video views
* Delete uploaded videos
* Responsive video player

### ❤️ Engagement

* Like and unlike videos
* Subscribe and unsubscribe to channels
* View subscriber count
* Like comments

### 💬 Comments

* Add comments
* Edit comments
* Delete comments
* View total comments

### 📺 YouTube-like Interface

* Responsive homepage
* Video player page
* Channel information
* Sidebar navigation
* Search functionality
* Mobile-friendly design

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* CSS3
* Axios / Fetch API

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Token)
* bcrypt

### File Storage

* Cloudinary
* Multer

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/youtube-clone.git
cd Video_tool
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
```

Run the backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file.

```env
VITE_API_URL=http://localhost:8000
```

Run the frontend

```bash
npm run dev
```

---

## 🌐 Environment Variables

### Backend

| Variable              | Description               |
| --------------------- | ------------------------- |
| PORT                  | Server Port               |
| MONGODB_URI           | MongoDB Connection String |
| ACCESS_TOKEN_SECRET   | JWT Access Secret         |
| REFRESH_TOKEN_SECRET  | JWT Refresh Secret        |
| CLOUDINARY_CLOUD_NAME | Cloudinary Cloud Name     |
| CLOUDINARY_API_KEY    | Cloudinary API Key        |
| CLOUDINARY_API_SECRET | Cloudinary API Secret     |
| CORS_ORIGIN           | Allowed Frontend URL      |

### Frontend

| Variable     | Description     |
| ------------ | --------------- |
| VITE_API_URL | Backend API URL |

---

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

## 📄 License

This project is intended for educational and learning purposes.

---

## 👨‍💻 Author

**Nagender Singh**

If you like this project, consider giving it a ⭐ on GitHub.
