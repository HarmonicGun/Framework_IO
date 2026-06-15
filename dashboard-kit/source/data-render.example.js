/* SOURCE: data-render.example.js — universal department dashboard renderer.
   Reads ALL labels from DEPT_PROFILE resolution layer (config/defaults.js).
   Without DEPT_PROFILE, falls back to Spanish tech defaults (backward compat).
   Claude adapts by setting window.DEPT_PROFILE before init().
   Replace this file with your own data-render.js for custom rendering. */

// ─── GLOBALS ──────────────────────────────────────────────────────
const PALETTE=['#FB670B','#14B8A6','#38BDF8','#A78BFA','#00A36E','#F59E0B'];
const OTROS='#606060';
// SEM now uses profile-aware labels for semaforo display but keeps color map
const SEM={Green:'#00A36E',Yellow:'#D97706',Red:'#E53E3E',Gray:'#52525B',Excluded:'#52525B'};
const GRID={color:'rgba(255,255,255,.06)'};
const AXIS={color:'#71717A',fontFamily:'JetBrains Mono',fontSize:11};
let S=null, CM={}, ROUTE='overview', ROUTE_ARG=null, CHARTS=[], MCHARTS=[];
let ANCHOR='2024-01-31', FROM='2024-01-01', TO='2024-01-31';
let CFG={};  // overrides locales {slug:{visible,owner,colabs}}
let AUTO_REFRESH_TIMER=null;  // for auto-refresh polling

// ─── INIT ─────────────────────────────────────────────────────────
function init(snap){
  S=snap;
  loadCfg();
  applyCfg();
  (S.projects||[]).forEach(function(p,i){CM[p.slug]=colorForIndex(i,p.slug);});
  var days=(S.department||{}).commits_by_day||[];
  ANCHOR = days.length?days[days.length-1].date:'2024-01-31';
  TO=ANCHOR; FROM=addDays(ANCHOR,-29);
  document.getElementById('dFrom').value=FROM;
  document.getElementById('dTo').value=TO;
  buildSidebar(); updateVerdict(); updateFreshChip();
  go('overview');
  armAutoRefresh();  // start polling if autoRefreshMs > 0
}

// ─── AUTO-REFRESH ──────────────────────────────────────────────────
function armAutoRefresh(){
  var ms = (profile().autoRefreshMs || 0);
  if (ms <= 0) return;
  if (AUTO_REFRESH_TIMER) clearInterval(AUTO_REFRESH_TIMER);
  AUTO_REFRESH_TIMER = setInterval(function(){
    // Poll snapshot.json HEAD for Last-Modified change (file mode)
    fetch('snapshot.json', {method: 'HEAD', cache: 'no-cache'}).then(function(r){
      var lm = r.headers.get('Last-Modified');
      if (!lm) return;
      if (window._lastSnapshotMtime && lm !== window._lastSnapshotMtime) {
        fetch('snapshot.json?t=' + Date.now()).then(function(r2){return r2.json();})
          .then(function(snap){ destroyCharts(); init(snap); })
          .catch(function(){});
      }
      window._lastSnapshotMtime = lm;
    }).catch(function(){});
    // Also try server health endpoint for freshness check
    fetch('/api/health').then(function(r){return r.json();}).then(function(h){
      var src = S ? (S.data_as_of || S.generated_at) : null;
      if (!src) return;
      var t = src.length <= 10 ? new Date(src+'T00:00:00') : new Date(src);
      var age = Date.now() - t.getTime();
      if (age > ms * 1.2) {  // 20% hysteresis
        if (typeof startRefresh === 'function') startRefresh();
      }
    }).catch(function(){});
  }, Math.max(ms, 30000));  // floor at 30s
}

// ─── FRESH CHIP ────────────────────────────────────────────────────
let FRESH_TIMER=null;
function updateFreshChip(){
  var btn=document.getElementById('syncBtn'); if(!btn)return;
  var chip=document.getElementById('freshChip');
  if(!chip){chip=document.createElement('span');chip.id='freshChip';chip.className='fresh-chip';btn.insertAdjacentElement('beforebegin',chip);}
  var src=S?(S.data_as_of||S.generated_at):null;
  if(!src){chip.textContent=uiLabel('dataUnknown');return;}
  var t=src.length<=10?new Date(src+'T00:00:00'):new Date(src);
  var h=(Date.now()-t.getTime())/3600000;
  var label=h<1?'<1h':h<48?Math.round(h)+'h':Math.round(h/24)+'d';
  chip.textContent=uiLabel('dataChip')+label;
  chip.className='fresh-chip'+(h>48?' bad':h>24?' warn':'');
  if(!FRESH_TIMER)FRESH_TIMER=setInterval(updateFreshChip,60000);
}

// localStorage merge (for standalone mode without server)
function loadCfg(){ try{CFG=JSON.parse(localStorage.getItem('obs_cfg')||'{}');}catch(e){CFG={};}
  var sc=(S.config||{}).projects||{}; Object.keys(sc).forEach(function(k){ if(!CFG[k]) CFG[k]=sc[k]; }); }
function saveCfgLocal(){ localStorage.setItem('obs_cfg',JSON.stringify(CFG)); }
function applyCfg(){ (S.projects||[]).forEach(function(p){ var o=CFG[p.slug]; if(o){ if(o.visible!==undefined)p.visible=o.visible; if(o.owner)p.owner=o.owner; if(o.colabs)p.colabs=o.colabs; } }); }

