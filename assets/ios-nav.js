/* =============================================================
   ios-nav.js — 全站导航外壳（汉堡 / 侧栏抽屉 / 联系弹窗 / 关于我）
   2026-11-10 · SolYoung
   页面里已有 #drPanel（首页是内联写死的）时直接跳过，不重复注入。
   ============================================================= */
(function(){
  'use strict';

  if(document.getElementById('drPanel')){ return; }

  /* ---------- 相对路径前缀 ---------- */
  var path = location.pathname;
  var depth = (path.match(/\//g) || []).length;
  var P = new Array(Math.max(0, depth - 1)).join('../');
  var HOME = P || './';

  var L = (document.documentElement.getAttribute('lang') || 'zh').indexOf('en') === 0 ? 'en' : 'zh';

  var ITEMS = [
    { id:'drGoWorks',   href:P+'works/', zh:'项目',   en:'Projects', icon:'<rect x="2.6" y="2.6" width="6.2" height="6.2" rx="1.8"/><rect x="11.2" y="2.6" width="6.2" height="6.2" rx="1.8"/><rect x="2.6" y="11.2" width="6.2" height="6.2" rx="1.8"/><rect x="11.2" y="11.2" width="6.2" height="6.2" rx="1.8"/>' },
    { id:'drGoNow',     href:P+'now/',   zh:'构建',   en:'Build',    icon:'<path d="M11.4 2.6 4.8 11h4.2l-1.4 6.4L15.2 9H11z"/>' },
    { id:'drGoBlog',    href:P+'blog/',  zh:'博客',   en:'Blog',     icon:'<path d="M4.4 2.8h8.1l3.2 3.2v11.2H4.4z"/><path d="M12.2 2.9v3.4h3.4M7.2 10.4h5.6M7.2 13.6h3.8"/>' },
    { id:'drAbout',     href:'',         zh:'关于我', en:'About',    icon:'<circle cx="10" cy="6.9" r="3.3"/><path d="M3.9 17.1c.6-3.3 3.1-5.3 6.1-5.3s5.5 2 6.1 5.3"/>' },
    { id:'drContact',   href:'',         zh:'联系',   en:'Contact',  icon:'<rect x="2.6" y="4.4" width="14.8" height="11.2" rx="2.6"/><path d="m3.4 6 6.6 4.6L16.6 6"/>' }
  ];

  /* ---------- 汉堡：塞到各页顶栏最左边 ---------- */
  var bar = document.querySelector('.nav-inner') || document.querySelector('.nav-in') ||
            document.querySelector('.hd-in') || document.querySelector('.top-in');

  var burger = document.getElementById('burger');
  if(!burger){
    burger = document.createElement('button');
    burger.className = 'burger';
    burger.id = 'burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', '菜单 / Menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    if(bar){ bar.insertBefore(burger, bar.firstChild); }
    else{
      burger.style.position = 'fixed';
      burger.style.top = '14px';
      burger.style.left = '16px';
      burger.style.zIndex = '950';
      document.body.appendChild(burger);
    }
  }else if(bar && burger.parentNode !== bar){
    bar.insertBefore(burger, bar.firstChild);
  }

  /* ---------- 抽屉 ---------- */
  var scrim = document.createElement('div');
  scrim.className = 'dr-scrim';
  scrim.id = 'drScrim';

  var panel = document.createElement('aside');
  panel.className = 'dr-panel';
  panel.id = 'drPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', '导航菜单');
  panel.setAttribute('aria-hidden', 'true');

  var listHTML = ITEMS.map(function(it){
    var tag = it.href ? 'a' : 'button';
    var attrs = it.href ? ' href="' + it.href + '"' : ' type="button" aria-haspopup="dialog"';
    return '<' + tag + ' class="dr-item" id="' + it.id + '"' + attrs + '>' +
      '<span class="dr-ico"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + it.icon + '</svg></span>' +
      '<span class="dr-txt"><span class="dr-cn">' + (L === 'en' ? it.en : it.zh) + '</span><span class="dr-en">' + it.en + '</span></span>' +
      '<span class="dr-arr">&#8250;</span>' +
      '</' + tag + '>';
  }).join('');

  panel.innerHTML =
    '<div class="dr-head">' +
      '<a class="dr-brand" href="' + HOME + '">Sol<i>.</i>Young</a>' +
      '<button class="dr-close" id="drClose" type="button" aria-label="关闭">' +
        '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.2 2.2 9.8 9.8M9.8 2.2 2.2 9.8"/></svg>' +
      '</button>' +
    '</div>' +
    '<nav class="dr-list">' + listHTML + '</nav>' +
    '<div class="dr-foot"><span class="dr-note">PLAYER 1 · 2026</span><span class="dr-note" style="color:var(--accent)">ONLINE</span></div>';

  document.body.appendChild(scrim);
  document.body.appendChild(panel);

  /* ---------- 联系弹窗 ---------- */
  var ctScrim = document.createElement('div');
  ctScrim.className = 'ct-scrim';
  ctScrim.id = 'ctScrim';

  var ct = document.createElement('div');
  ct.className = 'ct-modal';
  ct.id = 'ctModal';
  ct.setAttribute('role', 'dialog');
  ct.setAttribute('aria-modal', 'true');
  ct.setAttribute('aria-label', '联系');
  ct.setAttribute('aria-hidden', 'true');
  ct.innerHTML =
    '<div class="ct-head">' +
      '<span class="ct-eyebrow">' + (L === 'en' ? 'Contact' : '联系') + '</span>' +
      '<button class="dr-close" id="ctClose" type="button" aria-label="关闭">' +
        '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.2 2.2 9.8 9.8M9.8 2.2 2.2 9.8"/></svg>' +
      '</button>' +
    '</div>' +
    '<a class="ct-mail" href="mailto:soyoang@outlook.com">soyoang@outlook.com</a>' +
    '<p class="ct-sub">' + (L === 'en' ? 'Got an idea? A project to build together? Or just want to say hi.' : '有一个想法？想合作一个项目？或者只是打个招呼——都可以。') + '</p>' +
    '<div class="ct-socials">' +
      '<a href="https://v.douyin.com/NT7pNjGp9XM/" target="_blank" rel="noopener">' + (L === 'en' ? 'Douyin' : '抖音') + '</a>' +
      '<a href="https://xhslink.cn/o/3jCpgD8H8EL" target="_blank" rel="noopener">' + (L === 'en' ? 'RED' : '小红书') + '</a>' +
      '<a href="https://x.com/solyounga?s=11" target="_blank" rel="noopener">X</a>' +
      '<a href="https://www.youtube.com/@SolYoungA" target="_blank" rel="noopener">YouTube</a>' +
      '<a href="https://github.com/SolYoung-Ai" target="_blank" rel="noopener">GitHub</a>' +
    '</div>';

  document.body.appendChild(ctScrim);
  document.body.appendChild(ct);

  /* ---------- 关于我（首页有内联抽屉则跳过） ---------- */
  var hasAbout = !!document.getElementById('abPanel');

  if(!hasAbout){
    var abScrim = document.createElement('div');
    abScrim.className = 'ab-scrim';
    abScrim.id = 'abScrim';

    var ab = document.createElement('aside');
    ab.className = 'ab-panel';
    ab.id = 'abPanel';
    ab.setAttribute('role', 'dialog');
    ab.setAttribute('aria-modal', 'true');
    ab.setAttribute('aria-label', '关于我');
    ab.setAttribute('aria-hidden', 'true');
    ab.innerHTML =
      '<div class="ab-tools">' +
        '<button class="ab-tool" id="abCloseX" type="button" aria-label="关闭">' +
          '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.2 2.2 9.8 9.8M9.8 2.2 2.2 9.8"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="ab-scroll">' +
        '<div class="ab-eyebrow">About / 关于我</div>' +
        '<div class="ab-body">' +
          '<p>我是 SolYoung（宋杨），一位内容创作者，同时也是摄影师和剪辑师。这些年我一直在内容、摄影、视频、AI 和各种新的创作方式之间来回试探——不是想成为某个领域的专家，而是享受「把一件事亲手做成」的过程。</p>' +
          '<p>现在，我正在搭建属于自己的数字世界。这里有我的自媒体项目、AI 数字项目，以及关于我创造的一切。它们不一定都通向同一个目标，但共同组成了我正在经历的过程。</p>' +
          '<p>我想把人生，当成一场游戏来经营。不断探索新的领域，收集经验，解锁新的可能，也允许自己随时调整方向。这里记录的不只是我完成了什么，也包括我正在尝试什么。</p>' +
          '<p>欢迎来到我的世界。</p>' +
        '</div>' +
        '<div class="ab-contact">' +
          '<a class="ab-mail" href="mailto:soyoang@outlook.com">soyoang@outlook.com</a>' +
          '<p class="ab-sub">有一个想法？想合作一个项目？或者只是打个招呼——都可以。</p>' +
          '<div class="ab-socials">' +
            '<a href="https://v.douyin.com/NT7pNjGp9XM/" target="_blank" rel="noopener">抖音</a>' +
            '<a href="https://xhslink.cn/o/3jCpgD8H8EL" target="_blank" rel="noopener">小红书</a>' +
            '<a href="https://x.com/solyounga?s=11" target="_blank" rel="noopener">X</a>' +
            '<a href="https://www.youtube.com/@SolYoungA" target="_blank" rel="noopener">YouTube</a>' +
            '<a href="https://github.com/SolYoung-Ai" target="_blank" rel="noopener">GitHub</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(abScrim);
    document.body.appendChild(ab);
  }

  /* ---------- 交互 ---------- */
  var drOpen = false, ctOpen = false, abOpen = false, lastFocus = null;

  function openDr(){
    if(drOpen) return;
    drOpen = true; lastFocus = document.activeElement;
    panel.classList.add('open'); scrim.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('dr-open');
  }
  function closeDr(){
    if(!drOpen) return;
    drOpen = false;
    panel.classList.remove('open'); scrim.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('dr-open');
    if(lastFocus && lastFocus.focus){ try{ lastFocus.focus({preventScroll:true}); }catch(e){} }
  }

  function openCt(){
    if(ctOpen) return;
    ctOpen = true;
    ct.classList.add('open'); ctScrim.classList.add('open');
    ct.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ct-open');
  }
  function closeCt(){
    if(!ctOpen) return;
    ctOpen = false;
    ct.classList.remove('open'); ctScrim.classList.remove('open');
    ct.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ct-open');
  }

  function openAb(){
    var scrimEl = document.getElementById('abScrim');
    var panelEl = document.getElementById('abPanel');
    if(!scrimEl || !panelEl) return;
    if(abOpen) return;
    abOpen = true;
    panelEl.style.transition = '';
    panelEl.classList.add('open');
    scrimEl.classList.add('open');
    panelEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ab-open');
  }
  function closeAb(){
    var scrimEl = document.getElementById('abScrim');
    var panelEl = document.getElementById('abPanel');
    if(!abOpen) return;
    abOpen = false;
    if(panelEl) panelEl.classList.remove('open');
    if(scrimEl) scrimEl.classList.remove('open');
    if(panelEl) panelEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ab-open');
  }

  burger.addEventListener('click', function(e){
    e.preventDefault();
    if(drOpen){ closeDr(); } else { openDr(); }
  });
  scrim.addEventListener('click', closeDr);
  document.getElementById('drClose').addEventListener('click', closeDr);

  Array.prototype.forEach.call(panel.querySelectorAll('a.dr-item'), function(a){
    a.addEventListener('click', function(){ closeDr(); });
  });

  var btnAbout = document.getElementById('drAbout');
  if(btnAbout){
    btnAbout.addEventListener('click', function(e){
      e.preventDefault();
      closeDr();
      window.setTimeout(function(){
        if(typeof window.__openAbout === 'function'){ window.__openAbout(); }
        else{ openAb(); }
      }, 260);
    });
  }

  var btnContact = document.getElementById('drContact');
  if(btnContact){
    btnContact.addEventListener('click', function(e){
      e.preventDefault();
      closeDr();
      window.setTimeout(openCt, 260);
    });
  }

  document.getElementById('ctClose').addEventListener('click', closeCt);
  ctScrim.addEventListener('click', closeCt);
  if(!hasAbout){
    document.getElementById('abCloseX').addEventListener('click', closeAb);
    document.getElementById('abScrim').addEventListener('click', closeAb);
  }

  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(ctOpen){ e.preventDefault(); closeCt(); return; }
    if(abOpen){ e.preventDefault(); closeAb(); return; }
    if(drOpen){ e.preventDefault(); closeDr(); }
  }, true);

  /* 语言切换后重排抽屉文案 */
  var obs = new MutationObserver(function(){
    var en = (document.documentElement.getAttribute('lang') || '').indexOf('en') === 0;
    Array.prototype.forEach.call(panel.querySelectorAll('.dr-item'), function(el, i){
      var it = ITEMS[i];
      if(!it) return;
      var cn = el.querySelector('.dr-cn');
      if(cn) cn.textContent = en ? it.en : it.zh;
    });
    var eye = ct.querySelector('.ct-eyebrow');
    if(eye) eye.textContent = en ? 'Contact' : '联系';
    var sub = ct.querySelector('.ct-sub');
    if(sub) sub.textContent = en ? 'Got an idea? A project to build together? Or just want to say hi.' : '有一个想法？想合作一个项目？或者只是打个招呼——都可以。';
  });
  obs.observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });

  window.__closeDrawer = closeDr;
  window.__openDrawer = openDr;
})();
