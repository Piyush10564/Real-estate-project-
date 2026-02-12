import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaUser, FaHeart, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaHome /> Real Estate
        </Link>

        <div className="nav-menu">
          <div className="nav-search">
            <input type="text" placeholder="Search by city, location..." />
            <FaSearch className="search-icon" />
          </div>

          <Link to="/search" className="nav-link">
            <FaSearch /> Search
          </Link>

          {token && user.userType === 'seller' && (
            <Link to="/post-property" className="nav-link">
              <FaPlus /> Post Property
            </Link>
          )}

          {token && (
            <>
              <Link to="/favorites" className="nav-link">
                <FaHeart /> Favorites
              </Link>
              <Link to={`/profile/${user.id}`} className="nav-link">
                <FaUser /> Profile
              </Link>
              {user.userType === 'seller' && (
                <Link to="/my-listings" className="nav-link">
                  My Listings
                </Link>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-button">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
