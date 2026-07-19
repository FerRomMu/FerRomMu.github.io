/* Fernando Romero — portfolio PoC
   i18n: Spanish auto-detection. English in the HTML is the source of truth;
   this script rewrites text and chip data-* in place when the browser is Spanish. */

(() => {
  "use strict";

  let stored = null;
  try { stored = localStorage.getItem("lang"); } catch (e) {}
  const es = stored ? stored === "es" : (navigator.language || "").toLowerCase().startsWith("es");
  window.I18N = { es };

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      try { localStorage.setItem("lang", es ? "en" : "es"); } catch (e) {}
      location.reload();
    });
  }

  if (!es) return;

  const t = {
    "nav-profile": "Perfil",
    "nav-experience": "Experiencia",
    "nav-skills": "Habilidades",
    "nav-education": "Educación",
    "nav-contact": "Contacto",

    "d-soft": "Desarrollo",
    "d-dev": "de software",
    "d-data": "Ciencia",
    "d-sci": "de datos",
    "tagline": "Los agentes pueden hacer mucho.<br>Yo hago que hagan lo que importa.",

    "plabel-01": "// 01 — PERFIL",
    "plabel-02": "// 02 — EXPERIENCIA",
    "plabel-03": "// 03 — HABILIDADES",
    "plabel-04": "// 04 — EDUCACIÓN",
    "plabel-05": "// 05 — CONTACTO",

    "ph-profile": "Perfil",
    "lede": "Construyo productos que trabajan más duro, para que las personas no tengan que hacerlo. Combino ingeniería backend, infraestructura cloud e IA para crear software escalable e inteligente.",
    "profile-note": "BACKEND · CLOUD · INTERFACES BASADAS EN LLM",

    "xt-experience": "Experiencia",
    "xs-experience": "// 2022 — presente",
    "col-no": "N°",
    "col-role": "ROL",
    "col-span": "PERÍODO",
    "col-prs": "PROYECTOS",
    "role-professor": "Profesor Universitario",
    "role-ts": "Desarrollador TypeScript",
    "img-note": "// las imágenes de los proyectos son representaciones generadas con IA — los productos reales de los clientes son confidenciales",
    "img-pending": "IMG — PENDIENTE",
    "card-link": "LEER EL PAPER ⟶",

    "xt-skills": "Habilidades",
    "xs-skills": "// herramientas",
    "dt-langs": "LENGUAJES",
    "dt-ai": "IA APLICADA",
    "dt-data": "DATOS & ML",
    "dt-db": "BASES DE DATOS",
    "dt-devops": "DEVOPS & MÉTODO",

    "xt-education": "Educación",
    "xs-education": "// formación académica",
    "degree": "Licenciatura en Informática",
    "edu-org": "UNIVERSIDAD NACIONAL DE QUILMES · 2019 — PRESENTE",
    "langs-label": "IDIOMAS",
    "lang-native": "// nativo",

    "xt-contact": "Hablemos.",
    "xs-contact": "// sin agentes de por medio — solo email",
    "btn-contact": "CONTACTAME PARA TRABAJAR",
    "cc-location": "UBICACIÓN",
  };

  const chips = {
    "PR-001": {
      title: "Migración Java → TypeScript",
      meta: "UQBAR · JUN 2022 — DIC 2022",
      desc: "Contribución de mis inicios a Wollok, el lenguaje open-source con el que universidades argentinas enseñan POO — portando código legacy de Java al nuevo stack TypeScript y arreglando comportamientos rotos en el camino.",
    },
    "PR-002": {
      title: "Predicción de churn",
      meta: "PRACTIA GLOBAL · ABR 2023 — NOV 2024",
      desc: "Modelo de retención ajustado para perder la menor cantidad de bajas posible (recall 0.9). Los clientes detectados recibían promociones de bajo costo — retener una cuenta costaba una fracción de lo que costaba perderla.",
    },
    "PR-003": {
      title: "Monitoreo industrial por visión",
      meta: "PRACTIA GLOBAL · ABR 2023 — NOV 2024",
      desc: "Convertimos cámaras pasivas de planta en monitoreo activo de seguridad — falta de casco o chaleco, un operario caído o haciendo señas de emergencia — nacido de un incidente real que nadie notó en cámara. Un segundo modelo evaluaba el óxido de los techos de los galpones.",
    },
    "PR-004": {
      title: "Generador de trailers de video",
      meta: "PRACTIA GLOBAL · ABR 2023 — NOV 2024",
      desc: "Charlas grabadas de 2–3 horas condensadas en trailers de 2–3 minutos: una voz sintética te cuenta qué vas a encontrar sobre los momentos clave de la charla — decidir si un video vale tu tiempo toma minutos, no horas.",
    },
    "PR-005": {
      title: "Laboratorio de Programación I",
      meta: "UNIVERSIDAD DE FAVALORO · ENE 2025 — JUL 2025",
      desc: "Diseño y dictado de un curso de programación orientada a objetos.",
    },
    "PR-006": {
      title: "Generador de docs y diagramas",
      meta: "PRACTIA GLOBAL · NOV 2024 — ENE 2026",
      desc: "Dos semanas de trabajo manual comprimidas en un día: el audio de una entrevista se convierte en un documento estructurado del proceso y su diagrama final, con cada sección generada por IA revisada y aprobada por chat. Lideré el equipo de punta a punta — conversaciones con el cliente, backlog y decisiones técnicas, deploy en Azure.",
    },
    "PR-007": {
      title: "Buscador semántico de videos",
      meta: "PRACTIA GLOBAL · NOV 2024 — ENE 2026",
      desc: "Preguntás en lenguaje natural y obtenés las charlas correctas con sus trailers. Búsqueda híbrida — RAG sobre resúmenes y tags, BM25 sobre palabras clave extraídas de la consulta — hizo realmente encontrables años de grabaciones con nombres genéricos.",
    },
    "PR-008": {
      title: "Guía digital del showroom",
      meta: "PRACTIA GLOBAL · NOV 2024 — ENE 2026",
      desc: "Con su consentimiento legal, clonamos al anfitrión del showroom: un avatar en pantalla que responde a los visitantes con su propia voz y guía las demos con clientes. La presentación dejó de depender de la agenda de una persona — y la guía misma es una demo de lo que la empresa vende.",
    },
    "PR-009": {
      title: "Predicción de EUR — Vaca Muerta",
      meta: "PRACTIA GLOBAL · NOV 2024 — ENE 2026",
      desc: "Una alternativa data-driven a semanas de simulación de reservorios: modelo multivariado que predice el EUR normalizado de pozos horizontales de gas (R² 0.77) y revela qué decisiones de completación realmente mueven la producción — publicado como paper de la SPE.",
    },
    "PR-010": {
      title: "Analista de datos multiagente",
      meta: "ARTEAR · FEB 2026 — PRESENTE",
      desc: "Agentes con ADK que liberaron a los equipos de los dashboards fijos: preguntás en lenguaje natural y consultan BigQuery, analizan y responden con gráficos — renderizados en vivo en la UI o generados en el backend detrás de una signed URL. Las preguntas nuevas ya no esperan un dashboard nuevo.",
    },
    "PR-011": {
      title: "Gobierno de cloud",
      meta: "ARTEAR · FEB 2026 — PRESENTE",
      desc: "Trabajo transversal sobre el ecosistema GCP — Airflow, Cloud Functions, modelos de BigQuery, vistas curadas, dashboards — alineando cada proyecto a buenas prácticas compartidas para que todos los equipos construyan sobre los mismos rieles.",
    },
    "PR-012": {
      title: "Dashboards de KPIs",
      meta: "ARTEAR · FEB 2026 — PRESENTE",
      desc: "Dashboards de Looker sobre modelos de BigQuery — la fuente diaria de verdad para las decisiones de KPIs de toda la empresa.",
    },
  };

  window.I18N.delta = {
    same: "Estamos en el mismo huso horario",
    ahead: (h) => `Estoy ${h}h adelante de vos`,
    behind: (h) => `Estoy ${h}h detrás de vos`,
  };

  document.documentElement.lang = "es";
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", "Fernando Romero — Data Scientist / AI Engineer. Los agentes pueden hacer mucho. Yo hago que hagan lo que importa.");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const s = t[el.dataset.i18n];
    if (!s) return;
    if (s.indexOf("<br>") !== -1) el.innerHTML = s;
    else el.textContent = s;
    if (el.hasAttribute("data-text")) el.setAttribute("data-text", s);
  });

  document.querySelectorAll(".pr").forEach((btn) => {
    const c = chips[btn.textContent.trim()];
    if (!c) return;
    btn.dataset.title = c.title;
    btn.dataset.desc = c.desc;
    btn.dataset.meta = c.meta;
  });
})();
