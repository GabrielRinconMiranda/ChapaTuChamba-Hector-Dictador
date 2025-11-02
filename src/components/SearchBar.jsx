import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ query, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg border border-gray-700">
      <Search className="text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar empleo, empresa o ubicación..."
        className="flex-1 bg-transparent outline-none text-gray-100 placeholder-gray-500"
      />
      <button type="submit" className="bg-rose-700 hover:bg-rose-600 text-white px-4 py-2 rounded">
        Buscar
      </button>
    </form>
  );
}
