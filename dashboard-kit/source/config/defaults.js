/* SOURCE: config/defaults.js — department profile system.
   Sets window.DEPT_PROFILE with fallback resolution layer.
   All render functions read labels from here instead of hardcoded strings.
   Without DEPT_PROFILE, falls back to Spanish tech defaults (backward compat).
   Claude adapts the dashboard by setting window.DEPT_PROFILE before init(). */

// ─── FALLBACK LABELS (Spanish tech — matches current observatorio behavior) ──
var _FB = {
  dept: 'Technology',
  locale: 'es',

  // Branding
  brand: {
    logo: 'go',
    title: 'Observatorio IO',
    subtitle: 'Inteligencia Operativa',
    org: 'Grupo Ortiz',
    accent: '#FB670B'
  },

  // Data model semantics — what concepts does this department track?
  dataModel: {
    primaryMetric: 'commits',
    primaryMetricLabel: 'Commits',
    secondaryMetric: 'repos',
    secondaryMetricLabel: 'Repos',
    entityName: 'Proyecto',
    entityPlural: 'Proyectos',
    personName: 'Persona',
    personPlural: 'Personas',
    hasGit: true,
    hasRepos: true,
    hasBranches: true,
    hasGraph: true,
    hasCommitFeed: true,
    hasMVP: true,
    hasFase: true
  },

  // Navigation labels
  nav: {
    overview: 'Departamento',
    activity: 'Actividad',
    project: 'Proyecto',
    person: 'Persona',
    presentation: 'Presentacion',
    config: 'config',
    team: 'Equipo',
    hidden: 'Ocultos',
    inactive: 'Otros estatus',
    other: 'Otros'
  },

  // KPI tiles (4 max in overview row)
  kpiTiles: [
    { id: 'total_activity', label: 'Commits', compute: 'commits_total',
      suffix: 'por dia · rango', format: 'avgPerDay' },
    { id: 'active_projects', label: 'Proyectos', compute: 'active_projects',
      suffix: 'activos / total', format: 'countFraction' },
    { id: 'active_people', label: 'Personas', compute: 'contributors_active',
      suffix: 'activas en rango', format: 'number' },
    { id: 'data_sources', label: 'Repos', compute: 'repos_count',
      suffix: 'con actividad', format: 'number' }
  ],

  // Chart labels
  charts: {
    calendar: { title: 'Actividad', unit: 'commits', yearLabel: 'Actividad {YR}' },
    daily: { title: 'Actividad diaria (commits)', yLabel: 'commits' },
    byEntity: { title: 'Commits por proyecto', yLabel: 'Commits' },
    health: { title: 'Salud del portafolio', xLabel: 'commits/7d', yLabel: 'MVP%',
              tooltip: '● commits/7d  X=actividad  Y=MVP%' },
    contribution: { title: 'Contribucion por persona' },
    graph: { title: 'Quien trabaja en que', entityCategory: 'proyectos', personCategory: 'personas' },
    donut: { title: 'Portafolio' },
    project: {
      activityMap: 'Mapa de actividad',
      commitsOverTime: 'Commits en el tiempo',
      mvpGauge: 'MVP gauge',
      contributors: 'Contribuidores (rango)',
      stack: 'Stack & ramas',
      recentCommits: 'Commits recientes',
      noBranches: 'Sin ramas de colaboradores.',
      noCommits: 'Sin commits en el rango.',
      blocker: 'Bloqueo:'
    },
    person: {
      activityMap: 'Mapa de actividad',
      commitsByRepo: 'Commits por repo',
      dailyActivity: 'Actividad diaria',
      recentCommits: 'Commits recientes',
      commitsRange: 'Commits (rango)',
      repos: 'Repos',
      totalGlobal: 'Total global',
      historical: 'historico',
      withActivity: 'con actividad',
      commitsInRange: 'commits en rango'
    },
    activity: {
      title: 'Actividad — Quien trabaja en que',
      activeRepos: 'Repos activos',
      contributors: 'Contribuidores',
      connections: 'Conexiones',
      commitsInRange: 'commits en rango',
      network: 'Red de actividad (repos + personas)',
      reposByCommits: 'Repos por commits',
      personsByCommits: 'Personas por commits',
      tableRepo: 'Repo',
      tableCommits: 'Commits',
      tableLast: 'Ultimo',
      tablePerson: 'Persona',
      tableRepos: 'Repos'
    },
    export: {
      brand: 'Observatorio IO',
      confidential: 'Confidencial',
      generating: 'generando…',
      desktopOk: 'desktop',
      mobileOk: 'movil',
      active: 'activos',
      footer: 'commits · repos en rango'
    }
  },

  // Classification labels (framework taxonomy)
  classification: {
    activeList: ['Produccion', 'Desarrollo activo', 'Piloto', 'Diseno / planeacion'],
    inactiveList: ['Archivo', 'Referencia', 'Referencia perpetua', 'Finalizado']
  },

  // Semaforo labels
  semaforo: {
    Verde: 'Verde', Amarillo: 'Amarillo', Rojo: 'Rojo',
    Excluido: 'Excluido', Gris: 'Gris',
    Green: 'Green', Yellow: 'Yellow', Red: 'Red',
    Gray: 'Gray', Excluded: 'Excluded'
  },

  // Project card labels
  projectCard: {
    mvp: 'MVP',
    days7: '7d',
    days: 'dias',
    fase: 'Fase',
    sinGit: 'sin git',
    gitBadge: 'GH',
    activeProjects: 'Proyectos activos'
  },

  // Config modal labels
  config: {
    owner: 'Owner',
    collabs: 'Colabs',
    noCollaborators: 'sin colaboradores',
    save: 'Guardar',
    removeCollab: 'retirar (merge+borra branch)',
    retireConfirm: 'Retirar {PERSON} de {SLUG}?\nEsto mergea su branch a master y la ELIMINA (operativo, via git-guard).\nRequiere el server FastAPI corriendo.'
  },

  // UI chrome
  ui: {
    dataChip: 'datos: hace ',
    dataUnknown: 'datos: ?',
    noData: 'Sin datos. Corre export_snapshot.py',
    exportButton: 'Exportar',
    refreshButton: 'Actualizar repos y datos (read-only, sin push)',
    expandButton: 'expandir',
    hiddenTag: 'oculto',
    loading: 'generando…',
    done: 'Listo:',
    error: 'Error:',
    less: 'Menos',
    more: 'Mas'
  },

  // Auto-refresh (ms, 0 = disabled)
  autoRefreshMs: 0
};

