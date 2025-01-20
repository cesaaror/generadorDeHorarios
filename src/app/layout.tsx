import './styles/globals.css';
import { ReactNode } from 'react';
import ClientSessionProvider from './providers/ClientSessionProvider';
import { ThemeProvider } from './context/ThemeContext';

export const metadata = {
  title: 'My Next.js App',
  description: 'A modern app built with Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientSessionProvider>
          {/* ThemeProvider envuelve toda la aplicación */}
          <ThemeProvider>{children}</ThemeProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
