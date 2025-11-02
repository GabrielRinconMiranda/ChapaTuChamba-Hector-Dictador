// src/views/DashboardView.jsx

import React, { useState } from "react";
import { Zap, Tag, Heart } from "lucide-react";
import JobCard from "../components/JobCard.jsx"; // <-- Aseguramos el import real
import SearchBar from "../components/SearchBar.jsx"; // <-- Aseguramos el import real

/**
 * Vista principal de exploración de ofertas.
 * Implementa:
 * - Filtro por categorías (sub-caso de uso de Categorizar para el filtrado)
 * - Postular a una oferta
 * - Búsqueda simple (pasada desde ChapaTuChamba)
 */
export default function DashboardView({
  jobs,
  onSave,
  savedJobs,
  searchTerm,
  setSearchTerm,
  onApply, 
  categories, 
  activeApplications, // <-- CRÍTICO: NUEVA PROP para la lógica de Postulación
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // --- Lógica de Filtrado (Categorizar para el filtrado) ---
  const finalFilteredJobs = jobs.filter((job) => {
    // Si no hay categoría seleccionada, pasa el filtro.
    if (!selectedCategory || selectedCategory === 'All') return true;

    // NOTA: Asumimos que los trabajos tienen una propiedad 'category'
    // La lógica de filtrado pasa si la categoría coincide con la seleccionada
    return (job.category || '').toLowerCase() === selectedCategory.toLowerCase();
  });

  // --- SE ELIMINA EL COMPONENTE AUXILIAR JobItem ---
  // Ahora usaremos el JobCard real

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Columna de Filtros (Categorizar para el filtrado) */}
      <aside className="lg:col-span-1 bg-gray-900 p-6 rounded-lg border border-gray-800 self-start sticky top-20">
        <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-rose-500" /> Filtro por Categoría
        </h3>
        <div className="space-y-2">
          {['All', ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
              className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                selectedCategory === category || (category === 'All' && selectedCategory === null)
                  ? 'bg-rose-700 text-white font-semibold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {category === 'All' ? 'Todas las Categorías' : category}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 border-t border-gray-800 pt-3">
            El filtrado avanzado también incluye tu feedback (guardados/postulaciones)
        </p>
      </aside>

      {/* Contenido principal de Empleos (Explorar) */}
      <section className="lg:col-span-3 space-y-4">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Zap className="w-7 h-7 text-rose-500" /> Explorar Ofertas
        </h2>

        {/* Agregamos el SearchBar real */}
        <SearchBar
          query={searchTerm}
          onChange={setSearchTerm}
          onSubmit={(e) => e.preventDefault()}
        />

        {finalFilteredJobs.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
            No se encontraron resultados para la búsqueda y filtros aplicados.
          </div>
        ) : (
          <div className="grid gap-4">
            {finalFilteredJobs.map((job) => {
                // <-- Lógica CRÍTICA: Calcular si ya postuló
                const isApplied = activeApplications.some(app => app.jobId === job.id);
                
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSave={onSave}
                    saved={savedJobs.includes(job.id)}
                    onApply={onApply} // Postular a una oferta
                    isApplied={isApplied} // <-- Pasar el estado al JobCard
                    // isSavedJobCard: por defecto es false, no se pasa
                  />
                )
            })}
          </div>
        )}
      </section>
    </div>
  );
}