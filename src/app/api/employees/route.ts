import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Role, Shift } from '@/app/types/roles'; // ✅ Importamos los enums desde el nuevo archivo

const prisma = new PrismaClient();

/**
 * 🚀 Función para generar un día libre aleatorio
 */
const getRandomDayOff = () => {
  const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  return diasSemana[Math.floor(Math.random() * diasSemana.length)];
};

/**
 * 🚀 Obtener la lista de empleados
 */
export const GET = async () => {
  try {
    const employees = await prisma.employee.findMany();
    return NextResponse.json({ employees }, { status: 200 });
  } catch (error: any) {
    console.error('❌ Error al obtener empleados:', error);
    return NextResponse.json(
      { message: '🚨 Error interno del servidor al obtener empleados.', error: error?.message || 'Desconocido' },
      { status: 500 }
    );
  }
};

/**
 * 🚀 Agregar un nuevo empleado
 */
export const POST = async (request: Request) => {
  try {
    const body = await request.json().catch(() => null);

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: '❌ Error: No se recibieron datos.' }, { status: 400 });
    }

    const { name, phone, role, dayOff, userId, shift } = body;

    if (!name || !phone || !role || !userId) {
      return NextResponse.json({ message: '❌ Error: Todos los campos son obligatorios.' }, { status: 400 });
    }

    const parsedUserId = Number(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ message: '❌ Error: userId inválido.' }, { status: 400 });
    }

    if (!Object.values(Role).includes(role as Role)) {
      return NextResponse.json({ message: `❌ Error: El rol '${role}' no es válido.` }, { status: 400 });
    }

    // ✅ Validar el `shift` y asignar por defecto MAÑANA si es inválido
    const shiftValue: Shift = Object.values(Shift).includes(shift as Shift) ? (shift as Shift) : Shift.MAÑANA;

    // Verificar si el empleado ya existe por teléfono
    const existingEmployee = await prisma.employee.findUnique({ where: { phone } });
    if (existingEmployee) {
      return NextResponse.json({ message: '❌ Error: El empleado ya existe.' }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({ where: { id: parsedUserId } });
    if (!userExists) {
      return NextResponse.json({ message: `❌ Error: No se encontró usuario con ID ${parsedUserId}.` }, { status: 400 });
    }

    const assignedDayOff = dayOff && typeof dayOff === 'string' && dayOff.trim() !== ''
      ? dayOff
      : getRandomDayOff();

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        phone,
        role,
        shift: shiftValue,
        dayOff: assignedDayOff,
        userId: parsedUserId,
      },
    });

    return NextResponse.json({ message: '✅ Empleado agregado.', employee: newEmployee }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error en POST /api/employees:', error);
    return NextResponse.json({ message: '🚨 Error general en el servidor.', error: error?.message || 'Desconocido' }, { status: 500 });
  }
};