function buildSidebar(){
  var act=(S.projects||[]).filter(function(p){return p.active;});
  var ina=(S.projects||[]).filter(function(p){return !p.active;});
  function row(p){
    return '<div class="nav-proj '+(p.visible?'':'hidden')+'" id="np-'+p.slug+'" onclick="go(\'project\',\''+p.slug+'\')">'+
      '<span class="sdot" style="background:'+(CM[p.slug]||OTROS)+'"></span>'+
      '<span class="nm">'+p.slug+'</span>'+
      (p.visible?'':'<span class="st">'+uiLabel('hiddenTag')+'</span>')+'</div>';
  }
  // active+visible grouped by classification
  var visAct=act.filter(function(p){return p.visible;});
  var groups={},gOrder=[];
  visAct.forEach(function(p){var cls=p.classification||navLabel('other');if(!groups[cls]){groups[cls]=[];gOrder.push(cls);}groups[cls].push(p);});
  var html='';
  gOrder.forEach(function(cls,i){
    var key='obs_sb_cls_'+cls.replace(/\s+/g,'_');
    var stored=localStorage.getItem(key);
    var open=stored!==null?stored==='1':i===0;
    if(ROUTE==='project'&&ROUTE_ARG&&groups[cls].some(function(p){return p.slug===ROUTE_ARG;}))open=true;
    var elId='sb-cls-'+i;
    html+='<div class="nav-section sb-toggle" onclick="sbToggle(\''+elId+'\',\''+key+'\')" style="padding-top:8px;cursor:pointer;user-select:none">'+
      '<span>'+cls+'</span><span class="sb-chevron" id="chv-'+elId+'" style="float:right;font-size:10px;transition:transform .2s">'+(open?'&#9650;':'&#9660;')+'</span></div>'+
      '<div id="'+elId+'" style="display:'+(open?'block':'none')+'">'+groups[cls].map(row).join('')+'</div>';
  });
  // inactive+visible — default collapsed
  var visIna=ina.filter(function(p){return p.visible;});
  if(visIna.length){
    var otrosKey='obs_sb_otros';
    var otrosOpen=localStorage.getItem(otrosKey)==='1';
    if(ROUTE==='project'&&ROUTE_ARG&&visIna.some(function(p){return p.slug===ROUTE_ARG;}))otrosOpen=true;
    html+='<div class="nav-section sb-toggle" onclick="sbToggle(\'sb-otros\',\''+otrosKey+'\')" style="padding-top:8px;cursor:pointer;user-select:none">'+
      '<span>'+navLabel('inactive')+' ('+visIna.length+')</span><span class="sb-chevron" id="chv-sb-otros" style="float:right;font-size:10px;transition:transform .2s">'+(otrosOpen?'&#9650;':'&#9660;')+'</span></div>'+
      '<div id="sb-otros" style="display:'+(otrosOpen?'block':'none')+'">'+visIna.map(row).join('')+'</div>';
  }
  var hidden=(S.projects||[]).filter(function(p){return !p.visible;});
  if(hidden.length){
    html+='<div class="nav-section" style="padding-top:8px"><span>'+navLabel('hidden')+' ('+hidden.length+')</span></div>';
    html+=hidden.map(row).join('');
  }
  document.getElementById('aside-projects').innerHTML=html;
  // Team sidebar — default collapsed
  var teamKey='obs_sb_team';
  var teamOpen=localStorage.getItem(teamKey)==='1';
  if(ROUTE==='person')teamOpen=true;
  document.getElementById('aside-persons').innerHTML=
    '<div class="nav-section sb-toggle" onclick="sbToggle(\'sb-team\',\''+teamKey+'\')" style="cursor:pointer;user-select:none">'+
    '<span>'+navLabel('team')+' ('+(S.contributors||[]).length+')</span><span class="sb-chevron" id="chv-sb-team" style="float:right;font-size:10px;transition:transform .2s">'+(teamOpen?'&#9650;':'&#9660;')+'</span></div>'+
    '<div id="sb-team" style="display:'+(teamOpen?'block':'none')+'">'+
    (S.contributors||[]).map(function(c){
      return '<div class="nav-proj" onclick="go(\'person\',\''+c.person+'\')"><span class="av" style="width:18px;height:18px;font-size:9px">'+initials(c.person)+'</span><span class="nm">'+c.person+'</span></div>';
    }).join('')+'</div>';
}

function sbToggle(id,key){
  var el=document.getElementById(id);var chv=document.getElementById('chv-'+id);
  if(!el)return;
  var open=el.style.display==='none';
  el.style.display=open?'block':'none';
  if(chv)chv.innerHTML=open?'&#9650;':'&#9660;';
  try{localStorage.setItem(key,open?'1':'0');}catch(e){}
}

function updateVerdict(){
  var sem=(S.department||{}).semaforo||{};
  document.getElementById('tbar-verdict').innerHTML=
    [[semLabel('Green'),sem.Green||0],[semLabel('Yellow'),sem.Yellow||0],[semLabel('Red'),sem.Red||0]].map(function(x){
      return '<span class="vdot"><b style="background:'+SEM[x[0]]+'"></b>'+x[1]+'</span>';}).join('');
}

// ─── DATE RANGE ───────────────────────────────────────────────────
function setRange(n){
  document.querySelectorAll('.drpill').forEach(function(p){p.classList.toggle('on',+p.dataset.d===n);});
  TO=ANCHOR; FROM=addDays(ANCHOR,-(n-1));
  document.getElementById('dFrom').value=FROM; document.getElementById('dTo').value=TO;
  renderCurrent();
}
function setCustom(){
  FROM=document.getElementById('dFrom').value||FROM;
  TO=document.getElementById('dTo').value||TO;
  document.querySelectorAll('.drpill').forEach(function(p){p.classList.remove('on');});
  renderCurrent();
}

