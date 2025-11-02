import React from 'react';
import JobCard from './JobCard.jsx';
import EmptyState from './EmptyState.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function JobList({ jobs, loading, onSave, savedJobs }) {
  if (loading) return <LoadingSpinner message="Cargando empleos..." />;
  if (!jobs || jobs.length === 0) return <EmptyState message="No se encontraron empleos disponibles." />;

  return (
    <div className="grid gap-4 mt-4">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onSave={onSave}
          saved={savedJobs.includes(job.id)}
        />
      ))}
    </div>
  );
}
