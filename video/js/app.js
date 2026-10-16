/* ============ VIDEO LAB · app.js — boot / shell / routing / global tools ============ */
ML.app = (function(){
  let curProject = null;      // currently open project (memory cache)
  let saveTimer = null, saveState = 'idle';
  const history = { undo: [], redo: [] };
  const MAX_HIST = 60;

  const T = ML.i18n.t;

  /* ---------- toast ---------- */
  function toast(msg, kind){
    let box = document.querySelector('.toast-box');
    if(!box){ box = document.createElement('div'); box.className = 'toast-box'; document.body.appendChild(box); }
    const el = document.createElement('div');
    el.className = 'toast'+(kind==='err'?' err': kind==='ok'?' ok':'');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(), 320); }, 2600);
  }

  /* ---------- modal ---------- */
  function modal(html, opts){
    opts = opts || {};
    return new Promise(resolve=>{
      const mask = document.createElement('div');
      mask.className = 'modal-mask';
      mask.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><div class="m-head">'+(opts.title||'')+'</div><div class="m-body">'+html+'</div><div class="m-foot">'+(opts.noText!==false?'<button class="btn" data-m="no">'+(opts.noText||'取消')+'</button>':'')+'<button class="btn btn-primary" data-m="yes">'+(opts.yesText||'确认')+'</button></div></div>';
      document.body.appendChild(mask);
      const close = (v)=>{ mask.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
      const onKey = ev=>{ if(ev.key==='Escape') close(null); };
      document.addEventListener('keydown', onKey);
      mask.addEventListener('click', ev=>{ if(ev.target===mask) close(null); });
      const noBtn = mask.querySelector('[data-m=no]');
      if(noBtn) noBtn.addEventListener('click', ()=>close(null));
      mask.querySelector('[data-m=yes]').addEventListener('click', ()=>close(true));
      mask.querySelectorAll('[data-g]').forEach(el=>{
        el.addEventListener('click', ()=>{ close(el.dataset.g); });
      });
      mask.querySelector('.btn-primary').focus();
    });
  }
  async function confirmDanger(msg, yesText){
    return modal('<div style="font-size:13px;color:var(--text2);line-height:1.7">'+msg+'</div>', { title:'请确认', yesText: yesText||'删除', noText:'取消' });
  }
  function promptInput(label, value, placeholder){
    return new Promise(resolve=>{
      const mask = document.createElement('div');
      mask.className = 'modal-mask';
      mask.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><div class="m-head">'+label+'</div><div class="m-body"><input class="inp" data-i value="'+String(value||'').replace(/"/g,'&quot;')+'" placeholder="'+(placeholder||'')+'" autocomplete="off"></div><div class="m-foot"><button class="btn" data-m="no">取消</button><button class="btn btn-primary" data-m="yes">确定</button></div></div>';
      document.body.appendChild(mask);
      const input = mask.querySelector('[data-i]');
      const close = v=>{ mask.remove(); document.removeEventListener('keydown',onKey); resolve(v); };
      const onKey = ev=>{ if(ev.key==='Escape') close(null); if(ev.key==='Enter') close(input.value); };
      document.addEventListener('keydown', onKey);
      mask.querySelector('[data-m=no]').addEventListener('click', ()=>close(null));
      mask.querySelector('[data-m=yes]').addEventListener('click', ()=>close(input.value));
      setTimeout(()=>{ input.focus(); input.select(); }, 30);
    });
  }

  /* ---------- project open / save / history ---------- */
  function getProject(){ return curProject; }
  async function openProject(id){
    const p = await ML.store.getProject(id);
    curProject = p ? ML.model.normalize(p) : null;
    history.undo = []; history.redo = [];
    if(curProject) renderShell();
    return curProject;
  }
  function setSaveState(s){ saveState = s; const el = document.querySelector('.tb-save'); if(!el) return; el.className = 'tb-save'+(s==='saving'?' saving': s==='saved'?' saved': s==='fail'?' fail':''); const lab = el.querySelector('.lab'); if(lab) lab.textContent = s==='saving'? T('save.saving') : s==='saved'? T('save.saved') : s==='fail'? T('save.fail') : T('save.idle'); }
  async function saveNow(quiet){
    if(!curProject) return;
    setSaveState('saving');
    curProject.updatedAt = Date.now();
    try{
      await ML.store.saveProject(curProject);
      setSaveState('saved');
      if(!quiet) setTimeout(()=>setSaveState('idle'), 2200);
    }catch(e){
      setSaveState('fail');
      ML.diag.error('SAVE','project',curProject.id,e);
      toast(T('save.fail'), 'err');
    }
  }
  function markDirty(){
    if(!curProject) return;
    setSaveState('saving');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(()=>saveNow(true), 700);
  }
  /* wrap a mutation so undo/redo + autosave happen around it */
  async function op(mutator){
    if(!curProject) return;
    const before = JSON.stringify(curProject);
    try{ await mutator(curProject); }catch(e){ ML.diag.error('OP','mutate',curProject.id,e); return false; }
    const after = JSON.stringify(curProject);
    if(before !== after){
      history.undo.push(before);
      history.redo = [];
      if(history.undo.length > MAX_HIST) history.undo.shift();
      curProject.updatedAt = Date.now();
      markDirty();
      return true;
    }
    return false;
  }
  function canUndo(){ return history.undo.length>0 && !!curProject; }
  function canRedo(){ return history.redo.length>0 && !!curProject; }
  async function undo(){
    if(!history.undo.length || !curProject) return;
    history.redo.push(JSON.stringify(curProject));
    curProject = Object.assign(curProject, JSON.parse(history.undo.pop()));
    ML.router.render();
    markDirty();
  }
  async function redo(){
    if(!history.redo.length || !curProject) return;
    history.undo.push(JSON.stringify(curProject));
    curProject = Object.assign(curProject, JSON.parse(history.redo.pop()));
    ML.router.render();
    markDirty();
  }

  /* ---------- shell ---------- */
  const NAV = [
    { id:'projects', icon:'P', label:'nav.projects', go:()=>ML.router.go('/projects') },
    { id:'script', icon:'S', label:'nav.script', need:true, go:()=>ML.router.go('/project/'+curProject.id+'/script') },
    { id:'storyboard', icon:'B', label:'nav.storyboard', need:true, go:()=>ML.router.go('/project/'+curProject.id+'/storyboard') },
    { id:'production', icon:'D', label:'nav.production', need:true, go:()=>ML.router.go('/project/'+curProject.id+'/production') },
    { id:'ai', icon:'A', label:'nav.ai', need:true, go:()=>ML.router.go('/project/'+curProject.id+'/ai') },
    { id:'export', icon:'E', label:'nav.export', need:true, go:()=>ML.router.go('/project/'+curProject.id+'/export') },
    { id:'settings', icon:'G', label:'nav.settings', go:()=>ML.router.go('/settings') }
  ];
  function renderShell(){
    const sidebar = document.getElementById('sidebar');
    const topbar = document.getElementById('topbar');
    if(sidebar){
      const langLabel = ML.i18n.lang==='zh' ? 'EN' : '中文';
      sidebar.innerHTML =
        '<div class="sb-brand"><div class="sb-logo">VL</div><div><div class="sb-name">VIDEO LAB</div><div class="sb-tag">'+T('app.tag')+'</div></div></div>'+
        NAV.map(n=>'<div class="sb-item'+(routeIs(n.id)?' on':'')+(n.need&&!curProject?' disabled':'')+'" data-nav="'+n.id+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M8 9l4 3 4-3"/></svg><span>'+T(n.label)+'</span></div>').join('')+
        '<div class="sb-sep"></div>'+
        '<div class="sb-item" data-nav="lang"><span>'+langLabel+'</span></div>'+
        '<div class="sb-foot">'+T('app.slogan')+'</div>';
      sidebar.querySelectorAll('[data-nav]').forEach(el=>{
        el.addEventListener('click', ()=>{
          const id = el.dataset.nav;
          if(id==='lang'){ ML.i18n.set(ML.i18n.lang==='zh'?'en':'zh'); ML.router.render(); return; }
          const n = NAV.find(x=>x.id===id);
          if(!n) return;
          if(n.need && !curProject){ toast(T('nav.openFirst'), 'err'); return; }
          n.go();
          closeMobileNav();
        });
      });
    }
    if(topbar){
      const name = curProject ? curProject.name : T('app.name');
      const crumb = curProject ? '<span class="crumb">'+(curProject.type||'')+' · '+ML.router.pageLabel()+'</span>' : '';
      topbar.innerHTML =
        '<div class="tb-title"><button class="btn btn-icon btn-ghost" data-a="mnav" style="display:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button><span>'+name+'</span>'+crumb+'</div>'+
        '<div class="tb-save"><span class="dot"></span><span class="lab">'+T('save.idle')+'</span></div>'+
        '<div class="tb-actions">'+
          '<button class="btn btn-icon" data-a="undo" title="'+T('kbd.undo')+'"'+(canUndo()?'':' disabled')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 016 6v1"/></svg></button>'+
          '<button class="btn btn-icon" data-a="redo" title="'+T('kbd.redo')+'"'+(canRedo()?'':' disabled')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 00-6 6v1"/></svg></button>'+
          '<button class="btn btn-icon" data-a="help" title="'+T('kbd.title')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2 2-2 3.5"/><circle cx="12" cy="17" r=".5"/></svg></button>'+
          (curProject?'<button class="btn btn-primary btn-sm" data-a="export">'+T('nav.export')+'</button>':'')+
        '</div>';
      topbar.querySelector('[data-a=undo]').addEventListener('click', undo);
      topbar.querySelector('[data-a=redo]').addEventListener('click', redo);
      topbar.querySelector('[data-a=help]').addEventListener('click', showHelp);
      const exp = topbar.querySelector('[data-a=export]');
      if(exp) exp.addEventListener('click', ()=>ML.router.go('/project/'+curProject.id+'/export'));
      const mnav = topbar.querySelector('[data-a=mnav]');
      if(mnav && window.matchMedia('(max-width:760px)').matches){
        mnav.style.display = 'inline-flex';
        mnav.addEventListener('click', ()=>document.getElementById('sidebar').classList.toggle('open'));
      }
    }
  }
  function routeIs(id){
    const h = location.hash;
    if(id==='projects') return /#\/projects?($|\/)/.test(h);
    if(id==='settings') return h.startsWith('#/settings');
    if(id==='script') return /\/script($|\/)/.test(h);
    if(id==='storyboard') return /\/storyboard($|\/)/.test(h);
    if(id==='production') return /\/production($|\/)/.test(h);
    if(id==='ai') return /\/ai($|\/)/.test(h);
    if(id==='export') return /\/export($|\/)/.test(h);
    return false;
  }
  function closeMobileNav(){ document.getElementById('sidebar').classList.remove('open'); }

  /* ---------- shortcuts & help ---------- */
  function showHelp(){
    const rows = [
      ['Ctrl/Cmd + Z','撤销'],
      ['Ctrl/Cmd + Shift + Z','重做'],
      ['Ctrl/Cmd + S','保存项目'],
      ['Ctrl/Cmd + K','快捷键帮助'],
      ['↑ / ↓','切换镜头'],
      ['Delete','删除选中镜头（分镜页）']
    ];
    modal('<div>'+rows.map(r=>'<div class="kbd-row"><span>'+r[1]+'</span><span class="k"><kbd>'+r[0]+'</kbd></span></div>').join('')+'</div>', { title: T('kbd.title'), yesText:'知道了', noText:false });
  }
  function installShortcuts(){
    document.addEventListener('keydown', ev=>{
      const m = ev.metaKey || ev.ctrlKey;
      const tag = (ev.target && ev.target.tagName)||'';
      const editing = ['TEXTAREA','INPUT','SELECT'].includes(tag) || ev.target && ev.target.isContentEditable;
      if(m && (ev.key==='k'||ev.key==='K')){ ev.preventDefault(); showHelp(); return; }
      if(m && (ev.key==='s'||ev.key==='S')){
        if(!editing || tag==='INPUT'){ ev.preventDefault(); saveNow(); }
        return;
      }
      if(m && (ev.key==='z'||ev.key==='Z')){
        if(!editing){ ev.preventDefault(); if(ev.shiftKey) redo(); else undo(); }
        return;
      }
    });
  }

  /* ---------- boot & router ---------- */
  function boot(){
    try{
      ML.cap.detect();
      ML.cap.checkEncoders().then(()=>{ try{ window.dispatchEvent(new CustomEvent('ml-cap-ready')); }catch(e){} }).catch(e=>ML.diag.error('CAPABILITY','check',null,e));
      ML.diag.installGlobalErrorHandlers();
      ML.store.init().then(async ()=>{
        try{ await ML.store.cleanupLegacy(); }catch(e){}
        try{ await ML.providers.loadConfig(); }catch(e){}
        renderShell();
        ML.router.init();
        installShortcuts();
        window.__ML = { store: ML.store, providers: ML.providers, model: ML.model, views: ML.views, aiassist: ML.aiassist, export2: ML.export2, app: ML.app, diag: ML.diag, cap: ML.cap, i18n: ML.i18n };
      }).catch(e=>{
        ML.diag.error('BOOT','init',null,e);
        const app = document.getElementById('app');
        if(app) app.innerHTML = '<div style="padding:40px;color:#1d1a15;font:12px monospace">BOOT ERROR: '+String(e&&e.message||e)+'</div>';
      });
    }catch(e){
      ML.diag.error('BOOT','start',null,e);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  return { getProject, openProject, saveNow, markDirty, op, undo, redo, canUndo, canRedo, toast, modal, confirmDanger, promptInput, renderShell, showHelp };
})();
