'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '../layouts/MainLayout';
import MetricCard from '../components/MetricCard';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import PaginatedTable from '../components/PaginatedTable';
import { FaUsers, FaDollarSign, FaChartLine } from 'react-icons/fa';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Mostrar un spinner mientras se carga la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  // Datos simulados para métricas clave
  const stats = [
    { label: 'Users', value: 1200 },
    { label: 'Revenue', value: 30000 },
    { label: 'Orders', value: 450 },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {session?.user?.email}!</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>

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
        <div>
          <h2 className="text-xl font-bold mb-4">Paginated Data</h2>
          <PaginatedTable />
        </div>
      </div>
    </MainLayout>
  );
}
