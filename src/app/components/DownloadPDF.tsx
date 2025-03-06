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

  // 🎨 Colores para cada rol
  const roleColors: { [key: string]: [number, number, number] } = {
    CAJERO: [52, 152, 219], // Azul
    REPONEDOR: [46, 204, 113], // Verde
    CARNICERO: [231, 76, 60], // Rojo
    CHARCUTERO: [230, 126, 34], // Naranja
    PESCADERO: [241, 196, 15], // Amarillo
    PANADERO: [155, 89, 182], // Morado
    ENCARGADO: [44, 62, 80], // Negro
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('📅 Horario de Empleados', 70, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Empleado', 'Rol', 'Fecha', 'Turno']],
      body: schedules.map((s) => [
        s.employeeName,
        s.role,
        new Date(s.date).toLocaleDateString('es-ES'),
        s.shift,
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },

      // ✅ Corregido el acceso a `row.raw`
      didParseCell: (data) => {
        if (data.row.section === 'body' && Array.isArray(data.row.raw)) {
          const role = data.row.raw[1] as string; // El rol está en la segunda columna
          if (roleColors[role]) {
            data.cell.styles.fillColor = roleColors[role];
            data.cell.styles.textColor = role === 'ENCARGADO' ? [255, 255, 255] : [0, 0, 0];
          }
        }
      },
    });

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
