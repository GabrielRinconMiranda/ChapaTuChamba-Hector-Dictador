// src/views/SavedJobsView.jsx

import React, { useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { Heart, ListChecks, Trash2, Clock, User, ArrowUpCircle } from 'lucide-react';

/**
 * Vista consolidada para Mis Actividades (Ofertas Guardadas y Postulaciones Activas).
 * * Implementa los casos de uso: 
 * - Eliminar postulación (dentro de la pestaña "Postulaciones")
 * - Actualizar postulación (dentro de la pestaña "Postulaciones")
 * - Eliminar de guardados (dentro de la pestaña "Guardados")
 */
export default function SavedJobsView({ 
    jobs, 
    savedIds, // IDs de los trabajos guardados
    onRemoveSaved, // Función para eliminar de guardados
    activeApplications, // Lista de objetos de postulación activa (NUEVO)
    onRemoveApplication, // Función para eliminar una postulación (NUEVO)
    onUpdateApplication // Función para actualizar el estado de postulación (NUEVO)
}) {
  const [activeTab, setActiveTab] = useState('saved');

  // 1. Filtrar trabajos guardados
  const savedJobs = jobs.filter(j => savedIds.includes(j.id));

  // 2. Enriquecer postulaciones activas con el objeto Job completo
  const applicationsWithJobData = activeApplications
    .map(app => ({
      ...app,
      job: jobs.find(j => j.id === app.jobId)
    }))
    .filter(app => app.job); // Asegura que solo se muestren postulaciones con trabajos existentes

  const handleUpdate = (appId, newStatus) => {
      onUpdateApplication(appId, newStatus);
  };
  
  // Componente auxiliar para los botones de las pestañas
  const TabButton = ({ name, icon: Icon, count, onClick, isActive }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center p-3 rounded-t-lg transition-colors border-b-2 ${
        isActive
          ? 'bg-gray-800 text-rose-500 border-rose-500 font-semibold'
          : 'text-gray-400 hover:text-white hover:bg-gray-800 border-gray-800'
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {name} ({count})
    </button>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-2">
        <User className="w-7 h-7 text-rose-600" /> Mis Actividades
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <TabButton 
          name="Guardados" 
          icon={Heart} 
          count={savedJobs.length} 
          onClick={() => setActiveTab('saved')} 
          isActive={activeTab === 'saved'}
        />
        <TabButton 
          name="Postulaciones" 
          icon={ListChecks} 
          count={applicationsWithJobData.length} 
          onClick={() => setActiveTab('applications')} 
          isActive={activeTab === 'applications'}
        />
      </div>

      {/* Contenido: Trabajos Guardados */}
      {activeTab === 'saved' && (
        <>
          {savedJobs.length === 0 ? (
            <EmptyState message="No tienes ofertas guardadas. Usa el corazón en el Dashboard para guardar." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {savedJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved={true}
                  onSave={onRemoveSaved} // Función para remover de guardados
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Contenido: Postulaciones Activas */}
      {activeTab === 'applications' && (
        <>
          {applicationsWithJobData.length === 0 ? (
            <EmptyState message="No has postulado a ninguna oferta. Aplica desde el Dashboard." />
          ) : (
            <div className="space-y-4 pt-4">
              {applicationsWithJobData.map(app => (
                <div key={app.id} className="bg-gray-900 p-5 rounded-lg border border-gray-800 shadow-md flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-rose-400 truncate">{app.job.title}</h3>
                    <p className="text-sm text-gray-400">{app.job.company} | Fuente: {app.job.source}</p>
                    <div className="mt-2 flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      Postulado el: {new Date(app.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Estatus y Acciones */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        app.status === 'Oferta' ? 'bg-green-600' : 
                        app.status === 'Rechazado' ? 'bg-red-600' : 
                        'bg-yellow-600'
                    } text-white`}>
                      {app.status}
                    </span>
                    
                    {/* Caso de Uso: Actualizar postulación */}
                    <select
                        onChange={(e) => handleUpdate(app.id, e.target.value)}
                        value={app.status}
                        className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded p-1.5 focus:border-rose-500 focus:ring-rose-500"
                    >
                        <option value="Pendiente">Actualizar Estado</option>
                        <option value="Entrevista">Entrevista</option>
                        <option value="Oferta">Oferta</option>
                        <option value="Rechazado">Rechazado</option>
                    </select>

                    {/* Caso de Uso: Eliminar postulación */}
                    <button
                      onClick={() => onRemoveApplication(app.id)}
                      className="text-red-500 hover:text-red-600 p-1 rounded transition-colors flex items-center text-sm mt-1"
                      title="Eliminar postulación"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Retirar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

