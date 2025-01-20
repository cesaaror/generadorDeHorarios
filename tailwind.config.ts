const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.purple[500], // Color principal
        secondary: colors.indigo[500], // Color secundario
        accent: colors.blue[400], // Color de énfasis
        background: {
          DEFAULT: colors.gray[900],
          light: colors.gray[100],
          dark: colors.gray[800],
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        '3xl': '0 8px 30px rgba(0, 0, 0, 0.3)', // Sombra intensa para botones o tarjetas
      },
    },
  },
  plugins: [],
};
