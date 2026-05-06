import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import '../styles/ChatWindow.css';

function ChatWindow({ inquiry, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.get(`/api/messages/inquiry/${inquiry._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [inquiry._id]);

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    const socketUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000';

    socketRef.current = io(socketUrl, {
      auth: { token },
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
      socketRef.current.emit('user:join', currentUser._id);
    });

    socketRef.current.on('message:receive', (message) => {
      if (message.inquiry === inquiry._id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socketRef.current.on('message:sent', (message) => {
      // Update the message with proper ID from server
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && !lastMsg._id) {
          return [...prev.slice(0, -1), { ...lastMsg, ...message }];
        }
        return prev;
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });
  }, [currentUser?._id, inquiry._id]);

  useEffect(() => {
    fetchMessages();
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connectSocket, fetchMessages]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const otherUserId = inquiry.buyer._id === currentUser._id ? inquiry.seller._id : inquiry.buyer._id;

    // Add optimistic message to UI
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      sender: currentUser,
      message: inputText,
      createdAt: new Date(),
      isOptimistic: true,
    };

    setMessages(prev => [...prev, optimisticMessage]);

    // Send via Socket.IO
    socketRef.current.emit('message:send', {
      inquiryId: inquiry._id,
      senderId: currentUser._id,
      recipientId: otherUserId,
      message: inputText,
    });

    setInputText('');
  };

  const otherUser = inquiry.buyer._id === currentUser._id ? inquiry.seller : inquiry.buyer;

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <img
            src={otherUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.firstName || 'U')}&background=222&color=b8860b`}
            alt={otherUser?.firstName}
            className="chat-avatar"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=222&color=b8860b`; }}
          />
          <div>
            <h3>{otherUser?.firstName} {otherUser?.lastName}</h3>
            <p className="property-title">{inquiry.property?.title}</p>
          </div>
        </div>
        <button className="chat-close" onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {loading ? (
          <div className="chat-loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg._id}
              className={`message ${msg.sender._id === currentUser._id ? 'sent' : 'received'}`}
            >
              <div className="message-avatar">
                <img
                  src={msg.sender?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.firstName || 'U')}&background=222&color=b8860b`}
                  alt={msg.sender?.firstName}
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=U&background=222&color=b8860b`; }}
                />
              </div>
              <div className="message-content">
                <div className="message-text">{msg.message}</div>
                <span className="message-time">
                  {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
