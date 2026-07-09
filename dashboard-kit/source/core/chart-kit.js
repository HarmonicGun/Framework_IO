/* SOURCE: core/chart-kit.js — edit this file, run build_dashboard.py to rebuild */

// ─── CHARTS ───────────────────────────────────────────────────────
function destroyCharts(){CHARTS.forEach(function(c){c.dispose();});CHARTS=[];}
function mk(el,opt){
  if(typeof el==='string')el=document.getElementById(el);
  if(!el)return null;
  var c=echarts.init(el,null,{renderer:'canvas'});
  c.setOption(Object.assign({backgroundColor:'transparent'},opt));
  CHARTS.push(c); return c;
}
window.addEventListener('resize',function(){CHARTS.forEach(function(c){c.resize();});MCHARTS.forEach(function(c){c.resize();});});
// chart de modal/expand (no entra al ciclo de destroyCharts del router)
function mkM(el,opt){
  if(typeof el==='string')el=document.getElementById(el);
  if(!el)return null;
  var c=echarts.init(el,null,{renderer:'canvas'});
  c.setOption(Object.assign({backgroundColor:'transparent'},opt));
  MCHARTS.push(c); return c;
}
function axisTheme(){return {grid:{left:44,right:16,top:18,bottom:34},
  xAxis:{type:'category',axisLabel:AXIS,axisLine:{lineStyle:{color:'rgba(255,255,255,.1)'}}},
  yAxis:{type:'value',splitLine:{lineStyle:GRID},axisLabel:AXIS},
  tooltip:{trigger:'axis',backgroundColor:'#18181B',borderColor:'rgba(255,255,255,.1)',textStyle:{color:'#FAFAFA'}}};}
function lineSeries(data,color,smooth,area){
  if(smooth===undefined)smooth=.4; if(area===undefined)area=true;
  return {type:'line',smooth:smooth,symbol:'none',data:data,lineStyle:{color:color,width:2},itemStyle:{color:color},
    areaStyle:area?{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:color+'70'},{offset:1,color:color+'00'}])}:null};}

