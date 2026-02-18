const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = require('./db');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');

async function seed() {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), Property.deleteMany({}), Booking.deleteMany({})]);

  const pw = await bcrypt.hash('password123', 10);

  const admin = await User.create({ name: 'Admin', email: 'admin@hh.test', password: pw, role: 'Admin', isApproved: true });
  const owner = await User.create({ name: 'Bob Owner', email: 'owner@hh.test', password: pw, role: 'Owner', isApproved: true });
  const owner2 = await User.create({ name: 'Carol Owner', email: 'owner2@hh.test', password: pw, role: 'Owner', isApproved: true });
  const renter = await User.create({ name: 'Alice Renter', email: 'renter@hh.test', password: pw, role: 'Renter', isApproved: true });

  const props = [
    { title: 'Sunny Apartment', description: 'Bright 2BR in downtown', price: 1200, location: { address: '1 Main St', city: 'Metropolis', state: 'CA' }, propertyType: 'Apartment', images: [], ownerId: owner._id },
    { title: 'Cozy House', description: '3BR with garden', price: 2200, location: { address: '10 Oak Ave', city: 'Smallville', state: 'KS' }, propertyType: 'House', images: [], ownerId: owner._id },
    { title: 'Modern Condo', description: 'Studio with amenities', price: 1500, location: { address: '55 Lake Rd', city: 'Metropolis', state: 'CA' }, propertyType: 'Condo', images: [], ownerId: owner2._id }
  ];

  const created = await Property.insertMany(props);

  await Booking.create({ propertyId: created[0]._id, renterId: renter._id, message: 'I am interested, is it still available?' });

  console.log('Seed complete:');
  console.log({ admin: admin.email, owner: owner.email, renter: renter.email, password: 'password123' });
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
