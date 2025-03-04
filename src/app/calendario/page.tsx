'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout';
import dynamic from 'next/dynamic';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css';

// 📅 Carga dinámica de react-calendar para evitar errores en SSR
const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

// 📌 Definimos correctamente el tipo `Value` que usa `react-calendar`
type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

interface Schedule {
  id: number;
  date: string;
  shift: 'MAÑANA' | 'TARDE';
  employeeName: string;
  employeeId: number;
}

interface Employee {
  id: number;
  name: string;
}

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | 'all'>('all');
  const [filterRange, setFilterRange] = useState<'day' | 'week' | 'month'>('day');

  // 🔄 Obtener horarios y empleados desde la API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [schedulesRes, employeesRes] = await Promise.all([
          fetch('/api/schedules'),
          fetch('/api/employees'),
        ]);

        if (!schedulesRes.ok || !employeesRes.ok) {
          throw new Error('Error al cargar los datos');
        }

        const schedulesData = await schedulesRes.json();
        const employeesData = await employeesRes.json();

        setSchedules(schedulesData.schedules || []);
        setEmployees(employeesData.employees || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Corrección final: Definimos correctamente `handleDateChange`
  const handleDateChange = useCallback((value: CalendarValue, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (!value) return;

    if (Array.isArray(value)) {
      setSelectedDate(value[0] || new Date()); // Si es un rango, tomar la primera fecha válida
    } else {
      setSelectedDate(value); // Si es una única fecha, guardarla directamente
    }
  }, []);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 📍 Título principal */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-8">
          📅 Calendario de Turnos
        </h1>

        {/* 🔄 Mensajes de carga o error */}
        {loading && <p className="text-center text-gray-500">Cargando horarios...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid md:grid-cols-2 gap-8">
          {/* 📆 Calendario */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Selecciona una Fecha
            </h2>
            <Calendar
              onChange={(value, event) => handleDateChange(value, event)}
              value={selectedDate}
              className="w-full rounded-lg shadow-md p-4"
            />
          </div>

          {/* 🏷️ Turnos del período seleccionado */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Turnos Programados
            </h2>
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 mb-3"
                >
                  <p className="text-lg font-medium">🏷️ {schedule.employeeName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">🕒 Turno: {schedule.shift}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center italic">
                No hay turnos programados en este período.
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
