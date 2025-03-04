import { NextResponse } from 'next/server';
import { PrismaClient, Shift } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    // ✅ Obtener datos del request
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ message: '❌ Error: Formato JSON inválido.' }, { status: 400 });
    }

    const { id, shift } = body;

    // ✅ Validar `id`
    const scheduleId = Number(id);
    if (!scheduleId || isNaN(scheduleId)) {
      return NextResponse.json({ message: '❌ Error: ID inválido.' }, { status: 400 });
    }

    // ✅ Validar `shift`
    if (!Object.values(Shift).includes(shift)) {
      return NextResponse.json({ message: `❌ Error: Turno '${shift}' no es válido.` }, { status: 400 });
    }

    // ✅ Verificar si el horario existe
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
    });

    if (!existingSchedule) {
      return NextResponse.json({ message: '❌ Error: Horario no encontrado.' }, { status: 404 });
    }

    // ✅ Actualizar el turno en la base de datos
    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: { shift },
    });

    return NextResponse.json(
      { message: '✅ Horario actualizado correctamente.', schedule: updatedSchedule },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error al actualizar el horario:', error);
    return NextResponse.json(
      { message: '🚨 Error interno del servidor.', error: error?.message || 'Desconocido' },
      { status: 500 }
    );
  }
}
