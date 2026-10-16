/* ============ VIDEO LAB · export2.js — Markdown / CSV / JSON / PDF 导出与导入 ============ */
ML.export2 = (function(){
  const m = ML.model;

  /* ---------- Markdown ---------- */
  function md(project, opts){
    opts = opts || {};
    const L = [];
    const t = project;
    L.push('# '+t.name); L.push('');
    L.push('> 从创意到镜头，让每一个想法都能被拍出来。'); L.push('');
    L.push('**类型**：'+t.type+'　**比例**：'+t.ratio+'　**目标时长**：'+(t.targetDur||'—')+'s');
    if(t.platform) L.push('**平台**：'+t.platform);
    if(t.style) L.push('**风格**：'+t.style);
    if(t.method) L.push('**制作方式**：'+t.method);
    if(t.topic) L.push('**主题**：'+t.topic);
    if(t.desc) L.push('**简介**：'+t.desc);
    L.push('');

    if(opts.script !== false && (t.scriptText||'').trim()){
      L.push('## 脚本'); L.push('');
      (t.paragraphs.length? t.paragraphs : m.splitParagraphs(t.scriptText)).forEach(p=>{ L.push((p.text||'').trim()); L.push(''); });
    }

    const shots = opts.shots ? t.shots.filter(s=>opts.shots.includes(s.id)) : t.shots;
    L.push('## 分镜方案'); L.push('');
    L.push('| # | 标题 | 景别 | 运镜 | 时长 | 拍摄方式 | 场景 | 状态 |'); L.push('|---|------|------|------|------|----------|------|------|');
    shots.forEach(s=>{
      const esc = x=>String(x||'').replace(/\|/g,'\\|').replace(/\n/g,' ');
      L.push('| '+s.no+' | '+esc(s.title||'—')+' | '+esc(s.shotType||'—')+' | '+esc(s.move||'—')+' | '+(s.dur||'—')+'s | '+esc(s.method||'—')+' | '+esc(s.scene||'—')+' | '+s.state+' |');
    });
    L.push('');

    shots.forEach(s=>{
      L.push('### 镜头 '+s.no+' · '+(s.title||'未命名')); L.push('');
      L.push('- **台词/脚本**：'+(s.text||'—'));
      L.push('- **画面描述**：'+(s.visual||'—'));
      L.push('- **景别**：'+(s.shotType||'—')+'　**运镜**：'+(s.move||'—')+'　**时长**：'+(s.dur||'—')+'s');
      L.push('- **拍摄方式**：'+(s.method||'—'));
      if(s.scene) L.push('- **场景**：'+s.scene);
      if(s.people && s.people.length) L.push('- **人物**：'+s.people.join('、'));
      if(s.props && s.props.length) L.push('- **道具**：'+s.props.join('、'));
      if(s.sound) L.push('- **声音设计**：'+s.sound);
      if(s.aiPrompt) L.push('- **AI 视频提示词**：`'+String(s.aiPrompt).replace(/`/g,'')+'`');
      if(s.note) L.push('- **备注**：'+s.note);
      L.push('');
    });

    if(opts.prod !== false && t.tasks && t.tasks.length){
      L.push('## 拍摄任务'); L.push('');
      L.push('| 任务 | 镜头 | 优先级 | 状态 | 备注 |'); L.push('|------|------|--------|------|------|');
      t.tasks.forEach(x=>{
        const shot = t.shots.find(s=>s.id===x.shotId);
        L.push('| '+String(x.title||'—').replace(/\|/g,'\\|')+' | '+(shot?('#'+shot.no):'—')+' | '+x.prio+' | '+x.state+' | '+String(x.note||'').replace(/\|/g,'\\|')+' |');
      });
      L.push('');
    }
    return L.join('\n');
  }

  /* ---------- CSV (RFC 4180, safe for CJK / commas / quotes / newlines) ---------- */
  function csvField(v){
    v = String(v==null?'':v);
    if(/[",\n\r]/.test(v)) v = '"'+v.replace(/"/g,'""')+'"';
    return v;
  }
  function csv(project, opts){
    opts = opts || {};
    const shots = opts.shots ? project.shots.filter(s=>opts.shots.includes(s.id)) : project.shots;
    const head = ['镜头编号','标题','台词/脚本','画面描述','景别','运镜','时长(s)','拍摄方式','场景','人物','道具','声音设计','AI提示词','状态','备注'];
    const rows = shots.map(s=>[
      s.no, s.title, s.text, s.visual, s.shotType, s.move, s.dur, s.method,
      s.scene, m.joinTags(s.people), m.joinTags(s.props), s.sound, s.aiPrompt, s.state, s.note
    ]);
    const out = [head.map(csvField).join(',')];
    rows.forEach(r=> out.push(r.map(csvField).join(',')));
    // BOM so Excel opens UTF-8 Chinese correctly
    return '\uFEFF'+out.join('\r\n');
  }

  /* ---------- JSON backup + import ---------- */
  async function exportJSON(project, opts){
    opts = opts || {};
    const data = JSON.parse(JSON.stringify(project));   // deep copy; API keys are never stored on project
    delete data.sample;
    if(opts.images){
      data.assets = [];
      const seen = {};
      for(const s of data.shots){
        for(const ref of s.refs||[]){
          if(seen[ref]) continue; seen[ref] = true;
          try{
            const blob = await ML.store.getAssetBlob(ref);
            if(blob) data.assets.push({ id: ref, dataUrl: await blobToDataURL(blob) });
          }catch(e){}
        }
      }
    }
    data.exportedAt = Date.now();
    return JSON.stringify(data, null, 2);
  }
  function blobToDataURL(blob){
    return new Promise((res,rej)=>{
      const fr = new FileReader();
      fr.onload = ()=> res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }
  async function importProject(file){
    const res = { ok:false, errors:[], project:null, warn:[] };
    let text;
    try{ text = await file.text(); }catch(e){ res.errors.push('无法读取文件'); return res; }
    let data;
    try{ data = JSON.parse(text); }catch(e){ res.errors.push('文件不是合法 JSON'); return res; }
    if(!data || typeof data !== 'object'){ res.errors.push('JSON 内容不是对象'); return res; }
    if(data.schemaVersion && data.schemaVersion > ML.model.SCHEMA_VERSION){ res.errors.push('文件版本('+data.schemaVersion+')高于当前应用版本，无法导入'); return res; }
    if(!data.name){ res.errors.push('缺少项目名称'); return res; }
    const p = ML.model.normalize(data);
    if(!p){ res.errors.push('项目数据结构无法识别'); return res; }
    if(!p.id) p.id = ML.model.uid();
    if(Array.isArray(data.assets)){
      let restored = 0;
      for(const a of data.assets){
        try{
          if(a && a.id && typeof a.dataUrl === 'string' && a.dataUrl.startsWith('data:')){
            const blob = await (await fetch(a.dataUrl)).blob();
            await ML.store.saveAssetBlob(a.id, blob);
            restored++;
          }
        }catch(e){}
      }
      res.warn.push('已恢复参考图 '+restored+' 张');
    }
    res.project = p; res.ok = true;
    return res;
  }

  /* ---------- PDF: real PDF via pdf-lib; CJK drawn to canvas pages so Chinese always renders correctly ---------- */
  let pdfLib = null;
  async function ensurePdfLib(){
    if(pdfLib) return pdfLib;
    if(typeof PDFLib !== 'undefined'){ pdfLib = PDFLib; return pdfLib; }
    throw new Error('pdf-lib 未加载，请检查网络后重试');
  }
  function wrapText(ctx, text, maxW){
    const chars = String(text||'').split('');
    const lines = []; let line = '';
    for(const ch of chars){
      if(ch === '\n'){ lines.push(line); line=''; continue; }
      const test = line+ch;
      if(ctx.measureText(test).width > maxW && line){ lines.push(line); line = ch; }
      else line = test;
    }
    if(line) lines.push(line);
    return lines;
  }
  async function exportPDF(project, opts){
    opts = opts || {};
    await ensurePdfLib();
    const W = 841.89, H = 595.28; // A4 landscape
    const dpr = 2;
    const shots = opts.shots ? project.shots.filter(s=>opts.shots.includes(s.id)) : project.shots;
    const doc = await pdfLib.PDFDocument.create();

    const canvas = document.createElement('canvas');
    canvas.width = W*dpr; canvas.height = H*dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr,dpr);

    const C = { bg:'#ffffff', ink:'#1d1a15', sub:'#5c554a', faint:'#8a8272', line:'#e5e0d5', accent:'#e87028', soft:'#fbe9da', accentText:'#b35010' };
    const px = 44, pw = W-88;
    const F = {
      title:'bold 26px "PingFang SC","Noto Sans SC",sans-serif',
      h1:'bold 15px "PingFang SC","Noto Sans SC",sans-serif',
      body:'12px "PingFang SC","Noto Sans SC",sans-serif',
      small:'11px "PingFang SC","Noto Sans SC",sans-serif',
      no:'bold 16px "PingFang SC",sans-serif'
    };
    let y = 0;
    function newPage(extra){
      ctx.fillStyle = C.bg; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = C.accent; ctx.fillRect(0,0,6,H);
      ctx.fillStyle = C.ink; ctx.font = F.title;
      ctx.fillText(project.name || 'VIDEO LAB 分镜方案', px, 52);
      ctx.fillStyle = C.sub; ctx.font = F.small;
      const meta = [project.type, project.ratio, project.targetDur? (project.targetDur+'s 目标'):''].filter(Boolean).join(' · ');
      ctx.fillText('VIDEO LAB · AI 分镜与拍摄工作台　'+meta, px, 74);
      if(extra){ ctx.fillStyle = C.faint; ctx.fillText(extra, px, 92); }
      y = 112;
      ctx.fillStyle = C.faint; ctx.font = F.small;
      ctx.fillText('镜头编号', px, y);
      ctx.fillText('画面描述 / 台词', px+70, y);
      ctx.fillText('景别 / 运镜 / 声音', px+390, y);
      ctx.fillText('时长', px+560, y);
      ctx.fillText('场景 / 人物 / 道具', px+620, y);
      ctx.strokeStyle = C.line; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, y+22); ctx.lineTo(px+pw, y+22); ctx.stroke();
      y += 34;
    }
    function ensure(need){ if(y+need > H-44) newPage(); }

    newPage();
    for(const s of shots){
      const blockH = 112;
      ensure(blockH);
      ctx.fillStyle = C.soft; ctx.fillRect(px, y-8, 54, 36);
      ctx.fillStyle = C.accentText; ctx.font = F.no;
      ctx.fillText('#'+s.no, px+10, y+2);
      ctx.fillStyle = C.ink; ctx.font = F.h1;
      ctx.fillText(String(s.title||'未命名镜头'), px+68, y-4);
      ctx.fillStyle = C.sub; ctx.font = F.small;
      ctx.fillText('台词：'+String(s.text||'—'), px+68, y+18);
      ctx.strokeStyle = C.line;
      ctx.beginPath(); ctx.moveTo(px, y+40); ctx.lineTo(px+pw, y+40); ctx.stroke();
      y += 46;
      const colW = 300;
      const visLines = wrapText(ctx, s.visual, colW-6).slice(0,4);
      const sndLines = wrapText(ctx, s.sound, 150).slice(0,3);
      const prodLines = wrapText(ctx, [s.scene, m.joinTags(s.people), m.joinTags(s.props)].filter(Boolean).join(' / '), 190).slice(0,4);
      ctx.fillStyle = C.ink; ctx.font = F.body;
      visLines.forEach((l,i)=> ctx.fillText(l, px+70, y+16*i));
      ctx.fillStyle = C.ink;
      ctx.fillText(String(s.shotType||'—')+' / '+String(s.move||'—'), px+390, y);
      ctx.fillText(String(s.method||'—'), px+390, y+16);
      ctx.fillStyle = C.sub;
      sndLines.forEach((l,i)=> ctx.fillText(l, px+390, y+34+16*i));
      ctx.fillStyle = C.ink;
      ctx.fillText(String(s.dur||'—')+'s', px+560, y);
      ctx.fillStyle = C.sub;
      prodLines.forEach((l,i)=> ctx.fillText(l, px+620, y+16*i));
      y += 66;
    }
    ctx.fillStyle = C.faint; ctx.font = F.small;
    ctx.fillText('VIDEO LAB · 生成于 '+m.fmtTime(Date.now())+' · 共 '+shots.length+' 个镜头', px, H-26);

    const page = doc.addPage([W,H]);
    const img = await doc.embedJpg(await canvas.toDataURL('image/jpeg', 0.88));
    page.drawImage(img, { x:0, y:0, width:W, height:H });
    const bytes = await doc.save();
    return { blob: new Blob([bytes], { type:'application/pdf' }), bytes };
  }

  /* ---------- download helper ---------- */
  function download(blob, filename){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 4000);
  }

  return { md, csv, exportJSON, importProject, exportPDF, download };
})();
