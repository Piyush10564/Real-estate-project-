import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaUser, FaHome, FaClock, FaTrash } from 'react-icons/fa';
import { formatPriceINR } from '../utils/priceFormatter';
import '../styles/Messages.css';

function Messages() {
  const [inquiries, setInquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('received'); // 'sent', 'received', 'all'
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchInquiries();
  }, [activeTab, token]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/inquiries?type=${activeTab === 'all' ? '' : activeTab}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setInquiries(response.data.inquiries);
      setSelectedInquiry(null);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await axios.delete(`http://localhost:5000/api/inquiries/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInquiries(inquiries.filter(inquiry => inquiry._id !== id));
        setSelectedInquiry(null);
        alert('Inquiry deleted successfully');
      } catch (error) {
        console.error('Error deleting inquiry:', error);
        alert('Failed to delete inquiry');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/inquiries/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchInquiries();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>My Messages</h1>
        <p>Track all your property inquiries and messages</p>
      </div>

      <div className="messages-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            <FaEnvelope /> Received
          </button>
          <button 
            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            <FaEnvelope /> Sent
          </button>
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FaEnvelope /> All
          </button>
        </div>

        <div className="messages-main">
          <div className="inquiries-list">
            {loading ? (
              <div className="loading">Loading messages...</div>
            ) : inquiries.length === 0 ? (
              <div className="empty-state">
                <FaEnvelope />
                <h3>No {activeTab !== 'all' ? activeTab : ''} messages</h3>
                <p>You don't have any {activeTab === 'sent' ? 'inquiries sent' : activeTab === 'received' ? 'inquiries received' : 'messages'} yet.</p>
              </div>
            ) : (
              inquiries.map(inquiry => (
                <div 
                  key={inquiry._id}
                  className={`inquiry-item ${selectedInquiry?._id === inquiry._id ? 'active' : ''} ${!inquiry.isRead && activeTab === 'received' ? 'unread' : ''}`}
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    if (!inquiry.isRead && activeTab === 'received') {
                      handleMarkAsRead(inquiry._id);
                    }
                  }}
                >
                  <div className="inquiry-avatar">
                    <img 
                      src={activeTab === 'sent' ? inquiry.seller?.profileImage : inquiry.buyer?.profileImage || 'https://via.placeholder.com/50'} 
                      alt="User" 
                    />
                    {!inquiry.isRead && activeTab === 'received' && <span className="unread-badge"></span>}
                  </div>
                  <div className="inquiry-preview">
                    <div className="inquiry-top">
                      <h4>
                        {activeTab === 'sent' 
                          ? `${inquiry.seller?.firstName} ${inquiry.seller?.lastName}` 
                          : `${inquiry.buyer?.firstName} ${inquiry.buyer?.lastName}`}
                      </h4>
                      <span className="inquiry-date">{formatDate(inquiry.createdAt)}</span>
                    </div>
                    <p className="inquiry-property">
                      <FaHome /> {inquiry.property?.title}
                    </p>
                    <p className="inquiry-text">{inquiry.message.substring(0, 80)}...</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedInquiry && (
            <div className="inquiry-detail">
              <div className="detail-header">
                <h2>Message Details</h2>
                <button 
                  className="close-detail"
                  onClick={() => setSelectedInquiry(null)}
                >
                  ×
                </button>
              </div>

              <div className="detail-content">
                <div className="detail-user">
                  <img 
                    src={activeTab === 'sent' ? selectedInquiry.seller?.profileImage : selectedInquiry.buyer?.profileImage || 'https://via.placeholder.com/80'} 
                    alt="User" 
                  />
                  <div>
                    <h3>
                      {activeTab === 'sent' 
                        ? `${selectedInquiry.seller?.firstName} ${selectedInquiry.seller?.lastName}` 
                        : `${selectedInquiry.buyer?.firstName} ${selectedInquiry.buyer?.lastName}`}
                    </h3>
                    <p className="contact-info">
                      📧 {activeTab === 'sent' ? selectedInquiry.seller?.email : selectedInquiry.buyer?.email}
                    </p>
                    <p className="contact-info">
                      📱 {activeTab === 'sent' ? selectedInquiry.seller?.phone : (selectedInquiry.buyerContact?.phone || selectedInquiry.buyer?.phone || 'Not provided')}
                    </p>
                  </div>
                </div>

                <div className="detail-property">
                  <h4>Property</h4>
                  <div className="property-info">
                    <h5>{selectedInquiry.property?.title}</h5>
                    <p>{formatPriceINR(selectedInquiry.property?.price)}</p>
                    <p>{selectedInquiry.property?.address}, {selectedInquiry.property?.city}</p>
                  </div>
                </div>

                <div className="detail-message">
                  <h4>Message</h4>
                  <p>{selectedInquiry.message}</p>
                  <p className="message-date">
                    <FaClock /> Sent {formatDate(selectedInquiry.createdAt)}
                  </p>
                </div>

                <div className="detail-actions">
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteInquiry(selectedInquiry._id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
