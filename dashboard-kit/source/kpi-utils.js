/* SOURCE: kpi-utils.js — edit this file, run build_dashboard.py to rebuild */

// ─── UTILITIES ────────────────────────────────────────────────────
function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function ymd(d){return d.toISOString().slice(0,10);}
function addDays(s,n){var d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return ymd(d);}
function inRange(d){return d>=FROM&&d<=TO;}
function filt(arr,key){key=key||'date';return (arr||[]).filter(function(x){return inRange(x[key]);});}
function kpi(l,v,s){return '<div class="card acc"><div class="kpi-label">'+l+'</div><div class="kpi-val">'+v+'</div><div class="kpi-sub">'+s+'</div></div>';}
function miniKpi(l,v,s){return '<div><div class="kpi-label">'+l+'</div><div class="kpi-val" style="font-size:30px;margin:4px 0 2px">'+v+'</div><div class="kpi-sub">'+s+'</div></div>';}
function initials(n){return (n||'?').split(/\s+/).map(function(w){return w[0];}).slice(0,2).join('').toUpperCase();}

// ─── XSS AUDIT NOTES (H8) ────────────────────────────────────────
// innerHTML uses that do NOT go through esc():
// - kpi(): v (value) inserted raw. Callers pass deliberate HTML (e.g. '<span...>').
// - miniKpi(): v (value) inserted raw. Same case.
// - contribBarsHTML(): c.person inserted raw in several places.
// - contribListHTML(): c.person inserted raw.
// - renderOverview(): dept data inserted raw via kpi() calls.
// - renderProject(): pd.status, po.owner, po.classification inserted raw.
// - renderPerson(): person name inserted raw in h2.
// - renderActivity(): act.repos/contributors inserted raw in tables.
// - buildSidebar(): p.slug inserted raw.
// - openConfig(): p.slug, p.classification, p.owner, p.colabs inserted raw.
// All data comes from snapshot.json (local server) — low risk in current context,
// but must be sanitized if snapshot can come from an external source.
