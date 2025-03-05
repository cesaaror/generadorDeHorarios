'use client';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect } from 'react';

interface Schedule {
  id: number;
  employeeId: number;
  employeeName: string;
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

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text('📅 Horario de Empleados', 14, 10);

    autoTable(doc, {
      head: [['Empleado', 'Fecha', 'Turno']],
      body: schedules.map((s) => [
        s.employeeName,
        new Date(s.date).toLocaleDateString('es-ES'),
        s.shift,
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
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