// ─── ROUTER ───────────────────────────────────────────────────────
function go(route,arg){
  closeExp(); closeSlice();
  ROUTE=route; ROUTE_ARG=arg;
  document.querySelectorAll('.nav-item[data-route]').forEach(function(n){n.classList.toggle('on',n.dataset.route===route);});
  buildSidebar();
  document.querySelectorAll('.nav-proj').forEach(function(n){n.classList.remove('on');});
  if(route==='project'){var e=document.getElementById('np-'+arg); if(e)e.classList.add('on');}
  renderCurrent();
}
function renderCurrent(){
  destroyCharts();
  try{
    if(ROUTE==='overview')renderOverview();
    else if(ROUTE==='project')renderProject(ROUTE_ARG);
    else if(ROUTE==='person')renderPerson(ROUTE_ARG);
    else if(ROUTE==='activity')renderActivity();
  }catch(e){document.getElementById('app').innerHTML='<pre style="color:#E53E3E;padding:20px;font-size:11px">ERROR '+ROUTE+':\n'+e.message+'</pre>';}
}

// ─── OVERVIEW ─────────────────────────────────────────────────────
function renderOverview(){
  document.getElementById('tbar-title').textContent=navLabel('overview');
  var dept=S.department||{}, projs=(S.projects||[]).filter(function(p){return p.visible&&p.active;});
  var days=filt(dept.commits_by_day);
  var totalC=days.reduce(function(a,d){return a+d.commits;},0);
  var dm=dataModel();
  var yr=TO.slice(0,4);
  var calTitle=chartLabel('calendar').yearLabel.replace('{YR}',yr);
  document.getElementById('app').innerHTML=
  // FILA 1: 4 KPI tiles densos
  '<div class="grid g4" id="kpi-row"></div>'+
  // FILA 2: heatmap full-width
  '<div class="card">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
      '<span class="ey" style="margin:0">'+calTitle+'</span>'+
      '<span id="calTotal" class="t3 mono" style="font-size:12px"></span></div>'+
    '<div id="cCal" style="height:130px;width:100%"></div>'+
    '<div id="calLegend" style="display:flex;justify-content:flex-end;align-items:center;gap:4px;font-size:11px;color:#71717A;margin-top:4px"></div>'+
  '</div>'+
  // FILA 3: contribucion + scatter salud
  '<div class="grid g2">'+
    '<div class="card acc" style="display:flex;flex-direction:column"><div class="card-head"><span class="ey">'+chartLabel('contribution').title+'</span><span class="expand-btn" onclick="openExp(\'contrib\')">'+uiLabel('expandButton')+'</span></div><div id="mini-contribs" style="flex:1;display:flex;flex-direction:column;justify-content:space-between"></div></div>'+
    '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
      '<span class="ey" style="margin:0">'+chartLabel('health').title+'</span>'+
      '<span class="t3" style="font-size:10px">'+chartLabel('health').tooltip+'</span></div>'+
      '<div id="cHealth" style="height:260px;width:100%"></div></div>'+
  '</div>'+
  // HERO: grafo + portafolio (conditional on hasGraph)
  (dm.hasGraph && (S.activity||{}).edges && (S.activity||{}).edges.length ?
  '<div class="grid g21">'+
    '<div class="card acc" style="display:flex;flex-direction:column"><div class="card-head"><span class="ey">'+chartLabel('graph').title+'</span><span class="expand-btn" onclick="openExp(\'graph\')">'+uiLabel('expandButton')+'</span></div><div class="ch xl" id="cGraph" style="flex:1"></div></div>'+
    '<div class="card" style="display:flex;flex-direction:column"><div class="card-head"><span class="ey">'+chartLabel('donut').title+'</span><span class="expand-btn" onclick="openExp(\'donut\')">'+uiLabel('expandButton')+'</span></div><div class="ch" id="cPie" style="flex:1;min-height:420px"></div></div>'+
  '</div>' :
  '<div class="card"><div class="ey">'+chartLabel('donut').title+'</div><div class="ch" id="cPie" style="min-height:420px"></div></div>')+
  // line + bar charts
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">'+chartLabel('daily').title+'</div><div class="ch" id="cLine"></div></div>'+
    '<div class="card"><div class="ey">'+chartLabel('byEntity').title+'</div><div class="ch" id="cBar"></div></div>'+
  '</div>'+
  // project cards
  '<div class="ey" style="margin-bottom:-6px">'+cardLabel('activeProjects')+'</div>'+
  '<div class="grid g3" id="proj-cards"></div>';

  document.getElementById('proj-cards').innerHTML=projs.map(function(p){
    var rp=realPct(p);var col=rp>=95?SEM.Green:rp>=75?SEM.Yellow:SEM.Red;
    var badge='';
    if(dm.hasGit){
      badge=p.has_git?'<span class="badge-git">'+cardLabel('gitBadge')+'</span>':'<span class="badge-nogit">'+cardLabel('sinGit')+'</span>';
    }
    return '<div class="pcard" onclick="go(\'project\',\''+p.slug+'\')">'+
      '<div style="display:flex;align-items:center;gap:8px"><span class="sdot" style="background:'+CM[p.slug]+'"></span>'+
      '<span class="pcard-name">'+p.slug+'</span>'+badge+'<span class="sdot" style="background:'+(SEM[p.semaforo]||'#52525B')+'"></span></div>'+
      '<div class="pcard-stats"><div class="pcard-stat"><span class="v mono">'+rp+'%</span><span class="l">'+cardLabel('mvp')+'</span></div>'+
      '<div class="pcard-stat"><span class="v mono">'+p.commits_7d+'</span><span class="l">'+cardLabel('days7')+'</span></div>'+
      '<div class="pcard-stat"><span class="v mono">'+(p.git_dias_sin_actividad==null?'-':p.git_dias_sin_actividad)+'</span><span class="l">'+cardLabel('days')+'</span></div></div>'+
      '<div class="pbar"><i style="width:'+rp+'%;background:'+col+'"></i></div>'+
      '<div style="font-size:11px;color:#71717A">'+(p.owner||'')+' · '+(dm.hasFase?cardLabel('fase')+' '+(p.fase==null?'?':p.fase):'')+'</div></div>';
  }).join('');

  var allCommits=(dept.commits_by_day||[]).reduce(function(a,d){return a+d.commits;},0);
  var avgDay=days.length?(totalC/days.length).toFixed(1):'0';
  document.getElementById('kpi-row').innerHTML=
    kpi(kpiTile(0).label,totalC,avgDay+' '+kpiTile(0).suffix)+
    kpi(kpiTile(1).label,'<span style="font-size:26px">'+( dept.active_projects==null?'-':dept.active_projects)+'</span><span style="font-size:18px;color:#52525B"> / '+(S.projects||[]).length+'</span>',kpiTile(1).suffix)+
    kpi(kpiTile(2).label,dept.contributors_active==null?'-':dept.contributors_active,kpiTile(2).suffix)+
    kpi(kpiTile(3).label,(S.activity&&S.activity.repos?S.activity.repos.length:0),kpiTile(3).suffix);
  document.getElementById('mini-contribs').innerHTML=contribBarsHTML(false);
  document.getElementById('calTotal').textContent=allCommits+' '+chartLabel('calendar').unit;
  document.getElementById('calLegend').innerHTML=uiLabel('less')+' '+['#161618','#3A1D08','#7C2D12','#C2410C','#FB670B'].map(function(c){return '<span style="width:11px;height:11px;border-radius:2px;background:'+c+';display:inline-block"></span>';}).join('')+' '+uiLabel('more');
  if(dm.hasGraph) mkGraph('cGraph',S.activity||{},true);
  mkDonut('cPie');
  mk('cLine',Object.assign(axisTheme(),{xAxis:Object.assign(axisTheme().xAxis,{data:days.map(function(d){return d.date.slice(5);})}),
    series:[lineSeries(days.map(function(d){return d.commits;}),'#FB670B')]}));
  var bp=rankByRange();
  mk('cBar',Object.assign(axisTheme(),{
    xAxis:Object.assign(axisTheme().xAxis,{data:bp.map(function(x){return x.k;}),axisLabel:Object.assign({},AXIS,{rotate:30,interval:0,fontSize:9,fontFamily:'Inter'})}),
    series:[{type:'bar',data:bp.map(function(x){return {value:x.n,itemStyle:{color:CM[x.k]||OTROS,borderRadius:[3,3,0,0]}};})}]}));
  var cal=(dept.commits_by_day||[]).map(function(d){return [d.date,d.commits];});
  calHeatmap('cCal',cal,yr+'-01-01',yr+'-12-31');
  mkHealthScatter('cHealth');
}

