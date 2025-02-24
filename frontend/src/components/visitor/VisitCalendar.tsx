import React from 'react';
import { 
  Paper, Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton 
} from '@mui/material';
import { LocationOn, Edit, CheckCircle } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingVisits } from '../../api/visits';
import { formatDateTime } from '../../utils/dateUtils';
import { useState } from 'react';
import VisitReport from './VisitReport';

export default function VisitCalendar() {
  const { data: visits } = useQuery('upcomingVisits', getUpcomingVisits);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [openReport, setOpenReport] = useState(false);

  const handleReportClick = (visit) => {
    setSelectedVisit(visit);
    setOpenReport(true);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Prescripteur</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visits?.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell>{formatDateTime(visit.planned_date)}</TableCell>
              <TableCell>
                {visit.prescriber.first_name} {visit.prescriber.last_name}
                <Typography variant="caption" display="block" color="text.secondary">
                  {visit.prescriber.address}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={visit.status}
                  color={
                    visit.status === 'executed' ? 'success' :
                    visit.status === 'planned' ? 'primary' : 'default'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton 
                  color="primary"
                  onClick={() => window.open(
                    `https://maps.google.com?q=${visit.prescriber.latitude},${visit.prescriber.longitude}`
                  )}
                >
                  <LocationOn />
                </IconButton>
                {visit.status === 'planned' && (
                  <>
                    <IconButton 
                      color="success"
                      onClick={() => handleReportClick(visit)}
                    >
                      <CheckCircle />
                    </IconButton>
                    <IconButton color="primary">
                      <Edit />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedVisit && (
        <VisitReport 
          visit={selectedVisit}
          open={openReport}
          onClose={() => {
            setOpenReport(false);
            setSelectedVisit(null);
          }}
        />
      )}
    </>
  );
} 
