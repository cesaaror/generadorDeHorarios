import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const users = [
            { id: '1', email: 'test@example.com', password: 'password123' },
            { id: '2', email: 'user@example.com', password: 'securepassword' },
          ];
      
          const user = users.find(
            (u) => u.email === credentials?.email && u.password === credentials?.password
          );
      
          if (!user) {
            throw new Error('Invalid email or password');
          }
      
          return user;
        } catch (error) {
          newFunction(error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'default-secret-key',
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});

function newFunction(error: unknown) {
  if (error instanceof Error) {
    console.error('Authorize error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}

