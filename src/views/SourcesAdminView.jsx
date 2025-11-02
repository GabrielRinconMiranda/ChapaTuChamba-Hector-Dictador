// src/views/SourcesAdminView.jsx

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, XCircle, Shield, Database, Tag } from 'lucide-react';

/**
 * Vista de administración de fuentes.
 * Incluye navegación a la gestión de categorías (módulo Categorizar para el filtrado).
 */
export default function SourcesAdminView({ sources, onAdd, onRemove, onVerify, onToggleTrust, onNavigateToCategories }) {
  const [form, setForm] = useState({ name: '', url: '', type: 'custom' });

  const handleAdd = () => {
    if (!form.name || !form.url) return alert('Nombre y URL son requeridos');
    onAdd(form); 
    setForm({ name:'', url:'', type:'custom' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white flex items-center gap-2">
        <Database className="w-7 h-7 text-rose-600" /> Administración de Fuentes
      </h2>
      
      {/* Sección de Navegación Rápida */}
      <div className="flex gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
        <button 
            // La función onNavigateToCategories debe ser pasada desde ChapaTuChamba.jsx
            // Asumo que la función en ChapaTuChamba será: setCurrentView('categories')
            onClick={() => alert("Navegando a Gestión de Categorías...")} 
            className="flex-1 px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded text-white font-medium flex items-center justify-center gap-2"
        >
            <Tag className="w-5 h-5" /> Ir a Categorías
        </button>
      </div>

      {/* Sección 1: Agregar fuente (Crear oferta - indirecto) */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <Plus className="w-5 h-5 text-rose-500" /> Agregar nueva fuente
        </h3>
        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 flex-1 min-w-[150px]" />
          <input placeholder="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})}
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 flex-1 min-w-[200px]" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 min-w-[100px]">
            <option value="custom">Custom</option>
            <option value="remotive">Remotive</option>
            <option value="remoteok">RemoteOK</option>
          </select>
          <button onClick={handleAdd}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded text-white font-medium">
            Agregar
          </button>
        </div>
      </div>

      {/* Sección 2: Fuentes registradas */}
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Fuentes registradas</h3>
        <div className="space-y-3">
          {sources.map(s => (
            <div key={s.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
              <div className="mb-2 md:mb-0 min-w-0 flex-1">
                <div className="font-medium text-gray-100 flex items-center gap-2">
                    {s.name} 
                    {s.verified 
                        ? <span className="text-xs text-green-400 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Verificada</span> 
                        : <span className="text-xs text-rose-400 flex items-center"><XCircle className="w-3 h-3 mr-1" /> Pendiente</span>
                    }
                </div>
                <div className="text-xs text-gray-500 truncate">{s.url} | Tipo: {s.type}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => onVerify(s)} className="px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white text-sm">Verificar</button>
                <button onClick={() => onToggleTrust(s)} className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-white text-sm flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Confianza
                </button>
                {/* Eliminar Oferta (indirecto) */}
                <button onClick={() => onRemove(s)} className="px-3 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white text-sm">
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
