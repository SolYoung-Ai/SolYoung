/* ============ ML.router — hash routing (pre-production studio) ============ */
ML.router = (function(){
  function parse(){
    const h = location.hash || '#/';
    let m = h.match(/^#\/project\/([^/]+)\/(script|storyboard|production|ai|export)$/);
    if(m) return { name:'project', id: decodeURIComponent(m[1]), sub: m[2] };
    if(h==='#/' || h==='#/projects') return { name:'projects' };
    if(h==='#/settings') return { name:'settings' };
    return { name:'404' };
  }
  function go(path){
    if(location.hash === '#'+path) render();
    else location.hash = path;
  }
  function pageLabel(){
    const r = parse();
    const T = ML.i18n.t;
    if(r.name==='projects') return T('nav.projects');
    if(r.name==='settings') return T('nav.settings');
    if(r.sub==='script') return T('nav.script');
    if(r.sub==='storyboard') return T('nav.storyboard');
    if(r.sub==='production') return T('nav.production');
    if(r.sub==='ai') return T('nav.ai');
    if(r.sub==='export') return T('nav.export');
    return '';
  }
  async function render(){
    const route = parse();
    const app = document.getElementById('app');
    if(!app) return;
    app.classList.remove('view-swap');
    let project = null;
    if(route.name==='project'){
      const cur = ML.app.getProject();
      project = (cur && cur.id===route.id) ? cur : await ML.app.openProject(route.id);
      if(!project){ app.innerHTML = '<div class="empty"><div class="t">404</div><div class="s">项目不存在或已被删除</div><button class="btn btn-primary" data-act="back">返回项目中心</button></div>'; app.querySelector('[data-act=back]').addEventListener('click', ()=>go('/projects')); return; }
    }
    try{
      ML.views.render(route, app, project);
      ML.app.renderShell();
    }catch(e){
      ML.diag && ML.diag.error('ROUTER','render',route.name,e);
      app.innerHTML = '<div class="empty"><div class="t">'+ML.i18n.t('err.generic')+'</div><div class="s">'+String(e&&e.message||e)+'</div><button class="btn btn-primary" data-act="back">返回</button></div>';
      const b = app.querySelector('[data-act=back]');
      if(b) b.addEventListener('click', ()=>go('/projects'));
    }
  }
  function init(){
    window.addEventListener('hashchange', ()=>{ render(); });
    if(!location.hash) location.replace('#/projects');
    render();
  }
  return { init, render, go, pageLabel, get current(){ return parse(); } };
})();
