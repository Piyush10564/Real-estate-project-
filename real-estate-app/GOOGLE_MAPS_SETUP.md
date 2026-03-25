# Google Maps Integration Setup

This guide will help you set up Google Maps on the Property Details page.

## Step 1: Install the Google Maps Library

Run this command in your frontend directory:

```bash
npm install @react-google-maps/api
```

## Step 2: Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for advanced features)
4. Create an API key:
   - Go to "Credentials"
   - Click "Create Credentials" → "API Key"
5. Restrict the key to your domain (recommended for production)

## Step 3: Add API Key to Your Environment

Create or update the `.env` file in your frontend directory:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Google Maps API key.

## Step 4: Restart Your Development Server

```bash
npm start
```

## Features Implemented

✅ **Display Google Map** - Shows the property location on an interactive map
✅ **Property Marker** - Displays a marker at the property's coordinates
✅ **Info Window** - Click the marker to see property title and full address
✅ **Responsive Design** - Map adapts to different screen sizes
✅ **Map Controls** - Includes zoom, map type, street view, and fullscreen controls
✅ **Fallback Coordinates** - If latitude/longitude are not available, defaults to New Delhi (28.6139°N, 77.2090°E)

## How It Works

1. The `PropertyMap` component in `src/components/PropertyMap.js` handles the map rendering
2. It reads the property's latitude, longitude, address, city, state, and zipCode
3. The map automatically centers on the property location
4. Clicking the marker opens an info window with property details
5. The map includes helpful controls for navigation and viewing options

## Troubleshooting

### "Google Maps API key is not configured"
- Ensure you've created the `.env` file with `REACT_APP_GOOGLE_MAPS_API_KEY`
- Restart your development server after adding the key
- Environment variables in React require the `REACT_APP_` prefix

### Map is not centered correctly
- Verify that your property has `latitude` and `longitude` values in the database
- If not available, the map will default to New Delhi coordinates

### Map is not showing
- Check the browser console for API errors
- Verify your API key is valid and has Maps JavaScript API enabled
- Check that your domain is whitelisted (if you've restricted the API key)

## Database Schema

The integration uses these existing property fields:
- `latitude` (Number) - Property latitude coordinate
- `longitude` (Number) - Property longitude coordinate
- `address` (String) - Street address
- `city` (String) - City name
- `state` (String) - State name
- `zipCode` (String) - Postal code

No database changes are required - the integration uses your existing schema.

## Customization

You can customize the map appearance in `PropertyMap.js`:

- **Map Zoom Level**: Change the `zoom: 15` value (1-21)
- **Map Container Height**: Modify the `height: '400px'` in `containerStyle`
- **Map Styling**: Adjust the `mapOptions.styles` array for custom themes
- **Marker Animation**: Change `Animation.DROP` to other animation types

## Production Deployment

For production, restrict your API key:

1. In [Google Cloud Console](https://console.cloud.google.com/)
2. Go to Credentials → Select your API key
3. Under "API restrictions", select "Maps JavaScript API"
4. Under "Application restrictions", select "HTTP referrers (websites)"
5. Add your domain(s): `https://yourdomain.com`

This prevents unauthorized use of your API key.
