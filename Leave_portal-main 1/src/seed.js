require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/user');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Check if any users exist
    const count = await User.countDocuments();
    
    if (count === 0) {
      // Create default admin user
      await User.create({
        username: 'admin',
        password: 'admin123', // In production, use a secure password
        email: 'admin@example.com',
        role: 'HR'
      });
      
      console.log('Default admin user created successfully.');
    } else {
      console.log('Users already exist. Skipping seed.');
    }
    
    console.log('Database seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase(); 