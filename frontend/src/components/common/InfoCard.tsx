import React from 'react';
import { Card, CardContent, Typography, Box, SxProps, Theme } from '@mui/material';
import { motion } from 'framer-motion';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
}

export default function InfoCard({ title, value, icon, color = 'primary.main', sx }: InfoCardProps) {
  return (
    <Card
      component={motion.div}
      whileHover={{ y: -4 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && (
            <Box sx={{ color, mr: 1 }}>
              {icon}
            </Box>
          )}
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
} 
