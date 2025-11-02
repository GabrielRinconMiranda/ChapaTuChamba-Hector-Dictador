import React from 'react';
import { Briefcase } from 'lucide-react';

export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <Briefcase className="w-10 h-10 mb-3 text-gray-500" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
