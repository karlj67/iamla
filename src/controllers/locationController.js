const db = require('../config/database');

const locationController = {
  // Enregistrer une nouvelle position
  async updateLocation(req, res) {
    try {
      const { latitude, longitude } = req.body;
      const user_id = req.user.id;

      await db.query(
        `INSERT INTO location_tracking (user_id, latitude, longitude)
         VALUES (?, ?, ?)`,
        [user_id, latitude, longitude]
      );

      res.json({ message: 'Position mise à jour' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir la dernière position d'un utilisateur ou d'une équipe
  async getCurrentLocations(req, res) {
    try {
      let query = `
        SELECT l.*, u.first_name, u.last_name, u.team_id
        FROM location_tracking l
        JOIN users u ON l.user_id = u.id
        WHERE l.timestamp = (
          SELECT MAX(timestamp)
          FROM location_tracking l2
          WHERE l2.user_id = l.user_id
        )
      `;

      const params = [];

      // Filtrer par équipe pour les superviseurs
      if (req.user.role === 'supervisor') {
        query += ' AND u.team_id = ?';
        params.push(req.user.team_id);
      }

      const [locations] = await db.query(query, params);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir l'historique des positions
  async getLocationHistory(req, res) {
    try {
      const { startDate, endDate, userId } = req.query;
      let query = `
        SELECT l.*, u.first_name, u.last_name
        FROM location_tracking l
        JOIN users u ON l.user_id = u.id
        WHERE l.timestamp BETWEEN ? AND ?
      `;

      const params = [startDate || '1970-01-01', endDate || new Date()];

      if (req.user.role === 'supervisor') {
        query += ' AND u.team_id = ?';
        params.push(req.user.team_id);
      }

      if (userId) {
        query += ' AND l.user_id = ?';
        params.push(userId);
      }

      query += ' ORDER BY l.timestamp DESC';

      const [locations] = await db.query(query, params);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

// Fonction utilitaire pour vérifier si un utilisateur appartient à une équipe
async function isUserInTeam(userId, teamId) {
  const [users] = await db.query(
    'SELECT id FROM users WHERE id = ? AND team_id = ?',
    [userId, teamId]
  );
  return users.length > 0;
}

module.exports = locationController; 