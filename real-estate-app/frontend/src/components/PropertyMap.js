import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const PropertyMap = ({ property }) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  // Default coordinates (fallback to a central location if not available)
  const mapCenter = useMemo(
    () => ({
      lat: property?.latitude || 28.6139, // Default to New Delhi
      lng: property?.longitude || 77.2090
    }),
    [property?.latitude, property?.longitude]
  );

  const markerPosition = useMemo(
    () => ({
      lat: property?.latitude || 28.6139,
      lng: property?.longitude || 77.2090
    }),
    [property?.latitude, property?.longitude]
  );

  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    marginTop: '20px'
  };

  const mapOptions = {
    zoom: 15,
    center: mapCenter,
    fullscreenControl: true,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: true,
    styles: [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          {
            saturation: -100
          }
        ]
      }
    ]
  };

  if (!isLoaded) {
    return <div className="map-loading">Loading map...</div>;
  }

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-error">
        <p>Google Maps API key is not configured. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file.</p>
      </div>
    );
  }

  return (
    <div className="property-map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        options={mapOptions}
      >
        <Marker
          position={markerPosition}
          onClick={() => setInfoWindowOpen(true)}
          animation={window.google?.maps?.Animation?.DROP}
        >
          {infoWindowOpen && (
            <InfoWindow
              position={markerPosition}
              onCloseClick={() => setInfoWindowOpen(false)}
            >
              <div className="info-window-content">
                <h3>{property?.title}</h3>
                <p className="location-text">
                  {property?.address}, {property?.city}, {property?.state} {property?.zipCode}
                </p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
    </div>
  );
};

export default PropertyMap;
