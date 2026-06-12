/* SOURCE: presentation-engine.js — edit this file, run build_dashboard.py to rebuild */
/* REQUIRES: pres-config-kit.js (PRES_CFG, filteredActivity, filteredPortfolio) + core/chart-kit.js */
/* Branding universal: window.PRES_BRAND={logo,title,org,accent} se define en dashboard.html
   (markup estatico, sobrevive builds). Sin override usa defaults genericos del kit. */

// ─── PRESENTATION 2.0 ─────────────────────────────────────────────
let PIDX=0, PSCENES=[], PCHARTS=[], PTIMERS=[], PAUTO=false, PPARTS=null;
const PAUTO_MS=7000;
function presBrand(){return Object.assign({logo:'io',title:'Observatorio',org:'',accent:'#FB670B'},window.PRES_BRAND||{});}
function presReduced(){try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}

// serie diaria FILTRADA por seleccion (suma projects_detail); fallback dept si no hay detalle
function presDays(projs){
  var agg={},any=false;
  projs.forEach(function(p){
    var det=(S.projects_detail||{})[p.slug];
    ((det&&det.commits_by_day)||[]).forEach(function(d){
      agg[d.date]=(agg[d.date]||0)+(d.commits||0);any=true;});
  });
  if(!any)return ((S.department||{}).commits_by_day)||[];
  return Object.keys(agg).sort().map(function(k){return {date:k,commits:agg[k]};});
}

