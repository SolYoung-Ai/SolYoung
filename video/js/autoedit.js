/* ============ ML.autoedit — Auto Edit engine (voice-first) ============ */
ML.autoedit = (function(){
  const L = ML.lib;
  const Tn = ML.i18n.t;

  let currentJob = null;

  function newJob(projectId){
    currentJob = { id: 'job'+L.uid(), projectId, status:'queued', stage:'', progress:0, error:null };
    return currentJob;
  }
  function job(){ return currentJob; }

  async function run(project, opts){
    opts = opts || {};
    if(!currentJob) currentJob = newJob(project && project.id);
    const job = currentJob;
    job.status = 'processing'; job.stage = Tn('ae.stage.script'); job.progress = 4;
    const tick = (stage, p) => { if(job.status==='cancelled') throw new Error('cancelled'); job.stage = stage; job.progress = p; };
    try{
      /* 1 — script split */
      let scenes = ML.script.analyze(project.scriptText);
      if(!scenes.length) throw new Error('empty_script');
      project.scenes = scenes;
      tick(Tn('ae.stage.voice'), 18);

      /* 2 — voice segments (voice first: duration drives timing) */
      const vseg = [];
      for(let i=0;i<scenes.length;i++){
        const s = scenes[i];
        const seg = await ML.voice.generateSegment(project, s, opts.voice);
        vseg.push(seg);
        s.voiceSegmentId = seg.id; s.duration = seg.duration;
        if(i%2===0) tick(Tn('ae.stage.voice'), 18 + 24*(i+1)/scenes.length);
        if(job.status==='cancelled') throw new Error('cancelled');
      }
      project.voiceSegments = vseg;
      tick(Tn('ae.stage.match'), 45);

      /* 3 — match visuals */
      const assets = project.assets.filter(a=>a && a.id);
      const matches = ML.matcher.matchAll(scenes, assets, project.ratio, { threshold: 10 });
      const matchMap = {};
      matches.forEach(m=>{
        const sc = scenes.find(x=>x.id===m.scene.id);
        if(sc){ sc.assetId = m.asset ? m.asset.id : null; sc.confidence = m.asset?m.confidence:0; sc.matchReasons = m.reasons||[]; sc.weak = m.weak; }
        if(m.asset) matchMap[m.scene.id] = m;
      });
      tick(Tn('ae.stage.timeline'), 58);

      /* 4 — build timeline (voice-first timing, style-aware) */
      const style = styleOf(project, opts.style);
      if(project.settings) project.settings.editStyle = style.key;
      project.timeline = { clips: [], duration: 0 };
      let cursor = 0;
      scenes.forEach(sc=>{
        const dur = sc.duration;
        const v = vseg.find(x=>x.sceneId===sc.id);
        const seg = v || { id:'v'+L.uid(), sceneId:sc.id, text:sc.text, duration:dur, provider:'DEV_MOCK', voiceId:'Chinese Female 01' };
        if(!v) project.voiceSegments.push(seg);
        sc._tlStart = cursor;
        /* video clip(s) */
        const asset = sc.assetId ? project.assets.find(a=>a.id===sc.assetId) : null;
        if(asset){
          const needDur = Math.max(0.8, dur * (style.split && sc.multi ? style.clipDurK : 1));
          const r = smartSourceRange(asset, needDur, L.hashStr(sc.id+':r'));
          const scale = shotScale(sc, style, asset);
          const mkVideo = (s0, s1, t0, t1) => {
            const clip = ML.timeline.newClip('video', {
              sceneId: sc.id, assetId: asset.id,
              sourceStart: s0, sourceEnd: s1,
              timelineStart: t0, timelineEnd: t1,
              scale, speed: 1, transition: style.fade>0?style.fade:0
            });
            ML.timeline.addClip(project, clip);
            sc.clipIds = sc.clipIds||[]; sc.clipIds.push(clip.id);
          };
          if(style.split && sc.multi && asset.type==='video' && asset.duration >= needDur*1.9){
            /* two shots from different source ranges — real cut change */
            const mid = Math.min(asset.duration - needDur*0.5, r.start + needDur*1.4);
            mkVideo(r.start, r.start+needDur, cursor, cursor+needDur);
            mkVideo(Math.min(mid, asset.duration-needDur), Math.min(mid+needDur, asset.duration), cursor+needDur, cursor+dur);
          } else {
            mkVideo(r.start, r.end, cursor, cursor+dur);
          }
          sc.clipId = (sc.clipIds||[])[0];
        } else {
          /* no strong match — leave the gap empty rather than faking */
          sc.matchReasons = sc.matchReasons.length ? sc.matchReasons : [Tn('ae.noMatch')];
        }
        /* voice clip */
        const vc = ML.timeline.newClip('voice', {
          sceneId: sc.id, voiceId: seg.id, duration: dur,
          timelineStart: cursor, timelineEnd: cursor + dur, speed: 1, volume: 1
        });
        ML.timeline.addClip(project, vc);
        /* marker */
        const mk = ML.timeline.newClip('marker', {
          sceneId: sc.id, text: Tn('sc.scene')+' '+sc.order,
          timelineStart: cursor, timelineEnd: cursor + 0.05
        });
        ML.timeline.addClip(project, mk);
        cursor += dur;
      });
      project.timeline.duration = cursor;
      tick(Tn('ae.stage.subtitle'), 78);

      /* 5 — subtitles */
      const subs = [];
      project.timeline.clips.filter(c=>c.track==='video').sort((a,b)=>a.timelineStart-b.timelineStart).forEach(c=>{
        const sc = scenes.find(x=>x.id===c.sceneId);
        const vs = project.voiceSegments.find(x=>x.sceneId===c.sceneId);
        const sub = ML.subtitle.fromScene(sc, vs, project.settings && project.settings.subtitleStyle, subs.length);
        ML.timeline.addClip(project, ML.timeline.newClip('subtitle', {
          sceneId: sc.id, text: sc.text, lines: sub.lines, style: sub.style,
          timelineStart: c.timelineStart, timelineEnd: c.timelineEnd
        }));
        subs.push(sub);
      });
      project.subtitles = subs;
      project.quality = qualityCheck(project);
      tick(Tn('ae.stage.preview'), 92);

      /* 6 — preview render warm-up */
      await new Promise(r=>setTimeout(r, 30));
      job.status = 'completed'; job.stage = Tn('ae.stage.done'); job.progress = 100;
      return project;
    }catch(e){
      if(job.status==='cancelled'){ job.status='cancelled'; return project; }
      job.status = 'failed'; job.error = String(e&&e.message||e);
      throw e;
    }
  }

  function cancel(){
    if(currentJob && (currentJob.status==='queued'||currentJob.status==='processing')) currentJob.status = 'cancelled';
  }

  /* ============ runVoiceover — real voiceover auto-cut ============
     Input: project with mediaId (the voiceover video/audio asset) + transcribed
     segments (real timestamps from whisper-local / transcription API / pasted SRT).
     Output: scenes = one per segment (semantic boundary = segment), timeline with
     the source video as picture, source audio kept (voiceSegments status='source'),
     subtitles from the transcript. Never fakes a cut position. */
  async function runVoiceover(project, opts){
    opts = opts || {};
    if(!currentJob) currentJob = newJob(project && project.id);
    const job = currentJob;
    job.status = 'processing'; job.stage = Tn('ae.stage.script'); job.progress = 4;
    const tick = (stage, p) => { if(job.status==='cancelled') throw new Error('cancelled'); job.stage = stage; job.progress = p; };
    try{
      /* 1 — transcribed segments (real timestamps) */
      const segs = (opts.segments||[]).filter(s=>s && s.text && s.text.trim());
      if(!segs.length) throw new Error('vo.noSegments');
      const voAsset = (project.assets||[]).find(a=>a.id===opts.mediaId);

      /* 2 — scenes: one per segment, duration = real speech span */
      const scenes = segs.map((s,i)=>{
        const dur = Math.max(0.8, Math.min((s.end||0)-(s.start||0) || 1.5, 30));
        return {
          id: 'sc'+L.uid(), order: i+1, text: s.text.trim(), type: 'VOICE',
          duration: dur, source: 'transcribe',
          segStart: typeof s.start==='number' ? s.start : null,
          segEnd: typeof s.end==='number' ? s.end : null,
          assetId: null, confidence: 0, matchReasons: [], weak: false
        };
      });
      project.scenes = scenes;
      project.source = 'voiceover';
      tick(Tn('ae.stage.match'), 22);

      /* 3 — optional B-roll matching; fallback picture = the voiceover video itself */
      const broll = (project.assets||[]).filter(a=>a && a.id && a.id!==opts.mediaId);
      const matches = ML.matcher.matchAll(scenes, broll, project.ratio, { threshold: 10 });
      const matchMap = {};
      matches.forEach(m=>{
        const sc = scenes.find(x=>x.id===m.scene.id);
        if(sc && m.asset){ sc.assetId = m.asset.id; sc.confidence = m.confidence; sc.matchReasons = m.reasons||[]; sc.weak = m.weak; matchMap[m.scene.id]=m; }
      });
      const style = styleOf(project, opts.style);

      /* 4 — timeline: picture = matched broll or the source video; audio = source */
      project.timeline = { clips: [], duration: 0 };
      let cursor = 0;
      scenes.forEach(sc=>{
        const dur = sc.duration;
        sc._tlStart = cursor;
        const pic = sc.assetId ? project.assets.find(a=>a.id===sc.assetId) : null;
        const picAsset = pic || voAsset;
        if(picAsset){
          let s0 = 0, s1 = picAsset.duration || dur;
          if(pic === voAsset || !pic){
            /* playing the voiceover video itself: align to the real speech span */
            if(typeof sc.segStart==='number' && typeof sc.segEnd==='number'){
              s0 = Math.max(0, sc.segStart); s1 = Math.min(picAsset.duration||1e9, sc.segEnd);
            }
          }else{
            /* broll: deterministic middle-band pick, seeded per scene */
            const r = smartSourceRange(picAsset, dur, L.hashStr(sc.id+':vo'));
            s0 = r.start; s1 = r.end;
          }
          const clip = ML.timeline.newClip('video', {
            sceneId: sc.id, assetId: picAsset.id,
            sourceStart: s0, sourceEnd: Math.max(s1, s0+0.2),
            timelineStart: cursor, timelineEnd: cursor + dur,
            scale: shotScale(sc, style, picAsset), speed: 1,
            transition: style.fade>0?style.fade:0,
            audio: true
          });
          ML.timeline.addClip(project, clip);
          sc.clipIds = [clip.id]; sc.clipId = clip.id;
          sc.assetId = picAsset.id;
        }else{
          sc.matchReasons = [Tn('vo.noPicture')];
        }
        /* marker (scene label) */
        ML.timeline.addClip(project, ML.timeline.newClip('marker', {
          sceneId: sc.id, text: Tn('sc.scene')+' '+sc.order,
          timelineStart: cursor, timelineEnd: cursor + 0.05
        }));
        cursor += dur;
      });
      project.timeline.duration = cursor;

      /* 5 — voice segments: status 'source' → audio lives in the source media */
      project.voiceSegments = scenes.map(sc=>{
        const seg = segs.find(x=>x && x.text && x.text.trim()===sc.text) || {};
        return {
          id: 'v'+L.uid(), sceneId: sc.id, text: sc.text, duration: sc.duration,
          provider: 'SOURCE', status: 'source', voiceId: '',
          sourceMedia: opts.mediaId,
          start: typeof seg.start==='number' ? seg.start : (sc.segStart||0),
          end: typeof seg.end==='number' ? seg.end : (sc.segEnd||sc.duration)
        };
      });
      tick(Tn('ae.stage.subtitle'), 78);

      /* 6 — subtitles from transcript (real text + real timing) */
      const subs = [];
      project.timeline.clips.filter(c=>c.track==='video').sort((a,b)=>a.timelineStart-b.timelineStart).forEach(c=>{
        const sc = scenes.find(x=>x.id===c.sceneId);
        const vs = project.voiceSegments.find(x=>x.sceneId===c.sceneId);
        const sub = ML.subtitle.fromScene(sc, vs, project.settings && project.settings.subtitleStyle, subs.length);
        ML.timeline.addClip(project, ML.timeline.newClip('subtitle', {
          sceneId: sc.id, text: sc.text, lines: sub.lines, style: sub.style,
          timelineStart: c.timelineStart, timelineEnd: c.timelineEnd
        }));
        subs.push(sub);
      });
      project.subtitles = subs;
      project.quality = qualityCheck(project);
      tick(Tn('ae.stage.preview'), 92);
      await new Promise(r=>setTimeout(r, 30));
      job.status = 'completed'; job.stage = Tn('ae.stage.done'); job.progress = 100;
      return project;
    }catch(e){
      if(job.status==='cancelled'){ job.status='cancelled'; return project; }
      job.status = 'failed'; job.error = String(e&&e.message||e);
      throw e;
    }
  }

  /* ============ editing styles — each really changes edit decisions ============ */
  const STYLES = {
    natural:     { key:'natural',     zoomMin:1.00, zoomMax:1.03, split:false, fade:0,    clipDurK:1.00 },
    fast:        { key:'fast',        zoomMin:1.02, zoomMax:1.06, split:true,  fade:0,    clipDurK:0.80 },
    cinematic:   { key:'cinematic',   zoomMin:1.00, zoomMax:1.04, split:false, fade:0.35, clipDurK:1.00 },
    documentary: { key:'documentary', zoomMin:1.00, zoomMax:1.00, split:false, fade:0,    clipDurK:1.00 }
  };
  function styleOf(project, fallback){
    const k = (project && project.settings && project.settings.editStyle) || fallback || 'natural';
    return STYLES[k] ? STYLES[k] : STYLES.natural;
  }

  /* deterministic source-range pick: avoid head black-frames, prefer the middle
     band, seeded per scene so preview and export always agree. mode:'basic'
     honestly labels this as heuristic cutting (no semantic locate). */
  function smartSourceRange(asset, needDur, seed){
    if(asset.type!=='video' || !(asset.duration>0)) return { start:0, end:Math.max(0.5, needDur), mode:'static' };
    const dur = asset.duration;
    if(dur <= needDur + 0.05) return { start:0, end:dur, mode:'basic' };
    const avail = dur - needDur;
    const head = Math.min(1, avail*0.30), tail = Math.min(1, avail*0.25);
    const rnd = L.mulberry32(seed>>>0);
    const t = 0.30 + rnd()*0.40; /* middle band */
    const start = head + (avail-head-tail)*t;
    return { start: Math.max(0, start), end: Math.min(dur, start+needDur), mode:'basic' };
  }

  /* per-scene shot zoom derived from style (deterministic) */
  function shotScale(scene, style, asset){
    if(asset && asset.type==='image') return 1.04; /* gentle Ken Burns on images */
    const rnd = L.mulberry32(L.hashStr(scene.id)>>>0);
    return L.round(style.zoomMin + rnd()*(style.zoomMax-style.zoomMin), 3);
  }

  /* ============ quality check — honest rule-based review of the cut ============ */
  function qualityCheck(project){
    const warnings = [];
    const scenes = project.scenes||[];
    scenes.forEach(sc=>{
      if(!sc.assetId) warnings.push({ type:'noMatch', sceneId:sc.id, order:sc.order, message:Tn('ae.noMatch')+' · '+Tn('sc.scene')+' '+sc.order });
    });
    const useCount = {};
    (project.timeline.clips||[]).filter(c=>c.track==='video'&&c.assetId).forEach(c=>{
      useCount[c.assetId] = (useCount[c.assetId]||0)+1;
    });
    Object.keys(useCount).forEach(id=>{
      if(useCount[id]>=3){
        const a = (project.assets||[]).find(x=>x.id===id);
        warnings.push({ type:'overused', assetId:id, name:a?a.name:id, count:useCount[id], message:a?a.name+' ×'+useCount[id]+' — '+Tn('ae.overused'):'' });
      }
    });
    const first = (project.timeline.clips||[]).filter(c=>c.track==='video').sort((a,b)=>a.timelineStart-b.timelineStart)[0];
    if(!first || first.timelineStart > 0.5) warnings.push({ type:'coldStart', message:Tn('ae.coldStart') });
    return { warnings };
  }

  /* per-scene regenerate */
  async function regenVisual(project, sceneId){
    const sc = project.scenes.find(x=>x.id===sceneId);
    if(!sc) return;
    const matches = ML.matcher.matchAll([sc], project.assets, project.ratio, { threshold: 10 });
    const m = matches[0];
    sc.assetId = m.asset ? m.asset.id : null;
    sc.confidence = m.asset ? m.confidence : 0;
    sc.matchReasons = m.reasons||[];
    sc.weak = m.weak;
    /* rebuild that scene's video clip(s) in place */
    const style = styleOf(project);
    project.timeline.clips.filter(c=>c.track==='video' && c.sceneId===sceneId).forEach(old=>{
      const idx = project.timeline.clips.indexOf(old);
      if(m.asset){
        const dur = old.timelineEnd - old.timelineStart;
        const asset = m.asset;
        const srcDur = asset.type==='video' && asset.duration>0 ? Math.max(0.5, asset.duration) : dur;
        const r = smartSourceRange(asset, Math.min(dur, srcDur), L.hashStr(sc.id+':r'));
        const clip = ML.timeline.newClip('video', {
          sceneId, assetId: asset.id, sourceStart: r.start, sourceEnd: r.end,
          timelineStart: old.timelineStart, timelineEnd: old.timelineEnd,
          scale: shotScale(sc, style, asset), speed: 1, transition: style.fade>0?style.fade:0
        });
        project.timeline.clips[idx] = clip;
      } else {
        project.timeline.clips.splice(idx, 1);
      }
    });
  }

  async function regenVoice(project, sceneId){
    const sc = project.scenes.find(x=>x.id===sceneId);
    if(!sc) return;
    const oldDur = sc.duration; /* capture BEFORE overwrite — fixes shift bug */
    const seg = await ML.voice.generateSegment(project, sc, {});
    sc.voiceSegmentId = seg.id; sc.duration = seg.duration;
    const old = project.voiceSegments.findIndex(x=>x.sceneId===sceneId);
    if(old>=0) project.voiceSegments[old] = seg; else project.voiceSegments.push(seg);
    /* shift following clips when duration changed */
    const d = sc.duration - oldDur;
    if(Math.abs(d) > 0.001){
      project.timeline.clips.filter(c=>{ const s = project.scenes.find(x=>x.id===c.sceneId); return s && s.order > sc.order; }).forEach(c=>{
        c.timelineStart += d; c.timelineEnd += d;
      });
    }
    /* retime this scene's clips */
    project.timeline.clips.filter(c=>c.sceneId===sceneId).forEach(c=>{
      const dur = seg.duration;
      const start = sceneStartOf(project, sceneId);
      c.timelineStart = start; c.timelineEnd = start + (c.track==='marker'?0.05:dur);
      if(c.track==='video' && c.assetId){
        const asset = project.assets.find(a=>a.id===c.assetId);
        if(asset){
          const r = smartSourceRange(asset, dur, L.hashStr(sc.id+':r'));
          c.sourceStart = r.start; c.sourceEnd = r.end;
          if(!c.transform) c.transform = { scale:1, x:0, y:0, rotation:0 };
          if(!c.transform.scale) c.transform.scale = shotScale(sc, styleOf(project), asset);
        }
      }
    });
    /* rebuild subtitle text/timing for the scene */
    const sub = project.timeline.clips.find(c=>c.track==='subtitle' && c.sceneId===sceneId);
    if(sub){ sub.text = sc.text; sub.lines = ML.subtitle.wrapLines(sc.text); const start = sceneStartOf(project, sceneId); sub.timelineStart = start; sub.timelineEnd = start + seg.duration; }
    project.timeline.duration = ML.timeline.durationOf(project);
  }
  function sceneStartOf(project, sceneId){
    const sc = project.scenes.find(x=>x.id===sceneId);
    if(!sc) return 0;
    let start = 0;
    for(const s of project.scenes){ if(s.id===sceneId) break; start += s.duration; }
    return start;
  }

  return { run, runVoiceover, cancel, job, newJob, regenVisual, regenVoice, sceneStartOf,
    STYLES, styleOf, smartSourceRange, shotScale, qualityCheck };
})();
