'use client';

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import useDashboard from '../hooks/useDashboard';
import StatsChart from '../components/StatsChart';
import PaginatedTable from '../components/PaginatedTable';

const Stats = () => {
  const { stats, isLoading, error } = useDashboard('/api/data');

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500">Failed to load statistics. Please try again later.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Gráfico de Estadísticas */}
      <div className="mb-8">
        <StatsChart data={stats} />
      </div>

      {/* Tabla Paginada */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Detailed Statistics</h2>
        <PaginatedTable />
      </div>

      {/* Lista Resumida */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <ul className="list-disc pl-5">
          {stats.map((stat) => (
            <li key={stat.label} className="text-lg">
              {stat.label}: <span className="font-semibold">{stat.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

export default Stats;