function rankByRange(){
  var out={};
  (S.projects||[]).forEach(function(p){
    var pd=(S.projects_detail||{})[p.slug]; var ser=(pd&&pd.commits_by_day)||[];
    out[p.slug]=filt(ser).reduce(function(a,d){return a+d.commits;},0);
  });
  (S.activity&&S.activity.repos?S.activity.repos:[]).forEach(function(r){if(out[r.project||r.repo]==null)out[r.repo]=r.commits||0;});
  return Object.entries(out).map(function(x){return {k:x[0],n:x[1]};}).filter(function(x){return x.n>0;}).sort(function(a,b){return b.n-a.n;}).slice(0,12);
}

// ─── PROJECT ──────────────────────────────────────────────────────
function renderProject(slug){
  var pd=(S.projects_detail||{})[slug]||{}, po=(S.projects||[]).find(function(p){return p.slug===slug;})||{};
  document.getElementById('tbar-title').textContent=slug;
  var color=CM[slug]||OTROS, sem=pd.semaforo||po.semaforo||'Green';
  var days=filt(pd.commits_by_day||[]); var totalC=days.reduce(function(a,d){return a+d.commits;},0);
  var tech=[]; try{tech=JSON.parse((pd.meta&&pd.meta.tech_stack)||'null')||[];}catch(e){}
  var bloqueo=pd.bloqueo||po.bloqueo;
  var pct=pd.pct_mvp==null?po.pct_mvp:pd.pct_mvp; if(pct==null)pct=0; pct=realPct({pct_mvp:pct,fase:po.fase});
  var dm=dataModel();
  var ch=chartLabel('project');
  var semDisplay=(semLabel(sem)||sem);
  document.getElementById('app').innerHTML=
  '<div class="card" style="border-top:3px solid '+color+'"><div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">'+
    '<div class="av lg" style="background:'+color+'22;color:'+color+'">'+slug.slice(0,2).toUpperCase()+'</div>'+
    '<div style="flex:1"><h2 class="sh">'+slug+'</h2>'+
    '<div class="t2" style="font-size:13px;margin-top:4px">'+(po.owner||'')+(dm.hasFase?' · '+cardLabel('fase')+' '+(po.fase==null?'?':po.fase):'')+' · '+(po.classification||'')+'</div>'+
    (pd.status?'<div class="t3" style="font-size:12px;margin-top:4px">'+pd.status+'</div>':'')+'</div>'+
    '<span class="sdot" style="background:'+SEM[sem]+';width:14px;height:14px"></span><span style="color:'+SEM[sem]+'">'+semDisplay+'</span></div></div>'+
  (bloqueo?'<div class="card" style="border-left:3px solid '+SEM.Red+';color:#FDA4A4;font-size:13px"><b>'+ch.blocker+'</b> '+esc(bloqueo)+'</div>':'')+
  '<div class="grid g4">'+
    (dm.hasMVP?'<div class="card acc"><div class="kpi-label">'+cardLabel('mvp')+'</div><div class="kpi-val" style="color:'+(pct>=95?SEM.Green:pct>=75?SEM.Yellow:SEM.Red)+'">'+pct+'%</div><div class="pbar"><i style="width:'+pct+'%;background:'+color+'"></i></div></div>':'')+
    kpi(chartLabel('person').commitsRange,totalC,FROM+' a '+TO)+
    kpi(personPlural(),(pd.contributors||[]).length,'en el rango')+
    (dm.hasGit?kpi(chartLabel('person').daysInactive||'Dias sin actividad',po.git_dias_sin_actividad==null?'-':po.git_dias_sin_actividad,'(git real)'):'')+
  '</div>'+
  '<div class="card"><div class="ey">'+ch.activityMap+'</div><div class="ch tall" id="pCal"></div></div>'+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">'+ch.commitsOverTime+'</div><div class="ch" id="pLine"></div></div>'+
    (dm.hasMVP?'<div class="card"><div class="ey">'+ch.mvpGauge+'</div><div class="ch" id="pGauge"></div></div>':'')+
  '</div>'+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">'+ch.contributors+'</div><div class="ch" id="pContrib"></div></div>'+
    (dm.hasBranches?'<div class="card"><div class="ey">'+ch.stack+'</div>'+
      (tech.length?'<div class="chips" style="margin-bottom:14px">'+tech.map(function(t){return '<span class="chip">'+t+'</span>';}).join('')+'</div>':'')+
      '<div id="pBranches"></div></div>':'')+
  '</div>'+
  (dm.hasCommitFeed?'<div class="card"><div class="ey">'+ch.recentCommits+'</div><div id="pCommits"></div></div>':'');

  var cal=(pd.commits_by_day||[]).map(function(d){return [d.date,d.commits];});
  calHeatmap('pCal',cal,cal.length?cal[0][0]:FROM,cal.length?cal[cal.length-1][0]:TO);
  mk('pLine',Object.assign(axisTheme(),{xAxis:Object.assign(axisTheme().xAxis,{data:days.map(function(d){return d.date.slice(5);})}),series:[lineSeries(days.map(function(d){return d.commits;}),color)]}));
  if(dm.hasMVP){
    mk('pGauge',{series:[{type:'gauge',startAngle:210,endAngle:-30,radius:'90%',progress:{show:true,width:14,itemStyle:{color:pct>=95?SEM.Green:pct>=75?SEM.Yellow:SEM.Red}},
      axisLine:{lineStyle:{width:14,color:[[1,'#27272A']]}},pointer:{show:false},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false},
      detail:{valueAnimation:true,formatter:'{value}%',fontSize:30,fontFamily:'JetBrains Mono',fontWeight:700,color:'#FAFAFA',offsetCenter:[0,'8%']},data:[{value:pct}]}]});
  }
  var ctr=pd.contributors||[];
  if(ctr.length)mk('pContrib',Object.assign(axisTheme(),{grid:{left:110,right:20,top:10,bottom:24},
    xAxis:{type:'value',splitLine:{lineStyle:GRID},axisLabel:AXIS},
    yAxis:{type:'category',data:ctr.map(function(c){return c.person;}).reverse(),axisLabel:{color:'#A1A1AA',fontFamily:'Inter',fontSize:11}},
    series:[{type:'bar',data:ctr.map(function(c){return {value:c.commits,itemStyle:{color:color,borderRadius:[0,3,3,0]}};}).reverse()}]}));
  if(dm.hasBranches){
    var br=pd.branches||[];
    document.getElementById('pBranches').innerHTML=br.length?br.map(function(b){
      return '<div class="branch-row"><span class="mono t2" style="flex:1;font-size:12px">'+b.branch+'</span>'+
        (b.ahead>0?'<span class="pill ah">+'+b.ahead+' ahead</span>':'')+
        '<span class="t3" style="font-size:11px">'+b.commits_count+' commits</span></div>';
    }).join(''):'<span class="t3" style="font-size:12px">'+ch.noBranches+'</span>';
  }
  if(dm.hasCommitFeed){
    document.getElementById('pCommits').innerHTML=(pd.recent||[]).map(function(c){
      return '<div class="commit"><span class="sha">'+c.sha+'</span><span class="msg">'+esc(c.msg||'')+'</span><span class="meta">'+(c.author||'')+' · '+(c.committed_date||'')+'</span></div>';
    }).join('')||'<span class="t3">'+ch.noCommits+'</span>';
  }
}

