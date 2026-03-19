const express = require('express');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, propertyType, bedrooms, bathrooms, area, address, city, state, zipCode, images, amenities } = req.body;

    const property = new Property({
      title,
      description,
      price,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zipCode,
      images: images || [],
      amenities: amenities || [],
      seller: req.userId
    });

    await property.save();
    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
