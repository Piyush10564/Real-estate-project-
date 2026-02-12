import React from 'react';
import { FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatPriceINR } from '../utils/priceFormatter';
import '../styles/PropertyCard.css';

function PropertyCard({ property }) {
  // Real property images from web sources
  const sampleImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1682519/pexels-photo-1682519.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1458384/pexels-photo-1458384.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1889600/pexels-photo-1889600.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1454496/pexels-photo-1454496.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  // Use property image or random sample image
  const getImageUrl = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    // Use a deterministic sample image based on property ID
    const index = (property._id?.charCodeAt(0) || 0) % sampleImages.length;
    return sampleImages[index];
  };

  const imageUrl = getImageUrl();

  return (
    <div className="property-card">
      <div className="property-image">
        <img src={imageUrl} alt={property.title} onError={(e) => {
          e.target.src = sampleImages[0];
        }} />
        <span className="property-badge">{property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1)}</span>
      </div>

      <div className="property-info">
        <h3 title={property.title}>{property.title}</h3>

        <div className="property-price">
          {formatPriceINR(property.price)}
        </div>

        <p className="property-address" title={`${property.address}, ${property.city}`}>
          <FaMapMarkerAlt /> {property.city}
        </p>

        <div className="property-details">
          <div className="detail-item" title={`${property.bedrooms} Bedrooms`}>
            <FaBed /> {property.bedrooms}
          </div>
          <div className="detail-item" title={`${property.bathrooms} Bathrooms`}>
            <FaBath /> {property.bathrooms}
          </div>
          <div className="detail-item" title={`${property.area} sq ft`}>
            <FaRuler /> {property.area?.toLocaleString()}
          </div>
        </div>

        <div className="property-seller" title={`By ${property.seller?.firstName} ${property.seller?.lastName}`}>
          <FaUser /> {property.seller?.firstName} {property.seller?.lastName}
        </div>

        <Link to={`/property/${property._id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PropertyCard;
