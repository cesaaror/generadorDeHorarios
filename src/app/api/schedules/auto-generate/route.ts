import { NextResponse } from 'next/server';
import { PrismaClient, Shift } from '@prisma/client';

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
    const { generateForMonth, deletePrevious } = await request.json();

    // ✅ Si `deletePrevious` está activado, eliminamos los horarios anteriores
    if (deletePrevious) {
      await prisma.schedule.deleteMany({});
    }

    // ✅ Determinar la fecha de inicio (próximo lunes o después del último horario generado)
    let startDate = await getLastScheduleDate();
    if (!startDate || deletePrevious) {
      startDate = getNextMonday(new Date()); // Si no hay horarios previos, empieza desde el próximo lunes
    } else {
      startDate.setDate(startDate.getDate() + 1); // Comienza después del último horario registrado
    }

    const employees = await prisma.employee.findMany();
    if (employees.length === 0) {
      return NextResponse.json({ message: '❌ No hay empleados registrados para generar horarios.' }, { status: 400 });
    }

    // ✅ Definir cuántas semanas se generarán (1 por defecto, 4 si es mensual)
    const weeksToGenerate = generateForMonth ? 4 : 1;
    const daysToGenerate = weeksToGenerate * 7;

    // ✅ Generar los horarios
    const schedulesToCreate = [];
    for (const employee of employees) {
      for (let i = 0; i < daysToGenerate; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        const shift: Shift = i % 2 === 0 ? Shift.MAÑANA : Shift.TARDE;

        schedulesToCreate.push({
          employeeId: employee.id,
          date: currentDay,
          shift,
        });
      }
    }

    // ✅ Insertar en la base de datos evitando duplicados
    await prisma.schedule.createMany({ data: schedulesToCreate });

    return NextResponse.json(
      { message: `✅ Horarios generados para ${weeksToGenerate} semana(s)`, schedulesCreated: schedulesToCreate.length },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error generando horarios:', error);
    return NextResponse.json({ message: '🚨 Error interno del servidor.', error: error?.message || 'Desconocido' }, { status: 500 });
  }
}
