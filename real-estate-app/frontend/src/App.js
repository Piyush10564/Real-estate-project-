import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import SearchResults from './pages/SearchResults';
import PostProperty from './pages/PostProperty';
import UserProfile from './pages/UserProfile';
import MyListings from './pages/MyListings';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
