import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaHome, FaClock, FaTrash, FaMapMarkerAlt, FaInbox, FaPaperPlane } from 'react-icons/fa';
import { formatPriceINR } from '../utils/priceFormatter';
import '../styles/Messages.css';

function Messages() {
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/inquiries?type=${activeTab === 'all' ? '' : activeTab}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries(res.data.inquiries);
      setSelectedInquiry(null);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchInquiries();
  }, [fetchInquiries, navigate, token]);

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(prev => prev.filter(i => i._id !== id));
      setSelectedInquiry(null);
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete message.');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/inquiries/${id}/read`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInquiries();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const unreadCount = inquiries.filter(i => !i.isRead).length;

  return (
    <div className="messages-page">
      <div className="messages-container">

        {/* ── HEADER ── */}
        <div className="messages-header">
          <div className="messages-header-left">
            <h1>
              <FaEnvelope />
              My Messages
              {unreadCount > 0 && (
                <span className="msg-count-badge">{unreadCount}</span>
              )}
            </h1>
            <p>Track all your property inquiries and conversations</p>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'received' ? 'active' : ''}`} onClick={() => setActiveTab('received')}>
            <FaInbox /> Received
          </button>
          <button className={`tab ${activeTab === 'sent' ? 'active' : ''}`} onClick={() => setActiveTab('sent')}>
            <FaPaperPlane /> Sent
          </button>
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            <FaEnvelope /> All
          </button>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="messages-main">

          {/* LEFT: inquiry list */}
          <div className="inquiries-list">
            <div className="inquiries-list-header">
              <span>{activeTab.toUpperCase()} MESSAGES</span>
              <span>{inquiries.length} messages</span>
            </div>

            {loading ? (
              <div className="loading">
                <div className="loading-spinner" />
                Loading messages...
              </div>
            ) : inquiries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No {activeTab !== 'all' ? activeTab : ''} messages</h3>
                <p>Your {activeTab === 'sent' ? 'sent inquiries' : activeTab === 'received' ? 'received messages' : 'messages'} will appear here.</p>
              </div>
            ) : (
              inquiries.map(inquiry => (
                <div
                  key={inquiry._id}
                  className={`inquiry-item ${selectedInquiry?._id === inquiry._id ? 'active' : ''} ${!inquiry.isRead && activeTab === 'received' ? 'unread' : ''}`}
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    if (!inquiry.isRead && activeTab === 'received') handleMarkAsRead(inquiry._id);
                  }}
                >
                  <div className="inquiry-avatar">
                    <img
                      src={
                        activeTab === 'sent'
                          ? inquiry.seller?.profileImage
                          : inquiry.buyer?.profileImage
                            || `https://ui-avatars.com/api/?name=${encodeURIComponent((activeTab === 'sent' ? inquiry.seller?.firstName : inquiry.buyer?.firstName) || 'U')}&background=222&color=b8860b`
                      }
                      alt="User"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=222&color=b8860b`; }}
                    />
                    {!inquiry.isRead && activeTab === 'received' && <span className="unread-badge" />}
                  </div>
                  <div className="inquiry-preview">
                    <div className="inquiry-top">
                      <h4>
                        {activeTab === 'sent'
                          ? `${inquiry.seller?.firstName || ''} ${inquiry.seller?.lastName || ''}`
                          : `${inquiry.buyer?.firstName || ''} ${inquiry.buyer?.lastName || ''}`}
                      </h4>
                      {!inquiry.isRead && activeTab === 'received' && (
                        <span className="unread-label">New</span>
                      )}
                    </div>
                    <p className="inquiry-property">
                      <FaHome /> {inquiry.property?.title || 'Property'}
                    </p>
                    <p className="inquiry-text">{inquiry.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <span className="inquiry-date">{formatDate(inquiry.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: detail panel */}
          {selectedInquiry ? (
            <div className="inquiry-detail">
              <div className="detail-header">
                <h2>Message Details</h2>
                <button className="close-detail" onClick={() => setSelectedInquiry(null)}>✕</button>
              </div>

              <div className="detail-content">
                {/* Sender info */}
                <div className="detail-user">
                  <img
                    src={
                      activeTab === 'sent'
                        ? selectedInquiry.seller?.profileImage
                        : selectedInquiry.buyer?.profileImage
                          || `https://ui-avatars.com/api/?name=${encodeURIComponent((activeTab === 'sent' ? selectedInquiry.seller?.firstName : selectedInquiry.buyer?.firstName) || 'U')}&background=222&color=b8860b`
                    }
                    alt="User"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=222&color=b8860b`; }}
                  />
                  <div className="detail-user-info">
                    <h3>
                      {activeTab === 'sent'
                        ? `${selectedInquiry.seller?.firstName} ${selectedInquiry.seller?.lastName}`
                        : `${selectedInquiry.buyer?.firstName} ${selectedInquiry.buyer?.lastName}`}
                    </h3>
                    <p className="contact-info">
                      📧 {activeTab === 'sent' ? selectedInquiry.seller?.email : selectedInquiry.buyer?.email}
                    </p>
                    <p className="contact-info">
                      📱 {activeTab === 'sent'
                        ? selectedInquiry.seller?.phone || 'Not provided'
                        : selectedInquiry.buyerContact?.phone || selectedInquiry.buyer?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Property */}
                <div className="detail-property">
                  <h4><FaHome /> Property</h4>
                  <div className="property-info">
                    <h5>{selectedInquiry.property?.title}</h5>
                    <p className="prop-price">{formatPriceINR(selectedInquiry.property?.price)}</p>
                    <p className="prop-addr">
                      <FaMapMarkerAlt /> {selectedInquiry.property?.address}, {selectedInquiry.property?.city}
                    </p>
                    <Link to={`/property/${selectedInquiry.property?._id}`} className="view-property-link">
                      🏠 View Property →
                    </Link>
                  </div>
                </div>

                {/* Message */}
                <div className="detail-message">
                  <h4>Message</h4>
                  <p className="msg-bubble">{selectedInquiry.message}</p>
                  <p className="message-date">
                    <FaClock /> {formatDate(selectedInquiry.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="detail-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteInquiry(selectedInquiry._id)}
                  >
                    <FaTrash /> Delete Message
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Placeholder when nothing is selected */
            <div className="inquiry-detail">
              <div className="detail-placeholder">
                <div className="detail-placeholder-icon">💬</div>
                <p>Select a message to view details</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Messages;

