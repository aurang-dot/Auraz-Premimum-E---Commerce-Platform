# Quick Start Guide

Follow these steps to get your AURAZ E-Commerce Platform running on GitHub and Vercel.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ GitHub account
- ✅ Vercel account (free tier available)
- ✅ Git installed (download from https://git-scm.com/download/win)

## Step-by-Step Instructions

### 1. Install Git (if not installed)

Download from: https://git-scm.com/download/win
Install and restart your terminal.

### 2. Initialize Git Repository

Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: AURAZ E-Commerce Platform"
```

### 3. Create GitHub Repository

1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `auraz-ecommerce`
4. Visibility: **Public** (for free Vercel)
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

### 4. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/auraz-ecommerce.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 5. Create Vercel Postgres Database

1. Go to https://vercel.com
2. Click "Add New..." → "Database"
3. Select "Postgres"
4. Choose region (closest to your users)
5. Click "Create"
6. **Copy these 3 connection strings** (save them!):
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

### 6. Deploy to Vercel

1. In Vercel Dashboard, click "Add New..." → "Project"
2. Import your GitHub repository
3. **Add Environment Variables:**
   - `POSTGRES_URL` = (paste from Step 5)
   - `POSTGRES_PRISMA_URL` = (paste from Step 5)
   - `POSTGRES_URL_NON_POOLING` = (paste from Step 5)
4. Click "Deploy"
5. Wait for deployment (~2-3 minutes)

### 7. Initialize Database

After deployment:
1. Visit: `https://your-project.vercel.app/api/init`
2. You should see: `{"success":true,"message":"Database initialized successfully"}`
3. Database is now ready!

### 8. Login as Admin

1. Visit: `https://your-project.vercel.app/admin/login`
2. Login with:
   - Email: `auraz@admin.com`
   - Password: `auraz878`
3. **IMPORTANT:** Change password in Admin Settings!

### 9. Add Products

1. Go to Admin Panel → Products
2. Click "Add Product"
3. Fill in product details
4. Save

## ✅ Done!

Your platform is now:
- ✅ Live globally
- ✅ Using shared database
- ✅ Ready for users

## Need More Details?

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for complete detailed instructions.

---

**Questions?** Check the troubleshooting section in SETUP_INSTRUCTIONS.md

