const resolveBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
  if (envUrl) return envUrl;

  if (process.env.NODE_ENV === 'production') {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  return 'http://localhost:8000';
};

const config = {
  API_BASE_URL: resolveBaseUrl(),

  GOOGLE_MAPS_API_KEY:
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'your_dev_key_here',
};

export default config;