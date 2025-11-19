# Deployment Guide

## Step-by-Step Deployment Instructions

### Part 1: Deploy Backend to Render

1. **Push your code to GitHub** (if you haven't already):
   - Go to GitHub and create a new repository
   - Run these commands in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [render.com](https://render.com) and sign in with GitHub
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `quiz-backend` (or any name you like)
     - **Region**: Choose closest to your users
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free
   - Click **"Advanced"** and add environment variable:
     - Key: `FRONTEND_URL`
     - Value: (leave blank for now, we'll update after deploying frontend)
   - Click **"Create Web Service"**
   - Wait for deployment (3-5 minutes)
   - **Copy your backend URL** (e.g., `https://quiz-backend-xxxx.onrender.com`)

### Part 2: Deploy Frontend to Netlify

3. **Deploy on Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign in with GitHub
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect to GitHub and select your repository
   - Configure build settings:
     - **Base directory**: (leave empty)
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click **"Show advanced"** → **"New variable"**:
     - Key: `VITE_BACKEND_URL`
     - Value: `https://quiz-backend-xxxx.onrender.com` (your Render URL from step 2)
   - Click **"Deploy"**
   - Wait for deployment (1-2 minutes)
   - **Copy your frontend URL** (e.g., `https://your-site.netlify.app`)

4. **Update Backend CORS** (Go back to Render):
   - Go to your Render dashboard
   - Click on your backend service
   - Go to **"Environment"** tab
   - Update `FRONTEND_URL` variable:
     - Value: `https://your-site.netlify.app` (your Netlify URL from step 3)
   - Your backend will automatically redeploy

### Part 3: Test Your Deployment

5. **Test the application**:
   - Admin Panel: `https://your-site.netlify.app/#/admin`
   - Display View: `https://your-site.netlify.app/#/display`
   - Try creating questions on one device and viewing on another!

## Troubleshooting

- **Backend not connecting?** Check the browser console (F12) for errors
- **CORS errors?** Make sure you updated the `FRONTEND_URL` in Render
- **Build failed?** Check the build logs on Render/Netlify for specific errors
- **Database not persisting?** Render's free tier may have limited disk persistence. Upgrade if needed.

## Future Updates

To update your deployed apps after making code changes:
```bash
git add .
git commit -m "Your update message"
git push
```
Both Render and Netlify will automatically redeploy!
