// src/views/RecoverPasswordView.jsx

import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

/**
 * Vista para el caso de uso EXTEND 'Recuperar contraseña'.
 *
 * @param {string} initialEmail Email pre-cargado desde el login.
 * @param {function} onRecover Función que llama a la lógica de recuperación.
 * @param {function} onCancel Función para volver al login.
 */
export default function RecoverPasswordView({ initialEmail, onRecover, onCancel }) {
  const [email, setEmail] = useState(initialEmail);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-100 mb-2 flex items-center gap-2">
            <Mail className="w-6 h-6 text-rose-500" /> Recuperar Contraseña
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            Ingresa tu email para recibir instrucciones y restablecer tu clave.
          </p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@ejemplo.com"
            type="email"
            className="w-full px-3 py-2 mb-3 rounded bg-gray-800 border border-gray-700 text-gray-200"
          />
          <button
            onClick={() => onRecover(email)}
            className="w-full px-4 py-2 mb-2 bg-rose-700 hover:bg-rose-600 rounded text-white font-medium"
          >
            Enviar Instrucciones
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-400 hover:text-white flex items-center justify-center gap-1 mt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Iniciar Sesión
          </button>
        </div>
      </div>
  );
}