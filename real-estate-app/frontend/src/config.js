const config = {
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL || "https://propify-vi62.onrender.com"
      : "http://localhost:8000",

  GOOGLE_MAPS_API_KEY:
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "your_dev_key_here",
};

export default config;