// ─── PERSON ───────────────────────────────────────────────────────
function renderPerson(person){
  var pd=(S.persons_detail||{})[person]||{};
  document.getElementById('tbar-title').textContent=person;
  var days=filt(pd.commits_by_day||[]); var totalC=days.reduce(function(a,d){return a+d.commits;},0);
  var cht=chartLabel('person');
  document.getElementById('app').innerHTML=
  '<div class="card" style="border-left:3px solid '+SEM.Green+'"><div style="display:flex;align-items:center;gap:18px">'+
    '<div class="av lg">'+initials(person)+'</div><div><h2 class="sh">'+person+'</h2>'+
    '<div class="t2 mono" style="font-size:13px;margin-top:6px">'+totalC+' '+cht.commitsInRange+' · '+(pd.repos||[]).length+' '+cht.repos+'</div></div></div></div>'+
  '<div class="grid g3">'+kpi(cht.commitsRange,totalC,FROM+' a '+TO)+kpi(cht.repos,(pd.repos||[]).length,cht.withActivity)+kpi(cht.totalGlobal,pd.total_commits==null?'-':pd.total_commits,cht.historical)+'</div>'+
  '<div class="card"><div class="ey">'+cht.activityMap+'</div><div class="ch tall" id="prCal"></div></div>'+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">'+cht.commitsByRepo+'</div><div class="ch" id="prBar"></div></div>'+
    '<div class="card"><div class="ey">'+cht.dailyActivity+'</div><div class="ch" id="prLine"></div></div>'+
  '</div>'+
  '<div class="card"><div class="ey">'+cht.recentCommits+'</div><div id="prCommits"></div></div>';
  var cal=(pd.commits_by_day||[]).map(function(d){return [d.date,d.commits];});
  calHeatmap('prCal',cal,cal.length?cal[0][0]:FROM,cal.length?cal[cal.length-1][0]:TO);
  var repos=(pd.repos||[]).slice(0,10);
  if(repos.length)mk('prBar',Object.assign(axisTheme(),{grid:{left:130,right:20,top:10,bottom:24},
    xAxis:{type:'value',splitLine:{lineStyle:GRID},axisLabel:AXIS},
    yAxis:{type:'category',data:repos.map(function(r){return r.repo;}).reverse(),axisLabel:{color:'#A1A1AA',fontFamily:'Inter',fontSize:11}},
    series:[{type:'bar',data:repos.map(function(r){return {value:r.commits,itemStyle:{color:CM[r.project]||OTROS,borderRadius:[0,3,3,0]}};}).reverse()}]}));
  mk('prLine',Object.assign(axisTheme(),{xAxis:Object.assign(axisTheme().xAxis,{data:days.map(function(d){return d.date.slice(5);})}),series:[lineSeries(days.map(function(d){return d.commits;}),'#FB670B')]}));
  document.getElementById('prCommits').innerHTML=(pd.recent||[]).map(function(c){
    return '<div class="commit"><span class="sha">'+c.sha+'</span><span class="msg">'+esc(c.msg||'')+' <span class="t3">['+c.repo+']</span></span><span class="meta">'+(c.committed_date||'')+'</span></div>';
  }).join('');
}

