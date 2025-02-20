const bcrypt = require('bcryptjs');
const User = require('../models/User');
const db = require('../config/database');

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      delete user.password;
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const { first_name, last_name, profile_photo } = req.body;
      const updated = await User.update(req.user.id, {
        first_name,
        last_name,
        profile_photo
      });

      if (!updated) {
        return res.status(404).json({ message: 'Mise à jour échouée' });
      }

      res.json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, req.user.id]
      );

      res.json({ message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = userController; 