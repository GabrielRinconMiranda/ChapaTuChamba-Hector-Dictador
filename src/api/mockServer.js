// src/api/mockServer.js

export async function getJobs() {
  try {
    // APIs envueltas en proxy anti-CORS
    const remotiveURL = "https://api.allorigins.win/raw?url=https://remotive.com/api/remote-jobs";
    const remoteokURL = "https://api.allorigins.win/raw?url=https://remoteok.io/api";

    const [remotiveRes, remoteokRes] = await Promise.allSettled([
      fetch(remotiveURL),
      fetch(remoteokURL),
    ]);

    let offers = [];

    // --- Procesar Remotive ---
    if (remotiveRes.status === "fulfilled") {
      const remotiveData = await remotiveRes.value.json();
      offers.push(
        ...remotiveData.jobs.slice(0, 20).map((j) => ({
          id: "remotive-" + j.id,
          title: j.title,
          company: j.company_name,
          location: j.candidate_required_location || "Remoto",
          url: j.url,
          source: "Remotive",
        }))
      );
    }

    // --- Procesar RemoteOK ---
    if (remoteokRes.status === "fulfilled") {
      const remoteokData = await remoteokRes.value.json();
      offers.push(
        ...remoteokData
          .filter((j) => j.id && (j.position || j.title))
          .slice(1, 20)
          .map((j) => ({
            id: "remoteok-" + j.id,
            title: j.position || j.title,
            company: j.company || "N/A",
            location: j.location || "Remoto",
            url: j.url,
            source: "RemoteOK",
          }))
      );
    }

    // Si no cargó nada, usar caché
    if (!offers.length) {
      const cached = JSON.parse(localStorage.getItem("ctc_jobs_cache_v1") || "[]");
      if (cached.length) {
        console.warn("⚠️ Usando caché local (fallo de red o CORS)");
        return cached;
      }
    }

    // Si todo falló, usar ejemplos
    if (!offers.length) {
      console.warn("⚠️ No se pudieron cargar las ofertas, usando ejemplos locales.");
      offers = [
        { id: "mock-1", title: "Desarrollador React", company: "TechNova", location: "Remoto", url: "#", source: "Simulado" },
        { id: "mock-2", title: "Backend Node.js", company: "InnovaSoft", location: "Lima, Perú", url: "#", source: "Simulado" },
      ];
    }

    // Guardar en caché
    localStorage.setItem("ctc_jobs_cache_v1", JSON.stringify(offers));

    return offers;
  } catch (error) {
    console.error("❌ Error general en getJobs:", error);
    const cached = JSON.parse(localStorage.getItem("ctc_jobs_cache_v1") || "[]");
    return (
      cached.length
        ? cached
        : [
            { id: "mock-1", title: "Desarrollador React", company: "TechNova", location: "Remoto", url: "#", source: "Simulado" },
            { id: "mock-2", title: "Backend Node.js", company: "InnovaSoft", location: "Lima, Perú", url: "#", source: "Simulado" },
          ]
    );
  }
}

export async function getSources() {
  return [
    { id: "remotive", name: "Remotive", url: "https://remotive.com/api/remote-jobs", verified: true },
    { id: "remoteok", name: "RemoteOK", url: "https://remoteok.io/api", verified: true },
  ];
}
