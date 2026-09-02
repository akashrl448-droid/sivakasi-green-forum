# Deploying Sivakasi Green Forum to Render 🚀

This guide provides instructions to deploy the Sivakasi Green Forum backend (and integrated frontend) to [Render](https://render.com).

---

## ⚡ Option 1: Automatic Blueprint Deployment (Recommended — 2 Minutes)

Render supports **Blueprints** using the included [`render.yaml`](./render.yaml) file, which automatically configures the runtime, build command, start command, health check, and environment variables.

### Steps:
1. **Push your latest changes to GitHub**:
   ```bash
   git add .
   git commit -m "Configure project for Render deployment"
   git push origin main
   ```
2. Go to your [Render Dashboard](https://dashboard.render.com).
3. Click the **"New +"** button in the top navigation and select **"Blueprint"**.
4. Connect your GitHub account and select your repository: **`akashrl448-droid/sivakasi-green-forum`**.
5. Render will detect the `render.yaml` file automatically and display the service details:
   - **Name**: `sivakasi-green-forum`
   - **Environment**: `Node`
   - **Plan**: `Free`
   - **Region**: `Singapore` (or choose your preferred region)
6. Click **"Apply"**.
7. Render will build and deploy your service. Once finished, you will receive your live URL (e.g. `https://sivakasi-green-forum.onrender.com`).

---

## 🛠 Option 2: Manual Web Service Deployment

If you prefer to configure the service manually on Render:

1. In the [Render Dashboard](https://dashboard.render.com), click **"New +"** → **"Web Service"**.
2. Select your repository: **`akashrl448-droid/sivakasi-green-forum`**.
3. Configure the settings:
   - **Name**: `sivakasi-green-forum`
   - **Region**: `Singapore (Southeast Asia)` *(recommended for India)*
   - **Branch**: `main`
   - **Root Directory**: *(leave blank to use repository root)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Expand **Advanced Settings** and add the following Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(click "Generate" or type a strong random string)*
   - `FRONTEND_ORIGIN`: `*` *(or your custom domain if hosting frontend separately)*
5. In **Health Check Path**, enter:
   - `/healthz`
6. Click **"Create Web Service"**.

---

## 💾 Understanding Database & Media Storage on Render

### SQLite Database
- **Free Tier**: Render's free tier uses an ephemeral filesystem. If the server goes to sleep after 15 minutes of inactivity or is restarted, the database reinitializes from the initial seed script (`db/seed.js`). The default admin account and initial projects will always be available.
- **Persistent Storage**: If you want database modifications to persist permanently across restarts on Render:
  - Add a **Render Persistent Disk** (requires a Starter plan, $7/mo + $1/mo for 1GB disk).
  - Mount path: `/var/data`
  - Set the environment variable in Render: `DB_PATH=/var/data/sgf.db`
  - The server is already coded to automatically create the folder and place the database there.

### File Uploads (Media / Gallery)
- **Local Storage (Default)**: Uploads are stored in `backend/backend/uploads/` and served at `/uploads/...`. On the free tier, files reset upon restart.
- **AWS S3 (Permanent & Free Tier Compatible)**: To keep uploaded images permanently without paying for a persistent disk, fill in the AWS environment variables in Render:
  - `AWS_REGION`: `ap-south-1`
  - `AWS_BUCKET_NAME`: `your-s3-bucket-name`
  - `AWS_ACCESS_KEY_ID`: `your-aws-access-key`
  - `AWS_SECRET_ACCESS_KEY`: `your-aws-secret-key`
  - `CLOUDFRONT_URL`: *(optional)*

---

## 🌐 Verifying Your Deployed Application

Once deployed, visit your Render URL:
- **Public Website & Frontend**: `https://<your-render-subdomain>.onrender.com`
- **Admin Login**: `https://<your-render-subdomain>.onrender.com/admin-login.html`
- **Health Check**: `https://<your-render-subdomain>.onrender.com/healthz`
- **API Endpoints**: `https://<your-render-subdomain>.onrender.com/api/projects`

### Default Admin Credentials:
- **Email**: `admin@sivakasigreenforum.org`
- **Password**: `ChangeMe123!`
*(Be sure to change this password after your first login via the admin settings).*
