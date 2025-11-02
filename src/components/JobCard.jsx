// src/components/JobCard.jsx

import React from 'react';
import { MapPin, Clock, ExternalLink, Heart, Send } from 'lucide-react';

// Se añaden las props onApply, isApplied y isSavedJobCard
export default function JobCard({ 
    job, 
    onSave, 
    saved, 
    onApply,          // NUEVO: Función para Postular a una oferta
    isApplied,        // NUEVO: Estado para saber si el usuario ya postuló
    isSavedJobCard = false // NUEVO: Indicador para diferenciar si está en la vista de Guardados
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">{job.title}</h3>
          <div className="text-sm text-gray-400 my-1">
            {job.company} • <span className="text-xs text-gray-500 ml-1">{job.location}</span>
          </div>
          <p className="text-sm text-gray-300 line-clamp-3 mt-2">
            {job.description ? job.description.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 220) : ''}...
          </p>
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-3">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted || ''}</span>
            <span className="text-rose-600 font-medium">{job.source}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 min-w-[100px]">
          {/* Lógica de Postulación (Solo en Dashboard) */}
          {!isSavedJobCard && (
            <button
              onClick={() => onApply(job.id)}
              disabled={isApplied}
              className={`px-3 py-2 rounded font-medium inline-flex items-center gap-2 text-sm w-full justify-center ${
                isApplied
                  ? 'bg-yellow-600 text-white cursor-not-allowed'
                  : 'bg-rose-700 hover:bg-rose-600 text-white'
              }`}
            >
              <Send className="w-4 h-4" /> 
              {isApplied ? 'Ya Postulaste' : 'Postular'}
            </button>
          )}

          {/* Botón de Ver (Visible si no hay botón de Postular, como en Guardados) o por defecto */}
          {(isSavedJobCard || !isApplied) && (
             <a href={job.url || '#'} target="_blank" rel="noreferrer" 
                className={`px-3 py-2 rounded inline-flex items-center gap-2 text-sm w-full justify-center ${isSavedJobCard ? 'bg-rose-700 hover:bg-rose-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-200'}`}
             >
                <ExternalLink className="w-4 h-4" /> Ver
            </a>
          )}
          
          {/* Botón de Guardar/Eliminar de Guardados */}
          <button 
            onClick={() => onSave(job.id)} 
            className={`p-2 rounded w-full transition-colors flex items-center justify-center ${
              saved ? 'bg-rose-700 text-white hover:bg-rose-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}