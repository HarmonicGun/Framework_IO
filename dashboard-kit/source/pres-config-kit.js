/* SOURCE: pres-config-kit.js — edit this file, run build_dashboard.py to rebuild */
/* REQUIRES: kpi-utils.js (esc, initials, CM, hashSlug, colorForIndex), chart-kit.js (donutOption, graphOption, attachGraphHover, attachDonutClick) */

// ─── PRESENTATION CONFIG STATE ─────────────────────────────────────
window.PRES_CFG = null;

function initPresCfg(){
  // Intentar sessionStorage (prioridad: sesion actual)
  var raw = sessionStorage.getItem('obs_pres_cfg');
  // Si no hay, localStorage (persistente)
  if (!raw) raw = localStorage.getItem('obs_pres_cfg_v1');
  var saved = null;
  try { if (raw) saved = JSON.parse(raw); } catch(e) { saved = null; }
  // Defaults: todos los proyectos activos + todas las personas
  var allProj = (S.projects||[]).filter(function(p){return p.active;}).map(function(p){return p.slug;});
  var allPers = (S.contributors||[]).map(function(c){return c.person;});
  // Filtrar slugs/personas que ya no existen
  if (saved && saved.projects) {
    var valid = {}; allProj.forEach(function(s){valid[s]=true;});
    saved.projects = saved.projects.filter(function(s){return valid[s];});
  }
  if (saved && saved.persons) {
    var valid = {}; allPers.forEach(function(p){valid[p]=true;});
    saved.persons = saved.persons.filter(function(p){return valid[p];});
  }
  window.PRES_CFG = {
    projects: new Set((saved&&saved.projects&&saved.projects.length) ? saved.projects : allProj),
    persons:  new Set((saved&&saved.persons&&saved.persons.length) ? saved.persons : allPers),
  };
}

// ─── FILTERED VIEWS ─────────────────────────────────────────────────
function filteredActivity(){
  var act = S.activity || {};
  var projSet = PRES_CFG.projects, personSet = PRES_CFG.persons;
  var repos = (act.repos||[]).filter(function(r){return projSet.has(r.project||r.repo);});
  var contributors = (act.contributors||[]).filter(function(c){return personSet.has(c.name||c.id||c.person);});
  var edges = (act.edges||[]).filter(function(e){
    return projSet.has(e.to) && personSet.has(e.from);
  });
  return {repos:repos, contributors:contributors, edges:edges};
}

function filteredPortfolio(projs){
  var cls = {};
  projs.forEach(function(p){
    var c = p.classification || 'Sin clasificar';
    cls[c] = (cls[c]||0) + 1;
  });
  return {by_classification: cls};
}

