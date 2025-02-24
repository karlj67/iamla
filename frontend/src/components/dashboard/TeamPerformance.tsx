import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface TeamPerformanceProps {
  data: {
    team_name: string;
    visit_completion: number;
    financial_completion: number;
  }[];
}

export default function TeamPerformance({ data }: TeamPerformanceProps) {
  return (
    <Box>
      {data?.map((team, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="subtitle1">{team.team_name}</Typography>
          
          {/* Objectif Visites */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Objectif Visites: {team.visit_completion}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={team.visit_completion}
              sx={{ height: 8, borderRadius: 5 }}
            />
          </Box>

          {/* Objectif Financier */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              Objectif Financier: {team.financial_completion}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={team.financial_completion}
              sx={{ 
                height: 8, 
                borderRadius: 5,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#2e7d32'
                }
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
} 
