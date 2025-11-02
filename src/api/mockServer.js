// src/api/mockServer.js

// Función auxiliar para simular una categoría basada en el título del trabajo
const getMockCategory = (title) => {
  const t = title ? title.toLowerCase() : '';
  if (t.includes('data') || t.includes('analyst')) return 'Data Science';
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) return 'Diseño';
  if (t.includes('market') || t.includes('seo')) return 'Marketing';
  if (t.includes('sales') || t.includes('ventas')) return 'Ventas';
  return 'Desarrollo';
};


export async function getJobs() {
try {
  // Rutas Proxy
  const remotiveURL = "/api/remotive"; 
  const remoteokURL = "/api/remoteok";
  const wwrURL = "/api/wwr";     // NUEVO
  const jobicyURL = "/api/jobicy"; // NUEVO

  const [remotiveRes, remoteokRes, wwrRes, jobicyRes] = await Promise.allSettled([
    fetch(remotiveURL),
    fetch(remoteokURL),
    fetch(wwrURL),
    fetch(jobicyURL),
  ]);

  let offers = [];

  // --- Procesar Remotive ---
  if (remotiveRes.status === "fulfilled" && remotiveRes.value.ok) {
    const remotiveData = await remotiveRes.value.json();
    offers.push(
      ...remotiveData.jobs.slice(0, 10).map((j) => ({
        id: "remotive-" + j.id,
        title: j.title,
        company: j.company_name,
        location: j.candidate_required_location || "Remoto",
        url: j.url,
        source: "Remotive",
        category: getMockCategory(j.title), // ETIQUETADO PARA FILTRO
      }))
    );
  }

  // --- Procesar RemoteOK ---
  if (remoteokRes.status === "fulfilled" && remoteokRes.value.ok) {
    const remoteokData = await remoteokRes.value.json();
    offers.push(
      ...remoteokData
        .filter((j) => j.id && (j.position || j.title))
        .slice(1, 10)
        .map((j) => ({
          id: "remoteok-" + j.id,
          title: j.position || j.title,
          company: j.company || "N/A",
          location: j.location || "Remoto",
          url: j.url,
          source: "RemoteOK",
          category: getMockCategory(j.position || j.title), // ETIQUETADO PARA FILTRO
        }))
    );
  }
  
  // 🔥 --- Procesar WeWorkRemotely (WWR) --- 🔥
  if (wwrRes.status === "fulfilled" && wwrRes.value.ok) {
      const wwrData = await wwrRes.value.json();
      offers.push(
          ...wwrData.jobs.slice(0, 10).map((j) => ({
              id: "wwr-" + j.id,
              title: j.title,
              company: j.company_name || j.company,
              location: "Remoto (WWR)",
              url: j.url,
              source: "WeWorkRemotely",
              category: getMockCategory(j.title), // ETIQUETADO PARA FILTRO
          }))
      );
  }

  // 🔥 --- Procesar Jobicy (JBY) --- 🔥
  if (jobicyRes.status === "fulfilled" && jobicyRes.value.ok) {
      const jobicyData = await jobicyRes.value.json();
      // Nota: Jobicy devuelve los trabajos bajo la clave 'remote-jobs'
      offers.push(
          ...jobicyData['remote-jobs'].slice(0, 10).map((j) => ({
              id: "jobicy-" + j.id,
              title: j.jobTitle,
              company: j.companyName,
              location: j.jobType || "Remoto (Jobicy)",
              url: j.url,
              source: "Jobicy",
              category: getMockCategory(j.jobTitle), // ETIQUETADO PARA FILTRO
          }))
      );
  }

  // --- Lógica de Caché y Fallback (Asegurar que el fallback también tenga categorías) ---
  // ... (El resto del código de caché y fallback queda igual, pero asegúrate de que los objetos mock tengan 'category')
  
  if (!offers.length) {
    // ... (código para usar la caché) ...
  }

  if (!offers.length) {
    console.warn("⚠️ No se pudieron cargar las ofertas, usando ejemplos locales.");
    offers = [
      // Asegúrate de que los fallbacks tengan categorías:
      { id: "mock-1", title: "Desarrollador React", company: "TechNova", location: "Remoto", url: "#", source: "Simulado", category: "Desarrollo" },
      { id: "mock-2", title: "Diseñador UX/UI", company: "InnovaSoft", location: "Lima, Perú", url: "#", source: "Simulado", category: "Diseño" },
    ];
  }

  localStorage.setItem("ctc_jobs_cache_v1", JSON.stringify(offers));
  return offers;

} catch (error) {
  // ... (Manejo de errores y retorno de caché) ...
  console.error("❌ Error general en getJobs:", error);
  const cached = JSON.parse(localStorage.getItem("ctc_jobs_cache_v1") || "[]");
  return (
    cached.length
      ? cached
      : [
          { id: "mock-1", title: "Desarrollador React", company: "TechNova", location: "Remoto", url: "#", source: "Simulado", category: "Desarrollo" },
          { id: "mock-2", title: "Backend Node.js", company: "InnovaSoft", location: "Lima, Perú", url: "#", source: "Simulado", category: "Desarrollo" },
        ]
  );
}
}

export async function getSources() {
  return [
    { id: "remotive", name: "Remotive", url: "https://remotive.io/api/remote-jobs", verified: true },
    { id: "remoteok", name: "RemoteOK", url: "https://remoteok.io/api", verified: true },
    { id: "wwr", name: "WeWorkRemotely", url: "https://weworkremotely.com/api/v1/jobs/latest", verified: true }, // NUEVO
    { id: "jobicy", name: "Jobicy", url: "https://jobicy.com/api/v2/remote-jobs", verified: true }, // NUEVO
  ];
}
