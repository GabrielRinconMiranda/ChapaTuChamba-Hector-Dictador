import React from 'react';
import JobCard from '../components/JobCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function SavedJobsView({ jobs, savedJobs, onRemove }) {
  const saved = jobs.filter(j => savedJobs.includes(j.id));

  if (saved.length === 0)
    return <EmptyState message="No tienes ofertas guardadas." />;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {saved.map(job => (
        <JobCard
          key={job.id}
          job={job}
          saved={true}
          onSave={onRemove}
        />
      ))}
    </div>
  );
}

