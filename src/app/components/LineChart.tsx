import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registra los componentes necesarios de Chart.js
Chart.register(...registerables);

const LineChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Trend Data',
        data: data.map((item) => item.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
