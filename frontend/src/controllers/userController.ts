import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { CreateUserData, UpdateUserData, UserRole } from '../types/business';
import UserModel from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    res.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    const users = role ? 
      await UserModel.findByRole(role as UserRole) : 
      await UserModel.findAll();
    res.json(users);
  } catch (error) {
    console.error('Erreur getUsers:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const userData = req.body as UpdateUserData;
    const user = await UserModel.update(id, userData);
    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur inconnue' });
    }
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    } else {
      res.status(500).json({ message: 'Erreur serveur inconnue' });
    }
  }
};
