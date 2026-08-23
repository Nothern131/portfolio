/**
 * 大师蒸馏组件 v2 — 精简版，融入分析流程
 * 不再有独立输入区，直接接收已有排盘数据进行分析
 *
 * 用法：
 *   renderMastersPanel(container, options)
 *   options: { category, masters, analysisTypes, onAnalyze, resultData }
 *   - category: 流派过滤（'八字'/'风水'等）
 *   - masters: 大师数据数组 [{id, name, title, era, avatar, category}]
 *   - analysisTypes: 分析类型 [{id, label}]
 *   - onAnalyze(masterId, analysisType): 分析回调，返回 { opening, overview, specialty, quote, closing }
 *   - resultData: 可选，用于展示分析所需的基本信息
 */
function renderMastersPanel(container, options) {
  'use strict';
  var opts = options || {};
  var masters = opts.masters || [];
  var analysisTypes = opts.analysisTypes || [{ id: 'full', label: '全盘分析' }];
  var category = opts.category || '';
  var onAnalyze =
    opts.onAnalyze ||
    function () {
      return null;
    };
  var resultData = opts.resultData || {};

  var selectedMaster = null;
  var selectedType = (analysisTypes[0] || {}).id || 'full';

  // 流派标签颜色
  var categoryColors = {
    八字: 'var(--gold)',
    六爻: '#c9a03c',
    奇门: '#4a9a8c',
    紫微: '#8a6ab8',
    大六壬: '#4a8ac9',
    风水: '#6a9a4a',
    梅花: '#c96a8a',
    太乙: '#8a8ac9',
    解梦: '#6a6a9a',
    综合: '#9a8a6a',
  };

  var html = '';

  // 标题
  html += '<div class="section-header">';
  html += '<h2 class="page-title">大师点评</h2>';
  html +=
    '<p class="page-subtitle">' +
    (category ? category + '流派 · ' + masters.length + '位大师，选择一位为汝解盘' : '选择一位大师，以古法解今盘') +
    '</p>';
  html += '</div>';

  // 大师选择区
  html += '<div class="glass-card mb-24" id="masters-select-panel">';
  html +=
    '<h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;font-size:1rem;">选择一位大师</h3>';
  html += '<div class="master-cat-grid" id="masters-grid">';
  for (var i = 0; i < masters.length; i++) {
    var m = masters[i];
    html += '<div class="master-card" data-master-id="' + m.id + '">';
    html += '<div class="master-avatar">' + (m.avatar || '⭐') + '</div>';
    html += '<div class="master-name">' + m.name + '</div>';
    html += '<div class="master-title">' + (m.title || '') + '</div>';
    html +=
      '<div class="master-era">' +
      (m.era || '') +
      (m.style ? ' · ' + (m.style.split('，')[0] || m.style.split('，')[0]) : '') +
      '</div>';
    html += '</div>';
  }
  html += '</div>';

  // 分析类型选择
  if (analysisTypes.length > 1) {
    html += '<div class="form-group mt-8">';
    html +=
      '<label class="form-label" style="font-size:0.72rem;color:var(--text2);margin-bottom:6px;letter-spacing:0.05em;">分析类型</label>';
    html += '<div class="tabs" id="master-type-tabs" style="margin-bottom:0;border-bottom:none;">';
    for (var j = 0; j < analysisTypes.length; j++) {
      var t = analysisTypes[j];
      html +=
        '<button class="tab-btn' +
        (t.id === selectedType ? ' active' : '') +
        '" data-type="' +
        t.id +
        '">' +
        t.label +
        '</button>';
    }
    html += '</div>';
    html += '</div>';
  }

  // 分析按钮
  html +=
    '<button class="btn-gold lg" id="master-analyze-btn" style="width:100%;margin-top:12px;" disabled>请先选择一位大师</button>';
  html += '</div>';

  // 结果区域
  html += '<div id="master-result-area" class="hidden">';
  html += '<div class="glass-card" id="master-result-card"></div>';
  html += '</div>';

  container.innerHTML = html;

  // 大师选择事件
  var grid = container.querySelector('#masters-grid');
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.master-card');
    if (!card) return;
    var masterId = card.dataset.masterId;
    selectedMaster = null;
    for (var k = 0; k < masters.length; k++) {
      if (masters[k].id === masterId) {
        selectedMaster = masters[k];
        break;
      }
    }
    // 更新选中状态
    var allCards = grid.querySelectorAll('.master-card');
    for (var c = 0; c < allCards.length; c++) {
      allCards[c].classList.remove('selected');
    }
    card.classList.add('selected');
    // 更新按钮
    var btn = container.querySelector('#master-analyze-btn');
    btn.disabled = false;
    btn.textContent = '请 ' + selectedMaster.name + ' 点评';
  });

  // 分析类型选择
  var typeTabs = container.querySelector('#master-type-tabs');
  if (typeTabs) {
    typeTabs.addEventListener('click', function (e) {
      var btn = e.target.closest('.tab-btn');
      if (!btn) return;
      var allBtns = typeTabs.querySelectorAll('.tab-btn');
      for (var b = 0; b < allBtns.length; b++) {
        allBtns[b].classList.remove('active');
      }
      btn.classList.add('active');
      selectedType = btn.dataset.type;
    });
  }

  // 分析按钮
  container.querySelector('#master-analyze-btn').addEventListener('click', function () {
    if (!selectedMaster) return;
    var btn = container.querySelector('#master-analyze-btn');
    var resultArea = container.querySelector('#master-result-area');
    var resultCard = container.querySelector('#master-result-card');

    resultArea.classList.remove('hidden');
    resultCard.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;
    btn.textContent = '分析中...';

    // 使用 setTimeout 让 UI 先更新（spinner 显示），然后同步执行分析
    setTimeout(function () {
      try {
        var result = onAnalyze(selectedMaster.id, selectedType);
        if (!result) {
          resultCard.innerHTML =
            '<div class="error-container"><div class="error-icon">⚠️</div><div class="error-text">分析数据不足，请先完成排盘</div></div>';
        } else {
          renderMasterResult(resultCard, result, selectedMaster, categoryColors);
        }
      } catch (err) {
        resultCard.innerHTML =
          '<div class="error-container"><div class="error-icon">⚠️</div><div class="error-text">分析出错：' +
          (err.message || '未知错误') +
          '</div></div>';
      }
      btn.disabled = false;
      btn.textContent = '请 ' + selectedMaster.name + ' 点评';
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  });
}

/** 渲染大师分析结果 */
function renderMasterResult(container, result, master, categoryColors) {
  var sections = [
    { key: 'opening', label: '开篇', icon: '📜', desc: '大师以自身风格开场，点明分析方向' },
    { key: 'overview', label: '总论', icon: '🔍', desc: '详细分析命盘/格局全貌' },
    { key: 'specialty', label: '专论', icon: '💎', desc: '聚焦所选方向，展开深度分析' },
    { key: 'quote', label: '经典引用', icon: '📖', desc: '引经据典，以古鉴今' },
    { key: 'closing', label: '结语', icon: '🎋', desc: '总结核心论断，给出方向性指引' },
  ];

  var catColor = (categoryColors || {})[master.category] || 'var(--gold)';

  var html = '<div class="fade-in">';
  // 大师头部信息
  html += '<div class="master-result-header">';
  html +=
    '<div class="master-result-avatar-wrap"><span class="master-result-avatar">' +
    (master.avatar || '⭐') +
    '</span></div>';
  html += '<div class="master-result-info">';
  html +=
    '<h3 class="master-result-name">' +
    master.name +
    '<span class="master-result-era">' +
    (master.era || '') +
    '</span></h3>';
  html += '<p class="master-result-title">' + (master.title || '') + '</p>';
  html += '<div class="master-result-tags">';
  html +=
    '<span class="master-result-tag" style="border-color:' +
    catColor +
    ';color:' +
    catColor +
    ';">' +
    (master.category || '') +
    '</span>';
  if (master.style) html += '<span class="master-result-tag">' + master.style + '</span>';
  html += '</div></div></div>';
  html += '<div class="master-result-divider"></div>';

  // 五段式分析
  html += '<div class="master-result-body">';
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var content = result[section.key];
    if (content) {
      var paragraphs = content.split('\n\n');
      var formatted = '';
      for (var p = 0; p < paragraphs.length; p++) {
        var para = paragraphs[p].trim();
        if (para) formatted += '<p>' + para.replace(/\n/g, '<br>') + '</p>';
      }
      html += '<div class="master-result-section" style="--delay:' + i * 0.08 + 's;">';
      html += '<div class="master-section-header">';
      html += '<span class="master-section-icon">' + section.icon + '</span>';
      html +=
        '<div class="master-section-title-wrap"><span class="master-section-title">' +
        section.label +
        '</span><span class="master-section-desc">' +
        section.desc +
        '</span></div>';
      html += '<span class="master-section-num">0' + (i + 1) + '</span>';
      html += '</div>';
      html += '<div class="master-section-content">' + formatted + '</div>';
      html += '</div>';
    }
  }
  html += '</div>';

  container.innerHTML = html;
}

