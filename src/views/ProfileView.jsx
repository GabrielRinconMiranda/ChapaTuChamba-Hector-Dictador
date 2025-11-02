// src/views/ProfileView.jsx

import React, { useState } from "react";
import { User, Settings, Trash2, Save } from "lucide-react";

/**
 * Componente para la gestión del perfil.
 * Implementa los casos de uso:
 * - Actualizar información personal (Pestaña "Información personal")
 * - Actualizar preferencias del servicio (Pestaña "Preferencias del servicio")
 * - Eliminar perfil (Pestaña "Eliminar perfil")
 * * @param {object} profile El objeto de perfil completo con sub-estructuras personal y preferences.
 * @param {function} onUpdate Callback para actualizar el perfil completo.
 * @param {function} onDelete Callback para eliminar el perfil.
 */
export default function ProfileView({ profile, onUpdate, onDelete }) {
  const [section, setSection] = useState("info");

  // El estado ahora refleja la estructura anidada que se maneja en ChapaTuChamba.jsx
  const [formData, setFormData] = useState({
    personal: profile?.personal || {},
    preferences: profile?.preferences || { notifications: {}, filter: {} },
  });

  // Handler para campos de la sección 'personal'
  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  // Handler para campos de la sección 'preferences' (notificaciones o filtros)
  const handlePreferenceChange = (sectionKey, key) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [sectionKey]: {
          ...prev.preferences[sectionKey],
          [key]: !prev.preferences[sectionKey][key], // Alternar booleano
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // **Caso de uso: Actualizar perfil (Generalización)**
    // Se envía el objeto completo con la estructura correcta a ChapaTuChamba
    if (onUpdate) onUpdate(formData);
    alert("Perfil actualizado correctamente ✅");
  };

  const confirmDelete = () => {
    // **Caso de uso: Eliminar perfil**
    if (window.confirm("¿Seguro que deseas eliminar tu perfil? Esta acción no se puede deshacer.")) {
      onDelete?.();
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg border border-gray-800 max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <User className="w-6 h-6 text-rose-600" /> Configuración de perfil
      </h2>

      {/* Pestañas */}
      <div className="flex gap-3 mb-6">
        {/* Actualizar información personal */}
        <button
          className={`px-3 py-2 rounded ${
            section === "info" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setSection("info")}
        >
          Información personal
        </button>
        {/* Actualizar preferencias del servicio */}
        <button
          className={`px-3 py-2 rounded ${
            section === "prefs" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setSection("prefs")}
        >
          Preferencias del servicio
        </button>
        {/* Eliminar perfil */}
        <button
          className={`px-3 py-2 rounded ${
            section === "delete" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setSection("delete")}
        >
          Eliminar perfil
        </button>
      </div>

      {/* Sección: Información personal */}
      {section === "info" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre completo</label>
            <input
              type="text"
              value={formData.personal.name || ''}
              onChange={(e) => handlePersonalChange("name", e.target.value)}
              className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={formData.personal.email || ''}
              onChange={(e) => handlePersonalChange("email", e.target.value)}
              className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.personal.phone || ''}
                onChange={(e) => handlePersonalChange("phone", e.target.value)}
                className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Ubicación</label>
              <input
                type="text"
                value={formData.personal.location || ''}
                onChange={(e) => handlePersonalChange("location", e.target.value)}
                className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>
          
          {/* Nuevo campo para Skills (ejemplo de dato complejo) */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Habilidades (separadas por coma)</label>
            <input
                type="text"
                value={(formData.personal.skills || []).join(', ')}
                onChange={(e) => handlePersonalChange("skills", e.target.value.split(',').map(s => s.trim()))}
                placeholder="React, Node.js, AWS"
                className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Guardar información personal
          </button>
        </form>
      )}

      {/* Sección: Preferencias del servicio */}
      {section === "prefs" && (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-rose-500 pt-2">Notificaciones</h3>
            <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
              <span>Recibir notificaciones por correo</span>
              <input
                type="checkbox"
                checked={!!formData.preferences.notifications.email}
                onChange={() => handlePreferenceChange("notifications", "email")}
                className="accent-rose-600 w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
              <span>Recibir notificaciones por WhatsApp (simulado)</span>
              <input
                type="checkbox"
                checked={!!formData.preferences.notifications.whatsapp}
                onChange={() => handlePreferenceChange("notifications", "whatsapp")}
                className="accent-rose-600 w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
              <span>Habilitar filtrado de ofertas basado en tu historial (Feedback)</span>
              <input
                type="checkbox"
                checked={!!formData.preferences.filter.feedbackEnabled}
                onChange={() => handlePreferenceChange("filter", "feedbackEnabled")}
                className="accent-rose-600 w-4 h-4"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Guardar preferencias
            </button>
          </form>
        </div>
      )}

      {/* Sección: Eliminar perfil */}
      {section === "delete" && (
        <div className="bg-gray-800 p-5 rounded text-center">
          <Trash2 className="w-10 h-10 text-rose-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Eliminar perfil</h3>
          <p className="text-gray-400 mb-4">
            Esta acción eliminará permanentemente tu cuenta, historial y preferencias.
            No podrás recuperarlos.
          </p>
          <button
            onClick={confirmDelete}
            className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded font-medium"
          >
            Confirmar eliminación
          </button>
        </div>
      )}
    </div>
  );
}