'use client';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect } from 'react';

interface Schedule {
  id: number;
  employeeId: number;
  employeeName: string;
  role: string;
  date: string;
  shift: 'MAÑANA' | 'TARDE';
}

interface Props {
  schedules: Schedule[];
}

export default function DownloadPDF({ schedules }: Props) {
  useEffect(() => {
    console.log('📄 PDF Generator Ready!');
  }, []);

  // 🎨 **Colores asignados según el rol**
  const roleColors: { [key: string]: [number, number, number] } = {
    CAJERO: [52, 152, 219], // Azul
    REPONEDOR: [46, 204, 113], // Verde
    CARNICERO: [231, 76, 60], // Rojo
    CHARCUTERO: [230, 126, 34], // Naranja
    PESCADERO: [241, 196, 15], // Amarillo
    PANADERO: [155, 89, 182], // Morado
    ENCARGADO: [44, 62, 80], // Negro
  };

  // 📅 **Agrupar horarios por semana**
  const groupByWeek = (schedules: Schedule[]) => {
    return schedules.reduce((acc: { [week: string]: Schedule[] }, schedule) => {
      const date = new Date(schedule.date);
      const firstDayOfWeek = new Date(date.setDate(date.getDate() - date.getDay() + 1))
        .toISOString()
        .split('T')[0]; // Obtener el lunes de la semana
      if (!acc[firstDayOfWeek]) acc[firstDayOfWeek] = [];
      acc[firstDayOfWeek].push(schedule);
      return acc;
    }, {});
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // 🏷️ **Título del documento**
    doc.setFontSize(18);
    doc.text('📅 Horario de Empleados', 70, 15);

    const groupedByWeek = groupByWeek(schedules);
    let startY = 25;

    // 🔄 **Generar tabla por cada semana**
    Object.keys(groupedByWeek).forEach((week, index) => {
      if (index > 0) startY += 15; // Espacio entre semanas

      doc.setFontSize(14);
      doc.text(`Semana del ${week}`, 14, startY);

      autoTable(doc, {
        startY: startY + 5,
        head: [['Empleado', 'Rol', 'Fecha', 'Turno']],
        body: groupedByWeek[week].map((s) => [
          s.employeeName,
          s.role,
          new Date(s.date).toLocaleDateString('es-ES'),
          s.shift,
        ]),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },

        // 🎨 **Aplicar colores por rol**
        didParseCell: (data) => {
          if (data.row.section === 'body' && data.row.raw) {
            const rowData = data.row.raw as string[];
            const role = rowData[1]; // **Obtener el rol del empleado**
            if (roleColors[role]) {
              data.cell.styles.fillColor = roleColors[role];
              data.cell.styles.textColor = role === 'ENCARGADO' ? [255, 255, 255] : [0, 0, 0];
            }
          }
        },
      });

      // ✅ **Corrección de `lastAutoTable`**
      startY = (doc as any).previousAutoTable?.finalY + 10 || startY + 20;
    });

    // 💾 **Guardar el PDF**
    doc.save('horario.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="mt-4 bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-600 transition"
    >
      📥 Descargar Horario en PDF
    </button>
  );
}
