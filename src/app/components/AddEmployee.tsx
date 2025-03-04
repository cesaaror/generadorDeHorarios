'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string;
  dayOff?: string;
}

interface AddEmployeeProps {
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ setEmployees }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false); // ✅ Indicador de carga
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    phone: '',
    role: '',
    dayOff: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // ✅ Limpia los errores cuando el usuario escribe
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    if (!session || !session.user) {
      setError('❌ Debes iniciar sesión para agregar empleados.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        body: JSON.stringify({ ...formData, userId: session.user.id }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al agregar empleado');
      }

      const data = await response.json();
      setEmployees((prev: Employee[]) => [...prev, data.employee]);
      setMessage('✅ Empleado agregado exitosamente.');

      // ✅ Limpia el formulario
      setFormData({ name: '', phone: '', role: '', dayOff: '' });
    } catch (error: any) {
      setError(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg mx-auto space-y-4 transition-all"
    >
      {/* 📌 Mensajes de error o éxito */}
      {message && <p className="text-green-600 dark:text-green-400 text-center font-semibold">{message}</p>}
      {error && <p className="text-red-500 dark:text-red-400 text-center font-semibold">{error}</p>}

      {/* 🔹 Nombre del empleado */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold">Nombre</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 🔹 Teléfono del empleado */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold">Teléfono</label>
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 🔹 Rol del empleado */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold">Rol</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Seleccione un Rol</option>
          <option value="CAJERO">Cajero</option>
          <option value="REPONEDOR">Reponedor</option>
          <option value="CARNICERO">Carnicero</option>
          <option value="CHARCUTERO">Charcutero</option>
          <option value="PESCADERO">Pescadero</option>
          <option value="PANADERO">Panadero</option>
          <option value="ENCARGADO">Encargado</option>
        </select>
      </div>

      {/* 🔹 Día libre opcional */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold">Día libre (opcional)</label>
        <input
          type="text"
          name="dayOff"
          placeholder="Día libre"
          value={formData.dayOff}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 🔹 Botón de envío */}
      <button 
        type="submit" 
        className={`w-full py-2 rounded-lg text-white font-semibold transition-all ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        disabled={isLoading}
      >
        {isLoading ? 'Agregando...' : 'Agregar Empleado'}
      </button>
    </form>
  );
};

export default AddEmployee;
