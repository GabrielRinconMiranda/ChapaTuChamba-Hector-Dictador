import React, { useState } from "react";
import { User, Settings, Trash2, Save } from "lucide-react";

export default function ProfileView({ user, onUpdate, onDelete }) {
  const [section, setSection] = useState("info");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    servicePrefs: user?.servicePrefs || {
      emailNotifications: true,
      jobAlerts: true,
      newsletter: false,
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrefChange = (key) => {
    setFormData((prev) => ({
      ...prev,
      servicePrefs: {
        ...prev.servicePrefs,
        [key]: !prev.servicePrefs[key],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate) onUpdate(formData);
    alert("Perfil actualizado correctamente ✅");
  };

  const confirmDelete = () => {
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
        <button
          className={`px-3 py-2 rounded ${
            section === "info" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setSection("info")}
        >
          Información personal
        </button>
        <button
          className={`px-3 py-2 rounded ${
            section === "prefs" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setSection("prefs")}
        >
          Preferencias del servicio
        </button>
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
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full bg-gray-800 rounded p-2 border border-gray-700 focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Guardar cambios
          </button>
        </form>
      )}

      {/* Sección: Preferencias */}
      {section === "prefs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
            <span>Recibir notificaciones por correo</span>
            <input
              type="checkbox"
              checked={formData.servicePrefs.emailNotifications}
              onChange={() => handlePrefChange("emailNotifications")}
              className="accent-rose-600 w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
            <span>Alertas de nuevos empleos</span>
            <input
              type="checkbox"
              checked={formData.servicePrefs.jobAlerts}
              onChange={() => handlePrefChange("jobAlerts")}
              className="accent-rose-600 w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between bg-gray-800 p-3 rounded">
            <span>Suscripción al boletín</span>
            <input
              type="checkbox"
              checked={formData.servicePrefs.newsletter}
              onChange={() => handlePrefChange("newsletter")}
              className="accent-rose-600 w-4 h-4"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Guardar preferencias
          </button>
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
