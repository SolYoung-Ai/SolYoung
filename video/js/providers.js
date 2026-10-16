/* ============ ML.providers — OpenAI-compatible provider registry ============ */
/* Phase B/C: real OpenAI-compatible adapters (chat-completions / audio-speech).
   No fake API. DEV MOCK is the active mode until a provider passes a real
   connection test. Keys live only in browser storage, never in code/logs.
   Browser-direct calls require the provider to allow CORS — the settings page
   diagnoses this explicitly. */
ML.providers = (function(){
  const L = ML.lib;

  /* ---- supplier presets (public endpoints — verify CORS/quotas yourself) ---- */
  const SUPPLIERS = {
    openai:   { baseUrl:'https://api.openai.com/v1',     model:'gpt-4o-mini',      note:'官方端点通常不允许浏览器直连（CORS）。若测试失败，请改用支持 CORS 的 OpenAI 兼容服务或代理。' },
    deepseek: { baseUrl:'https://api.deepseek.com/v1',   model:'deepseek-chat',    note:'地址与模型名以官方文档为准；免费额度与 CORS 支持请用「测试连接」验证。' },
    moonshot: { baseUrl:'https://api.moonshot.cn/v1',    model:'moonshot-v1-8k',   note:'地址与模型名以官方文档为准；请用「测试连接」验证浏览器直连与额度。' },
    zhipu:    { baseUrl:'https://open.bigmodel.cn/api/paas/v4', model:'glm-4-flash', note:'地址与模型名以官方文档为准；请用「测试连接」验证。' },
    qwen:     { baseUrl:'https://dashscope.aliyuncs.com/compatible-mode/v1', model:'qwen-turbo', note:'地址与模型名以官方文档为准；请用「测试连接」验证。' },
    custom:   { baseUrl:'', model:'', note:'任意 OpenAI 兼容端点。要求服务端允许浏览器跨域（CORS）。' }
  };

  /* ---- provider config (v2 shape; legacy endpoint→baseUrl auto-migrated) ---- */
  const DEFAULTS = {
    ai:  { provider:'none', baseUrl:'', key:'', model:'gpt-4o-mini', visionModel:'' },
    tts: { provider:'none', baseUrl:'', key:'', model:'', voice:'alloy' },
    caps:{ ai:null, tts:null } /* last test results: {ok, at, code, latency, models, capabilities} */
  };
  let cfg = null;

  async function loadConfig(){
    cfg = await ML.store.getSetting('providers', null);
    if(!cfg){ cfg = JSON.parse(JSON.stringify(DEFAULTS)); return cfg; }
    /* legacy migration: v1 used {endpoint, model} */
    if(cfg.ai && cfg.ai.endpoint && !cfg.ai.baseUrl){ cfg.ai.baseUrl = cfg.ai.endpoint; delete cfg.ai.endpoint; }
    if(cfg.tts && cfg.tts.endpoint && !cfg.tts.baseUrl){ cfg.tts.baseUrl = cfg.tts.endpoint; delete cfg.tts.endpoint; }
    cfg.ai = Object.assign({}, DEFAULTS.ai, cfg.ai||{});
    cfg.tts = Object.assign({}, DEFAULTS.tts, cfg.tts||{});
    cfg.caps = cfg.caps || { ai:null, tts:null };
    return cfg;
  }
  async function saveConfig(next){ cfg = next; await ML.store.setSetting('providers', next); }
  function config(){ return cfg || DEFAULTS; }
  function hasAI(){ const c=config().ai; return c && c.provider!=='none' && !!c.baseUrl; }
  function hasTTS(){ const c=config().tts; return c && c.provider!=='none' && !!c.baseUrl; }
  function mode(){ return { ai: hasAI()?'provider':'DEV_MOCK', tts: hasTTS()?'provider':'DEV_MOCK' }; }
  function supplierList(){ return Object.keys(SUPPLIERS); }
  function supplier(name){ return SUPPLIERS[name]||SUPPLIERS.custom; }

  /* ---- helpers: URL normalize + error classification (never leak keys) ---- */
  function base(baseUrl){
    let b = String(baseUrl||'').trim().replace(/\/+$/,'');
    if(!/^https?:\/\//i.test(b)) throw { code:'url', message:'Base URL 必须以 http(s):// 开头' };
    return b;
  }
  function classifyError(err, status){
    /* already-classified error objects pass through untouched */
    if(err && typeof err==='object' && err.code && !err.httpStatus && !err.raw) return err;
    if(status === undefined && err && err.httpStatus) status = err.httpStatus;
    if(status){
      if(status===401||status===403) return { code:'auth', message:'API Key 无效或没有权限（HTTP '+status+'）' };
      if(status===404) return { code:'endpoint', message:'地址错误或接口不存在（HTTP 404）——请检查 Base URL 与路径' };
      if(status===400) return { code:'bad_request', message:'请求参数或模型名不被接受（HTTP 400）——请检查模型 ID' };
      if(status===429) return { code:'rate_limit', message:'请求被限流或额度不足（HTTP 429）' };
      if(status>=500) return { code:'server', message:'服务端错误（HTTP '+status+'）——请稍后重试' };
      return { code:'http_'+status, message:'请求失败（HTTP '+status+'）' };
    }
    const msg = String((err&&err.message)||err||'unknown');
    if(/timeout|abort/i.test(msg)) return { code:'timeout', message:'请求超时——请检查网络或服务状态' };
    if(/failed to fetch|networkerror|load failed|fetch/i.test(msg)) return { code:'cors_or_network', message:'网络或跨域（CORS）失败——浏览器直连该服务被拒绝，或网络不可达。请改用支持 CORS 的端点，或检查网络。' };
    return { code:'unknown', message: msg.slice(0,160) };
  }

  async function fetchJSON(url, opts, timeoutMs){
    const ctl = new AbortController();
    const t = setTimeout(()=>ctl.abort(), timeoutMs||20000);
    try{
      const r = await fetch(url, Object.assign({}, opts, { signal: ctl.signal }));
      const text = await r.text();
      let data = null;
      try{ data = text ? JSON.parse(text) : null; }catch(e){ data = null; }
      if(!r.ok) throw { httpStatus: r.status, body: data };
      return data;
    }catch(e){
      if(e && e.httpStatus) throw e;
      throw classifyError(e);
    }finally{ clearTimeout(t); }
  }
  function extractContent(data){
    if(!data) return null;
    if(data.choices && data.choices[0] && data.choices[0].message) return data.choices[0].message.content;
    if(data.output_text) return data.output_text;
    if(data.choices && data.choices[0] && data.choices[0].text) return data.choices[0].text;
    return null;
  }
  function parseJSONLoose(text){
    if(text==null) return null;
    let s = String(text).trim();
    /* strip markdown fences */
    s = s.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
    try{ return JSON.parse(s); }catch(e){}
    /* extract first {...} block */
    const i = s.indexOf('{'), j = s.lastIndexOf('}');
    if(i>=0 && j>i){ try{ return JSON.parse(s.slice(i, j+1)); }catch(e){} }
    return null;
  }

  /* ---- OpenAI-compatible chat → structured JSON ---- */
  async function chatJSON(baseUrl, key, model, systemPrompt, userText, images){
    const url = base(baseUrl) + '/chat/completions';
    const msgUser = images && images.length
      ? [ { type:'text', text: userText } ].concat(images.map(u=>({ type:'image_url', image_url:{ url:u } })))
      : userText;
    const body = {
      model, temperature:0.2,
      messages: [
        { role:'system', content: systemPrompt },
        { role:'user', content: msgUser }
      ]
    };
    let data;
    try{
      data = await fetchJSON(url, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+key },
        body: JSON.stringify(Object.assign({}, body, { response_format:{ type:'json_object' } }))
      }, 30000);
    }catch(e){
      if(e && e.httpStatus===400){
        /* some compatible providers reject response_format — retry without it */
        data = await fetchJSON(url, {
          method:'POST',
          headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+key },
          body: JSON.stringify(body)
        }, 30000);
      } else throw e;
    }
    return parseJSONLoose(extractContent(data));
  }

  /* ---- capability probe: GET /models ---- */
  async function testConnection(section){
    const c = section==='tts' ? config().tts : config().ai;
    if(!c || c.provider==='none' || !c.baseUrl){ return { ok:false, code:'not_configured', message:'尚未配置 '+(section==='tts'?'TTS':'AI')+' Provider' }; }
    try{
      const t0 = performance.now();
      let data;
      try{
        data = await fetchJSON(base(c.baseUrl) + '/models', {
          method:'GET', headers:{ Authorization:'Bearer '+c.key }
        }, 20000);
      }catch(e){
        if(e && (e.code==='endpoint' || e.httpStatus===404)){
          /* some services expose no /models — probe with a minimal chat call */
          data = await chatJSON(c.baseUrl, c.key, c.model || supplier(c.provider).model, 'You are a probe. Reply JSON only.', '{"ok":true}');
          const latency = Math.round(performance.now()-t0);
          return { ok:true, kind:'chat', latency, capabilities:{ chat:true }, message:'连接成功（chat 探测）' };
        }
        throw e;
      }
      const latency = Math.round(performance.now()-t0);
      const list = Array.isArray(data&&data.data) ? data.data.map(m=>m&&m.id).filter(Boolean) : [];
      return { ok:true, kind:'models', latency, modelCount:list.length, models:list.slice(0,20),
        capabilities:{ chat:true }, message:'连接成功 — '+list.length+' 个模型可用' };
    }catch(e){
      return classifyError(e);
    }
  }

  /* ---- TTS: OpenAI-compatible /audio/speech ---- */
  async function ttsSpeech(baseUrl, key, model, text, voice){
    const url = base(baseUrl) + '/audio/speech';
    const r = await fetch(url, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+key },
      body: JSON.stringify({ model: model || supplier(config().tts.provider).model || 'tts-1', input: text, voice: voice||'alloy', response_format:'mp3' }),
      signal: AbortSignal.timeout(60000)
    });
    if(!r.ok){
      const bodyText = await r.text().catch(()=>'');
      const e = classifyError(null, r.status);
      e.detail = bodyText.slice(0,200);
      throw e;
    }
    return await r.blob();
  }
  async function realDuration(blob){
    try{
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const buf = await blob.arrayBuffer();
      const dec = await ctx.decodeAudioData(buf);
      const d = dec.duration;
      try{ ctx.close(); }catch(e){}
      return isFinite(d)&&d>0 ? d : null;
    }catch(e){ return null; }
  }

  /* ================================================================ */
  /* Public AI interface                                             */
  /* ================================================================ */
  const AI = {
    async analyzeMedia(meta){
      if(!hasAI()) return mockMediaAnalysis(meta);
      const c = config().ai;
      const sys = '你是视频剪辑素材分析引擎。根据素材的名称、类型、尺寸与（如有）画面缩略图，输出 JSON：{"tags":["中文标签，3-6个"],"labels":["同 tags"],"scene":"场景类别","subjects":["主体，最多2个"],"emotion":"neutral|focus|positive|tension","importance":0-1,"confidence":0-1}。只输出 JSON。';
      const images = [];
      if(c.visionModel && meta.thumb && /^data:image/.test(meta.thumb)) images.push(meta.thumb);
      const userText = '素材：'+(meta.name||'')+' | 类型 '+(meta.type||'')+' | 尺寸 '+(meta.width||0)+'x'+(meta.height||0)+' | 时长 '+(meta.duration||0)+'s';
      try{
        const out = await chatJSON(c.baseUrl, c.key, c.visionModel || c.model, sys, userText, images);
        if(!out || !Array.isArray(out.tags)) throw new Error('bad_json');
        return {
          real:true, provider:c.provider, model:c.visionModel||c.model, vision:!!(c.visionModel && images.length),
          tags:Array.from(new Set(String(out.tags[0]).split(',')||out.tags)).slice(0,6),
          labels:Array.from(new Set(out.labels||out.tags)).slice(0,6),
          scene:out.scene||'室内', subjects:out.subjects||[], emotion:out.emotion||'neutral',
          importance:L.clamp(Number(out.importance)||0.5,0,1), confidence:L.clamp(Number(out.confidence)||0.5,0,1)
        };
      }catch(e){
        ML.diag && ML.diag.error('PROVIDER','analyze-media',null,classifyError(e));
        const mock = mockMediaAnalysis(meta); mock.real = false; mock.fallback = true;
        return mock;
      }
    },
    async analyzeText(text){
      if(!hasAI()) return { mock:true };
      const c = config().ai;
      const sys = '你是短视频文案分析引擎。输出 JSON：{"keywords":["中文关键词3-6个"],"intent":"HOOK|CONTEXT|EXPLANATION|PROOF|STEPS|TRANSITION|CONCLUSION|CTA|QUESTION","visualNeeds":["画面需求，中文2-4个"],"tone":"neutral|positive|tension","confidence":0-1}。只输出 JSON。';
      try{
        const out = await chatJSON(c.baseUrl, c.key, c.model, sys, String(text).slice(0,2000));
        if(!out) throw new Error('bad_json');
        return { real:true, provider:c.provider, keywords:out.keywords||[], intent:out.intent||'EXPLANATION',
          visualNeeds:out.visualNeeds||[], tone:out.tone||'neutral', confidence:L.clamp(Number(out.confidence)||0.5,0,1) };
      }catch(e){
        ML.diag && ML.diag.error('PROVIDER','analyze-text',null,classifyError(e));
        return { real:false, fallback:true, keywords:extractKeywords(text), intent:'EXPLANATION', visualNeeds:[], tone:'neutral' };
      }
    },
    mode: ()=>hasAI() ? 'provider' : 'DEV_MOCK'
  };

  /* ================================================================ */
  /* Public TTS interface                                             */
  /* ================================================================ */
  let _previewActive = false;

  const TTS = {
    async synthesize(text, voiceId){
      const v = voiceId || (config().tts && config().tts.voice) || 'alloy';
      if(!hasTTS()){
        return { audio:null, duration: estimateDuration(text), provider:'DEV_MOCK', voiceId:v, status:'mock' };
      }
      const c = config().tts;
      try{
        const blob = await ttsSpeech(c.baseUrl, c.key, c.model, text, v);
        const dur = await realDuration(blob) || estimateDuration(text);
        return { audio: blob, duration: dur, provider: c.provider, voiceId: v, model: c.model, status:'real' };
      }catch(e){
        ML.diag && ML.diag.error('PROVIDER','tts',null,e);
        throw e;
      }
    },
    async preview(text, voiceId){
      /* live listen — browser speech synthesis, never faked audio (labelled in UI) */
      if(!window.speechSynthesis) return false;
      return new Promise(res=>{
        let settled = false;
        const done = ok=>{ if(!settled){ settled = true; _previewActive = false; res(ok); } };
        const u = new SpeechSynthesisUtterance(text);
        u.lang = /[\u4e00-\u9fff]/.test(text) ? 'zh-CN' : 'en-US';
        u.rate = 1; u.pitch = 1;
        u.onend = ()=>done(true);
        u.onerror = ()=>done(false);
        window.speechSynthesis.cancel();
        _previewActive = true;
        window.speechSynthesis.speak(u);
        setTimeout(()=>done(false), 45000);
      });
    },
    stopPreview(){ if(window.speechSynthesis) window.speechSynthesis.cancel(); _previewActive = false; },
    isPreviewing(){ return _previewActive; },
    voices(){
      /* provider-specific voice ids are free-form now; keep a sensible default list */
      return ['alloy','echo','fable','onyx','nova','shimmer'];
    },
    mode: ()=>hasTTS() ? 'provider' : 'DEV_MOCK'
  };

  /* ---- DEV MOCK analyzers (deterministic, clearly labelled) ---- */
  function estimateDuration(text){
    /* ~3.2 chars/sec zh, ~2.6 words/sec en, clamped */
    const zh = (text.match(/[\u4e00-\u9fff]/g)||[]).length;
    const rest = text.replace(/[\u4e00-\u9fff]/g,' ').trim();
    const enWords = rest?rest.split(/\s+/).length:0;
    const secs = zh/3.2 + enWords/2.6;
    return L.clamp(secs, 1.2, 20);
  }

  /* semantic dictionary used by the local analyzer — keyword → visual tags */
  const VISUAL_MAP = [
    { re:/睡眠|睡觉|睡|失眠|疲惫|累|tired|sleep|insomnia/i, tags:['卧室','夜晚','床','安静','人物','疲惫'] },
    { re:/工作|上班|加班|职场|压力|办公|大脑|高强度|work|office|stress/i, tags:['办公室','电脑','工作','城市','人物'] },
    { re:/跑步|健身|运动|锻炼|run|fitness|exercise|workout/i, tags:['运动','户外','人物','活力'] },
    { re:/咖啡|早餐|饮食|吃|食物|coffee|breakfast|food|eat/i, tags:['咖啡','餐桌','食物','早晨'] },
    { re:/城市|地铁|通勤|交通|city|metro|commute/i, tags:['城市','街道','地铁','通勤'] },
    { re:/手机|手机屏幕|app|应用|digital|phone|screen/i, tags:['手机','屏幕','数码','界面'] },
    { re:/效率|方法|技巧|tips|productivity|how/i, tags:['办公','电脑','笔记','人物'] },
    { re:/健康|身体|疾病|医生|hospital|health|doctor/i, tags:['医院','健康','人物','医疗'] },
    { re:/钱|收入|理财|存钱|省钱|money|finance|save/i, tags:['财务','数字','图表','城市'] },
    { re:/创业|副业|老板|生意|startup|business/i, tags:['办公室','电脑','会议','人物'] },
    { re:/旅行|旅游|风景|海边|旅行|travel|beach/i, tags:['风景','旅行','户外','天空'] }
  ];
  const STOP = new Set(['的','了','是','在','和','也','都','而','及','与','着','或','一个','没有','我们','你们','他们','这个','那个','因为','所以','但是','但是','可能','并不','还是','什么','为什么','怎么','如何','可以','需要','自己','大家','很多','第','个','原因','时间','真的','比','更','要','只','就','对','被','把','让','给','会','能','有','不','很','最','种','些']);

  function extractKeywords(text){
    const zhTokens = text.match(/[\u4e00-\u9fff]{2,4}/g) || [];
    const enTokens = text.toLowerCase().match(/[a-z]{3,}/g) || [];
    const freq = {};
    zhTokens.concat(enTokens).forEach(w=>{ if(!STOP.has(w)) freq[w] = (freq[w]||0)+1; });
    return Object.keys(freq).sort((a,b)=>freq[b]-freq[a]).slice(0,6);
  }

  function mockMediaAnalysis(meta){
    const Lx = ML.lib;
    const name = String(meta.name||'').toLowerCase();
    const dict = [
      { keys:['bed','bedroom','room','卧室','床','睡眠'], tags:['卧室','床','夜晚','安静','室内','疲惫'] },
      { keys:['office','desk','computer','办公','电脑','工位','工作','会议'], tags:['办公室','电脑','工作','办公','室内','会议'] },
      { keys:['city','street','地铁','城市','街道','通勤'], tags:['城市','街道','地铁','通勤','人群'] },
      { keys:['nature','forest','sea','beach','sky','自然','风景','天空','旅行'], tags:['自然','风景','天空','户外','旅行'] },
      { keys:['person','face','portrait','口播','talk','人物','人像'], tags:['人物','特写','人物访谈','室内'] },
      { keys:['product','goods','产品','商品'], tags:['产品','商品','特写','展示'] },
      { keys:['food','coffee','eat','食物','咖啡','早餐','餐桌'], tags:['食物','咖啡','餐桌','早晨','饮食'] },
      { keys:['phone','screen','手机','屏幕'], tags:['手机','屏幕','数码','界面'] },
      { keys:['run','sport','gym','运动','跑步','健身','锻炼'], tags:['运动','户外','活力','人物'] },
      { keys:['money','finance','财务','钱','理财'], tags:['财务','数字','图表','城市'] },
      { keys:['health','hospital','医生','健康','医疗'], tags:['医院','健康','医疗','人物'] }
    ];
    const tags = [];
    dict.forEach(d=>{ if(d.keys.some(k=>name.includes(k))) tags.push(...d.tags); });
    const seed = Lx.hashStr(name + (meta.width||0));
    const rnd = Lx.mulberry32(seed);
    const scenePool = ['室内','户外','城市','自然','工作场景','生活场景','特写','全景'];
    return {
      mock: true,
      provider: 'DEV_MOCK',
      tags: Array.from(new Set(tags)).slice(0,6),
      labels: Array.from(new Set(tags)).slice(0,6),
      scene: scenePool[Math.floor(rnd()*scenePool.length)],
      subjects: Array.from(new Set(tags)).slice(0,2),
      emotion: rnd()>0.5?'neutral':'focus',
      importance: 0.5 + rnd()*0.5
    };
  }

  /* ---- key management (local-only, no logs) ---- */
  function clearSectionKey(section){
    if(section==='tts'){ config().tts.key=''; }
    else { config().ai.key=''; }
    config().caps = config().caps||{};
    if(section==='tts') config().caps.tts=null; else config().caps.ai=null;
    return saveConfig(config());
  }

  return { loadConfig, saveConfig, config, hasAI, hasTTS, mode,
    AI, TTS, testConnection, clearSectionKey,
    SUPPLIERS, supplierList, supplier, base, classifyError, chatJSON,
    estimateDuration, extractKeywords, mockMediaAnalysis, VISUAL_MAP };
})();
