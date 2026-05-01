import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRuler } from 'react-icons/fa';
import '../styles/Favorites.css';

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const token = localStorage.getItem('token');

  const fetchFavorites = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        'https://propify-vi62.onrender.com/api/favorites',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError('Failed to load favorites. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = async (propertyId) => {
    try {
      setRemovingId(propertyId);

      await axios.delete(
        `https://propify-vi62.onrender.com/api/favorites/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorites((prev) =>
        prev.filter((fav) => fav.property._id !== propertyId)
      );

      alert('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);

      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      setError('Failed to remove from favorites. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <h2>Loading favorites...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>
          <FaHeart /> My Favorites
        </h1>
        <p>Your saved properties</p>
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <h2>No favorite properties yet</h2>
          <p>Start browsing and save properties you like.</p>

          <Link to="/search" className="browse-btn">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => {
            const property = favorite.property;

            return (
              <div className="favorite-card" key={property._id}>
                <img
                  src={
                    property.images?.[0] ||
                    'https://via.placeholder.com/400x250'
                  }
                  alt={property.title}
                  className="favorite-image"
                />

                <div className="favorite-content">
                  <h2>{property.title}</h2>

                  <p className="favorite-location">
                    <FaMapMarkerAlt /> {property.city}, {property.state}
                  </p>

                  <h3 className="favorite-price">
                    ₹{property.price?.toLocaleString()}
                  </h3>

                  <div className="favorite-details">
                    <span>
                      <FaBed /> {property.bedrooms} Beds
                    </span>

                    <span>
                      <FaBath /> {property.bathrooms} Baths
                    </span>

                    <span>
                      <FaRuler /> {property.area} sqft
                    </span>
                  </div>

                  <div className="favorite-actions">
                    <Link
                      to={`/property/${property._id}`}
                      className="view-btn"
                    >
                      View Details
                    </Link>

                    <button
                      className="remove-btn"
                      onClick={() => removeFavorite(property._id)}
                      disabled={removingId === property._id}
                    >
                      {removingId === property._id
                        ? 'Removing...'
                        : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Favorites;