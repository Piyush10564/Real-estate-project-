const express = require('express');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all properties with filters
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      minPrice, 
      maxPrice, 
      propertyType, 
      bedrooms, 
      bathrooms,
      page = 1,
      limit = 10
    } = req.query;

    let filter = { listingStatus: 'available' };

    if (city) filter.city = city;
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = parseInt(bedrooms);
    if (bathrooms) filter.bathrooms = parseInt(bathrooms);
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
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
