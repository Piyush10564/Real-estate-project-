import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserProfile.css';

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setUploadingImage(true);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
      setIsEditing(false);
      setProfileImagePreview(null);
      setUploadingImage(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setUploadingImage(false);
      alert('Error updating profile');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-banner"></div>
      
      <div className="profile-container">
        {!isEditing ? (
          <>
            <div className="profile-header">
              <div className="profile-image-wrapper">
                <img 
                  src={user.profileImage || 'https://via.placeholder.com/200?text=No+Image'} 
                  alt={user.firstName}
                  className="profile-image"
                />
              </div>
              
              <div className="profile-info">
                <h1>{user.firstName} {user.lastName}</h1>
                <span className="user-type">{user.userType.toUpperCase()}</span>
                <p className="email">
                  <i className="icon">📧</i> {user.email}
                </p>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-card">
                <div className="detail-icon">📱</div>
                <div className="detail-content">
                  <h3>Phone</h3>
                  <p>{user.phone || 'Not provided'}</p>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <h3>Location</h3>
                  <p>{user.location || 'Not provided'}</p>
                </div>
              </div>

              {user.company && (
                <div className="detail-card">
                  <div className="detail-icon">🏢</div>
                  <div className="detail-content">
                    <h3>Company</h3>
                    <p>{user.company}</p>
                  </div>
                </div>
              )}

              {user.bio && (
                <div className="detail-card bio-card">
                  <div className="detail-icon">✍️</div>
                  <div className="detail-content">
                    <h3>Bio</h3>
                    <p>{user.bio}</p>
                  </div>
                </div>
              )}

              <div className="detail-card">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <h3>Member Since</h3>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {user.verified && (
                <div className="detail-card verified">
                  <div className="detail-icon">✅</div>
                  <div className="detail-content">
                    <h3>Verification</h3>
                    <p>Verified User</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-header">
              <h2>Edit Your Profile</h2>
              <span className="form-subtitle">Update your personal information</span>
            </div>

            <div className="profile-image-edit">
              <img 
                src={profileImagePreview || user.profileImage || 'https://via.placeholder.com/200?text=No+Image'} 
                alt="Preview"
                className="profile-image-preview"
              />
              <div className="upload-section">
                <label htmlFor="profileImage" className="upload-label">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: 'none' }}
                  />
                  <span className="upload-btn">📷 Choose Photo</span>
                </label>
                <p className="upload-hint">JPG, PNG up to 5MB</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                />
              </div>

              <div className="form-group full-width">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={uploadingImage}>
                {uploadingImage ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user);
                  setProfileImagePreview(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
