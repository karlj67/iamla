const Team = require('../models/Team');
const User = require('../models/User');

const teamController = {
  async createTeam(req, res) {
    try {
      const { name, laboratory_name, supervisor_id } = req.body;
      const teamId = await Team.create({
        name,
        laboratory_name,
        supervisor_id
      });

      res.status(201).json({
        message: 'Équipe créée avec succès',
        teamId
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async getTeamMembers(req, res) {
    try {
      const { teamId } = req.params;
      const members = await Team.getMembers(teamId);
      
      res.json(members.map(member => {
        delete member.password;
        return member;
      }));
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async updateTeam(req, res) {
    try {
      const { id } = req.params;
      const { name, laboratory_name, supervisor_id } = req.body;
      
      const updated = await Team.update(id, {
        name,
        laboratory_name,
        supervisor_id
      });

      if (!updated) {
        return res.status(404).json({ message: 'Équipe non trouvée' });
      }

      res.json({ message: 'Équipe mise à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = teamController; 