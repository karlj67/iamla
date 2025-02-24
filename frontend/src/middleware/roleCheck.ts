const config = require('../config/config');

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    next();
  };
};

module.exports = {
  checkRole,
  isAdmin: checkRole([config.roles.ADMIN]),
  isSupervisor: checkRole([config.roles.ADMIN, config.roles.SUPERVISOR]),
  isMedicalVisitor: checkRole([config.roles.MEDICAL_VISITOR])
}; 
