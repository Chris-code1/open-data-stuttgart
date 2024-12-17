import React from 'react';
import { BarChart} from '@mui/x-charts';
import statsData from '../data/Stgt_Viertel_Stats.json';

type StatsDataType = {
  [key: string]: {
    Average: number;
  };
};

const StatsChart = () => {
  const data = Object.keys(statsData).map((key: string) => ({
    name: key,
    Average: (statsData as StatsDataType)[key].Average
  }));

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: data.map(item => item.name) }]}
      series={[{ data: data.map(item => item.Average) }]}
      width={1000}
      height={300}
    />
  );
};

export default StatsChart;