'use client';

import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { FaClock, FaUsers } from 'react-icons/fa';

// Componente de encabezado
const Header = () => (
  <header className="text-center mb-12">
    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
      Bienvenido a <span className="text-blue-500">Gestión de Empleados</span>
    </h1>
    <p className="text-lg text-gray-300 max-w-xl mx-auto">
      Administra horarios, empleados y turnos de manera eficiente y sin complicaciones.
    </p>
  </header>
);

// Componente de botón reutilizable
const Button = ({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:scale-105 hover:bg-blue-600 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 ${className}`}
  >
    {children}
  </button>
);

// Componente principal
export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <>
      <Head>
        <title>Gestión de Empleados</title>
        <meta
          name="description"
          content="Plataforma intuitiva para administrar empleados y horarios de trabajo."
        />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
        <Header />
        
        <div className="flex flex-col items-center gap-6">
          <Button onClick={handleGetStarted} className="animate-pulse flex items-center gap-2">
            <FaUsers /> Iniciar Sesión
          </Button>
          <p className="text-gray-400 text-sm">
            Administra empleados, turnos y horarios de manera sencilla y eficiente.
          </p>
        </div>

        <footer className="mt-16 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Gestión de Empleados. Todos los derechos reservados.</p>
        </footer>
      </main>
    </>
  );
}
