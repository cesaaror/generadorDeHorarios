'use client';

import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useTheme } from '../context/ThemeContext';
import { useSession, signOut } from 'next-auth/react';
import { FaUserCog, FaPalette, FaLock, FaSignOutAlt, FaPaperPlane, FaStar } from 'react-icons/fa';
import * as emailjs from 'emailjs-com';
import Image from 'next/image';

export default function Configuracion() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [suggestion, setSuggestion] = useState('');
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return setMessage('⚠️ Escribe una sugerencia.');
    if (!rating) return setMessage('⚠️ Selecciona una puntuación.');

    setLoading(true);
    setMessage('');

    const templateParams = {
      from_name: name || session?.user?.name || 'Usuario Anónimo',
      message: suggestion,
      rating: rating, // Puntuación del usuario
      user_email: session?.user?.email,
    };

    try {
      await emailjs.send(
        'service_5qwbsem', // ID del servicio
        'template_xxxxxx', // ❗ Reemplaza con el ID de tu plantilla en EmailJS
        templateParams,
        'jKdPGSqMpbZMG6coQ' // Public Key de EmailJS
      );
      setMessage('✅ ¡Sugerencia enviada correctamente!');
      setSuggestion('');
      setRating(5);
      setName('');
    } catch (error) {
      console.error('❌ Error enviando sugerencia:', error);
      setMessage('❌ Error al enviar la sugerencia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6 text-center">⚙️ Configuración</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
          Personaliza las opciones de tu aplicación.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 📌 Cambio de Tema */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3">
              <FaPalette className="text-blue-500" /> Tema de la Aplicación
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Alterna entre el modo claro y oscuro según tu preferencia.</p>
            <button
              onClick={toggleTheme}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition-all"
            >
              {theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            </button>
          </div>

          {/* 📌 Información del Usuario */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white mb-3">
              <FaUserCog className="text-green-500" /> Información de la Cuenta
            </h2>
            {session ? (
              <>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Nombre:</strong> {session?.user?.name || 'No disponible'}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  <strong>Email:</strong> {session.user?.email || 'No disponible'}
                </p>
              </>
            ) : (
              <p className="text-gray-500 italic">Inicia sesión para ver tu información.</p>
            )}
          </div>
        </div>

        {/* 🔵 Sección Desarrollador */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 mt-8">
          <Image
            src="/images/cesar.jpg"
            alt="Cesar Renteria Ortiz"
            width={96}
            height={96}
            className="rounded-full shadow-lg border-2 border-gray-300 dark:border-gray-600"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">👨‍💻 Desarrollado por</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Aplicación creada por <strong>César Rentería Ortiz</strong>. Si tienes sugerencias, envíalas a través del formulario.
            </p>
          </div>
        </div>

        {/* 📩 Formulario de Sugerencias */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">📩 Enviar Sugerencia</h2>
          <form onSubmit={sendSuggestion}>
            <input
              type="text"
              placeholder="Tu Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-3 rounded border dark:bg-gray-700 dark:border-gray-600"
            />
            <textarea
              placeholder="Escribe tu sugerencia..."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="w-full mb-3 p-3 rounded border dark:bg-gray-700 dark:border-gray-600"
              rows={4}
            ></textarea>

            {/* ⭐ Selección de Puntuación */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Puntuación:</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <FaStar
                  key={num}
                  className={`cursor-pointer ${num <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={() => setRating(num)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="bg-indigo-500 text-white px-6 py-2 rounded shadow-lg hover:bg-indigo-600 transition"
              disabled={loading}
            >
              {loading ? 'Enviando...' : <><FaPaperPlane className="inline mr-2" /> Enviar Sugerencia</>}
            </button>
          </form>
          {message && <p className="mt-3 text-sm text-center">{message}</p>}
        </div>
      </div>
    </MainLayout>
  );
}
