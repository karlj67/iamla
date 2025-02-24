import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import DashboardSelector from './components/DashboardSelector';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  
  // Temporaire : contourne l'authentification
  return children;
  
  // À remplacer par la logique réelle après test
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <ErrorBoundary fallback={<div>Erreur d'affichage</div>}>
                  <Layout>
                    <DashboardSelector />
                  </Layout>
                </ErrorBoundary>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
} 