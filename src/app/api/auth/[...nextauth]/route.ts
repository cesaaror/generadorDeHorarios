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

        // ✅ Retornar el usuario asegurando que incluya `name`
        return { 
          id: user.id.toString(), 
          email: user.email, 
          name: user.name || 'Usuario Desconocido' // 🔥 Asegurar que `name` esté presente
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'default-secret-key',
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      // ✅ Agregar `name` a la sesión
      if (token) {
        session.user = {
          id: token.sub as string,
          email: token.email as string,
          name: token.name as string, // 🔥 Incluir `name` en la sesión
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      // ✅ Incluir `name` en el token
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name; // 🔥 Guardamos `name` en el token
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
