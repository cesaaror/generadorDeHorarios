import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Asegúrate de que coincida con la URL del servidor
    setupNodeEvents(on, config) {
      // Implementa eventos si es necesario
    },
  },
});
