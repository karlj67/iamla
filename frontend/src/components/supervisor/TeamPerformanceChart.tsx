import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';

interface TeamPerformanceChartProps {
  data: Array<{
    month: string;
    visits_completed: number;
    visits_planned: number;
    completion_rate: number;
  }>;
}

export default function TeamPerformanceChart({ data }: TeamPerformanceChartProps) {
  const chartData = [
    {
      id: 'Visites réalisées',
      data: data.map((item) => ({
        x: item.month,
        y: item.visits_completed
      }))
    },
    {
      id: 'Visites planifiées',
      data: data.map((item) => ({
        x: item.month,
        y: item.visits_planned
      }))
    }
  ];

  return (
    <Box sx={{ height: 400 }}>
      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Mois',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Nombre de visites',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle'
          }
        ]}
      />
    </Box>
  );
}