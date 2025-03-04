'use client';

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../context/ThemeContext';
import { useSession, signOut } from 'next-auth/react';
import { FaUserCog, FaPalette, FaLock, FaSignOutAlt } from 'react-icons/fa';

export default function Configuracion() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 🔵 Título principal */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          ⚙️ Configuración
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
          Personaliza las opciones de tu aplicación.
        </p>

        {/* 🔵 Configuraciones Generales */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* 📌 Cambio de Tema */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3">
              <FaPalette className="text-blue-500" /> Tema de la Aplicación
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Alterna entre el modo claro y oscuro según tu preferencia.
            </p>
            <button
              onClick={toggleTheme}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition-all"
            >
              {theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            </button>
          </div>

          {/* 📌 Información del Usuario */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3">
              <FaUserCog className="text-green-500" /> Información de la Cuenta
            </h2>
            {session ? (
              <>
               <p className="text-gray-600 dark:text-gray-300">
  <strong>Nombre:</strong> {session?.user?.name || 'No disponible'}
</p>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  <strong>Email:</strong> {session.user?.email || 'No disponible'}
                </p>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 transition-all"
                >
                  Editar Información
                </button>
              </>
            ) : (
              <p className="text-gray-500 italic">Inicia sesión para ver tu información.</p>
            )}
          </div>

          {/* 📌 Seguridad */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3">
              <FaLock className="text-yellow-500" /> Seguridad
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Administra la seguridad de tu cuenta, cambia tu contraseña o cierra sesión.
            </p>
            <div className="flex gap-3">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600 transition-all">
                Cambiar Contraseña
              </button>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 transition-all"
              >
                <FaSignOutAlt className="inline mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
