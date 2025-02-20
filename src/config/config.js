require('dotenv').config();

const config = {
  development: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    port: 8100,
    roles: {
      ADMIN: 'admin',
      SUPERVISOR: 'supervisor',
      MEDICAL_VISITOR: 'medical_visitor'
    }
  },
  production: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    port: 8100,
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    roles: {
      ADMIN: 'admin',
      SUPERVISOR: 'supervisor',
      MEDICAL_VISITOR: 'medical_visitor'
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development']; 