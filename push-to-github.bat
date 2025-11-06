@echo off
echo ========================================
echo AURAZ E-Commerce Platform - GitHub Push
echo ========================================
echo.

echo Checking if Git is installed...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Go to: https://git-scm.com/download/win
    echo 2. Download and install Git
    echo 3. Restart this script after installation
    echo.
    pause
    exit /b 1
)

echo Git is installed!
echo.

echo Initializing Git repository (if not already initialized)...
git init

echo.
echo Adding all files to Git...
git add .

echo.
echo Creating commit...
git commit -m "Initial commit: AURAZ E-Commerce Platform ready for Vercel deployment"

echo.
echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
echo You will be prompted for your GitHub credentials.
echo.
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo.
    echo Possible solutions:
    echo 1. Check your GitHub credentials
    echo 2. If you have 2FA enabled, use a Personal Access Token instead of password
    echo 3. Make sure the repository exists at: https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Code pushed to GitHub!
echo ========================================
echo.
echo Your repository is now available at:
echo https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform
echo.
echo Next steps:
echo 1. Go to Vercel Dashboard
echo 2. Import this GitHub repository
echo 3. Create Vercel Postgres database
echo 4. Add environment variables
echo 5. Deploy!
echo.
pause

