import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import '../styles/Favorites.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [token, navigate]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/favorites/${propertyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(favorites.filter(f => f.property._id !== propertyId));
      alert('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="favorites">
      <div className="container">
        <h1>My Favorites</h1>

        {favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map(favorite => (
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
