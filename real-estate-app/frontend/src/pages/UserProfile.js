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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-container">
        <div className="profile-header">
          <img src={user.profileImage || 'https://via.placeholder.com/150'} alt={user.firstName} />
          <div className="profile-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="user-type">{user.userType}</p>
            <p className="email">{user.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{user.phone || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Location:</span>
              <span className="value">{user.location || 'Not provided'}</span>
            </div>
            {user.company && (
              <div className="detail-item">
                <span className="label">Company:</span>
                <span className="value">{user.company}</span>
              </div>
            )}
            {user.bio && (
              <div className="detail-item">
                <span className="label">Bio:</span>
                <span className="value">{user.bio}</span>
              </div>
            )}
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="edit-form">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(user);
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
