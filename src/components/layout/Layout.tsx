import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-container">
      {/* Header/Sidebar ici */}
      <main>
        <Outlet /> {/* Ceci est crucial pour le rendu des enfants */}
      </main>
    </div>
  );
} 