// src/api/mockServer.js - Versión FINAL con 4 fuentes reales (requiere proxy de Vite)

// Función auxiliar para asignar una categoría basada en el título (necesaria para el filtrado)
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
  // Rutas Proxy (correctas para Vite)
  const remotiveURL = "/api/remotive"; 
  const remoteokURL = "/api/remoteok";
  const wwrURL = "/api/wwr";     
  const jobicyURL = "/api/jobicy"; 

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
        category: getMockCategory(j.title),
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
          category: getMockCategory(j.position || j.title),
        }))
    );
  }
  
  // --- Procesar WeWorkRemotely (WWR) ---
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
              category: getMockCategory(j.title),
          }))
      );
  }

  // --- Procesar Jobicy (JBY) ---
  if (jobicyRes.status === "fulfilled" && jobicyRes.value.ok) {
      const jobicyData = await jobicyRes.value.json();
      offers.push(
          ...jobicyData['remote-jobs'].slice(0, 10).map((j) => ({
              id: "jobicy-" + j.id,
              title: j.jobTitle,
              company: j.companyName,
              location: j.jobType || "Remoto (Jobicy)",
              url: j.url,
              source: "Jobicy",
              category: getMockCategory(j.jobTitle),
          }))
      );
  }

  // --- Lógica de Caché y Fallback ---
  // Si la obtención de datos falló (lo que ocurre en StackBlitz), se usa la caché o el fallback.
  if (!offers.length) {
    const cached = JSON.parse(localStorage.getItem("ctc_jobs_cache_v1") || "[]");
    if (cached.length) {
      console.warn("⚠️ Fallo de red. Usando caché local.");
      return cached;
    }
  }

  if (!offers.length) {
    console.warn("⚠️ No se pudieron cargar las ofertas, usando ejemplos locales.");
    offers = [
      { id: "mock-1", title: "Desarrollador React", company: "TechNova", location: "Remoto", url: "#", source: "Simulado", category: "Desarrollo" }, 
      { id: "mock-2", title: "Diseñador UX/UI", company: "InnovaSoft", location: "Lima, Perú", url: "#", source: "Simulado", category: "Diseño" },
    ];
  }

  localStorage.setItem("ctc_jobs_cache_v1", JSON.stringify(offers));
  return offers;

} catch (error) {
  // Retornar caché ante cualquier error de conexión
  console.error("❌ Error general en getJobs. Retornando caché:", error);
  const cached = JSON.parse(localStorage.getItem("ctc_jobs_cache_v1") || "[]");
  return cached.length
      ? cached
      : [
          { id: "mock-fallback-1", title: "Fallback Job", company: "Fallback Co", location: "Remoto", url: "#", source: "Simulado", category: "Desarrollo" },
        ];
}
}
// ... (getSources permanece sin cambios)

export async function getSources() {
  return [
    { id: "remotive", name: "Remotive", url: "https://remotive.io/api/remote-jobs", verified: true },
    { id: "remoteok", name: "RemoteOK", url: "https://remoteok.io/api", verified: true },
    { id: "wwr", name: "WeWorkRemotely", url: "https://weworkremotely.com/api/v1/jobs/latest", verified: true }, // NUEVO
    { id: "jobicy", name: "Jobicy", url: "https://jobicy.com/api/v2/remote-jobs", verified: true }, // NUEVO
  ];
}
