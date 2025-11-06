# Complete Setup Instructions for AURAZ E-Commerce Platform

Follow these steps to deploy your AURAZ E-Commerce Platform to GitHub and Vercel with a shared database.

## Step 1: Install Git (if not installed)

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/win
   - Download and install Git
   - Restart your terminal after installation

2. **Verify installation:**
   ```bash
   git --version
   ```

## Step 2: Initialize Git Repository

1. **Open terminal/PowerShell in your project directory**

2. **Initialize git:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: AURAZ E-Commerce Platform ready for deployment"
   ```

## Step 3: Create GitHub Repository

1. **Go to GitHub** (https://github.com)
2. **Sign in** or create an account
3. **Click the "+" icon** → "New repository"
4. **Repository details:**
   - Name: `auraz-ecommerce` (or your preferred name)
   - Description: "AURAZ Premium E-Commerce Platform"
   - Visibility: **Public** (for free Vercel) or **Private** (if you have paid plan)
   - **DO NOT** check "Initialize with README" (we already have one)
5. **Click "Create repository"**

## Step 4: Connect Local Repository to GitHub

1. **Copy the repository URL** from GitHub
   - It will look like: `https://github.com/yourusername/auraz-ecommerce.git`

2. **In your terminal, run:**
   ```bash
   git remote add origin https://github.com/yourusername/auraz-ecommerce.git
   git branch -M main
   git push -u origin main
   ```

3. **Enter your GitHub credentials** when prompted
   - If you have 2FA enabled, use a Personal Access Token instead of password

## Step 5: Set Up Vercel Postgres Database

1. **Go to Vercel Dashboard** (https://vercel.com)
2. **Sign in** or create an account (free tier available)
3. **Click "Add New..." → "Database"**
4. **Select "Postgres"**
5. **Choose a region:**
   - Select closest to your users
   - Example: `us-east-1` (N. Virginia) or `eu-west-1` (Ireland)
6. **Click "Create"**
7. **Wait for database to be created** (takes ~30 seconds)
8. **Copy the connection strings:**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - Save these - you'll need them in the next step

## Step 6: Deploy to Vercel

1. **Import your GitHub repository:**
   - In Vercel Dashboard, click **"Add New..." → "Project"**
   - Click **"Import Git Repository"**
   - Select your GitHub repository (`auraz-ecommerce`)
   - Click **"Import"**

2. **Configure project settings:**
   - Framework Preset: **Vite** (should auto-detect)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
   - Root Directory: `./` (default)

3. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add these three variables (from Step 5):
     - Name: `POSTGRES_URL` → Value: (paste from Step 5)
     - Name: `POSTGRES_PRISMA_URL` → Value: (paste from Step 5)
     - Name: `POSTGRES_URL_NON_POOLING` → Value: (paste from Step 5)
   - Make sure all are set for **Production**, **Preview**, and **Development**

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at: `https://your-project.vercel.app`

## Step 7: Initialize Database

After deployment is complete:

1. **Visit your deployed site:**
   - Go to: `https://your-project.vercel.app`

2. **Initialize database:**
   - Visit: `https://your-project.vercel.app/api/init`
   - This will create all necessary database tables
   - You should see: `{"success":true,"message":"Database initialized successfully"}`

3. **Verify database:**
   - Go to Vercel Dashboard → Your Project → Storage → Postgres
   - Check that tables are created

## Step 8: Set Up Admin Account

1. **Go to Admin Login:**
   - Visit: `https://your-project.vercel.app/admin/login`

2. **Login with default credentials:**
   - Email: `auraz@admin.com`
   - Password: `auraz878`

3. **Change admin password (IMPORTANT!):**
   - Go to Admin Settings
   - Change the admin email and password
   - Save changes

## Step 9: Add Initial Data

1. **Add Products:**
   - Go to Admin Panel → Products
   - Click "Add Product"
   - Fill in product details
   - Save

2. **Add Carousel Slides:**
   - Go to Admin Panel → Carousel
   - Add homepage banner slides

3. **Add Vouchers:**
   - Go to Admin Panel → Vouchers
   - Create discount codes

4. **Add Promo Cards:**
   - Go to Admin Panel → Promo Cards
   - Add promotional cards

## Step 10: Test the Platform

1. **Test User Registration:**
   - Visit: `https://your-project.vercel.app/login`
   - Register a new user account
   - Verify registration works

2. **Test Shopping:**
   - Browse products
   - Add items to cart
   - Proceed to checkout
   - Place an order

3. **Test Admin Panel:**
   - Login as admin
   - Verify you can see orders
   - Test order management

## ✅ You're Done!

Your AURAZ E-Commerce Platform is now:
- ✅ **Live and accessible globally**
- ✅ **Using shared database** (all users see same data)
- ✅ **Ready for 10-20+ users**
- ✅ **Fully functional** with admin panel

## 🔧 Troubleshooting

### Database Connection Error
- **Check environment variables** in Vercel Dashboard
- **Verify database is in same region** as project
- **Ensure connection strings are correct**

### API Routes Not Working
- **Check Vercel Function Logs** in dashboard
- **Verify API routes are in `api/` folder**
- **Check that database is initialized** (`/api/init`)

### Build Fails
- **Check Node.js version** (should be 18+)
- **Verify all dependencies** in `package.json`
- **Check build logs** in Vercel dashboard

### Users Can't See Data
- **Verify database is initialized** (`/api/init`)
- **Check that data is added** via admin panel
- **Verify API routes are working**

## 📝 Next Steps

1. **Custom Domain** (Optional):
   - Add your domain in Vercel settings
   - Configure DNS records

2. **Analytics** (Optional):
   - Enable Vercel Analytics
   - Track user behavior

3. **Monitoring** (Optional):
   - Set up error tracking
   - Monitor performance

## 🆘 Need Help?

- Check Vercel logs in dashboard
- Review GitHub repository for issues
- Check database connection in Vercel Storage
- Verify environment variables are set correctly

---

**Your e-commerce platform is ready to use globally!** 🎉

