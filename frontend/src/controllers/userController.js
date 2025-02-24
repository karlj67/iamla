import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    delete user.password;
    res.json({ user, token });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = role ? await User.findByRole(role) : await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Erreur getUsers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = { ...req.body, password: hashedPassword };
    const userId = await User.create(userData);
    res.status(201).json({ id: userId });
  } catch (error) {
    console.error('Erreur createUser:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = { ...req.body };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const success = await User.update(id, userData);
    if (success) {
      res.json({ message: 'Utilisateur mis à jour' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur updateUser:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
