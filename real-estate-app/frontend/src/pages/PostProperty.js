import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PostProperty.css';

function PostProperty() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    amenities: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: value.split(',').map(a => a.trim())
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // In production, you would upload to Cloudinary
    setFormData(prev => ({
      ...prev,
      images: files.map(f => URL.createObjectURL(f))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area)
      };

      await axios.post(
        'http://localhost:5000/api/properties',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Property posted successfully!');
      navigate('/my-listings');
    } catch (error) {
      alert(error.response?.data?.message || 'Error posting property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-property">
      <div className="container">
        <h1>Post Your Property</h1>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label>Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Beautiful 2BHK Apartment"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows="5"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Property Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="plot">Plot</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Property Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Bathrooms *</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Area (sqft) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area in square feet"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Location</h2>

            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Amenities & Media</h2>

            <div className="form-group">
              <label>Amenities (comma-separated)</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={handleAmenitiesChange}
                placeholder="e.g., Gym, Pool, Parking, Security"
              />
            </div>

            <div className="form-group">
              <label>Upload Images</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
              />
              {formData.images.length > 0 && (
                <p>{formData.images.length} images selected</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Posting...' : 'Post Property'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostProperty;
