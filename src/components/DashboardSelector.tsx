import AdminDashboard from '../pages/admin/Dashboard';
import SupervisorDashboard from '../pages/supervisor/Dashboard';
import VisitorDashboard from '../pages/visitor/VisitorDashboard';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardSelector() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    case 'medical_visitor':
      return <VisitorDashboard />;
    default:
      return <div>Rôle non reconnu</div>;
  }
} 