// ─── RESOLUTION LAYER ─────────────────────────────────────────────────
// Returns the profile merged with fallbacks. Reads window.DEPT_PROFILE once
// and caches the merged result so repeated calls are cheap.
var _MERGED = null;
function _resolve() {
  if (_MERGED) return _MERGED;
  var over = window.DEPT_PROFILE || {};
  _MERGED = {};
  // Deep-merge overrides into fallbacks
  Object.keys(_FB).forEach(function(k) {
    if (over[k] && typeof _FB[k] === 'object' && !Array.isArray(_FB[k])) {
      _MERGED[k] = Object.assign({}, _FB[k], over[k]);
    } else if (over[k] !== undefined) {
      _MERGED[k] = over[k];
    } else {
      _MERGED[k] = _FB[k];
    }
  });
  return _MERGED;
}

// Public accessors — these are called everywhere instead of hardcoded strings
function profile()     { return _resolve(); }
function navLabel(k)   { return _resolve().nav[k] || _FB.nav[k]; }
function chartLabel(k) { return _resolve().charts[k] || _FB.charts[k]; }
function kpiTile(idx)  { return (_resolve().kpiTiles || _FB.kpiTiles)[idx] || _FB.kpiTiles[idx]; }
function semLabel(k)   { return _resolve().semaforo[k] || _FB.semaforo[k]; }
function uiLabel(k)    { return _resolve().ui[k] || _FB.ui[k]; }
function brand()       { return _resolve().brand; }
function dataModel()   { return _resolve().dataModel; }
function clLabel(k)    { return _resolve().classification[k] || _FB.classification[k]; }
function cardLabel(k)  { return _resolve().projectCard[k] || _FB.projectCard[k]; }
function cfgLabel(k)   { return _resolve().config[k] || _FB.config[k]; }

// Entity name helpers
function entityName()  { return dataModel().entityName; }
function entityPlural(){ return dataModel().entityPlural; }
function personName()  { return dataModel().personName; }
function personPlural(){ return dataModel().personPlural; }

// Format KPI values by type
function formatKPI(val, fmt) {
  if (val == null || val === '-') return '-';
  switch (fmt) {
    case 'currency': return '$' + Number(val).toLocaleString();
    case 'percent':  return Number(val).toFixed(1) + '%';
    case 'avgPerDay': return Number(val).toFixed(1);
    case 'countFraction': return String(val); // caller formats X / Y
    default: return String(val);
  }
}

// Reset cached merge (call after programmatic DEPT_PROFILE change)
function resetProfile() { _MERGED = null; }
