/* SOURCE: overlay-kit.js — edit this file, run build_dashboard.py to rebuild */

// ─── SYNC (Refresh) ───────────────────────────────────────────────
let SYNCBUSY=false, SYNC_ES=null, SYNC_DONE=false;
const SYNC_PHASES=[['discover','Discover'],['repos','Repos'],['snapshot','Snapshot'],['done','Done']];
function phaseIdx(p){for(var i=0;i<SYNC_PHASES.length;i++)if(SYNC_PHASES[i][0]===p)return i;return 0;}
function buildSyncDots(){
  var h='';
  SYNC_PHASES.forEach(function(p,i){
    if(i)h+='<div class="sync-seg" id="syncSeg'+i+'"><i></i></div>';
    h+='<div class="sync-dot" id="syncDot'+i+'" title="'+p[1]+'"></div>';
  });
  document.getElementById('syncDots').innerHTML=h;
}
function setPhase(p){
  var idx=phaseIdx(p);
  SYNC_PHASES.forEach(function(_,i){
    document.getElementById('syncDot'+i).className='sync-dot'+(i<idx?' done':i===idx?' on':'');
    if(i)document.getElementById('syncSeg'+i).className='sync-seg'+(i<=idx?' fill':'');
  });
}
function setProgress(pct,phase){
  if(pct!=null){document.getElementById('syncTrack').style.width=pct+'%';document.getElementById('syncPct').textContent=Math.round(pct)+'%';}
  if(phase)setPhase(phase);
}
function pushLog(label,status){
  var log=document.getElementById('syncLog');
  [].forEach.call(log.children,function(c){c.classList.remove('last');});
  var k=status==='ok'?'v':status==='error'?'!':(status==='warn'||status==='skip')?'~':'>';
  var div=document.createElement('div');
  div.className='sync-logline last '+(status||'');
  div.innerHTML='<span class="lk">'+k+'</span><span>'+esc(label)+'</span>';
  log.appendChild(div);log.scrollTop=log.scrollHeight;
}
function startRefresh(){
  if(SYNCBUSY)return; SYNCBUSY=true; SYNC_DONE=false;
  closeExp();closeSlice();
  document.getElementById('syncBtn').disabled=true;
  document.getElementById('syncTitle').textContent='Syncing';
  document.getElementById('syncSummary').textContent='';
  document.getElementById('syncClose').style.display='none';
  document.getElementById('syncLog').innerHTML='';
  document.getElementById('syncShim').classList.remove('off');
  buildSyncDots();setProgress(0,'discover');
  document.getElementById('syncModal').classList.add('on');
  try{SYNC_ES=new EventSource('/api/refresh/stream');}
  catch(e){syncFail('Could not connect: '+e.message);return;}
  SYNC_ES.onmessage=function(ev){
    var d; try{d=JSON.parse(ev.data);}catch(e){return;}
    if(d.phase==='error'){syncFail(d.label||'Error');return;}
    pushLog(d.label||'',d.status);
    setProgress(d.pct,d.phase);
    if(d.phase==='done')syncDone(d.summary,d.result);
  };
  SYNC_ES.onerror=function(){if(SYNCBUSY&&!SYNC_DONE)syncFail('Connection interrupted (server down?)');};
}
function syncDone(sm,result){
  SYNC_DONE=true;
  if(SYNC_ES){SYNC_ES.close();SYNC_ES=null;}
  setPhase('done');document.getElementById('syncDot3').classList.add('done');
  document.getElementById('syncShim').classList.add('off');
  document.getElementById('syncTitle').textContent=result==='partial'?'Done (with warnings)':'Done';
  sm=sm||{};
  document.getElementById('syncSummary').innerHTML='<b>'+(sm.repos||0)+'</b> repos &middot; <b>'+(sm.commits_total||0)+'</b> commits &middot; <b>'+(sm.contributors||0)+'</b> persons'+(sm.nuevos&&sm.nuevos.length?' &middot; <b>'+sm.nuevos.length+'</b> new':'');
  document.getElementById('syncClose').style.display='';
  fetch('snapshot.json?t='+Date.now()).then(function(r){return r.json();}).then(function(snap){
    init(snap);pushLog('Dashboard updated','ok');
    setTimeout(function(){if(SYNC_DONE&&document.getElementById('syncModal').classList.contains('on'))closeSync();},1500);
  }).catch(function(e){pushLog('Could not reload snapshot: '+e.message,'warn');});
  SYNCBUSY=false;
}
function syncFail(msg){
  if(SYNC_ES){SYNC_ES.close();SYNC_ES=null;}
  document.getElementById('syncShim').classList.add('off');
  document.getElementById('syncTitle').textContent='Error';
  pushLog(msg,'error');
  document.getElementById('syncClose').style.display='';
  SYNCBUSY=false;
}
function closeSync(){
  document.getElementById('syncModal').classList.remove('on');
  if(SYNC_ES){SYNC_ES.close();SYNC_ES=null;}
  SYNCBUSY=false;SYNC_DONE=false;
  document.getElementById('syncBtn').disabled=false;
}
