# 🚀 Homia OS — Full-Stack Deployment Guide

This guide walks you through deploying **Homia OS** to the cloud on **Render** or **Railway** (including Frontend, NestJS REST API, and PostgreSQL Database).

---

## 📋 Prerequisites: Push Code to GitHub

Since both Render and Railway deploy directly from your GitHub repository, first push your local code:

1. Create a new repository on GitHub named **`homia-os`** at:  
   👉 **[https://github.com/new](https://github.com/new)**  
   *(Leave it empty without README or .gitignore)*

2. In your local terminal, run:
   ```bash
   cd "C:\Users\LLoyD\.gemini\antigravity\scratch\homia-os"
   git remote add origin https://github.com/V0rade/homia-os.git
   git push -u origin main
   ```

---

## 🌟 Method 1: 1-Click Deployment on Render (Using `render.yaml`)

We have pre-configured a **Render Blueprint** ([`render.yaml`](./render.yaml)) at the root of the project. This automatically provisions:
- **Managed PostgreSQL Database** (`homia-postgres`)
- **NestJS REST API Service** (`homia-api`)
- **Next.js 15 Web Portal** (`homia-web`)

### Steps:
1. Go to **[https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)**
2. Click **"New Blueprint Instance"**.
3. Connect your GitHub repository (`V0rade/homia-os`).
4. Render will automatically detect [`render.yaml`](./render.yaml) and list the 3 resources to provision.
5. Click **"Apply"**.
6. Render will:
   - Create your PostgreSQL database.
   - Run database migrations & seed initial records.
   - Build and start your NestJS API with automatic SSL.
   - Build and start your Next.js frontend with automatic SSL.
7. Your app will be live at `https://homia-web.onrender.com`!

---

## 🚂 Method 2: Deployment on Railway

Railway offers one of the best developer experiences for multi-container and monorepo projects.

### Steps:
1. Go to **[https://railway.app](https://railway.app)** and sign in with GitHub.
2. Click **"New Project"** → **"Deploy from GitHub repo"**.
3. Select your `homia-os` repository.
4. **Add PostgreSQL**:
   - In your Railway project canvas, click **"+ Create"** → **"Database"** → **"Add PostgreSQL"**.
5. **Add Redis**:
   - In your project canvas, click **"+ Create"** → **"Database"** → **"Add Redis"**.
6. **Configure the Web Service**:
   - In the settings for your app service:
     - **Root Directory**: `apps/web`
     - **Build Command**: `npm install --legacy-peer-deps && npm run build`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       - `PORT`: `3000`
       - `NEXT_PUBLIC_API_URL`: (Your backend URL or `http://localhost:3001/api`)
7. **Generate Domain**:
   - Under the **Networking** tab of your web service, click **"Generate Domain"**.
   - Your site is live with a public HTTPS URL (e.g. `https://homia-os-production.up.railway.app`)!

---

## ⚡ Option 3: Deploy Frontend to Vercel (Instant Next.js Hosting)

If you want the Next.js frontend hosted on Vercel's Edge network:

1. Go to **[https://vercel.com](https://vercel.com)** and log in with GitHub.
2. Click **"Add New..."** → **"Project"**.
3. Import `V0rade/homia-os`.
4. In the configuration settings:
   - **Root Directory**: Click *Edit* and select **`apps/web`**.
   - **Framework Preset**: Next.js (automatically detected).
5. Click **"Deploy"**.
6. Vercel will build and assign you a global URL (e.g. `https://homia-os.vercel.app`).

---

## 🔐 Default Production Credentials

Once deployed and seeded:

| Portal / Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@homia-os.com` | `Admin123!` |
| **Property Owner** | `owner1@homia-os.com` | `Admin123!` |
| **Staff Member** | `staff1@homia-os.com` | `Admin123!` |
| **Active Tenant** | `tenant1@homia-os.com` | `Admin123!` |
