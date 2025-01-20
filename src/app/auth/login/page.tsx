'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

const LoginPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 text-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
          Welcome Back!
        </h1>
        <p className="text-base text-gray-600 text-center mb-6">
          Enter your credentials to access your personalized dashboard.
        </p>
        {error && (
          <p className="text-red-500 text-center font-semibold mb-6">
            {error === 'CredentialsSignin'
              ? 'Invalid email or password'
              : 'An unexpected error occurred. Please try again.'}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
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
            className="w-full bg-indigo-600 text-white font-semibold text-lg px-4 py-2 rounded-md shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/auth/register"
            className="text-indigo-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

const LoginPageWithSuspense = () => (
  <Suspense fallback={<div className="text-center text-gray-100">Loading...</div>}>
    <LoginPage />
  </Suspense>
);

export default LoginPageWithSuspense;
