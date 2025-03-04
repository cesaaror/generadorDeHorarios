'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useEffect } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [loading, setLoading] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setClientReady(true); // Previene errores de hidratación
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Error en la autenticación: Verifica tus credenciales.');
    } else {
      router.push('/dashboard');
    }
  };

  if (!clientReady) return null; // Evita error de hidratación

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 text-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
          ¡Bienvenido de nuevo!
        </h1>
        <p className="text-base text-gray-600 text-center mb-6">
          Ingresa tus credenciales para acceder al panel de empleados.
        </p>

        {error && (
          <p className="text-red-500 text-center font-semibold mb-4">
            {error}
          </p>
        )}

        {errorParam && (
          <p className="text-red-500 text-center font-semibold mb-4">
            Error de sesión: Verifica tu usuario y contraseña.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="tuemail@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="********"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold text-lg px-4 py-2 rounded-md shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-3 border-white border-4 rounded-full" viewBox="0 0 24 24"></svg>
            ) : null}
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <a href="/auth/register" className="text-indigo-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

// Suspense para evitar problemas en SSR
const LoginPageWithSuspense = () => (
  <Suspense fallback={<div className="text-center text-gray-100">Cargando...</div>}>
    <LoginPage />
  </Suspense>
);

export default LoginPageWithSuspense;
