import api from '../utils/api';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaTrash, FaEnvelope, FaClock, FaHome } from 'react-icons/fa';
import { formatPriceINR } from '../utils/priceFormatter';
import '../styles/UserProfile.css';

/* ───────────────────────────────────────────
   MINI PROPERTY CARD  (self-contained, dark)
─────────────────────────────────────────── */
function FavPropertyCard({ property, onRemove }) {
  const sampleImages = [
    'https://images.pexels.com/photos/1458384/pexels-photo-1458384.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1889600/pexels-photo-1889600.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];
  const imgSrc =
    property.images && property.images.length > 0
      ? property.images[0]
      : sampleImages[(property._id?.charCodeAt(0) || 0) % sampleImages.length];

  return (
    <div className="fav-card">
      <div className="fav-card-img-wrap">
        <img src={imgSrc} alt={property.title} onError={e => { e.target.src = sampleImages[0]; }} />
        <span className="fav-badge">{property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1)}</span>
      </div>
      <div className="fav-card-body">
        <h4 className="fav-card-title">{property.title}</h4>
        <p className="fav-card-price">{formatPriceINR(property.price)}</p>
        <p className="fav-card-loc"><FaMapMarkerAlt /> {property.city}, {property.state}</p>
        <div className="fav-card-stats">
          <span><FaBed /> {property.bedrooms} Beds</span>
          <span><FaBath /> {property.bathrooms} Baths</span>
          <span><FaRuler /> {property.area?.toLocaleString()} sqft</span>
        </div>
        <div className="fav-card-actions">
          <Link to={`/property/${property._id}`} className="fav-view-btn">View Details</Link>
          <button className="fav-remove-btn" onClick={() => onRemove(property._id)}>
            <FaTrash /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────── */
function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Tab: 'profile' | 'edit' | 'favorites' | 'messages'
  const [activeTab, setActiveTab] = useState('profile');

  /* -- profile state -- */
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  /* -- favorites state -- */
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  /* -- messages state -- */
  const [inquiries, setInquiries] = useState([]);
  const [msgTab, setMsgTab] = useState('received');
  const [msgLoading, setMsgLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  /* ── fetch profile ── */
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await api.get(`/api/users/${id}`);
      setUser(res.data);
      setFormData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchUserProfile(); }, [fetchUserProfile]);

  /* ── fetch favorites ── */
  const fetchFavorites = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    setFavLoading(true);
    try {
      const res = await api.get('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data);
    } catch (e) { console.error(e); }
    finally { setFavLoading(false); }
  }, [navigate, token]);

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await api.delete(`/api/favorites/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(prev => prev.filter(f => f.property._id !== propertyId));
    } catch (e) { console.error(e); }
  };

  /* ── fetch messages ── */
  const fetchInquiries = useCallback(async () => {
    if (!token) { navigate('/login'); return; }
    setMsgLoading(true);
    try {
      const res = await api.get(
        `/api/inquiries?type=${msgTab === 'all' ? '' : msgTab}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries(res.data.inquiries);
      setSelectedInquiry(null);
    } catch (e) { console.error(e); }
    finally { setMsgLoading(false); }
  }, [msgTab, navigate, token]);

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/api/inquiries/${inquiryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(prev => prev.filter(i => i._id !== inquiryId));
      setSelectedInquiry(null);
    } catch (e) { console.error(e); }
  };

  const handleMarkAsRead = async (inquiryId) => {
    try {
      await api.patch(`/api/inquiries/${inquiryId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInquiries();
    } catch (e) { console.error(e); }
  };

  /* ── sidebar nav handler ── */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'favorites') fetchFavorites();
    if (tab === 'messages') fetchInquiries();
  };

  useEffect(() => {
    if (activeTab === 'messages') fetchInquiries();
  }, [activeTab, fetchInquiries]);

  /* ── profile update ── */
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
    setUploadingImage(true);
    try {
      const res = await api.put(`/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
      setActiveTab('profile');
      setProfileImagePreview(null);
      alert('Profile updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Error updating profile');
    } finally { setUploadingImage(false); }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  /* ── guards ── */
  if (loading) return <div className="loading">Loading profile...</div>;
  if (!user) return <div className="error">User not found</div>;

  const avatarSrc =
    profileImagePreview ||
    user.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent((user.firstName || 'U') + '+' + (user.lastName || ''))}&background=b8860b&color=000&size=200`;

  return (
    <div className="user-profile">
      <div className="profile-layout">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="profile-sidebar">
          <img src={user.profileImage || avatarSrc} alt={user.firstName} className="sidebar-avatar" />
          <p className="sidebar-name">{user.firstName} {user.lastName}</p>
          <p className="sidebar-email">{user.email}</p>
          <span className="sidebar-badge">{user.userType}</span>
          <div className="sidebar-divider" />
          <nav className="sidebar-nav">
            <button className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')}>
              <span className="nav-icon">👤</span> Profile
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => handleTabChange('edit')}>
              <span className="nav-icon">✏️</span> Edit Profile
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => handleTabChange('favorites')}>
              <span className="nav-icon">❤️</span> Favourites
            </button>
            <button className={`sidebar-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => handleTabChange('messages')}>
              <span className="nav-icon">💬</span> Messages
            </button>
            {user.userType === 'seller' && (
              <button className="sidebar-nav-item" onClick={() => navigate('/my-listings')}>
                <span className="nav-icon">🏠</span> My Listings
              </button>
            )}
          </nav>
        </aside>

        {/* ══════════ MAIN PANEL ══════════ */}
        <main className="profile-main">

          {/* ── VIEW PROFILE ── */}
          {activeTab === 'profile' && (
            <>
              <h2 className="profile-main-title">Account Settings</h2>
              <p className="profile-main-subtitle">View and manage your profile information</p>
              <div className="profile-view-header">
                <img src={user.profileImage || avatarSrc} alt={user.firstName} className="profile-view-avatar" />
                <div className="profile-view-info">
                  <span className="user-type">{user.userType?.toUpperCase()}</span>
                  <h1>{user.firstName} {user.lastName}</h1>
                  <p className="email">📧 {user.email}</p>
                  <button className="edit-btn" onClick={() => setActiveTab('edit')}>✏️ Edit Profile</button>
                </div>
              </div>
              <div className="profile-details-grid">
                <div className="detail-card">
                  <div className="detail-icon">📱</div>
                  <div className="detail-content"><h3>Phone</h3><p>{user.phone || 'Not provided'}</p></div>
                </div>
                <div className="detail-card">
                  <div className="detail-icon">📍</div>
                  <div className="detail-content"><h3>Location</h3><p>{user.location || 'Not provided'}</p></div>
                </div>
                {user.company && (
                  <div className="detail-card">
                    <div className="detail-icon">🏢</div>
                    <div className="detail-content"><h3>Company</h3><p>{user.company}</p></div>
                  </div>
                )}
                <div className="detail-card">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <h3>Member Since</h3>
                    <p>{new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                {user.verified && (
                  <div className="detail-card verified">
                    <div className="detail-icon">✅</div>
                    <div className="detail-content"><h3>Verification</h3><p>Verified User</p></div>
                  </div>
                )}
                {user.bio && (
                  <div className="detail-card bio-card">
                    <div className="detail-icon">✍️</div>
                    <div className="detail-content"><h3>Bio</h3><p>{user.bio}</p></div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── EDIT PROFILE ── */}
          {activeTab === 'edit' && (
            <form onSubmit={handleUpdate}>
              <h2 className="profile-main-title">Edit Profile</h2>
              <p className="profile-main-subtitle">Update your personal information below</p>
              <div className="avatar-edit-row">
                <img src={profileImagePreview || user.profileImage || avatarSrc} alt="Preview" className="avatar-edit-img" />
                <div className="avatar-edit-actions">
                  <label htmlFor="profileImage" className="avatar-upload-btn">
                    📷 Upload New
                    <input type="file" id="profileImage" accept="image/*" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                  </label>
                  <p className="avatar-hint">JPG, PNG up to 5MB</p>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name <span className="required">*</span></label>
                  <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} placeholder="First name" required />
                </div>
                <div className="form-group">
                  <label>Last Name <span className="required">*</span></label>
                  <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} placeholder="Last name" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email || ''} disabled style={{ opacity: 0.4, cursor: 'not-allowed' }} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="City, State" />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" name="company" value={formData.company || ''} onChange={handleChange} placeholder="Your company name" />
                </div>
                <div className="form-group full-width">
                  <label>Bio</label>
                  <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="4" placeholder="Tell us about yourself..." />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={uploadingImage}>
                  {uploadingImage ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
                <button type="button" className="cancel-btn" onClick={() => { setActiveTab('profile'); setFormData(user); setProfileImagePreview(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ── FAVOURITES ── */}
          {activeTab === 'favorites' && (
            <>
              <h2 className="profile-main-title">❤️ My Favourites</h2>
              <p className="profile-main-subtitle">Properties you've saved for later</p>

              {favLoading ? (
                <div className="tab-loading">Loading favourites...</div>
              ) : favorites.length === 0 ? (
                <div className="empty-tab">
                  <div className="empty-tab-icon">🏠</div>
                  <h3>No favourites yet</h3>
                  <p>Browse properties and save the ones you love!</p>
                  <button className="goto-btn" onClick={() => navigate('/search')}>Browse Properties</button>
                </div>
              ) : (
                <div className="fav-grid">
                  {favorites.map(fav => (
                    <FavPropertyCard
                      key={fav.property._id}
                      property={fav.property}
                      onRemove={handleRemoveFavorite}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── MESSAGES ── */}
          {activeTab === 'messages' && (
            <>
              <h2 className="profile-main-title">💬 Messages</h2>
              <p className="profile-main-subtitle">All your property inquiries and conversations</p>

              {/* Message sub-tabs */}
              <div className="msg-tabs">
                {['received', 'sent', 'all'].map(t => (
                  <button key={t} className={`msg-tab ${msgTab === t ? 'active' : ''}`} onClick={() => setMsgTab(t)}>
                    <FaEnvelope /> {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="msg-layout">
                {/* List */}
                <div className="msg-list">
                  {msgLoading ? (
                    <div className="tab-loading">Loading messages...</div>
                  ) : inquiries.length === 0 ? (
                    <div className="empty-tab" style={{ padding: '40px 20px' }}>
                      <div className="empty-tab-icon">📭</div>
                      <h3>No {msgTab !== 'all' ? msgTab : ''} messages</h3>
                      <p>Your {msgTab} inquiries will appear here.</p>
                    </div>
                  ) : (
                    inquiries.map(inq => (
                      <div
                        key={inq._id}
                        className={`msg-item ${selectedInquiry?._id === inq._id ? 'active' : ''} ${!inq.isRead && msgTab === 'received' ? 'unread' : ''}`}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          if (!inq.isRead && msgTab === 'received') handleMarkAsRead(inq._id);
                        }}
                      >
                        <div className="msg-item-avatar">
                          <img
                            src={msgTab === 'sent' ? inq.seller?.profileImage : inq.buyer?.profileImage || `https://ui-avatars.com/api/?name=U&background=333&color=fff`}
                            alt="User"
                            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=333&color=fff`; }}
                          />
                          {!inq.isRead && msgTab === 'received' && <span className="unread-dot" />}
                        </div>
                        <div className="msg-item-body">
                          <div className="msg-item-top">
                            <span className="msg-item-name">
                              {msgTab === 'sent'
                                ? `${inq.seller?.firstName} ${inq.seller?.lastName}`
                                : `${inq.buyer?.firstName} ${inq.buyer?.lastName}`}
                            </span>
                            <span className="msg-item-date">{formatDate(inq.createdAt)}</span>
                          </div>
                          <p className="msg-item-property"><FaHome /> {inq.property?.title}</p>
                          <p className="msg-item-preview">{inq.message?.substring(0, 70)}...</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Detail panel */}
                {selectedInquiry && (
                  <div className="msg-detail">
                    <div className="msg-detail-header">
                      <h3>Message Details</h3>
                      <button className="msg-close-btn" onClick={() => setSelectedInquiry(null)}>✕</button>
                    </div>
                    <div className="msg-detail-user">
                      <img
                        src={msgTab === 'sent' ? selectedInquiry.seller?.profileImage : selectedInquiry.buyer?.profileImage || `https://ui-avatars.com/api/?name=U&background=333&color=fff`}
                        alt="User"
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=333&color=fff`; }}
                      />
                      <div>
                        <h4>{msgTab === 'sent' ? `${selectedInquiry.seller?.firstName} ${selectedInquiry.seller?.lastName}` : `${selectedInquiry.buyer?.firstName} ${selectedInquiry.buyer?.lastName}`}</h4>
                        <p>📧 {msgTab === 'sent' ? selectedInquiry.seller?.email : selectedInquiry.buyer?.email}</p>
                        <p>📱 {msgTab === 'sent' ? selectedInquiry.seller?.phone : (selectedInquiry.buyerContact?.phone || selectedInquiry.buyer?.phone || 'Not provided')}</p>
                      </div>
                    </div>
                    <div className="msg-detail-property">
                      <h4><FaHome /> Property</h4>
                      <p className="msg-prop-title">{selectedInquiry.property?.title}</p>
                      <p className="msg-prop-price">{formatPriceINR(selectedInquiry.property?.price)}</p>
                      <p className="msg-prop-loc"><FaMapMarkerAlt /> {selectedInquiry.property?.address}, {selectedInquiry.property?.city}</p>
                      <Link to={`/property/${selectedInquiry.property?._id}`} className="fav-view-btn" style={{ display: 'inline-block', marginTop: '8px' }}>View Property</Link>
                    </div>
                    <div className="msg-detail-message">
                      <h4>Message</h4>
                      <p>{selectedInquiry.message}</p>
                      <p className="msg-time"><FaClock /> {formatDate(selectedInquiry.createdAt)}</p>
                    </div>
                    <button className="msg-delete-btn" onClick={() => handleDeleteInquiry(selectedInquiry._id)}>
                      <FaTrash /> Delete Message
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}

export default UserProfile;



