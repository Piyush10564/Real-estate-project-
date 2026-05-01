import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewCard from '../components/ReviewCard';
import PropertyMap from '../components/PropertyMap';
import StarRatings from 'react-star-ratings';
import { FaMapMarkerAlt, FaHeart, FaShare, FaPhone, FaEnvelope } from 'react-icons/fa';
import { formatPriceINR } from '../utils/priceFormatter';
import '../styles/PropertyDetails.css';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    message: '',
    phone: ''
  });
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchPropertyDetails = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reviews/property/${id}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [fetchPropertyDetails, fetchReviews]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to add a review');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/reviews',
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
        await axios.delete(`http://localhost:8000/api/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(
          'http://localhost:8000/api/favorites',
          { propertyId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to send inquiry');
      return;
    }

    if (!inquiryForm.message.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/inquiries',
        {
          sellerId: property.seller._id,
          propertyId: id,
          message: inquiryForm.message,
          buyerPhone: inquiryForm.phone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Inquiry sent successfully!');
      setShowInquiryModal(false);
      setInquiryForm({ message: '', phone: '' });
    } catch (error) {
      console.error('Error sending inquiry:', error);
      alert('Failed to send inquiry. Please try again.');
    }
  };

  if (loading || !property) return <div className="loading">Loading property details...</div>;

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

          <div className="map-section">
            <h3>Location on Map</h3>
            <PropertyMap property={property} />
          </div>

          <section className="reviews-section">
            <h2>Reviews & Ratings</h2>

            {token && (
              <div className="add-review">
                <h3>Leave a Review</h3>
                <form onSubmit={handleAddReview}>
                  <div className="form-group">
                    <label>Rating</label>
                    <div style={{ paddingTop: '8px' }}>
                      <StarRatings
                        rating={newReview.rating}
                        starRatedColor="#ffc107"
                        numberOfStars={5}
                        starDimension="28px"
                        starSpacing="4px"
                        changeRating={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                      />
                    </div>
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
            <button className="contact-btn" onClick={() => setShowInquiryModal(true)}>Contact Seller</button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="modal-overlay" onClick={() => setShowInquiryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Express Interest in Property</h2>
              <button className="close-btn" onClick={() => setShowInquiryModal(false)}>×</button>
            </div>
            <form onSubmit={handleSendInquiry} className="inquiry-form">
              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell the seller why you're interested in this property..."
                  rows="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Your Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowInquiryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;
