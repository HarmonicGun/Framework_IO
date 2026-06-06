/* SOURCE: modal-kit.js — edit this file, run build_dashboard.py to rebuild */

// ─── EXPAND / SLICE MODALS ────────────────────────────────────────
function openExp(kind){
  var t=document.getElementById('expTitle'),b=document.getElementById('expBody'),m=document.getElementById('expModal');
  MCHARTS.forEach(function(c){c.dispose();});MCHARTS=[];
  if(kind==='contrib'){
    t.textContent='Contribution by person · '+FROM+' to '+TO;
    b.innerHTML='<div style="display:flex;flex-direction:column">'+contribBarsHTML(true)+'</div>';
  }else if(kind==='donut'){
    t.textContent='Portfolio by classification';
    b.innerHTML='<div class="exp-grid"><div id="cPieExp" style="height:58vh;min-height:360px"></div>'+
      '<div><div class="ey">Team</div><div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">'+contribListHTML()+'</div></div></div>';
  }else if(kind==='graph'){
    t.textContent='Who works on what';
    b.innerHTML='<div id="cGraphExp" style="height:66vh;min-height:440px"></div>';
  }
  m.classList.add('on');
  if(kind==='donut'){attachDonutClick(mkM('cPieExp',donutOption(true)));}
  if(kind==='graph'){attachGraphHover(mkM('cGraphExp',graphOption(S.activity||{},true)));}
}
function closeExp(){var m=document.getElementById('expModal');if(m)m.classList.remove('on');MCHARTS.forEach(function(c){c.dispose();});MCHARTS=[];}
var _dtOutsideHandler=null;
function closeSlice(){
  var p=document.getElementById('dtPopup'),b=document.getElementById('dtBackdrop');
  if(p)p.remove();if(b)b.remove();
  if(_dtOutsideHandler){document.removeEventListener('click',_dtOutsideHandler);_dtOutsideHandler=null;}
}
function showSlice(name,value,pct,nativeEvt){
  var prev=document.getElementById('dtPopup');
  if(prev){prev.remove();var pb=document.getElementById('dtBackdrop');if(pb)pb.remove();}
  var host=document.fullscreenElement||document.body;
  var bd=document.createElement('div');bd.id='dtBackdrop';bd.className='dt-backdrop';
  bd.style.pointerEvents='none';
  var pop=document.createElement('div');pop.id='dtPopup';pop.className='dtPopup';
  pop.innerHTML='<div class="dt-name">'+esc(name)+'</div>'+
    '<div class="dt-row"><span>Projects</span><span>'+value+'</span></div>'+
    '<div class="dt-row"><span>% of total</span><span>'+pct.toFixed(1)+'%</span></div>';
  host.appendChild(bd);host.appendChild(pop);
  var x=(nativeEvt&&nativeEvt.clientX)||window.innerWidth/2,y=(nativeEvt&&nativeEvt.clientY)||window.innerHeight/2;
  pop.style.left=Math.min(x+12,window.innerWidth-pop.offsetWidth-12)+'px';
  pop.style.top=Math.min(y+12,window.innerHeight-pop.offsetHeight-12)+'px';
  if(_dtOutsideHandler){document.removeEventListener('click',_dtOutsideHandler);}
  _dtOutsideHandler=function(e){if(!pop.contains(e.target)){closeSlice();}};
  setTimeout(function(){document.addEventListener('click',_dtOutsideHandler);},0);
}
addEventListener('keydown',function(e){if(e.key==='Escape'){closeSlice();closeExp();}});
