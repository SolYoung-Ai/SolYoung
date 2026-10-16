/* ============ ML.transcribe — speech-to-text pipeline (browser-local first) ============ */
/* Sources (never faked):
   1. whisper-local — @huggingface/transformers.js + Whisper ONNX (WASM/WebGPU), model downloaded on demand
   2. api          — user's own OpenAI-compatible {baseUrl}/audio/transcriptions (verbose_json)
   3. srt          — user pastes SRT/ASS/timed text (no network, no model)
   Output segments: [{ start (s), end (s), text }] — real timestamps when the source provides them,
   otherwise start=null and the UI must say so honestly. */
ML.transcribe = (function(){
  const L = ML.lib;
  const Tn = ML.i18n.t;

  /* ---------- PCM extraction: any media → 16 kHz mono Float32 ---------- */
  async function extractPCM(blob){
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    let buf;
    try{
      const ab = await blob.arrayBuffer();
      buf = await ctx.decodeAudioData(ab);
    }finally{
      try{ ctx.close(); }catch(e){}
    }
    if(!buf || !buf.length) throw new Error('audio_decode_failed');
    const sr = 16000;
    const n = Math.ceil(buf.duration * sr);
    const off = new OfflineAudioContext(1, n, sr);
    const src = off.createBufferSource();
    const mono = off.createBuffer(1, n, sr);
    const ch = buf.getChannelData(0);
    /* resample from buf.sampleRate to sr */
    const out = mono.getChannelData(0);
    for(let i=0;i<n;i++){
      const t = i * buf.sampleRate / sr;
      const i0 = Math.floor(t), i1 = Math.min(i0+1, ch.length-1);
      const f = t - i0;
      out[i] = ch[i0]*(1-f) + ch[i1]*f;
    }
    src.buffer = mono;
    src.connect(off.destination);
    src.start(0);
    await off.startRendering();
    return { samples: out, sampleRate: sr, duration: buf.duration };
  }

  /* ---------- silence/gap detection (RMS-based, honest) ---------- */
  function detectGaps(pcm, sampleRate, opts){
    opts = opts || {};
    const winSec = opts.window || 0.05, thr = opts.threshold || 0.012, minGap = opts.minGap || 0.4;
    const win = Math.max(1, Math.round(winSec*sampleRate));
    const gaps = [];
    let inGap = false, gs = 0;
    const rms = i => {
      let s = 0;
      const e = Math.min(i+win, pcm.length);
      for(let j=i;j<e;j++){ s += pcm[j]*pcm[j]; }
      return Math.sqrt(s/(e-i));
    };
    for(let i=0;i<pcm.length;i+=win){
      const quiet = rms(i) < thr;
      if(quiet && !inGap){ inGap = true; gs = i; }
      else if(!quiet && inGap){
        inGap = false;
        const gapDur = (i-gs)/sampleRate;
        if(gapDur >= minGap) gaps.push({ start: gs/sampleRate, end: i/sampleRate, duration: gapDur });
      }
    }
    if(inGap){
      const gapDur = (pcm.length-gs)/sampleRate;
      if(gapDur >= minGap) gaps.push({ start: gs/sampleRate, end: pcm.length/sampleRate, duration: gapDur });
    }
    return gaps;
  }

  /* ---------- SRT / timed-text parsing ---------- */
  function parseSRT(text){
    const blocks = (text||'').replace(/\r/g,'').split(/\n\s*\n/);
    const out = [];
    for(const b of blocks){
      const lines = b.split('\n').filter(x=>x.trim());
      if(lines.length < 2) continue;
      const timeLine = lines.find(x=>/-->/.test(x));
      if(!timeLine) continue;
      const m = timeLine.match(/([\d:,\.]+)\s*-->\s*([\d:,\.]+)/);
      if(!m) continue;
      const start = parseTS(m[1]), end = parseTS(m[2]);
      if(end <= start) continue;
      const textIdx = lines.indexOf(timeLine) + 1;
      const txt = lines.slice(textIdx).join(' ').trim();
      if(txt) out.push({ start, end, text: txt });
    }
    return out;
  }
  function parseTS(s){
    const p = s.trim().split(':');
    let sec = 0;
    if(p.length === 3) sec = (+p[0])*3600 + (+p[1])*60 + (+p[2].replace(',','.'));
    else if(p.length === 2) sec = (+p[0])*60 + (+p[1].replace(',','.'));
    else sec = +s.replace(',','.');
    return Math.max(0, sec);
  }
  function parsePlainText(text){
    return (text||'').split(/\n+/).map(x=>x.trim()).filter(Boolean)
      .map(t=>({ start: null, end: null, text: t }));
  }

  /* ---------- OpenAI-compatible /audio/transcriptions ---------- */
  async function apiTranscribe(blob, cfg){
    const base = (cfg.baseUrl||'').replace(/\/+$/,'');
    const url = base + '/audio/transcriptions';
    const fd = new FormData();
    fd.append('file', blob, 'audio.webm');
    fd.append('model', cfg.model || 'whisper-1');
    fd.append('response_format', 'verbose_json');
    fd.append('language', cfg.language || 'zh');
    let resp;
    try{
      resp = await fetch(url, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + (cfg.key||'') },
        body: fd
      });
    }catch(e){
      const err = new Error('cors_or_network');
      err.code = 'cors_or_network';
      throw err;
    }
    if(!resp.ok){
      const err = new Error('http_' + resp.status);
      err.code = 'http_' + resp.status;
      err.httpStatus = resp.status;
      throw err;
    }
    let data;
    try{ data = await resp.json(); }catch(e){ throw Object.assign(new Error('bad_json'), { code:'bad_json' }); }
    const segs = (data.segments||[]).filter(s=>s && s.text && s.text.trim())
      .map(s=>({ start: s.start, end: s.end, text: s.text.trim() }));
    if(!segs.length && data.text){
      /* no per-segment timestamps → honest single segment without timing */
      return [{ start: null, end: null, text: data.text.trim() }];
    }
    return segs;
  }

  /* ---------- browser-local Whisper via transformers.js ---------- */
  let whisperPipe = null, whisperModel = null, whisperEnvReady = false;
  async function loadWhisper(cfg, onProgress){
    if(whisperPipe && whisperModel === cfg.model) return whisperPipe;
    const modulesUrl = cfg.modulesUrl || 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
    onProgress && onProgress('load', 2);
    const mod = await import(modulesUrl);
    const { pipeline, env } = mod;
    if(!whisperEnvReady){
      env.allowLocalModels = false;
      if(cfg.mirror){ env.remoteHost = cfg.mirror; }
      whisperEnvReady = true;
    }
    const model = cfg.model || 'Xenova/whisper-tiny';
    onProgress && onProgress('model', 8);
    whisperPipe = await pipeline('automatic-speech-recognition', model, { dtype: cfg.dtype || 'q8' });
    whisperModel = model;
    return whisperPipe;
  }
  async function whisperLocal(pcm, sampleRate, cfg, onProgress){
    const pipe = await loadWhisper(cfg, onProgress);
    const chunks = splitChunks(pcm, sampleRate, cfg.maxChunk || 28, cfg.overlap || 1.2);
    const out = [];
    let offset = 0;
    for(let i=0;i<chunks.length;i++){
      onProgress && onProgress('transcribe', 12 + Math.round(78*(i+1)/chunks.length));
      const ch = chunks[i];
      let r;
      try{
        r = await pipe(ch.samples, {
          language: (cfg.language||'zh'),
          task: 'transcribe',
          return_timestamps: true,
          chunk_length_s: 30
        });
      }catch(e){
        /* fall back to no-timestamp text if chunked timestamps unsupported */
        try{
          r = await pipe(ch.samples, { language: (cfg.language||'zh'), task: 'transcribe' });
        }catch(e2){
          throw Object.assign(new Error('whisper_inference_failed'), { code:'whisper_failed' });
        }
      }
      const base = ch.offset;
      const text = (r && r.text || '').trim();
      if(text){
        if(r && Array.isArray(r.chunks) && r.chunks.length){
          for(const c of r.chunks){
            const t = (c.text||'').trim();
            if(!t) continue;
            const st = base + (typeof c.timestamp[0]==='number' ? c.timestamp[0] : 0);
            const en = base + (typeof c.timestamp[1]==='number' ? c.timestamp[1] : st + 1.2);
            out.push({ start: st, end: Math.min(en, base + ch.samples.length/sampleRate), text: t });
          }
        }else{
          out.push({ start: base, end: base + ch.samples.length/sampleRate, text });
        }
      }
    }
    return out;
  }
  function splitChunks(pcm, sampleRate, maxSec, overlapSec){
    const max = Math.floor(maxSec*sampleRate), ov = Math.floor(overlapSec*sampleRate);
    const out = [];
    let i = 0;
    while(i < pcm.length){
      const end = Math.min(i + max, pcm.length);
      out.push({ samples: pcm.subarray(i, end), offset: i/sampleRate });
      if(end >= pcm.length) break;
      i = end - ov;
    }
    return out;
  }

  /* ---------- dispatcher ---------- */
  async function transcribe(blob, cfg, onProgress){
    cfg = cfg || {};
    const provider = cfg.provider || 'none';
    if(provider === 'srt' || provider === 'paste'){
      return { segments: parseSRT(cfg.srtText || '') || parsePlainText(cfg.srtText || ''), source: 'srt' };
    }
    if(provider === 'api'){
      const segments = await apiTranscribe(blob, cfg);
      return { segments, source: 'api' };
    }
    if(provider === 'whisper-local'){
      const pcm = await extractPCM(blob);
      const segments = await whisperLocal(pcm.samples, pcm.sampleRate, cfg, onProgress);
      return { segments, source: 'whisper-local', duration: pcm.duration };
    }
    throw Object.assign(new Error('transcribe_not_configured'), { code: 'not_configured' });
  }

  return { extractPCM, detectGaps, parseSRT, parsePlainText, apiTranscribe, whisperLocal, transcribe, splitChunks };
})();
