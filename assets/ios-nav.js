/* =============================================================
   ios-nav.js — 全站导航外壳（汉堡 / 侧栏抽屉 / 联系弹窗 / 关于我）
   2026-11-10 · SolYoung
   页面里已有 #drPanel（首页是内联写死的）时直接跳过，不重复注入。
   ============================================================= */
(function(){
  'use strict';

  if(document.getElementById('drPanel')){ return; }

  /* ---------- 相对路径前缀 ----------
     '/works/index.html' 的斜杠数是 2，但只需要一层 '../'；
     Array(n).join('../') 只会重复 n-1 次，所以这里用 depth 而不是 depth-1。 */
  var path = location.pathname;
  var depth = (path.match(/\//g) || []).length;
  var P = new Array(Math.max(0, depth)).join('../');
  var HOME = P || './';

  var L = (document.documentElement.getAttribute('lang') || 'zh').indexOf('en') === 0 ? 'en' : 'zh';

  /* ---------- 社交图标（彩色，任何时候都不会缩成 0） ---------- */
  var ICON = {
    wx: '<img src="' + P + 'assets/wechat-icon.webp" width="14" height="14" alt="" decoding="async">',
    dy: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect width="24" height="24" rx="6.5" fill="#0B0B0B"/><path transform="translate(3.4 3.2) scale(.72)" fill="#fff" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
    xhs: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="1" y="1" width="22" height="22" rx="6" fill="#FF2442"/><text x="12" y="15.8" text-anchor="middle" font-family="PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif" font-weight="700" font-size="6.5" letter-spacing="-0.4" fill="#FFFFFF">小红书</text></svg>',
    x: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect width="24" height="24" rx="6.5" fill="#0B0B0B"/><path transform="translate(3.6 3.6) scale(.7)" fill="#fff" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    yt: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="1.2" y="4.6" width="21.6" height="14.8" rx="4.4" fill="#FF0000"/><path d="M10.2 8.6 15.9 12l-5.7 3.4z" fill="#fff"/></svg>',
    gh: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
  };


  var ITEMS = [
    { id:'drGoHome',    href:HOME,       zh:'首页',   en:'Home',     icon:'<path d="M3.2 8.7 10 3.1l6.8 5.6v7.6a1.1 1.1 0 0 1-1.1 1.1H4.3a1.1 1.1 0 0 1-1.1-1.1z"/><path d="M8.1 17.4v-4.7h3.8v4.7"/>' },
    { id:'drGoWorks',   href:'https://solhub.solyoung.top/', ext:true, zh:'项目', en:'Projects', icon:'<rect x="2.6" y="2.6" width="6.2" height="6.2" rx="1.8"/><rect x="11.2" y="2.6" width="6.2" height="6.2" rx="1.8"/><rect x="2.6" y="11.2" width="6.2" height="6.2" rx="1.8"/><rect x="11.2" y="11.2" width="6.2" height="6.2" rx="1.8"/>' },
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
    var attrs = it.href
      ? ' href="' + it.href + '"' + (it.ext ? ' target="_blank" rel="noopener"' : '')
      : ' type="button" aria-haspopup="dialog"';
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
    '<nav class="dr-list">' + listHTML + '</nav>';

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
      '<a href="https://v.douyin.com/NT7pNjGp9XM/" target="_blank" rel="noopener">' + ICON.dy + (L === 'en' ? 'Douyin' : '抖音') + '</a>' +
      '<a href="https://xhslink.cn/o/3jCpgD8H8EL" target="_blank" rel="noopener">' + ICON.xhs + (L === 'en' ? 'RED' : '小红书') + '</a>' +
      '<button type="button" id="ctWx" aria-label="微信 / WeChat">' + ICON.wx + '<span class="ct-wx-t">' + (L === 'en' ? 'WeChat' : '微信') + '</span></button>' +
      '<a href="https://x.com/solyounga?s=11" target="_blank" rel="noopener">' + ICON.x + 'X</a>' +
      '<a href="https://github.com/SolYoung-Ai" target="_blank" rel="noopener">' + ICON.gh + 'GitHub</a>' +
    '</div>';

  document.body.appendChild(ctScrim);
  document.body.appendChild(ct);

  /* ---------- 微信二维码弹层（两个码：兴趣交流 / 商务合作） ---------- */
  var qr = document.createElement('div');
  qr.className = 'qr-overlay';
  qr.id = 'qrOverlay';
  qr.innerHTML =
    '<div class="qr-card">' +
      '<button class="qr-close" id="qrClose" type="button" aria-label="关闭">&times;</button>' +
      '<div class="qr-tabs">' +
        '<button type="button" class="qr-tab active" data-tab="learn">' + (L === 'en' ? 'Say hi' : '兴趣交流') + '</button>' +
        '<button type="button" class="qr-tab" data-tab="biz">' + (L === 'en' ? 'Business' : '商务合作') + '</button>' +
      '</div>' +
      '<div class="qr-pane active" id="qrLearn">' +
        '<img loading="lazy" src="' + P + 'assets/wechat-learn.webp" alt="WeChat QR">' +
        '<div class="qr-t">' + (L === 'en' ? 'Say hi' : '兴趣交流') + '</div>' +
        '<div class="qr-s">' + (L === 'en' ? 'Talk craft, share ideas' : '技术分享，探索创作') + '</div>' +
      '</div>' +
      '<div class="qr-pane" id="qrBiz">' +
        '<img loading="lazy" src="' + P + 'assets/wechat-biz.webp" alt="WeChat QR">' +
        '<div class="qr-t">' + (L === 'en' ? 'Business' : '商务合作') + '</div>' +
        '<div class="qr-s">' + (L === 'en' ? 'Projects &amp; brands' : '项目合作、品牌沟通') + '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(qr);

  var qrBtn = document.getElementById('ctWx');
  if(qrBtn){
    qrBtn.addEventListener('click', function(e){ e.preventDefault(); openQr(); });
  }
  document.getElementById('qrClose').addEventListener('click', closeQr);
  qr.addEventListener('click', function(e){ if(e.target === qr){ closeQr(); } });
  Array.prototype.forEach.call(qr.querySelectorAll('.qr-tab'), function(t){
    t.addEventListener('click', function(){
      Array.prototype.forEach.call(qr.querySelectorAll('.qr-tab'), function(x){ x.classList.remove('active'); });
      t.classList.add('active');
      Array.prototype.forEach.call(qr.querySelectorAll('.qr-pane'), function(pn){ pn.classList.remove('active'); });
      var pane = document.getElementById(t.getAttribute('data-tab') === 'learn' ? 'qrLearn' : 'qrBiz');
      if(pane) pane.classList.add('active');
    });
  });

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

  var qrOpen = false;
  function openQr(){
    if(qrOpen) return;
    qrOpen = true;
    qr.classList.add('open');
    document.body.style.overflow = 'hidden'; try{ document.body.classList.add('qr-open'); }catch(e){}
  }
  function closeQr(){
    if(!qrOpen) return;
    qrOpen = false;
    qr.classList.remove('open');
    document.body.style.overflow = document.body.classList.contains('dr-open') ? 'hidden' : '';
    try{ document.body.classList.remove('qr-open'); }catch(e){}
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
    if(qrOpen){ e.preventDefault(); closeQr(); return; }
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
    var wt = ct.querySelector('.ct-wx-t');
    if(wt) wt.textContent = en ? 'WeChat' : '微信';
    var tabs = qr.querySelectorAll('.qr-tab');
    if(tabs[0]) tabs[0].textContent = en ? 'Say hi' : '兴趣交流';
    if(tabs[1]) tabs[1].textContent = en ? 'Business' : '商务合作';
    var lt = qr.querySelector('#qrLearn .qr-t'), ls = qr.querySelector('#qrLearn .qr-s');
    var bt = qr.querySelector('#qrBiz .qr-t'), bs = qr.querySelector('#qrBiz .qr-s');
    if(lt) lt.textContent = en ? 'Say hi' : '兴趣交流';
    if(ls) ls.textContent = en ? 'Talk craft, share ideas' : '技术分享，探索创作';
    if(bt) bt.textContent = en ? 'Business' : '商务合作';
    if(bs) bs.textContent = en ? 'Projects & brands' : '项目合作、品牌沟通';
  });
  obs.observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });

  window.__closeDrawer = closeDr;
  window.__openDrawer = openDr;
})();
