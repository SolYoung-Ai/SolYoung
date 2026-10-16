/* ============ VIDEO LAB · model.js — 数据模型与校验 ============ */
ML.model = (function(){
  const SCHEMA_VERSION = 2;

  const PROJECT_TYPES = [
    { id:'vlog', label:'真人口播', label_en:'Talking head' },
    { id:'drama', label:'短视频剧情', label_en:'Short drama' },
    { id:'product', label:'产品广告', label_en:'Product ad' },
    { id:'brand', label:'品牌宣传片', label_en:'Brand film' },
    { id:'vloglife', label:'Vlog', label_en:'Vlog' },
    { id:'edu', label:'教程与知识', label_en:'Tutorial / knowledge' },
    { id:'aigen', label:'AI 生成式视频', label_en:'AI-generated' },
    { id:'mixed', label:'混合制作', label_en:'Mixed production' },
    { id:'custom', label:'自定义', label_en:'Custom' }
  ];
  const RATIOS = ['16:9','9:16','1:1','4:5'];
  const SHOT_TYPES = ['远景','全景','中景','中近景','近景','特写','大特写'];
  const SHOT_TYPES_EXT = ['大远景','远景','全景','中景','中近景','近景','特写','大特写','自定义'];
  const MOVES = ['固定镜头','缓慢推进','缓慢拉远','横向摇摄','纵向摇摄','跟随拍摄','环绕拍摄','手持拍摄','俯拍','仰拍','升降镜头','变焦','自定义'];
  const METHODS = ['真人实拍','AI 视频生成','图片转视频','现有素材','屏幕录制','动画或动态图形','后期制作','自定义'];
  const SHOT_STATES = [
    { id:'ready', label:'待拍摄', label_en:'Ready' },
    { id:'wip', label:'进行中', label_en:'Shooting' },
    { id:'done', label:'已完成', label_en:'Done' },
    { id:'rev', label:'需修改', label_en:'Revise' }
  ];

  function uid(){ return 's'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
  function now(){ return Date.now(); }

  function newProject(over){
    over = over || {};
    return {
      id: over.id || uid(),
      name: over.name || '未命名项目',
      desc: over.desc || '',
      type: over.type || 'vlog',
      topic: over.topic || '',
      targetDur: over.targetDur || 60,
      ratio: over.ratio || '9:16',
      platform: over.platform || '',
      style: over.style || '',
      method: over.method || 'mixed',
      scriptText: over.scriptText || '',
      paragraphs: over.paragraphs || [],   // [{id,text}]
      shots: over.shots || [],             // [{id,no,title,text,visual,shotType,move,dur,method,scene,people[],props[],sound,aiPrompt,refs[],state,note,scriptParaId}]
      tasks: over.tasks || [],             // [{id,title,shotId,prio,state,note}]
      createdAt: over.createdAt || now(),
      updatedAt: over.updatedAt || now(),
      schemaVersion: SCHEMA_VERSION,
      sample: !!over.sample
    };
  }

  function newShot(over){
    over = over || {};
    return {
      id: over.id || uid(),
      no: over.no || 1,
      title: over.title || '',
      text: over.text || '',
      visual: over.visual || '',
      shotType: over.shotType || '中景',
      move: over.move || '固定镜头',
      dur: over.dur || 4,
      method: over.method || '真人实拍',
      scene: over.scene || '',
      people: over.people || [],
      props: over.props || [],
      sound: over.sound || '',
      aiPrompt: over.aiPrompt || '',
      refs: over.refs || [],               // ref image ids (blob store keys)
      state: over.state || 'ready',
      note: over.note || '',
      scriptParaId: over.scriptParaId || null,
      createdAt: over.createdAt || now(),
      updatedAt: over.updatedAt || now()
    };
  }

  /* ---- shot validation (used to gate AI output) ---- */
  function validateShot(raw, idx){
    const errors = [];
    if(raw === null || typeof raw !== 'object'){ errors.push('镜头数据不是对象'); return { ok:false, errors, shot:null }; }
    const shot = newShot({});
    if(typeof raw.title === 'string' && raw.title.trim()) shot.title = String(raw.title).trim();
    else errors.push('缺少镜头标题 (title)');
    if(typeof raw.text === 'string') shot.text = String(raw.text).trim();
    if(typeof raw.visual === 'string') shot.visual = String(raw.visual).trim();
    if(typeof raw.shotType === 'string' && raw.shotType.trim()) shot.shotType = String(raw.shotType).trim();
    if(typeof raw.move === 'string' && raw.move.trim()) shot.move = String(raw.move).trim();
    if(typeof raw.dur === 'number' && raw.dur > 0 && raw.dur <= 600) shot.dur = Math.round(raw.dur*10)/10;
    else if(typeof raw.dur === 'string' && !isNaN(parseFloat(raw.dur)) && parseFloat(raw.dur)>0) shot.dur = parseFloat(raw.dur);
    else errors.push('时长无效 (dur)');
    if(typeof raw.method === 'string' && raw.method.trim()) shot.method = String(raw.method).trim();
    if(typeof raw.scene === 'string') shot.scene = String(raw.scene).trim();
    if(Array.isArray(raw.people)) shot.people = raw.people.map(String).map(s=>s.trim()).filter(Boolean);
    if(Array.isArray(raw.props)) shot.props = raw.props.map(String).map(s=>s.trim()).filter(Boolean);
    if(typeof raw.sound === 'string') shot.sound = String(raw.sound).trim();
    if(typeof raw.aiPrompt === 'string') shot.aiPrompt = String(raw.aiPrompt).trim();
    if(typeof raw.note === 'string') shot.note = String(raw.note).trim();
    shot.no = idx;
    return { ok: errors.length===0, errors, shot };
  }

  function validateShots(list){
    if(!Array.isArray(list)) return { ok:false, errors:['返回数据不是数组'], shots:[] };
    const shots = [], errors = [];
    list.forEach((raw,i)=>{
      const r = validateShot(raw, i+1);
      if(r.ok) shots.push(r.shot);
      else errors.push('第 '+(i+1)+' 个镜头: ' + r.errors.join('、'));
    });
    return { ok: errors.length===0, errors, shots };
  }

  /* ---- normalize a stored project into the current schema ---- */
  function normalize(p){
    if(!p || typeof p !== 'object') return null;
    const base = newProject({
      id: p.id, name: p.name, desc: p.desc, type: p.type, topic: p.topic,
      targetDur: p.targetDur, ratio: p.ratio, platform: p.platform, style: p.style, method: p.method,
      createdAt: p.createdAt, updatedAt: p.updatedAt, sample: p.sample
    });
    base.scriptText = p.scriptText || '';
    base.paragraphs = Array.isArray(p.paragraphs) ? p.paragraphs.filter(x=>x&&typeof x.text==='string') : [];
    base.shots = Array.isArray(p.shots) ? p.shots.filter(x=>x&&x.id) : [];
    base.tasks = Array.isArray(p.tasks) ? p.tasks.filter(x=>x&&x.id) : [];
    base.schemaVersion = SCHEMA_VERSION;
    if(!p.ratio) base.ratio = '9:16';
    return base;
  }

  /* ---- tag helpers ---- */
  function splitTags(str){ return String(str||'').split(/[,，、;；]/).map(s=>s.trim()).filter(Boolean); }
  function joinTags(arr){ return Array.isArray(arr) ? arr.join('、') : String(arr||''); }

  /* ---- time ---- */
  function fmtTime(t){ if(!t) return '—'; const d = new Date(t); const p=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes()); }
  function fmtDur(sec){
    sec = Math.max(0, Math.round(sec||0));
    if(sec < 60) return sec+'s';
    return Math.floor(sec/60)+'m'+String(sec%60).padStart(2,'0')+'s';
  }

  /* ---- script analysis ---- */
  function splitParagraphs(text){
    const lines = String(text||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
    return lines.map(t=>({ id: uid(), text: t }));
  }
  function analyzeScript(paragraphs, wpm){
    const wpmN = wpm || 220;
    const stats = { chars:0, paras: paragraphs.length, empty:0, long:0, estSec:0, longIdx:[] };
    paragraphs.forEach((p,i)=>{
      const c = p.text.replace(/\s/g,'').length;
      stats.chars += c;
      if(c === 0) stats.empty++;
      if(c > 180){ stats.long++; stats.longIdx.push(i+1); }
    });
    stats.estSec = Math.round(stats.chars / (wpmN/60) * 100) / 100; // 中文按字/分钟估算
    return stats;
  }

  /* ---- sample project (clearly marked, kept separate from user data) ---- */
  function sampleProject(){
    const paras = splitParagraphs(
      '你是否有过这样的时刻：脑子里有很多想法，却不知道从哪一步开始？\n'+
      '做视频也是一样，脚本、分镜、拍摄，每个环节都容易卡住。\n'+
      '今天分享一个方法：先把想法写下来，再拆成镜头，一步步执行。\n'+
      '从创意到镜头，让每一个想法都能被拍出来。'
    );
    const p = newProject({
      name: '示例项目 · 口播开场',
      desc: '这是一个示例项目，用于演示 VIDEO LAB 的分镜与拍摄工作流。你可以复制它，也可以删除它。',
      type: 'vlog', topic: '视频创作方法分享', targetDur: 60, ratio: '9:16',
      platform: '抖音', style: '现代知识口播', method: '真人实拍',
      scriptText: paras.map(x=>x.text).join('\n'), paragraphs: paras, sample: true
    });
    const mkShot = (o)=> newShot(Object.assign({ dur:5, scene:'室内 · 书桌', people:['主讲人'], props:['笔记本','手机支架'], method:'真人实拍', sound:'人声口播，轻微环境音' }, o));
    p.shots = [
      mkShot({ no:1, title:'开场钩子', text:paras[0].text, visual:'主讲人面对镜头，背景是整洁的书桌，暖色灯光', shotType:'近景', move:'固定镜头', scriptParaId:paras[0].id, aiPrompt:'cinematic close-up of a presenter at a warm-lit desk, talking to camera, shallow depth of field' }),
      mkShot({ no:2, title:'问题引入', text:paras[1].text, visual:'切近景，手指点在笔记本上，突出“脚本、分镜”关键词', shotType:'特写', move:'缓慢推进', scriptParaId:paras[1].id, aiPrompt:'extreme close-up of hands writing on a notebook, slow push-in, warm tones' }),
      mkShot({ no:3, title:'方法讲解', text:paras[2].text, visual:'中景展示电脑屏幕上的分镜表格，主讲人比划讲解', shotType:'中景', move:'横向摇摄', scriptParaId:paras[2].id, aiPrompt:'medium shot of presenter gesturing beside a storyboard grid on screen' }),
      mkShot({ no:4, title:'收尾金句', text:paras[3].text, visual:'回到近景，主讲人微笑收束，画面渐暗', shotType:'中近景', move:'缓慢拉远', scriptParaId:paras[3].id, aiPrompt:'medium close-up, presenter smiling, slow pull-back, cinematic fade' })
    ];
    p.tasks = p.shots.map(s=>({ id: uid(), title: '拍摄镜头 '+s.no+'：'+s.title, shotId: s.id, prio: '高', state: 'todo', note: '' }));
    return p;
  }

  return {
    SCHEMA_VERSION, PROJECT_TYPES, RATIOS, SHOT_TYPES, SHOT_TYPES_EXT, MOVES, METHODS, SHOT_STATES,
    uid, now, newProject, newShot, validateShot, validateShots, normalize,
    splitTags, joinTags, fmtTime, fmtDur, splitParagraphs, analyzeScript, sampleProject
  };
})();
