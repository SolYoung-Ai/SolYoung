/* ============ VIDEO LAB · aiassist.js — AI 创作助手（分镜生成 + 提示词工具） ============ */
ML.aiassist = (function(){
  const P = () => ML.providers;
  const m = () => ML.model;

  function isConfigured(){ return P().hasAI(); }
  function configInfo(){
    const c = P().config();
    if(!c || !c.ai || c.ai.provider==='none' || !c.ai.baseUrl) return null;
    return { provider: c.ai.provider, model: c.ai.model, baseUrl: c.ai.baseUrl };
  }
  function cfg(){ const c = P().config(); return c && c.ai; }

  /* ---- safe AI call wrapper ---- */
  async function callAI(system, user){
    const c = cfg();
    if(!c || c.provider==='none' || !c.baseUrl || !c.key) {
      const e = new Error('尚未配置 AI API');
      e.vlabCode = 'not_configured';
      throw e;
    }
    try{
      const out = await P().chatJSON(c.baseUrl, c.key, c.model, system, user);
      return out;
    }catch(err){
      const cls = (err && (err.vlabClass || err.class)) ? err : P().classifyError(err, err && err.httpStatus);
      err.vlabCode = cls.code; err.vlabMessage = cls.message;
      throw err;
    }
  }

  /* ============ 1. 分镜生成（结构化 JSON + 校验） ============ */
  const SHOT_JSON_SPEC = [
    'title 镜头标题', 'text 对应脚本/台词', 'visual 画面描述', 'shotType 景别',
    'move 运镜方式', 'dur 时长（秒，数字）', 'method 拍摄方式', 'scene 场景',
    'people 人物（字符串数组）', 'props 道具（字符串数组）', 'sound 声音设计', 'aiPrompt AI视频提示词', 'note 备注'
  ].join('；');

  function buildSystemPrompt(project, mode){
    const typeName = (m().PROJECT_TYPES.find(t=>t.id===project.type)||{}).label || project.type;
    return [
      '你是资深影视分镜师与视频导演。你的任务是根据用户提供的项目信息与脚本，生成专业、可执行的分镜方案。',
      '必须只输出一个 JSON 对象，不要输出任何其他文字、解释或 Markdown 代码块。',
      'JSON 结构：{"shots":[{ "' + SHOT_JSON_SPEC + ' }]}',
      '镜头数量：根据脚本语义段落划分，一般每段 1-2 个镜头，总时长接近目标时长（项目目标时长 '+ (project.targetDur||60) +' 秒，画面比例 '+ (project.ratio||'9:16') +'）。',
      '要求：每句台词对应完整镜头；镜头之间有景别与运镜变化；时长用秒为单位，3-10 秒为佳；景别从【大远景、远景、全景、中景、中近景、近景、特写、大特写】中选择；运镜从【固定镜头、缓慢推进、缓慢拉远、横向摇摄、纵向摇摄、跟随拍摄、环绕拍摄、手持拍摄、俯拍、仰拍、升降镜头、变焦】中选择；拍摄方式从【真人实拍、AI 视频生成、图片转视频、现有素材、屏幕录制、动画或动态图形、后期制作】中选择。',
      '画面描述要具体可拍：主体、动作、环境、光线、构图。aiPrompt 用英文撰写，可直接用于主流 AI 视频生成模型。',
      '项目信息：类型='+typeName+'，主题='+(project.topic||'—')+'，风格='+(project.style||'—')+'，平台='+(project.platform||'—')+'。'
    ].join('\n');
  }

  async function generateStoryboard(project){
    const paras = project.paragraphs && project.paragraphs.length
      ? project.paragraphs.map((p,i)=>'【段落'+(i+1)+'】'+(p.text||'')).join('\n')
      : (project.scriptText || '（无脚本，请根据项目主题自由规划镜头）');
    const user = '项目主题：'+(project.topic||'—')+'\n目标时长：'+(project.targetDur||60)+' 秒\n画面比例：'+(project.ratio||'9:16')+'\n\n脚本内容：\n'+paras;
    const out = await callAI(buildSystemPrompt(project), user);
    let list = null;
    if(Array.isArray(out)) list = out;
    else if(out && Array.isArray(out.shots)) list = out.shots;
    else {
      const e = new Error('AI 返回内容无法解析为分镜列表');
      e.vlabCode = 'bad_format';
      throw e;
    }
    const r = m().validateShots(list);
    if(!r.ok){
      const e = new Error(r.errors.join('\n'));
      e.vlabCode = 'bad_format';
      throw e;
    }
    return r.shots;
  }

  /* ---- 单镜头画面描述优化 ---- */
  async function improveVisual(shot){
    const sys = '你是资深导演，请优化下面镜头（shotType='+(shot.shotType||'')+'，move='+(shot.move||'')+'）的画面描述，使其更具体、可拍、有画面感。只输出优化后的画面描述文字，不要解释。';
    const out = await callAI(sys, '镜头标题：'+(shot.title||'')+'\n当前画面描述：'+(shot.visual||'（空）')+'\n场景：'+(shot.scene||'')+' 人物：'+(shot.people||[]).join('、')+' 道具：'+(shot.props||[]).join('、'));
    return typeof out === 'string' ? out.trim() : String(out);
  }

  /* ---- 遗漏画面检查 ---- */
  async function gapCheck(project){
    const sys = '你是视频导演，检查以下分镜方案是否遗漏了必要画面（如缺少开场、转场、空镜、结尾等）。列出最多 4 条建议，每条一行，格式：【建议1】描述。只输出建议，不要输出其他内容。';
    const list = project.shots.map(s=>'镜头'+s.no+'('+(s.title||'')+')：'+(s.visual||'')+(s.scene?(' @'+s.scene):'')).join('\n');
    const out = await callAI(sys, '项目类型：'+(project.type||'')+' 主题：'+(project.topic||'')+'\n分镜方案：\n'+list);
    return typeof out === 'string' ? out : JSON.stringify(out);
  }

  /* ============ 2. AI 视频提示词工具（基于镜头字段，非固定模板） ============ */
  function buildShotPrompt(shot, lang){
    lang = lang || 'zh';
    const p = shot;
    const parts = [];
    if(lang === 'zh'){
      parts.push('主体：'+(p.people&&p.people.length ? p.people.join('、') : (p.title||'主体')));
      parts.push('动作/内容：'+(p.visual||p.text||''));
      parts.push('场景：'+(p.scene||'未指定'));
      if(p.props && p.props.length) parts.push('道具：'+p.props.join('、'));
      parts.push('景别：'+(p.shotType||'中景'));
      parts.push('运镜：'+(p.move||'固定镜头'));
      parts.push('光线：自然光与场景氛围光，暖色调为主');
      parts.push('色彩：与项目风格一致，低饱和电影感');
      parts.push('构图：主体居中偏三分线，留出安全区域');
      parts.push('时间/天气：按剧情需要设定');
      parts.push('连续性：与前后镜头保持主体、服装、光线一致');
      if(p.sound) parts.push('声音设计：'+p.sound);
      parts.push('负面约束：避免画面抖动、人物变形、文字乱码、多余物体入镜');
      return parts.join('\n');
    }
    // English
    const subj = p.people && p.people.length ? p.people.join(', ') : (p.title || 'subject');
    const lines = [
      'Subject: '+subj,
      'Action/Content: '+(p.visual || p.text || ''),
      'Setting: '+(p.scene || 'unspecified'),
      p.props && p.props.length ? ('Props: '+p.props.join(', ')) : null,
      'Shot size: '+(p.shotType || 'medium shot'),
      'Camera movement: '+(p.move || 'static'),
      'Lighting: natural key light with warm ambient tones',
      'Color: filmic, low-saturation, consistent with the project style',
      'Composition: subject on rule-of-thirds, safe margins for captions',
      'Time/weather: as required by the narrative',
      'Continuity: keep subject, wardrobe and lighting consistent with adjacent shots',
      p.sound ? ('Sound design: '+p.sound) : null,
      'Negative prompt: no camera shake, no deformed anatomy, no garbled text, no stray objects'
    ].filter(Boolean);
    return lines.join('\n');
  }

  /* ---- 风格建议（本地规则，不依赖 AI） ---- */
  function suggestStyle(project){
    const type = project.type;
    const map = {
      vlog: { style:'现代知识口播', tip:'暖色家居布光，中近景为主，字幕强调关键词' },
      drama: { style:'电影感叙事', tip:'多景别切换，情绪镜头用特写与慢推' },
      product: { style:'商业产品展示', tip:'高对比硬光，特写强调质感，节奏明快' },
      brand: { style:'品牌宣传大片', tip:'大远景开场，升格镜头，色调统一' },
      vloglife: { style:'轻量生活方式', tip:'自然光，手持感，场景切换丰富' },
      edu: { style:'高信息密度讲解', tip:'屏幕共享与讲师画面穿插，字幕层级清晰' },
      aigen: { style:'AI 生成式视觉', tip:'提示词统一风格前缀，保证帧间一致' },
      mixed: { style:'混合制作', tip:'实拍与 AI 镜头穿插，用色彩统一两者' }
    };
    return map[type] || { style: project.style || '克制纪实', tip:'按项目主题确定基调，先定色彩与光线' };
  }

  return {
    isConfigured, configInfo, generateStoryboard, improveVisual, gapCheck,
    buildShotPrompt, suggestStyle
  };
})();
