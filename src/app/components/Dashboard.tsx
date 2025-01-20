'use client';

import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import PaginatedTable from '../components/PaginatedTable';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import MetricCard from '../components/MetricCard';
import { FaUsers, FaChartLine, FaDollarSign } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Users', value: 1200 },
    { label: 'Revenue', value: 30000 },
    { label: 'Orders', value: 450 },
  ]);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Indicadores Visuales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <MetricCard title="Total Users" value={stats[0].value} icon={<FaUsers />} />
        <MetricCard title="Total Revenue" value={stats[1].value} icon={<FaDollarSign />} />
        <MetricCard title="Total Orders" value={stats[2].value} icon={<FaChartLine />} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Trend Data</h2>
          <LineChart data={stats} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
          <PieChart data={stats} />
        </div>
      </div>

      {/* Tabla con Paginación */}
      <PaginatedTable />
    </MainLayout>
  );
};

export default Dashboard;
