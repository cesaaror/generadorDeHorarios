'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import useEmployees from '../hooks/useEmployees';
import SendWhatsApp from '../components/SendWhatsApp';
import DownloadPDF from '../components/DownloadPDF';

interface Schedule {
  id: number;
  employeeId: number;
  employeeName: string;
  role: string;
  date: string;
  shift: 'MAÑANA' | 'TARDE';
}

export default function Horarios() {
  const { employees } = useEmployees();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);

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

  const handleGenerateSchedules = async () => {
    setIsGenerating(true);
    setMessage('');

    try {
      const response = await fetch('/api/schedules/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateForMonth: false, deletePrevious: false }),
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

  // ✏️ **Función para cambiar el turno del empleado**
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

  const groupByWeek = (schedules: Schedule[]) => {
    return schedules.reduce((acc: { [week: string]: Schedule[] }, schedule) => {
      const date = new Date(schedule.date);
      const firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1))
        .toISOString()
        .split('T')[0];
      if (!acc[firstDayOfWeek]) acc[firstDayOfWeek] = [];
      acc[firstDayOfWeek].push(schedule);
      return acc;
    }, {});
  };

  const groupedByWeek = groupByWeek(schedules);

  const roleColors: { [key: string]: string } = {
    CAJERO: 'bg-blue-500',
    REPONEDOR: 'bg-green-500',
    CARNICERO: 'bg-red-500',
    CHARCUTERO: 'bg-orange-500',
    PESCADERO: 'bg-yellow-500',
    PANADERO: 'bg-purple-500',
    ENCARGADO: 'bg-black text-white',
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold text-center text-black dark:text-white mb-10">
          🕒 Gestión de Horarios
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleGenerateSchedules}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generando...' : 'Generar Horarios Semanales'}
          </button>
        </div>

        {message && <p className="mt-4 text-lg text-center font-semibold text-red-600">{message}</p>}

        {isLoading ? (
          <p className="text-center text-gray-500 animate-pulse">⏳ Cargando horarios...</p>
        ) : (
          Object.keys(groupedByWeek).map((week) => (
            <div key={week} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
              <button
                onClick={() => setExpandedWeek(expandedWeek === week ? null : week)}
                className="w-full text-left bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                {expandedWeek === week ? '▼' : '▶'} 📆 Semana del {week}
              </button>

              {expandedWeek === week &&
                employees.map((employee) => {
                  const employeeSchedules = groupedByWeek[week].filter((s) => s.employeeId === employee.id);
                  if (employeeSchedules.length === 0) return null;
                  return (
                    <div key={employee.id} className="mt-4">
                      <button
                        onClick={() => setExpandedEmployee(expandedEmployee === employee.id ? null : employee.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg shadow-lg hover:opacity-80 transition ${
                          roleColors[employee.role] || 'bg-gray-500'
                        }`}
                      >
                        {expandedEmployee === employee.id ? '▼' : '▶'} {employee.name} - {employee.role}
                      </button>
                      {expandedEmployee === employee.id && (
                        <ul className="mt-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md p-4">
                          {employeeSchedules.map((schedule) => (
                            <li key={schedule.id} className="p-2 border-b dark:border-gray-600 flex justify-between items-center">
                              📅 {new Date(schedule.date).toLocaleDateString('es-ES')} - 🕒 {schedule.shift}
                              <button
                                onClick={() => handleEditSchedule(schedule, schedule.shift === 'MAÑANA' ? 'TARDE' : 'MAÑANA')}
                                className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition"
                              >
                                Cambiar Turno
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
            </div>
          ))
        )}

        {schedules.length > 0 && <SendWhatsApp schedules={schedules} employees={employees} />}
        {schedules.length > 0 && <DownloadPDF schedules={schedules} />}
      </div>
    </MainLayout>
  );
}
