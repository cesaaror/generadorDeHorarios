import React from 'react';

interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string;
  dayOff?: string;
}

interface Schedule {
  id: number;
  employeeId: number;
  date: string;
  shift: 'MAÑANA' | 'TARDE';
}

interface SendWhatsAppProps {
  schedules: Schedule[];
  employees: Employee[];
}

const SendWhatsApp: React.FC<SendWhatsAppProps> = ({ schedules, employees }) => {
  // 📩 Función para generar el mensaje de WhatsApp con los horarios del empleado
  const generateWhatsAppMessage = (employee: Employee, range: 'week' | 'month') => {
    const employeeSchedules = schedules.filter((sch) => sch.employeeId === employee.id);

    if (employeeSchedules.length === 0) {
      return `📌 ${employee.name}, aún no tienes horarios asignados.`;
    }

    // Ordenar los horarios por fecha
    employeeSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filtrar por semana o mes
    const now = new Date();
    let filteredSchedules = employeeSchedules;

    if (range === 'week') {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() + 7);
      filteredSchedules = employeeSchedules.filter((sch) => new Date(sch.date) <= weekEnd);
    }

    // Crear mensaje
    let message = `👋 ¡Hola ${employee.name}! Aquí tienes tu horario de ${range === 'week' ? 'esta semana' : 'este mes'}:\n\n`;

    filteredSchedules.forEach((sch) => {
      const formattedDate = new Date(sch.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      message += `📅 ${formattedDate}: ${sch.shift === 'MAÑANA' ? '🌅 Mañana' : '🌆 Tarde'}\n`;
    });

    message += `\nCualquier duda, avísame. ¡Saludos! 😊`;

    return encodeURIComponent(message);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">📤 Enviar Horarios por WhatsApp</h2>

      {employees.map((employee) => {
        const hasSchedules = schedules.some((sch) => sch.employeeId === employee.id);
        if (!hasSchedules) return null;

        const weekMessage = generateWhatsAppMessage(employee, 'week');
        const monthMessage = generateWhatsAppMessage(employee, 'month');
        const phoneNumber = employee.phone.replace(/\D/g, '');

        return (
          <div key={employee.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {employee.name} ({employee.role})
            </h3>

            {/* 📤 Botones para enviar horarios */}
            <div className="mt-2 flex gap-2">
              <a
                href={`https://wa.me/${phoneNumber}?text=${weekMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
              >
                📅 Enviar Semana
              </a>

              <a
                href={`https://wa.me/${phoneNumber}?text=${monthMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 transition"
              >
                📆 Enviar Mes
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SendWhatsApp;
