import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lista de roles exclusivos (solo puede haber uno por turno)
const EXCLUSIVE_ROLES = ['CARNICERO', 'PANADERO', 'CHARCUTERO'];

/** 📌 OBTENER LISTA DE HORARIOS */
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: { employee: true }, // Incluir detalles del empleado
    });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error: any) {
    console.error('Error obteniendo horarios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}

/** 📌 CREAR UN NUEVO HORARIO */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, date, shift } = body;

    // ❌ Validar datos requeridos
    if (!employeeId || !date || !shift) {
      return NextResponse.json({ message: 'Faltan datos requeridos' }, { status: 400 });
    }

    // ❌ Validar que la fecha sea válida
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ message: 'Fecha no válida' }, { status: 400 });
    }

    // 📌 Obtener datos del empleado
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      return NextResponse.json({ message: 'Empleado no encontrado' }, { status: 404 });
    }

    // 📌 Verificar si el rol es exclusivo y ya está asignado en ese turno
    if (EXCLUSIVE_ROLES.includes(employee.role)) {
      const existing = await prisma.schedule.findFirst({
        where: {
          date: parsedDate,
          shift,
          employee: { role: employee.role },
        },
      });

      if (existing) {
        return NextResponse.json(
          { message: `Ya hay un ${employee.role} en este turno.` },
          { status: 400 }
        );
      }
    }

    // 📌 Crear el horario en la base de datos
    const schedule = await prisma.schedule.create({
      data: { employeeId, date: parsedDate, shift },
    });

    return NextResponse.json({ message: 'Horario asignado correctamente', schedule }, { status: 201 });
  } catch (error: any) {
    console.error('Error al asignar horario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}

/** 📌 ACTUALIZAR HORARIO (Opcional) */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, date, shift } = body;

    if (!id || !date || !shift) {
      return NextResponse.json({ message: 'Faltan datos para actualizar el horario' }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ message: 'Fecha no válida' }, { status: 400 });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: { date: parsedDate, shift },
    });

    return NextResponse.json({ message: 'Horario actualizado correctamente', updatedSchedule }, { status: 200 });
  } catch (error: any) {
    console.error('Error actualizando horario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}

/** 📌 ELIMINAR HORARIO (Opcional) */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'Se requiere un ID para eliminar el horario' }, { status: 400 });
    }

    await prisma.schedule.delete({ where: { id } });

    return NextResponse.json({ message: 'Horario eliminado correctamente' }, { status: 200 });
  } catch (error: any) {
    console.error('Error eliminando horario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error?.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}
