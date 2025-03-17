import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Role, Shift } from '@/app/types/roles';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // 🔥 Importación correcta de authOptions
import { z } from 'zod'; // 📌 Importamos `zod` para validar datos

const prisma = new PrismaClient();

/**
 * 🎲 **Función para generar un día libre aleatorio**
 */
const getRandomDayOff = () => {
  const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  return diasSemana[Math.floor(Math.random() * diasSemana.length)];
};

/**
 * 📌 **Validación del cuerpo del request usando Zod**
 */
const EmployeeSchema = z.object({
  name: z.string().min(2, 'El nombre es muy corto'),
  phone: z.string().min(8, 'Teléfono inválido'),
  role: z.nativeEnum(Role),
  shift: z.nativeEnum(Shift).default(Shift.MAÑANA),
  dayOff: z.string().optional(),
});

/**
 * 🚀 **Obtener la lista de empleados SOLO del usuario autenticado**
 */
export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: '❌ No autorizado' }, { status: 401 });
    }

    // 📌 Buscar solo los empleados del usuario autenticado
    const employees = await prisma.employee.findMany({
      where: { user: { email: session.user.email } }, // ✅ Solo empleados del usuario autenticado
    });

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
 * 🚀 **Agregar un nuevo empleado SOLO para el usuario autenticado**
 */
export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: '❌ No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = EmployeeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ message: '❌ Datos inválidos.', errors: validationResult.error.format() }, { status: 400 });
    }

    const { name, phone, role, shift, dayOff } = validationResult.data;

    // 📌 Buscar el usuario autenticado
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: '❌ Usuario no encontrado' }, { status: 404 });
    }

    // 📌 Verificar si el empleado ya existe por teléfono
    const existingEmployee = await prisma.employee.findUnique({ where: { phone } });
    if (existingEmployee) {
      return NextResponse.json({ message: '❌ El empleado ya existe con este teléfono.' }, { status: 400 });
    }

    // 📌 Asignar día libre aleatorio si no se proporciona
    const assignedDayOff = dayOff && dayOff.trim() !== '' ? dayOff : getRandomDayOff();

    // 📌 Crear el nuevo empleado vinculado al usuario autenticado
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        phone,
        role,
        shift,
        dayOff: assignedDayOff,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: '✅ Empleado agregado.', employee: newEmployee }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error en POST /api/employees:', error);
    return NextResponse.json({ message: '🚨 Error general en el servidor.', error: error?.message || 'Desconocido' }, { status: 500 });
  }
};
