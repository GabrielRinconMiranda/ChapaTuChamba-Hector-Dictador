// src/views/UsersAdminView.jsx
import React, { useState } from 'react';

export default function UsersAdminView({ users, onCreate, onToggleSuspend, onToggleRole, onDelete }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 p-4 rounded border border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100 mb-3">Crear usuario</h2>
        <div className="flex gap-2">
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200" />
          <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200" />
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-gray-200">
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => { if (!form.name || !form.email) return alert('Complete'); onCreate(form); setForm({ name:'', email:'', role:'user' }); }} className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded">Crear</button>
        </div>
      </div>

      <div className="bg-gray-900 p-4 rounded border border-gray-800">
        <h3 className="text-lg font-semibold text-gray-100 mb-3">Usuarios</h3>
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
              <div>
                <div className="font-medium text-gray-100">{u.name} <span className="text-xs text-gray-400">({u.email})</span></div>
                <div className="text-xs text-gray-500">{u.role} {u.suspended ? ' • suspendido' : ''}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onToggleSuspend(u)} className="px-3 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-white">{u.suspended ? 'Reactivar' : 'Suspender'}</button>
                <button onClick={() => onToggleRole(u)} className="px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white">Toggle role</button>
                <button onClick={() => onDelete(u)} className="px-3 py-1 rounded bg-rose-800 hover:bg-rose-700 text-white">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
