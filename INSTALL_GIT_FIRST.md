# ⚠️ Git is Required - Installation Instructions

## Git is Not Installed on Your System

Before you can push your code to GitHub, you need to install Git first.

## 🚀 Quick Installation

### Step 1: Download Git

1. **Go to the official Git download page:**
   - URL: https://git-scm.com/download/win
   - Or search "Git for Windows" in your browser

2. **Download the installer:**
   - Click "Download" button
   - The installer will download automatically

### Step 2: Install Git

1. **Run the installer** (git-installer.exe)

2. **Follow the installation wizard:**
   - Click "Next" through the setup
   - **Recommended settings:**
     - ✅ Use Git from the command line and also from 3rd-party software
     - ✅ Use the OpenSSL library
     - ✅ Checkout Windows-style, commit Unix-style line endings
     - ✅ Use Windows' default console window
     - ✅ Default (fast-forward or merge) - recommended
     - ✅ Git Credential Manager
     - ✅ Enable file system caching
   - Click "Install"

3. **Wait for installation to complete** (~2-3 minutes)

4. **Click "Finish"**

### Step 3: Restart Terminal/PowerShell

**IMPORTANT:** After installing Git:
1. **Close your current terminal/PowerShell window**
2. **Open a new terminal/PowerShell window**
3. **Navigate back to your project:**
   ```powershell
   cd "C:\Users\user\Downloads\AURAZ E-Commerce Platform"
   ```

### Step 4: Verify Installation

Test that Git is installed:

```powershell
git --version
```

You should see something like:
```
git version 2.xx.x.windows.x
```

### Step 5: Push to GitHub

Once Git is installed, you can run:

**Option A: Use the script (easiest):**
```powershell
.\setup-github.ps1
```

**Option B: Run commands manually:**
```powershell
cd "C:\Users\user\Downloads\AURAZ E-Commerce Platform"
git init
git add .
git commit -m "Initial commit: AURAZ E-Commerce Platform ready for Vercel deployment"
git remote add origin https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform.git
git branch -M main
git push -u origin main
```

## 📝 Alternative: Use GitHub Desktop

If you prefer a graphical interface:

1. **Download GitHub Desktop:**
   - URL: https://desktop.github.com/
   - Install GitHub Desktop

2. **Clone your repository:**
   - Open GitHub Desktop
   - File → Clone Repository
   - URL: `https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform.git`
   - Choose local path
   - Click "Clone"

3. **Copy your project files** to the cloned repository folder

4. **Commit and push:**
   - In GitHub Desktop, you'll see all changes
   - Write commit message: "Initial commit: AURAZ E-Commerce Platform ready for Vercel deployment"
   - Click "Commit to main"
   - Click "Push origin"

## ✅ After Git Installation

Once Git is installed and you've pushed your code:

1. ✅ **Verify on GitHub:**
   - Visit: https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform
   - You should see all your project files

2. ✅ **Deploy to Vercel:**
   - Go to Vercel Dashboard
   - Import your GitHub repository
   - Create Vercel Postgres database
   - Add environment variables
   - Deploy!

## 🆘 Need Help?

- **Git Installation Issues:** Check https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- **GitHub Authentication:** See https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories
- **2FA Setup:** See https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa

---

**After installing Git, restart your terminal and run the setup script!**

