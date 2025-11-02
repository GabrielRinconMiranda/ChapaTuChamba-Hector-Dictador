// src/ChapaTuChamba.jsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import NotificationPanel from './components/NotificationPanel.jsx';
import DashboardView from './views/DashboardView.jsx';
import ProfileView from './views/ProfileView.jsx';
import SavedJobsView from './views/SavedJobsView.jsx';
import SearchBar from "./components/SearchBar.jsx";
import SourcesAdminView from './views/SourcesAdminView.jsx';
import UsersAdminView from './views/UsersAdminView.jsx';
import { getJobs, getSources } from './api/mockServer.js';


const STORAGE = {
  SOURCES: 'ctc_sources_v2',
  USERS: 'ctc_users_v2',
  JOBS_CACHE: 'ctc_jobs_cache_v1',
  SAVED: 'ctc_saved_jobs_v1',
  PROFILE: 'ctc_profile_v1',
};

const fallbackProfile = {
  name: 'Tu Nombre',
  email: '',
  phone: '',
  location: '',
  skills: [],
  experience: '',
  preferences: {
    notifications: { email: true, whatsapp: false, telegram: false },
  },
};

export default function ChapaTuChamba() {
  // --- Estados globales ---
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);  
  
  const [sources, setSources] = useState(() => {
    const raw = localStorage.getItem(STORAGE.SOURCES);
    return raw ? JSON.parse(raw) : [];
  });
  const [users, setUsers] = useState(() => {
    const raw = localStorage.getItem(STORAGE.USERS);
    return raw
      ? JSON.parse(raw)
      : [
          {
            id: 1,
            name: 'Admin Root',
            email: 'admin@empresa.com',
            role: 'admin',
            suspended: false,
          },
        ];
  });
  const [savedJobs, setSavedJobs] = useState(() => {
    const raw = localStorage.getItem(STORAGE.SAVED);
    return raw ? JSON.parse(raw) : [];
  });
  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem(STORAGE.PROFILE);
    return raw ? JSON.parse(raw) : fallbackProfile;
  });

  const [notifications, setNotifications] = useState([]);

// --- Jobs ---
  const [jobs, setJobs] = useState([]);

  // --- Login form ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- UI ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- Inicialización (Jobs o general creo) ---
  useEffect(() => {
    async function seed() {
      if (!sources || sources.length === 0) {
        const remoteSources = await getSources();
        const withMeta = remoteSources.map((s) => ({
          ...s,
          id: s.id || s.name,
          verified: !!s.verified,
          lastChecked: null,
        }));
        setSources(withMeta);
        localStorage.setItem(STORAGE.SOURCES, JSON.stringify(withMeta));
      }
      await refreshJobs();
    }
    seed();
  }, []);
  