function buildScenes(){
  if (!window.PRES_CFG || !PRES_CFG.projects || PRES_CFG.projects.size===0) { initPresCfg(); }
  var B=presBrand();
  var dept=S.department||{};
  var projs=(S.projects||[]).filter(function(p){return p.visible&&p.active&&PRES_CFG.projects.has(p.slug);});
  var contribs=(S.contributors||[]).filter(function(c){return PRES_CFG.persons.has(c.person);});
  var filtPf=filteredPortfolio(projs);
  var filtAct=filteredActivity();
  var days=presDays(projs);
  var totalC=days.reduce(function(a,d){return a+(d.commits||0);},0);
  var pico=days.reduce(function(a,d){return Math.max(a,d.commits||0);},0);
  PSCENES=[
    // 1 — Intro
    function(){return '<div class="pscene"><div class="p-logo p-pulse">'+B.logo+'</div>'+
      '<div class="p-h1 p-in">'+B.title+'</div>'+
      '<div class="p-sub p-in" style="--d:.25s">'+(B.org?B.org+' · ':'')+(dept.range&&dept.range.from||'')+' — '+(dept.range&&dept.range.to||'')+'</div></div>';},
    // 2 — Pulso (heatmap filtrado)
    function(){
      if(!days.length)return '<div class="pscene"><div class="p-ey">Sin actividad en la seleccion</div></div>';
      return '<div class="pscene" style="width:100%"><div class="p-ey p-in">El pulso del periodo</div>'+
        '<div class="p-in" style="--d:.15s"><span class="p-num" data-to="'+totalC+'" data-suffix="">0</span><span class="p-lab" style="display:inline;margin-left:12px">commits</span></div>'+
        '<div id="pgHeat" class="p-in" style="--d:.3s;width:92vw;height:30vh"></div></div>';},
    // 3 — Numeros + sparkline
    function(){return '<div class="pscene" style="width:100%"><div class="p-ey p-in">El periodo en numeros</div><div class="p-nums">'+
      '<div class="p-in" style="--d:.1s"><div class="p-num" data-to="'+totalC+'">0</div><div class="p-lab">commits</div></div>'+
      '<div class="p-in" style="--d:.25s"><div class="p-num" data-to="'+projs.length+'">0</div><div class="p-lab">proyectos</div></div>'+
      '<div class="p-in" style="--d:.4s"><div class="p-num" data-to="'+contribs.length+'">0</div><div class="p-lab">personas</div></div>'+
      '<div class="p-in" style="--d:.55s"><div class="p-num" data-to="'+pico+'">0</div><div class="p-lab">pico en un dia</div></div></div>'+
      '<div id="pgSpark" class="p-in" style="--d:.5s;width:88vw;height:26vh"></div></div>';},
    // 4 — Grafo + spotlight
    function(){return '<div class="pscene" style="width:100%">'+
      (filtAct.edges&&filtAct.edges.length
        ? '<div class="p-ey p-in">Quien construye — mapa de actividad</div><div id="pgGraph" style="width:90vw;height:62vh"></div>'
        : '<div class="p-ey">Sin conexiones en la seleccion</div>')+'</div>';},
    // 5 — Portafolio + equipo
    function(){return '<div class="pscene" style="width:100%"><div class="p-ey p-in">Portafolio y equipo</div>'+
      '<div class="p-split">'+
        (Object.keys(filtPf.by_classification||{}).length
          ? '<div id="pgDonut" style="width:46vw;height:56vh"></div>'
          : '')+
        '<div class="p-people">'+(contribs.length?contribs.slice(0,6).map(function(c,i){return '<div class="p-person p-in" style="--d:'+(0.12*i)+'s"><div class="av lg" style="width:48px;height:48px;font-size:16px">'+initials(c.person)+'</div><div><div style="font-family:var(--fd);font-weight:700;font-size:20px">'+c.person+'</div><div class="p-lab" style="margin:0">'+c.commits+' commits · '+c.repos+' repos</div></div></div>';}).join('')
          :'<div class="p-lab">Equipo no seleccionado</div>')+'</div></div></div>';},
    // 6 — Proyectos (grid fluido, sin scroll)
    function(){var dense=projs.length>6?' dense':'';
      return '<div class="pscene" style="width:100%"><div class="p-ey p-in">Proyectos en marcha</div><div class="p-pcards'+dense+'">'+
      (projs.length?projs.map(function(p,i){var rp=realPct(p),c=CM[p.slug]||'#606060';
        return '<div class="p-pcard p-in" style="--d:'+(0.1*i)+'s;border-top:3px solid '+c+'">'+
        '<div class="p-pc-name">'+p.slug+'</div>'+
        '<div class="p-pc-mvp" style="color:'+c+'" data-to="'+rp+'" data-suffix="%">0%</div>'+
        '<div class="p-bar"><i data-w="'+rp+'" style="background:'+c+'"></i></div>'+
        '<div style="font-size:14px;color:#A1A1AA;margin-top:8px">Fase '+p.fase+' · '+p.commits_7d+' commits/sem</div></div>';}).join('')
      :'<div class="p-lab">Sin proyectos en marcha</div>')+'</div></div>';},
    // 7 — Momentum (commits/sem por proyecto)
    function(){return '<div class="pscene" style="width:100%">'+
      (projs.length
        ? '<div class="p-ey p-in">Momentum — commits de la semana</div><div id="pgBars" style="width:84vw;height:'+Math.min(62,14+projs.length*6)+'vh"></div>'
        : '<div class="p-ey">Sin proyectos en la seleccion</div>')+'</div>';},
    // 8 — Salud + cierre
    function(){var vs={Verde:0,Amarillo:0,Rojo:0};
      projs.forEach(function(p){vs[p.semaforo||'Verde']=(vs[p.semaforo||'Verde']||0)+1;});
      return '<div class="pscene"><div class="p-ey p-in">Salud del portafolio</div><div class="p-verdict">'+
        '<div class="p-vitem p-in" style="--d:.1s"><div class="n" style="color:#00A36E" data-to="'+vs.Verde+'">0</div><div class="l" style="color:#00A36E">Verde</div></div>'+
        '<div class="p-vitem p-in" style="--d:.25s"><div class="n" style="color:#D97706" data-to="'+vs.Amarillo+'">0</div><div class="l" style="color:#D97706">Amarillo</div></div>'+
        '<div class="p-vitem p-in" style="--d:.4s"><div class="n" style="color:#E53E3E" data-to="'+vs.Rojo+'">0</div><div class="l" style="color:#E53E3E">Rojo</div></div></div>'+
        '<div class="p-logo p-in" style="--d:.6s;margin-top:18px">'+B.logo+'</div>'+
        (B.org?'<div class="p-sub p-in" style="--d:.75s">'+B.org+' · '+B.title+'</div>':'')+'</div>';}
  ];
}

