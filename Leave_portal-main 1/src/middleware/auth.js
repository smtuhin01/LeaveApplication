const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secret = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to check if user is authenticated
const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, secret);
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Add user to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Middleware to check if user is HR
const checkHR = (req, res, next) => {
  if (req.user.role !== 'HR') {
    return res.status(403).json({ error: 'Forbidden: HR access only' });
  }
  next();
};

module.exports = {
  auth,
  checkHR
}; 