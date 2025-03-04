import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Employee {
  id: number;
  name: string;
  phone: string;
  role: string;
  dayOff?: string;
}

interface Schedule {
  id: number;
  employeeId: number;
  date: string;
  shift: 'MAÑANA' | 'TARDE';
}

interface CalendarSchedulerProps {
  employees: Employee[];
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

const CalendarScheduler: React.FC<CalendarSchedulerProps> = ({ employees, setSchedules }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedShift, setSelectedShift] = useState('MAÑANA');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEmployee) {
      alert('Selecciona un empleado');
      return;
    }

    const response = await fetch('/api/schedules', {
      method: 'POST',
      body: JSON.stringify({
        employeeId: selectedEmployee,
        date: selectedDate,
        shift: selectedShift,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const newSchedule = await response.json();
      setSchedules((prev) => [...prev, newSchedule.schedule]);
      alert('Horario asignado correctamente');
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Asignar Horario</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Seleccionar Fecha:</label>
        <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date!)} className="border px-2 py-1 w-full mb-2" />

        <label className="block mb-2">Seleccionar Empleado:</label>
        <select onChange={(e) => setSelectedEmployee(e.target.value)} className="border px-2 py-1 w-full mb-2">
          <option value="">Seleccione...</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} ({emp.role})
            </option>
          ))}
        </select>

        <label className="block mb-2">Seleccionar Turno:</label>
        <select onChange={(e) => setSelectedShift(e.target.value)} className="border px-2 py-1 w-full mb-2">
          <option value="MAÑANA">Mañana</option>
          <option value="TARDE">Tarde</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
          Asignar Horario
        </button>
      </form>
    </div>
  );
};

export default CalendarScheduler;
