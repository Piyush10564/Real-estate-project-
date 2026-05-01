const resolveBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'http://localhost:8000';
};

const config = {
  API_BASE_URL:
    process.env.NODE_ENV === 'production'
      ? resolveBaseUrl()
      : 'http://localhost:8000',

  GOOGLE_MAPS_API_KEY:
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'your_dev_key_here',
};

export default config;