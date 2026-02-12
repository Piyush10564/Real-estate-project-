import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import ReviewCard from '../components/ReviewCard';
import StarRatings from 'react-star-ratings';
import { FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaHeart, FaShare, FaPhone, FaEnvelope } from 'react-icons/fa';
import { formatPriceINR } from '../utils/priceFormatter';
import '../styles/PropertyDetails.css';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/property/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to add a review');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/reviews',
        { property: id, ...newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(
          'http://localhost:5000/api/favorites',
          { propertyId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading || !property) return <div className="loading">Loading...</div>;

  const imageUrl = property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/600x400';

  return (
    <div className="property-details">
      <div className="property-gallery">
        <img src={imageUrl} alt={property.title} />
        <div className="property-actions">
          <button className="action-btn" onClick={handleToggleFavorite}>
            <FaHeart style={{ color: isFavorite ? 'red' : 'white' }} />
          </button>
          <button className="action-btn">
            <FaShare />
          </button>
        </div>
      </div>

      <div className="details-container">
        <div className="main-details">
          <h1>{property.title}</h1>
          <div className="price-section">
            <span className="price">{formatPriceINR(property.price)}</span>
            <span className="status">{property.listingStatus}</span>
          </div>

          <div className="location">
            <FaMapMarkerAlt /> {property.address}, {property.city}, {property.state}
          </div>

          <div className="key-features">
            <div className="feature">
              <strong>{property.bedrooms}</strong>
              <span>Bedrooms</span>
            </div>
            <div className="feature">
              <strong>{property.bathrooms}</strong>
              <span>Bathrooms</span>
            </div>
            <div className="feature">
              <strong>{property.area?.toLocaleString()}</strong>
              <span>sq ft</span>
            </div>
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="amenities">
              <h3>Amenities</h3>
              <ul>
                {property.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="seller-card">
            <h3>Seller Information</h3>
            <div className="seller-info">
              <img src={property.seller?.profileImage || 'https://via.placeholder.com/100'} alt={property.seller?.firstName} />
              <div>
                <h4>{property.seller?.firstName} {property.seller?.lastName}</h4>
                <p>{property.seller?.company}</p>
                <p className="contact-info">
                  <FaPhone /> {property.seller?.phone}
                </p>
                <p className="contact-info">
                  <FaEnvelope /> {property.seller?.email}
                </p>
              </div>
            </div>
            <button className="contact-btn">Contact Seller</button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2>Reviews & Ratings</h2>

        {token && (
          <div className="add-review">
            <h3>Leave a Review</h3>
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label>Rating</label>
                <StarRatings
                  rating={newReview.rating}
                  starRatedColor="#ffc107"
                  numberOfStars={5}
                  name="rating"
                  changeRating={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Submit Review</button>
            </form>
          </div>
        )}

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewCard key={review._id} review={review} />
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default PropertyDetails;
