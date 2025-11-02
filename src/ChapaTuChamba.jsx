// src/ChapaTuChamba.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Header from './components/Header.jsx';
import NotificationPanel from './components/NotificationPanel.jsx';
import DashboardView from './views/DashboardView.jsx';
import ProfileView from './views/ProfileView.jsx';
import SavedJobsView from './views/SavedJobsView.jsx';
// No usamos SearchBar directamente, se usa dentro de DashboardView
// import SearchBar from "./components/SearchBar.jsx"; 
import SourcesAdminView from './views/SourcesAdminView.jsx';
import UsersAdminView from './views/UsersAdminView.jsx';
import RecoverPasswordView from './views/RecoverPasswordView.jsx'; // NUEVA VISTA
import CategoriesAdminView from './views/CategoriesAdminView.jsx'; // NUEVA VISTA
import { getJobs, getSources } from './api/mockServer.js';


const STORAGE = {
  SOURCES: 'ctc_sources_v2',
  USERS: 'ctc_users_v2',
  JOBS_CACHE: 'ctc_jobs_cache_v1',
  SAVED: 'ctc_saved_jobs_v1',
  PROFILE: 'ctc_profile_v1',
  APPLICATIONS: 'ctc_applications_v1', // NUEVO STORAGE
};

// Estructura de perfil actualizada para manejar las especializaciones de Actualizar Perfil
const fallbackProfile = {
  name: 'Tu Nombre',
  email: '',
  phone: '',
  location: '',
  skills: [],
  experience: '',
  // Especialización 1: Actualizar información personal
  personal: {
    name: 'Tu Nombre',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experience: '',
  },
  // Especialización 2: Actualizar preferencias del servicio
  preferences: {
    notifications: { email: true, whatsapp: false, telegram: false },
    filter: {
      feedbackEnabled: true, // NUEVO: Preferencia para el filtrado por feedback
    }
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
    // Aseguramos que la estructura de perfil tenga las nuevas sub-estructuras
    const initialProfile = raw ? JSON.parse(raw) : fallbackProfile;
    return { ...fallbackProfile, ...initialProfile, 
      personal: { ...fallbackProfile.personal, ...initialProfile.personal },
      preferences: { ...fallbackProfile.preferences, ...initialProfile.preferences }
    };
  });

  const [notifications, setNotifications] = useState([]);

// --- Jobs ---
  const [jobs, setJobs] = useState([]);

// --- Filter & Admin ---
  const [categories, setCategories] = useState(() => {
    const raw = localStorage.getItem('ctc_categories_v1');
    return raw ? JSON.parse(raw) : ['Desarrollo', 'Diseño', 'Marketing', 'Ventas'];
  });
