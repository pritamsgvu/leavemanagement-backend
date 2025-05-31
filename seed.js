// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import your models
const User = require('./models/User');
const Leave = require('./models/Leave');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Leave.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = await User.insertMany([
      { name: 'Alice Admin', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
      { name: 'Bob Manager', email: 'manager@example.com', password: hashedPassword, role: 'manager' },
      { name: 'Charlie User', email: 'user@example.com', password: hashedPassword, role: 'user' },
    ]);

    // Create sample leaves (for Charlie User)
    const charlie = users[2];

    await Leave.insertMany([
      {
        employee: charlie._id,
        startDate: new Date('2025-05-20'),
        endDate: new Date('2025-05-25'),
        status: 'pending'
      },
      {
        employee: charlie._id,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-05'),
        status: 'approved'
      }
    ]);

    console.log('Seed Data Created');
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
