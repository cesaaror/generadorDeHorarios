import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Definir manualmente Shift si Prisma no lo reconoce
const ShiftEnum = {
  MAÑANA: "MAÑANA",
  TARDE: "TARDE",
} as const;
type Shift = keyof typeof ShiftEnum;

/**
 * 🚀 Modificar un horario existente
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } } // ✅ Correcto en Next.js 14
) {
  try {
    console.log("📝 Params recibidos:", params);

    // ✅ Validar que `params.id` existe
    if (!params?.id) {
      console.error("❌ Error: ID no encontrado en params.");
      return NextResponse.json({ message: '❌ Error: ID del horario no proporcionado.' }, { status: 400 });
    }

    const scheduleId = Number(params.id);
    if (isNaN(scheduleId)) {
      console.error("❌ Error: ID de horario inválido.");
      return NextResponse.json({ message: '❌ Error: ID de horario inválido' }, { status: 400 });
    }

    // ✅ Obtener y validar el body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("❌ Error: JSON inválido.", error);
      return NextResponse.json({ message: '❌ Error: Formato JSON inválido.' }, { status: 400 });
    }

    console.log("📩 Request Body recibido:", body);
    const { employeeId, shift } = body;

    // ✅ Validar `employeeId`
    if (!employeeId || typeof employeeId !== 'number') {
      console.error("❌ Error: ID de empleado inválido.");
      return NextResponse.json({ message: '❌ Error: ID de empleado inválido.' }, { status: 400 });
    }

    // ✅ Validar `shift`
    if (!shift || !(shift in ShiftEnum)) {
      console.error("❌ Error: Turno inválido", shift);
      return NextResponse.json(
        { message: `❌ Error: El turno '${shift}' no es válido. Solo se permiten: ${Object.keys(ShiftEnum).join(", ")}` },
        { status: 400 }
      );
    }

    // ✅ Verificar si el horario existe antes de actualizarlo
    const existingSchedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
    if (!existingSchedule) {
      console.error("❌ Error: Horario no encontrado en la base de datos.");
      return NextResponse.json({ message: '❌ Error: Horario no encontrado' }, { status: 404 });
    }

    // ✅ Evitar actualizar con datos vacíos
    if (!shift) {
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
        employeeId,
        shift,
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
