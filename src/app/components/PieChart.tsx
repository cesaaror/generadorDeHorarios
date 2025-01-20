import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registra los componentes necesarios de Chart.js
Chart.register(...registerables);

const PieChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
