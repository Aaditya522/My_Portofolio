# Full Stack Developer Portfolio & Activity Hub

A modern, high-performance developer portfolio built with the **MERN** stack (MongoDB, Express, React, Node.js) styled with Tailwind CSS, featuring live GitHub activity tracking, kanban task management, and portfolio personalization.

---

## 📁 Project Architecture

```
Portfolio/
├── backend/                  # Node.js & Express REST API
│   ├── config/               # Database connection (MongoDB)
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth, PIN protection, File uploads
│   ├── models/               # Mongoose data schemas
│   ├── routes/               # Express API route endpoints
│   ├── services/             # GitHub sync service
│   ├── uploads/              # Uploaded avatars & resumes
│   └── server.js             # Entry point
├── frontend/                 # React (Vite) Single Page Application
│   ├── src/
│   │   ├── components/       # UI sections & modals
│   │   ├── context/          # React Context (Portfolio, Workspace)
│   │   ├── pages/            # App pages
│   │   └── App.jsx
│   └── vite.config.js        # Vite configuration & dev proxy
└── README.md
```

---

## 🚀 Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env based on .env.example
npm start
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

---

## 🌐 Deploying to Render

This repository is configured so both the **Backend** and **Frontend** can be deployed independently on Render from this single GitHub repository.

### Step 1: Deploy Backend (Web Service)

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `portfolio-backend` (or your choice)
   - **Region**: Closest to you (e.g., Singapore, Oregon, Frankfurt)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGO_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
   - `JWT_SECRET`: A secure random string
   - `PORTFOLIO_EDIT_PIN`: Your portfolio edit PIN
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token
   - `GITHUB_USERNAME`: Your GitHub username
   - `GITHUB_OWNER`: GitHub repo owner
   - `GITHUB_REPOSITORY`: Target GitHub repository name
   - `GITHUB_BRANCH_PREFIX`: Branch prefix (e.g., `aaditya`)
   - `EMAIL_SERVICE`: `gmail`
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail App Password
   - `OWNER_EMAIL`: Notification recipient email
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://portfolio-backend-xxxx.onrender.com`).

---

### Step 2: Deploy Frontend (Static Site)

1. In Render Dashboard, click **New +** -> **Static Site**.
2. Select the same GitHub repository.
3. Configure the static site:
   - **Name**: `portfolio-frontend` (or your choice)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your backend URL from Step 1 (e.g., `https://portfolio-backend-xxxx.onrender.com` without trailing slash)
5. Under **Redirects/Rewrites**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
   *(This ensures client-side routing works for all URLs).*
6. Click **Create Static Site**.
