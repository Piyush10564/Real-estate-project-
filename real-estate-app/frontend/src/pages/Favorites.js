import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import '../styles/Favorites.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchFavorites = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get('http://localhost:8000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load favorites. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [token, navigate, fetchFavorites]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/favorites/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(prev => prev.filter(f => f.property._id !== propertyId));
      alert('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  if (error) {
    return (
      <div className="favorites">
        <div className="container">
          <h1>My Favorites</h1>
          <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
            <p>{error}</p>
            <button onClick={() => fetchFavorites()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // Filter out favorites with null/deleted properties
  const validFavorites = favorites.filter(favorite => favorite.property && favorite.property._id);

  return (
    <div className="favorites">
      <div className="container">
        <h1>My Favorites</h1>

        {validFavorites.length > 0 ? (
          <div className="favorites-grid">
            {validFavorites.map(favorite => (
              <div key={favorite.property._id} className="favorite-item">
                <PropertyCard property={favorite.property} />
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFavorite(favorite.property._id)}
                >
                  Remove from Favorites
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-favorites">
            <p>You haven't added any properties to favorites yet.</p>
            <button className="search-btn" onClick={() => navigate('/search')}>
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
