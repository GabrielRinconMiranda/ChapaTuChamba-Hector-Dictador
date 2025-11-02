// src/components/JobList.jsx

import React from 'react';
import JobCard from './JobCard.jsx';
import EmptyState from './EmptyState.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

// Se añaden las props onApply y activeApplications
export default function JobList({ jobs, loading, onSave, savedJobs, onApply, activeApplications }) {
  if (loading) return <LoadingSpinner message="Cargando empleos..." />;
  if (!jobs || jobs.length === 0) return <EmptyState message="No se encontraron empleos disponibles." />;

  return (
    <div className="grid gap-4 mt-4">
      {jobs.map(job => {
        // Lógica para determinar si el trabajo ya fue postulado
        const isApplied = activeApplications.some(app => app.jobId === job.id);
        
        return (
          <JobCard
            key={job.id}
            job={job}
            onSave={onSave}
            saved={savedJobs.includes(job.id)}
            // PASAR LAS PROPIEDADES DE POSTULACIÓN
            onApply={onApply} 
            isApplied={isApplied}
            // No pasamos isSavedJobCard, asumiendo que este componente se usa solo en el Dashboard
          />
        );
      })}
    </div>
  );
}