// ─── chart helpers de escena (registro propio, NO toca CHARTS del dashboard) ──
function pMk(id,opt){
  var el=document.getElementById(id); if(!el)return null;
  var c=echarts.init(el,null,{renderer:'canvas'});
  c.setOption(Object.assign({backgroundColor:'transparent'},opt));
  PCHARTS.push(c); return c;
}
function pDisposeAll(){
  PCHARTS.forEach(function(c){try{c.dispose();}catch(e){}}); PCHARTS=[];
  PTIMERS.forEach(function(t){clearInterval(t);}); PTIMERS=[];
}

// spotlight: cicla highlight por persona replicando la logica de attachGraphHover
// (graphSeries pushea repos PRIMERO; las personas van despues — ids 'p:').
function attachSpotlight(chart){
  if(presReduced())return;
  var opt=chart.getOption().series[0];
  var nodes=opt.data||[], links=opt.links||[];
  var pIdxs=[]; nodes.forEach(function(n,i){if((n.id||'').indexOf('p:')===0)pIdxs.push(i);});
  if(!pIdxs.length)return;
  var k=0, manual=false;
  chart.on('mouseover',function(){manual=true;});
  chart.on('mouseout',function(){manual=false;});
  PTIMERS.push(setInterval(function(){
    if(manual)return;
    chart.dispatchAction({type:'downplay',seriesIndex:0});
    var id=nodes[pIdxs[k]].id, edgeIdxs=[], nodeIds={}; nodeIds[id]=1;
    links.forEach(function(l,i){if(l.source===id||l.target===id){edgeIdxs.push(i);nodeIds[l.source===id?l.target:l.source]=1;}});
    var nodeIdxs=[]; nodes.forEach(function(n,i){if(nodeIds[n.id])nodeIdxs.push(i);});
    if(edgeIdxs.length)chart.dispatchAction({type:'highlight',seriesIndex:0,dataType:'edge',dataIndex:edgeIdxs});
    chart.dispatchAction({type:'highlight',seriesIndex:0,dataIndex:nodeIdxs});
    k=(k+1)%pIdxs.length;
  },2500));
}

