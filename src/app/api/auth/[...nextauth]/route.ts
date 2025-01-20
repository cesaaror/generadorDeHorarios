import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Buscar al usuario en la base de datos
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        // Retornar el usuario para incluirlo en el token
        return { id: user.id.toString(), email: user.email }; // Aseguramos que `id` sea un string
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'default-secret-key',
  pages: {
    signIn: '/auth/login', // Página de inicio de sesión
    error: '/auth/error',  // Página de error personalizada
  },
  callbacks: {
    async session({ session, token }) {
      // Agregamos `id` y `email` del token a la sesión del usuario
      if (token) {
        session.user = {
          id: token.sub as string, // token.sub contiene el ID del usuario
          email: token.email as string, // token.email contiene el correo del usuario
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      // Si el usuario está disponible (es decir, al hacer login), lo añadimos al token
      if (user) {
        token.sub = user.id; // token.sub se usa para el ID del usuario
        token.email = user.email; // token.email contiene el correo del usuario
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