// ─── ACTIVITY ─────────────────────────────────────────────────────
function renderActivity(){
  document.getElementById('tbar-title').textContent=chartLabel('activity').title;
  var act=S.activity||{}, totalE=(act.edges||[]).reduce(function(a,e){return a+e.commits;},0);
  var cht=chartLabel('activity');
  document.getElementById('app').innerHTML=
  '<div class="grid g3">'+kpi(cht.activeRepos,(act.repos||[]).length,'')+kpi(cht.contributors,(act.contributors||[]).length,'')+kpi(cht.connections,totalE,cht.commitsInRange)+'</div>'+
  (dataModel().hasGraph?'<div class="card acc"><div class="ey">'+cht.network+'</div><div class="ch xl" id="aGraph" style="min-height:540px"></div></div>':'')+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">'+cht.reposByCommits+'</div><table class="tbl"><tr><th>'+cht.tableRepo+'</th><th>'+cht.tableCommits+'</th><th>'+cht.tableLast+'</th></tr>'+
      (act.repos||[]).map(function(r){return '<tr><td><span class="sdot" style="background:'+(CM[r.project]||OTROS)+'"></span> '+r.repo+'</td><td class="mono">'+r.commits+'</td><td class="t3 mono" style="font-size:11px">'+(r.last_commit_at||'').slice(0,10)+'</td></tr>';}).join('')+'</table></div>'+
    '<div class="card"><div class="ey">'+cht.personsByCommits+'</div><table class="tbl"><tr><th>'+cht.tablePerson+'</th><th>'+cht.tableCommits+'</th><th>'+cht.tableRepos+'</th></tr>'+
      (act.contributors||[]).map(function(c){return '<tr style="cursor:pointer" onclick="go(\'person\',\''+c.person+'\')"><td>'+c.person+'</td><td class="mono">'+c.commits+'</td><td class="mono">'+c.repos+'</td></tr>';}).join('')+'</table></div>'+
  '</div>';
  if(dataModel().hasGraph) mkGraph('aGraph',act,true);
}

// ─── CONFIG MODAL ─────────────────────────────────────────────────
function openConfig(){
  document.getElementById('cfg-list').innerHTML=(S.projects||[]).map(function(p){
    return '<div class="cfg-row" id="cfg-'+p.slug+'">'+
      '<div class="cfg-head"><span class="sdot" style="background:'+(CM[p.slug]||OTROS)+'"></span>'+
      '<b style="flex:1">'+p.slug+'</b><span class="t3" style="font-size:11px">'+(p.classification||'')+'</span>'+
      '<div class="toggle '+(p.visible?'on':'')+'" onclick="toggleVis(\''+p.slug+'\',this)"><i></i></div></div>'+
      '<div class="cfg-field"><label>'+cfgLabel('owner')+'</label><input class="inp" id="own-'+p.slug+'" value="'+(p.owner||'')+'"></div>'+
      '<div class="cfg-field"><label>'+cfgLabel('collabs')+'</label><div style="flex:1">'+
        (p.colabs||[]).map(function(c){return '<span class="colab-tag">'+c+' <b title="'+cfgLabel('removeCollab')+'" onclick="retireColab(\''+p.slug+'\',\''+c+'\')">&times;</b></span>';}).join('')+
        ((p.colabs||[]).length?'':'<span class="t3" style="font-size:12px">'+cfgLabel('noCollaborators')+'</span>')+'</div></div>'+
      '<div style="text-align:right;margin-top:8px"><button class="btn sm prim" onclick="saveProj(\''+p.slug+'\')">'+cfgLabel('save')+'</button></div>'+
    '</div>';
  }).join('');
  document.getElementById('cfgModal').classList.add('on');
}
function closeConfig(){document.getElementById('cfgModal').classList.remove('on');}
function toggleVis(slug,el){el.classList.toggle('on');}
function saveProj(slug){
  var visible=document.querySelector('#cfg-'+slug+' .toggle').classList.contains('on');
  var owner=document.getElementById('own-'+slug).value;
  CFG[slug]=Object.assign({},CFG[slug],{visible:visible,owner:owner});
  saveCfgLocal();
  fetch('/api/config/project/'+encodeURIComponent(slug),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visible:visible,owner:owner})}).catch(function(){});
  applyCfg(); buildSidebar();
  var p=(S.projects||[]).find(function(x){return x.slug===slug;}); if(p){p.visible=visible;p.owner=owner;}
  document.querySelector('#cfg-'+slug).style.borderColor='var(--ve)';
}
function retireColab(slug,person){
  var msg=cfgLabel('retireConfirm').replace('{PERSON}',person).replace('{SLUG}',slug);
  if(!confirm(msg))return;
  fetch('/api/projects/'+encodeURIComponent(slug)+'/retire-collab',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({person:person})})
    .then(function(r){return r.json();})
    .then(function(d){ alert('Resultado:\n'+JSON.stringify(d,null,2)); })
    .catch(function(e){ alert('No se pudo (requiere server corriendo): '+e.message+'\n\nManual: el agente IA mergea '+person+' branch a master y la borra.'); });
}