// Heatmap estilo GitHub (celdas cuadradas + niveles)
// calOption: builder puro (lo consume el dashboard via mk Y la presentacion via su propio registro)
function calOption(data,minD,maxD){
  return {tooltip:{formatter:function(p){return p.value[0]+': '+p.value[1]+' commits';},backgroundColor:'#18181B',borderColor:'rgba(255,255,255,.1)',textStyle:{color:'#FAFAFA'}},
    visualMap:{type:'piecewise',show:false,
      pieces:[{min:1,max:2},{min:3,max:5},{min:6,max:10},{min:11,max:20},{min:21}],
      inRange:{color:['#3A1D08','#7C2D12','#C2410C','#F97316','#FB670B']}},
    calendar:{range:[minD,maxD],cellSize:['auto',13],orient:'horizontal',left:28,right:10,top:28,bottom:10,
      splitLine:{show:false},
      itemStyle:{color:'#161618',borderColor:'#0A0A0A',borderWidth:3,borderRadius:2},
      dayLabel:{firstDay:1,nameMap:['','L','','M','','V',''],color:'#52525B',fontSize:8},
      monthLabel:{color:'#A1A1AA',fontSize:11,nameMap:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']},
      yearLabel:{show:false}},
    series:[{type:'heatmap',coordinateSystem:'calendar',data:data,
      itemStyle:{borderColor:'#0A0A0A',borderWidth:3,borderRadius:3}}]};
}
function calHeatmap(elId,data,minD,maxD){
  if(!data||!data.length)return;
  mk(elId,calOption(data,minD,maxD));
}

// Grafo fuerza (repos + personas)
// Colores definidos: REPO = color fijo del proyecto (CM) o gris OTROS si no mapeado (circulo).
// PERSONA = slate uniforme + borde, forma roundRect -> se distingue del repo a simple vista.
var PERSONA_COLOR='#CBD5E1';
// color UNICO por proyecto: mapeado -> color de marca (CM); el resto -> hue estable generado del nombre.
function hashHue(s){var h=0;s=s||'x';for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h%360;}
function repoColor(r){var c=CM[r.project];if(c&&c!==OTROS)return c;return 'hsl('+hashHue(r.repo||r.project)+',62%,58%)';}
function graphSeries(act){
  var nodes=[],links=[];
  (act.repos||[]).forEach(function(r){nodes.push({id:'r:'+r.repo,name:r.repo,category:0,value:r.commits,
    symbol:'circle',symbolSize:Math.min(76,16+Math.sqrt(r.commits)*4.6),
    itemStyle:{color:repoColor(r),borderColor:'rgba(0,0,0,.4)',borderWidth:1}});});
  (act.contributors||[]).forEach(function(c){nodes.push({id:'p:'+(c.id||c.person),name:c.name||c.person,category:1,value:c.commits,
    symbol:'roundRect',symbolSize:Math.min(54,14+Math.sqrt(c.commits)*3.2),
    itemStyle:{color:PERSONA_COLOR,borderColor:'#475569',borderWidth:2}});});
  (act.edges||[]).forEach(function(e){links.push({source:'p:'+(e.from||e.id),target:'r:'+e.to,value:e.commits,
    lineStyle:{width:Math.min(7,1+e.commits/7),color:'rgba(255,255,255,.45)',curveness:.14}});});
  return {nodes:nodes,links:links};
}
function graphOption(act,big){
  var g=graphSeries(act);
  return {tooltip:{formatter:function(p){return p.dataType==='edge'?p.data.value+' commits':p.name+': '+(p.value||0)+' commits';},backgroundColor:'#18181B',borderColor:'rgba(255,255,255,.1)',textStyle:{color:'#FAFAFA'}},
    legend:{data:['proyectos','personas'],textStyle:{color:'#A1A1AA'},top:0,icon:'roundRect'},
    series:[{type:'graph',layout:'force',roam:true,draggable:true,
      categories:[{name:'proyectos',itemStyle:{color:'#FB670B'}},{name:'personas',itemStyle:{color:PERSONA_COLOR}}],
      // label con halo oscuro + posicion abajo -> legible sobre nodo claro/oscuro
      label:{show:true,position:'bottom',distance:3,color:'#FAFAFA',fontSize:big?13:11,fontWeight:600,
        fontFamily:'Inter',textBorderColor:'#09090B',textBorderWidth:3.5},
      lineStyle:{color:'rgba(255,255,255,.14)'},
      force:{repulsion:big?320:170,edgeLength:big?[80,220]:[55,150],gravity:.06,layoutAnimation:true},
      // al resaltar un nodo: sus relaciones en naranja, lo demas se atenua
      emphasis:{focus:'adjacency',scale:1.06,label:{color:'#FFFFFF'},
        lineStyle:{color:'#FB670B',opacity:1,width:3},itemStyle:{shadowBlur:18,shadowColor:'rgba(251,103,11,.45)'}},
      blur:{itemStyle:{opacity:.28},label:{opacity:.25},lineStyle:{opacity:.05}},
      data:g.nodes,links:g.links}]};
}
// hover sobre un nodo -> tinta sus aristas en naranja (focus:'adjacency' solo deja el nodo en emphasis;
// las lineas adyacentes quedan en estado normal, asi que las resaltamos a mano por dataType:'edge').
function attachGraphHover(chart){
  if(!chart)return chart;
  chart.on('mouseover',function(p){
    if(p.dataType!=='node')return;
    var id=p.data&&p.data.id; if(!id)return;
    var opt=chart.getOption().series[0];
    var links=opt.links||[], nodes=opt.data||[];
    var edgeIdxs=[],nodeIds=new Set([id]);
    links.forEach(function(l,i){
      if(l.source===id||l.target===id){
        edgeIdxs.push(i);
        nodeIds.add(l.source===id?l.target:l.source);
      }
    });
    var nodeIdxs=[];nodes.forEach(function(n,i){if(nodeIds.has(n.id))nodeIdxs.push(i);});
    if(edgeIdxs.length)chart.dispatchAction({type:'highlight',seriesIndex:0,dataType:'edge',dataIndex:edgeIdxs});
    if(nodeIdxs.length)chart.dispatchAction({type:'highlight',seriesIndex:0,dataIndex:nodeIdxs});
  });
  chart.on('mouseout',function(p){
    if(p.dataType!=='node')return;
    chart.dispatchAction({type:'downplay',seriesIndex:0});
  });
  return chart;
}
function mkGraph(elId,act,big){attachGraphHover(mk(elId,graphOption(act,big)));}
// commits de un proyecto DENTRO del rango FROM/TO activo (range-aware).
// commits_by_day es una serie DISPERSA (solo dias con actividad, sin ceros)
// dentro de la ventana 90d del snapshot. filt()-suma es correcta porque sumar
// no requiere dias-cero. Mismo patron exacto que rankByRange() y personRangeCommits().
// SIN serie (proyectos sin commits_by_day poblado en el snapshot)
// -> retorna 0 (NO commits_30d): sin serie = sin actividad
// medible en ningun rango. Asi NO se mezcla semantica rango-real con dato-fijo-30d.
function projRangeCommits(slug){
  var pd=(S.projects_detail||{})[slug];
  if(!pd||!pd.commits_by_day||!pd.commits_by_day.length)return 0;
  return filt(pd.commits_by_day).reduce(function(a,d){return a+d.commits;},0);
}
// Scatter salud del portafolio
function mkHealthScatter(elId){
  var projs=(S.projects||[]).filter(function(p){return p.active&&p.visible;});
  if(!projs.length)return;
  var rc={}; projs.forEach(function(p){rc[p.slug]=projRangeCommits(p.slug);});
  var maxC=Math.max.apply(null,projs.map(function(p){return rc[p.slug];}).concat([10]));
  var midX=Math.round(maxC*0.45);
  var maxX=Math.ceil(maxC*1.12);
  function sz(p){return Math.max(14,Math.min(52,14+Math.sqrt(rc[p.slug]||0)*3.0));}
  function toItem(p){
    return {name:p.slug,value:[rc[p.slug]||0,realPct(p)],symbolSize:sz(p),
      itemStyle:{color:CM[p.slug]||OTROS,opacity:.88}};}
  var isRisk=function(p){return p.semaforo==='Rojo'||(p.git_dias_sin_actividad!=null&&p.git_dias_sin_actividad>4&&realPct(p)<70);};
  var risk=projs.filter(isRisk), normal=projs.filter(function(p){return !isRisk(p);});
  var ttFmt=function(params){
    var p=(S.projects||[]).find(function(x){return x.slug===params.name;})||{};
    return '<b style="font-family:Inter">'+params.name+'</b><br>'+
      '<span style="color:#A1A1AA">Owner:</span> '+(p.owner||'-')+'<br>'+
      '<span style="color:#A1A1AA">MVP:</span> '+realPct(p)+'% &nbsp; <span style="color:#A1A1AA">Fase:</span> '+(p.fase||'-')+'<br>'+
      '<span style="color:#A1A1AA">Commits (rango):</span> '+projRangeCommits(p.slug)+' &nbsp; <span style="color:#A1A1AA">7d:</span> '+(p.commits_7d||0)+'<br>'+
      '<span style="color:#A1A1AA">Dias sin actividad:</span> '+(p.git_dias_sin_actividad!=null?p.git_dias_sin_actividad:'-')+
      (p.bloqueo?'<br><span style="color:#FDA4A4">Bloqueo: '+p.bloqueo.slice(0,48)+'</span>':'');};
  var quadAreas=[
    [{xAxis:midX,yAxis:75,itemStyle:{color:'rgba(0,163,110,.05)'},name:'Produccion activa'},{xAxis:maxX,yAxis:100}],
    [{xAxis:0,yAxis:75,itemStyle:{color:'rgba(255,255,255,.02)'},name:'Estable'},{xAxis:midX,yAxis:100}],
    [{xAxis:0,yAxis:0,itemStyle:{color:'rgba(229,62,62,.07)'},name:'Riesgo'},{xAxis:midX,yAxis:75}],
    [{xAxis:midX,yAxis:0,itemStyle:{color:'rgba(251,103,11,.04)'},name:'Construccion'},{xAxis:maxX,yAxis:75}]
  ];
  mk(elId,{
    tooltip:{trigger:'item',formatter:ttFmt,backgroundColor:'#18181B',borderColor:'rgba(255,255,255,.1)',textStyle:{color:'#FAFAFA',fontSize:12}},
    grid:{left:36,right:80,top:16,bottom:28},
    xAxis:{type:'value',name:'commits',nameLocation:'end',nameTextStyle:{color:'#52525B',fontSize:9},min:0,max:maxX,
      splitLine:{lineStyle:GRID},axisLabel:Object.assign({},AXIS,{fontSize:10}),axisLine:{lineStyle:{color:'rgba(255,255,255,.08)'}}},
    yAxis:{type:'value',name:'MVP%',nameLocation:'end',nameTextStyle:{color:'#52525B',fontSize:9},
      min:Math.max(0,Math.floor((Math.min.apply(null,projs.map(function(p){return realPct(p);}))-12)/10)*10),
      max:100,splitLine:{lineStyle:GRID},axisLabel:Object.assign({},AXIS,{fontSize:10})},
    series:[
      {name:'normal',type:'scatter',data:normal.map(toItem),
        label:{show:true,formatter:'{b}',position:'right',fontSize:10,fontFamily:'Inter',color:'#A1A1AA',distance:6},
        emphasis:{scale:1.2},
        markLine:{silent:true,symbol:'none',animation:false,
          lineStyle:{type:'dashed',color:'rgba(255,255,255,.1)',width:1},
          label:{show:false},
          data:[{xAxis:midX},{yAxis:75}]},
        markArea:{silent:true,
          label:{show:true,position:'insideTopRight',fontSize:9,color:'rgba(255,255,255,.2)',fontFamily:'Inter'},
          data:quadAreas}},
      {name:'riesgo',type:'effectScatter',data:risk.map(toItem),
        rippleEffect:{scale:3.5,brushType:'fill'},
        label:{show:true,formatter:'{b}',position:'right',fontSize:10,fontFamily:'Inter',color:'#FDA4A4',distance:6},
        emphasis:{scale:1.2}}
    ]});
}

// Donut portafolio — opcion compartida (overview / expand / presentacion)
// pfOverride opcional: {by_classification:{...}} para presentacion filtrada. Hacia atras compatible.
function donutOption(big, pfOverride){
  var pf=Object.entries((pfOverride||S.portfolio||{}).by_classification||{});
  return {tooltip:{show:false},
    legend:{show:false},
    series:[{type:'pie',radius:big?['46%','78%']:['50%','80%'],center:['50%','50%'],
      label:{color:'#D4D4D8',fontSize:big?14:12,formatter:big?'{b}\n{c}':'{b}'},
      labelLine:{lineStyle:{color:'#52525B'}},
      selectedMode:'single',
      selectedOffset:28,
      emphasis:{scale:false,focus:'self'},
      blur:{itemStyle:{opacity:0.15}},
      data:pf.map(function(x,i){return {name:x[0],value:x[1],itemStyle:{color:PALETTE[i%6]}};})}]};
}
// engancha click -> popup resumen; hover separa la rebanada y apaga el resto
function attachDonutClick(chart, pfOverride){
  if(!chart)return;
  var src=pfOverride||S.portfolio||{};
  var total=Object.values(src.by_classification||{}).reduce(function(a,b){return a+b;},0)||1;
  chart.on('click',function(p){
    if(p.dataType!=='item'&&p.componentType!=='series')return;
    showSlice(p.name,p.value,((p.value/total)*100),p.event&&p.event.event);
  });
  chart.on('mouseover',function(p){
    if(p.dataType!=='item'&&p.componentType!=='series')return;
    chart.dispatchAction({type:'select',seriesIndex:0,dataIndex:p.dataIndex});
    showSlice(p.name,p.value,((p.value/total)*100),p.event&&p.event.event);
  });
  chart.on('mouseout',function(p){
    if(p.componentType!=='series')return;
    chart.dispatchAction({type:'unselect',seriesIndex:0,dataIndex:p.dataIndex});
  });
}
function mkDonut(elId){ var c=mk(elId,donutOption(false)); attachDonutClick(c); }

// ─── CONTRIBUCION (range-aware) ───────────────────────────────────
function personRangeCommits(person){
  var pd=(S.persons_detail||{})[person]; if(!pd)return 0;
  return filt(pd.commits_by_day||[]).reduce(function(a,d){return a+d.commits;},0);
}
function contribBarsHTML(big){
  var list=(S.contributors||[]).map(function(c,i){return {c:c,i:i,n:personRangeCommits(c.person)};});
  var mx=Math.max.apply(null,list.map(function(x){return x.n;}).concat([1]));
  list.sort(function(a,b){return b.n-a.n;});
  return list.map(function(x){
    var c=x.c,col=PALETTE[x.i%6],pct=Math.round(x.n/mx*100),av=big?34:22,fs=big?13:11,bh=big?9:5;
    return '<div class="person" onclick="go(\'person\',\''+c.person+'\')" style="gap:10px;'+(big?'padding:9px 0;border-bottom:1px solid var(--bd)':'margin-bottom:0')+'">'+
      '<div class="av" style="width:'+av+'px;height:'+av+'px;font-size:'+(big?12:8)+'px;flex-shrink:0;background:'+col+'22;color:'+col+'">'+initials(c.person)+'</div>'+
      '<div style="flex:1"><div style="display:flex;justify-content:space-between;margin-bottom:4px">'+
        '<span style="font-size:'+fs+'px;color:var(--t1);font-weight:500">'+(big?c.person:c.person.split(' ')[0])+'</span>'+
        '<span class="mono" style="font-size:'+fs+'px;color:var(--t1)">'+x.n+(big?' <span class="t3" style="font-weight:400">('+c.commits+' global · '+c.repos+' repos)</span>':'')+'</span></div>'+
      '<div class="pbar" style="height:'+bh+'px"><i style="width:'+pct+'%;background:'+col+'"></i></div></div></div>';
  }).join('');
}
function contribListHTML(){
  return (S.contributors||[]).slice(0,6).map(function(c){
    return '<div class="person" onclick="go(\'person\',\''+c.person+'\')"><div class="av">'+initials(c.person)+'</div>'+
      '<div><div style="font-size:13px;font-weight:500">'+c.person+'</div>'+
      '<div class="t3 mono" style="font-size:11px">'+c.commits+' commits · '+c.repos+' repos</div></div></div>';
  }).join('');
}

// ─── EXPORT MOVIL: charts efimeros aislados de CHARTS[]/MCHARTS[] ─────
// MEXPORT_CHARTS NO entra a destroyCharts() del router NI al resize listener
// (L12 solo itera CHARTS y MCHARTS). Se disponen a mano al destruir el DOM movil.
var MEXPORT_CHARTS=[];
function mkExport(el,opt){
  if(typeof el==='string')el=document.getElementById(el);
  if(!el)return null;
  var c=echarts.init(el,null,{renderer:'canvas'});
  // animation:false -> render sincrono inmediato, captura determinista (bug #9).
  c.setOption(Object.assign({backgroundColor:'transparent',animation:false},opt));
  MEXPORT_CHARTS.push(c); return c;
}
function disposeExportCharts(){MEXPORT_CHARTS.forEach(function(c){try{c.dispose();}catch(e){}});MEXPORT_CHARTS=[];}
// fuerza relayout+resize + onfinished -> garantiza pintura completa antes de snapdom.
// NO usa requestAnimationFrame: en tab de fondo/headless rAF se throttlea y puede no
// disparar nunca -> colgaria el export. Se usan setTimeout (que el navegador NO suspende):
// 60ms para que el CSS se aplique antes de resize, y un fallback duro de 800ms que
// SIEMPRE resuelve (fuera de cualquier rAF). animation:false hace 'finished' inmediato.
function settleExportCharts(){
  return new Promise(function(res){
    var done=false; function finish(){if(done)return;done=true;res();}
    setTimeout(function(){
      var pending=MEXPORT_CHARTS.length;
      if(!pending)return finish();
      MEXPORT_CHARTS.forEach(function(c){
        try{c.resize();}catch(e){}
        try{c.on('finished',function f(){c.off('finished',f);if(--pending<=0)finish();});}catch(e){}
      });
    },60);
    setTimeout(finish,800);
  });
}
