# 🚀 Real Estate App Deployment Guide

## Overview
Your real estate application will be deployed using:
- **Railway** for backend + database (Node.js + MongoDB)
- **Vercel** for frontend (React)
- **MongoDB Atlas** as backup database option

## Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Domain name (optional)

## Step 1: Prepare for Production

### 1.1 Update Environment Variables
Create production environment files:

**Backend Production Config:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/real-estate-prod
PORT=8000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
JWT_SECRET=your_super_secure_jwt_secret_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Gmail Configuration (already set)
EMAIL_USER=gargmahira30277@gmail.com
EMAIL_PASSWORD=xemz uaps ogwe rddx
EMAIL_FROM=Real Estate <gargmahira30277@gmail.com>

# Cloudinary (production keys)
CLOUDINARY_CLOUD_NAME=your_prod_cloudinary_name
CLOUDINARY_API_KEY=your_prod_cloudinary_api_key
CLOUDINARY_API_SECRET=your_prod_cloudinary_api_secret

# Google Maps (production key)
GOOGLE_MAPS_API_KEY=your_prod_google_maps_api_key
```

### 1.2 Database Setup
Choose one option:

**Option A: Railway Database (Recommended)**
- Railway provides MongoDB automatically
- No separate setup needed

**Option B: MongoDB Atlas**
1. Go to https://cloud.mongodb.com
2. Create account → Create cluster
3. Create database user
4. Get connection string

### 1.3 Update CORS and URLs
Ensure your backend allows requests from production frontend:

```javascript
// In server.js or cors config
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN
    : 'http://localhost:3000',
  credentials: true
};
```

## Step 2: Deploy Backend to Railway

### 2.1 Push Code to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2.2 Deploy to Railway
1. Go to https://railway.app → Sign up/Login
2. Click "New Project" → "Deploy from GitHub"
3. Connect your GitHub repo
4. Railway will auto-detect Node.js app

### 2.3 Configure Environment Variables
In Railway dashboard:
1. Go to your project → Variables
2. Add all environment variables from Step 1.1
3. Railway provides `MONGODB_URI` automatically if using their database

### 2.4 Database Migration
If you have existing data:
```bash
# Export from local MongoDB
mongodump --db real-estate --out backup

# Import to production (get URI from Railway)
mongorestore --uri "your_railway_mongo_uri" backup/real-estate
```

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend for Production
Update API base URL in frontend:

**Create/update `src/config.js`:**
```javascript
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://your-railway-backend-url.up.railway.app'
    : 'http://localhost:8000'
};

export default config;
```

**Update API calls to use config:**
```javascript
import config from './config';
// Use config.API_BASE_URL instead of localhost
```

### 3.2 Deploy to Vercel
1. Go to https://vercel.com → Sign up/Login
2. Click "New Project" → Import from GitHub
3. Select your repo → Configure:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### 3.3 Environment Variables for Frontend
In Vercel dashboard:
- `REACT_APP_API_URL`: Your Railway backend URL
- `REACT_APP_GOOGLE_MAPS_API_KEY`: Your Google Maps key

## Step 4: Domain Setup (Optional)

### 4.1 Custom Domain for Frontend
In Vercel:
1. Go to project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### 4.2 Custom Domain for Backend
In Railway:
1. Go to project → Settings → Domains
2. Add custom domain
3. Update DNS records

## Step 5: Testing & Monitoring

### 5.1 Test All Features
- User registration/login
- Email functionality
- Property listings
- Google Maps integration
- Image uploads
- Payment processing (if applicable)

### 5.2 Monitoring
- Check Railway/Vercel logs for errors
- Monitor MongoDB Atlas dashboard
- Set up uptime monitoring (e.g., UptimeRobot)

## Step 6: Security Checklist

- [ ] HTTPS enabled (automatic on Railway/Vercel)
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] CORS properly configured
- [ ] JWT secrets strong and unique
- [ ] API keys not exposed in frontend
- [ ] Rate limiting implemented
- [ ] Input validation active

## Cost Estimation

**Railway (Hobby Plan):**
- Backend: ~$5/month
- Database: ~$5/month
- Total: ~$10/month

**Vercel (Hobby Plan):**
- Frontend: Free
- Custom domain: ~$9/month (optional)

**MongoDB Atlas (Shared Clusters):**
- Database: Free tier available

**Total Estimated Cost:** $0-20/month

## Quick Commands

```bash
# Backend production start
npm start

# Frontend build
npm run build

# Test production build locally
serve -s build
```

## Troubleshooting

**Common Issues:**
1. **CORS errors**: Check `CORS_ORIGIN` in backend
2. **Database connection**: Verify MongoDB URI
3. **Email not working**: Check Gmail app password
4. **API calls failing**: Verify frontend API_BASE_URL

**Support:**
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com