'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MainLayoutProps {
  children?: React.ReactNode;
}


const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // ✅ Evita errores de SSR e hidratación

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      
      {/* 🔵 Barra de navegación superior */}
      <header className="py-4 px-8 shadow-md flex justify-between items-center bg-gray-800 text-white">
        <h1 
          className="text-lg font-bold cursor-pointer hover:text-gray-300 transition-all duration-200"
          onClick={() => router.push('/dashboard')}
        >
          Gestión de Empleados
        </h1>

        <div className="flex gap-4">
          {/* 🔵 Cambio de tema */}
          <button
            onClick={toggleTheme}
            className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-200 hover:bg-blue-600"
            aria-label="Cambiar Tema"
          >
            {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          </button>

          {/* 🔵 Manejo de autenticación */}
          {status === 'loading' ? (
            <p className="text-gray-400">Verificando sesión...</p>
          ) : session ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded transition-all duration-200 hover:bg-red-600"
              aria-label="Cerrar sesión"
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-green-500 text-white px-4 py-2 rounded transition-all duration-200 hover:bg-green-600"
              aria-label="Iniciar sesión"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      {/* 🔵 Layout con Sidebar */}
      <div className="flex">
        {/* 🔵 Barra lateral de navegación */}
        <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 hidden md:block shadow-md">
          <SidebarMenu />
        </aside>

        {/* 🔵 Menú lateral para móviles */}
        {menuOpen && (
          <aside className="fixed top-0 left-0 w-64 bg-gray-800 text-white min-h-screen p-6 z-50 shadow-md md:hidden">
            <button 
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              ✖
            </button>
            <SidebarMenu />
          </aside>
        )}

        {/* 📌 Contenido Principal */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

// ✅ Componente SidebarMenu reutilizable
const SidebarMenu: React.FC = () => {
  const router = useRouter();

  return (
    <nav>
      <ul className="space-y-4">
        <SidebarLink label="📋 Dashboard" path="/dashboard" />
        <SidebarLink label="👥 Empleados" path="/empleados" />
        <SidebarLink label="🕒 Horarios" path="/horarios" />
        <SidebarLink label="📅 Calendario" path="/calendario" />
        <SidebarLink label="⚙️ Configuración" path="/configuracion" />
      </ul>
    </nav>
  );
};

// ✅ Componente reutilizable para los enlaces del Sidebar
const SidebarLink: React.FC<{ label: string; path: string }> = ({ label, path }) => {
  const router = useRouter();

  return (
    <li
      className="cursor-pointer flex items-center gap-2 p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:text-blue-400"
      onClick={() => router.push(path)}
      role="button"
      tabIndex={0}
    >
      {label}
    </li>
  );
};

export default MainLayout;
