const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../lib/db');
const config = require('../config/config');

const authController = {
  async login(req, res) {
    console.log('Login attempt:', req.body);
    try {
      const { email, password } = req.body;

      const { rows } = await pool.sql`
        SELECT * FROM users 
        WHERE email = ${email}
      `;

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const user = rows[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          team_id: user.team_id 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          team_id: user.team_id
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Erreur lors de la connexion',
        error: error.message
      });
    }
  },

  async register(req, res) {
    try {
      const { email, password, first_name, last_name, role } = req.body;

      // Vérifier si l'email existe déjà
      const { rows } = await pool.sql`
        SELECT id FROM users 
        WHERE email = ${email}
      `;

      if (rows.length > 0) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer le nouvel utilisateur
      const { rows: resultRows } = await pool.sql`
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES (${email}, ${hashedPassword}, ${first_name}, ${last_name}, ${role})
        RETURNING id
      `;

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        userId: resultRows[0].id
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async logout(req, res) {
    // Pour un logout côté client, il suffit de supprimer le token
    res.json({ message: 'Déconnexion réussie' });
  }
};

module.exports = authController; 