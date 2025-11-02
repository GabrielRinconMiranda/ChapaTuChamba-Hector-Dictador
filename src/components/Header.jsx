// src/components/Header.jsx
import React from 'react';
import { Briefcase, Bell, User, LogOut, Home, Heart, Database, Users, Tag, ListChecks } from 'lucide-react';

/**
 * Encabezado de la aplicación con navegación condicional.
 * Incluye enlaces para la administración de Categorías, Fuentes y Usuarios (solo Admin).
 */
export default function Header({ user, onLogout, onToggleNotifications, unreadCount, onNavigate, activeView }) {
  const isAdmin = user?.role === 'admin';

  // Opciones de navegación comunes y de usuario
  const userNavigation = [
    { name: 'Inicio', view: 'dashboard', icon: Home, adminOnly: false },
    { name: 'Actividades', view: 'saved', icon: ListChecks, adminOnly: false, subText: '(Guardados y Postulaciones)' },
    { name: 'Perfil', view: 'profile', icon: User, adminOnly: false },
  ];

  // Opciones de navegación de administración
  const adminNavigation = [
    { name: 'Fuentes', view: 'sources', icon: Database, adminOnly: true },
    { name: 'Categorías', view: 'categories', icon: Tag, adminOnly: true },
    { name: 'Usuarios', view: 'users', icon: Users, adminOnly: true },
  ];

  const filteredNavigation = isAdmin 
    ? [...userNavigation, ...adminNavigation]
    : userNavigation;

  return (
    <header className="bg-gray-900 text-gray-100 shadow-sm sticky top-0 z-40 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">

        {/* --- Logo y título --- */}
        <div className="flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-rose-700" />
          <div>
            <h1 className="text-lg font-semibold">ChapaTuChamba Pro</h1>
            <p className="text-xs text-gray-400">Panel de {isAdmin ? 'administración y gestión' : 'búsqueda de empleo'}</p>
          </div>
        </div>

        {/* --- Menú de navegación --- */}
        <nav className="flex items-center flex-wrap gap-4 text-sm font-medium">
          {filteredNavigation.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex items-center gap-1 px-2 py-1 rounded hover:text-rose-500 transition-colors ${
                activeView === item.view ? 'text-rose-600 font-semibold bg-gray-800' : 'text-gray-300'
              }`}
            >
              <item.icon className="w-4 h-4" /> 
              {item.name}
            </button>
          ))}
        </nav>

        {/* --- Panel derecho: notificaciones y usuario --- */}
        <div className="flex items-center gap-4">
          <button onClick={onToggleNotifications} className="relative p-2 rounded hover:bg-gray-800 transition-colors" title="Notificaciones">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-600 border border-gray-900" />
            )}
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-800">
            <User className="w-5 h-5 text-gray-300" />
            <div className="text-left">
              <div className="text-sm">{user?.name || 'Invitado'}</div>
              <div className="text-xs text-gray-500">{user?.role || 'user'}</div>
            </div>
            <button onClick={onLogout} className="ml-3 p-2 rounded hover:bg-gray-700 transition-colors" title="Cerrar sesión">
              <LogOut className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}