// ─── MODAL UI ───────────────────────────────────────────────────────
function openPresConfig(){
  if (!window.PRES_CFG) initPresCfg();
  var projs = (S.projects||[]).filter(function(p){return p.active;});
  var contribs = S.contributors||[];

  function projRow(p){
    var sel = PRES_CFG.projects.has(p.slug);
    return '<label class="pcfg-row">'+
      '<span class="sdot" style="background:'+(CM[p.slug]||'#606060')+'"></span>'+
      '<span class="pcfg-name">'+(p.slug.length>20?p.slug.slice(0,19)+'…':p.slug)+'</span>'+
      '<span class="sdot" style="background:'+(SEM[p.semaforo]||'#52525B')+';width:6px;height:6px;flex-shrink:0"></span>'+
      '<input type="checkbox" class="pcfg-cb pcfg-proj" data-slug="'+p.slug+'"'+(sel?' checked':'')+' onchange="pcfgUpdateStartBtn()">'+
    '</label>';
  }

  function personRow(c){
    var sel = PRES_CFG.persons.has(c.person);
    var nCommits = c.commits;
    return '<label class="pcfg-row">'+
      '<span class="av" style="width:18px;height:18px;font-size:9px;flex-shrink:0">'+initials(c.person)+'</span>'+
      '<span class="pcfg-name">'+c.person+'</span>'+
      '<span class="t3 mono" style="font-size:10px;flex-shrink:0">'+nCommits+'</span>'+
      '<input type="checkbox" class="pcfg-cb pcfg-pers" data-person="'+c.person+'"'+(sel?' checked':'')+' onchange="pcfgUpdateStartBtn()">'+
    '</label>';
  }

  var hasSaved = !!localStorage.getItem('obs_pres_cfg_v1');

  var html =
    '<div class="cfg-overlay" onclick="closePresConfig()"></div>'+
    '<div class="pcfg-box">'+
      '<div class="pcfg-h">PRESENTACION · CONFIGURAR</div>'+
      '<div class="pcfg-sub">Selecciona que incluir en esta sesion</div>'+
      '<div class="pcfg-cols">'+
        '<div class="pcfg-col">'+
          '<div class="pcfg-col-head"><span>PROYECTOS</span>'+
            '<span><button class="btn sm" onclick="pcfgToggleAll(\'proj\',true)">Todos</button>'+
            '<button class="btn sm" onclick="pcfgToggleAll(\'proj\',false)">Ninguno</button></span></div>'+
          '<div class="pcfg-list" id="pcfg-proj-list">'+projs.map(projRow).join('')+'</div>'+
        '</div>'+
        '<div class="pcfg-col">'+
          '<div class="pcfg-col-head"><span>PERSONAS</span>'+
            '<span><button class="btn sm" onclick="pcfgToggleAll(\'pers\',true)">Todos</button>'+
            '<button class="btn sm" onclick="pcfgToggleAll(\'pers\',false)">Ninguno</button></span></div>'+
          '<div class="pcfg-list">'+contribs.map(personRow).join('')+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="pcfg-foot">'+
        '<label class="pcfg-remember"><input type="checkbox" id="pcfg-remember"'+(hasSaved?' checked':'')+'> Recordar esta seleccion</label>'+
        '<span><button class="btn" onclick="closePresConfig()">Cancelar</button>'+
        '<button class="btn prim" id="pcfg-start" onclick="startPresWithConfig()">▶ Iniciar</button></span>'+
      '</div>'+
    '</div>';

  document.getElementById('presCfgModal').innerHTML = html;
  document.getElementById('presCfgModal').classList.add('on');
  pcfgUpdateStartBtn();
}

function closePresConfig(){
  document.getElementById('presCfgModal').classList.remove('on');
}

function pcfgToggleAll(kind, sel){
  var cls = kind==='proj'?'.pcfg-proj':'.pcfg-pers';
  document.querySelectorAll('#presCfgModal '+cls).forEach(function(cb){cb.checked = sel;});
  pcfgUpdateStartBtn();
}

function pcfgUpdateStartBtn(){
  var n = document.querySelectorAll('#presCfgModal .pcfg-proj:checked').length;
  var btn = document.getElementById('pcfg-start');
  if (btn) {
    btn.disabled = n === 0;
    btn.title = n === 0 ? 'Selecciona al menos un proyecto' : '';
  }
}

function startPresWithConfig(){
  // Leer checkboxes del DOM
  var projs = [];
  document.querySelectorAll('#presCfgModal .pcfg-proj:checked').forEach(function(cb){projs.push(cb.dataset.slug);});
  var pers = [];
  document.querySelectorAll('#presCfgModal .pcfg-pers:checked').forEach(function(cb){pers.push(cb.dataset.person);});

  if (!projs.length) return;

  window.PRES_CFG = {
    projects: new Set(projs),
    persons: new Set(pers),
  };

  // Persistir
  var data = {projects: projs, persons: pers};
  try { sessionStorage.setItem('obs_pres_cfg', JSON.stringify(data)); } catch(e) {}
  var remember = document.getElementById('pcfg-remember');
  if (remember && remember.checked) {
    try { localStorage.setItem('obs_pres_cfg_v1', JSON.stringify(data)); } catch(e) {}
  } else {
    try { localStorage.removeItem('obs_pres_cfg_v1'); } catch(e) {}
  }

  closePresConfig();
  startPres();
}
