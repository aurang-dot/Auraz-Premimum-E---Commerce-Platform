# AURAZ E-Commerce Platform - Deployment Guide

## 🚀 Deploy to Vercel

This project is now configured to work with Vercel and uses browser localStorage for data storage.

### Prerequisites

1. A Vercel account (free tier available)
2. GitHub/GitLab/Bitbucket account (or you can deploy directly)

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite configuration

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live!

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **For production deployment**
   ```bash
   vercel --prod
   ```

### Project Configuration

The project includes a `vercel.json` configuration file that:
- Sets the build command to `npm run build`
- Configures the output directory as `build`
- Sets up SPA routing (all routes redirect to index.html)

### Data Storage

**Current Setup:**
- All data is stored in browser localStorage
- Data persists per user's browser
- No server-side database required

**Future Database Options:**
If you need server-side data storage, you can:
1. Use Vercel Postgres (recommended)
2. Use Vercel KV (Redis)
3. Use any database service with REST API

### Environment Variables

Currently, no environment variables are required. All configuration is handled client-side.

If you add a database later, you can set environment variables in:
- Vercel Dashboard → Project Settings → Environment Variables

### Build & Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Troubleshooting

**Build fails:**
- Check that all dependencies are in `package.json`
- Ensure Node.js version is 18+ (Vercel auto-detects)

**Routes not working:**
- The `vercel.json` includes SPA routing configuration
- All routes should redirect to `index.html`

**Data not persisting:**
- localStorage is browser-specific
- Data will persist for each user in their browser
- To share data across users, you'll need a database

### Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all functionality
3. 🔄 (Optional) Add Vercel Postgres for server-side data
4. 🔄 (Optional) Set up custom domain
5. 🔄 (Optional) Configure analytics

### Support

For issues or questions:
- Check the Vercel documentation: https://vercel.com/docs
- Review the project README.md for more details

---

**Ready to deploy!** 🎉