function renderPScene(){
  pDisposeAll();
  document.getElementById('pscene').innerHTML=PSCENES[PIDX]();
  document.getElementById('pdots').innerHTML=PSCENES.map(function(_,i){return '<span class="'+(i===PIDX?'on':'')+'" onclick="pGo('+i+')"></span>';}).join('');
  document.getElementById('pprog').style.width=((PIDX+1)/PSCENES.length*100).toFixed(1)+'%';
  // count-up (data-to + data-suffix)
  document.querySelectorAll('#pscene [data-to]').forEach(function(el){
    var to=+el.dataset.to, suf=el.dataset.suffix||'', s=null;
    function step(ts){if(!s)s=ts;var k=Math.min(1,(ts-s)/900);el.textContent=Math.round(to*k)+suf;if(k<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  });
  // barras de progreso: width 0 -> objetivo (doble rAF para que la transition corra)
  var bars=document.querySelectorAll('#pscene .p-bar i');
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    bars.forEach(function(b){b.style.width=(+b.dataset.w||0)+'%';});});});
  var projs=(S.projects||[]).filter(function(p){return p.visible&&p.active&&PRES_CFG.projects.has(p.slug);});
  // escena 2: heatmap filtrado
  if(PIDX===1){
    var days=presDays(projs).map(function(d){return [d.date,d.commits];});
    if(days.length)pMk('pgHeat',calOption(days,days[0][0],days[days.length-1][0]));
  }
  // escena 3: sparkline
  if(PIDX===2){
    var ds=presDays(projs);
    if(ds.length){
      var o=axisTheme();
      o.xAxis.data=ds.map(function(d){return d.date.slice(5);});
      o.xAxis.axisLabel=Object.assign({},AXIS,{interval:Math.ceil(ds.length/12)});
      o.series=[lineSeries(ds.map(function(d){return d.commits;}),presBrand().accent)];
      pMk('pgSpark',o);
    }
  }
  // escena 4: grafo + spotlight
  if(PIDX===3){
    var filtAct=filteredActivity();
    if(filtAct.edges&&filtAct.edges.length){
      var g=pMk('pgGraph',graphOption(filtAct,true));
      if(g){attachGraphHover(g);attachSpotlight(g);}
    }
  }
  // escena 5: donut
  if(PIDX===4){
    var filtPf=filteredPortfolio(projs);
    if(Object.keys(filtPf.by_classification||{}).length){
      var d=pMk('pgDonut',donutOption(true,filtPf));
      if(d)attachDonutClick(d,filtPf);
    }
  }
  // escena 7: momentum bars
  if(PIDX===6&&projs.length){
    var sorted=projs.slice().sort(function(a,b){return (a.commits_7d||0)-(b.commits_7d||0);});
    pMk('pgBars',{grid:{left:8,right:60,top:8,bottom:8,containLabel:true},
      xAxis:{type:'value',splitLine:{lineStyle:GRID},axisLabel:AXIS},
      yAxis:{type:'category',data:sorted.map(function(p){return p.slug;}),
        axisLabel:Object.assign({},AXIS,{color:'#FAFAFA',fontSize:14,fontWeight:600}),axisLine:{show:false},axisTick:{show:false}},
      series:[{type:'bar',data:sorted.map(function(p){return {value:p.commits_7d||0,itemStyle:{color:CM[p.slug]||'#606060',borderRadius:[0,6,6,0]}};}),
        barMaxWidth:26,label:{show:true,position:'right',color:'#FAFAFA',fontFamily:'JetBrains Mono',fontWeight:700,fontSize:14},
        animationDelay:function(i){return i*120;}}],
      animationDuration:700,animationEasing:'cubicOut'});
  }
  pAutoArm();
}

// ─── autoplay ─────────────────────────────────────────────────────
function pAutoBar(){
  var b=document.getElementById('pautoBar');
  if(!b){b=document.createElement('div');b.id='pautoBar';b.className='p-auto-bar';document.getElementById('pres').appendChild(b);}
  return b;
}
function pAutoArm(){
  var b=pAutoBar();
  b.classList.remove('run'); void b.offsetWidth;   // reinicia la animacion CSS
  if(!PAUTO)return;
  b.style.setProperty('--t',PAUTO_MS+'ms'); b.classList.add('run');
}
function pAutoTick(){ if(!PAUTO)return; PIDX=(PIDX+1)%PSCENES.length; renderPScene(); }
let PAUTO_T=null;
function toggleAuto(force){
  PAUTO=force!==undefined?force:!PAUTO;
  if(PAUTO_T){clearInterval(PAUTO_T);PAUTO_T=null;}
  if(PAUTO&&!presReduced())PAUTO_T=setInterval(pAutoTick,PAUTO_MS); else PAUTO=false;
  var btn=document.getElementById('pautoBtn'); if(btn)btn.classList.toggle('on',PAUTO);
  pAutoArm();
}
function pAutoBtn(){
  if(document.getElementById('pautoBtn'))return;
  var nav=document.querySelector('#pres .pnav'); if(!nav)return;
  var btn=document.createElement('span'); btn.id='pautoBtn'; btn.className='p-autobtn';
  btn.textContent='A autoplay'; btn.onclick=function(){toggleAuto();};
  nav.insertBefore(btn,nav.firstChild);
}

