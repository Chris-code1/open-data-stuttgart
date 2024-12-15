// src/components/DataChart.tsx
import { LineChart } from '@mui/x-charts/LineChart';
import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface HousingData {
    year: number;
    total: number;
    totalInPercent: number;
    socialHousing: number;
    socialHousingMidIncome: number;
}

const DataChart = () => {
  const [data, setData] = useState<HousingData[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/data/geforderte_wohnungen_stuttgart_seit_1991.csv')
      .then(response => response.text())
      .then(csvString => {
        const rows = csvString.split('\n').slice(1);
        
        // Debug log
        // console.log('First row:', rows[0]);
        
        const parsedData = rows
          .filter(row => row.trim() !== '') // Remove empty rows
          .map(row => {
            const columns = row.split(';');
            console.log('Columns:', columns); // Debug log
            
            if (columns.length < 2) {
              console.error('Invalid row format:', row);
              return null;
            }

            const year = parseInt(columns[0]);
            const total = parseInt(columns[1]);
            const totalInPercent = parseInt(columns[2]);
            const socialHousing = parseInt(columns[3]);
            const socialHousingMidIncome = parseInt(columns[6]);

            return {
              year,
              total,
              totalInPercent,
              socialHousing,
              socialHousingMidIncome
            };
          })
          .filter((item): item is HousingData => 
            item !== null && !isNaN(item.total));

        if (parsedData.length === 0) {
          setError('No valid data parsed from CSV');
          return;
        }

        setData(parsedData);
      })
      .catch(err => {
        setError(`Error loading data: ${err.message}`);
        console.error('Error:', err);
      });
  }, []);

  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500 }}>
      <Typography variant="h6" gutterBottom>
        Geförderte Wohnungen in Stuttgart seit 1991
      </Typography>
      {data.length > 0 ? (
        <LineChart
          xAxis={[{ 
            data: data.map(d => d.year),
            label: 'Jahr',
            scaleType: 'linear',
            min: 1991,
          }]}
          yAxis={[
            {
              id: 'left',
              label: 'Anzahl Wohnungen',
              position: 'left',
            },
            {
              id: 'right',
              label: 'Prozent',
              position: 'right',
              min: 0,
              max: 100,
            }
          ]}
          // rightAxis="right"
          series={[{
            data: data.map(d => d.total),
            label: 'Geförderte Wohnungen insgesamt',
            area: true,
            yAxisId: 'left',
          },
          {
            data: data.map(d => d.socialHousing),
            label: 'Sozialer Wohnungsbau',
            area: true,
            yAxisId: 'left',
          },{
            data: data.map(d => d.socialHousingMidIncome),
            label: 'Sozialer Wohnungsbau für mittlere Einkommen',
            area: true,
            yAxisId: 'left',
          },{
            data: data.map(d => d.totalInPercent),
            label: 'Anteil geförderte Wohnungen am Gesamtwohnungsbestand in Prozent',
            area: true,
            yAxisId: 'right',
          },
        ]}
          // height={400}
          // sx={{
          //   '.MuiLineElement-root': {
          //     stroke: '#2196f3',
          //     strokeWidth: 2,
          //   },
          //   '.MuiAreaElement-root': {
          //     fill: '#2196f3',
          //     opacity: 0.1,
          //   }
          // }}
        />
      ) : (
        <Typography>Loading data...</Typography>
      )}
    </Paper>
  );
};

export default DataChart;