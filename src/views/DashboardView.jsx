// src/views/DashboardView.jsx
import React, { useState } from "react";
import JobCard from "../components/JobCard.jsx";
import DashboardMenu from "../components/DashboardMenu.jsx";
import ProfileView from "./ProfileView.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function DashboardView({
  jobs,
  onSave,
  savedJobs,
  searchTerm,
  setSearchTerm,
}) {
  const [section, setSection] = useState("explore");
  const [user, setUser] = useState({
    name: "Administrador Demo",
    email: "admin@demo.com",
    phone: "999 999 999",
    location: "Lima, Perú",
    servicePrefs: {
      emailNotifications: true,
      jobAlerts: true,
      newsletter: false,
    },
  });

  // Simula actualización de perfil
  const handleUpdate = (data) => {
    setUser(data);
    console.log("Perfil actualizado:", data);
  };

  // Simula eliminación de perfil
  const handleDelete = () => {
    alert("Perfil eliminado permanentemente 🗑️");
    setUser(null);
  };

  // Filtrar empleos (el estado jobs viene desde ChapaTuChamba)
  const filtered = jobs.filter((j) => {
    const q = searchTerm.trim().toLowerCase();
    return (
      !q ||
      (j.title || "").toLowerCase().includes(q) ||
      (j.company || "").toLowerCase().includes(q) ||
      (j.source || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Menú lateral */}
      <aside className="lg:col-span-1">
        <DashboardMenu currentSection={section} setSection={setSection} />
      </aside>

      {/* Contenido dinámico */}
      <section className="lg:col-span-3 space-y-4">
        {/* EXPLORAR */}
        {section === "explore" && (
          <>
            <SearchBar
              query={searchTerm}
              onChange={setSearchTerm}
              onSubmit={(e) => e.preventDefault()}
            />

            {filtered.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-10">
                No se encontraron resultados
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={onSave}
                    saved={savedJobs.includes(job.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* RECOMENDADOS */}
        {section === "recommended" && (
          <div className="bg-gray-900 p-6 rounded border border-gray-800">
            <h3 className="text-lg font-semibold mb-3">Empleos recomendados</h3>
            <p className="text-gray-400 text-sm">
              Esta sección mostrará empleos recomendados según tus habilidades
              y preferencias.
            </p>
          </div>
        )}

        {/* ESTADÍSTICAS */}
        {section === "stats" && (
          <div className="bg-gray-900 p-6 rounded border border-gray-800">
            <h3 className="text-lg font-semibold mb-3">Estadísticas</h3>
            <p className="text-gray-400 text-sm">
              Aquí se mostrarán métricas como empleos vistos, guardados y
              fuentes más activas.
            </p>
          </div>
        )}

        {/* FUENTES */}
        {section === "sources" && (
          <div className="bg-gray-900 p-6 rounded border border-gray-800">
            <h3 className="text-lg font-semibold mb-3">Fuentes activas</h3>
            <p className="text-sm text-gray-500">
              Para ver y verificar fuentes, usa el panel de administración.
            </p>
          </div>
        )}

        {/* PERFIL */}
        {section === "profile" && (
          <ProfileView
            user={user}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </section>
    </div>
  );
}
