const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  const payload = {
    sub: user._id
  };
  const secret = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
  return jwt.sign(payload, secret, { expiresIn: '1d' });
};

const generateRefreshToken = (user) => {
  const payload = {
    sub: user._id
  };
  const secret = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-token-secret-change-in-production';
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};
