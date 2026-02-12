import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import axios from 'axios';
import '../styles/SearchResults.css';

function SearchResults() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(location.state?.filters || {});

  useEffect(() => {
    fetchSearchResults();
  }, [filters]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        limit: 20
      };
      const response = await axios.get('http://localhost:5000/api/properties', { params });
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="search-results">
      <div className="filters-sidebar">
        <h3>Filters</h3>

        <div className="filter-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={filters.city || ''}
            onChange={handleFilterChange}
            placeholder="City name"
          />
        </div>

        <div className="filter-group">
          <label>Property Type</label>
          <select
            name="propertyType"
            value={filters.propertyType || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
            <option value="plot">Plot</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleFilterChange}
            placeholder="Minimum price"
          />
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleFilterChange}
            placeholder="Maximum price"
          />
        </div>

        <div className="filter-group">
          <label>Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={filters.bedrooms || ''}
            onChange={handleFilterChange}
            placeholder="Number of bedrooms"
          />
        </div>

        <div className="filter-group">
          <label>Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={filters.bathrooms || ''}
            onChange={handleFilterChange}
            placeholder="Number of bathrooms"
          />
        </div>

        <button className="reset-btn" onClick={() => setFilters({})}>Reset Filters</button>
      </div>

      <div className="results-container">
        <h2>Search Results</h2>
        {loading ? (
          <p>Loading properties...</p>
        ) : properties.length > 0 ? (
          <div className="properties-grid">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p>No properties found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
