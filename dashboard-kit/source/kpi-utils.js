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
function realPct(p){var r=+(p.pct_mvp||0);var f=+(p.fase||0);if(f>=8)return r;if(f>=7)return Math.min(94,r);return Math.min(74,r);}

// ─── XSS AUDIT NOTES (H8) ────────────────────────────────────────
// ─── COLOR ALLOCATION (golden-angle deterministic) ─────────────────
function hashSlug(s){var h=0;s=s||'x';for(var i=0;i<s.length;i++)h=((h*31)+s.charCodeAt(i))>>>0;return h;}
function colorForIndex(i,slug){if(i<6)return PALETTE[i];var hue=(hashSlug(slug)*137.508)%360;return 'hsl('+hue.toFixed(1)+',62%,58%)';}
// NOTA: PALETTE se define en data-render.js. colorForIndex solo se llama en init() -> PALETTE ya existe.
// XSS AUDIT NOTES (H8):
// innerHTML usos que NO pasan por esc():
// - kpi(): v (value) se inserta raw. Llamadores pasan HTML deliberado (ej: '<span...>').
// - miniKpi(): v (value) se inserta raw. Mismo caso.
// - contribBarsHTML(): c.person insertado raw en varios lugares.
// - contribListHTML(): c.person insertado raw.
// - renderOverview(): dept data insertada raw via kpi() calls.
// - renderProject(): pd.status, po.owner, po.classification insertados raw.
// - renderPerson(): person nombre insertado raw en h2.
// - renderActivity(): act.repos/contributors insertados raw en tablas.
// - buildSidebar(): p.slug insertado raw.
// - openConfig(): p.slug, p.classification, p.owner, p.colabs insertados raw.
// Todos estos datos vienen de snapshot.json (servidor local) — riesgo bajo en contexto actual,
// pero deben sanitizarse si el snapshot puede venir de fuente externa.
