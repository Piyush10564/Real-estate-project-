# Real Estate Property Listing App - Project Manual

## 📋 Table of Contents
1. Project Overview
2. System Architecture
3. Features & Functionalities
4. Technology Stack
5. Installation & Setup
6. API Documentation
7. Code Structure
8. Testing Guidelines
9. Deployment
10. Project Submission

---

## 1. Project Overview

### What is this project?
A full-stack web application for real estate property listing where users can:
- Browse available properties
- Post new property listings
- Leave reviews and ratings
- Manage favorites
- Search with advanced filters
- View seller information

### Target Users
- **Buyers**: Browse and search properties
- **Sellers**: Post and manage property listings
- **Agents**: Post properties and manage listings

### Business Value
- Connects buyers and sellers in real estate market
- Reduces time in property search
- Provides transparent reviews and ratings
- Builds trust through verified user profiles

---

## 2. System Architecture

### Architecture Diagram
```
┌─────────────────────────────────────────────────────┐
│            Frontend (React)                          │
│  ┌──────────────────────────────────────────────┐   │
│  │  • Components (Navbar, Cards, Forms)        │   │
│  │  • Pages (Home, Search, Details, etc)       │   │
│  │  • Services (API Calls)                     │   │
│  │  • State Management (Zustand/Context)       │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↓ Axios
┌─────────────────────────────────────────────────────┐
│            Backend (Node.js/Express)                │
│  ┌──────────────────────────────────────────────┐   │
│  │  • Routes (auth, properties, reviews, etc)   │   │
│  │  • Controllers (Business Logic)              │   │
│  │  • Middleware (Authentication)               │   │
│  │  • Database (MongoDB)                        │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│          Database (MongoDB)                         │
│  • Users Collection                                 │
│  • Properties Collection                            │
│  • Reviews Collection                               │
│  • Favorites Collection                             │
└─────────────────────────────────────────────────────┘
```

### Data Flow
1. User interacts with React UI
2. React calls backend API via Axios
3. Backend validates request and checks authentication
4. Backend queries MongoDB
5. Data returned to frontend
6. UI updates with new data

---

## 3. Features & Functionalities

### Core Features

#### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Different user types (buyer, seller, agent)
- Password hashing with bcryptjs

#### Property Management
- **Search**: Filter by city, price, type, bedrooms, bathrooms
- **Browse**: View all available properties
- **Details**: See full property information
- **Post**: Sellers can list new properties
- **Edit/Delete**: Manage own listings

#### Reviews & Ratings
- Leave star ratings (1-5)
- Write detailed reviews
- View all property reviews
- Average rating calculation

#### Favorites
- Save properties to favorites
- View favorite properties
- Remove from favorites
- Quick access to saved properties

#### User Profiles
- View user information
- Edit profile details
- See user's listings (for sellers)
- Ratings summary

---

## 4. Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| React Router | Navigation |
| Axios | API Calls |
| CSS3 | Styling |
| React Icons | Icons |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |

### Tools
- VS Code (Editor)
- Git (Version Control)
- Postman (API Testing)
- MongoDB Compass (DB Management)

---

## 5. Installation & Setup

### Prerequisites
```bash
# Check Node version (should be 14+)
node --version

# Check npm version
npm --version
```

### Backend Installation

```bash
# 1. Navigate to backend
cd real-estate-app/backend

# 2. Install packages
npm install

# 3. Create .env file
# Add the following:
MONGODB_URI=mongodb://localhost:27017/real-estate
PORT=5000
JWT_SECRET=your_secret_key_123_change_this
NODE_ENV=development

# 4. Start MongoDB
# On Windows: Open MongoDB as a service
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# 5. Start server
npm run dev

# Success: Server running on port 5000
```

### Frontend Installation

```bash
# 1. Navigate to frontend
cd real-estate-app/frontend

# 2. Install packages
npm install

# 3. Start development server
npm start

# Opens at http://localhost:3000
```

---

## 6. API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "userType": "buyer" | "seller" | "agent"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "buyer"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}

Response:
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Property Endpoints

#### Get All Properties
```
GET /api/properties?city=New+York&minPrice=100000&maxPrice=500000&limit=10

Response:
{
  "properties": [...],
  "total": 50,
  "pages": 5,
  "currentPage": 1
}
```

#### Get Property Details
```
GET /api/properties/:id

Response:
{
  "_id": "property_id",
  "title": "Beautiful 2BHK Apartment",
  "price": 250000,
  "bedrooms": 2,
  "bathrooms": 1,
  "description": "...",
  "seller": {
    "_id": "seller_id",
    "firstName": "Jane",
    "email": "jane@example.com"
  }
}
```

#### Create Property
```
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Beautiful 2BHK Apartment",
  "description": "...",
  "price": 250000,
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 1,
  "area": 1000,
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "amenities": ["gym", "pool"]
}
```

---

