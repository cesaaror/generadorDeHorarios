'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import useEmployees from '../hooks/useEmployees';
import SendWhatsApp from '../components/SendWhatsApp';
import EditScheduleModal from '../components/EditScheduleModal';

interface Schedule {
  id: number;
  employeeId: number;
  date: string;
  shift: 'MAÑANA' | 'TARDE';
}

export default function Horarios() {
  const { employees } = useEmployees();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRoles, setExpandedRoles] = useState<{ [key: string]: boolean }>({});

  // 📥 Obtener los horarios de la API
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/schedules');
        if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

        const data = await response.json();
        setSchedules(data.schedules || []);
      } catch (err: any) {
        console.error('Error obteniendo horarios:', err);
        setMessage('❌ Error al cargar los horarios.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // ⚡ Generar horarios automáticamente (semanal/mensual)
  const handleGenerateSchedules = async (generateForMonth = false, deletePrevious = false) => {
    setIsGenerating(true);
    setMessage('');

    try {
      const response = await fetch('/api/schedules/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateForMonth, deletePrevious }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al generar horarios');

      setMessage(`✅ ${data.message}`);
      setSchedules(data.schedules || []);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // ✏️ Editar turno de un empleado
  const handleEditSchedule = async (schedule: Schedule, newShift: 'MAÑANA' | 'TARDE') => {
    try {
      const response = await fetch(`/api/schedules/${schedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: schedule.employeeId, shift: newShift }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al actualizar el turno');

      setMessage('✅ Turno actualizado correctamente.');
      setSchedules((prev) =>
        prev.map((s) => (s.id === schedule.id ? { ...s, shift: newShift } : s))
      );
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  // 🔥 Agrupar horarios por rol
  const groupedSchedules = schedules.reduce((acc: { [role: string]: Schedule[] }, schedule) => {
    const employee = employees.find((emp) => emp.id === schedule.employeeId);
    if (!employee) return acc;

    if (!acc[employee.role]) {
      acc[employee.role] = [];
    }
    acc[employee.role].push(schedule);
    return acc;
  }, {});

  // 🔥 Alternar visibilidad de cada grupo (colapsar/expandir)
  const toggleRoleVisibility = (role: string) => {
    setExpandedRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold text-center text-black dark:text-white mb-10">
          🕒 Gestión de Horarios
        </h1>

        {/* 📌 Botones para generar horarios */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => handleGenerateSchedules(false, false)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition hover:bg-green-600"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generando...' : 'Generar Horarios Semanales'}
          </button>

          <button
            onClick={() => handleGenerateSchedules(true, false)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transition hover:bg-blue-600"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generando...' : 'Generar Horarios Mensuales'}
          </button>

          <button
            onClick={() => handleGenerateSchedules(false, true)}
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transition hover:bg-red-600"
            disabled={isGenerating}
          >
            {isGenerating ? 'Eliminando...' : 'Eliminar y Generar Nuevos'}
          </button>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <p className={`mt-4 text-lg text-center font-semibold ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {/* 📅 Lista de horarios agrupados por rol */}
        <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📆 Horarios por Rol</h2>

          {isLoading ? (
            <p className="text-center text-gray-500 animate-pulse">⏳ Cargando horarios...</p>
          ) : Object.keys(groupedSchedules).length === 0 ? (
            <p className="text-center text-gray-500 italic">🚀 No hay horarios generados. ¡Intenta generarlos!</p>
          ) : (
            Object.keys(groupedSchedules).map((role) => (
              <div key={role} className="mb-6">
                <button
                  onClick={() => toggleRoleVisibility(role)}
                  className="w-full text-left bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  {expandedRoles[role] ? '▼' : '▶'} {role} ({groupedSchedules[role].length} empleados)
                </button>

                {expandedRoles[role] && (
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                    {groupedSchedules[role].map((schedule) => {
                      const employee = employees.find((emp) => emp.id === schedule.employeeId);
                      if (!employee) return null;
                      return (
                        <li key={schedule.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow transition hover:scale-105">
                          <h3 className="font-bold text-gray-900 dark:text-white">{employee.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            📅 {new Date(schedule.date).toLocaleDateString('es-ES')} - 🕒 {schedule.shift}
                          </p>

                          <button
                            onClick={() => handleEditSchedule(schedule, schedule.shift === 'MAÑANA' ? 'TARDE' : 'MAÑANA')}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                          >
                            Cambiar Turno
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>

        {/* 📤 Botón para enviar horarios */}
        {schedules.length > 0 && <SendWhatsApp schedules={schedules} employees={employees} />}
      </div>
    </MainLayout>
  );
}
