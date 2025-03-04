import { NextResponse } from 'next/server';
import { PrismaClient, Shift } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🚀 Modificar un horario existente
 */
export async function PUT(request: Request) {
  try {
    // ✅ Obtener datos del request de forma segura
    const body = await request.json();
    console.log("📩 Request Body recibido:", body);

    // ✅ Validar que el `id` esté presente y sea un número válido
    if (!body.id || typeof body.id !== "number") {
      console.error("❌ Error: ID del horario no proporcionado o inválido.");
      return NextResponse.json({ message: '❌ Error: ID del horario no proporcionado o inválido.' }, { status: 400 });
    }

    const scheduleId = Number(body.id);

    // ✅ Verificar si el horario existe en la base de datos
    const existingSchedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
    if (!existingSchedule) {
      console.error("❌ Error: Horario no encontrado.");
      return NextResponse.json({ message: '❌ Error: Horario no encontrado' }, { status: 404 });
    }

    // ✅ Validar `shift` (Mañana/Tarde)
    if (body.shift && !Object.values(Shift).includes(body.shift as Shift)) {
      console.error("❌ Error: Turno inválido", body.shift);
      return NextResponse.json(
        { message: `❌ Error: El turno '${body.shift}' no es válido.` },
        { status: 400 }
      );
    }

    // ✅ Validar `date` (Asegurar que sea una fecha válida)
    let newDate: Date | undefined;
    if (body.date) {
      newDate = new Date(body.date);
      if (isNaN(newDate.getTime())) {
        console.error("❌ Error: Fecha inválida", body.date);
        return NextResponse.json(
          { message: '❌ Error: La fecha proporcionada no es válida.' },
          { status: 400 }
        );
      }
    }

    // ✅ Evitar actualizar si no hay cambios
    if (!newDate && !body.shift) {
      console.warn("⚠️ Advertencia: No se enviaron datos nuevos para actualizar.");
      return NextResponse.json(
        { message: '⚠️ Advertencia: No se enviaron datos nuevos para actualizar' },
        { status: 400 }
      );
    }

    // ✅ Actualizar el horario en la base de datos
    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        ...(newDate && { date: newDate }),
        ...(body.shift && { shift: body.shift }),
      },
    });

    console.log("✅ Horario actualizado con éxito:", updatedSchedule);

    return NextResponse.json(
      { message: '✅ Horario actualizado exitosamente', updatedSchedule },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error inesperado al actualizar el horario:", error);
    return NextResponse.json(
      { message: '🚨 Error interno al actualizar el horario.', error: error?.message || 'Desconocido' },
      { status: 500 }
    );
  }
}
