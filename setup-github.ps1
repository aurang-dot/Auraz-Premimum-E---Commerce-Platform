# AURAZ E-Commerce Platform - Complete GitHub Setup
# This script will push your project to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AURAZ E-Commerce Platform" -ForegroundColor Cyan
Write-Host "GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is NOT installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Install Git (use default settings)" -ForegroundColor White
    Write-Host "3. Restart PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to open Git download page..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "https://git-scm.com/download/win"
    exit 1
}

Write-Host ""

# Navigate to project directory
$projectPath = "C:\Users\user\Downloads\AURAZ E-Commerce Platform"
if (-Not (Test-Path $projectPath)) {
    Write-Host "✗ Project path not found: $projectPath" -ForegroundColor Red
    exit 1
}

Set-Location $projectPath
Write-Host "Project directory: $projectPath" -ForegroundColor Gray
Write-Host ""

# Step 1: Initialize Git repository
Write-Host "[1/6] Initializing Git repository..." -ForegroundColor Yellow
if (-Not (Test-Path ".git")) {
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
}
Write-Host ""

# Step 2: Add all files
Write-Host "[2/6] Adding all files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ All files added" -ForegroundColor Green
Write-Host ""

# Step 3: Create commit
Write-Host "[3/6] Creating commit..." -ForegroundColor Yellow
$commitMessage = "Initial commit: AURAZ E-Commerce Platform ready for Vercel deployment"
git commit -m $commitMessage
Write-Host "✓ Commit created" -ForegroundColor Green
Write-Host ""

# Step 4: Add remote repository
Write-Host "[4/6] Adding remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform.git"
git remote remove origin 2>$null
git remote add origin $remoteUrl
Write-Host "✓ Remote repository added: $remoteUrl" -ForegroundColor Green
Write-Host ""

# Step 5: Set main branch
Write-Host "[5/6] Setting main branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to main" -ForegroundColor Green
Write-Host ""

# Step 6: Push to GitHub
Write-Host "[6/6] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "You will be prompted for your GitHub credentials:" -ForegroundColor Cyan
Write-Host "  - Username: Your GitHub username" -ForegroundColor White
Write-Host "  - Password: Your GitHub password" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  If you have 2FA enabled, use a Personal Access Token instead of password:" -ForegroundColor Yellow
Write-Host "   Create token at: https://github.com/settings/tokens" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to continue with push..." -ForegroundColor Yellow
$null = Read-Host

try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now available at:" -ForegroundColor Cyan
    Write-Host "https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Vercel Dashboard (https://vercel.com)" -ForegroundColor White
    Write-Host "2. Import this GitHub repository" -ForegroundColor White
    Write-Host "3. Create Vercel Postgres database" -ForegroundColor White
    Write-Host "4. Add environment variables (POSTGRES_URL, etc.)" -ForegroundColor White
    Write-Host "5. Deploy!" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "✗ ERROR: Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check your GitHub username and password" -ForegroundColor White
    Write-Host "2. If you have 2FA, use Personal Access Token:" -ForegroundColor White
    Write-Host "   - Go to: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "   - Generate new token (classic)" -ForegroundColor White
    Write-Host "   - Select 'repo' scope" -ForegroundColor White
    Write-Host "   - Use token as password" -ForegroundColor White
    Write-Host "3. Verify repository exists and you have access:" -ForegroundColor White
    Write-Host "   https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Read-Host "Press Enter to exit"

