import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // ✅ Importa useSession para obtener el usuario autenticado

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
  const { data: session } = useSession(); // ✅ Obtener la sesión del usuario autenticado
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Obtener empleados SOLO si el usuario está autenticado
  useEffect(() => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    const fetchEmployees = async () => {
      setIsLoading(true);
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

    fetchEmployees();
  }, [session?.user?.email]); // ✅ Usar session.user.email como dependencia

  return { employees, setEmployees, isLoading, error };
};

export default useEmployees;
