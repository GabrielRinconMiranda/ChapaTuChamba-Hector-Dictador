// src/views/DashboardView.jsx

import React, { useState } from "react";
import { Zap, Tag, Heart } from "lucide-react";
// Se asume que JobCard y SearchBar existen o se sustituyen por la implementación interna
// import JobCard from "../components/JobCard.jsx"; 
// import SearchBar from "../components/SearchBar.jsx"; 
// Se eliminan imports redundantes: DashboardMenu, ProfileView

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
  onApply, // NUEVO: Función para Postular a una oferta
  categories, // NUEVO: Lista de categorías (desde ChapaTuChamba)
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

  // --- Componente Auxiliar (Simulación de JobCard) para asegurar la acción de postular ---
  const JobItem = ({ job, onSave, saved, onApply }) => (
    <div className="bg-gray-900 p-5 rounded-lg border border-gray-800 shadow-md">
      <h3 className="text-xl font-semibold text-rose-400 mb-2">{job.title}</h3>
      <p className="text-sm text-gray-400">{job.company} | Fuente: {job.source} {job.category && `| Categoría: ${job.category}`}</p>
      <p className="text-gray-300 mt-3 text-sm line-clamp-3">{job.description || 'No hay descripción disponible.'}</p>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => onSave(job.id)}
          className={`text-sm font-medium transition-colors flex items-center gap-1 ${saved ? 'text-rose-500' : 'text-gray-500 hover:text-rose-500'}`}
        >
           <Heart className={`w-5 h-5 ${saved ? 'fill-rose-500' : ''}`} /> {saved ? 'Guardado' : 'Guardar'}
        </button>
        {/* Caso de Uso: Postular a una oferta */}
        <button
          onClick={() => onApply(job.id)}
          className="bg-rose-600 hover:bg-rose-700 text-white text-sm px-4 py-2 rounded font-medium"
        >
          Postular ahora
        </button>
      </div>
    </div>
  );

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

        {/* SearchBar - Debes asegurar que este componente exista */}
        {/* <SearchBar
          query={searchTerm}
          onChange={setSearchTerm}
          onSubmit={(e) => e.preventDefault()}
        /> */}

        {finalFilteredJobs.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
            No se encontraron resultados para la búsqueda y filtros aplicados.
          </div>
        ) : (
          <div className="grid gap-4">
            {finalFilteredJobs.map((job) => (
              <JobItem
                key={job.id}
                job={job}
                onSave={onSave}
                saved={savedJobs.includes(job.id)}
                onApply={onApply} // Postular a una oferta
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}