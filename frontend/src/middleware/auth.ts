import { NextFunction, Request, Response } from 'express';
import { supabase } from '../config/database';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Non authentifié' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Erreur d\'authentification' });
  }
};

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (!userProfile || !roles.includes(userProfile.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    next();
  };
};
