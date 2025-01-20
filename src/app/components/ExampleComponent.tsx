'use client'; // Indica que este es un Client Component

import { useEffect, useState } from 'react';

export default function ExampleComponent() {
  // Estado para almacenar datos generados en el cliente
  const [clientOnlyData, setClientOnlyData] = useState<string | null>(null);

  useEffect(() => {
    // Este código solo se ejecutará en el cliente
    const now = new Date().toISOString();
    setClientOnlyData(`Client Rendered at: ${now}`);
  }, []); // Ejecutar solo una vez cuando el componente se monta

  return (
    <div className="p-4 border rounded-lg bg-gray-800 text-white shadow-md">
      <p className="mb-2">Server-rendered content:</p>
      <p className="font-bold text-blue-400">Hello, this is static content!</p>
      {/* Renderizar clientOnlyData si está disponible */}
      {clientOnlyData && (
        <p className="mt-4 text-green-400">
          <span className="font-semibold">Dynamic Content:</span> {clientOnlyData}
        </p>
      )}
    </div>
  );
}
