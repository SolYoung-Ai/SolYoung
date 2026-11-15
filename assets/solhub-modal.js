/* =============================================================
   solhub-modal.js — 全站「项目」介绍弹窗（子页面共享版）
   2026-11-15 · SolYoung

   为什么有这份文件：
   首页 index.html 的侧栏「项目」是内联写死的弹窗，但 blog / now /
   about 等子页面用的是 assets/ios-nav.js 注入的抽屉，那里的「项目」
   还是直接跳到 solhub.solyoung.top —— 于是出现了「只有首页点才有
   弹窗，别的页面一点就跳走」。

   现在把弹窗抽成共享模块：
   - 页面里没有 #shModal 时由本文件注入 DOM；
   - 页面里已有 #shModal（首页内联）时直接接管，不重复注入；
   - 暴露 window.SolHubModal = { open, close, isOpen }；
   - 样式沿用 assets/ios.css 里的 .sh-*，这里不写样式。

   文案走 data-sh-i18n（刻意不用 data-i18n，避免和页面自己的
   全局 i18n 扫描打架），语言以 <html lang> 为准。
   ============================================================= */
(function () {
  'use strict';

  if (window.SolHubModal) return;

  /* ---------- 资源前缀 ----------
     document.currentScript 在动态 append 的脚本里也是可用的；
     万一拿不到，再按 script 标签兜底，最后才降级成 '../assets/'。 */
  function assetBase() {
    var el = document.currentScript;
    if (!el || !el.src) el = document.querySelector('script[src$="solhub-modal.js"]');
    if (el && el.src) return el.src.replace(/solhub-modal\.js(?:\?.*)?$/, '');
    return '../assets/';
  }
  var BASE = assetBase();

  var I18N = {
    'sh-eyebrow': { zh: 'SOLHUB · 数字工具社区', en: 'SOLHUB · DIGITAL TOOL HUB' },
    'sh-title': { zh: '我做的第一个产品：SolHub', en: 'My first product: SolHub' },
    'sh-lead': {
      zh: '一个收产品、也收工具的小站。我自己做的东西都在这儿，其他独立开发者也可以提交作品；不注册就能逛，工具打开即用。',
      en: 'A small hub for products and tools — my own builds live here, and other indie makers can submit theirs. Browse without signing up; tools open and just work.'
    },
    'sh-shot-hint': { zh: '点击进入 ↗', en: 'Open ↗' },
    'sh-f1t': { zh: '发现产品', en: 'Discover products' },
    'sh-f1d': { zh: '人工精选 + 核验优先，不看谁出价高', en: 'Hand-picked and verified first — not ranked by who pays' },
    'sh-f2t': { zh: '免费工具', en: 'Free tools' },
    'sh-f2d': { zh: '在线即用，输入不上传', en: 'Runs in the browser, nothing uploaded' },
    'sh-f3t': { zh: '实时热点', en: 'Live feed' },
    'sh-f3d': { zh: '39 家媒体，15 分钟一轮，标题统一中文', en: '39 outlets, refreshed every 15 min, all in Chinese' },
    'sh-f4t': { zh: 'Skill 库', en: 'Skill library' },
    'sh-f4d': { zh: '精选 Skill 与创作者名录', en: 'Curated skills and a maker directory' },
    'sh-cta': { zh: '进入 SolHub ↗', en: 'Open SolHub ↗' },
    'sh-later': { zh: '先随便逛逛', en: 'Keep browsing' },
    'sh-note': { zh: 'solhub.solyoung.top · 新标签页打开', en: 'solhub.solyoung.top · opens in a new tab' }
  };

  var URL_SOLHUB = 'https://solhub.solyoung.top/';

  function lang() {
    return (document.documentElement.getAttribute('lang') || 'zh').toLowerCase().indexOf('en') === 0 ? 'en' : 'zh';
  }

  function applyLang() {
    var l = lang();
    var nodes = document.querySelectorAll('#shModal [data-sh-i18n], #shScrim [data-sh-i18n]');
    Array.prototype.forEach.call(nodes, function (el) {
      var v = I18N[el.getAttribute('data-sh-i18n')];
      if (v) el.textContent = v[l] || v.zh;
    });
    var modal = document.getElementById('shModal');
    if (modal) modal.setAttribute('aria-label', l === 'en' ? 'About SolHub' : 'SolHub 介绍');
  }

  function template() {
    return '' +
      '<div class="sh-head">' +
        '<span class="sh-eyebrow" data-sh-i18n="sh-eyebrow">SOLHUB · 数字工具社区</span>' +
        '<button class="dr-close" id="shClose" type="button" aria-label="关闭">' +
          '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.2 2.2 9.8 9.8M9.8 2.2 2.2 9.8"/></svg>' +
        '</button>' +
      '</div>' +
      '<h2 class="sh-title" id="shTitle" data-sh-i18n="sh-title">我做的第一个产品：SolHub</h2>' +
      '<p class="sh-lead" data-sh-i18n="sh-lead">一个收产品、也收工具的小站。我自己做的东西都在这儿，其他独立开发者也可以提交作品；不注册就能逛，工具打开即用。</p>' +
      '<a class="sh-shot" href="' + URL_SOLHUB + '" target="_blank" rel="noopener" aria-label="打开 SolHub">' +
        '<img src="' + BASE + 'project-solhub.jpg" alt="SolHub 首页截图" width="1920" height="1140" loading="lazy" decoding="async">' +
        '<span class="sh-shot-hint" data-sh-i18n="sh-shot-hint">点击进入 ↗</span>' +
      '</a>' +
      '<ul class="sh-feats">' +
        '<li><b data-sh-i18n="sh-f1t">发现产品</b><span data-sh-i18n="sh-f1d">人工精选 + 核验优先，不看谁出价高</span></li>' +
        '<li><b data-sh-i18n="sh-f2t">免费工具</b><span data-sh-i18n="sh-f2d">在线即用，输入不上传</span></li>' +
        '<li><b data-sh-i18n="sh-f3t">实时热点</b><span data-sh-i18n="sh-f3d">39 家媒体，15 分钟一轮，标题统一中文</span></li>' +
        '<li><b data-sh-i18n="sh-f4t">Skill 库</b><span data-sh-i18n="sh-f4d">精选 Skill 与创作者名录</span></li>' +
      '</ul>' +
      '<div class="sh-actions">' +
        '<a class="sh-cta" href="' + URL_SOLHUB + '" target="_blank" rel="noopener" data-sh-i18n="sh-cta">进入 SolHub ↗</a>' +
        '<button class="sh-later" type="button" id="shLater" data-sh-i18n="sh-later">先随便逛逛</button>' +
      '</div>' +
      '<p class="sh-note" data-sh-i18n="sh-note">solhub.solyoung.top · 新标签页打开</p>';
  }

  var scrim, modal, closeBtn, laterBtn, lastFocus = null, isOpen = false;

  function closeDrawerIfOpen() {
    if (typeof window.__closeDrawer === 'function') { window.__closeDrawer(); return; }
    var panel = document.getElementById('drPanel');
    var drScrim = document.getElementById('drScrim');
    if (panel) panel.classList.remove('open');
    if (drScrim) drScrim.classList.remove('open');
    if (panel) panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('dr-open');
  }

  function open() {
    if (!modal || isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    closeDrawerIfOpen();
    window.setTimeout(function () {
      if (!isOpen) return;
      modal.classList.add('open');
      if (scrim) scrim.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      var trigger = document.getElementById('drGoWorks') || document.getElementById('drWorks');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('sh-open');
      if (closeBtn) { try { closeBtn.focus({ preventScroll: true }); } catch (e) { closeBtn.focus(); } }
    }, document.body.classList.contains('dr-open') ? 220 : 0);
  }

  function close() {
    if (!modal || !isOpen) return;
    isOpen = false;
    modal.classList.remove('open');
    if (scrim) scrim.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    var trigger = document.getElementById('drGoWorks') || document.getElementById('drWorks');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sh-open');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
    lastFocus = null;
  }

  function bindTrigger() {
    var btn = document.getElementById('drGoWorks');
    if (!btn || btn.hasAttribute('data-sh-bound')) return;
    btn.setAttribute('data-sh-bound', '1');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-controls', 'shModal');
    btn.addEventListener('click', function (e) { e.preventDefault(); open(); });
  }

  function boot() {
    /* 首页已有内联弹窗：只接管，不重建 */
    modal = document.getElementById('shModal');
    if (!modal) {
      scrim = document.createElement('div');
      scrim.className = 'sh-scrim';
      scrim.id = 'shScrim';
      scrim.setAttribute('aria-hidden', 'true');

      modal = document.createElement('div');
      modal.className = 'sh-modal';
      modal.id = 'shModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'shTitle');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = template();

      document.body.appendChild(scrim);
      document.body.appendChild(modal);
    } else {
      scrim = document.getElementById('shScrim');
    }

    closeBtn = document.getElementById('shClose');
    laterBtn = document.getElementById('shLater');

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (laterBtn) laterBtn.addEventListener('click', close);
    if (scrim) scrim.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(); }
    }, true);

    bindTrigger();

    /* 子页面没有「项目」按钮时（比如文章详情页），也给个兜底：
       只要页面上出现 #drGoWorks（抽屉晚于本脚本创建）就补绑。 */
    if (!document.getElementById('drGoWorks') && window.MutationObserver) {
      var mo = new MutationObserver(function () {
        if (document.getElementById('drGoWorks')) { bindTrigger(); mo.disconnect(); }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    applyLang();
    if (window.MutationObserver) {
      new MutationObserver(applyLang).observe(document.documentElement, {
        attributes: true, attributeFilter: ['lang']
      });
    }

    window.SolHubModal = { open: open, close: close, isOpen: function () { return isOpen; } };

    /* ios-nav.js 在模块还没下载完时点过「项目」：补一次打开 */
    if (window.__solhubPendingOpen) {
      window.__solhubPendingOpen = false;
      open();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
