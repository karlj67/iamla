const routes = [
  {
    path: '/',
    element: <PrivateRoute roles={['admin', 'supervisor']} />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'visites', element: <Visits /> }
    ]
  }
]; 
