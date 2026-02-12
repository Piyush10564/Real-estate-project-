import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About Us</h4>
          <p>Your trusted platform for buying, selling, and renting properties.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/search">Search Properties</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: info@realestate.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Main St, City, State 12345</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#instagram">Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Real Estate Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