// ─── EXPORT MOVIL: DOM efimero ────────────────────────────────────
function buildMobileExportDOM(fromSnap,toSnap){
  var dept=S.department||{}, projs=(S.projects||[]).filter(function(p){return p.visible&&p.active;});
  var days=filt(dept.commits_by_day);
  var totalC=days.reduce(function(a,d){return a+d.commits;},0);
  var avgDay=days.length?(totalC/days.length).toFixed(1):'0';
  var bp=rankByRange();
  var projActiveRange=projs.filter(function(p){return projRangeCommits(p.slug)>0;}).length;
  var personsRange=(S.contributors||[]).filter(function(c){return personRangeCommits(c.person)>0;}).length;
  var reposRange=bp.length;
  var semV=0,semA=0,semR=0;
  projs.forEach(function(p){var r=realPct(p); if(r>=95)semV++; else if(r>=75)semA++; else semR++;});
  var ordered=projs.slice().sort(function(a,b){return realPct(b)-realPct(a);});
  var b=brand(), cht=chartLabel('export');
  // veil
  var veil=document.createElement('div');
  veil.id='mexport-veil';
  veil.style.cssText='position:fixed;inset:0;background:#09090B;z-index:2147483647';
  document.body.appendChild(veil);
  var wrap=document.createElement('div');
  wrap.id='mexport-root'; wrap.className='mexport';
  wrap.style.cssText='position:fixed;left:0;top:0;z-index:2147483646';
  wrap.innerHTML=
    '<div class="mex-top">'+
      '<div class="mex-brand"><div class="mex-logo">'+b.logo+'</div>'+
        '<div><div class="mex-bt">'+b.subtitle+'</div><div class="mex-bs">'+b.org+'</div></div></div>'+
      '<div class="mex-range">periodo<b>'+fromSnap+'</b><b>'+toSnap+'</b></div>'+
    '</div>'+
    '<div class="mex-kpis">'+
      mexKpi(kpiTile(0).label,totalC,avgDay+'/dia')+
      mexKpi(kpiTile(1).label,projActiveRange+'/'+(S.projects||[]).length,cht.active)+
      mexKpi(kpiTile(2).label,personsRange,'activas')+
      mexKpi(kpiTile(3).label,reposRange,cht.active)+
    '</div>'+
    '<div class="mex-secrow"><span class="mex-ey">'+cardLabel('activeProjects')+'</span>'+
      '<span class="mex-sem">'+
        '<span><i style="background:'+SEM.Green+'"></i><b>'+semV+'</b></span>'+
        '<span><i style="background:'+SEM.Yellow+'"></i><b>'+semA+'</b></span>'+
        '<span><i style="background:'+SEM.Red+'"></i><b>'+semR+'</b></span>'+
      '</span></div>'+
    '<div class="mex-grid">'+ordered.map(mexPCard).join('')+'</div>'+
    '<div class="mex-foot"><span>'+cht.brand+' · '+cht.confidential+'</span><span>'+totalC+' '+cht.footer+'</span></div>';
  document.body.appendChild(wrap);
  return {root:wrap, veil:veil};
}
function mexLogros(slug){
  var d=(S.projects_detail||{})[slug]||{};
  var rec=(d.recent||[]).filter(function(c){
    return c.msg && c.committed_date>=FROM && c.committed_date<=TO && c.msg.indexOf('Add files via upload')!==0;
  });
  if(!rec.length)return [];
  var order={feat:0,fix:1,perf:2,refactor:3};
  function typ(m){return (m||'').toLowerCase().split(/[:(]/)[0];}
  function sc(m){var t=typ(m); return (t in order)?order[t]:6;}
  rec.sort(function(a,b){return sc(a.msg)-sc(b.msg);});
  function clean(m){
    m=(m||'').replace(/^(feat|fix|refactor|perf|docs|chore|style|test|build|ci|ops|data|backup|revert)(\([^)]*\))?:\s*/i,'');
    return m.charAt(0).toUpperCase()+m.slice(1);
  }
  var seen={}, out=[];
  for(var i=0;i<rec.length && out.length<2;i++){
    var c=clean(rec[i].msg).trim();
    if(c.length>2 && !seen[c.toLowerCase()]){seen[c.toLowerCase()]=1; out.push(c);}
  }
  return out;
}
function mexPCard(p){
  var rp=realPct(p), col=rp>=95?SEM.Green:rp>=75?SEM.Yellow:SEM.Red;
  var dias=p.git_dias_sin_actividad==null?'-':p.git_dias_sin_actividad;
  var logros=mexLogros(p.slug);
  var logHtml=logros.length
    ? logros.map(function(l){return '<div class="mex-logline">'+esc(l)+'</div>';}).join('')
    : '<div class="mex-logline mex-lognone">Sin commits en el rango</div>';
  return '<div class="mex-pcard">'+
    '<div class="mex-pn"><span class="mex-dot" style="background:'+(CM[p.slug]||'#606060')+'"></span>'+
      '<span class="mex-pname">'+esc(p.slug)+'</span></div>'+
    '<div class="mex-prow"><span class="mex-pct" style="color:'+col+'">'+rp+'<s>% '+cardLabel('mvp')+'</s></span>'+
      '<span class="mex-stat"><b>'+(p.commits_7d||0)+'</b> '+cardLabel('days7')+' &middot; <b>'+dias+'</b> d</span></div>'+
    '<div class="mex-bar"><i style="width:'+rp+'%;background:'+col+'"></i></div>'+
    '<div class="mex-logros">'+logHtml+'</div>'+
    '<div class="mex-meta">'+esc(p.owner||'')+' &middot; '+(dataModel().hasFase?cardLabel('fase')+' '+(p.fase==null?'?':p.fase):'')+'</div>'+
  '</div>';
}
function mexKpi(l,v,s){
  return '<div class="mex-kpi"><div class="mex-kl">'+l+'</div><div class="mex-kv">'+v+'</div><div class="mex-ks">'+s+'</div></div>';
}

