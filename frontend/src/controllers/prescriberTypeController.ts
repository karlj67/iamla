const db = require('../config/database');

const prescriberTypeController = {
  async getAll(req, res) {
    try {
      const [types] = await db.query('SELECT * FROM prescriber_types ORDER BY name');
      res.json(types);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { name, description } = req.body;
      const [result] = await db.query(
        'INSERT INTO prescriber_types (name, description) VALUES (?, ?)',
        [name, description]
      );
      res.status(201).json({ 
        message: 'Type de prescripteur créé',
        id: result.insertId 
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      await db.query(
        'UPDATE prescriber_types SET name = ?, description = ? WHERE id = ?',
        [name, description, id]
      );
      res.json({ message: 'Type de prescripteur mis à jour' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = prescriberTypeController; 
