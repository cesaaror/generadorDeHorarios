import MainLayout from '@/app/layouts/MainLayout';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 🔵 Título principal */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          📊 Dashboard - Gestión de Horarios
        </h1>
        
        {/* 📖 Guía de uso */}
        <div className="bg-blue-100 dark:bg-gray-800 border border-blue-300 dark:border-gray-600 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📖 Cómo utilizar la aplicación
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Sigue estos pasos para navegar a través de la aplicación:
          </p>
          <ol className="list-decimal list-inside text-gray-800 dark:text-gray-300 space-y-2">
            <li><strong>📋 Dashboard:</strong> Vista general del sistema y accesos rápidos.</li>
            <li><strong>👥 Empleados:</strong> Agrega, edita y elimina empleados de la base de datos.</li>
            <li><strong>🕒 Horarios:</strong> Genera y administra los turnos de los empleados.</li>
            <li><strong>📅 Calendario:</strong> Visualiza y gestiona los horarios programados.</li>
            <li><strong>📤 Exportar Horarios:</strong> Descarga los turnos en PDF antes de enviarlos.</li>
            <li><strong>⚙️ Configuración:</strong> Personaliza tu cuenta y ajusta la app según tus necesidades.</li>
          </ol>
          <p className="mt-4 text-gray-700 dark:text-gray-300 italic">
            Puedes hacer clic en las opciones del menú lateral para navegar entre las secciones.
          </p>
        </div>

        {/* 🔗 Accesos rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => router.push('/empleados')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition w-full"
          >
            👥 Administrar Empleados
          </button>

          <button 
            onClick={() => router.push('/horarios')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition w-full"
          >
            🕒 Generar Horarios
          </button>

          <button 
            onClick={() => router.push('/calendario')}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition w-full"
          >
            📅 Ver Calendario
          </button>

          <button 
            onClick={() => router.push('/configuracion')}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition w-full"
          >
            ⚙️ Configuración
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