// ─── EXPORT ───────────────────────────────────────────────────────
let EXPBUSY=false;
function snapPng(node,scale){
  return Promise.race([
    snapdom.toPng(node,{scale:scale,backgroundColor:'#09090B'}),
    new Promise(function(_,rj){setTimeout(function(){rj(new Error('timeout'));},20000);})
  ]);
}
function triggerDownload(img,name){
  var a=document.createElement('a');a.href=img.src;a.download=name;
  document.body.appendChild(a);a.click();a.remove();
}
async function exportImg(mode){
  if(EXPBUSY||!window.snapdom)return;
  mode=mode||'both';
  var msg=document.getElementById('expmsg');EXPBUSY=true;
  var fSnap=FROM, tSnap=TO, fileRoute=ROUTE;
  var prevOnerror=window.onerror; window.onerror=null;
  var expBtn=document.querySelector('.btn[onclick^="exportImg"]');
  var expLabel=expBtn?expBtn.textContent:'';
  if(expBtn){expBtn.disabled=true;expBtn.textContent=uiLabel('loading');}
  var btns=document.querySelectorAll('.expand-btn');btns.forEach(function(b){b.style.display='none';});
  var ctrls=document.querySelectorAll('.drpill,.dinput');
  ctrls.forEach(function(c){c.style.pointerEvents='none';c.style.opacity='.4';});
  var mroot=null,mveil=null,okD=false,okM=false,errD='',errM='';
  var cht=chartLabel('export');
  try{
    try{await Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,1500);})]);}catch(e){}
    if(mode==='desktop'||mode==='both'){
      msg.textContent=cht.generating||'generating desktop…';
      await new Promise(function(r){setTimeout(r,300);});
      CHARTS.forEach(function(c){try{c.resize();}catch(e){}});
      await new Promise(function(r){setTimeout(r,120);});
      try{
        var imgD=await snapPng(document.getElementById('app'),2);
        triggerDownload(imgD,'Observatory_'+fileRoute+'_'+tSnap+'_desktop.png');
        okD=true;
      }catch(e){errD=e.message;}
    }
    if(mode==='mobile'||mode==='both'){
      msg.textContent=cht.generating||'generating mobile…';
      try{
        var built=buildMobileExportDOM(fSnap,tSnap);
        mroot=built.root; mveil=built.veil;
        await settleExportCharts();
        await new Promise(function(r){setTimeout(r,150);});
        var imgM=await snapPng(mroot,3);
        triggerDownload(imgM,'Observatory_'+fileRoute+'_'+tSnap+'_mobile.png');
        okM=true;
      }catch(e){errM=e.message;}
    }
    if(mode==='both'){
      msg.textContent=cht.desktopOk+': '+(okD?'ok':'fallo '+errD)+' · '+cht.mobileOk+': '+(okM?'ok':'fallo '+errM);
    }else if(mode==='desktop'){msg.textContent=okD?uiLabel('done')+' desktop':'Error desktop: '+errD;
    }else{msg.textContent=okM?uiLabel('done')+' mobile':'Error mobile: '+errM;}
  }catch(e){msg.textContent=uiLabel('error')+' '+e.message;}
  finally{
    disposeExportCharts();
    if(mroot&&mroot.parentNode)mroot.parentNode.removeChild(mroot);
    if(mveil&&mveil.parentNode)mveil.parentNode.removeChild(mveil);
    ['mexport-root','mexport-veil'].forEach(function(id){var n=document.getElementById(id);if(n&&n.parentNode)n.parentNode.removeChild(n);});
    btns.forEach(function(b){b.style.display='';});
    ctrls.forEach(function(c){c.style.pointerEvents='';c.style.opacity='';});
    if(expBtn){expBtn.disabled=false;expBtn.textContent=expLabel||uiLabel('exportButton');}
    FROM=fSnap; TO=tSnap;
    window.onerror=prevOnerror;
    EXPBUSY=false;
  }
}

// Fallback: if pres-config-kit.js fails, openPresConfig uses startPres directly
if(typeof openPresConfig==='undefined'){window.openPresConfig=startPres;}

// ─── BOOT ─────────────────────────────────────────────────────────
window.onerror=function(m,u,l,c,e){var el=document.getElementById('app');if(el)el.innerHTML='<pre style="color:#E53E3E;padding:20px;font-size:11px">ERROR:\n'+m+(e?'\n'+e.stack:'')+'</pre>';};
function checkServer(){
  fetch('/api/health').then(function(r){return r.ok?r.json():Promise.reject();}).then(function(){
    var b=document.getElementById('syncBtn');b.disabled=false;b.title=uiLabel('refreshButton');
  }).catch(function(){});
}
(function(){
  checkServer();
  if(typeof loadUnenrolled==='function') loadUnenrolled();
  try{
    if(window.SNAPSHOT){init(window.SNAPSHOT);}
    else{fetch('snapshot.json').then(function(r){return r.json();}).then(init).catch(function(){document.getElementById('app').innerHTML='<div style="padding:40px;color:#71717A">'+uiLabel('noData')+'</div>';});}
  }catch(e){var el=document.getElementById('app');if(el)el.innerHTML='<pre style="color:#E53E3E;padding:20px;font-size:11px">ERROR init:\n'+e.message+'</pre>';}
})();
