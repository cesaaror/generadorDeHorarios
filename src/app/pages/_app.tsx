// src/pages/_app.tsx
import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: any) => {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
