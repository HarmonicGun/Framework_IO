/* SOURCE: presentation-engine.js — edit this file, run build_dashboard.py to rebuild */

// ─── PRESENTATION ─────────────────────────────────────────────────
let PIDX=0, PSCENES=[];
function buildScenes(){
  var dept=S.department||{}, sem=dept.semaforo||{};
  var projs=(S.projects||[]).filter(function(p){return p.visible&&p.active&&p.pct_mvp>=70;}).slice(0,3);
  var contribs=S.contributors||[];
  var pf=Object.entries((S.portfolio||{}).by_classification||{});
  PSCENES=[
    function(){return '<div class="pscene"><div class="p-logo">TI</div><div class="p-h1">Team Intelligence</div><div class="p-sub">Observatory · '+(dept.range&&dept.range.from||'')+' -- '+(dept.range&&dept.range.to||'')+'</div></div>';},
    function(){return '<div class="pscene"><div class="p-ey">The period in numbers</div><div class="p-nums">'+
      '<div><div class="p-num" data-to="'+(dept.commits_total||0)+'">0</div><div class="p-lab">commits</div></div>'+
      '<div><div class="p-num" data-to="'+(dept.active_projects||0)+'">0</div><div class="p-lab">active projects</div></div>'+
      '<div><div class="p-num" data-to="'+(dept.contributors_active||0)+'">0</div><div class="p-lab">persons</div></div></div></div>';},
    function(){return '<div class="pscene" style="width:100%"><div class="p-ey">Who builds -- activity map</div><div id="pgGraph" style="width:90vw;height:62vh"></div></div>';},
    function(){return '<div class="pscene" style="width:100%"><div class="p-ey">Portfolio and team</div>'+
      '<div class="p-split"><div id="pgDonut" style="width:46vw;height:56vh"></div>'+
      '<div class="p-people">'+contribs.slice(0,6).map(function(c){return '<div class="p-person"><div class="av lg" style="width:48px;height:48px;font-size:16px">'+initials(c.person)+'</div><div><div style="font-family:var(--fd);font-weight:700;font-size:20px">'+c.person+'</div><div class="p-lab" style="margin:0">'+c.commits+' commits · '+c.repos+' repos</div></div></div>';}).join('')+'</div></div></div>';},
    function(){return '<div class="pscene"><div class="p-ey">Projects in progress</div><div class="p-pcards">'+
      projs.map(function(p){return '<div class="p-pcard" style="border-top:3px solid '+CM[p.slug]+'"><div class="p-pc-name">'+p.slug+'</div><div class="p-pc-mvp" style="color:'+CM[p.slug]+'" data-to="'+(p.pct_mvp||0)+'">0%</div><div style="height:4px;background:#27272A;border-radius:2px;margin-top:12px"><div style="width:'+(p.pct_mvp||0)+'%;height:100%;background:'+CM[p.slug]+';border-radius:2px"></div></div><div style="font-size:14px;color:#A1A1AA;margin-top:8px">Phase '+p.fase+' · '+p.commits_7d+' commits/week</div></div>';}).join('')+'</div></div>';},
    function(){return '<div class="pscene"><div class="p-ey">Portfolio health</div><div class="p-verdict">'+
      '<div class="p-vitem"><div class="n" style="color:#00A36E" data-to="'+(sem.Green||0)+'">0</div><div class="l" style="color:#00A36E">Green</div></div>'+
      '<div class="p-vitem"><div class="n" style="color:#D97706" data-to="'+(sem.Yellow||0)+'">0</div><div class="l" style="color:#D97706">Yellow</div></div>'+
      '<div class="p-vitem"><div class="n" style="color:#E53E3E" data-to="'+(sem.Red||0)+'">0</div><div class="l" style="color:#E53E3E">Red</div></div></div>'+
      '<div class="p-sub" style="margin-top:24px">Team Intelligence</div></div>';}
  ];
}
function renderPScene(){
  document.getElementById('pscene').innerHTML=PSCENES[PIDX]();
  document.getElementById('pdots').innerHTML=PSCENES.map(function(_,i){return '<span class="'+(i===PIDX?'on':'')+'" onclick="pGo('+i+')"></span>';}).join('');
  document.getElementById('pprog').style.width=((PIDX+1)/PSCENES.length*100).toFixed(1)+'%';
  document.querySelectorAll('#pscene [data-to]').forEach(function(el){
    var to=+el.dataset.to, isP=el.className.indexOf('p-pc-mvp')>=0, s=null;
    function step(ts){if(!s)s=ts;var k=Math.min(1,(ts-s)/900);el.textContent=Math.round(to*k)+(isP?'%':'');if(k<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  });
  if(PIDX===2){var g=echarts.init(document.getElementById('pgGraph'));
    g.setOption(Object.assign({backgroundColor:'transparent'},graphOption(S.activity||{},true)));attachGraphHover(g);}
  if(PIDX===3){var d=echarts.init(document.getElementById('pgDonut'));
    d.setOption(Object.assign({backgroundColor:'transparent'},donutOption(true)));attachDonutClick(d);}
}
function startPres(){buildScenes();PIDX=0;var ov=document.getElementById('pres');ov.style.display='flex';if(ov.requestFullscreen)ov.requestFullscreen().catch(function(){});renderPScene();}
function endPres(){var ov=document.getElementById('pres');ov.style.display='none';if(document.fullscreenElement)document.exitFullscreen().catch(function(){});}
function pNav(d){PIDX=Math.max(0,Math.min(PSCENES.length-1,PIDX+d));renderPScene();}
function pGo(i){PIDX=i;renderPScene();}
addEventListener('keydown',function(e){
  if(document.getElementById('pres').style.display!=='flex')return;
  if(e.key==='ArrowRight'||e.key===' '){pNav(1);e.preventDefault();}
  else if(e.key==='ArrowLeft')pNav(-1);
  else if(e.key==='Escape')endPres();
  else if(e.key==='f'||e.key==='F'){var ov=document.getElementById('pres');if(!document.fullscreenElement)ov.requestFullscreen().catch(function(){});else document.exitFullscreen().catch(function(){});}
});
