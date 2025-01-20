/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Habilita el modo estricto de React para verificar problemas
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL, // URL base para NextAuth
    DATABASE_URL: process.env.DATABASE_URL, // URL de la base de datos para Prisma
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET, // Llave secreta para NextAuth
  },
  images: {
    domains: ['your-image-domain.com'], // Permite cargar imágenes desde dominios específicos
  },
};

module.exports = nextConfig;
