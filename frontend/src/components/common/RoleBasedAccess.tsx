import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/business';

interface RoleBasedAccessProps {
  roles: UserRole[];
  children: React.ReactNode;
}

export default function RoleBasedAccess({ roles, children }: RoleBasedAccessProps) {
  const { user } = useAuth();

  if (!user?.role || !roles.includes(user.role as UserRole)) {
    return null;
  }

  return <>{children}</>;
} 
