/* ============ ML.views — route views: home / new edit / assets / settings / project ============ */
ML.views = (function(){
  const L = ML.lib, Tn = ML.i18n.t;

  const esc = s => String(s==null?'':s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  /* ============ HOME ============ */
  async function home(app){
    const projects = await ML.store.listProjects();
    app.innerHTML = ''+
      '<div class="home-hero">'+
        '<div class="hh-top"><span class="hh-count">'+String(projects.length).padStart(3,'0')+' / PROJECTS</span></div>'+
        '<h1 class="hh-title">'+Tn('home.title')+'</h1>'+
        '<p class="hh-sub">'+Tn('home.sub')+'</p>'+
        '<div class="hh-actions">'+
          '<button class="btn btn-primary" data-act="new">'+Tn('home.newProj')+'</button>'+
          (projects.length?'<button class="btn btn-ghost" data-act="recent">'+Tn('home.recent')+'</button>':'')+
        '</div>'+
      '</div>'+
      '<div class="home-projects" id="recent">'+
        '<div class="hp-head"><span>'+Tn('home.recent')+'</span></div>'+
        (projects.length ? '<div class="hp-grid"></div>' : '<div class="hp-empty"><div>'+Tn('home.empty')+'</div><button class="btn" data-act="new">'+Tn('home.start')+'</button></div>')+
      '</div>'+
      '<div class="home-how">'+
        '<div class="hh2">'+Tn('home.how')+'</div>'+
        '<div class="how-grid">'+
          '<div class="how-card"><span class="how-idx">01</span><div class="how-t">'+Tn('home.h1')+'</div><div class="how-d">'+Tn('home.h1d')+'</div></div>'+
          '<div class="how-card"><span class="how-idx">02</span><div class="how-t">'+Tn('home.h2')+'</div><div class="how-d">'+Tn('home.h2d')+'</div></div>'+
          '<div class="how-card"><span class="how-idx">03</span><div class="how-t">'+Tn('home.h3')+'</div><div class="how-d">'+Tn('home.h3d')+'</div></div>'+
        '</div>'+
      '</div>';
    if(projects.length){
      const grid = app.querySelector('.hp-grid');
      projects.forEach(p=>{
        const [w,h] = ML.compose.ratioSize(p.ratio||'9:16', 400);
        const card = document.createElement('div');
        card.className = 'proj-card';
        card.innerHTML = ''+
          '<div class="pc-thumb" style="aspect-ratio:'+w+'/'+h+'"><span>'+esc(p.name||Tn('proj.untitled'))+'</span></div>'+
          '<div class="pc-name">'+esc(p.name||Tn('proj.untitled'))+'</div>'+
          '<div class="pc-meta">'+(p.ratio||'9:16')+' · '+L.round(ML.timeline.durationOf(p),1)+'s · '+fmtDate(p.updatedAt)+'</div>'+
          '<div class="pc-actions">'+
            '<button class="btn btn-ghost sm" data-act="open" data-id="'+p.id+'">'+Tn('proj.open')+'</button>'+
            '<button class="btn btn-ghost sm" data-act="dup" data-id="'+p.id+'">'+Tn('proj.dup')+'</button>'+
            '<button class="btn btn-ghost sm danger" data-act="del" data-id="'+p.id+'">'+Tn('proj.del')+'</button>'+
          '</div>';
        grid.appendChild(card);
      });
    }
    app.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click', async e=>{
      const a = b.dataset.act;
      if(a==='new'){ ML.router.go('/new'); }
      else if(a==='recent'){ app.querySelector('#recent').scrollIntoView({behavior:'smooth'}); }
      else if(a==='open'){ ML.router.go('/projects/'+b.dataset.id); }
      else if(a==='dup'){
        const p = await ML.store.getProject(b.dataset.id);
        if(p){
          const copy = Object.assign({}, JSON.parse(JSON.stringify(p)), { id: 'p'+L.uid(), name: (p.name||'Project')+' Copy', createdAt: Date.now(), updatedAt: Date.now() });
          await ML.store.saveProject(copy);
          L.toast(Tn('proj.dupToast')); home(app);
        }
      }
      else if(a==='del'){
        const p = await ML.store.getProject(b.dataset.id);
        if(p){
          const ok = await L.confirm(Tn('proj.del')+'「'+esc(p.name||'')+'」?');
          if(ok){ await ML.store.deleteProject(b.dataset.id); (p.assetIds||[]).forEach(id=>ML.store.deleteAssetBlob(id)); L.toast(Tn('proj.delToast')); home(app); }
        }
      }
    }));
  }
  function fmtDate(ts){
    if(!ts) return '—';
    const d = new Date(ts);
    return String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  }

  /* ============ NEW EDIT wizard ============ */
  let draft = null;
  async function newEdit(app){
    draft = {
      id: 'p'+L.uid(), name: Tn('proj.untitled'), ratio: '9:16', fps: 30,
      scriptText: '', scenes: [], assets: [], voiceSegments: [],
      timeline: { clips: [], duration: 0 }, settings: {}, createdAt: Date.now(), updatedAt: Date.now()
    };
    app.innerHTML = ''+
      '<div class="nw-top"><h2>'+Tn('create.title')+'</h2><div class="nw-meta"><span class="nw-id">'+draft.id+'</span></div></div>'+
      '<div class="nw-grid">'+
        '<section class="nw-card" data-step="1">'+
          '<div class="nw-card-head"><span class="nw-idx">01</span><span>'+Tn('create.name')+'</span><span class="nw-ratio-label">'+Tn('create.ratio')+'</span></div>'+
          '<div class="nw-body">'+
            '<input class="inp nw-name" value="'+esc(draft.name)+'">'+
            '<div class="ratio-row">'+
              ['9:16','1:1','4:5','16:9'].map(r=>'<button class="ratio-btn'+(r==='9:16'?' on':'')+'" data-ratio="'+r+'">'+r+'</button>').join('')+
            '</div>'+
            '<div class="nw-hint">'+Tn('create.ratio.hint')+'</div>'+
            '<div class="nw-mode">'+
              '<button class="nw-mode-btn on" data-mode="script">'+Tn('vo.modeScript')+'</button>'+
              '<button class="nw-mode-btn" data-mode="voiceover">'+Tn('vo.modeVoiceover')+'</button>'+
            '</div>'+
          '</div>'+
        '</section>'+
        '<section class="nw-card nw-vo-card" data-step="2v" hidden>'+
          '<div class="nw-card-head"><span class="nw-idx">02</span><span>'+Tn('vo.voiceover')+'</span><span class="nw-badge" data-badge="vo">—</span></div>'+
          '<div class="nw-body">'+
            '<div class="dropzone" data-vo-zone>'+Tn('vo.drop')+'<br><span>'+Tn('vo.dropSub')+'</span></div>'+
            '<input type="file" class="nw-vo-file" accept="video/*,audio/*" hidden>'+
            '<div class="nw-vo-meta"></div>'+
            '<div class="nw-row"><label>'+Tn('vo.transcribeWith')+'</label><select class="inp nw-tr-provider">'+
              '<option value="whisper-local">'+Tn('vo.trWhisper')+'</option>'+
              '<option value="api">'+Tn('vo.trApi')+'</option>'+
              '<option value="srt">'+Tn('vo.trSrt')+'</option>'+
            '</select></div>'+
            '<div class="nw-tr-cfg" data-cfg="whisper-local">'+
              '<div class="nw-row"><label>'+Tn('vo.model')+'</label><select class="inp nw-tr-model">'+
                '<option value="Xenova/whisper-tiny">whisper-tiny '+Tn('vo.fast')+'</option>'+
                '<option value="Xenova/whisper-base">whisper-base '+Tn('vo.balanced')+'</option>'+
                '<option value="Xenova/whisper-small">whisper-small '+Tn('vo.accurate')+'</option>'+
              '</select></div>'+
              '<div class="nw-row"><label>'+Tn('vo.lang')+'</label><select class="inp nw-tr-lang">'+
                '<option value="zh">中文</option><option value="en">English</option><option value="ja">日本語</option><option value="ko">한국어</option>'+
              '</select></div>'+
              '<div class="nw-row"><label>'+Tn('vo.mirror')+'</label><input class="inp nw-tr-mirror" placeholder="'+esc(Tn('vo.mirrorPh'))+'"></div>'+
              '<div class="nw-hint">'+Tn('vo.whisperNote')+'</div>'+
            '</div>'+
            '<div class="nw-tr-cfg" data-cfg="api" hidden>'+
              '<div class="nw-hint">'+Tn('vo.apiNote')+'</div>'+
              '<div class="nw-row"><label>'+Tn('vo.apiModel')+'</label><input class="inp nw-tr-api-model" value="whisper-1" placeholder="whisper-1"></div>'+
            '</div>'+
            '<div class="nw-tr-cfg" data-cfg="srt" hidden>'+
              '<textarea class="inp nw-tr-srt" rows="5" placeholder="'+esc(Tn('vo.srtPh'))+'"></textarea>'+
            '</div>'+
            '<div class="nw-actions"><button class="btn" data-act="runTranscribe">'+Tn('vo.transcribe')+'</button></div>'+
            '<div class="nw-segs"></div>'+
          '</div>'+
        '</section>'+
        '<section class="nw-card" data-step="2">'+
          '<div class="nw-card-head"><span class="nw-idx">02</span><span>'+Tn('step.script')+'</span><span class="nw-badge" data-badge="script">—</span></div>'+
          '<div class="nw-body">'+
            '<textarea class="inp nw-script" rows="7" placeholder="'+esc(Tn('sc.placeholder'))+'"></textarea>'+
            '<div class="nw-actions"><button class="btn" data-act="analyzeScript">'+Tn('sc.analyze')+'</button></div>'+
            '<div class="nw-scenes"></div>'+
          '</div>'+
        '</section>'+
        '<section class="nw-card" data-step="3">'+
          '<div class="nw-card-head"><span class="nw-idx">03</span><span>'+Tn('step.media')+'</span><span class="nw-badge" data-badge="media">0</span></div>'+
          '<div class="nw-body">'+
            '<div class="dropzone" data-zone>'+Tn('media.drop')+'<br><span>'+Tn('media.dropSub')+'</span></div>'+
            '<input type="file" class="nw-file" multiple accept="video/*,image/*,audio/*" hidden>'+
            '<div class="nw-actions"><button class="btn" data-act="pickFiles">'+Tn('media.upload')+'</button><button class="btn btn-ghost" data-act="analyzeMedia">'+Tn('media.analyze')+'</button></div>'+
            '<div class="nw-media"></div>'+
          '</div>'+
        '</section>'+
        '<section class="nw-card" data-step="4">'+
          '<div class="nw-card-head"><span class="nw-idx">04</span><span>'+Tn('step.voice')+'</span><span class="nw-badge" data-badge="voice">—</span></div>'+
          '<div class="nw-body">'+
            '<div class="nw-row"><label>'+Tn('voice.voices')+'</label><select class="inp nw-voice">'+ML.providers.TTS.voices().map(v=>'<option'+(v===ML.providers.config().tts.voice?' selected':'')+'>'+v+'</option>').join('')+'</select></div>'+
            '<div class="nw-row"><label>'+Tn('voice.speed')+'</label><input type="range" class="nw-vspeed" min="0.5" max="2" step="0.1" value="1"><span class="nw-vspeed-v">1.0x</span></div>'+
            '<div class="nw-listen"><textarea class="inp nw-listen-text" rows="2">'+Tn('voice.listenText')+'</textarea>'+
              '<div class="nw-actions"><button class="btn btn-ghost" data-act="listenVoice">'+Tn('voice.listen')+'</button><button class="btn btn-ghost" data-act="stopListen" hidden>'+Tn('voice.stop')+'</button></div>'+
            '</div>'+
            '<div class="nw-actions"><button class="btn" data-act="genVoice">'+Tn('voice.gen')+'</button></div>'+
            '<div class="nw-voice-segs"></div>'+
            (ML.providers.hasTTS()?'':'<div class="nw-mock">'+Tn('voice.mock')+'</div>')+
          '</div>'+
        '</section>'+
      '</div>'+
      '<div class="nw-bottom">'+
        '<div class="nw-style-row"><label>'+Tn('ae.style')+'</label><select class="inp nw-style">'+Object.keys(ML.autoedit.STYLES).map(k=>'<option value="'+k+'">'+ML.autoedit.STYLES[k].label+'</option>').join('')+'</select></div>'+
        '<button class="btn btn-primary btn-lg" data-act="autoEdit">'+Tn('ae.cta')+'</button>'+
        '<div class="ae-progress" hidden><div class="ae-bar"><div class="ae-bar-in"></div></div><div class="ae-stage"></div><button class="btn btn-ghost sm" data-act="cancelAE">'+Tn('ae.cancel')+'</button></div>'+
      '</div>';

    /* step 1: name / ratio */
    const nameInp = app.querySelector('.nw-name');
    nameInp.addEventListener('input', ()=>{ draft.name = nameInp.value.trim() || Tn('proj.untitled'); });
    app.querySelectorAll('.ratio-btn').forEach(b=>b.addEventListener('click', ()=>{
      app.querySelectorAll('.ratio-btn').forEach(x=>x.classList.remove('on'));
      b.classList.add('on'); draft.ratio = b.dataset.ratio;
    }));

    /* mode switch: script+assets vs voiceover auto-cut */
    let voMode = false;
    app.querySelectorAll('.nw-mode-btn').forEach(b=>b.addEventListener('click', ()=>{
      voMode = b.dataset.mode === 'voiceover';
      app.querySelectorAll('.nw-mode-btn').forEach(x=>x.classList.toggle('on', x===b));
      app.querySelector('.nw-vo-card').hidden = !voMode;
      app.querySelector('.nw-card[data-step="2"]').hidden = voMode;
      app.querySelector('.nw-card[data-step="4"]').hidden = voMode;
    }));

    /* voiceover card: pick source media, transcribe, list segments */
    const voZone = app.querySelector('.nw-vo-card .dropzone'), voFile = app.querySelector('.nw-vo-file');
    voZone.addEventListener('click', ()=>voFile.click());
    voFile.addEventListener('change', ()=>handleVoFile(voFile.files[0]));
    voZone.addEventListener('dragover', e=>{ e.preventDefault(); voZone.classList.add('over'); });
    voZone.addEventListener('dragleave', ()=>voZone.classList.remove('over'));
    voZone.addEventListener('drop', e=>{ e.preventDefault(); voZone.classList.remove('over'); if(e.dataTransfer.files[0]) handleVoFile(e.dataTransfer.files[0]); });
    async function handleVoFile(file){
      const res = await ML.media.importFile(file);
      if(res.error){ L.toast(res.error, true); return; }
      const a = res.asset;
      if(a.type==='image'){ L.toast(Tn('vo.needMedia'), true); return; }
      /* keep in draft.assets but mark as the voiceover source */
      const prev = draft.voMediaId;
      if(prev) draft.assets = draft.assets.filter(x=>x.id!==prev);
      draft.assets.push(a);
      draft.voMediaId = a.id;
      draft.voSegments = [];
      app.querySelector('.nw-vo-meta').innerHTML = '<div class="nw-mi-tags">'+esc(a.name)+' · '+(a.type==='video'?L.round(a.duration,1)+'s':'')+' '+(a.width? a.width+'×'+a.height:'')+'</div>';
      app.querySelector('[data-badge=vo]').textContent = '—';
      app.querySelector('.nw-segs').innerHTML = '';
      app.querySelector('[data-badge=media]').textContent = draft.assets.length;
    }
    /* transcribe provider cfg switching */
    app.querySelector('.nw-tr-provider').addEventListener('change', e=>{
      const v = e.target.value;
      app.querySelectorAll('.nw-tr-cfg').forEach(c=>c.hidden = c.dataset.cfg!==v);
    });
    app.querySelector('[data-act=runTranscribe]').addEventListener('click', async ()=>{
      if(!draft.voMediaId){ L.toast(Tn('vo.needMedia'), true); return; }
      const provider = app.querySelector('.nw-tr-provider').value;
      const asset = draft.assets.find(a=>a.id===draft.voMediaId);
      const blob = await ML.store.getAssetBlob(asset.id);
      if(!blob){ L.toast(Tn('vo.noBlob'), true); return; }
      const cfg = {
        provider,
        language: app.querySelector('.nw-tr-lang').value,
        mirror: app.querySelector('.nw-tr-mirror').value.trim(),
        baseUrl: ML.providers.config().ai.baseUrl,
        key: ML.providers.config().ai.key,
        model: provider==='api' ? (app.querySelector('.nw-tr-api-model').value||'whisper-1') : app.querySelector('.nw-tr-model').value,
        srtText: app.querySelector('.nw-tr-srt').value
      };
      if(provider==='srt' && !cfg.srtText.trim()){ L.toast(Tn('vo.needSrt'), true); return; }
      if(provider==='api' && !(cfg.baseUrl && cfg.key)){ L.toast(Tn('vo.needApi'), true); return; }
      const btn = app.querySelector('[data-act=runTranscribe]');
      btn.disabled = true; btn.textContent = Tn('vo.transcribing')+'…';
      try{
        const res = await ML.transcribe.transcribe(blob, cfg, (st, pct)=>{});
        draft.voSegments = res.segments;
        renderSegs(res);
        app.querySelector('[data-badge=vo]').textContent = res.segments.length;
        L.toast(Tn('vo.trDone')+' ('+res.source+')');
      }catch(e){
        ML.diag && ML.diag.error('VIEWS','transcribe',null,ML.providers.classifyError ? ML.providers.classifyError(e) : e);
        L.toast(String(e&&e.message||e), true);
      }finally{
        btn.disabled = false; btn.textContent = Tn('vo.transcribe');
      }
    });
    function renderSegs(res){
      const box = app.querySelector('.nw-segs');
      if(!res.segments.length){ box.innerHTML = '<div class="ws-empty">'+Tn('vo.noSegs')+'</div>'; return; }
      box.innerHTML = res.segments.map((s,i)=>{
        const t = typeof s.start==='number' ? L.round(s.start,2)+'s → '+L.round(s.end,2)+'s' : Tn('vo.noTs');
        return '<div class="nw-scene"><span class="nw-sc-idx">'+String(i+1).padStart(2,'0')+'</span><span class="nw-sc-text">'+esc(s.text)+'</span><span class="nw-sc-dur">'+t+'</span></div>';
      }).join('');
      if(res.source==='srt' || res.source==='api') box.insertAdjacentHTML('beforeend','<div class="nw-hint">'+Tn('vo.sourceNote')+' ('+esc(res.source)+')</div>');
    }

    /* step 2: script */
    app.querySelector('[data-act=analyzeScript]').addEventListener('click', ()=>{
      draft.scriptText = app.querySelector('.nw-script').value;
      draft.scenes = ML.script.analyze(draft.scriptText);
      const box = app.querySelector('.nw-scenes');
      if(!draft.scenes.length){ box.innerHTML = '<div class="ws-empty">'+Tn('sc.noScenes')+'</div>'; return; }
      box.innerHTML = draft.scenes.map(s=>'<div class="nw-scene"><span class="nw-sc-idx">'+String(s.order).padStart(2,'0')+'</span><span class="nw-sc-text">'+esc(s.text)+'</span><span class="nw-sc-dur">'+L.round(s.duration,1)+'s</span><span class="nw-sc-intent">'+esc(s.intent)+'</span></div>').join('');
      app.querySelector('[data-badge=script]').textContent = draft.scenes.length;
      app.querySelector('.nw-card[data-step="3"]').classList.add('open');
    });

    /* step 3: media */
    const zone = app.querySelector('.dropzone'), fileInp = app.querySelector('.nw-file');
    app.querySelector('[data-act=pickFiles]').addEventListener('click', ()=>fileInp.click());
    zone.addEventListener('click', ()=>fileInp.click());
    fileInp.addEventListener('change', ()=>handleFiles(fileInp.files));
    zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', ()=>zone.classList.remove('over'));
    zone.addEventListener('drop', e=>{ e.preventDefault(); zone.classList.remove('over'); handleFiles(e.dataTransfer.files); });
    async function handleFiles(files){
      for(const f of Array.from(files)){
        const res = await ML.media.importFile(f);
        if(res.error){ L.toast(res.error, true); continue; }
        draft.assets.push(res.asset);
      }
      renderMediaList(); app.querySelector('[data-badge=media]').textContent = draft.assets.length;
    }
    function renderMediaList(){
      const box = app.querySelector('.nw-media');
      if(!draft.assets.length){ box.innerHTML = '<div class="ws-empty">'+Tn('media.noAssets')+'</div>'; return; }
      box.innerHTML = draft.assets.map(a=>
        '<div class="nw-media-item">'+(a.thumb?'<img src="'+a.thumb+'">':'<div class="nw-mi-none"></div>')+
        '<div class="nw-mi-name">'+esc(a.name)+'</div><div class="nw-mi-meta">'+(a.type==='video'?L.round(a.duration,1)+'s':'')+(a.width?' '+a.width+'×'+a.height:'')+'</div>'+
        (a.analysis?'<div class="nw-mi-tags">'+esc((a.analysis.tags||[]).slice(0,4).join(' · '))+'</div>':'')+
        '</div>').join('');
    }
    app.querySelector('[data-act=analyzeMedia]').addEventListener('click', async ()=>{
      if(!draft.assets.length) return;
      const btn = app.querySelector('[data-act=analyzeMedia]');
      try{
        btn.disabled = true; btn.textContent = Tn('media.analyzing')+'…';
        const res = await ML.media.analyzeAll(draft.assets);
        res.forEach((an,i)=>{ draft.assets[i].analysis = an; });
        renderMediaList();
        L.toast(Tn('media.analyzeDone'));
        app.querySelector('.nw-card[data-step="4"]').classList.add('open');
      }catch(e){
        ML.diag.error('VIEWS','analyzeMedia',null,e);
        L.toast(String(e&&e.message||e), true);
      }finally{
        btn.disabled = false; btn.textContent = Tn('media.analyze');
      }
    });

    /* step 4: voice */
    const vs = app.querySelector('.nw-vspeed');
    vs.addEventListener('input', ()=>app.querySelector('.nw-vspeed-v').textContent = parseFloat(vs.value).toFixed(1)+'x');
    let listenEl = null, listenUrl = null;
    app.querySelector('[data-act=listenVoice]').addEventListener('click', async ()=>{
      const txt = app.querySelector('.nw-listen-text').value || Tn('voice.listenText');
      const voice = app.querySelector('.nw-voice').value;
      const btn = app.querySelector('[data-act=listenVoice]'), stopBtn = app.querySelector('[data-act=stopListen]');
      /* stop any running preview first */
      ML.voice.stopPreview();
      btn.disabled = true;
      const ok = await ML.voice.preview(txt, voice);
      btn.disabled = false;
      if(ok){
        stopBtn.hidden = false;
        const iv = setInterval(()=>{
          if(!ML.voice.isPreviewing()){ clearInterval(iv); stopBtn.hidden = true; }
        }, 300);
        stopBtn.addEventListener('click', ()=>{ ML.voice.stopPreview(); stopBtn.hidden = true; });
      } else L.toast(Tn('voice.playFail'), true);
    });
    app.querySelector('[data-act=stopListen]').addEventListener('click', ()=>{ ML.voice.stopPreview(); app.querySelector('[data-act=stopListen]').hidden = true; });
    app.querySelector('[data-act=genVoice]').addEventListener('click', async ()=>{
      if(!draft.scenes.length){ L.toast(Tn('sc.noScenes'), true); return; }
      const voice = app.querySelector('.nw-voice').value;
      app.querySelector('[data-act=genVoice]').disabled = true;
      try{
        draft.voiceSegments = [];
        for(const sc of draft.scenes){
          const seg = await ML.voice.generateSegment(draft, sc, { voiceId: voice, speed: parseFloat(vs.value)||1 });
          draft.voiceSegments.push(seg);
        }
        renderVoiceSegs();
        app.querySelector('[data-badge=voice]').textContent = draft.voiceSegments.length;
      }catch(e){ L.toast(String(e&&e.message||e), true); }
      app.querySelector('[data-act=genVoice]').disabled = false;
    });
    function renderVoiceSegs(){
      const box = app.querySelector('.nw-voice-segs');
      box.innerHTML = draft.voiceSegments.map(v=>'<div class="nw-vseg"><span class="nw-sc-idx">'+String((draft.scenes.find(s=>s.id===v.sceneId)||{}).order||'?').padStart(2,'0')+'</span><span class="nw-sc-text">'+esc(v.text)+'</span><span class="nw-sc-dur">'+L.round(v.duration,1)+'s</span><span class="nw-v-status">'+(v.status==='real'?'●':'○')+'</span><button class="btn btn-ghost xs" data-act="playVseg" data-id="'+v.id+'">'+Tn('voice.listen')+'</button></div>').join('');
    }
    app.addEventListener('click', async e2=>{
      const b = e2.target.closest('[data-act=playVseg]');
      if(!b) return;
      const v = draft.voiceSegments.find(x=>x.id===b.dataset.id);
      if(!v) return;
      ML.voice.stopPreview();
      const blob = await ML.voice.loadAudio(v).catch(()=>null);
      if(blob){
        if(listenUrl) URL.revokeObjectURL(listenUrl);
        listenUrl = URL.createObjectURL(blob);
        if(listenEl){ listenEl.pause(); listenEl = null; }
        listenEl = new Audio(listenUrl);
        await listenEl.play().catch(()=>L.toast(Tn('voice.playFail'), true));
      } else {
        await ML.voice.preview(v.text, v.voiceId);
      }
    });

    /* step 5: auto edit */
    app.querySelector('[data-act=autoEdit]').addEventListener('click', async ()=>{
      if(voMode){
        if(!draft.voSegments || !draft.voSegments.length){ L.toast(Tn('vo.needSegs'), true); return; }
        const aeBtn = app.querySelector('[data-act=autoEdit]');
        const prog = app.querySelector('.ae-progress');
        aeBtn.disabled = true; prog.hidden = false;
        const stage = app.querySelector('.ae-stage'), bar = app.querySelector('.ae-bar-in');
        const poll = setInterval(()=>{
          const j = ML.autoedit.job();
          if(j){ stage.textContent = j.stage+' '+Math.round(j.progress)+'%'; bar.style.width = j.progress+'%'; }
        }, 120);
        try{
          await ML.autoedit.runVoiceover(draft, {
            mediaId: draft.voMediaId,
            segments: draft.voSegments,
            style: app.querySelector('.nw-style').value
          });
          clearInterval(poll);
          await ML.store.saveProject(draft);
          ML.router.go('/projects/'+draft.id);
        }catch(e){
          clearInterval(poll);
          const j = ML.autoedit.job();
          if(j && j.status==='cancelled'){ L.toast(Tn('ae.cancelled')); }
          else L.toast(String(e&&e.message||e), true);
          aeBtn.disabled = false; prog.hidden = true;
        }
        return;
      }
      if(!draft.scenes.length){ L.toast(Tn('sc.noScenes'), true); return; }
      if(!draft.assets.length){ L.toast(Tn('media.noAssets'), true); return; }
      if(!draft.voiceSegments.length){
        /* generate voice on the fly if skipped */
        const voice = app.querySelector('.nw-voice').value;
        try{
          for(const sc of draft.scenes){
            const seg = await ML.voice.generateSegment(draft, sc, { voiceId: voice, speed: parseFloat(vs.value)||1 });
            draft.voiceSegments.push(seg);
          }
        }catch(e){
          L.toast(String(e&&e.message||e), true);
          return;
        }
      }
      const aeBtn = app.querySelector('[data-act=autoEdit]');
      const prog = app.querySelector('.ae-progress');
      aeBtn.disabled = true; prog.hidden = false;
      const stage = app.querySelector('.ae-stage'), bar = app.querySelector('.ae-bar-in');
      const poll = setInterval(()=>{
        const j = ML.autoedit.job();
        if(j){ stage.textContent = j.stage+' '+Math.round(j.progress)+'%'; bar.style.width = j.progress+'%'; }
      }, 120);
      try{
        await ML.autoedit.run(draft, { style: app.querySelector('.nw-style').value, voice: { voiceId: app.querySelector('.nw-voice').value, speed: parseFloat(vs.value)||1 } });
        clearInterval(poll);
        await ML.store.saveProject(draft);
        ML.router.go('/projects/'+draft.id);
      }catch(e){
        clearInterval(poll);
        const j = ML.autoedit.job();
        if(j && j.status==='cancelled'){ L.toast(Tn('ae.cancelled')); }
        else L.toast(String(e&&e.message||e), true);
        aeBtn.disabled = false; prog.hidden = true;
      }
    });
    app.querySelector('[data-act=cancelAE]').addEventListener('click', ()=>ML.autoedit.cancel());
  }

  /* ============ ASSETS library ============ */
  async function assets(app){
    const projects = await ML.store.listProjects();
    const all = [];
    projects.forEach(p=>(p.assets||[]).forEach(a=>all.push({ a, p })));
    app.innerHTML = ''+
      '<div class="as-head"><h2>'+Tn('nav.assets')+'</h2><span class="as-count">'+all.length+'</span></div>'+
      '<div class="dropzone as-zone" data-zone>'+Tn('media.drop')+'<br><span>'+Tn('media.dropSub')+'</span></div>'+
      '<input type="file" class="as-file" multiple accept="video/*,image/*,audio/*" hidden>'+
      '<div class="as-grid"></div>'+
      (all.length?'':'<div class="ws-empty">'+Tn('media.noAssets')+'</div>');
    const zone = app.querySelector('.as-zone'), fi = app.querySelector('.as-file');
    zone.addEventListener('click', ()=>fi.click());
    zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('drop', e=>{ e.preventDefault(); zone.classList.remove('over'); handle(e.dataTransfer.files); });
    fi.addEventListener('change', ()=>handle(fi.files));
    async function handle(files){
      /* assets attach to the most recent project that has no media, else create a scratch project */
      let target = projects.find(p=>(p.assets||[]).length===0) || null;
      if(!target){
        target = { id:'p'+L.uid(), name:'Media Vault', ratio:'9:16', fps:30, scriptText:'', scenes:[], assets:[], voiceSegments:[], timeline:{clips:[]}, settings:{}, createdAt:Date.now(), updatedAt:Date.now() };
        projects.unshift(target);
      }
      for(const f of Array.from(files)){
        const res = await ML.media.importFile(f);
        if(res.error){ L.toast(res.error, true); continue; }
        target.assets.push(res.asset);
      }
      await ML.store.saveProject(target);
      assets(app);
    }
    const grid = app.querySelector('.as-grid');
    if(grid) all.forEach(entry=>{
      const card = document.createElement('div');
      card.className = 'media-card as-card';
      card.innerHTML = (entry.a.thumb?'<div class="mc-thumb" style="background-image:url('+entry.a.thumb+')"></div>':'<div class="mc-thumb mc-none"></div>')+
        '<div class="mc-name">'+esc(entry.a.name)+'</div>'+
        '<div class="mc-meta">'+(entry.a.type==='video'?L.round(entry.a.duration,1)+'s · ':'')+(entry.a.width?entry.a.width+'×'+entry.a.height:'')+(entry.a.analysis&&entry.a.analysis.mock?' · '+Tn('media.mock'):'')+'</div>'+
        (entry.a.analysis?'<div class="mc-tags">'+esc((entry.a.analysis.tags||[]).slice(0,5).join(' · '))+'</div>':'')+
        '<div class="mc-meta">📁 '+esc(entry.p.name||'')+'</div>';
      grid.appendChild(card);
    });
  }

  /* keyboard reference shown in Settings */
  const SHORTCUTS = [
    ['Space','kbd.play'],['⌘/Ctrl+Z','kbd.undo'],['⇧+⌘/Ctrl+Z','kbd.redo'],['⌘/Ctrl+S','kbd.save'],
    ['⌘/Ctrl+C','kbd.copy'],['⌘/Ctrl+V','kbd.paste'],['⌘/Ctrl+D','kbd.dup'],['Del / ⌫','kbd.delete'],
    ['S','kbd.split'],['←','kbd.prevFrame'],['→','kbd.nextFrame'],['⇧+←','kbd.seekBack'],['⇧+→','kbd.seekFwd'],
    ['Home','kbd.home'],['End','kbd.end'],['M','kbd.marker'],['+ / -','kbd.zoom'],['⇧+Z','kbd.fit'],['Esc','kbd.deselect']
  ];

  /* ============ SETTINGS ============ */
  async function settings(app){
    const cfg = await ML.providers.loadConfig();
    const SUP = ML.providers.SUPPLIERS;
    const supOpts = (sel)=>Object.keys(SUP).map(k=>'<option value="'+k+'"'+(sel===k?' selected':'')+'>'+Tn('set.provider.'+k)+'</option>').join('');
    const noteFor = k => (SUP[k]&&SUP[k].note)||'';
    app.innerHTML = ''+
      '<div class="st-head"><h2>'+Tn('set.title')+'</h2></div>'+
      (ML.providers.hasAI()||ML.providers.hasTTS() ? '' : '<div class="st-mock"><b>'+Tn('set.mock')+'</b><div>'+Tn('set.mock.desc')+'</div></div>')+
      '<div class="st-grid">'+
        '<section class="st-card"><div class="st-title">'+Tn('set.ai')+'</div><div class="st-desc">'+Tn('set.ai.desc')+'</div>'+
          '<div class="st-row"><label>'+Tn('set.aiProvider')+'</label><select class="inp" data-k="ai.provider">'+supOpts(cfg.ai.provider)+'</select></div>'+
          '<div class="st-note" data-note="ai">'+esc(noteFor(cfg.ai.provider))+'</div>'+
          '<div class="st-row"><label>'+Tn('set.aiEndpoint')+'</label><input class="inp" data-k="ai.baseUrl" value="'+esc(cfg.ai.baseUrl)+'" placeholder="https://api.example.com/v1" spellcheck="false"></div>'+
          '<div class="st-row"><label>'+Tn('set.aiKey')+'</label><input class="inp" data-k="ai.key" type="password" value="'+esc(cfg.ai.key)+'" placeholder="sk-…" autocomplete="off"></div>'+
          '<div class="st-row"><label>'+Tn('set.aiModel')+'</label><input class="inp" data-k="ai.model" value="'+esc(cfg.ai.model)+'" spellcheck="false"></div>'+
          '<div class="st-row"><label>'+Tn('set.aiVisionModel')+'</label><input class="inp" data-k="ai.visionModel" value="'+esc(cfg.ai.visionModel||'')+'" placeholder="'+Tn('set.aiVisionModel.ph')+'" spellcheck="false"></div>'+
          '<div class="st-actions"><button class="btn btn-sm" data-act="testAI">'+Tn('set.test')+'</button><button class="btn btn-sm btn-ghost" data-act="clearAI">'+Tn('set.clearKey')+'</button></div>'+
          '<div class="st-result" data-res="ai"></div>'+
        '</section>'+
        '<section class="st-card"><div class="st-title">'+Tn('set.tts')+'</div><div class="st-desc">'+Tn('set.tts.desc')+'</div>'+
          '<div class="st-row"><label>'+Tn('set.ttsProvider')+'</label><select class="inp" data-k="tts.provider">'+supOpts(cfg.tts.provider)+'</select></div>'+
          '<div class="st-note" data-note="tts">'+esc(noteFor(cfg.tts.provider))+'</div>'+
          '<div class="st-row"><label>'+Tn('set.ttsEndpoint')+'</label><input class="inp" data-k="tts.baseUrl" value="'+esc(cfg.tts.baseUrl)+'" placeholder="https://api.example.com/v1" spellcheck="false"></div>'+
          '<div class="st-row"><label>'+Tn('set.ttsKey')+'</label><input class="inp" data-k="tts.key" type="password" value="'+esc(cfg.tts.key)+'" autocomplete="off"></div>'+
          '<div class="st-row"><label>'+Tn('set.ttsModel')+'</label><input class="inp" data-k="tts.model" value="'+esc(cfg.tts.model||'')+'" placeholder="tts-1 / 供应商模型 ID" spellcheck="false"></div>'+
          '<div class="st-row"><label>'+Tn('set.ttsVoice')+'</label><input class="inp" data-k="tts.voice" value="'+esc(cfg.tts.voice||'alloy')+'" placeholder="alloy / 供应商 voice ID" spellcheck="false"></div>'+
          '<div class="st-actions"><button class="btn btn-sm" data-act="testTTS">'+Tn('set.test')+'</button><button class="btn btn-sm" data-act="tryTTS">'+Tn('set.ttsTry')+'</button><button class="btn btn-sm btn-ghost" data-act="clearTTS">'+Tn('set.clearKey')+'</button></div>'+
          '<div class="st-result" data-res="tts"></div>'+
        '</section>'+
        '<section class="st-card st-card-wide"><div class="st-title">'+Tn('set.notes')+'</div>'+
          '<ul class="st-list"><li>'+Tn('set.note.cors')+'</li><li>'+Tn('set.note.key')+'</li><li>'+Tn('set.note.cost')+'</li><li>'+Tn('set.note.real')+'</li></ul>'+
        '</section>'+
        '<section class="st-card st-card-wide"><div class="st-title">'+Tn('set.shortcuts')+'</div><div class="st-desc">'+Tn('set.shortcuts.desc')+'</div>'+
          '<table class="st-kbd">'+SHORTCUTS.map(s=>'<tr><td><kbd>'+s[0]+'</kbd></td><td>'+Tn(s[1])+'</td></tr>').join('')+'</table>'+
        '</section>'+
      '</div>'+
      '<div class="st-save"><button class="btn btn-primary" data-act="saveSettings">'+Tn('set.save')+'</button></div>';

    const read = k=>{ const el = app.querySelector('[data-k="'+k+'"]'); return el ? el.value : ''; };
    const resultEl = s=>app.querySelector('[data-res="'+s+'"]');
    function renderResult(s, res){
      const el = resultEl(s);
      if(!el) return;
      if(!res){ el.innerHTML=''; return; }
      if(res.ok){
        const caps = res.capabilities||{};
        const badge = k=>'<span class="st-cap on">'+k+' ✓</span>';
        const badgeOff = k=>'<span class="st-cap off">'+k+'</span>';
        el.innerHTML = '<div class="st-res ok"><b>'+esc(res.message)+'</b><div class="st-res-meta">'+(res.latency!=null?'<span>'+res.latency+'ms</span>':'')+(res.modelCount!=null?'<span>'+res.modelCount+' models</span>':'')+'</div>'+
          (s==='ai' ? '<div class="st-caps">'+badge('chat')+(read('ai.visionModel')? badgeOff('vision · 已填模型，分析时自动启用') : badgeOff('vision · 未填模型'))+'</div>' : '<div class="st-caps">'+badge('tts')+'</div>')+
          (res.models && res.models.length ? '<div class="st-models">'+res.models.map(m=>'<code>'+esc(m)+'</code>').join('')+'</div>' : '')+
          '</div>';
      }else{
        el.innerHTML = '<div class="st-res fail"><b>'+esc(res.message||'failed')+'</b>'+(res.code?'<div class="st-res-code">'+esc(res.code)+'</div>':'')+(res.detail?'<div class="st-res-detail">'+esc(res.detail)+'</div>':'')+'</div>';
      }
    }

    /* supplier presets fill baseUrl + model (never overwrite the key) */
    app.querySelectorAll('select[data-k]').forEach(sel=>{
      sel.addEventListener('change', ()=>{
        const section = sel.dataset.k.split('.')[0];
        const name = sel.value;
        const note = app.querySelector('[data-note="'+section+'"]');
        if(note) note.textContent = noteFor(name);
        if(name==='none'||name==='custom') return;
        const p = SUP[name]; if(!p) return;
        const urlEl = app.querySelector('[data-k="'+section+'.baseUrl"]');
        const modEl = app.querySelector('[data-k="'+section+'.model"]');
        if(urlEl && p.baseUrl) urlEl.value = p.baseUrl;
        if(modEl && p.model && !modEl.value) modEl.value = p.model;
      });
    });

    app.querySelector('[data-act=testAI]').addEventListener('click', async ()=>{
      const btn = app.querySelector('[data-act=testAI]');
      const el = resultEl('ai');
      el.innerHTML = '<div class="st-res run">'+Tn('set.testing')+'…</div>';
      btn.disabled = true;
      try{
        cfg.ai.provider = read('ai.provider'); cfg.ai.baseUrl = read('ai.baseUrl').trim(); cfg.ai.key = read('ai.key').trim();
        cfg.ai.model = read('ai.model').trim(); cfg.ai.visionModel = read('ai.visionModel').trim();
        const res = await ML.providers.testConnection('ai');
        cfg.caps = cfg.caps||{}; cfg.caps.ai = { at:Date.now(), ok:res.ok, code:res.code, latency:res.latency };
        await ML.providers.saveConfig(cfg);
        renderResult('ai', res);
      }catch(e){ renderResult('ai', ML.providers.classifyError(e)); }
      finally{ btn.disabled = false; }
    });
    app.querySelector('[data-act=testTTS]').addEventListener('click', async ()=>{
      const btn = app.querySelector('[data-act=testTTS]');
      const el = resultEl('tts');
      el.innerHTML = '<div class="st-res run">'+Tn('set.testing')+'…</div>';
      btn.disabled = true;
      try{
        cfg.tts.provider = read('tts.provider'); cfg.tts.baseUrl = read('tts.baseUrl').trim(); cfg.tts.key = read('tts.key').trim();
        cfg.tts.model = read('tts.model').trim(); cfg.tts.voice = read('tts.voice').trim();
        const res = await ML.providers.testConnection('tts');
        cfg.caps = cfg.caps||{}; cfg.caps.tts = { at:Date.now(), ok:res.ok, code:res.code, latency:res.latency };
        await ML.providers.saveConfig(cfg);
        renderResult('tts', res);
      }catch(e){ renderResult('tts', ML.providers.classifyError(e)); }
      finally{ btn.disabled = false; }
    });
    /* real TTS sample: generate a short clip and play it */
    let tryUrl = null;
    app.querySelector('[data-act=tryTTS]').addEventListener('click', async ()=>{
      const btn = app.querySelector('[data-act=tryTTS]');
      const el = resultEl('tts');
      btn.disabled = true; btn.textContent = Tn('set.ttsTrying')+'…';
      try{
        cfg.tts.provider = read('tts.provider'); cfg.tts.baseUrl = read('tts.baseUrl').trim(); cfg.tts.key = read('tts.key').trim();
        cfg.tts.model = read('tts.model').trim(); cfg.tts.voice = read('tts.voice').trim();
        await ML.providers.saveConfig(cfg);
        const text = Tn('voice.listenText');
        const res = await ML.providers.TTS.synthesize(text, cfg.tts.voice);
        if(!res.audio) throw new Error('no audio');
        if(tryUrl) URL.revokeObjectURL(tryUrl);
        tryUrl = URL.createObjectURL(res.audio);
        const a = new Audio(tryUrl); a.play().catch(()=>{});
        cfg.caps = cfg.caps||{}; cfg.caps.tts = { at:Date.now(), ok:true, code:null, ttsVerified:true };
        await ML.providers.saveConfig(cfg);
        el.innerHTML = '<div class="st-res ok"><b>'+Tn('set.ttsOk')+'</b><div class="st-res-meta"><span>'+(res.provider||'')+'</span><span>'+(res.model||'')+'</span><span>'+L.round(res.duration,1)+'s</span></div></div>';
      }catch(e){
        const cls = ML.providers.classifyError(e);
        el.innerHTML = '<div class="st-res fail"><b>'+esc(cls.message)+'</b>'+(cls.code?'<div class="st-res-code">'+esc(cls.code)+'</div>':'')+'</div>';
      }finally{ btn.disabled = false; btn.textContent = Tn('set.ttsTry'); }
    });
    app.querySelector('[data-act=clearAI]').addEventListener('click', async ()=>{
      const ok = await L.confirm(Tn('set.clearConfirm'), Tn('set.clearKey'));
      if(!ok) return;
      cfg.ai.key = ''; await ML.providers.clearSectionKey('ai');
      const el = app.querySelector('[data-k="ai.key"]'); if(el) el.value = '';
      renderResult('ai', null); L.toast(Tn('set.keyCleared'));
    });
    app.querySelector('[data-act=clearTTS]').addEventListener('click', async ()=>{
      const ok = await L.confirm(Tn('set.clearConfirm'), Tn('set.clearKey'));
      if(!ok) return;
      cfg.tts.key = ''; await ML.providers.clearSectionKey('tts');
      const el = app.querySelector('[data-k="tts.key"]'); if(el) el.value = '';
      renderResult('tts', null); L.toast(Tn('set.keyCleared'));
    });
    app.querySelector('[data-act=saveSettings]').addEventListener('click', async ()=>{
      cfg.ai.provider = read('ai.provider'); cfg.ai.baseUrl = read('ai.baseUrl').trim(); cfg.ai.key = read('ai.key').trim();
      cfg.ai.model = read('ai.model').trim(); cfg.ai.visionModel = read('ai.visionModel').trim();
      cfg.tts.provider = read('tts.provider'); cfg.tts.baseUrl = read('tts.baseUrl').trim(); cfg.tts.key = read('tts.key').trim();
      cfg.tts.model = read('tts.model').trim(); cfg.tts.voice = read('tts.voice').trim();
      await ML.providers.saveConfig(cfg);
      L.toast(Tn('set.saved'));
    });
  }

  /* ============ PROJECT (workspace) ============ */
  async function project(app, id){
    app.innerHTML = '<div class="ws-loading">Preparing editor…</div>';
    await new Promise(r=>setTimeout(r, 30));
    const p = await ML.store.getProject(id);
    if(!p){ notFound(app); return; }
    try{
      await ML.workspace.mount(app, id);
    }catch(e){
      ML.diag.error('VIEWS','project',id,e);
      app.innerHTML = '<div class="view-error">'+Tn('proj.badData')+'</div>';
    }
  }

  /* ============ 404 ============ */
  function notFound(app){
    app.innerHTML = '<div class="view-error"><div>'+Tn('err.route')+'</div><button class="btn" data-act="home">'+Tn('err.home')+'</button></div>';
    const b = app.querySelector('[data-act=home]');
    if(b) b.addEventListener('click', ()=>ML.router.go('/'));
  }

  return { home, newEdit, assets, settings, project, notFound };
})();
