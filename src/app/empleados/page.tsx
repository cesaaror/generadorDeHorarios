'use client';

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import AddEmployee from '../components/AddEmployee';
import EmployeeList from '../components/EmployeeList';
import useEmployees from '../hooks/useEmployees';

export default function Empleados() {
  const { employees, setEmployees, isLoading, error } = useEmployees();

  // ✅ Validación de `setEmployees`
  if (typeof setEmployees !== 'function') {
    console.error('⚠️ Error: `setEmployees` no es una función válida.');
    return (
      <MainLayout>
        <p className="text-center text-red-600 font-semibold">Error cargando empleados.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* 📍 Título Principal */}
        <h1 className="text-4xl font-extrabold text-center text-black dark:text-white mb-10">
  📋 Gestión de Empleados
</h1>


        {/* 📌 Mensajes de carga o error */}
        {isLoading && (
          <p className="text-center text-gray-600 dark:text-gray-400 animate-pulse" aria-live="polite">
            ⏳ Cargando empleados...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 dark:text-red-400 font-semibold" aria-live="assertive">
            ❌ {error}
          </p>
        )}

        {/* 🏷️ Formulario para agregar empleados */}
        <div className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8 transition-all">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            ➕ Agregar Nuevo Empleado
          </h2>
          <AddEmployee setEmployees={setEmployees} />
        </div>

        {/* 📋 Lista de empleados */}
        <div className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            👥 Lista de Empleados
          </h2>
          {employees.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 italic">
              🚀 No hay empleados registrados. ¡Agrega uno primero!
            </p>
          ) : (
            <EmployeeList employees={employees} setEmployees={setEmployees} />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