// --- NUEVO: Estado para Postulaciones activas ---
  const [activeApplications, setActiveApplications] = useState(() => {
    const raw = localStorage.getItem(STORAGE.APPLICATIONS);
    return raw ? JSON.parse(raw) : [];
  });

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
  // Persistencia de Categorías y Postulaciones
  useEffect(() => {
    localStorage.setItem('ctc_categories_v1', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem(STORAGE.APPLICATIONS, JSON.stringify(activeApplications));
  }, [activeApplications]);

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

  // --- NUEVO: Lógica para Recuperar contraseña (Caso de Uso Extend) ---
  function handleRecoverPassword(email) {
    if (!email) return alert('Ingresa tu email para recuperar la contraseña.');
    alert(`Instrucciones enviadas a ${email}. ¡Revisa tu bandeja! (Simulación)`);
    setLoginEmail(email);
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
      // Simulación de fetch
      result = [{ id: Date.now() + Math.random(), title: `Job de ${s.name}`, company: s.name, source: s.name }]
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

  // --- NUEVO: Administración de Categorías (Caso de Uso: Categorizar para el filtrado) ---
  function addCategory(name) {
    if (name && !categories.includes(name)) {
      setCategories((prev) => [...prev, name]);
      setNotifications((prev) => [{ id: Date.now(), title: 'Categoría Añadida', message: `${name} agregada.`, time: 'Ahora', unread: true }, ...prev]);
    }
  }

  function removeCategory(name) {
    if (window.confirm(`Eliminar categoría ${name}?`)) {
      setCategories((prev) => prev.filter((c) => c !== name));
      setNotifications((prev) => [{ id: Date.now(), title: 'Categoría Eliminada', message: `${name} eliminada.`, time: 'Ahora', unread: true }, ...prev]);
    }
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

  // --- Empleos (Guardar es diferente a Postular) ---
  function saveJob(id) {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    ); 
  }

  function removeSaved(id) {
    setSavedJobs((prev) => prev.filter((x) => x !== id));
  }
  
  // --- NUEVO: Funciones de Postulación ---
  function handleApplyJob(jobId) {
    if (!user) return alert('Debes iniciar sesión para postular.');
    if (activeApplications.some(app => app.jobId === jobId)) {
        return alert('Ya postulaste a esta oferta.');
    }

    // Caso de Uso: Postular a una oferta
    const newApplication = {
        id: Date.now().toString(),
        jobId: jobId,
        userId: user.id,
        date: new Date().toISOString(),
        status: 'Pendiente',
    };
    setActiveApplications((prev) => [newApplication, ...prev]);
    setNotifications((prev) => [{ id: Date.now(), title: 'Postulación Exitosa', message: 'Tu postulación ha sido enviada.', time: 'Ahora', unread: true }, ...prev]);
  }

  function handleUpdateApplication(applicationId, newStatus) {
    // Caso de Uso: Actualizar postulación
    setActiveApplications((prev) => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus, date: new Date().toISOString() } : app
    ));
    setNotifications((prev) => [{ id: Date.now(), title: 'Postulación Actualizada', message: `El estado de tu postulación ha cambiado a ${newStatus}.`, time: 'Ahora', unread: true }, ...prev]);
  }

  function handleRemoveApplication(applicationId) {
    if (!window.confirm('¿Deseas eliminar esta postulación?')) return;
     // Caso de Uso: Eliminar postulación
    setActiveApplications((prev) => prev.filter(app => app.id !== applicationId));
    setNotifications((prev) => [{ id: Date.now(), title: 'Postulación Eliminada', message: 'Has retirado tu postulación.', time: 'Ahora', unread: true }, ...prev]);
  }


  // --- Perfil ---
  function updateProfile(newProfile) {
    // Casos de Uso: Actualizar información personal / Actualizar preferencias del servicio (Generalización)
    setProfile(newProfile);
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: 'Perfil actualizado',
        message: 'Tu perfil ha sido guardado exitosamente.',
        time: 'Ahora',
        unread: true,
      },
      ...prev,
    ]);
  }

  // --- NUEVO: Lógica para Eliminar perfil ---
  function handleDeleteProfile() {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu perfil permanentemente?')) return;
    
    // Caso de Uso: Eliminar perfil
    setUsers((prev) => prev.filter((x) => x.id !== user.id));
    localStorage.removeItem(STORAGE.SAVED);
    localStorage.removeItem(STORAGE.PROFILE);
    localStorage.removeItem(STORAGE.APPLICATIONS); // Limpiar postulaciones
    handleLogout();

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: 'Perfil Eliminado',
        message: 'Tu cuenta ha sido eliminada del sistema.',
        time: 'Ahora',
        unread: true,
      },
      ...prev,
    ]);
  }


  // --- NUEVO: Sub-caso de uso "Filtrar ofertas según feedback" ---
  const filterByFeedback = useCallback((job, userSavedJobs) => {
    // Si el filtrado por feedback está desactivado en preferencias, pasa el filtro.
    if (!profile.preferences.filter.feedbackEnabled) {
      return true;
    }
    
    // Si la oferta ha sido guardada (feedback positivo) o aplicada, pasa el filtro.
    if (userSavedJobs.includes(job.id) || activeApplications.some(app => app.jobId === job.id)) {
      return true;
    }

    // Simulación de descarte: si la oferta es de una fuente no verificada y es de bajo nivel.
    const jobSource = sources.find(s => s.name === job.source);
    if (jobSource && !jobSource.verified && (job.level || '').toLowerCase() === 'junior') {
      return false; 
    }

    return true; // Pasa la prueba de feedback
  }, [profile.preferences.filter.feedbackEnabled, sources, activeApplications]);


  // --- MODIFICADO: Filtro de búsqueda (usando useMemo y lógica de casos de uso) ---
  const visibleJobs = useMemo(() => {
    return jobs.filter((j) => {
      const q = searchTerm.trim().toLowerCase();
      
      // 1. Filtro por palabra clave
      const keywordMatch =
        !q ||
        (j.title || '').toLowerCase().includes(q) ||
        (j.company || '').toLowerCase().includes(q) ||
        (j.source || '').toLowerCase().includes(q);
      
      if (!keywordMatch) return false;

      // 2. Filtro según perfil (simulado)
      if (user) {
        // Ejemplo de filtrado por categoría (requiere que los jobs tengan category)
        // const categoryMatch = selectedCategory ? (j.category === selectedCategory) : true;

        // 3. Aplicación del sub-caso de uso "Filtrar ofertas según feedback"
        if (!filterByFeedback(j, savedJobs)) {
          return false;
        }
        
        // El filtro según tiempo de expiración se maneja limpiando la lista 'jobs' con el useEffect del 'Temporizador'.
      }

      return true;
    });
  }, [jobs, searchTerm, user, savedJobs, filterByFeedback]);


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
          {/* NUEVO: Botón para el caso de uso Extend: Recuperar contraseña */}
          <button
            onClick={() => setCurrentView('recoverPassword')}
            className="text-xs text-rose-500 hover:text-rose-400 mt-3 block w-full text-center"
          >
            ¿Olvidaste tu contraseña?
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Usa un correo con <code>@admin</code> o el modo demo.
          </p>
        </div>
      </div>
    );
  }

  // NUEVO: Vista de Recuperación de Contraseña
  if (currentView === 'recoverPassword') {
    return (
      <RecoverPasswordView 
        initialEmail={loginEmail}
        onRecover={handleRecoverPassword}
        onCancel={() => setCurrentView('login')}
      />
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
            // NUEVO: Pasar lógica de postulación
            onApply={handleApplyJob}
          />
        )}

        {/* MODIFICADO: SavedJobsView ahora muestra Guardados Y Postulaciones Activas */}
        {currentView === 'saved' && (
          <SavedJobsView
            savedIds={savedJobs}
            jobs={jobs}
            onRemoveSaved={removeSaved}
            // NUEVO: Pasar datos de postulaciones
            activeApplications={activeApplications}
            onRemoveApplication={handleRemoveApplication}
            onUpdateApplication={handleUpdateApplication}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            profile={profile} 
            onUpdate={updateProfile} 
            onDelete={handleDeleteProfile} // NUEVO: Pasar función para Eliminar perfil
          />
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

        {currentView === 'categories' && user?.role === 'admin' && (
          <CategoriesAdminView // NUEVA VISTA
            categories={categories}
            onAdd={addCategory}
            onRemove={removeCategory}
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

        {(currentView === 'sources' || currentView === 'users' || currentView === 'categories') &&
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