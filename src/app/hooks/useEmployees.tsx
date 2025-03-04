import { useEffect, useState } from 'react';

interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string;
  dayOff?: string;
}

interface UseEmployees {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  isLoading: boolean;
  error: string | null;
}

const useEmployees = (): UseEmployees => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener empleados
  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);

      const result = await response.json();
      setEmployees(result.employees || []);
    } catch (err: any) {
      console.error('Error al obtener empleados:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecutar fetchEmployees cuando el componente se monta
  useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, setEmployees, isLoading, error };
};

export default useEmployees;
