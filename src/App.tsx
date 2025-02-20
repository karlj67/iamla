import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import AdminDashboard from './pages/admin/Dashboard';
import SupervisorDashboard from './pages/supervisor/Dashboard';
import VisitorDashboard from './pages/visitor/VisitorDashboard';

// Pages
import Teams from './pages/Teams';
import Visitors from './pages/Visitors';
import Visits from './pages/Visits';
import Locations from './pages/Locations';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';

const queryClient = new QueryClient();
const theme = createTheme();

function PrivateRoute({ children, roles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  const { user } = useAuth();

  const getDashboardByRole = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'medical_visitor':
        return <VisitorDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <PrivateRoute roles={['admin', 'supervisor']}>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={getDashboardByRole()} />

                <Route path="teams" element={
                  <PrivateRoute roles={['admin', 'supervisor']}>
                    <Teams />
                  </PrivateRoute>
                } />

                <Route path="visitors" element={
                  <PrivateRoute roles={['admin', 'supervisor']}>
                    <Visitors />
                  </PrivateRoute>
                } />

                <Route path="visits" element={
                  <PrivateRoute roles={['admin', 'supervisor']}>
                    <Visits />
                  </PrivateRoute>
                } />

                <Route path="locations" element={
                  <PrivateRoute roles={['admin', 'supervisor']}>
                    <Locations />
                  </PrivateRoute>
                } />

                <Route path="stats" element={
                  <PrivateRoute roles={['admin', 'supervisor']}>
                    <Statistics />
                  </PrivateRoute>
                } />

                <Route path="settings" element={
                  <PrivateRoute roles={['admin']}>
                    <Settings />
                  </PrivateRoute>
                } />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App; 