'use client'; // Este archivo es un Client Component

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-800 to-black text-white px-6">
      {/* Cabecera */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Bienvenido a <span className="text-purple-400">Gestión de Empleados</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          Administra empleados, asigna horarios y optimiza la gestión de tu equipo de trabajo con nuestra plataforma intuitiva.
        </p>
      </header>

      {/* Botón principal */}
      <div className="mb-12">
        <button
          onClick={handleGetStarted}
          className="bg-purple-500 text-white px-8 py-4 rounded-lg shadow-lg hover:scale-105 hover:bg-purple-600 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
          aria-label="Ir a la página de inicio de sesión"
        >
          Comenzar Ahora
        </button>
      </div>

      {/* Información sobre la aplicación */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100 max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">Sobre Nuestra Plataforma</h2>
        <p className="mb-4">
          Nuestra aplicación permite a los administradores gestionar empleados, asignar horarios y automatizar el envío de horarios mediante WhatsApp.
        </p>

        <ul className="list-disc list-inside mb-4">
          <li><strong>Gestión de Empleados:</strong> Agrega, edita y visualiza empleados de forma rápida.</li>
          <li><strong>Asignación de Horarios:</strong> Define turnos y fechas específicas para cada empleado.</li>
          <li><strong>Notificaciones por WhatsApp:</strong> Envía automáticamente los horarios a cada empleado.</li>
          <li><strong>Interfaz Adaptable:</strong> Compatible con modo claro y oscuro.</li>
          <li><strong>Seguridad:</strong> Inicio de sesión seguro para administradores.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">Cómo Usar la Plataforma</h3>
        <p className="mb-4">
          Para comenzar a utilizar la plataforma:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Regístrate o inicia sesión con tu cuenta de administrador.</li>
          <li>Agrega empleados ingresando su nombre, rol y detalles de contacto.</li>
          <li>Asigna horarios a los empleados usando el calendario interactivo.</li>
          <li>Envía automáticamente los horarios a los empleados por WhatsApp.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">Tecnologías Utilizadas</h3>
        <p className="mb-4">
          Este proyecto ha sido desarrollado con las mejores tecnologías web, incluyendo <strong>Next.js</strong>, <strong>React</strong>, <strong>TypeScript</strong> y <strong>Tailwind CSS</strong>, garantizando rapidez y eficiencia.
        </p>

        <p className="italic text-sm text-gray-400 text-center">
          “La eficiencia en la gestión de empleados es clave para el éxito de cualquier organización.”
        </p>
      </section>
    </main>
  );
}
