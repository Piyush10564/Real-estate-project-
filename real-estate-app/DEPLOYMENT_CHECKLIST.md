# ✅ Deployment Checklist

## Pre-Deployment
- [ ] Code committed and pushed to GitHub
- [ ] Environment variables configured (.env.production)
- [ ] API calls updated to use config (not localhost)
- [ ] Build tested locally (`npm run build` in frontend)

## Backend Deployment (Railway)
- [ ] Account created at https://railway.app
- [ ] New project created from GitHub repo
- [ ] Environment variables set:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] CORS_ORIGIN
  - [ ] FRONTEND_URL
  - [ ] EMAIL_USER & EMAIL_PASSWORD
  - [ ] CLOUDINARY_* (if using)
  - [ ] GOOGLE_MAPS_API_KEY
- [ ] Database connected (Railway provides MongoDB)
- [ ] Backend URL noted (for frontend config)

## Frontend Deployment (Vercel)
- [ ] Account created at https://vercel.com
- [ ] New project created from GitHub repo
- [ ] Build settings:
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
  - [ ] Install Command: `npm install`
- [ ] Environment variables set:
  - [ ] REACT_APP_API_URL (Railway backend URL)
  - [ ] REACT_APP_GOOGLE_MAPS_API_KEY
- [ ] Frontend URL noted

## Post-Deployment
- [ ] Update backend CORS_ORIGIN with frontend URL
- [ ] Update backend FRONTEND_URL with frontend URL
- [ ] Test user registration (email should work)
- [ ] Test login/logout
- [ ] Test property listings
- [ ] Test Google Maps integration
- [ ] Test payment integration (if applicable)
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## Domain Setup (Optional)
- [ ] Custom domain purchased
- [ ] DNS configured for Vercel
- [ ] SSL certificate (automatic)
- [ ] Backend domain configured in Railway

## Monitoring
- [ ] Check Railway logs for backend errors
- [ ] Check Vercel logs for frontend errors
- [ ] Monitor MongoDB Atlas usage
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry, etc.)

## Security
- [ ] Environment variables not exposed
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] API keys secured
- [ ] Database access restricted
- [ ] Regular security updates

## Performance
- [ ] Images optimized
- [ ] Code minified
- [ ] CDN configured (if needed)
- [ ] Database queries optimized
- [ ] Caching implemented (if needed)