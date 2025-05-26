const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:3001/leave_management';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
