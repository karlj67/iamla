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
      origin: process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(/\s*,\s*/) 
      : '*',
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

// Vérification des variables obligatoires
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`La variable d'environnement ${envVar} est manquante`);
  }
});

module.exports = config[process.env.NODE_ENV || 'development']; 
