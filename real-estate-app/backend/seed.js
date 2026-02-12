require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate';

// Real property images from Pexels and Pixabay (free stock photos)
const propertyImages = [
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1682519/pexels-photo-1682519.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1458384/pexels-photo-1458384.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1889600/pexels-photo-1889600.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1454496/pexels-photo-1454496.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1579440/pexels-photo-1579440.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/421077/pexels-photo-421077.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1368382/pexels-photo-1368382.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1933900/pexels-photo-1933900.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
];

// Sample seller/agent data
const sellers = [
  {
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.real@example.com',
    password: 'password123',
    phone: '+91-9876543210',
    userType: 'agent',
    company: 'Elite Properties',
    bio: 'Premium real estate agent with 10+ years experience',
    location: 'Chandigarh'
  },
  {
    firstName: 'Priya',
    lastName: 'Singh',
    email: 'priya.properties@example.com',
    password: 'password123',
    phone: '+91-9876543211',
    userType: 'agent',
    company: 'Capital Homes',
    bio: 'Specialist in luxury properties',
    location: 'Chandigarh'
  },
  {
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.realtor@example.com',
    password: 'password123',
    phone: '+91-9876543212',
    userType: 'seller',
    company: 'Patel Developers',
    bio: 'Budget-friendly property solutions',
    location: 'Chandigarh'
  },
  {
    firstName: 'Neha',
    lastName: 'Sharma',
    email: 'neha.estate@example.com',
    password: 'password123',
    phone: '+91-9876543213',
    userType: 'agent',
    company: 'Chandigarh Premium Homes',
    bio: 'Your trusted real estate partner',
    location: 'Chandigarh'
  }
];

// Sample properties for Chandigarh
const sampleProperties = [
  {
    title: 'Luxury 3BHK Apartment in Sector 17',
    description: 'Spacious and modern 3-bedroom apartment in prime location with scenic views of Chandigarh. Features high-end finishes, marble flooring, and contemporary kitchen setup.',
    price: 8500000,
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    address: 'Sector 17, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160017',
    images: [propertyImages[0], propertyImages[1]],
    amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security', 'Garden'],
    listingStatus: 'available'
  },
  {
    title: 'Modern 2BHK Flat in Sector 22',
    description: 'Newly constructed 2-bedroom apartment in a gated community. Perfect for young professionals and families seeking comfort and convenience.',
    price: 5500000,
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    address: 'Sector 22, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160022',
    images: [propertyImages[2], propertyImages[3]],
    amenities: ['Parking', 'Playground', 'Community Hall', 'Security'],
    listingStatus: 'available'
  },
  {
    title: 'Premium Villa in Sector 8',
    description: 'Stunning 4-bedroom villa with private garden and modern architecture. Located in one of Chandigarh\'s most exclusive neighborhoods.',
    price: 15000000,
    propertyType: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    address: 'Sector 8, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160008',
    images: [propertyImages[4], propertyImages[5]],
    amenities: ['Private Garden', 'Maid Room', 'Gym', 'Parking', 'Security'],
    listingStatus: 'available'
  },
  {
    title: 'Cozy 1BHK in Sector 35',
    description: 'Affordable 1-bedroom apartment perfect for bachelors and first-time homebuyers. Located near market and public transportation.',
    price: 3200000,
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    address: 'Sector 35, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160035',
    images: [propertyImages[6]],
    amenities: ['Parking', 'Security', 'Water Supply'],
    listingStatus: 'available'
  },
  {
    title: 'Spacious 4BHK House in Sector 9',
    description: 'Independent 4-bedroom house with large courtyard and modern amenities. Ideal for extended families wanting spacious living.',
    price: 12000000,
    propertyType: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    address: 'Sector 9, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160009',
    images: [propertyImages[7], propertyImages[0], 'https://3.imimg.com/data3/MS/UV/MY-2554732/kothi-for-sale-in-chandigarh-500x500.png'],
    amenities: ['Courtyard', 'Study Room', 'Maid Room', 'Parking', 'Security'],
    listingStatus: 'available'
  },
  {
    title: 'Executive 3BHK Apartment in Sector 20',
    description: 'Elite residential tower with world-class amenities. Each apartment features premium fittings and panoramic city views.',
    price: 9500000,
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    address: 'Sector 20, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160020',
    images: [propertyImages[1], propertyImages[3]],
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Parking', 'Security', '24/7 Power'],
    listingStatus: 'available'
  },
  {
    title: 'Commercial Space in Sector 17',
    description: 'Prime commercial property ideal for retail or office setup. High foot traffic location with excellent connectivity.',
    price: 25000000,
    propertyType: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 5000,
    address: 'Sector 17, Commercial Hub, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160017',
    images: [propertyImages[2], propertyImages[4]],
    amenities: ['Parking', 'Public Restroom', 'Display Area', 'Security'],
    listingStatus: 'available'
  },
  {
    title: 'Residential Plot in Sector 37',
    description: 'Large residential plot in upcoming sector. Perfect for building your dream home. Clear title and all approvals.',
    price: 6500000,
    propertyType: 'plot',
    bedrooms: 0,
    bathrooms: 0,
    area: 2000,
    address: 'Sector 37, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160037',
    images: [propertyImages[5]],
    amenities: ['Electricity', 'Water Connection', 'Road Access'],
    listingStatus: 'available'
  },
  {
    title: 'Luxury 5BHK Penthouse in Sector 3',
    description: 'Ultra-premium penthouse with private terrace and smart home features. The epitome of luxury living in Chandigarh.',
    price: 35000000,
    propertyType: 'apartment',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    address: 'Sector 3, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160003',
    images: [propertyImages[6], propertyImages[7]],
    amenities: ['Private Terrace', 'Smart Home', 'Home Theater', 'Gym', 'Parking', 'Concierge'],
    listingStatus: 'available'
  },
  {
    title: 'Budget-Friendly 2BHK in Sector 30',
    description: 'Affordable 2-bedroom apartment with all basic amenities. Great for families looking for value for money.',
    price: 4200000,
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 750,
    address: 'Sector 30, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160030',
    images: [propertyImages[3]],
    amenities: ['Parking', 'Water Supply', 'Security'],
    listingStatus: 'available'
  },
  {
    title: 'Semi-Detached House in Sector 10',
    description: 'Well-maintained semi-detached house with large living areas and modern facilities. Perfect family home.',
    price: 8000000,
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    address: 'Sector 10, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zipCode: '160010',
    images: [propertyImages[4], propertyImages[2]],
    amenities: ['Garden', 'Parking', 'Maid Room', 'Security'],
    listingStatus: 'available'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({ userType: { $in: ['seller', 'agent'] } });
    await Property.deleteMany({ city: 'Chandigarh' });
    console.log('Cleared existing Chandigarh properties and sellers');

    // Create sellers
    const createdSellers = await User.create(sellers);
    console.log(`Created ${createdSellers.length} sellers/agents`);

    // Create properties with seller references
    const propertiesWithSellers = sampleProperties.map((prop, index) => ({
      ...prop,
      seller: createdSellers[index % createdSellers.length]._id
    }));

    const createdProperties = await Property.create(propertiesWithSellers);
    console.log(`Created ${createdProperties.length} sample properties in Chandigarh`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`Total Properties: ${createdProperties.length}`);
    console.log(`Total Agents/Sellers: ${createdSellers.length}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();
