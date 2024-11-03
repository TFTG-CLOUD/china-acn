// utils/auth.utils.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const generateAuthResponse = (user) => {
  const token = generateToken(user);
  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }
  };
};

module.exports = {
  generateToken,
  generateAuthResponse
};