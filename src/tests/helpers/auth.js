const jwt = require('jsonwebtoken');
const config = require('../../config/config');

const generateToken = (userData) => {
  return jwt.sign(
    userData,
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

module.exports = {
  generateToken
}; 