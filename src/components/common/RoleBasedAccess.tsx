import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedAccessProps {
  roles: string[];
  children: React.ReactNode;
}

export default function RoleBasedAccess({ roles, children }: RoleBasedAccessProps) {
  const { user } = useAuth();

  // Si l'utilisateur n'a pas le rôle requis, on ne rend rien
  if (!user || !roles.includes(user.role)) {
    return null;
  }

  // Sinon on rend le contenu
  return <>{children}</>;
} 