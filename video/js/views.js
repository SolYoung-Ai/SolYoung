/* ============ VIDEO LAB · views.js — all views (pre-production studio) ============ */
ML.views = (function(){
  const A = ()=>ML.app, M = ()=>ML.model, T = ML.i18n.t;
  const esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const icon = n=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px">'+n+'</svg>';
  const IC = {
    plus:'<path d="M12 5v14M5 12h14"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
    copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/>',
    up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
    down:'<path d="M12 5v14M5 12l7 7 7-7"/>',
    check:'<path d="M20 6L9 17l-5-5"/>',
    film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 10h4M3 14h4M17 10h4M17 14h4"/>',
    script:'<path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/>',
    board:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 20v-4M15 20v-4"/>',
    ai:'<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',
    export:'<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.7-1L14.5 3h-5l-.4 2.5a7 7 0 00-1.7 1l-2.4-1-2 3.4 2 1.6a7 7 0 000 2l-2 1.6 2 3.4 2.4-1a7 7 0 001.7 1l.4 2.5h5l.4-2.5a7 7 0 001.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1z"/>',
    refresh:'<path d="M21 12a9 9 0 11-2.6-6.4M21 3v6h-6"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    doc:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
  };

  /* ================= Projects ================= */
  async function renderProjects(main){
    const q = {};
    const searchBox = '<div class="search" style="width:230px">'+icon(IC.search)+'<input class="inp" data-q placeholder="'+T('pj.search')+'"></div>';
    main.innerHTML =
      '<div class="pg"><div class="pg-head"><div><div class="pg-title">'+T('pj.title')+'</div><div class="pg-sub">'+T('pj.sub')+'</div></div><div style="display:flex;gap:10px;align-items:center">'+searchBox+'<button class="btn btn-primary" data-a="new">'+icon(IC.plus)+T('pj.new')+'</button></div></div><div class="grid-proj" data-list></div><div class="empty hidden" data-empty><div class="t">'+T('pj.emptyT')+'</div><div class="s">'+T('pj.emptyS')+'</div><button class="btn btn-primary" data-a="new2">'+T('pj.emptyB')+'</button></div></div>';
    const goNew = ()=>renderCreate(main);
    main.querySelector('[data-a=new]').addEventListener('click', goNew);
    const emptyNew = main.querySelector('[data-a=new2]');
    if(emptyNew) emptyNew.addEventListener('click', goNew);
    const renderList = async ()=>{
      const all = await ML.store.listProjects();
      const kw = (q.kw||'').trim().toLowerCase();
      const list = all.filter(p=>{
        if(kw){ const h = (p.name+' '+(p.desc||'')+' '+(p.topic||'')).toLowerCase(); if(!h.includes(kw)) return false; }
        return true;
      });
      const box = main.querySelector('[data-list]');
      box.innerHTML = '';
      const empty = main.querySelector('[data-empty]');
      if(!list.length){ empty.classList.remove('hidden'); return; }
      empty.classList.add('hidden');
      list.forEach(p=>{
        const typeDef = M().PROJECT_TYPES.find(t=>t.id===p.type) || { label:p.type, label_en:'' };
        const typeName = typeDef.label;
        const shots = (p.shots||[]).length;
        const glyph = (typeName||'?').trim().charAt(0);
        const card = document.createElement('div');
        card.className = 'proj-card';
        card.innerHTML =
          '<div class="proj-actions">'+
            '<button class="btn btn-icon btn-sm" data-a="copy" title="'+T('pj.copy')+'">'+icon(IC.copy)+'</button>'+
            '<button class="btn btn-icon btn-sm btn-danger" data-a="del" title="'+T('pj.del')+'">'+icon(IC.trash)+'</button>'+
          '</div>'+
          '<div class="proj-cover">'+
            '<div class="proj-glyph">'+esc(glyph)+'</div>'+
            '<div class="pt">'+esc(typeName)+(typeDef.label_en?'<small>'+esc(typeDef.label_en)+'</small>':'')+'</div>'+
          '</div>'+
          '<div class="proj-body">'+
            '<div class="proj-name">'+esc(p.name)+'</div>'+
            (p.desc? '<div class="proj-desc">'+esc(p.desc.length>70? p.desc.slice(0,70)+'…':p.desc)+'</div>':'')+
            '<div class="proj-meta"><span class="mono">'+T('pj.updated').replace('{t}', M().fmtTime(p.updatedAt))+'</span><span class="proj-count">'+shots+' '+T('pj.shots')+'</span></div>'+
          '</div>';
        card.addEventListener('click', async ()=>{
          await A().openProject(p.id);
          ML.router.go('/project/'+p.id+'/script');
        });
        card.querySelector('[data-a=copy]').addEventListener('click', async ev=>{
          ev.stopPropagation();
          const orig = await ML.store.getProject(p.id);
          if(!orig) return;
          const np = M().normalize(orig);
          np.id = M().uid(); np.name = np.name + '（副本）'; np.createdAt = Date.now(); np.updatedAt = Date.now(); np.sample = false;
          await ML.store.saveProject(np);
          A().toast(T('pj.copied'), 'ok');
          renderList();
        });
        card.querySelector('[data-a=del]').addEventListener('click', async ev=>{
          ev.stopPropagation();
          if(!await A().confirmDanger(T('pj.confirmDel')+'「'+esc(p.name)+'」')) return;
          await ML.store.deleteProject(p.id);
          A().toast(T('pj.deleted'));
          renderList();
        });
        box.appendChild(card);
      });
    };
    main.querySelector('[data-q]').addEventListener('input', ev=>{ q.kw = ev.target.value; renderList(); });
    renderList();
  }

  /* ================= Create wizard ================= */
  function renderCreate(main){
    const types = M().PROJECT_TYPES;
    const state = { name:'', desc:'', type:'vlog', topic:'', dur:60, ratio:'9:16', platform:'', style:'', method:'mixed' };
    const typeChips = ()=>types.map(t=>'<div class="type-chip'+(state.type===t.id?' on':'')+'" data-t="'+t.id+'">'+esc(t.label)+'</div>').join('');
    const ratioChips = ()=>M().RATIOS.map(r=>'<div class="type-chip ratio-chip'+(state.ratio===r?' on':'')+'" data-r="'+r+'">'+r+'</div>').join('');
    const methodChips = ()=>[
      ['live','真人拍摄'],['aigen','AI 生成'],['mixed','混合制作']
    ].map(x=>'<div class="type-chip'+(state.method===x[0]?' on':'')+'" data-m="'+x[0]+'">'+x[1]+'</div>').join('');
    main.innerHTML =
      '<div class="pg"><div class="pg-head"><div><div class="pg-title">'+T('create.title')+'</div><div class="pg-sub">'+T('create.sub')+'</div></div></div>'+
      '<div class="wiz"><div class="card">'+
        '<div class="row"><label class="lbl">'+T('create.name')+' *</label><input class="inp" data-f="name" placeholder="'+T('pj.untitled')+'"></div>'+
        '<div class="row"><label class="lbl">'+T('create.desc')+'</label><input class="inp" data-f="desc" placeholder="可选 — 一句话说明项目"></div>'+
        '<div class="row"><label class="lbl">'+T('create.type')+'</label><div class="type-grid" data-type>'+typeChips()+'</div></div>'+
        '<div class="grid2">'+
          '<div class="row"><label class="lbl">'+T('create.topic')+'</label><input class="inp" data-f="topic" placeholder="例如：辣椒的挑选技巧"></div>'+
          '<div class="row"><label class="lbl">'+T('create.dur')+'</label><input class="inp" data-f="dur" type="number" min="10" max="600" value="60"></div>'+
        '</div>'+
        '<div class="row"><label class="lbl">'+T('create.ratio')+'</label><div class="type-grid" data-ratio style="grid-template-columns:repeat(4,1fr)">'+ratioChips()+'</div></div>'+
        '<div class="grid2">'+
          '<div class="row"><label class="lbl">'+T('create.platform')+'</label><input class="inp" data-f="platform" placeholder="抖音 / 视频号 / B 站…"></div>'+
          '<div class="row"><label class="lbl">'+T('create.style')+'</label><input class="inp" data-f="style" placeholder="例如：现代知识口播"></div>'+
        '</div>'+
        '<div class="row"><label class="lbl">'+T('create.method')+'</label><div class="type-grid" data-method>'+methodChips()+'</div></div>'+
        '<div class="hint" style="margin-bottom:16px">'+T('create.skip')+'</div>'+
        '<button class="btn btn-primary btn-lg" style="width:100%" data-a="create">'+T('create.start')+'</button>'+
      '</div></div></div>';
    const bindChips = (sel, key, attr)=>{
      main.querySelector(sel).querySelectorAll('.type-chip').forEach(el=>{
        el.addEventListener('click', ()=>{
          state[key] = el.dataset[attr];
          main.querySelector(sel).querySelectorAll('.type-chip').forEach(x=>x.classList.toggle('on', x===el));
        });
      });
    };
    bindChips('[data-type]', 'type', 't');
    bindChips('[data-ratio]', 'ratio', 'r');
    bindChips('[data-method]', 'method', 'm');
    main.querySelectorAll('[data-f]').forEach(inp=>{
      inp.addEventListener('input', ()=>{ state[inp.dataset.f] = inp.type==='number' ? (parseInt(inp.value)||60) : inp.value; });
    });
    main.querySelector('[data-a=create]').addEventListener('click', async ()=>{
      const name = (state.name||'').trim();
      const p = M().newProject({ name: name||'未命名项目', desc: state.desc, type: state.type, topic: state.topic, targetDur: state.dur, ratio: state.ratio, platform: state.platform, style: state.style, method: state.method });
      await ML.store.saveProject(p);
      await A().openProject(p.id);
      ML.router.go('/project/'+p.id+'/script');
    });
  }

  /* ================= Script workspace ================= */
  function renderScript(main, project){
    const Mdl = M();
    const state = { wpm: 220 };
    const paras = ()=> project.paragraphs && project.paragraphs.length ? project.paragraphs : Mdl.splitParagraphs(project.scriptText);
    const saveParas = (list)=>{ project.paragraphs = list; project.scriptText = list.map(p=>p.text).join('\n'); A().markDirty(); };
    const stats = ()=> Mdl.analyzeScript(paras(), state.wpm);
    let renderStats = ()=>{
      const s = stats();
      const st = main.querySelector('[data-stats]');
      if(!st) return;
      st.innerHTML =
        '<span>'+s.chars+' '+T('sc.chars')+'</span><span>'+s.paras+' '+T('sc.paras')+'</span>'+
        (s.empty? '<span style="color:var(--err)">'+s.empty+' '+T('sc.empty')+'</span>':'')+
        (s.long? '<span style="color:var(--warn)">'+s.long+' '+T('sc.long')+'</span>':'')+
        '<span>'+T('sc.est').replace('{wpm}', state.wpm)+'：'+Mdl.fmtDur(s.estSec)+' <span class="faint">('+T('sc.estNote')+')</span></span>';
    };
    const renderList = ()=>{
      const list = main.querySelector('[data-paras]');
      list.innerHTML = '';
      paras().forEach((p,i)=>{
        const isLong = p.text.replace(/\s/g,'').length>180;
        const isEmpty = !p.text.trim();
        const row = document.createElement('div');
        row.className = 'sc-paragraph'+(isLong?' para-long':'')+(isEmpty?' para-empty':'');
        row.innerHTML =
          '<div class="idx">'+(i+1)+'</div>'+
          '<textarea data-i="'+i+'" placeholder="段落 '+(i+1)+'…">'+esc(p.text)+'</textarea>'+
          '<div class="ops">'+
            '<button class="btn btn-icon btn-sm" data-o="up" title="'+T('sc.up')+'"'+(i===0?' disabled':'')+'>'+icon(IC.up)+'</button>'+
            '<button class="btn btn-icon btn-sm" data-o="down" title="'+T('sc.down')+'"'+(i===paras().length-1?' disabled':'')+'>'+icon(IC.down)+'</button>'+
            '<button class="btn btn-icon btn-sm" data-o="split" title="'+T('sc.split')+'">'+icon(IC.script)+'</button>'+
            '<button class="btn btn-icon btn-sm" data-o="merge" title="'+T('sc.merge')+'">'+icon(IC.list)+'</button>'+
            '<button class="btn btn-icon btn-sm btn-danger" data-o="del" title="'+T('sc.del')+'">'+icon(IC.trash)+'</button>'+
          '</div>';
        const ta = row.querySelector('textarea');
        let timer = null;
        ta.addEventListener('input', ()=>{
          clearTimeout(timer);
          timer = setTimeout(()=>{ p.text = ta.value; saveParas([...paras()]); renderStats(); }, 400);
        });
        row.querySelector('[data-o=up]').addEventListener('click', ()=>{
          const l = [...paras()];
          if(i===0) return; [l[i-1],l[i]]=[l[i],l[i-1]];
          saveParas(l); renderList(); renderStats();
        });
        row.querySelector('[data-o=down]').addEventListener('click', ()=>{
          const l = [...paras()];
          if(i===l.length-1) return; [l[i],l[i+1]]=[l[i+1],l[i]];
          saveParas(l); renderList(); renderStats();
        });
        row.querySelector('[data-o=split]').addEventListener('click', ()=>{
          const l = [...paras()];
          const lines = p.text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
          if(lines.length>1){ const rest = l.slice(i+1); l.splice(i,1,...lines.map(t=>({id:Mdl.uid(),text:t})),...rest); }
          else { const half = Math.ceil(p.text.length/2); l.splice(i+1,0,{id:Mdl.uid(),text:p.text.slice(half)}); l[i]={id:l[i].id,text:p.text.slice(0,half)}; }
          saveParas(l); renderList(); renderStats();
        });
        row.querySelector('[data-o=merge]').addEventListener('click', ()=>{
          const l = [...paras()];
          if(i===0) return;
          l[i-1] = { id: l[i-1].id, text: l[i-1].text + '\n' + l[i].text };
          l.splice(i,1);
          saveParas(l); renderList(); renderStats();
        });
        row.querySelector('[data-o=del]').addEventListener('click', ()=>{
          const l = [...paras()]; l.splice(i,1);
          saveParas(l); renderList(); renderStats();
        });
        list.appendChild(row);
      });
    };
    main.innerHTML =
      '<div class="pg"><div class="pg-head"><div><div class="pg-title">'+T('sc.title')+'</div><div class="pg-sub">'+T('sc.sub')+'</div></div>'+
      '<div style="display:flex;gap:8px"><button class="btn btn-primary" data-a="gen">'+icon(IC.ai)+T('sc.genStory')+'</button><button class="btn" data-a="manual">'+T('sc.manual')+'</button></div></div>'+
      '<div class="sc-wrap"><div class="sc-main"><div class="card">'+
        '<div class="sc-toolbar">'+
          '<button class="btn btn-sm" data-a="paste">'+T('sc.paste')+'</button>'+
          '<button class="btn btn-sm" data-a="import">'+T('sc.import')+'</button>'+
          '<button class="btn btn-sm" data-a="add">'+icon(IC.plus)+T('sc.addPara')+'</button>'+
          '<button class="btn btn-sm" data-a="copyAll">'+T('sc.copyAll')+'</button>'+
        '</div>'+
        '<div data-paras></div>'+
        '<div class="sc-stats" data-stats></div>'+
        '<div style="margin-top:8px"><label class="lbl">'+T('sc.wpm')+'</label><input class="inp" style="max-width:140px" type="number" min="80" max="400" value="220" data-wpm></div>'+
      '</div></div>'+
      '<div class="sc-side"><div class="card" style="padding:16px"><h4 style="font-size:13px;font-weight:700;margin-bottom:8px">'+T('sc.analyze')+'</h4><div class="hint" style="margin-bottom:10px">'+T('sc.estNote')+'</div><div class="sc-stats" style="flex-direction:column;gap:8px" data-stats2></div></div></div></div></div>';
    const stats2 = main.querySelector('[data-stats2]');
    const baseRender = renderStats;
    renderStats = ()=>{
      baseRender();
      if(stats2){
        const s = stats();
        stats2.innerHTML =
          '<span>'+s.chars+' '+T('sc.chars')+'</span><span>'+s.paras+' '+T('sc.paras')+'</span>'+
          (s.empty? '<span style="color:var(--err)">'+s.empty+' '+T('sc.empty')+'</span>':'')+
          (s.long? '<span style="color:var(--warn)">'+s.long+' '+T('sc.long')+'</span>':'')+
          '<span>'+T('sc.est').replace('{wpm}', state.wpm)+'：<b>'+Mdl.fmtDur(s.estSec)+'</b></span>';
      }
    };
    renderList(); renderStats();
    main.querySelector('[data-wpm]').addEventListener('input', ev=>{ state.wpm = parseInt(ev.target.value)||220; renderStats(); });
    main.querySelector('[data-a=add]').addEventListener('click', ()=>{ const l=[...paras(),{id:Mdl.uid(),text:''}]; saveParas(l); renderList(); renderStats(); });
    main.querySelector('[data-a=paste]').addEventListener('click', async ()=>{
      const v = await A().promptInput(T('sc.paste'), '', '在此粘贴脚本…');
      if(v===null) return;
      project.scriptText = v; project.paragraphs = Mdl.splitParagraphs(v);
      A().markDirty(); renderList(); renderStats();
    });
    main.querySelector('[data-a=import]').addEventListener('click', ()=>{
      const inp = document.createElement('input'); inp.type='file'; inp.accept='.txt,.md,text/plain,text/markdown';
      inp.addEventListener('change', async ()=>{
        const f = inp.files[0]; if(!f) return;
        const text = await f.text();
        project.scriptText = text; project.paragraphs = Mdl.splitParagraphs(text);
        A().markDirty(); A().toast(T('sc.imported'), 'ok'); renderList(); renderStats();
      });
      inp.click();
    });
    main.querySelector('[data-a=copyAll]').addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText(project.scriptText||''); A().toast(T('sc.copied'), 'ok'); }catch(e){ A().toast(T('err.generic'), 'err'); }
    });
    main.querySelector('[data-a=manual]').addEventListener('click', ()=>ML.router.go('/project/'+project.id+'/storyboard'));
    main.querySelector('[data-a=gen]').addEventListener('click', ()=>genStoryboardFlow(project, main));
  }

  async function genStoryboardFlow(project, main){
    if(!ML.aiassist.isConfigured()){
      const r = await A().modal('<div style="font-size:13px;color:var(--text2);line-height:1.7">'+T('sc.genNeedCfg')+'</div><div style="margin-top:14px"><button class="btn" data-g="cfg" style="width:100%">'+T('nav.settings')+' →</button></div>', { title:T('ai.gen'), yesText:T('sc.manual'), noText:'取消' });
      if(r===true){ ML.router.go('/project/'+project.id+'/storyboard'); }
      else if(r==='cfg'){ ML.router.go('/settings'); }
      return;
    }
    const mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = '<div class="modal" style="width:460px"><div class="m-body" style="padding:28px;text-align:center"><div class="spin" style="margin:0 auto 14px"></div><div style="font-weight:600">'+T('ai.running')+'</div><div class="hint" style="margin-top:6px">'+T('ai.genNote')+'</div></div></div>';
    document.body.appendChild(mask);
    try{
      const shots = await ML.aiassist.generateStoryboard(project);
      mask.remove();
      showDraftConfirm(project, shots);
    }catch(e){
      mask.remove();
      A().toast((e&&e.vlabMessage)||String(e&&e.message||e), 'err');
    }
  }

  /* draft preview + merge/replace confirm — never overwrites without approval */
  function showDraftConfirm(project, shots){
    const sel = new Set(shots.map(s=>s.id));
    const mask = document.createElement('div');
    mask.className = 'modal-mask';
    const body = shots.map(s=>'<div class="ai-shot on" data-id="'+s.id+'"><div class="h"><b>#'+s.no+' · '+esc(s.title||'未命名')+'</b><span style="margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--text3)">'+(s.dur||'—')+'s · '+esc(s.shotType||'')+'</span></div><div class="d">'+esc((s.visual||s.text||'').slice(0,90))+'</div></div>').join('');
    mask.innerHTML =
      '<div class="modal" style="width:560px"><div class="m-head">'+T('ai.preview')+'（'+shots.length+'）</div><div class="m-body"><div class="ai-result">'+body+'</div>'+
      '<div style="display:flex;gap:8px;align-items:center"><button class="btn btn-sm" data-a="all">'+T('ai.selectAll')+'</button><button class="btn btn-sm" data-a="none">'+T('ai.none')+'</button></div></div>'+
      '<div class="m-foot"><button class="btn" data-a="cancel">'+T('ai.cancel')+'</button><button class="btn" data-a="merge">'+T('ai.merge')+'</button><button class="btn btn-primary" data-a="replace">'+T('ai.replace')+'</button></div></div>';
    document.body.appendChild(mask);
    mask.querySelectorAll('.ai-shot').forEach(el=>{
      el.addEventListener('click', ()=>{
        const id = el.dataset.id;
        if(sel.has(id)){ sel.delete(id); el.classList.remove('on'); }
        else { sel.add(id); el.classList.add('on'); }
      });
    });
    const close = ()=>{ mask.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = ev=>{ if(ev.key==='Escape') close(); };
    document.addEventListener('keydown', onKey);
    mask.querySelector('[data-a=cancel]').addEventListener('click', close);
    mask.querySelector('[data-a=all]').addEventListener('click', ()=>{ sel.clear(); shots.forEach(s=>sel.add(s.id)); mask.querySelectorAll('.ai-shot').forEach(el=>el.classList.add('on')); });
    mask.querySelector('[data-a=none]').addEventListener('click', ()=>{ sel.clear(); mask.querySelectorAll('.ai-shot').forEach(el=>el.classList.remove('on')); });
    mask.querySelector('[data-a=merge]').addEventListener('click', async ()=>{
      const chosen = shots.filter(s=>sel.has(s.id)).map(s=>{ const c=JSON.parse(JSON.stringify(s)); c.id=M().uid(); c.no=project.shots.length+1; return c; });
      if(!chosen.length){ close(); return; }
      await A().op(p=>{ p.shots = p.shots.concat(chosen); });
      close(); A().toast(T('ai.merged').replace('{n}', chosen.length), 'ok');
      ML.router.go('/project/'+project.id+'/storyboard');
    });
    mask.querySelector('[data-a=replace]').addEventListener('click', async ()=>{
      if(!await A().confirmDanger('替换将清空当前 '+project.shots.length+' 个镜头，确定？', '替换')) return;
      const chosen = shots.filter(s=>sel.has(s.id));
      await A().op(p=>{ p.shots = chosen.map((s,i)=>{ const c=JSON.parse(JSON.stringify(s)); c.id=M().uid(); c.no=i+1; return c; }); });
      close(); A().toast(T('ai.replaced'), 'ok');
      ML.router.go('/project/'+project.id+'/storyboard');
    });
  }

  /* ================= Storyboard ================= */
  function renderStoryboard(main, project){
    const Mdl = M();
    const state = { view:'cards', kw:'', stateFilter:'', selected:null };
    const shots = ()=> project.shots;
    const renumber = ()=>{ shots().forEach((s,i)=>{ s.no = i+1; }); };
    const selectedShot = ()=> shots().find(s=>s.id===state.selected) || null;
    const rerender = ()=>{ renderList(); renderDetail(); };
    let renderList = ()=>{};
    let renderDetail = ()=>{};
    let bindDetail = ()=>{};

    /* list (cards) */
    const cardView = (box)=>{
      const list = shots().filter(s=>{
        if(state.stateFilter && s.state!==state.stateFilter) return false;
        if(state.kw){ const h=(s.title+' '+(s.visual||'')+' '+(s.text||'')).toLowerCase(); if(!h.includes(state.kw)) return false; }
        return true;
      });
      if(!list.length){
        if(shots().length){
          box.innerHTML = '<div class="shot-empty">'+T('sb.noResult')+'</div>';
        }else{
          box.innerHTML =
            '<div class="shot-empty rich">'+
              '<div class="ic">'+icon(IC.film)+'</div>'+
              '<div class="t">'+T('sb.emptyT')+'</div>'+
              '<div class="s">'+T('sb.emptyS')+'</div>'+
              '<button class="btn btn-primary" data-empty-add>'+icon(IC.plus)+T('sb.emptyB')+'</button>'+
            '</div>';
          const eb = box.querySelector('[data-empty-add]');
          if(eb) eb.addEventListener('click', addShot);
        }
        return;
      }
      list.forEach(s=>{
        const card = document.createElement('div');
        card.className = 'shot-card'+(state.selected===s.id?' on':'');
        card.draggable = true;
        card.innerHTML =
          '<div class="shot-head">'+
            '<span class="shot-drag" title="拖拽排序">'+icon(IC.list)+'</span>'+
            '<span class="shot-no">#'+s.no+'</span>'+
            '<span class="shot-title">'+esc(s.title||'未命名镜头')+'</span>'+
            '<span class="shot-dur">'+(s.dur||'—')+'s</span>'+
            '<button class="btn btn-icon btn-sm" data-a="up" title="'+T('sc.up')+'"'+(list.indexOf(s)===0?' disabled':'')+'>'+icon(IC.up)+'</button>'+
            '<button class="btn btn-icon btn-sm" data-a="down" title="'+T('sc.down')+'"'+(list.indexOf(s)===list.length-1?' disabled':'')+'>'+icon(IC.down)+'</button>'+
            '<button class="btn btn-icon btn-sm" data-a="dup" title="'+T('sb.dup')+'">'+icon(IC.copy)+'</button>'+
            '<button class="btn btn-icon btn-sm btn-danger" data-a="del" title="'+T('sb.del')+'">'+icon(IC.trash)+'</button>'+
          '</div>'+
          (s.refs && s.refs.length ? '<img class="shot-thumb" style="float:left;margin-right:10px" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" data-ref="'+s.refs[0]+'" alt="">' : '')+
          '<div class="shot-text">'+esc((s.visual||s.text||''))+'</div>'+
          '<div class="shot-tags">'+
            '<span class="tg shot">'+esc(s.shotType||'')+'</span>'+
            '<span class="tg">'+esc(s.move||'')+'</span>'+
            (s.scene?'<span class="tg scene">'+esc(s.scene)+'</span>':'')+
            '<span class="tg state-'+esc(s.state)+'">'+esc(T('sb.st.'+s.state)||s.state)+'</span>'+
          '</div>';
        card.querySelector('[data-a=dup]').addEventListener('click', ev=>{ ev.stopPropagation(); dupShot(s.id); });
        card.querySelector('[data-a=del]').addEventListener('click', ev=>{ ev.stopPropagation(); delShot(s.id); });
        card.querySelector('[data-a=up]').addEventListener('click', ev=>{ ev.stopPropagation(); moveShot(s.id, -1); });
        card.querySelector('[data-a=down]').addEventListener('click', ev=>{ ev.stopPropagation(); moveShot(s.id, 1); });
        card.addEventListener('click', ()=>{ state.selected = s.id; rerender(); });
        /* drag & drop reorder with fallback buttons */
        card.addEventListener('dragstart', ev=>{ ev.dataTransfer.setData('text/plain', s.id); card.classList.add('dragging'); });
        card.addEventListener('dragend', ()=>card.classList.remove('dragging'));
        card.addEventListener('dragover', ev=>{ ev.preventDefault(); });
        card.addEventListener('drop', ev=>{
          ev.preventDefault();
          const fromId = ev.dataTransfer.getData('text/plain');
          if(!fromId || fromId===s.id) return;
          A().op(p=>{
            const arr = p.shots;
            const from = arr.findIndex(x=>x.id===fromId);
            const to = arr.findIndex(x=>x.id===s.id);
            if(from<0||to<0) return;
            const [item] = arr.splice(from,1);
            arr.splice(to,0,item);
            arr.forEach((x,i)=>x.no=i+1);
          });
          rerender();
        });
        box.appendChild(card);
      });
      /* async thumbnails */
      list.forEach(s=>{
        if(!s.refs || !s.refs.length) return;
        const img = box.querySelector('[data-ref="'+s.refs[0]+'"]');
        if(img) ML.store.getAssetBlob(s.refs[0]).then(blob=>{
          if(blob) img.src = URL.createObjectURL(blob);
        }).catch(()=>{});
      });
    };
    /* list (table) */
    const tableView = (box)=>{
      const list = shots().filter(s=>{
        if(state.stateFilter && s.state!==state.stateFilter) return false;
        if(state.kw){ const h=(s.title+' '+(s.visual||'')+' '+(s.text||'')).toLowerCase(); if(!h.includes(state.kw)) return false; }
        return true;
      });
      if(!list.length){ box.innerHTML = '<div class="shot-empty">'+(shots().length? T('sb.noResult') : T('sb.emptyT'))+'</div>'; return; }
      const table = document.createElement('table');
      table.className = 'sb-table';
      table.innerHTML = '<thead><tr><th>#</th><th>'+T('sb.f.title')+'</th><th>'+T('sb.f.visual')+'</th><th>'+T('sb.f.shotType')+'</th><th>'+T('sb.f.move')+'</th><th>'+T('sb.f.dur')+'</th><th>'+T('sb.f.scene')+'</th><th>'+T('sb.f.state')+'</th></tr></thead><tbody></tbody>';
      const tb = table.querySelector('tbody');
      list.forEach(s=>{
        const tr = document.createElement('tr');
        tr.className = state.selected===s.id?'selected':'';
        tr.innerHTML =
          '<td style="font-family:var(--mono);color:var(--text3)">'+s.no+'</td>'+
          '<td style="min-width:120px"><input class="inp" style="padding:4px 8px" data-f="title" data-id="'+s.id+'" value="'+esc(s.title)+'"></td>'+
          '<td style="min-width:220px"><input class="inp" style="padding:4px 8px" data-f="visual" data-id="'+s.id+'" value="'+esc(s.visual)+'"></td>'+
          '<td><select class="inp" style="padding:4px 8px" data-f="shotType" data-id="'+s.id+'">'+Mdl.SHOT_TYPES_EXT.map(x=>'<option'+(s.shotType===x?' selected':'')+'>'+x+'</option>').join('')+'</select></td>'+
          '<td><select class="inp" style="padding:4px 8px" data-f="move" data-id="'+s.id+'">'+Mdl.MOVES.map(x=>'<option'+(s.move===x?' selected':'')+'>'+x+'</option>').join('')+'</select></td>'+
          '<td><input class="inp" style="width:56px;padding:4px 8px" type="number" min="1" max="600" data-f="dur" data-id="'+s.id+'" value="'+s.dur+'"></td>'+
          '<td><input class="inp" style="padding:4px 8px" data-f="scene" data-id="'+s.id+'" value="'+esc(s.scene)+'"></td>'+
          '<td><select class="inp" style="padding:4px 8px" data-f="state" data-id="'+s.id+'">'+Mdl.SHOT_STATES.map(x=>'<option value="'+x.id+'"'+(s.state===x.id?' selected':'')+'>'+x.label+'</option>').join('')+'</select></td>';
        tr.addEventListener('click', ev=>{
          if(ev.target.tagName==='INPUT'||ev.target.tagName==='SELECT') return;
          state.selected = s.id; rerender();
        });
        tb.appendChild(tr);
      });
      table.addEventListener('input', ev=>{
        const f = ev.target.dataset.f, id = ev.target.dataset.id;
        const s = shots().find(x=>x.id===id);
        if(!s) return;
        if(f==='dur') s[f] = Math.max(1, parseFloat(ev.target.value)||1);
        else if(f==='shotType'||f==='move'||f==='state') s[f] = ev.target.value;
        else s[f] = ev.target.value;
        A().markDirty();
      });
      box.appendChild(table);
    };
    renderList = ()=>{
      const box = main.querySelector('[data-list]');
      box.innerHTML = '';
      if(state.view==='table') tableView(box);
      else cardView(box);
    };
    /* detail side panel */
    const fieldRow = (label, html)=>'<div class="row"><label class="lbl">'+label+'</label>'+html+'</div>';
    renderDetail = ()=>{
      const panel = main.querySelector('[data-detail]');
      const s = selectedShot();
      if(!s){
        panel.innerHTML = '<div class="card" style="padding:18px;color:var(--text3);font-size:12.5px">选择一个镜头以编辑其属性。</div>';
        return;
      }
      const selOpts = (arr, val)=>arr.map(x=>'<option'+(val===x?' selected':'')+'>'+x+'</option>').join('');
      panel.innerHTML =
        '<div class="card"><h4><span>#'+s.no+' · 镜头详情</span><button class="btn btn-icon btn-sm btn-danger" data-a="del">'+icon(IC.trash)+'</button></h4>'+
        fieldRow(T('sb.f.title'), '<input class="inp" data-f="title" value="'+esc(s.title)+'">')+
        fieldRow(T('sb.f.text'), '<textarea class="inp" data-f="text" rows="2">'+esc(s.text)+'</textarea>')+
        fieldRow(T('sb.f.visual'), '<textarea class="inp" data-f="visual" rows="3">'+esc(s.visual)+'</textarea>')+
        '<div class="grid2">'+
          fieldRow(T('sb.f.shotType'), '<select class="inp" data-f="shotType">'+selOpts(Mdl.SHOT_TYPES_EXT, s.shotType)+'</select>')+
          fieldRow(T('sb.f.move'), '<select class="inp" data-f="move">'+selOpts(Mdl.MOVES, s.move)+'</select>')+
        '</div>'+
        '<div class="grid2">'+
          fieldRow(T('sb.f.dur'), '<input class="inp" type="number" min="1" max="600" data-f="dur" value="'+s.dur+'">')+
          fieldRow(T('sb.f.method'), '<select class="inp" data-f="method">'+selOpts(Mdl.METHODS, s.method)+'</select>')+
        '</div>'+
        fieldRow(T('sb.f.scene'), '<input class="inp" data-f="scene" value="'+esc(s.scene)+'">')+
        '<div class="grid2">'+
          fieldRow(T('sb.f.people'), '<input class="inp" data-f="people" value="'+esc(Mdl.joinTags(s.people))+'">')+
          fieldRow(T('sb.f.props'), '<input class="inp" data-f="props" value="'+esc(Mdl.joinTags(s.props))+'">')+
        '</div>'+
        fieldRow(T('sb.f.sound'), '<input class="inp" data-f="sound" value="'+esc(s.sound)+'">')+
        fieldRow(T('sb.f.aiPrompt'), '<textarea class="inp" data-f="aiPrompt" rows="2">'+esc(s.aiPrompt)+'</textarea>')+
        '<div class="grid2">'+
          fieldRow(T('sb.f.state'), '<select class="inp" data-f="state">'+Mdl.SHOT_STATES.map(x=>'<option value="'+x.id+'"'+(s.state===x.id?' selected':'')+'>'+x.label+'</option>').join('')+'</select>')+
          fieldRow(T('sb.f.scriptPara'), '<select class="inp" data-f="scriptParaId"><option value="">—</option>'+(project.paragraphs||[]).map((p,i)=>'<option value="'+p.id+'"'+(s.scriptParaId===p.id?' selected':'')+'>段落 '+(i+1)+'</option>').join('')+'</select>')+
        '</div>'+
        fieldRow(T('sb.f.note'), '<textarea class="inp" data-f="note" rows="2">'+esc(s.note)+'</textarea>')+
        fieldRow(T('sb.f.refs'), '<div class="ref-grid" data-refs></div>')+
        '</div>';
      panel.querySelector('[data-a=del]').addEventListener('click', ()=>delShot(s.id));
      panel.querySelectorAll('[data-f]').forEach(inp=>{
        let timer = null;
        const apply = ()=>{
          const f = inp.dataset.f;
          if(f==='dur') s[f] = Math.max(1, parseFloat(inp.value)||1);
          else if(f==='state') s[f] = inp.value;
          else if(f==='shotType'||f==='move'||f==='method') s[f] = inp.value;
          else if(f==='people') s.people = Mdl.splitTags(inp.value);
          else if(f==='props') s.props = Mdl.splitTags(inp.value);
          else if(f==='scriptParaId') s[f] = inp.value || null;
          else s[f] = inp.value;
          A().markDirty();
          if(f==='title'||f==='visual'||f==='scene'||f==='shotType'||f==='move'||f==='dur'||f==='state') renderList();
        };
        inp.addEventListener('input', ()=>{ clearTimeout(timer); timer = setTimeout(apply, 350); });
        inp.addEventListener('change', ()=>{ clearTimeout(timer); apply(); });
      });
      renderRefs(panel.querySelector('[data-refs]'), s);
    };
    /* reference images */
    const renderRefs = (box, s)=>{
      box.innerHTML = '';
      (s.refs||[]).forEach(ref=>{
        const it = document.createElement('div');
        it.className = 'ref-item';
        it.innerHTML = '<img data-ref="'+ref+'" alt=""><button class="x" data-x="'+ref+'" aria-label="删除">×</button>';
        it.querySelector('.x').addEventListener('click', async ()=>{
          await A().op(p=>{ const sh = p.shots.find(x=>x.id===s.id); if(sh) sh.refs = (sh.refs||[]).filter(r=>r!==ref); });
          renderRefs(box, s);
        });
        box.appendChild(it);
        ML.store.getAssetBlob(ref).then(blob=>{ if(blob) it.querySelector('img').src = URL.createObjectURL(blob); }).catch(()=>{ it.innerHTML = '<div class="ref-place">加载失败</div>'; });
      });
      const add = document.createElement('div');
      add.className = 'ref-add';
      add.textContent = '+';
      add.title = '上传参考图';
      add.addEventListener('click', ()=>{
        const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*';
        document.body.appendChild(inp);
        inp.addEventListener('change', async ()=>{
          const f = inp.files[0]; if(!f) return;
          inp.remove();
          if(f.size > 12*1024*1024){ A().toast('图片过大（限 12MB）', 'err'); return; }
          const refId = M().uid();
          try{ await ML.store.saveAssetBlob(refId, f); }
          catch(e){ A().toast('保存图片失败：'+(e&&e.message||e), 'err'); return; }
          await A().op(p=>{ const sh = p.shots.find(x=>x.id===s.id); if(sh){ sh.refs = sh.refs||[]; sh.refs.push(refId); } });
          renderRefs(box, s); renderList();
        });
        inp.click();
      });
      box.appendChild(add);
    };
    bindDetail = renderDetail;

    const addShot = ()=>{
      A().op(p=>{ const ns = M().newShot({ no: p.shots.length+1 }); p.shots.push(ns); state.selected = ns.id; });
      rerender();
    };
    const dupShot = (id)=>{
      A().op(p=>{ const i = p.shots.findIndex(x=>x.id===id); if(i<0) return; const c = JSON.parse(JSON.stringify(p.shots[i])); c.id = M().uid(); c.no = i+2; p.shots.splice(i+1,0,c); p.shots.forEach((x,j)=>x.no=j+1); });
      A().toast(T('sb.dupToast'), 'ok'); rerender();
    };
    const delShot = async (id)=>{
      const s = shots().find(x=>x.id===id);
      if(!await A().confirmDanger(T('sb.confirmDel').replace('{no}', s? s.no : ''))) return;
      A().op(p=>{ p.shots = p.shots.filter(x=>x.id!==id); p.shots.forEach((x,i)=>x.no=i+1); });
      if(state.selected===id) state.selected = null;
      A().toast(T('sb.delToast')); rerender();
    };
    const moveShot = (id, dir)=>{
      A().op(p=>{
        const i = p.shots.findIndex(x=>x.id===id); if(i<0) return;
        const j = i+dir; if(j<0||j>=p.shots.length) return;
        [p.shots[i],p.shots[j]]=[p.shots[j],p.shots[i]];
        p.shots.forEach((x,k)=>x.no=k+1);
      });
      rerender();
    };

    main.innerHTML =
      '<div class="pg" style="max-width:none;padding:22px 28px 60px"><div class="pg-head" style="margin-bottom:14px"><div><div class="pg-title">'+T('sb.title')+'</div><div class="pg-sub">'+T('sb.sub')+'</div></div>'+
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">'+
        '<div class="search" style="width:190px">'+icon(IC.search)+'<input class="inp" data-kw placeholder="'+T('sb.search')+'"></div>'+
        '<select class="inp" data-filter style="width:auto">'+'<option value="">'+T('sb.stateAll')+'</option>'+Mdl.SHOT_STATES.map(x=>'<option value="'+x.id+'">'+x.label+'</option>').join('')+'</select>'+
        '<div class="seg" data-view><button data-v="cards" class="on">'+icon(IC.grid)+T('sb.viewCards')+'</button><button data-v="table">'+icon(IC.list)+T('sb.viewTable')+'</button></div>'+
        '<button class="btn btn-sm" data-a="batchDone">'+T('sb.batchDone')+'</button>'+
        '<button class="btn btn-sm" data-a="batchReady">'+T('sb.batchReady')+'</button>'+
        '<button class="btn btn-primary btn-sm" data-a="add">'+icon(IC.plus)+T('sb.addShot')+'</button>'+
      '</div></div>'+
      '<div class="sb-wrap"><div class="sb-main"><div data-list></div></div><div class="dtl" data-detail></div></div></div>';

    main.querySelector('[data-a=add]').addEventListener('click', addShot);
    main.querySelector('[data-kw]').addEventListener('input', ev=>{ state.kw = ev.target.value.trim().toLowerCase(); renderList(); });
    main.querySelector('[data-filter]').addEventListener('change', ev=>{ state.stateFilter = ev.target.value; renderList(); });
    main.querySelectorAll('[data-view] button').forEach(b=>{
      b.addEventListener('click', ()=>{
        state.view = b.dataset.v;
        main.querySelectorAll('[data-view] button').forEach(x=>x.classList.toggle('on', x===b));
        renderList();
      });
    });
    main.querySelector('[data-a=batchDone]').addEventListener('click', ()=>{
      A().op(p=>{ p.shots.forEach(x=>{ if(x.state!=='done') x.state='done'; }); });
      rerender();
    });
    main.querySelector('[data-a=batchReady]').addEventListener('click', ()=>{
      A().op(p=>{ p.shots.forEach(x=>{ if(x.state!=='ready') x.state='ready'; }); });
      rerender();
    });
    /* keyboard: arrow up/down select, delete removes */
    main.addEventListener('keydown', ev=>{
      const tag = (ev.target&&ev.target.tagName)||'';
      if(['TEXTAREA','INPUT','SELECT'].includes(tag)) return;
      const list = shots();
      if(!list.length) return;
      const idx = list.findIndex(s=>s.id===state.selected);
      if(ev.key==='ArrowDown'){ ev.preventDefault(); state.selected = list[(idx+1)%list.length].id; rerender(); }
      else if(ev.key==='ArrowUp'){ ev.preventDefault(); state.selected = list[(idx-1+list.length)%list.length].id; rerender(); }
      else if(ev.key==='Delete'||ev.key==='Backspace'){ ev.preventDefault(); if(state.selected) delShot(state.selected); }
    });
    /* expose move for potential fallback buttons */
    renderList(); renderDetail();
  }

  /* ================= Production board ================= */
  function renderProduction(main, project){
    const Mdl = M();
    const shots = ()=> project.shots;
    const tasks = ()=> project.tasks || [];
    const saveTasks = (l)=>{ project.tasks = l; A().markDirty(); };
    const groupBy = (field)=>{
      const map = new Map();
      shots().forEach(s=>{
        const key = String(s[field]||'').trim();
        if(!key) return;
        if(!map.has(key)) map.set(key, []);
        map.get(key).push(s);
      });
      return [...map.entries()].sort((a,b)=>b[1].length-a[1].length);
    };
    const groupProps = ()=>{
      const map = new Map();
      shots().forEach(s=>{
        (s.props||[]).forEach(pr=>{
          const key = pr.trim(); if(!key) return;
          if(!map.has(key)) map.set(key, []);
          map.get(key).push(s);
        });
      });
      return [...map.entries()].sort((a,b)=>b[1].length-a[1].length);
    };
    const groupPeople = ()=>{
      const map = new Map();
      shots().forEach(s=>{
        (s.people||[]).forEach(pr=>{
          const key = pr.trim(); if(!key) return;
          if(!map.has(key)) map.set(key, []);
          map.get(key).push(s);
        });
      });
      return [...map.entries()].sort((a,b)=>b[1].length-a[1].length);
    };
    const progress = ()=>{
      const t = tasks();
      if(!t.length) return { pct:0, done:0, total:0 };
      const done = t.filter(x=>x.state==='done').length;
      return { pct: Math.round(done/t.length*100), done, total: t.length };
    };
    const renderTasks = ()=>{
      const box = main.querySelector('[data-tasks]');
      box.innerHTML = '';
      const t = tasks();
      if(!t.length){
        box.innerHTML = '<div class="pd-noTasks" style="color:var(--text3);font-size:12.5px;padding:10px 0">'+T('pd.noTasks')+'</div>';
        return;
      }
      t.forEach(x=>{
        const shot = shots().find(s=>s.id===x.shotId);
        const item = document.createElement('div');
        item.className = 'pd-item'+(x.state==='done'?' done':'');
        item.innerHTML =
          '<div class="chk'+(x.state==='done'?' on':'')+'" data-toggle>'+icon(IC.check)+'</div>'+
          '<span class="txt">'+esc(x.title||'')+'</span>'+
          (shot? '<span class="tg" style="margin-left:4px">#'+shot.no+'</span>':'')+
          '<span class="pd-meta">'+esc(x.prio||'')+'</span>'+
          '<button class="btn btn-icon btn-sm btn-danger" data-del title="'+T('pd.taskDel')+'">'+icon(IC.trash)+'</button>';
        item.querySelector('[data-toggle]').addEventListener('click', async ()=>{
          await A().op(p=>{ const task = (p.tasks||[]).find(z=>z.id===x.id); if(task) task.state = task.state==='done'?'todo':'done'; });
          renderAll();
        });
        item.querySelector('[data-del]').addEventListener('click', async ()=>{
          await A().op(p=>{ p.tasks = (p.tasks||[]).filter(z=>z.id!==x.id); });
          renderAll();
        });
        box.appendChild(item);
      });
    };
    const renderAll = ()=>{
      const pr = progress();
      const pct = main.querySelector('[data-pct]');
      const fill = main.querySelector('[data-fill]');
      if(pct){ pct.textContent = pr.total ? (pr.pct+'% · '+pr.done+'/'+pr.total+' '+T('pd.done')) : T('pd.noTasks'); }
      if(fill) fill.style.width = (pr.total? pr.pct : 0)+'%';
      renderTasks();
      const scenes = groupBy('scene');
      const sceneBox = main.querySelector('[data-scenes]');
      sceneBox.innerHTML = '';
      if(!scenes.length) sceneBox.innerHTML = '<div style="color:var(--text3);font-size:12.5px">'+T('pd.emptyS')+'</div>';
      scenes.forEach(([name, list])=>{
        sceneBox.appendChild(makeGroupCard(T('pd.scenes'), name, list));
      });
      const props = groupProps();
      const propBox = main.querySelector('[data-props]');
      propBox.innerHTML = '';
      if(!props.length) propBox.innerHTML = '<div style="color:var(--text3);font-size:12.5px">'+T('pd.emptyS')+'</div>';
      props.forEach(([name, list])=>{
        propBox.appendChild(makeGroupCard(T('pd.props'), name, list));
      });
      const people = groupPeople();
      const peopleBox = main.querySelector('[data-people]');
      peopleBox.innerHTML = '';
      if(!people.length) peopleBox.innerHTML = '<div style="color:var(--text3);font-size:12.5px">'+T('pd.emptyS')+'</div>';
      people.forEach(([name, list])=>{
        peopleBox.appendChild(makeGroupCard(T('pd.people'), name, list));
      });
    };
    const makeGroupCard = (title, name, list)=>{
      const card = document.createElement('div');
      card.className = 'card pd-card';
      card.innerHTML = '<h4><span>'+esc(name)+'</span><span class="tg">'+list.length+' 镜头</span></h4><div class="pd-list">'+list.map(s=>'<div class="pd-item"><span class="tg">#'+s.no+'</span><span class="txt">'+esc(s.title||'未命名')+'</span><span class="pd-meta">'+esc(s.shotType||'')+'</span></div>').join('')+'</div>';
      return card;
    };
    main.innerHTML =
      '<div class="pg"><div class="pg-head"><div><div class="pg-title">'+T('pd.title')+'</div><div class="pg-sub">'+T('pd.sub')+'</div></div>'+
      '<div style="display:flex;gap:8px"><button class="btn btn-sm" data-a="addTask">'+icon(IC.plus)+T('pd.addTask')+'</button><button class="btn btn-sm" data-a="genTasks">'+T('pd.genTasks')+'</button></div></div>'+
      '<div class="card" style="padding:16px;margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h4 style="font-size:13px;font-weight:700">'+T('pd.progress')+'</h4><span class="pd-pct" data-pct></span></div><div class="pd-progress"><div class="fill" data-fill></div></div></div>'+
      '<div class="card" style="padding:16px;margin-bottom:16px"><h4 style="font-size:13px;font-weight:700;margin-bottom:10px">'+T('pd.tasks')+'</h4><div class="pd-list" data-tasks></div></div>'+
      '<div class="pd-grid"><div class="card pd-card" style="grid-column:1/-1"><h4 style="font-size:13px;font-weight:700;margin-bottom:12px">'+T('pd.scenes')+'</h4><div class="pd-grid" data-scenes></div></div>'+
      '<div class="card pd-card" style="grid-column:1/-1"><h4 style="font-size:13px;font-weight:700;margin-bottom:12px">'+T('pd.props')+'</h4><div class="pd-grid" data-props></div></div>'+
      '<div class="card pd-card" style="grid-column:1/-1"><h4 style="font-size:13px;font-weight:700;margin-bottom:12px">'+T('pd.people')+'</h4><div class="pd-grid" data-people></div></div></div></div>';
    main.querySelector('[data-a=addTask]').addEventListener('click', async ()=>{
      const title = await A().promptInput(T('pd.taskT')+'：', '', '例如：租借场地 / 准备灯光');
      if(title===null || !title.trim()) return;
      await A().op(p=>{ p.tasks = p.tasks||[]; p.tasks.push({ id: M().uid(), title: title.trim(), shotId: null, prio: '中', state: 'todo', note: '' }); });
      renderAll();
    });
    main.querySelector('[data-a=genTasks]').addEventListener('click', async ()=>{
      const exist = tasks().filter(x=>x.shotId);
      if(exist.length){ A().toast('已有镜头任务，未重复生成'); return; }
      await A().op(p=>{
        p.tasks = p.tasks||[];
        p.shots.forEach(s=>{
          if(s.state!=='done') p.tasks.push({ id: M().uid(), title: '拍摄镜头 '+s.no+'：'+(s.title||'未命名'), shotId: s.id, prio: s.state==='wip'?'高':'中', state: s.state==='done'?'done':'todo', note: '' });
        });
      });
      renderAll();
    });
    renderAll();
  }

  /* ================= AI assistant ================= */
  function renderAI(main, project){
    const cfg = ML.aiassist.configInfo();
    const state = { draft: null, sel: new Set(), busy: false, shotId: null };
    const render = ()=>{};
    const statusCard = ()=>{
      const box = main.querySelector('[data-status]');
      if(cfg){
        box.className = 'ai-status ok';
        box.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><path d="M20 6L9 17l-5-5"/></svg>'+esc(cfg.provider)+' · '+esc(cfg.model)+'';
      } else {
        box.className = 'ai-status err';
        box.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:15px;height:15px"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>'+T('ai.notCfg')+' <button class="btn btn-sm" data-g="cfg" style="margin-left:auto">'+T('nav.settings')+' →</button>';
        const b = box.querySelector('[data-g=cfg]');
        if(b) b.addEventListener('click', ()=>ML.router.go('/settings'));
      }
    };
    const renderDraft = ()=>{
      const box = main.querySelector('[data-draft]');
      if(!state.draft){
        box.innerHTML = '<div style="color:var(--text3);font-size:12.5px;padding:8px 0">'+T('ai.empty')+'</div>';
        return;
      }
      box.innerHTML = state.draft.map(s=>'<div class="ai-shot'+(state.sel.has(s.id)?' on':'')+'" data-id="'+s.id+'"><div class="h"><b>#'+s.no+' · '+esc(s.title||'')+'</b><span style="margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--text3)">'+(s.dur||'')+'s</span></div><div class="d">'+esc((s.visual||'').slice(0,70))+'</div></div>').join('');
      box.querySelectorAll('.ai-shot').forEach(el=>{
        el.addEventListener('click', ()=>{
          const id = el.dataset.id;
          if(state.sel.has(id)){ state.sel.delete(id); el.classList.remove('on'); }
          else { state.sel.add(id); el.classList.add('on'); }
        });
      });
    };
    const renderShotTools = ()=>{
      const box = main.querySelector('[data-shot-tools]');
      const s = project.shots.find(x=>x.id===state.shotId);
      if(!s){
        box.innerHTML = '<div style="color:var(--text3);font-size:12.5px">'+T('ai.noShot')+'</div>';
        return;
      }
      const zh = ML.aiassist.buildShotPrompt(s, 'zh');
      const en = ML.aiassist.buildShotPrompt(s, 'en');
      box.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b style="font-size:13px">#'+s.no+' · '+esc(s.title||'未命名')+'</b><button class="btn btn-sm" data-a="improve">'+T('ai.improve')+'</button></div>'+
        '<div class="row"><label class="lbl">'+T('ai.prompt')+'</label>'+
          '<div class="seg" style="margin-bottom:6px"><button data-pl="zh" class="on">'+T('ai.promptZh')+'</button><button data-pl="en">'+T('ai.promptEn')+'</button></div>'+
          '<textarea class="inp" data-prompt rows="6">'+esc(zh)+'</textarea>'+
          '<div style="display:flex;gap:6px;margin-top:6px"><button class="btn btn-sm" data-a="copy">'+T('ai.copy')+'</button><button class="btn btn-sm" data-a="saveP">'+T('ai.saveToShot')+'</button></div>'+
        '</div>'+
        '<div class="hint" style="margin-bottom:12px">'+T('ai.promptNote')+'</div>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm" data-a="gap">'+T('ai.gap')+'</button><button class="btn btn-sm" data-a="style">'+T('ai.style')+'</button></div>'+
        '<div class="st-res hidden" data-res style="margin-top:10px"></div>';
      let curLang = 'zh';
      box.querySelectorAll('[data-pl]').forEach(b=>{
        b.addEventListener('click', ()=>{
          curLang = b.dataset.pl;
          box.querySelectorAll('[data-pl]').forEach(x=>x.classList.toggle('on', x===b));
          box.querySelector('[data-prompt]').value = curLang==='zh'? zh : en;
        });
      });
      box.querySelector('[data-a=copy]').addEventListener('click', async ()=>{
        const v = box.querySelector('[data-prompt]').value;
        try{ await navigator.clipboard.writeText(v); A().toast(T('ai.copied'), 'ok'); }catch(e){ A().toast(T('err.generic'), 'err'); }
      });
      box.querySelector('[data-a=saveP]').addEventListener('click', async ()=>{
        await A().op(p=>{ const sh = p.shots.find(x=>x.id===state.shotId); if(sh) sh.aiPrompt = box.querySelector('[data-prompt]').value; });
        A().toast(T('ai.saved'), 'ok');
      });
      box.querySelector('[data-a=improve]').addEventListener('click', async ()=>{
        if(!cfg){ A().toast(T('ai.notCfg'), 'err'); return; }
        const btn = box.querySelector('[data-a=improve]');
        btn.disabled = true; btn.textContent = T('ai.improving');
        try{
          const better = await ML.aiassist.improveVisual(s);
          await A().op(p=>{ const sh = p.shots.find(x=>x.id===state.shotId); if(sh) sh.visual = better; });
          A().toast(T('ai.saved'), 'ok');
          renderShotTools();
        }catch(e){ A().toast((e&&e.vlabMessage)||String(e&&e.message||e), 'err'); }
        finally{ btn.disabled = false; }
      });
      box.querySelector('[data-a=gap]').addEventListener('click', async ()=>{
        if(!cfg){ A().toast(T('ai.notCfg'), 'err'); return; }
        const res = box.querySelector('[data-res]');
        res.className = 'st-res run'; res.classList.remove('hidden'); res.textContent = T('ai.running');
        try{
          const out = await ML.aiassist.gapCheck(project);
          res.className = 'st-res ok'; res.textContent = out;
        }catch(e){ res.className = 'st-res fail'; res.textContent = (e&&e.vlabMessage)||String(e&&e.message||e); }
      });
      box.querySelector('[data-a=style]').addEventListener('click', ()=>{
        const sug = ML.aiassist.suggestStyle(project);
        const res = box.querySelector('[data-res]');
        res.className = 'st-res ok'; res.classList.remove('hidden');
        res.textContent = T('ai.styleHint').replace('{style}', sug.style).replace('{tip}', sug.tip);
      });
    };
    main.innerHTML =
      '<div class="pg" style="max-width:960px"><div class="pg-head"><div><div class="pg-title">'+T('ai.title')+'</div><div class="pg-sub">'+T('ai.sub')+'</div></div></div>'+
      '<div class="card ai-card" style="margin-bottom:16px"><div class="ai-status" data-status></div>'+
        '<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><button class="btn btn-primary" data-a="gen">'+icon(IC.ai)+T('ai.gen')+'</button><span class="hint">'+T('ai.genNote')+'</span></div>'+
        '<div class="ai-result" data-draft></div>'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-sm" data-a="merge">'+T('ai.merge')+'</button><button class="btn btn-sm btn-danger" data-a="replace">'+T('ai.replace')+'</button><button class="btn btn-sm" data-a="selAll">'+T('ai.selectAll')+'</button><button class="btn btn-sm" data-a="selNone">'+T('ai.none')+'</button></div>'+
      '</div>'+
      '<div class="card ai-card" data-shot-tools></div></div>';
    statusCard(); renderDraft(); renderShotTools();
    const genBtn = main.querySelector('[data-a=gen]');
    genBtn.addEventListener('click', async ()=>{
      if(!cfg){ A().toast(T('ai.notCfg'), 'err'); return; }
      if(state.busy) return;
      state.busy = true; genBtn.disabled = true; genBtn.innerHTML = '<span class="spin"></span>'+T('ai.running');
      try{
        state.draft = await ML.aiassist.generateStoryboard(project);
        state.sel = new Set(state.draft.map(s=>s.id));
        renderDraft();
        A().toast(T('ai.ok'), 'ok');
      }catch(e){ A().toast((e&&e.vlabMessage)||String(e&&e.message||e), 'err'); }
      finally{ state.busy = false; genBtn.disabled = false; genBtn.innerHTML = icon(IC.ai)+T('ai.gen'); }
    });
    main.querySelector('[data-a=merge]').addEventListener('click', async ()=>{
      if(!state.draft) return;
      const chosen = state.draft.filter(s=>state.sel.has(s.id));
      if(!chosen.length) return;
      await A().op(p=>{ p.shots = p.shots.concat(chosen.map(s=>{ const c=JSON.parse(JSON.stringify(s)); c.id=M().uid(); c.no=1; return c; })); p.shots.forEach((x,i)=>x.no=i+1); });
      state.draft = null; renderDraft(); A().toast(T('ai.merged').replace('{n}', chosen.length), 'ok');
    });
    main.querySelector('[data-a=replace]').addEventListener('click', async ()=>{
      if(!state.draft) return;
      if(!await A().confirmDanger('替换将清空当前 '+project.shots.length+' 个镜头，确定？', '替换')) return;
      const chosen = state.draft.filter(s=>state.sel.has(s.id));
      await A().op(p=>{ p.shots = chosen.map(s=>{ const c=JSON.parse(JSON.stringify(s)); c.id=M().uid(); c.no=1; return c; }); p.shots.forEach((x,i)=>x.no=i+1); });
      state.draft = null; renderDraft(); A().toast(T('ai.replaced'), 'ok');
    });
    main.querySelector('[data-a=selAll]').addEventListener('click', ()=>{ if(state.draft){ state.sel = new Set(state.draft.map(s=>s.id)); renderDraft(); } });
    main.querySelector('[data-a=selNone]').addEventListener('click', ()=>{ state.sel.clear(); renderDraft(); });
    main.querySelector('[data-shot-tools]').addEventListener('click', ev=>{
      if(ev.target.closest('[data-a]')) return; // handled inside renderShotTools
    });
    /* shot picker: clicking a shot card in storyboard area is not here; add mini list */
    const picker = document.createElement('div');
    picker.className = 'card' ;
    picker.style.cssText = 'padding:14px;margin-bottom:14px';
    picker.innerHTML = '<div style="font-size:12px;color:var(--text3);margin-bottom:8px">选择镜头：</div><div style="display:flex;gap:6px;flex-wrap:wrap" data-picks></div>';
    main.querySelector('.pg').insertBefore(picker, main.querySelector('[data-shot-tools]'));
    const renderPicks = ()=>{
      const box = picker.querySelector('[data-picks]');
      box.innerHTML = project.shots.map(s=>'<button class="btn btn-sm'+(state.shotId===s.id?' btn-primary':'')+'" data-pick="'+s.id+'">#'+s.no+' '+(s.title||'').slice(0,8)+'</button>').join('') || '<span style="color:var(--text3);font-size:12px">'+T('sb.emptyT')+'</span>';
      box.querySelectorAll('[data-pick]').forEach(b=>{
        b.addEventListener('click', ()=>{ state.shotId = b.dataset.pick; renderPicks(); renderShotTools(); });
      });
    };
    renderPicks();
  }

  /* ================= Export ================= */
  function renderExport(main, project){
    const state = { scope:'all', sel:null, withScript:true, withProd:true, withImages:true };
    const fmt = (name, desc, ic)=>{
      return '<div class="card ex-card" data-fmt="'+name+'"><div class="ic">'+ic+'</div><div class="t">'+name.toUpperCase()+'</div><div class="s">'+desc+'</div></div>';
    };
    main.innerHTML =
      '<div class="pg"><div class="pg-head"><div><div class="pg-title">'+T('ex.title')+'</div><div class="pg-sub">'+T('ex.sub')+'</div></div></div>'+
      '<div class="card" style="padding:16px;margin-bottom:16px"><h4 style="font-size:13px;font-weight:700;margin-bottom:10px">'+T('ex.options')+'</h4>'+
        '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'+
          '<label style="display:flex;gap:6px;align-items:center;font-size:12.5px"><input type="checkbox" data-o="withScript" checked> '+T('ex.script')+'</label>'+
          '<label style="display:flex;gap:6px;align-items:center;font-size:12.5px"><input type="checkbox" data-o="withProd" checked> '+T('ex.prod')+'</label>'+
          '<label style="display:flex;gap:6px;align-items:center;font-size:12.5px"><input type="checkbox" data-o="withImages" checked> '+T('ex.images')+'</label>'+
          '<span style="margin-left:auto;font-size:12.5px;color:var(--text2)">'+T('ex.all')+' · '+project.shots.length+' 镜头</span>'+
        '</div></div>'+
      '<div class="ex-grid">'+
        fmt('md', T('ex.mdS'), icon(IC.doc))+
        fmt('csv', T('ex.csvS'), icon(IC.list))+
        fmt('json', T('ex.jsonS'), icon(IC.export))+
        fmt('pdf', T('ex.pdfS'), icon(IC.film))+
      '</div>'+
      '<div class="hint" style="margin-top:12px">'+T('ex.pdfNote')+'</div>'+
      '<div style="height:1px;background:var(--border);margin:26px 0"></div>'+
      '<div class="card" style="padding:18px"><h4 style="font-size:14px;font-weight:700;margin-bottom:4px">'+T('ex.import')+'</h4><div class="hint" style="margin-bottom:12px">'+T('ex.importNote')+'</div>'+
        '<button class="btn" data-a="importFile">'+icon(IC.export)+T('ex.importS')+'</button><input type="file" data-file accept=".json,application/json" class="hidden"></div></div>';
    main.querySelectorAll('[data-o]').forEach(c=>{
      c.addEventListener('change', ()=>{ state[c.dataset.o]===undefined? null : null; state[c.dataset.o] = c.checked; });
    });
    main.querySelectorAll('[data-fmt]').forEach(card=>{
      card.addEventListener('click', ()=>{ doExport(card.dataset.fmt, state); });
    });
    const fileInput = main.querySelector('[data-file]');
    main.querySelector('[data-a=importFile]').addEventListener('click', ()=>fileInput.click());
    fileInput.addEventListener('change', async ()=>{
      const f = fileInput.files[0]; if(!f) return;
      const res = await ML.export2.importProject(f);
      if(!res.ok){ A().toast(T('ex.importFail')+'：'+res.errors.join('；'), 'err'); return; }
      const mode = await A().modal(
        '<div style="font-size:13px;color:var(--text2);line-height:1.7">「'+esc(res.project.name)+'」 — '+(res.warn.length? res.warn.join('；') : T('ex.importWarn'))+'</div>'+
        '<div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-primary" data-g="new" style="flex:1">'+T('ex.importAsNew')+'</button><button class="btn" data-g="over" style="flex:1">'+T('ex.overwrite')+'</button></div>',
        { title:T('ex.import'), yesText:'取消', noText:false }
      );
      if(mode==='new'){
        res.project.id = M().uid();
        res.project.createdAt = Date.now(); res.project.updatedAt = Date.now();
        await ML.store.saveProject(res.project);
        await A().openProject(res.project.id);
        ML.router.go('/project/'+res.project.id+'/script');
        A().toast(T('ex.imported'), 'ok');
      } else if(mode==='over'){
        res.project.id = project.id;
        res.project.updatedAt = Date.now();
        await A().op(p=>{ Object.assign(p, res.project); p.id = project.id; });
        ML.router.render();
        A().toast(T('ex.imported'), 'ok');
      }
    });
  }
  async function doExport(fmt, state){
    const project = A().getProject();
    if(!project) return;
    const name = project.name.replace(/[\\/:*?"<>|]/g,'_');
    try{
      if(fmt==='md'){
        const text = ML.export2.md(project, { script: state.withScript, prod: state.withProd });
        ML.export2.download(new Blob([text], { type:'text/markdown;charset=utf-8' }), name+'-分镜方案.md');
      } else if(fmt==='csv'){
        const text = ML.export2.csv(project, {});
        ML.export2.download(new Blob([text], { type:'text/csv;charset=utf-8' }), name+'-分镜表.csv');
      } else if(fmt==='json'){
        const text = await ML.export2.exportJSON(project, { images: state.withImages });
        ML.export2.download(new Blob([text], { type:'application/json' }), name+'-项目备份.json');
      } else if(fmt==='pdf'){
        const mask = document.createElement('div');
        mask.className = 'modal-mask';
        mask.innerHTML = '<div class="modal" style="width:400px"><div class="m-body" style="padding:26px;text-align:center"><div class="spin" style="margin:0 auto 14px"></div><div>正在生成 PDF…</div></div></div>';
        document.body.appendChild(mask);
        try{
          const res = await ML.export2.exportPDF(project, { script: state.withScript });
          mask.remove();
          ML.export2.download(res.blob, name+'-分镜方案.pdf');
        }catch(e){ mask.remove(); A().toast('PDF 生成失败：'+String(e&&e.message||e), 'err'); return; }
      }
      A().toast(T('ex.done')+' '+fmt.toUpperCase(), 'ok');
    }catch(e){
      A().toast(String(e&&e.message||e), 'err');
    }
  }

  /* ================= Settings ================= */
  function renderSettings(main){
    const cfg = ML.providers.config() && ML.providers.config().ai;
    const state = {
      provider: (cfg && cfg.provider && cfg.provider!=='none') ? cfg.provider : 'deepseek',
      baseUrl: (cfg && cfg.baseUrl) || '',
      key: (cfg && cfg.key) || '',
      model: (cfg && cfg.model) || ''
    };
    const suppliers = (ML.providers.supplierList ? ML.providers.supplierList() : []);
    const SUP_NAME = { openai:'OpenAI', deepseek:'DeepSeek', moonshot:'Moonshot', zhipu:'智谱 GLM', qwen:'通义千问', custom:'自定义（OpenAI 兼容）' };
    const capHtml = ['json','chat','long'].map(c=>'<span class="tg yes">'+T('set.cap.'+c)+'</span>').join('');
    main.innerHTML =
      '<div class="pg" style="max-width:920px"><div class="pg-head"><div><div class="pg-title">'+T('set.title')+'</div><div class="pg-sub">'+T('set.aiSub')+'</div></div></div>'+
      '<div class="st-grid"><div class="card" style="padding:20px">'+
        '<h4 style="font-size:14px;font-weight:700;margin-bottom:14px">'+T('set.ai')+'</h4>'+
        '<div class="row"><label class="lbl">'+T('set.suppliers')+'</label><div class="type-grid" style="grid-template-columns:repeat(3,1fr)" data-suppliers>'+suppliers.map(s=>'<div class="type-chip'+(state.provider===s?' on':'')+'" data-s="'+s+'">'+esc(SUP_NAME[s]||s)+'</div>').join('')+'</div></div>'+
        '<div class="row"><label class="lbl">'+T('set.baseUrl')+'</label><input class="inp" data-f="baseUrl" value="'+esc(state.baseUrl)+'" placeholder="https://api.example.com/v1"></div>'+
        '<div class="row"><label class="lbl">'+T('set.key')+'</label><input class="inp" data-f="key" type="password" value="'+esc(state.key)+'" placeholder="sk-…" autocomplete="off"></div>'+
        '<div class="row"><label class="lbl">'+T('set.model')+'</label><input class="inp" data-f="model" value="'+esc(state.model)+'" placeholder="deepseek-chat"></div>'+
        '<div class="row"><label class="lbl">'+T('set.caps')+'</label><div class="st-cap">'+capHtml+'</div></div>'+
        '<div class="st-actions">'+
          '<button class="btn" data-a="test">'+T('set.test')+'</button>'+
          '<button class="btn btn-primary" data-a="save">'+T('set.save')+'</button>'+
          '<button class="btn btn-danger" data-a="clear">'+T('set.clearKey')+'</button>'+
        '</div>'+
        '<div class="st-res hidden" data-res></div>'+
      '</div>'+
      '<div class="card" style="padding:20px"><h4 style="font-size:14px;font-weight:700;margin-bottom:14px">'+T('set.notes')+'</h4>'+
        '<div class="st-note" style="margin-bottom:10px">'+T('set.note.key')+'</div>'+
        '<div class="st-note" style="margin-bottom:10px">'+T('set.note.cors')+'</div>'+
        '<div class="st-note" style="margin-bottom:10px">'+T('set.note.cost')+'</div>'+
        '<div class="st-note">'+T('set.note.send')+'</div>'+
      '</div></div></div>';
    main.querySelectorAll('[data-s]').forEach(chip=>{
      chip.addEventListener('click', ()=>{
        const sup = ML.providers.supplier && ML.providers.supplier(chip.dataset.s);
        state.provider = chip.dataset.s;
        if(sup && sup.baseUrl && sup.model){
          state.baseUrl = sup.baseUrl; state.model = sup.model;
          main.querySelector('[data-f=baseUrl]').value = sup.baseUrl;
          main.querySelector('[data-f=model]').value = sup.model;
        }
        main.querySelectorAll('[data-s]').forEach(x=>x.classList.toggle('on', x===chip));
      });
    });
    main.querySelectorAll('[data-f]').forEach(inp=>{
      inp.addEventListener('input', ()=>{ state[inp.dataset.f] = inp.value; });
    });
    const res = main.querySelector('[data-res]');
    const setRes = (cls, txt)=>{ res.className = 'st-res '+cls; res.classList.remove('hidden'); res.textContent = txt; };
    main.querySelector('[data-a=save]').addEventListener('click', async ()=>{
      const baseUrl = state.baseUrl.trim().replace(/\/+$/,'');
      if(!/^https?:\/\/.+/i.test(baseUrl)){ setRes('fail', 'Base URL 必须是 http(s):// 开头的有效地址'); return; }
      try{
        const newCfg = JSON.parse(JSON.stringify(ML.providers.config() || {}));
        newCfg.ai = { provider: state.provider, baseUrl, key: state.key.trim(), model: state.model.trim() || 'deepseek-chat' };
        await ML.providers.saveConfig(newCfg);
        setRes('ok', T('set.saved'));
      }catch(e){ setRes('fail', String(e&&e.message||e)); }
    });
    main.querySelector('[data-a=test]').addEventListener('click', async ()=>{
      const baseUrl = state.baseUrl.trim().replace(/\/+$/,'');
      const key = state.key.trim();
      const model = state.model.trim() || 'deepseek-chat';
      if(!/^https?:\/\/.+/i.test(baseUrl)){ setRes('fail', 'Base URL 必须是 http(s):// 开头的有效地址'); return; }
      /* persist first — testConnection reads the saved config */
      try{
        const newCfg = JSON.parse(JSON.stringify(ML.providers.config() || {}));
        newCfg.ai = { provider: state.provider, baseUrl, key, model };
        await ML.providers.saveConfig(newCfg);
      }catch(e){ setRes('fail', '保存配置失败：'+String(e&&e.message||e)); return; }
      setRes('run', '正在请求 '+baseUrl+' …');
      const btn = main.querySelector('[data-a=test]');
      btn.disabled = true;
      try{
        const r = await ML.providers.testConnection('ai');
        if(r && r.ok) setRes('ok', T('set.testOk').replace('{m}', model)+(r.kind==='chat'? '（chat 探测）':''));
        else setRes('fail', (r && r.message) || '连接失败');
      }catch(e){
        setRes('fail', (e && e.vlabMessage) || String(e&&e.message||e));
      }
      finally{ btn.disabled = false; }
    });
    main.querySelector('[data-a=clear]').addEventListener('click', async ()=>{
      if(!await A().confirmDanger(T('set.clearConfirm'), T('set.clearKey'))) return;
      state.key = '';
      main.querySelector('[data-f=key]').value = '';
      try{
        const newCfg = JSON.parse(JSON.stringify(ML.providers.config() || {}));
        if(newCfg.ai) newCfg.ai.key = '';
        await ML.providers.saveConfig(newCfg);
        setRes('ok', T('set.keyCleared'));
      }catch(e){ setRes('fail', String(e&&e.message||e)); }
    });
  }

  function render(route, main, project){
    if(route.name==='projects') return renderProjects(main);
    if(route.name==='settings') return renderSettings(main);
    if(route.name==='project'){
      if(route.sub==='script') return renderScript(main, project);
      if(route.sub==='storyboard') return renderStoryboard(main, project);
      if(route.sub==='production') return renderProduction(main, project);
      if(route.sub==='ai') return renderAI(main, project);
      if(route.sub==='export') return renderExport(main, project);
    }
    main.innerHTML = '<div class="empty"><div class="t">404</div><div class="s">'+T('err.route')+'</div></div>';
  }

  return { render };
})();
