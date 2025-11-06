# AURAZ E-Commerce Platform - GitHub Push Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AURAZ E-Commerce Platform - GitHub Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking if Git is installed..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Download and install Git" -ForegroundColor Yellow
    Write-Host "3. Restart PowerShell after installation" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Get current directory
$projectPath = Get-Location
Write-Host "Project path: $projectPath" -ForegroundColor Gray
Write-Host ""

# Initialize Git repository (if not already initialized)
Write-Host "Initializing Git repository (if not already initialized)..." -ForegroundColor Yellow
if (-Not (Test-Path ".git")) {
    git init
} else {
    Write-Host "Git repository already initialized" -ForegroundColor Green
}

Write-Host ""

# Add all files
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .

Write-Host ""

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Creating commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: AURAZ E-Commerce Platform ready for Vercel deployment"
} else {
    Write-Host "No changes to commit" -ForegroundColor Gray
}

Write-Host ""

# Remove existing remote if it exists
Write-Host "Configuring remote repository..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform.git

Write-Host ""

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You will be prompted for your GitHub credentials." -ForegroundColor Yellow
Write-Host "If you have 2FA enabled, use a Personal Access Token instead of password." -ForegroundColor Yellow
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now available at:" -ForegroundColor Cyan
    Write-Host "https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Vercel Dashboard (https://vercel.com)" -ForegroundColor White
    Write-Host "2. Import this GitHub repository" -ForegroundColor White
    Write-Host "3. Create Vercel Postgres database" -ForegroundColor White
    Write-Host "4. Add environment variables" -ForegroundColor White
    Write-Host "5. Deploy!" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check your GitHub credentials" -ForegroundColor White
    Write-Host "2. If you have 2FA enabled, use a Personal Access Token instead of password" -ForegroundColor White
    Write-Host "   Create token at: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "3. Make sure the repository exists at:" -ForegroundColor White
    Write-Host "   https://github.com/aurang-dot/Auraz-Premimum-E---Commerce-Platform" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Read-Host "Press Enter to exit"