## 7. Code Structure

### Frontend Component Structure
```
components/
├── Navbar.js          - Navigation bar
├── PropertyCard.js    - Property listing card
├── ReviewCard.js      - Review display
└── Footer.js          - Footer

pages/
├── Home.js            - Homepage
├── SearchResults.js   - Search page
├── PropertyDetails.js - Property details
├── Login.js           - Login page
├── Register.js        - Registration
├── PostProperty.js    - Post property form
├── UserProfile.js     - User profile
├── MyListings.js      - User's listings
└── Favorites.js       - Saved properties

styles/
├── App.css            - Global styles
├── Navbar.css
├── PropertyCard.css
└── ...                - Other component styles
```

### Backend Model Structure
```
models/
├── User.js            - User schema
├── Property.js        - Property schema
├── Review.js          - Review schema
└── Favorite.js        - Favorite schema

routes/
├── auth.js            - Auth endpoints
├── properties.js      - Property endpoints
├── reviews.js         - Review endpoints
├── users.js           - User endpoints
└── favorites.js       - Favorite endpoints

middleware/
└── auth.js            - JWT verification
```

---

## 8. Testing Guidelines

### Manual Testing Checklist

#### Authentication
- [ ] Register with new account
- [ ] Login with credentials
- [ ] Logout successfully
- [ ] JWT token persists
- [ ] Protected routes work

#### Properties
- [ ] Browse all properties
- [ ] Search by city
- [ ] Filter by price range
- [ ] Filter by property type
- [ ] View property details
- [ ] See seller information

#### Seller Features
- [ ] Login as seller
- [ ] Post new property
- [ ] Edit property details
- [ ] Delete property
- [ ] View my listings

#### Reviews
- [ ] Add review to property
- [ ] Rate property
- [ ] View all reviews
- [ ] See average rating
- [ ] Delete own review

#### Favorites
- [ ] Add to favorites
- [ ] View favorites page
- [ ] Remove from favorites
- [ ] Heart icon updates

### API Testing (Postman)
1. Import API endpoints
2. Set up environment variables
3. Test each endpoint
4. Verify response codes
5. Check error handling

---

## 9. Deployment

### Deploying Backend (Heroku)

```bash
# 1. Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create your-app-name

# 4. Add MongoDB URI
heroku config:set MONGODB_URI=your_mongodb_connection

# 5. Deploy
git push heroku main

# 6. Check logs
heroku logs --tail
```

### Deploying Frontend (Vercel/Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel
# Follow prompts
```

**Netlify:**
```bash
npm run build
# Drag and drop build folder to netlify.com
```

---

## 10. Project Submission

### Required Documents

1. **README.md**
   - Project overview
   - Setup instructions
   - Feature list

2. **Project Report** (500-1000 words)
   - Problem statement
   - Solution approach
   - Technologies used
   - Key features
   - Challenges and solutions

3. **Code Documentation**
   - Function documentation
   - Component descriptions
   - API documentation

4. **Demo Checklist**
   - Video showing all features
   - Screenshots
   - Test cases

### Code Quality Checklist
- [ ] Code is well-commented
- [ ] Variable names are meaningful
- [ ] No console errors
- [ ] Proper error handling
- [ ] Responsive design
- [ ] Security practices followed

### Git Repository
- [ ] .gitignore configured
- [ ] Meaningful commit messages
- [ ] README updated
- [ ] .env.example created

### Testing
- [ ] All features tested
- [ ] Edge cases handled
- [ ] Error messages are clear
- [ ] Performance acceptable

---

## 🎓 Final Tips for Your Project

### Code Best Practices
```javascript
// ✅ Good
const handlePropertySearch = (filters) => {
  // Clear implementation
  return filteredProperties;
};

// ❌ Avoid
const h = (f) => {
  return p;
};
```

### Error Handling
```javascript
// ✅ Good
try {
  const data = await fetchData();
} catch (error) {
  setError(error.message);
  console.error('Failed to fetch:', error);
}

// ❌ Avoid
await fetchData(); // No error handling
```

### Comments
```javascript
// ✅ Good
// Fetch properties based on applied filters
const searchProperties = async (filters) => { ... }

// ❌ Avoid
// Do the search
const search = async (f) => { ... }
```

### Environment Variables
```bash
# Create .env.example for team members
MONGODB_URI=mongodb://localhost:27017/real-estate
PORT=5000
JWT_SECRET=your_secret_here
```

---

## 📞 Support Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB University](https://university.mongodb.com)
- [Stack Overflow](https://stackoverflow.com)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 🎉 Congratulations!

You now have a complete, production-ready real estate application that demonstrates:
- Full-stack development skills
- Database design
- API development
- Frontend architecture
- User authentication
- Project management

**Good luck with your final year project! 🚀**

---

**Version**: 1.0  
**Last Updated**: February 2026  
**Status**: Production Ready