/**
 * 渲染大师蒸馏独立页面（#/masters路由用）
 * 展示所有大师，可选择分析
 */
function renderMastersComponent(userInfo) {
  'use strict';
  var el = document.createElement('div');
  el.className = 'fade-in';

  var mastersData = [];
  if (typeof MastersEngine !== 'undefined' && MastersEngine.MASTERS) {
    for (var k in MastersEngine.MASTERS) {
      if (MastersEngine.MASTERS.hasOwnProperty(k)) {
        mastersData.push(MastersEngine.MASTERS[k]);
      }
    }
  }

  var categories = {};
  for (var i = 0; i < mastersData.length; i++) {
    var c = mastersData[i].category || '综合';
    if (!categories[c]) categories[c] = [];
    categories[c].push(mastersData[i]);
  }
  var catKeys = Object.keys(categories).sort();

  var html = '<div style="max-width:800px;margin:0 auto;padding:20px 0;">';

  // Header
  html += '<div class="section-header">';
  html += '<h2 class="page-title">👨‍🏫 大师蒸馏</h2>';
  html += '<p class="page-subtitle">融通诸派，群英论道，以古鉴今。</p>';
  html += '</div>';

  // Category filter
  html += '<div class="tab-bar" id="master-cat-tabs" style="margin-bottom:20px;">';
  html += '<button class="tab-btn active" data-cat="all">全部</button>';
  for (var ci = 0; ci < catKeys.length; ci++) {
    html += '<button class="tab-btn" data-cat="' + catKeys[ci] + '">' + catKeys[ci] + '</button>';
  }
  html += '</div>';

  // Master cards grid
  html += '<div class="glass-card" style="margin-bottom:20px;">';
  html += '<div class="master-cat-grid" id="master-page-grid">';
  for (var j = 0; j < mastersData.length; j++) {
    var m = mastersData[j];
    html += '<div class="master-card" data-master-id="' + m.id + '" data-cat="' + (m.category || '综合') + '">';
    html += '<div class="master-avatar">' + (m.avatar || '⭐') + '</div>';
    html += '<div class="master-name">' + m.name + '</div>';
    html += '<div class="master-title">' + (m.title || '') + '</div>';
    html += '<div class="master-era">' + (m.era || '') + '</div>';
    html += '</div>';
  }
  html += '</div>';
  html += '</div>';

  // Question + analyze
  html += '<div class="glass-card" style="margin-bottom:20px;">';
  html += '<h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:12px;font-size:0.95rem;">📝 输入所问之事</h3>';
  html += '<textarea id="master-question-input" class="question-input" rows="3" placeholder="请输入您想问的问题，例如：最近事业运势如何？" style="width:100%;resize:vertical;font-size:0.88rem;"></textarea>';
  html += '<div id="master-selected-info" style="font-size:0.8rem;color:var(--text2);margin-top:8px;"></div>';
  html += '<div style="text-align:center;margin-top:14px;">';
  html += '<button class="btn-gold" id="master-page-analyze-btn" disabled>请先选择一位大师</button>';
  html += '</div>';
  html += '</div>';

  // Result
  html += '<div id="master-page-result-area" class="hidden">';
  html += '<div class="glass-card" id="master-page-result-card"></div>';
  html += '</div>';

  html += '</div>';
  el.innerHTML = html;

  // Tab filtering
  var tabs = el.querySelectorAll('#master-cat-tabs .tab-btn');
  var grid = el.querySelector('#master-page-grid');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var cat = tab.dataset.cat;
      var cards = grid.querySelectorAll('.master-card');
      cards.forEach(function(card) {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Master selection
  var selectedMaster = null;
  grid.addEventListener('click', function(e) {
    var card = e.target.closest('.master-card');
    if (!card) return;
    var id = card.dataset.masterId;
    selectedMaster = null;
    for (var i = 0; i < mastersData.length; i++) {
      if (mastersData[i].id === id) {
        selectedMaster = mastersData[i];
        break;
      }
    }
    var allCards = grid.querySelectorAll('.master-card');
    for (var c = 0; c < allCards.length; c++) {
      allCards[c].classList.remove('selected');
    }
    card.classList.add('selected');
    var info = el.querySelector('#master-selected-info');
    if (info && selectedMaster) {
      info.textContent = '已选择：' + selectedMaster.name + ' · ' + (selectedMaster.category || '综合') + ' · ' + (selectedMaster.era || '');
    }
    var btn = el.querySelector('#master-page-analyze-btn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = '请 ' + (selectedMaster ? selectedMaster.name : '') + ' 点评';
    }
  });

  // Analyze button
  var analyzeBtn = el.querySelector('#master-page-analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', function() {
      if (!selectedMaster) return;
      var question = (el.querySelector('#master-question-input') || {}).value || '';
      var resultArea = el.querySelector('#master-page-result-area');
      var resultCard = el.querySelector('#master-page-result-card');
      if (!resultArea || !resultCard) return;

      resultArea.classList.remove('hidden');
      resultCard.innerHTML = '<div class="spinner" style="margin:40px auto;"></div>';
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = '分析中...';

      setTimeout(function() {
        try {
          var analysis = generateMasterAnalysis(selectedMaster, question, userInfo || {});
          renderMasterResult(resultCard, analysis, selectedMaster, {});
        } catch(e) {
          resultCard.innerHTML = '<div style="padding:20px;color:var(--red);text-align:center;">分析出错：' + (e.message || '未知错误') + '</div>';
        }
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '请 ' + selectedMaster.name + ' 点评';
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 800);
    });
  }

  return el;
}

/** 生成大师分析文本（独立页面用） */
function generateMasterAnalysis(master, question, userInfo) {
  var opening = '';
  var overview = '';
  var specialty = '';
  var quote = '';
  var closing = '';

  var name = master.name || '';
  var pronoun = master.pronouns || '吾';
  var phrase = master.phrase || '';
  var catColor = '#b89a5c';

  opening = pronoun + '以' + (master.category || '') + '之术观之：' + (question ? '「' + question + '」' : '今日之事') + '，' + phrase + '。';

  overview = '此' + (master.category || '术数') + '之术，' + name + '观之，当以' + (master.style ? master.style.split('，')[0] : '阴阳之理') + '为纲。';

  specialty = '【推演】' + pronoun + '以' + (master.category || '') + '之法细推之：' + (question || '所问之事') + '，' + (master.era || '') + '之时，' + name + '观之，事有转机。宜守正待时，不可冒进。';

  var quoteTpls = master.quoteTemplates || [];
  quote = quoteTpls.length > 0 ? quoteTpls[0].replace(/\{[^}]+\}/g, '天理') : name + '尝曰："观天之道，执天之行，尽矣。"';

  closing = pronoun + '断曰：' + (master.category || '') + '之术，贵在顺势。' + (question || '此事') + '，' + (master.era || '') + '之法，可察其机。善自为之。';

  return { opening: opening, overview: overview, specialty: specialty, quote: quote, closing: closing };
}

