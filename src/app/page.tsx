'use client'; // Este archivo es un Client Component

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-800 to-black text-white px-6">
      {/* Cabecera */}
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          Welcome to <span className="text-purple-400">My Next.js App</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto">
          Explore a cutting-edge, fully responsive web application built with modern technologies, 
          designed to provide an exceptional user experience.
        </p>
      </header>

      {/* Botón principal */}
      <div className="mb-12">
        <button
          onClick={handleGetStarted}
          className="bg-purple-500 text-white px-8 py-4 rounded-lg shadow-lg hover:scale-105 hover:bg-purple-600 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300"
          aria-label="Navigate to Login Page"
        >
          Get Started
        </button>
      </div>

      {/* Información sobre la aplicación */}
      <section className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-100 max-w-3xl">
        <h2 className="text-3xl font-bold mb-4">About This Application</h2>
        <p className="mb-4">
          This web application is a modern, scalable platform built with <strong>Next.js</strong>, leveraging the power of 
          <strong>React</strong> and <strong>TypeScript</strong> for a seamless developer experience. Below are the key 
          features and architectural highlights:
        </p>

        <ul className="list-disc list-inside mb-4">
          <li><strong>Authentication:</strong> Secure login system using <em>NextAuth.js</em> with credential-based authentication.</li>
          <li><strong>Dashboard:</strong> Interactive and visually appealing dashboard with dynamic charts, metrics, and tables.</li>
          <li><strong>Theme Support:</strong> Built-in theme system with light and dark modes, powered by a custom ThemeContext.</li>
          <li><strong>Data Management:</strong> Efficient handling of large datasets with server-side pagination and filters.</li>
          <li><strong>Testing:</strong> Comprehensive unit testing with <em>Jest</em> and end-to-end testing with <em>Cypress</em>.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">Technical Architecture</h3>
        <p className="mb-4">
          The application is organized with a modular and scalable architecture to ensure maintainability and performance:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Frontend:</strong> Next.js pages and components with client-server data fetching strategies.</li>
          <li><strong>Backend:</strong> RESTful API endpoints powered by Next.js API routes.</li>
          <li><strong>Database:</strong> Prisma ORM integrated with a relational database for user authentication and data storage.</li>
          <li><strong>Charts and Metrics:</strong> Powered by Chart.js for visualizing key metrics and trends dynamically.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-2">About the Developer</h3>
        <p className="mb-4">
          This application was developed by <strong>César Rentería</strong>, a passionate full-stack developer dedicated 
          to delivering high-quality, user-friendly, and scalable web applications. César specializes in modern 
          technologies such as React, Next.js, and TypeScript, with a focus on performance optimization and best practices.
        </p>

        <p className="italic text-sm text-gray-400 text-center">
          “Building the future of web applications, one line of code at a time.” — César Rentería
        </p>
      </section>
    </main>
  );
}
