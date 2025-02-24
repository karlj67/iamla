import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const drawerWidth = 240;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      {children}
    </div>
  );
} 
