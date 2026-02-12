# Real Estate Property Listing App - Complete Project

A full-stack real estate property listing application built with **React**, **Node.js**, **Express**, and **MongoDB**. This application allows users to browse properties, post new listings, leave reviews, and manage favorites.

## 🎯 Features

### User Features
- **User Authentication**: Register and login with different user types (Buyer, Seller, Agent)
- **Property Browsing**: Advanced property search with filters (city, price, bedrooms, bathrooms, type)
- **Property Details**: Detailed property view with images, amenities, and seller information
- **Reviews & Ratings**: Leave and view reviews for properties
- **Favorites**: Save favorite properties for later
- **User Profile**: Manage user profile information

### Seller Features
- **Post Properties**: Create new property listings with images and details
- **Manage Listings**: Edit and delete your listings
- **View Analytics**: Track your property listings

### Additional Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI/UX**: Beautiful gradient design with smooth animations
- **Search & Filter**: Advanced filtering for properties
- **Real-time Updates**: Backend API for real-time data updates

## 📁 Project Structure

```
real-estate-app/
├── frontend/                      # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── PropertyCard.js
│   │   │   ├── ReviewCard.js
│   │   │   └── Footer.js
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.js
│   │   │   ├── SearchResults.js
│   │   │   ├── PropertyDetails.js
│   │   │   ├── PostProperty.js
│   │   │   ├── UserProfile.js
│   │   │   ├── MyListings.js
│   │   │   ├── Favorites.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── services/              # API services
│   │   ├── store/                 # State management
│   │   ├── styles/                # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── backend/                       # Node.js backend
    ├── models/                    # Database models
    │   ├── User.js
    │   ├── Property.js
    │   ├── Review.js
    │   └── Favorite.js
    ├── routes/                    # API routes
    │   ├── auth.js
    │   ├── properties.js
    │   ├── reviews.js
    │   ├── users.js
    │   └── favorites.js
    ├── middleware/
    │   └── auth.js
    ├── server.js
    ├── .env
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd real-estate-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/real-estate
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start MongoDB:
```bash
# If using local MongoDB
mongod
```

5. Run the backend server:
```bash
npm run dev
```

Backend should run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd real-estate-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend should open at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create new property (seller only)
- `PUT /api/properties/:id` - Update property (seller only)
- `DELETE /api/properties/:id` - Delete property (seller only)

### Reviews
- `GET /api/reviews/property/:propertyId` - Get reviews for property
- `POST /api/reviews` - Create new review
- `DELETE /api/reviews/:id` - Delete review

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:
- Token is stored in localStorage
- Include token in Authorization header: `Bearer {token}`
- Tokens expire in 7 days

## 💾 Database Schema

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  profileImage: String,
  userType: 'buyer' | 'seller' | 'agent',
  bio: String,
  company: String,
  verified: Boolean,
  createdAt: Date
}
```

### Property Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial' | 'plot',
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  address: String,
  city: String,
  state: String,
  images: [String],
  amenities: [String],
  seller: ObjectId (ref: User),
  listingStatus: 'available' | 'sold' | 'rented' | 'pending',
  createdAt: Date
}
```

### Review Model
```javascript
{
  property: ObjectId (ref: Property),
  reviewer: ObjectId (ref: User),
  rating: Number (1-5),
  comment: String,
  reviewType: 'property' | 'agent' | 'seller',
  createdAt: Date
}
```

## 🎨 Design Features

- **Gradient Colors**: Beautiful purple gradient (#667eea to #764ba2)
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adapts to all screen sizes
- **Modern Icons**: React Icons for UI elements
- **Clean Layout**: Well-organized components

## 🔧 Technologies Used

### Frontend
- React 18
- React Router DOM
- Axios
- React Icons
- React Star Ratings
- Framer Motion
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## 📝 Future Enhancements

- [ ] Google Maps integration for property locations
- [ ] Virtual tours integration (Matterport)
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Image upload to Cloudinary
- [ ] Chat functionality between buyers and sellers
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Property comparison feature
- [ ] Wishlist functionality

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Try: `mongodb://localhost:27017/` for local DB

### Frontend API Errors
- Check backend is running on port 5000
- Verify `.env` configuration
- Check browser console for errors

### Port Already in Use
- Backend: `netstat -ano | findstr :5000` (Windows) or `lsof -i :5000` (Mac/Linux)
- Frontend: Change port in package.json scripts

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Authentication](https://jwt.io)

## 👨‍💼 Project Submission Tips

1. **Documentation**: Include README with setup instructions
2. **Code Quality**: Write clean, commented code
3. **Error Handling**: Implement proper error handling
4. **Testing**: Test all features thoroughly
5. **Performance**: Optimize API calls and UI rendering
6. **Security**: Use environment variables for sensitive data
7. **Version Control**: Use Git with meaningful commits

## 📄 License

This project is free to use for educational purposes.

---

**Happy Coding! 🚀**

For any questions or issues, refer to the documentation or debug console.
