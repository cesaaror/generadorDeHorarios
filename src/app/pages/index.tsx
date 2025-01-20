import { useRouter } from 'next/router';
import Head from 'next/head';

// Componente de encabezado
const Header = () => (
  <header className="text-center mb-12">
    <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
      Welcome to <span className="text-blue-500">My Next.js App</span>
    </h1>
    <p className="text-lg text-gray-300 max-w-xl mx-auto">
      Discover a seamless, modern web experience built with cutting-edge technology and design.
    </p>
  </header>
);

// Componente de botón reutilizable
const Button = ({
  onClick,
  children,
  className = '',
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={`bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg hover:scale-105 hover:bg-blue-600 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 ${className}`}
    aria-label="Navigate to Login Page"
  >
    {children}
  </button>
);

// Componente principal
export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/login'); // Redirige a la página de inicio de sesión
  };

  return (
    <>
      <Head>
        <title>Welcome to My Next.js App</title>
        <meta name="description" content="Experience modern web design and development with Next.js." />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
        <Header />
        <div>
          <Button onClick={handleGetStarted} className="animate-pulse">
            Get Started
          </Button>
        </div>
        <footer className="mt-16 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} My Next.js App. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
