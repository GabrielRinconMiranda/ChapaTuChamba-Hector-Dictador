// src/components/JobCard.jsx
import React from 'react';
import { MapPin, Clock, ExternalLink, Heart } from 'lucide-react';

export default function JobCard({ job, onSave, saved }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">{job.title}</h3>
          <div className="text-sm text-gray-400 my-1">{job.company} • <span className="text-xs text-gray-500">{job.location}</span></div>
          <p className="text-sm text-gray-300 line-clamp-3 mt-2">{job.description ? job.description.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 220) : ''}...</p>
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-3">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.posted || ''}</span>
            <span className="text-rose-600 font-medium">{job.source}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <a href={job.url || '#'} target="_blank" rel="noreferrer" className="px-3 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> Ver
          </a>
          <button onClick={() => onSave(job.id)} className={`p-2 rounded ${saved ? 'bg-rose-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
