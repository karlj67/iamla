import React from 'react';
import { 
  Box, Grid, Paper, Typography,
  Table, TableBody, TableCell, TableHead, TableRow 
} from '@mui/material';
import { useQuery } from 'react-query';
import { getMonthlyStats, getTeamStats } from '../api/stats';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

export default function Statistics() {
  const { data: monthlyStats } = useQuery('monthlyStats', getMonthlyStats);
  const { data: teamStats } = useQuery('teamStats', getTeamStats);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Statistiques
      </Typography>

      <Grid container spacing={3}>
        {/* Graphique des visites mensuelles */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Évolution des visites
            </Typography>
            {monthlyStats && (
              <ResponsiveLine
                data={[
                  {
                    id: "visites",
                    data: monthlyStats.visits_trend
                  }
                ]}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Mois',
                  legendOffset: 36
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Nombre de visites',
                  legendOffset: -40
                }}
                enablePoints={true}
                enableArea={true}
                areaOpacity={0.15}
              />
            )}
          </Paper>
        </Grid>

        {/* Performance par équipe */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Performance par équipe
            </Typography>
            {teamStats && (
              <ResponsivePie
                data={teamStats.performance}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
              />
            )}
          </Paper>
        </Grid>

        {/* Tableau récapitulatif */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Équipe</TableCell>
                  <TableCell align="right">Visites Planifiées</TableCell>
                  <TableCell align="right">Visites Réalisées</TableCell>
                  <TableCell align="right">Taux de Réalisation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamStats?.summary.map((team) => (
                  <TableRow key={team.team_name}>
                    <TableCell>{team.team_name}</TableCell>
                    <TableCell align="right">{team.planned_visits}</TableCell>
                    <TableCell align="right">{team.executed_visits}</TableCell>
                    <TableCell align="right">
                      {((team.executed_visits / team.planned_visits) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 