const normalizeBaseUrl = (url) => {
  const trimmedUrl = (url || '').trim().replace(/\/+$/, '');

  if (!trimmedUrl) {
    return '';
  }

  return trimmedUrl.replace(/\/api$/, '');
};

const resolveBaseUrl = () => {
  const envUrl = normalizeBaseUrl(process.env.REACT_APP_API_URL || process.env.VITE_API_URL);
  if (envUrl) return envUrl;

  return process.env.NODE_ENV === 'production'
    ? 'https://propify-vi62.onrender.com'
    : 'http://localhost:8000';
};

const config = {
  API_BASE_URL: resolveBaseUrl(),

  GOOGLE_MAPS_API_KEY:
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyB_o2-fQyWmh1FgwwPy1xgTJdny6vRG8kA',
};

export { normalizeBaseUrl, resolveBaseUrl };
export default config;