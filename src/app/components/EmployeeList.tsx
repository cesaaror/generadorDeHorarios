import React from 'react';

interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string;
  dayOff?: string;
}

interface EmployeeListProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>; // ✅ Asegurar el tipo correcto
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, setEmployees }) => {
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este empleado?')) return;

    try {
      const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('No se pudo eliminar el empleado');

      setEmployees((prev) => prev.filter(emp => emp.id !== id)); // ✅ Actualizar correctamente el estado
    } catch (error) {
      console.error('❌ Error eliminando empleado:', error);
    }
  };

  return (
    <div className="mt-6">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <li key={emp.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold">{emp.name} ({emp.role})</h3>
            <p className="text-sm text-gray-600">📞 {emp.phone}</p>
            <p className="text-sm text-gray-600">📅 Día libre: {emp.dayOff || 'No asignado'}</p>
            <button
              onClick={() => handleDelete(emp.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
