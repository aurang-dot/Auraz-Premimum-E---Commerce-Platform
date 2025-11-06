# GitHub & Vercel Deployment Guide

This guide will help you set up your AURAZ E-Commerce Platform on GitHub and deploy it to Vercel with a shared database.

## Step 1: Initialize Git Repository

1. **Open terminal in your project directory**

2. **Initialize git repository:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: AURAZ E-Commerce Platform"
   ```

## Step 2: Create GitHub Repository

1. **Go to GitHub** (https://github.com)
2. **Sign in** to your account
3. **Click the "+" icon** in the top right corner
4. **Select "New repository"**
5. **Fill in the details:**
   - Repository name: `auraz-ecommerce` (or any name you prefer)
   - Description: "AURAZ Premium E-Commerce Platform"
   - Visibility: **Public** (required for free Vercel deployment) or **Private** (if you have paid plan)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. **Click "Create repository"**

## Step 3: Connect Local Repository to GitHub

1. **Copy the repository URL** from GitHub (it will look like: `https://github.com/yourusername/auraz-ecommerce.git`)

2. **In your terminal, run:**
   ```bash
   git remote add origin https://github.com/yourusername/auraz-ecommerce.git
   ```

3. **Push your code to GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

4. **Enter your GitHub credentials** when prompted

## Step 4: Set Up Vercel Postgres Database

1. **Go to Vercel Dashboard** (https://vercel.com)
2. **Sign in** or create an account
3. **Click "Add New..." → "Database"**
4. **Select "Postgres"**
5. **Choose a region** (closest to your users)
6. **Click "Create"**
7. **Copy the connection string** - you'll need this later

## Step 5: Deploy to Vercel

1. **Import your GitHub repository:**
   - In Vercel Dashboard, click **"Add New..." → "Project"**
   - Click **"Import Git Repository"**
   - Select your GitHub repository
   - Click **"Import"**

2. **Configure project:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
   - Click **"Deploy"**

3. **Add Environment Variables:**
   - Go to **Project Settings → Environment Variables**
   - Add: `POSTGRES_URL` (from Step 4)
   - Add: `POSTGRES_PRISMA_URL` (from Step 4)
   - Add: `POSTGRES_URL_NON_POOLING` (from Step 4)

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

## Step 6: Initialize Database

After deployment:

1. **Visit your deployed site:** `https://your-project.vercel.app`

2. **Initialize database:**
   - Visit: `https://your-project.vercel.app/api/init`
   - This will create all necessary database tables

3. **Set up admin account:**
   - Login with: `auraz@admin.com` / `auraz878`
   - Or create a new admin account through the admin panel

## Step 7: Seed Initial Data (Optional)

To add sample products and data:

1. **Go to Admin Panel** at `/admin/login`
2. **Login with admin credentials**
3. **Use the admin panel** to add products, vouchers, etc.

## Troubleshooting

### Database Connection Issues
- Verify all environment variables are set correctly in Vercel
- Check that the database is in the same region as your project
- Ensure the connection string is correct

### Build Errors
- Make sure all dependencies are in `package.json`
- Check that Node.js version is 18+ (Vercel auto-detects)

### API Routes Not Working
- Ensure API routes are in the `api/` directory
- Check Vercel function logs in the dashboard

## Next Steps

1. ✅ **Custom Domain** (Optional): Add your domain in Vercel settings
2. ✅ **Environment Variables**: Add production API keys if needed
3. ✅ **Analytics**: Enable Vercel Analytics to track usage
4. ✅ **Monitoring**: Set up error tracking

## Support

For issues:
- Check Vercel logs in the dashboard
- Review GitHub repository for recent changes
- Check database connection in Vercel dashboard

---

**Your app is now live and accessible globally!** 🎉

