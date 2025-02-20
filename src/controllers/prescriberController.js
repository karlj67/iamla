const db = require('../config/database');

const prescriberController = {
  // Obtenir tous les prescripteurs
  async getAllPrescribers(req, res) {
    try {
      const [prescribers] = await db.query(`
        SELECT p.*, pt.name as type_name 
        FROM prescribers p
        JOIN prescriber_types pt ON p.type_id = pt.id
        ORDER BY p.last_name, p.first_name
      `);
      res.json(prescribers);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Obtenir les prescripteurs par type
  async getPrescribersByType(req, res) {
    try {
      const { typeId } = req.params;
      const [prescribers] = await db.query(
        `SELECT * FROM prescribers WHERE type_id = ?`,
        [typeId]
      );
      res.json(prescribers);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Créer un nouveau prescripteur
  async createPrescriber(req, res) {
    try {
      const {
        type_id,
        first_name,
        last_name,
        address,
        latitude,
        longitude,
        phone,
        email
      } = req.body;

      const [result] = await db.query(
        `INSERT INTO prescribers 
        (type_id, first_name, last_name, address, latitude, longitude, phone, email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [type_id, first_name, last_name, address, latitude, longitude, phone, email]
      );

      res.status(201).json({
        message: 'Prescripteur créé avec succès',
        prescriberId: result.insertId
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Mettre à jour un prescripteur
  async updatePrescriber(req, res) {
    try {
      const { id } = req.params;
      const {
        type_id,
        first_name,
        last_name,
        address,
        latitude,
        longitude,
        phone,
        email
      } = req.body;

      await db.query(
        `UPDATE prescribers 
        SET type_id = ?, first_name = ?, last_name = ?, address = ?,
            latitude = ?, longitude = ?, phone = ?, email = ?
        WHERE id = ?`,
        [type_id, first_name, last_name, address, latitude, longitude, phone, email, id]
      );

      res.json({ message: 'Prescripteur mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = prescriberController; 