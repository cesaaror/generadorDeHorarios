import { NextResponse } from 'next/server';
import { PrismaClient, Shift } from '@prisma/client';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const prisma = new PrismaClient();

/** 📌 Función para obtener el próximo lunes desde una fecha específica */
function getNextMonday(fromDate: Date): Date {
  const dayOfWeek = fromDate.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(fromDate);
  nextMonday.setDate(fromDate.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday;
}

/** 📌 Función para obtener la última fecha de horario registrado */
async function getLastScheduleDate(): Promise<Date | null> {
  const lastSchedule = await prisma.schedule.findFirst({
    orderBy: { date: 'desc' },
  });
  return lastSchedule ? new Date(lastSchedule.date) : null;
}

/** 📌 Generar horarios automáticamente */
export async function POST(request: Request) {
  try {
    const { generateForMonth, deletePrevious, downloadPdf } = await request.json();

    if (deletePrevious) {
      await prisma.schedule.deleteMany({});
    }

    let startDate = await getLastScheduleDate();
    if (!startDate || deletePrevious) {
      startDate = getNextMonday(new Date());
    } else {
      startDate.setDate(startDate.getDate() + 1);
    }

    const employees = await prisma.employee.findMany();
    if (employees.length === 0) {
      return NextResponse.json({ message: '❌ No hay empleados registrados para generar horarios.' }, { status: 400 });
    }

    const weeksToGenerate = generateForMonth ? 4 : 1;
    const daysToGenerate = weeksToGenerate * 7;
    const schedulesToCreate = [];
    const weekSchedules: { [key: string]: any[] } = {};

    for (let i = 0; i < daysToGenerate; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      const weekKey = `Semana ${Math.floor(i / 7) + 1}`;

      for (const employee of employees) {
        const shift: Shift = i % 2 === 0 ? Shift.MAÑANA : Shift.TARDE;
        schedulesToCreate.push({ employeeId: employee.id, date: currentDay, shift });

        if (!weekSchedules[weekKey]) weekSchedules[weekKey] = [];
        weekSchedules[weekKey].push({ name: employee.name, date: currentDay, shift, role: employee.role });
      }
    }

    await prisma.schedule.createMany({ data: schedulesToCreate });

    if (downloadPdf) {
      const pdf = new jsPDF();
      pdf.text('Horarios Generados', 14, 10);

      Object.keys(weekSchedules).forEach((week, index) => {
        pdf.text(week, 14, 20 + index * 60);
        autoTable(pdf, {
          startY: 25 + index * 60,
          head: [['Empleado', 'Fecha', 'Turno', 'Rol']],
          body: weekSchedules[week].map((s) => [
            s.name,
            s.date.toLocaleDateString('es-ES'),
            s.shift,
            s.role,
          ]),
        });
      });

      pdf.save('Horarios_Generados.pdf');
    }

    return NextResponse.json(
      { message: `✅ Horarios generados para ${weeksToGenerate} semana(s)`, schedulesCreated: schedulesToCreate.length },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error generando horarios:', error);
    return NextResponse.json({ message: '🚨 Error interno del servidor.', error: error?.message || 'Desconocido' }, { status: 500 });
  }
}
