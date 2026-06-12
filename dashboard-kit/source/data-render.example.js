/* SOURCE: data-render.example.js — edit this file, run build_dashboard.py to rebuild */
// Replace with your project data
// This file is an example — swap placeholder names and data with your real snapshot.

// ─── GLOBALS ──────────────────────────────────────────────────────
const PALETTE=['#FB670B','#14B8A6','#38BDF8','#A78BFA','#00A36E','#F59E0B'];
const OTROS='#606060';
const SEM={Green:'#00A36E',Yellow:'#D97706',Red:'#E53E3E',Gray:'#52525B',Excluded:'#52525B'};
const GRID={color:'rgba(255,255,255,.06)'};
const AXIS={color:'#71717A',fontFamily:'JetBrains Mono',fontSize:11};
let S=null, CM={}, ROUTE='overview', ROUTE_ARG=null, CHARTS=[], MCHARTS=[];
let ANCHOR='2024-01-31', FROM='2024-01-01', TO='2024-01-31';
let CFG={};  // local overrides {slug:{visible,owner,colabs}}

// ─── INIT ─────────────────────────────────────────────────────────
function init(snap){
  S=snap;
  loadCfg();
  applyCfg();
  // Replace with your project data
  (S.projects||[]).forEach(function(p,i){CM[p.slug]=i<6?PALETTE[i]:OTROS;});
  var days=(S.department||{}).commits_by_day||[];
  ANCHOR = days.length?days[days.length-1].date:'2024-01-31';
  TO=ANCHOR; FROM=addDays(ANCHOR,-29);
  document.getElementById('dFrom').value=FROM;
  document.getElementById('dTo').value=TO;
  buildSidebar(); updateVerdict(); updateFreshChip();
  go('overview');
}

// ─── FRESH CHIP — data staleness indicator (uses data_as_of, not generated_at) ──
// Creates/updates a chip next to the Refresh button showing how old the data is.
// setInterval keeps it updated while the page is open.
let FRESH_TIMER=null;
function updateFreshChip(){
  var btn=document.getElementById('syncBtn'); if(!btn)return;
  var chip=document.getElementById('freshChip');
  if(!chip){chip=document.createElement('span');chip.id='freshChip';chip.className='fresh-chip';btn.insertAdjacentElement('beforebegin',chip);}
  var src=S?(S.data_as_of||S.generated_at):null;
  if(!src){chip.textContent='data: ?';return;}
  var t=src.length<=10?new Date(src+'T00:00:00'):new Date(src);
  var h=(Date.now()-t.getTime())/3600000;
  var label=h<1?'<1h':h<48?Math.round(h)+'h':Math.round(h/24)+'d';
  chip.textContent='data: '+label+' ago';
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
      (p.visible?'':'<span class="st">hidden</span>')+'</div>';
  }
  var html=act.filter(function(p){return p.visible;}).map(row).join('');
  var hidden=(S.projects||[]).filter(function(p){return !p.visible;});
  if(ina.filter(function(p){return p.visible;}).length){
    html+='<div class="nav-section" style="padding-top:8px"><span>Other status</span></div>';
    html+=ina.filter(function(p){return p.visible;}).map(row).join('');
  }
  if(hidden.length){
    html+='<div class="nav-section" style="padding-top:8px"><span>Hidden ('+hidden.length+')</span></div>';
    html+=hidden.map(row).join('');
  }
  document.getElementById('aside-projects').innerHTML=html;
  document.getElementById('aside-persons').innerHTML=(S.contributors||[]).map(function(c){
    return '<div class="nav-proj" onclick="go(\'person\',\''+c.person+'\')"><span class="av" style="width:18px;height:18px;font-size:9px">'+initials(c.person)+'</span><span class="nm">'+c.person+'</span></div>';
  }).join('');
}

