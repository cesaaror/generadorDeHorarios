import MainLayout from '@/app/layouts/MainLayout';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">📊 Dashboard</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          ¡Bienvenido al sistema de gestión de empleados! Aquí puedes administrar horarios y empleados de manera eficiente.
        </p>

        {/* 📖 Manual de Usuario */}
        <div className="mt-8 bg-blue-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-blue-800 dark:text-white mb-3">
            📖 Manual de Uso - Paso a Paso
          </h2>
          <ol className="list-decimal pl-5 space-y-3 text-gray-700 dark:text-gray-300">
            <li>
              📋 **Dashboard:** Aquí puedes ver un resumen de los empleados y turnos programados.
            </li>
            <li>
              👥 **Empleados:** Agrega, edita y elimina empleados. Accede desde el menú lateral.
            </li>
            <li>
              🕒 **Horarios:** Crea y ajusta turnos de los empleados de manera manual o automática.
            </li>
            <li>
              📅 **Calendario:** Consulta los horarios asignados en una vista semanal o mensual.
            </li>
            <li>
              ⚙️ **Configuración:** Personaliza la aplicación, cambia el tema y administra tu cuenta.
            </li>
            <li>
              📲 **Enviar Horarios por WhatsApp:** Envía los turnos generados a los empleados directamente.
            </li>
            <li>
              📄 **Descargar PDF:** Próximamente podrás descargar los horarios en un archivo PDF.
            </li>
          </ol>
          <p className="mt-4 text-sm italic text-gray-600 dark:text-gray-400">
            Navega usando el menú lateral para acceder a cada sección.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