// ─── particulas ambiente (canvas detras de las escenas) ───────────
function startParticles(){
  if(presReduced())return;
  var ov=document.getElementById('pres');
  var cv=document.getElementById('pcanvas');
  if(!cv){cv=document.createElement('canvas');cv.id='pcanvas';cv.className='p-canvas';ov.insertBefore(cv,ov.firstChild);}
  var ctx=cv.getContext('2d'), alive=true, B=presBrand();
  function size(){cv.width=ov.clientWidth;cv.height=ov.clientHeight;}
  size();
  var N=Math.min(70,20+Math.round(((S.department||{}).commits_total||100)/40));
  var dots=[]; for(var i=0;i<N;i++)dots.push({x:Math.random(),y:Math.random(),r:.6+Math.random()*1.8,
    vx:(Math.random()-.5)*.0005,vy:(Math.random()-.5)*.0004,o:.08+Math.random()*.22,c:Math.random()<.3?B.accent:'#FFFFFF'});
  function frame(){
    if(!alive)return;
    if(!document.hidden){
      ctx.clearRect(0,0,cv.width,cv.height);
      dots.forEach(function(d){
        d.x=(d.x+d.vx+1)%1; d.y=(d.y+d.vy+1)%1;
        ctx.globalAlpha=d.o; ctx.fillStyle=d.c;
        ctx.beginPath(); ctx.arc(d.x*cv.width,d.y*cv.height,d.r,0,7); ctx.fill();
      });
      ctx.globalAlpha=1;
    }
    PPARTS.raf=requestAnimationFrame(frame);
  }
  PPARTS={stop:function(){alive=false;if(PPARTS.raf)cancelAnimationFrame(PPARTS.raf);ctx.clearRect(0,0,cv.width,cv.height);},resize:size};
  frame();
}

// ─── ciclo de vida ────────────────────────────────────────────────
function startPres(){
  if (!window.PRES_CFG || !PRES_CFG.projects) initPresCfg();
  buildScenes();PIDX=0;
  var ov=document.getElementById('pres');ov.style.display='flex';
  pAutoBtn(); startParticles();
  if(ov.requestFullscreen)ov.requestFullscreen().catch(function(){});
  renderPScene();
}
function endPres(){
  var ov=document.getElementById('pres');ov.style.display='none';
  pDisposeAll(); toggleAuto(false);
  if(PPARTS){PPARTS.stop();PPARTS=null;}
  if(document.fullscreenElement)document.exitFullscreen().catch(function(){});
}
function pNav(d){toggleAuto(false);PIDX=Math.max(0,Math.min(PSCENES.length-1,PIDX+d));renderPScene();}
function pGo(i){toggleAuto(false);PIDX=i;renderPScene();}
addEventListener('keydown',function(e){
  if(document.getElementById('pres').style.display!=='flex')return;
  if(e.key==='ArrowRight'||e.key===' '){pNav(1);e.preventDefault();}
  else if(e.key==='ArrowLeft')pNav(-1);
  else if(e.key==='Escape')endPres();
  else if(e.key==='a'||e.key==='A')toggleAuto();
  else if(e.key==='f'||e.key==='F'){var ov=document.getElementById('pres');if(!document.fullscreenElement)ov.requestFullscreen().catch(function(){});else document.exitFullscreen().catch(function(){});}
});
// salir de fullscreen con Esc nativo: pausa autoplay y reajusta charts
addEventListener('fullscreenchange',function(){
  if(document.getElementById('pres').style.display!=='flex')return;
  if(!document.fullscreenElement)toggleAuto(false);
  PCHARTS.forEach(function(c){try{c.resize();}catch(e){}});
  if(PPARTS)PPARTS.resize();
});
addEventListener('resize',function(){
  if(document.getElementById('pres').style.display!=='flex')return;
  PCHARTS.forEach(function(c){try{c.resize();}catch(e){}});
  if(PPARTS)PPARTS.resize();
});
