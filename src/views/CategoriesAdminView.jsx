// src/views/CategoriesAdminView.jsx

import React, { useState } from 'react';
import { Tag, Plus, Trash2, ListChecks } from 'lucide-react';

/**
 * Vista de administración de categorías.
 * Implementa el caso de uso: Categorizar para el filtrado (en el lado del Administrador).
 */
export default function CategoriesAdminView({ categories, onAdd, onRemove }) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAdd = () => {
    const name = newCategoryName.trim();
    if (name) {
      onAdd(name);
      setNewCategoryName('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-2">
        <Tag className="w-7 h-7 text-rose-600" /> Administración de Categorías
      </h2>
      <p className="text-gray-400">
        Gestiona las categorías que los usuarios pueden usar para filtrar las ofertas de empleo en el Dashboard.
      </p>

      {/* Sección 1: Agregar Categoría */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-rose-500" /> Añadir Nueva Categoría
        </h3>
        <div className="flex gap-3">
          <input 
            placeholder="Ej: Data Science, QA Automation" 
            value={newCategoryName} 
            onChange={e => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
            }}
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 flex-1" />
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded text-white font-medium">
            Agregar
          </button>
        </div>
      </div>

      {/* Sección 2: Categorías Actuales */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-gray-400" /> Categorías Activas ({categories.length})
        </h3>
        
        {categories.length === 0 ? (
            <p className="text-gray-500">No hay categorías registradas. ¡Agrega algunas!</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map(name => (
                <div key={name} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
                <span className="font-medium text-gray-100">{name}</span>
                <button 
                    onClick={() => onRemove(name)} 
                    className="p-1 rounded bg-rose-800 hover:bg-rose-700 text-white text-sm"
                    title={`Eliminar categoría ${name}`}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}