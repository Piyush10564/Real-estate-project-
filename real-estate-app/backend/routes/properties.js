const express = require('express');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const propertyUploadsDir = path.join(__dirname, '..', 'uploads', 'property-images');

if (!fs.existsSync(propertyUploadsDir)) {
  fs.mkdirSync(propertyUploadsDir, { recursive: true });
}

const propertyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, propertyUploadsDir);
  },
  filename: function (req, file, cb) {
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage: propertyStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// Upload property images
router.post('/upload-images', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrls = (req.files || []).map((file) => `${baseUrl}/uploads/property-images/${file.filename}`);

    res.json({
      message: 'Images uploaded successfully',
      images: imageUrls,
    });
  } catch (error) {
    console.error('Error uploading property images:', error);
    res.status(500).json({ message: 'Error uploading property images', error: error.message });
  }
});

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      location,
      minPrice, 
      maxPrice, 
      propertyType, 
      bedrooms, 
      bathrooms,
      page = 1,
      limit = 10
    } = req.query;

    let filter = { listingStatus: 'available' };

    const safeTextRegex = (value) => {
      const escaped = String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(escaped, 'i');
    };

    const locationInput = (location || city || '').trim();
    if (locationInput) {
      const locationRegex = safeTextRegex(locationInput);
      filter.$or = [
        { city: locationRegex },
        { state: locationRegex },
        { address: locationRegex }
      ];
    }

    if (propertyType) filter.propertyType = propertyType;

    const parsedBedrooms = Number.parseInt(bedrooms, 10);
    if (!Number.isNaN(parsedBedrooms)) filter.bedrooms = parsedBedrooms;

    const parsedBathrooms = Number.parseInt(bathrooms, 10);
    if (!Number.isNaN(parsedBathrooms)) filter.bathrooms = parsedBathrooms;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      const parsedMinPrice = Number.parseInt(minPrice, 10);
      const parsedMaxPrice = Number.parseInt(maxPrice, 10);

      if (!Number.isNaN(parsedMinPrice)) filter.price.$gte = parsedMinPrice;
      if (!Number.isNaN(parsedMaxPrice)) filter.price.$lte = parsedMaxPrice;

      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }
    }

    const skip = (page - 1) * limit;
    const properties = await Property.find(filter)
      .populate('seller', 'firstName lastName email phone profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('seller', 'firstName lastName email phone profileImage company bio');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create property (seller only)
router.post('/', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    let { title, description, price, propertyType, bedrooms, bathrooms, area, address, city, state, zipCode, images, amenities } = req.body;
    
    console.log('POST /api/properties - Request body:', {
      title, description, price, propertyType, bedrooms, bathrooms, area, address, city, state, zipCode
    });
    console.log('Files received:', req.files?.length || 0);
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadedImages = (req.files || []).map((file) => `${baseUrl}/uploads/property-images/${file.filename}`);

    // Trim string values
    title = String(title || '').trim();
    description = String(description || '').trim();
    address = String(address || '').trim();
    city = String(city || '').trim();
    state = String(state || '').trim();
    propertyType = String(propertyType || '').trim();
    zipCode = String(zipCode || '').trim();

    // Convert string values to numbers
    const parsedPrice = Number(price) || 0;
    const parsedBedrooms = Number(bedrooms) || 0;
    const parsedBathrooms = Number(bathrooms) || 0;
    const parsedArea = Number(area) || 0;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!address) missingFields.push('address');
    if (!city) missingFields.push('city');
    if (!state) missingFields.push('state');
    if (!propertyType) missingFields.push('propertyType');
    if (!parsedPrice || parsedPrice <= 0) missingFields.push('price (must be > 0)');
    if (!parsedBedrooms || parsedBedrooms <= 0) missingFields.push('bedrooms (must be > 0)');
    if (!parsedBathrooms || parsedBathrooms <= 0) missingFields.push('bathrooms (must be > 0)');
    if (!parsedArea || parsedArea <= 0) missingFields.push('area (must be > 0)');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing or invalid required fields',
        missingFields,
        receivedData: req.body
      });
    }

    let parsedAmenities = [];
    if (amenities) {
      try {
        // Try parsing as JSON first (if sent as JSON string)
        if (typeof amenities === 'string') {
          parsedAmenities = JSON.parse(amenities);
        } else if (Array.isArray(amenities)) {
          parsedAmenities = amenities;
        }
      } catch (e) {
        console.log('Could not parse amenities, treating as string');
        parsedAmenities = [];
      }
    }

    let parsedImages = [];
    if (images) {
      try {
        if (typeof images === 'string' && images.trim()) {
          parsedImages = JSON.parse(images);
        } else if (Array.isArray(images)) {
          parsedImages = images;
        }
      } catch (e) {
        console.log('Could not parse images field');
        parsedImages = [];
      }
    }

    const property = new Property({
      title,
      description,
      price: parsedPrice,
      propertyType,
      bedrooms: parsedBedrooms,
      bathrooms: parsedBathrooms,
      area: parsedArea,
      address,
      city,
      state,
      zipCode,
      images: [...parsedImages, ...uploadedImages],
      amenities: parsedAmenities,
      seller: req.userId
    });

    await property.save();
    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property', error: error.message, details: error.stack });
  }
});

// Update property
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.seller.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updates = req.body;
    Object.assign(property, updates);
    property.updatedAt = Date.now();

    await property.save();
    res.json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete property
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.seller.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
