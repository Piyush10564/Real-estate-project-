import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import '../styles/MyListings.css';

function MyListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMyListings();
  }, [token, navigate]);

  const fetchMyListings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties?limit=100', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const myProperties = response.data.properties.filter(p => p.seller._id === user.id || p.seller === user.id);
      setProperties(myProperties);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/properties/${propertyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProperties(properties.filter(p => p._id !== propertyId));
        alert('Property deleted successfully');
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-listings">
      <div className="container">
        <div className="header">
          <h1>My Listings</h1>
          <button className="post-btn" onClick={() => navigate('/post-property')}>
            Post New Property
          </button>
        </div>

        {properties.length > 0 ? (
          <div className="listings-grid">
            {properties.map(property => (
              <div key={property._id} className="listing-item">
                <PropertyCard property={property} />
                <div className="listing-actions">
                  <button className="edit-btn" onClick={() => navigate(`/edit-property/${property._id}`)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">
            <p>You have no listings yet.</p>
            <button className="post-btn" onClick={() => navigate('/post-property')}>
              Post Your First Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;