function updateVerdict(){
  var sem=(S.department||{}).semaforo||{};
  document.getElementById('tbar-verdict').innerHTML=
    [['Green',sem.Green||0],['Yellow',sem.Yellow||0],['Red',sem.Red||0]].map(function(x){
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
  document.getElementById('tbar-title').textContent='Department';
  var dept=S.department||{}, projs=(S.projects||[]).filter(function(p){return p.visible&&p.active;});
  var days=filt(dept.commits_by_day);
  var totalC=days.reduce(function(a,d){return a+d.commits;},0);
  document.getElementById('app').innerHTML=
  // ROW 1: 4 dense KPI tiles
  '<div class="grid g4" id="kpi-row"></div>'+
  // ROW 2: full-width heatmap (full year -> fills 52 weeks)
  '<div class="card">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'+
      '<span class="ey" style="margin:0">Activity</span>'+
      '<span id="calTotal" class="t3 mono" style="font-size:12px"></span></div>'+
    '<div id="cCal" style="height:130px;width:100%"></div>'+
    '<div id="calLegend" style="display:flex;justify-content:flex-end;align-items:center;gap:4px;font-size:11px;color:#71717A;margin-top:4px"></div>'+
  '</div>'+
  // ROW 3: contribution bars | health scatter
  '<div class="grid g2">'+
    '<div class="card acc" style="display:flex;flex-direction:column"><div class="card-head"><span class="ey">Contribution by person</span><span class="expand-btn" onclick="openExp(\'contrib\')">expand</span></div><div id="mini-contribs" style="flex:1;display:flex;flex-direction:column;justify-content:space-between"></div></div>'+
    '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
      '<span class="ey" style="margin:0">Portfolio health</span>'+
      '<span class="t3" style="font-size:10px">● commits/7d &nbsp; X=activity &nbsp; Y=MVP%</span></div>'+
      '<div id="cHealth" style="height:260px;width:100%"></div></div>'+
  '</div>'+
  // HERO: graph + portfolio
  '<div class="grid g21">'+
    '<div class="card acc" style="display:flex;flex-direction:column"><div class="card-head"><span class="ey">Who works on what</span><span class="expand-btn" onclick="openExp(\'graph\')">expand</span></div><div class="ch xl" id="cGraph" style="flex:1"></div></div>'+
    '<div class="card" style="display:flex;flex-direction:column"><div class="card-head"><span class="ey">Portfolio</span><span class="expand-btn" onclick="openExp(\'donut\')">expand</span></div><div class="ch" id="cPie" style="flex:1;min-height:420px"></div></div>'+
  '</div>'+
  // line + bar
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">Daily activity (commits)</div><div class="ch" id="cLine"></div></div>'+
    '<div class="card"><div class="ey">Commits by project</div><div class="ch" id="cBar"></div></div>'+
  '</div>'+
  // project cards
  '<div class="ey" style="margin-bottom:-6px">Active projects</div>'+
  '<div class="grid g3" id="proj-cards"></div>';

  document.getElementById('proj-cards').innerHTML=projs.map(function(p){
    var col=p.pct_mvp>=80?SEM.Green:p.pct_mvp>=50?SEM.Yellow:SEM.Red;
    return '<div class="pcard" onclick="go(\'project\',\''+p.slug+'\')">'+
      '<div style="display:flex;align-items:center;gap:8px"><span class="sdot" style="background:'+CM[p.slug]+'"></span>'+
      '<span class="pcard-name">'+p.slug+'</span><span class="sdot" style="background:'+(SEM[p.semaforo]||'#52525B')+'"></span></div>'+
      '<div class="pcard-stats"><div class="pcard-stat"><span class="v mono">'+(p.pct_mvp==null?'?':p.pct_mvp)+'%</span><span class="l">MVP</span></div>'+
      '<div class="pcard-stat"><span class="v mono">'+p.commits_7d+'</span><span class="l">7d</span></div>'+
      '<div class="pcard-stat"><span class="v mono">'+(p.git_dias_sin_actividad==null?'-':p.git_dias_sin_actividad)+'</span><span class="l">days</span></div></div>'+
      '<div class="pbar"><i style="width:'+(p.pct_mvp||0)+'%;background:'+col+'"></i></div>'+
      '<div style="font-size:11px;color:#71717A">'+(p.owner||'')+' · Phase '+(p.fase==null?'?':p.fase)+'</div></div>';
  }).join('');

  var allCommits=(dept.commits_by_day||[]).reduce(function(a,d){return a+d.commits;},0);
  var avgDay=days.length?(totalC/days.length).toFixed(1):'0';
  document.getElementById('kpi-row').innerHTML=
    kpi('Commits',totalC,avgDay+' per day · range')+
    kpi('Projects','<span style="font-size:26px">'+( dept.active_projects==null?'-':dept.active_projects)+'</span><span style="font-size:18px;color:#52525B"> / '+(S.projects||[]).length+'</span>','active / total')+
    kpi('Persons',dept.contributors_active==null?'-':dept.contributors_active,'active in range')+
    kpi('Repos',(S.activity&&S.activity.repos?S.activity.repos.length:0),'with activity');
  document.getElementById('mini-contribs').innerHTML=contribBarsHTML(false);
  document.getElementById('calTotal').textContent=allCommits+' commits';
  document.getElementById('calLegend').innerHTML='Less '+['#161618','#3A1D08','#7C2D12','#C2410C','#FB670B'].map(function(c){return '<span style="width:11px;height:11px;border-radius:2px;background:'+c+';display:inline-block"></span>';}).join('')+' More';
  mkGraph('cGraph',S.activity||{},true);
  mkDonut('cPie');
  mk('cLine',Object.assign(axisTheme(),{xAxis:Object.assign(axisTheme().xAxis,{data:days.map(function(d){return d.date.slice(5);})}),
    series:[lineSeries(days.map(function(d){return d.commits;}),'#FB670B')]}));
  var bp=rankByRange();
  mk('cBar',Object.assign(axisTheme(),{
    xAxis:Object.assign(axisTheme().xAxis,{data:bp.map(function(x){return x.k;}),axisLabel:Object.assign({},AXIS,{rotate:30,interval:0,fontSize:9,fontFamily:'Inter'})}),
    series:[{type:'bar',data:bp.map(function(x){return {value:x.n,itemStyle:{color:CM[x.k]||OTROS,borderRadius:[3,3,0,0]}};})}]}));
  var cal=(dept.commits_by_day||[]).map(function(d){return [d.date,d.commits];});
  var yr=TO.slice(0,4); calHeatmap('cCal',cal,yr+'-01-01',yr+'-12-31');
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
  var pct=pd.pct_mvp==null?po.pct_mvp:pd.pct_mvp; if(pct==null)pct=0;
  document.getElementById('app').innerHTML=
  '<div class="card" style="border-top:3px solid '+color+'"><div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">'+
    '<div class="av lg" style="background:'+color+'22;color:'+color+'">'+slug.slice(0,2).toUpperCase()+'</div>'+
    '<div style="flex:1"><h2 class="sh">'+slug+'</h2>'+
    '<div class="t2" style="font-size:13px;margin-top:4px">'+(po.owner||'')+' · Phase '+(po.fase==null?'?':po.fase)+' · '+(po.classification||'')+'</div>'+
    (pd.status?'<div class="t3" style="font-size:12px;margin-top:4px">'+pd.status+'</div>':'')+'</div>'+
    '<span class="sdot" style="background:'+SEM[sem]+';width:14px;height:14px"></span><span style="color:'+SEM[sem]+'">'+sem+'</span></div></div>'+
  (bloqueo?'<div class="card" style="border-left:3px solid '+SEM.Red+';color:#FDA4A4;font-size:13px"><b>Blocker:</b> '+esc(bloqueo)+'</div>':'')+
  '<div class="grid g4">'+
    '<div class="card acc"><div class="kpi-label">MVP</div><div class="kpi-val" style="color:'+(pct>=80?SEM.Green:pct>=50?SEM.Yellow:SEM.Red)+'">'+pct+'%</div><div class="pbar"><i style="width:'+pct+'%;background:'+color+'"></i></div></div>'+
    kpi('Commits (range)',totalC,FROM+' to '+TO)+
    kpi('Persons',(pd.contributors||[]).length,'in range')+
    kpi('Days inactive',po.git_dias_sin_actividad==null?'-':po.git_dias_sin_actividad,'(real git)')+
  '</div>'+
  '<div class="card"><div class="ey">Activity map</div><div class="ch tall" id="pCal"></div></div>'+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">Commits over time</div><div class="ch" id="pLine"></div></div>'+
    '<div class="card"><div class="ey">MVP gauge</div><div class="ch" id="pGauge"></div></div>'+
  '</div>'+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">Contributors (range)</div><div class="ch" id="pContrib"></div></div>'+
    '<div class="card"><div class="ey">Stack & branches</div>'+
      (tech.length?'<div class="chips" style="margin-bottom:14px">'+tech.map(function(t){return '<span class="chip">'+t+'</span>';}).join('')+'</div>':'')+
      '<div id="pBranches"></div></div>'+
  '</div>'+
  '<div class="card"><div class="ey">Recent commits</div><div id="pCommits"></div></div>';

  var cal=(pd.commits_by_day||[]).map(function(d){return [d.date,d.commits];});
  calHeatmap('pCal',cal,cal.length?cal[0][0]:FROM,cal.length?cal[cal.length-1][0]:TO);
  mk('pLine',Object.assign(axisTheme(),{xAxis:Object.assign(axisTheme().xAxis,{data:days.map(function(d){return d.date.slice(5);})}),series:[lineSeries(days.map(function(d){return d.commits;}),color)]}));
  mk('pGauge',{series:[{type:'gauge',startAngle:210,endAngle:-30,radius:'90%',progress:{show:true,width:14,itemStyle:{color:pct>=80?SEM.Green:pct>=50?SEM.Yellow:SEM.Red}},
    axisLine:{lineStyle:{width:14,color:[[1,'#27272A']]}},pointer:{show:false},axisTick:{show:false},axisLabel:{show:false},splitLine:{show:false},
    detail:{valueAnimation:true,formatter:'{value}%',fontSize:30,fontFamily:'JetBrains Mono',fontWeight:700,color:'#FAFAFA',offsetCenter:[0,'8%']},data:[{value:pct}]}]});
  var ctr=pd.contributors||[];
  if(ctr.length)mk('pContrib',Object.assign(axisTheme(),{grid:{left:110,right:20,top:10,bottom:24},
    xAxis:{type:'value',splitLine:{lineStyle:GRID},axisLabel:AXIS},
    yAxis:{type:'category',data:ctr.map(function(c){return c.person;}).reverse(),axisLabel:{color:'#A1A1AA',fontFamily:'Inter',fontSize:11}},
    series:[{type:'bar',data:ctr.map(function(c){return {value:c.commits,itemStyle:{color:color,borderRadius:[0,3,3,0]}};}).reverse()}]}));
  var br=pd.branches||[];
  document.getElementById('pBranches').innerHTML=br.length?br.map(function(b){
    return '<div class="branch-row"><span class="mono t2" style="flex:1;font-size:12px">'+b.branch+'</span>'+
      (b.ahead>0?'<span class="pill ah">+'+b.ahead+' ahead</span>':'')+
      '<span class="t3" style="font-size:11px">'+b.commits_count+' commits</span></div>';
  }).join(''):'<span class="t3" style="font-size:12px">No contributor branches.</span>';
  document.getElementById('pCommits').innerHTML=(pd.recent||[]).map(function(c){
    return '<div class="commit"><span class="sha">'+c.sha+'</span><span class="msg">'+esc(c.msg||'')+'</span><span class="meta">'+(c.author||'')+' · '+(c.committed_date||'')+'</span></div>';
  }).join('')||'<span class="t3">No commits in range.</span>';
}

// ─── PERSON ───────────────────────────────────────────────────────
function renderPerson(person){
  var pd=(S.persons_detail||{})[person]||{};
  document.getElementById('tbar-title').textContent=person;
  var days=filt(pd.commits_by_day||[]); var totalC=days.reduce(function(a,d){return a+d.commits;},0);
  document.getElementById('app').innerHTML=
  '<div class="card" style="border-left:3px solid '+SEM.Green+'"><div style="display:flex;align-items:center;gap:18px">'+
    '<div class="av lg">'+initials(person)+'</div><div><h2 class="sh">'+person+'</h2>'+
    '<div class="t2 mono" style="font-size:13px;margin-top:6px">'+totalC+' commits in range · '+(pd.repos||[]).length+' repos</div></div></div></div>'+
  '<div class="grid g3">'+kpi('Commits (range)',totalC,FROM+' to '+TO)+kpi('Repos',(pd.repos||[]).length,'with activity')+kpi('Total global',pd.total_commits==null?'-':pd.total_commits,'historical')+'</div>'+
  '<div class="card"><div class="ey">Activity map</div><div class="ch tall" id="prCal"></div></div>'+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">Commits by repo</div><div class="ch" id="prBar"></div></div>'+
    '<div class="card"><div class="ey">Daily activity</div><div class="ch" id="prLine"></div></div>'+
  '</div>'+
  '<div class="card"><div class="ey">Recent commits</div><div id="prCommits"></div></div>';
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
  document.getElementById('tbar-title').textContent='Activity -- Who works on what';
  var act=S.activity||{}, totalE=(act.edges||[]).reduce(function(a,e){return a+e.commits;},0);
  document.getElementById('app').innerHTML=
  '<div class="grid g3">'+kpi('Active repos',(act.repos||[]).length,'')+kpi('Contributors',(act.contributors||[]).length,'')+kpi('Connections',totalE,'commits in range')+'</div>'+
  '<div class="card acc"><div class="ey">Activity network (repos + persons)</div><div class="ch xl" id="aGraph" style="min-height:540px"></div></div>'+
  '<div class="grid g2">'+
    '<div class="card"><div class="ey">Repos by commits</div><table class="tbl"><tr><th>Repo</th><th>Commits</th><th>Last</th></tr>'+
      (act.repos||[]).map(function(r){return '<tr><td><span class="sdot" style="background:'+(CM[r.project]||OTROS)+'"></span> '+r.repo+'</td><td class="mono">'+r.commits+'</td><td class="t3 mono" style="font-size:11px">'+(r.last_commit_at||'').slice(0,10)+'</td></tr>';}).join('')+'</table></div>'+
    '<div class="card"><div class="ey">Persons by commits</div><table class="tbl"><tr><th>Person</th><th>Commits</th><th>Repos</th></tr>'+
      (act.contributors||[]).map(function(c){return '<tr style="cursor:pointer" onclick="go(\'person\',\''+c.person+'\')"><td>'+c.person+'</td><td class="mono">'+c.commits+'</td><td class="mono">'+c.repos+'</td></tr>';}).join('')+'</table></div>'+
  '</div>';
  mkGraph('aGraph',act,true);
}

// ─── CONFIG MODAL ─────────────────────────────────────────────────
function openConfig(){
  document.getElementById('cfg-list').innerHTML=(S.projects||[]).map(function(p){
    return '<div class="cfg-row" id="cfg-'+p.slug+'">'+
      '<div class="cfg-head"><span class="sdot" style="background:'+(CM[p.slug]||OTROS)+'"></span>'+
      '<b style="flex:1">'+p.slug+'</b><span class="t3" style="font-size:11px">'+(p.classification||'')+'</span>'+
      '<div class="toggle '+(p.visible?'on':'')+'" onclick="toggleVis(\''+p.slug+'\',this)"><i></i></div></div>'+
      '<div class="cfg-field"><label>Owner</label><input class="inp" id="own-'+p.slug+'" value="'+(p.owner||'')+'"></div>'+
      '<div class="cfg-field"><label>Collabs</label><div style="flex:1">'+
        (p.colabs||[]).map(function(c){return '<span class="colab-tag">'+c+' <b title="remove collab" onclick="retireColab(\''+p.slug+'\',\''+c+'\')">&times;</b></span>';}).join('')+
        ((p.colabs||[]).length?'':'<span class="t3" style="font-size:12px">no collaborators</span>')+'</div></div>'+
      '<div style="text-align:right;margin-top:8px"><button class="btn sm prim" onclick="saveProj(\''+p.slug+'\')">Save</button></div>'+
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
  // try to persist to server (if running)
  fetch('/api/config/project/'+encodeURIComponent(slug),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visible:visible,owner:owner})}).catch(function(){});
  applyCfg(); buildSidebar();
  var p=(S.projects||[]).find(function(x){return x.slug===slug;}); if(p){p.visible=visible;p.owner=owner;}
  document.querySelector('#cfg-'+slug).style.borderColor='var(--ve)';
}
function retireColab(slug,person){
  if(!confirm('Remove '+person+' from '+slug+'?\nThis merges their branch to master and DELETES it (requires server running).'))return;
  fetch('/api/projects/'+encodeURIComponent(slug)+'/retire-collab',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({person:person})})
    .then(function(r){return r.json();})
    .then(function(d){ alert('Result:\n'+JSON.stringify(d,null,2)); })
    .catch(function(e){ alert('Could not run (requires server): '+e.message); });
}

