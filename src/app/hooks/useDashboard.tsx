import { useState, useEffect } from 'react';

type DashboardStat = {
  label: string;
  value: number;
};

type DashboardData = {
  stats: DashboardStat[];
  isLoading: boolean;
  error: string | null;
};

const useDashboard = (apiUrl: string): DashboardData => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController(); // Para cancelar la solicitud si el componente se desmonta

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        // Validar y actualizar los datos
        setStats(result.stats || []);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'An error occurred while fetching data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort(); // Cancelar la solicitud en caso de desmontaje
    };
  }, [apiUrl]);

  return { stats, isLoading, error };
};

export default useDashboard;
