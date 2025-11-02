// src/views/SourcesAdminView.jsx
import React, { useState } from 'react';

export default function SourcesAdminView({ sources, onAdd, onRemove, onVerify, onToggleTrust }) {
  const [form, setForm] = useState({ name: '', url: '', type: 'custom' });

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-4 rounded border border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100 mb-3">Agregar fuente</h2>
        <div className="flex gap-2">
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 flex-1" />
          <input placeholder="URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})}
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200 flex-1" />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200">
            <option value="custom">Custom</option>
            <option value="remotive">Remotive</option>
            <option value="remoteok">RemoteOK</option>
          </select>
          <button onClick={() => { if (!form.name || !form.url) return alert('Nombre y URL'); onAdd(form); setForm({ name:'', url:'', type:'custom' }); }}
            className="px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded text-white">Agregar</button>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded border border-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-3">Fuentes registradas</h3>
        <div className="space-y-3">
          {sources.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700">
              <div>
                <div className="font-medium text-gray-100">{s.name} {s.verified ? <span className="text-xs text-green-400 ml-2">✓</span> : <span className="text-xs text-rose-400 ml-2">!</span>}</div>
                <div className="text-xs text-gray-400">{s.url}</div>
                <div className="text-xs text-gray-500">Tipo: {s.type}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onVerify(s)} className="px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white">Verificar</button>
                <button onClick={() => onToggleTrust(s)} className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-white">Toggle confianza</button>
                <button onClick={() => onRemove(s)} className="px-3 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
