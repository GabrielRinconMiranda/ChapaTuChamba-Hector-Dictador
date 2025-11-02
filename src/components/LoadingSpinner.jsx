import React from 'react';

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      <div className="w-8 h-8 border-4 border-gray-600 border-t-rose-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}
