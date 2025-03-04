'use client';

import React, { useState } from 'react';
import { Schedule } from '../types'; // ✅ Asegura que el tipo de Schedule está bien importado
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EditScheduleModalProps {
  schedule: Schedule;
  onClose: () => void;
  setSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ schedule, onClose, setSchedules }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(schedule.date));
  const [selectedShift, setSelectedShift] = useState<'MAÑANA' | 'TARDE'>(schedule.shift);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // ✅ Función para actualizar el horario
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/schedules/update', { // ✅ Usa la nueva ruta
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: schedule.id, // ✅ Ahora se pasa el ID en el body
          date: selectedDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
          shift: selectedShift,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al actualizar el horario');

      // 🔄 Actualiza el estado global con el nuevo horario
      setSchedules((prev) =>
        prev.map((s) => 
          s.id === schedule.id 
            ? { ...s, date: selectedDate.toISOString().split('T')[0], shift: selectedShift } 
            : s
        )
      );

      setMessage('✅ Horario actualizado con éxito.');
      setTimeout(() => {
        setMessage('');
        onClose(); // Cierra el modal tras éxito
      }, 1500);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">✏️ Editar Horario</h2>

        {/* 📅 Selección de Fecha */}
        <label className="block mb-2 text-gray-700 dark:text-gray-300">Seleccionar Fecha:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => date && setSelectedDate(date)}

          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />

        {/* ⏰ Selección de Turno */}
        <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Seleccionar Turno:</label>
        <select
          value={selectedShift}
          onChange={(e) => setSelectedShift(e.target.value as 'MAÑANA' | 'TARDE')}
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="MAÑANA">Mañana</option>
          <option value="TARDE">Tarde</option>
        </select>

        {/* Mensaje de estado */}
        {message && <p className={`mt-3 text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveChanges}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditScheduleModal;
