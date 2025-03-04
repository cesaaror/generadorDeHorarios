import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      id: string;
      email: string;
    };
  }

  interface User {
    id: string;
    email: string;
  }
}