// --- Refrescar jobs combinando reales y simulados ---
async function refreshJobs() {
  try {
    const fetched = await getJobs(); // trae reales + simuladas + cache
    setJobs(fetched);
    localStorage.setItem(STORAGE.JOBS_CACHE, JSON.stringify(fetched));
  } catch (e) {
    console.error("Error refrescando jobs:", e);
  }
} 

  // --- Persistencia ---
  useEffect(() => {
    localStorage.setItem(STORAGE.SOURCES, JSON.stringify(sources));
  }, [sources]);
  useEffect(() => {
    localStorage.setItem(STORAGE.USERS, JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(STORAGE.SAVED, JSON.stringify(savedJobs));
  }, [savedJobs]);
  useEffect(() => {
    localStorage.setItem(STORAGE.PROFILE, JSON.stringify(profile));
  }, [profile]);

  // --- Autenticación ---
  function handleLogin(email, pass) {
    if (!email || !pass) return alert('Email y contraseña requeridos');
    const found = users.find((u) => u.email === email);
    const isAdmin =
      email.includes('@admin') || (found && found.role === 'admin');
    const newUser = found || {
      id: Date.now(),
      name: email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : 'user',
      suspended: false,
    };
    if (!found) setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setLoginEmail('');
    setLoginPassword('');
    setCurrentView('dashboard');
    setNotifications([
      {
        id: 1,
        title: 'Bienvenido',
        message: 'Sesión iniciada correctamente',
        time: 'Ahora',
        unread: true,
      },
    ]);
  }

  function handleLogout() {
    setUser(null);
    setCurrentView('login');
  }

  // --- Fuentes (administrador) ---
  function addSource(src) {
    const item = {
      id: Date.now().toString(),
      name: src.name,
      url: src.url,
      type: src.type || 'custom',
      verified: false,
      lastChecked: null,
    };
    setSources((prev) => [item, ...prev]);
  }

  function removeSource(s) {
    if (!window.confirm('Eliminar fuente?')) return;
    setSources((prev) => prev.filter((x) => x.id !== s.id));
  }

// --- Verificar fuente individual ---
async function verifySource(s) {
  try {
    let result = [];
    if (['remotive', 'remoteok'].includes(s.type)) {
      result = await getJobs(); // traer reales + simuladas
    } else {
      const res = await fetch(s.url);
      const json = await res.json();
      if (Array.isArray(json)) result = json;
    }

    setSources((prev) =>
      prev.map((x) =>
        x.id === s.id
          ? { ...x, verified: true, lastChecked: new Date().toISOString() }
          : x
      )
    );

    // Actualizar jobs con los nuevos resultados sin duplicar
    setJobs((prevJobs) => {
      const combined = [...prevJobs];
      result.forEach(r => {
        if (!combined.find(j => j.id === r.id)) combined.push(r);
      });
      localStorage.setItem(STORAGE.JOBS_CACHE, JSON.stringify(combined));
      return combined;
    });

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: 'Fuente verificada',
        message: `${s.name} verificada`,
        time: 'Ahora',
        unread: true,
      },
      ...prev,
    ]);
  } catch (e) {
    alert('Error verificando: ' + e.message);
    setSources((prev) =>
      prev.map((x) =>
        x.id === s.id
          ? { ...x, verified: false, lastChecked: new Date().toISOString() }
          : x
      )
    );
  }
}


  function toggleTrust(s) {
    setSources((prev) =>
      prev.map((x) => (x.id === s.id ? { ...x, verified: !x.verified } : x))
    );
  }

  // --- Usuarios (admin) ---
  function createUser(data) {
    const u = { id: Date.now().toString(), ...data, suspended: false };
    setUsers((prev) => [...prev, u]);
  }

  function toggleSuspend(u) {
    setUsers((prev) =>
      prev.map((x) => (x.id === u.id ? { ...x, suspended: !x.suspended } : x))
    );
  }

  function toggleRole(u) {
    setUsers((prev) =>
      prev.map((x) =>
        x.id === u.id
          ? { ...x, role: x.role === 'admin' ? 'user' : 'admin' }
          : x
      )
    );
  }

  function deleteUser(u) {
    if (!window.confirm('Eliminar usuario permanentemente?')) return;
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
    if (user?.id === u.id) handleLogout();
  }

  // --- Empleos ---
  function saveJob(id) {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    ); 
  }

  function removeSaved(id) {
    setSavedJobs((prev) => prev.filter((x) => x !== id));
  }

  // --- Perfil ---
  function updateProfile(newProfile) {
    setProfile(newProfile);
  }

  // --- Filtro de búsqueda ---
  const visibleJobs = jobs.filter((j) => {
    const q = searchTerm.trim().toLowerCase();
    return (
      !q ||
      (j.title || '').toLowerCase().includes(q) ||
      (j.company || '').toLowerCase().includes(q) ||
      (j.source || '').toLowerCase().includes(q)
    );
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  // --- Vista login ---
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-100 mb-2">
            ChapaTuChamba
          </h1>
          <p className="text-sm text-gray-400 mb-4">
            Inicia sesión para administrar fuentes y ver ofertas
          </p>

          <input
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="email"
            className="w-full px-3 py-2 mb-3 rounded bg-gray-800 border border-gray-700 text-gray-200"
          />
          <input
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="contraseña"
            type="password"
            className="w-full px-3 py-2 mb-4 rounded bg-gray-800 border border-gray-700 text-gray-200"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleLogin(loginEmail, loginPassword)}
              className="flex-1 px-4 py-2 bg-rose-700 hover:bg-rose-600 rounded text-white"
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setLoginEmail('admin@empresa.com');
                setLoginPassword('admin');
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            >
              Demo admin
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Usa un correo con <code>@admin</code> o el modo demo.
          </p>
        </div>
      </div>
    );
  }

  // --- Vista principal ---
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative">
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleNotifications={() => {
          setNotificationsOpen(!notificationsOpen);
          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
        }}        
        unreadCount={unreadCount}
        onNavigate={setCurrentView}
        activeView={currentView}
      />

      {/* Panel de notificaciones */}
      {notificationsOpen && (
        <div className="absolute right-4 top-20 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
          <NotificationPanel notifications={notifications} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <DashboardView
            jobs={visibleJobs}
            onSave={saveJob}
            savedJobs={savedJobs}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {currentView === 'saved' && (
          <SavedJobsView
            savedIds={savedJobs}
            jobs={jobs}
            onRemove={removeSaved}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView profile={profile} onUpdate={updateProfile} />
        )}

        {currentView === 'sources' && user?.role === 'admin' && (
          <SourcesAdminView
            sources={sources}
            onAdd={addSource}
            onRemove={removeSource}
            onVerify={verifySource}
            onToggleTrust={toggleTrust}
          />
        )}

        {currentView === 'users' && user?.role === 'admin' && (
          <UsersAdminView
            users={users}
            onCreate={createUser}
            onToggleSuspend={toggleSuspend}
            onToggleRole={toggleRole}
            onDelete={deleteUser}
          />
        )}

        {(currentView === 'sources' || currentView === 'users') &&
          user?.role !== 'admin' && (
            <div className="bg-gray-900 p-6 rounded border border-gray-800 text-center">
              <div className="text-lg font-semibold">Acceso denegado</div>
              <div className="text-sm text-gray-400">
                Necesitas permisos de administrador para ver esta sección.
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
