import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCheck, FaStar, FaArrowRight } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';
import '../styles/Home.css';

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const response = await axios.get('http://localhost:5000/api/properties', {
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
      <section className="hero" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80)'}}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Find Your Dream Property</h1>
          <p>Discover thousands of premium properties in your favorite locations</p>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
            <button type="submit" className="search-btn">Search Now</button>
          </form>
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
