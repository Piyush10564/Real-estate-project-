# Quick Start Guide

## 🚀 Setup Instructions (5 minutes)

### Step 1: Prerequisites
- Install [Node.js](https://nodejs.org/) (v14+)
- Install [MongoDB](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Git installed

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd real-estate-app/backend

# Install dependencies
npm install

# Create .env file with:
MONGODB_URI=mongodb://localhost:27017/real-estate
PORT=5000
JWT_SECRET=your_secret_key_123

# Start backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### Step 3: Frontend Setup (in new terminal)

```bash
# Navigate to frontend folder
cd real-estate-app/frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend opens at: `http://localhost:3000`

## ✅ Verify Installation

1. Backend should show: `Server running on port 5000`
2. Frontend should open in browser automatically
3. Click "Register" to create test account

## 📝 Quick Test

1. Register as a Seller
2. Go to "Post Property" and add a property
3. Logout and login as a Buyer
4. Search for properties
5. Add property to favorites
6. Leave a review

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB error | Make sure MongoDB is running |
| Port 5000 in use | Change PORT in .env |
| "Cannot find module" | Run `npm install` again |
| Blank page in browser | Check browser console (F12) |

## 📚 Key Features to Test

- ✅ User Registration/Login
- ✅ Property Listing
- ✅ Advanced Search
- ✅ Reviews & Ratings
- ✅ Favorites
- ✅ User Profile

## 🎓 For Your Project Submission

1. Create a GitHub repository
2. Push code with meaningful commits
3. Include this README
4. Create a demo video (5-10 minutes)
5. Write a project report (500-1000 words)

---

**You're all set! Happy coding! 🎉**