// ─── EXPORT ───────────────────────────────────────────────────────
let EXPBUSY=false;
async function exportImg(mode){
  if(EXPBUSY||!window.snapdom)return;
  var msg=document.getElementById('expmsg');EXPBUSY=true;msg.textContent='generating...';
  var btns=document.querySelectorAll('.expand-btn');btns.forEach(function(b){b.style.display='none';});
  await new Promise(function(r){setTimeout(r,300);});
  try{
    var img=await Promise.race([snapdom.toPng(document.getElementById('app'),{scale:2,backgroundColor:'#09090B'}),
      new Promise(function(_,rj){setTimeout(function(){rj(new Error('timeout'));},12000);})]);
    var a=document.createElement('a');a.href=img.src;a.download='Observatory_'+ROUTE+'_'+TO+'.png';a.click();
    msg.textContent='Done: '+a.download;
  }catch(e){msg.textContent='Error: '+e.message;}
  finally{btns.forEach(function(b){b.style.display='';});}
  EXPBUSY=false;
}

// ─── BOOT ─────────────────────────────────────────────────────────
window.onerror=function(m,u,l,c,e){var el=document.getElementById('app');if(el)el.innerHTML='<pre style="color:#E53E3E;padding:20px;font-size:11px">ERROR:\n'+m+(e?'\n'+e.stack:'')+'</pre>';};
function checkServer(){
  fetch('/api/health').then(function(r){return r.ok?r.json():Promise.reject();}).then(function(){
    var b=document.getElementById('syncBtn');b.disabled=false;b.title='Refresh repos and data (read-only, no push)';
  }).catch(function(){});
}
(function(){
  checkServer();
  try{
    // Replace with your project data
    if(window.SNAPSHOT){init(window.SNAPSHOT);}
    else{fetch('snapshot.json').then(function(r){return r.json();}).then(init).catch(function(){document.getElementById('app').innerHTML='<div style="padding:40px;color:#71717A">No data. Run your export_snapshot script.</div>';});}
  }catch(e){var el=document.getElementById('app');if(el)el.innerHTML='<pre style="color:#E53E3E;padding:20px;font-size:11px">ERROR init:\n'+e.message+'</pre>';}
})();
