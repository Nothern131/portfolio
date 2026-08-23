/**
 * 天机阁 v5 — 玄鉴设计系统
 * 星空 · 星云 · 星座连线 · 脉冲枢纽 · 轨道节点
 * + 鼠标视差 · 按钮涟漪 · 滚动揭示 · 光柱 · 星云呼吸
 * 理念：反AI模板化，手工质感，克制而有深度
 */
(function () {
  'use strict';

  var mouseX = 0,
    mouseY = 0;

  /* ========== 星空 + 星云 + 星座连线 + 鼠标视差 ========== */
  function initStarfield() {
    var c = document.getElementById('starfield');
    if (!c) return;
    var ctx = c.getContext('2d');
    var stars = [],
      anchors = [],
      w,
      h,
      t = 0;
    var shootingStar = null;
    var offsetX = 0,
      offsetY = 0,
      targetX = 0,
      targetY = 0;

    // 星云 — 随机分布的柔和光斑
    var nebulae = [];

    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      stars = [];
      anchors = [];
      nebulae = [];

      // 星云光斑
      for (var n = 0; n < 5; n++) {
        nebulae.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 80 + Math.random() * 200,
          hue: Math.random() > 0.5 ? 220 : 30,
          alpha: 0.015 + Math.random() * 0.025,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // 亮星（锚点星）
      for (var i = 0; i < 70; i++) {
        var s = {
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.5,
          twinkleSpeed: Math.random() * 0.012 + 0.003,
          twinkleOffset: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.35 + 0.12,
          hue: Math.random() > 0.6 ? 42 : 0,
        };
        stars.push(s);
        if (Math.random() < 0.45) anchors.push(s);
      }
      // 暗星
      for (var j = 0; j < 120; j++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 0.7 + 0.15,
          twinkleSpeed: Math.random() * 0.018 + 0.006,
          twinkleOffset: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.2 + 0.04,
          hue: Math.random() > 0.82 ? 42 : 0,
          bg: true,
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);

    // 鼠标视差
    document.addEventListener('mousemove', function (e) {
      targetX = (e.clientX - w / 2) * 0.015;
      targetY = (e.clientY - h / 2) * 0.015;
    });

    function draw() {
      t++;
      // 平滑偏移
      offsetX += (targetX - offsetX) * 0.05;
      offsetY += (targetY - offsetY) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // 星云光斑
      for (var ni = 0; ni < nebulae.length; ni++) {
        var neb = nebulae[ni];
        var breathe = 1 + Math.sin(t * 0.003 + neb.phase) * 0.3;
        var grad = ctx.createRadialGradient(
          neb.x + offsetX * 0.3,
          neb.y + offsetY * 0.3,
          0,
          neb.x + offsetX * 0.3,
          neb.y + offsetY * 0.3,
          neb.r * breathe
        );
        if (neb.hue > 100) {
          grad.addColorStop(0, 'rgba(30,28,60,' + neb.alpha * breathe + ')');
          grad.addColorStop(1, 'rgba(30,28,60,0)');
        } else {
          grad.addColorStop(0, 'rgba(60,40,20,' + neb.alpha * breathe + ')');
          grad.addColorStop(1, 'rgba(60,40,20,0)');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(
          neb.x - neb.r * breathe + offsetX * 0.3,
          neb.y - neb.r * breathe + offsetY * 0.3,
          neb.r * 2 * breathe,
          neb.r * 2 * breathe
        );
      }

      // 星座连线
      for (var i = 0; i < anchors.length; i++) {
        for (var j = i + 1; j < anchors.length; j++) {
          var dx = anchors[i].x - anchors[j].x;
          var dy = anchors[i].y - anchors[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            var alpha = 0.05 * (1 - dist / 160);
            ctx.beginPath();
            ctx.moveTo(anchors[i].x + offsetX, anchors[i].y + offsetY);
            ctx.lineTo(anchors[j].x + offsetX, anchors[j].y + offsetY);
            ctx.strokeStyle = 'rgba(184,154,92,' + alpha + ')';
            ctx.lineWidth = 0.35;
            ctx.stroke();
          }
        }
      }

      // 绘制所有星
      stars.forEach(function (s) {
        var alpha = s.opacity + Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.18;
        var a = Math.max(0.03, Math.min(0.65, alpha));
        ctx.beginPath();
        ctx.arc(s.x + offsetX, s.y + offsetY, s.r, 0, Math.PI * 2);
        if (s.hue) {
          ctx.fillStyle = 'rgba(184,154,92,' + a + ')';
          ctx.shadowColor = 'rgba(184,154,92,' + a * 0.35 + ')';
          ctx.shadowBlur = s.r * 2.5;
        } else {
          ctx.fillStyle = 'rgba(200,200,215,' + a + ')';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // 流星
      if (!shootingStar && Math.random() < 0.003) {
        shootingStar = {
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.3,
          vx: 4 + Math.random() * 5,
          vy: 2 + Math.random() * 3,
          life: 1,
          len: 50 + Math.random() * 70,
        };
      }
      if (shootingStar) {
        var ss = shootingStar;
        var grad = ctx.createLinearGradient(
          ss.x + offsetX,
          ss.y + offsetY,
          ss.x + offsetX - ss.vx * ss.len * 0.05,
          ss.y + offsetY - ss.vy * ss.len * 0.05
        );
        grad.addColorStop(0, 'rgba(255,255,255,' + ss.life + ')');
        grad.addColorStop(1, 'rgba(184,154,92,0)');
        ctx.beginPath();
        ctx.moveTo(ss.x + offsetX, ss.y + offsetY);
        ctx.lineTo(ss.x + offsetX - ss.vx * ss.len * 0.05, ss.y + offsetY - ss.vy * ss.len * 0.05);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= 0.016;
        if (ss.life <= 0) shootingStar = null;
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ========== 粒子 ========== */
  function initParticles() {
    var container = document.getElementById('particles-container');
    if (!container) return;
    var f = document.createDocumentFragment();
    for (var i = 0; i < 50; i++) {
      var p = document.createElement('div');
      var r = Math.random();
      p.className = r > 0.82 ? 'particle large' : r > 0.55 ? 'particle ring' : 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.setProperty('--pd', 9 + Math.random() * 15 + 's');
      p.style.setProperty('--pdl', Math.random() * 14 + 's');
      p.style.setProperty('--pdx', (Math.random() - 0.5) * 60 + 'px');
      p.style.setProperty('--pdx2', (Math.random() - 0.5) * 80 + 'px');
      f.appendChild(p);
    }
    container.appendChild(f);
  }

  /* ========== 光柱特效 ========== */
  function initLightStreaks() {
    function createStreak() {
      var el = document.createElement('div');
      el.className = 'light-streak';
      el.style.left = Math.random() * 90 + '%';
      el.style.top = '-80px';
      el.style.animationDuration = 2.5 + Math.random() * 3 + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', function () {
        el.remove();
      });
    }
    // 偶尔创建光柱
    setInterval(function () {
      if (Math.random() < 0.35) createStreak();
    }, 4000);
    createStreak();
  }

  /* ========== 按钮涟漪 ========== */
  function initRippleEffect() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-gold');
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  }

  /* ========== 滚动揭示 (IntersectionObserver) ========== */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 子元素也触发
            var items = entry.target.querySelectorAll('.reveal-item');
            items.forEach(function (item) {
              item.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // 观察所有 glass-card
    var observeCards = function () {
      var cards = document.querySelectorAll('.glass-card');
      cards.forEach(function (card) {
        if (!card.classList.contains('reveal-item')) {
          card.classList.add('reveal-item');
        }
        observer.observe(card);
      });
    };

    // 初始观察
    setTimeout(observeCards, 500);
    // 路由变化后重新观察
    window.addEventListener('hashchange', function () {
      setTimeout(observeCards, 600);
    });
  }

  /* ========== 路由系统 ========== */
  var homePage = document.getElementById('home-page');
  var subPage = document.getElementById('sub-page');
  var pageContainer = document.getElementById('page-container');

  var routes = {
    home: function () {
      return null;
    },
    bazi: function () {
      return renderBaziComponent({});
    },
    zhuge: function () {
      return renderZhugeComponent();
    },
    liuyao: function () {
      return renderLiuyaoComponent();
    },
    meihua: function () {
      return renderMeihuaComponent();
    },
    qimen: function () {
      return renderQimenComponent();
    },
    taiyi: function () {
      return renderTaiyiComponent();
    },
    masters: function () {
      return renderMastersComponent({ userInfo: {} });
    },
    composite: function () {
      return renderCompositeComponent();
    },
    zhougong: function () {
      return renderZhougongComponent();
    },
    daliuren: function () {
      return renderDaliurenComponent();
    },
    ziwei: function () {
      return renderZiweiComponent();
    },
    fengshui: function () {
      return renderFengshuiComponent();
    },
    profile: function () {
      return renderProfileComponent();
    },
  };

  function navigateTo(page) {
    // 更新导航
    var links = document.querySelectorAll('.nav-link');
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      if (l.dataset.route === '/' + page) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    }

    if (page === 'home') {
      homePage.classList.add('active');
      subPage.classList.remove('active');
      pageContainer.innerHTML = '';
    } else {
      homePage.classList.remove('active');
      subPage.classList.add('active');

      var render = routes[page];
      if (render) {
        pageContainer.style.opacity = '0';
        pageContainer.style.transform = 'translateY(8px)';
        setTimeout(function () {
          pageContainer.innerHTML = '';
          var el = render();
          if (el) {
            pageContainer.appendChild(el);
          }
          // 用 requestAnimationFrame 确保布局完成后再显示
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              pageContainer.style.opacity = '1';
              pageContainer.style.transform = 'translateY(0)';
            });
          });
        }, 120);
      }
    }

    document.getElementById('main-content').scrollTop = 0;
    closeMobileSidebar();
  }

  function handleHash() {
    var hash = window.location.hash || '#/home';
    var page = hash.replace('#/', '');
    navigateTo(page);
  }

  /* ========== 导航点击 ========== */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.nav-link');
    if (link) {
      e.preventDefault();
      window.location.hash = link.dataset.route;
      return;
    }
    var node = e.target.closest('.home-node');
    if (node) {
      e.preventDefault();
      window.location.hash = node.dataset.route;
      return;
    }
  });

  /* ========== 移动端侧边栏 ========== */
  function toggleMobileSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active');
  }
  function closeMobileSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  }

  var mobileBtn = document.getElementById('mobile-menu-btn');
  if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileSidebar);
  var overlayEl = document.getElementById('sidebar-overlay');
  if (overlayEl) overlayEl.addEventListener('click', closeMobileSidebar);

  /* ========== Toast ========== */
  window.showToast = function (msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () {
      t.remove();
    }, 3000);
  };

  /* ========== 首页节点入场动画 ========== */
  function animateHomeNodes() {
    var nodes = document.querySelectorAll('.home-node');
    for (var i = 0; i < nodes.length; i++) {
      (function (n, idx) {
        n.style.opacity = '0';
        setTimeout(
          function () {
            n.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            n.style.opacity = '1';
          },
          400 + idx * 100
        );
      })(nodes[i], i);
    }
  }

  /* ========== 卡片悬浮倾斜（已禁用 - 避免抖动影响观感） ========== */
  function initCardTilt() {
    // 3D 透视倾斜效果已禁用，保留函数签名避免调用处报错
    // 原因：mousemove 持续修改 transform 会导致卡片抖动，影响阅读体验
  }

  /* ========== 启动 ========== */
  function init() {
    initStarfield();
    initParticles();
    initLightStreaks();
    initRippleEffect();
    initScrollReveal();
    initCardTilt();
    window.addEventListener('hashchange', handleHash);
    handleHash();
    setTimeout(animateHomeNodes, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  (typeof Tianjige !== 'undefined' && Tianjige.Logger)
    ? Tianjige.Logger.log('天机阁 v5 启动，星空引擎就绪')
    : void 0;
})();
