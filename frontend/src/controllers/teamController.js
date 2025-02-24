import Team from '../models/Team.js';

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (error) {
    console.error('Erreur getTeams:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ message: 'Équipe non trouvée' });
    }
  } catch (error) {
    console.error('Erreur getTeam:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createTeam = async (req, res) => {
  try {
    const teamId = await Team.create(req.body);
    res.status(201).json({ id: teamId });
  } catch (error) {
    console.error('Erreur createTeam:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Team.update(id, req.body);
    if (success) {
      res.json({ message: 'Équipe mise à jour' });
    } else {
      res.status(404).json({ message: 'Équipe non trouvée' });
    }
  } catch (error) {
    console.error('Erreur updateTeam:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await Team.getMembers(id);
    res.json(members);
  } catch (error) {
    console.error('Erreur getTeamMembers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
