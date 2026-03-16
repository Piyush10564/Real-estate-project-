import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCheck, FaStar, FaArrowRight } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';
import '../styles/Home.css';

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState('buy'); // 'buy' or 'rent'
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/properties', {
        params: { limit: 6 }
      });
      setFeaturedProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search', { state: { filters } });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const stats = [
    { number: '10,000+', label: 'Properties Listed' },
    { number: '50,000+', label: 'Happy Clients' },
    { number: '500+', label: 'Expert Agents' },
    { number: '24/7', label: 'Customer Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Buyer',
      image: 'https://i.pravatar.cc/150?img=1',
      text: 'Found my dream home in just 2 weeks. The platform is incredibly user-friendly!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Real Estate Agent',
      image: 'https://i.pravatar.cc/150?img=2',
      text: 'Best platform for showcasing properties. My sales increased by 40%.',
      rating: 5
    },
    {
      name: 'Emma Wilson',
      role: 'Property Seller',
      image: 'https://i.pravatar.cc/150?img=3',
      text: 'Professional service, transparent pricing, and excellent support team.',
      rating: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" style={{backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'}}>
        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-label">REAL ESTATE</span>
            <h1>Discover Your Future: Find The Perfect Property</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commoda, felis sed elementum ultricies, tortor urna molestie metus, vitae accumsan sem ante quis urna.</p>
            
            <button className="explore-btn" onClick={() => navigate('/search')}>
              Explore Now <FaArrowRight />
            </button>

            <div className="search-tabs">
              <button 
                className={`tab-btn ${listingType === 'buy' ? 'active' : ''}`}
                onClick={() => setListingType('buy')}
              >
                Buy
              </button>
              <button 
                className={`tab-btn ${listingType === 'rent' ? 'active' : ''}`}
                onClick={() => setListingType('rent')}
              >
                Rent
              </button>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-field">
                <label>Location</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Paseo del Mar, Malaga, Spain"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="search-field">
                <label>Pricing</label>
                <input
                  type="text"
                  placeholder="$15000 - $65000"
                  value={filters.minPrice && filters.maxPrice ? `$${filters.minPrice} - $${filters.maxPrice}` : ''}
                  onChange={(e) => {
                    const match = e.target.value.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)?/);
                    if (match) {
                      setFilters(prev => ({
                        ...prev,
                        minPrice: match[1].replace(/,/g, ''),
                        maxPrice: match[2]?.replace(/,/g, '') || ''
                      }));
                    }
                  }}
                />
              </div>
              <button type="submit" className="search-icon-btn">
                <FaArrowRight />
              </button>
            </form>
          </div>

          <div className="hero-right">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" alt="Luxury Property" className="property-image" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>Featured Properties</h2>
          <p>Handpicked listings from our premium collection</p>
        </div>
        {loading ? (
          <div className="loading">Loading amazing properties...</div>
        ) : (
          <div className="properties-grid">
            {featuredProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        <div className="view-more">
          <button onClick={() => navigate('/search')} className="view-all-btn">
            View All Properties <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features">
        <div className="section-header">
          <h2>Why Choose Our Platform?</h2>
          <p>Experience the difference with our premium real estate services</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>Vast Selection</h3>
            <p>Access 10,000+ verified listings across premium locations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Smart Search</h3>
            <p>Advanced AI-powered filters to find your perfect property</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Verified Properties</h3>
            <p>Every listing verified for authenticity and quality</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Expert Support</h3>
            <p>Professional agents available 24/7 for guidance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Transparent Pricing</h3>
            <p>No hidden fees. Complete pricing transparency</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Platform</h3>
            <p>Bank-level security for all your transactions</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Clients Say</h2>
          <p>Thousands of satisfied customers have found their dream property</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Find Your Dream Property?</h2>
          <p>Join thousands of successful buyers and sellers on our platform</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/search')} className="cta-btn primary">
              Browse Properties
            </button>
            <button onClick={() => navigate('/register')} className="cta-btn secondary">
              Become a Seller
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
