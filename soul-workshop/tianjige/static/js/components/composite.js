/**
 * 天机阁 · 合参组件 v2 — 多术数融合研判
 * 健壮渲染 · 事域感知 · 深度解读
 */
function renderCompositeComponent() {
  try {
    var container = document.createElement('div');
    container.className = 'fade-in';

    var MASTER_OPTIONS = [];
    if (typeof MastersEngine !== 'undefined' && MastersEngine.MASTERS) {
      var _seen = {};
      var _masters = MastersEngine.MASTERS;
      for (var _k in _masters) {
        if (_masters.hasOwnProperty(_k) && !_seen[_k]) {
          _seen[_k] = true;
          var _m = _masters[_k];
          MASTER_OPTIONS.push({ id: _m.id, name: _m.name, emoji: _m.avatar || '⭐', category: _m.category || '综合' });
        }
      }
    }
    if (MASTER_OPTIONS.length === 0) {
      MASTER_OPTIONS = [
        { id: 'guiguzi', name: '鬼谷子', emoji: '🧙', category: '六爻' },
        { id: 'shaoyong', name: '邵雍', emoji: '🌸', category: '梅花' },
        { id: 'zhugeliang', name: '诸葛亮', emoji: '🐉', category: '奇门' },
        { id: 'yuanli', name: '袁天罡', emoji: '⭐', category: '八字' },
        { id: 'lichunfeng', name: '李淳风', emoji: '🌠', category: '奇门' },
        { id: 'xuzile', name: '徐子平', emoji: '📜', category: '八字' },
        { id: 'liuzhitong', name: '刘伯温', emoji: '🔥', category: '八字' },
        { id: 'renqiao', name: '任铁樵', emoji: '💧', category: '八字' },
        { id: 'weixian', name: '韦千里', emoji: '🌿', category: '八字' },
        { id: 'zhougong', name: '周公', emoji: '🌙', category: '解梦' },
        { id: 'zhangziye', name: '张子业', emoji: '🔮', category: '六爻' },
      ];
    }

    var METHOD_CHECKS = [
      { id: 'bazi', name: '八字排盘', icon: '📅', checked: true },
      { id: 'liuyao', name: '六爻占卜', icon: '🪙', checked: false },
      { id: 'meihua', name: '梅花易数', icon: '🌸', checked: false },
      { id: 'qimen', name: '奇门遁甲', icon: '☯️', checked: false },
      { id: 'taiyi', name: '太乙神数', icon: '🌌', checked: false },
      { id: 'zhuge', name: '诸葛神数', icon: '📜', checked: false },
      { id: 'zhougong', name: '周公解梦', icon: '🌙', checked: false },
      { id: 'daliuren', name: '大六壬', icon: '🌊', checked: false },
      { id: 'ziwei', name: '紫微斗数', icon: '⭐', checked: false },
      { id: 'fengshui', name: '风水格局', icon: '🏔️', checked: false },
    ];

    var methodHtml = '';
    for (var i = 0; i < METHOD_CHECKS.length; i++) {
      var m = METHOD_CHECKS[i];
      methodHtml +=
        '<label style="display:flex;align-items:center;gap:4px;padding:6px 10px;background:rgba(184,154,92,0.08);border-radius:6px;cursor:pointer;font-size:0.85rem;">' +
        '<input type="checkbox" name="compMethod" value="' +
        m.id +
        '"' +
        (m.checked ? ' checked' : '') +
        '>' +
        m.icon +
        ' ' +
        m.name +
        '</label>';
    }

    var masterHtml = '';
    for (var j = 0; j < MASTER_OPTIONS.length; j++) {
      var ma = MASTER_OPTIONS[j];
      var masterChecked = ma.emoji === '🧙' || ma.emoji === '🌸' || ma.emoji === '🐉' ? ' checked' : '';
      masterHtml +=
        '<label style="display:flex;align-items:center;gap:4px;padding:6px 10px;background:rgba(184,154,92,0.08);border-radius:6px;cursor:pointer;font-size:0.85rem;">' +
        '<input type="checkbox" name="compMaster" value="' +
        ma.id +
        '"' +
        masterChecked +
        '>' +
        ma.emoji +
        ' ' +
        ma.name +
        '</label>';
    }

    container.innerHTML =
      '' +
      '<div class="section-header">' +
      '<h2 class="page-title">🧩 合参 · 多术数融合研判</h2>' +
      '<p class="page-subtitle">融通诸术，并行推演，事域交叉，融合研判一事之吉凶。</p>' +
      '</div>' +
      '<div class="glass-card mb-24" id="composite-input-card">' +
      '<h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;font-size:1rem;">📋 推演参数</h3>' +
      '<div class="form-row mb-8">' +
      '<div class="form-group"><label class="form-label">出生日期</label><input type="date" class="form-input" id="comp-birth-date"></div>' +
      '<div class="form-group"><label class="form-label">出生时辰</label><select class="form-select" id="comp-birth-time">' +
      '<option value="">自动</option>' +
      '<option value="子时">子时 (23-01)</option><option value="丑时">丑时 (01-03)</option>' +
      '<option value="寅时">寅时 (03-05)</option><option value="卯时">卯时 (05-07)</option>' +
      '<option value="辰时">辰时 (07-09)</option><option value="巳时">巳时 (09-11)</option>' +
      '<option value="午时">午时 (11-13)</option><option value="未时">未时 (13-15)</option>' +
      '<option value="申时">申时 (15-17)</option><option value="酉时">酉时 (17-19)</option>' +
      '<option value="戌时">戌时 (19-21)</option><option value="亥时">亥时 (21-23)</option>' +
      '</select></div>' +
      '<div class="form-group"><label class="form-label">性别</label><select class="form-select" id="comp-gender"><option value="male">男</option><option value="female">女</option></select></div>' +
      '</div>' +
      '<div class="form-group" style="margin-top:12px;">' +
      '<label class="form-label">🔮 所问之事（输入您的具体问题，系统将自动识别事域）</label>' +
      '<input type="text" class="form-input" id="comp-question" placeholder="例如：最近事业晋升机会如何？这段感情有结果吗？">' +
      '<div id="comp-domain-hint" style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;min-height:18px;"></div>' +
      '</div>' +
      '<div class="form-group" style="margin-top:12px;">' +
      '<label class="form-label">选择术数（至少选1个）</label>' +
      '<div id="comp-method-checks" style="display:flex;flex-wrap:wrap;gap:6px;">' +
      methodHtml +
      '</div>' +
      '<div style="margin-top:6px;font-size:0.78rem;color:var(--text-muted);">' +
      '<button type="button" id="comp-select-all" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:0.78rem;">全选</button> · ' +
      '<button type="button" id="comp-deselect-all" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:0.78rem;">清空</button>' +
      '</div>' +
      '</div>' +
      '<div class="form-group" style="margin-top:12px;">' +
      '<label class="form-label">👨‍🏫 大师点评（推荐选3-5位）</label>' +
      '<div id="comp-master-checks" style="display:flex;flex-wrap:wrap;gap:6px;">' +
      masterHtml +
      '</div>' +
      '</div>' +
      '<button class="btn-gold lg" id="comp-submit-btn" style="width:100%;margin-top:16px;">🔮 开始合参推演</button>' +
      '<div id="comp-progress-bar" class="hidden" style="margin-top:12px;">' +
      '<div style="height:4px;background:rgba(184,154,92,0.15);border-radius:2px;overflow:hidden;" id="comp-progress-track">' +
      '<div id="comp-progress-fill" style="height:100%;width:0%;background:var(--gold-light);transition:width 0.3s ease;"></div>' +
      '</div>' +
      '<div id="comp-progress-text" style="font-size:0.75rem;color:var(--text-muted);text-align:center;margin-top:4px;">初始化...</div>' +
      '</div>' +
      '</div>' +
      '<div id="comp-result-area" class="hidden"><div id="comp-result-container"></div></div>';

    // 全选/清空
    var selectAll = container.querySelector('#comp-select-all');
    var deselectAll = container.querySelector('#comp-deselect-all');
    if (selectAll) {
      selectAll.addEventListener('click', function () {
        var checks = container.querySelectorAll('input[name="compMethod"]');
        for (var i = 0; i < checks.length; i++) checks[i].checked = true;
      });
    }
    if (deselectAll) {
      deselectAll.addEventListener('click', function () {
        var checks = container.querySelectorAll('input[name="compMethod"]');
        for (var i = 0; i < checks.length; i++) checks[i].checked = false;
      });
    }

    // 所问之事实时事域提示
    var questionInput = container.querySelector('#comp-question');
    var domainHint = container.querySelector('#comp-domain-hint');
    if (questionInput && domainHint) {
      questionInput.addEventListener('input', function () {
        var q = this.value.trim();
        if (q && typeof DomainAnalysis !== 'undefined' && DomainAnalysis.analyze) {
          try {
            var da = DomainAnalysis.analyze('bazi', {}, q);
            if (da && da.domain) {
              domainHint.textContent = '已识别事域：' + da.domain.icon + ' ' + da.domain.name;
              domainHint.style.color = 'var(--gold)';
            } else {
              domainHint.textContent = '请输入您的具体问题，系统将自动归入对应事域';
              domainHint.style.color = 'var(--text-muted)';
            }
          } catch (e) {
            domainHint.textContent = '';
          }
        } else {
          domainHint.textContent = '请输入您的具体问题，系统将自动归入对应事域';
          domainHint.style.color = 'var(--text-muted)';
        }
      });
    }

    // 提交按钮
    var submitBtn = container.querySelector('#comp-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        handleCompositeSubmit(container);
      });
    }

    return container;
  } catch (e) {
    var errDiv = document.createElement('div');
    errDiv.className = 'error-container';
    errDiv.innerHTML =
      '<div class="error-icon">⚠️</div><div class="error-text">合参组件加载失败：' +
      (e.message || '未知错误') +
      '</div>';
    return errDiv;
  }
}

function handleCompositeSubmit(container) {
  try {
    var birthDate = container.querySelector('#comp-birth-date').value.trim();
    var birthTime = container.querySelector('#comp-birth-time').value;
    var gender = container.querySelector('#comp-gender').value;
    var question = container.querySelector('#comp-question').value.trim();

    var methodChecks = container.querySelectorAll('input[name="compMethod"]:checked');
    var methods = [];
    for (var i = 0; i < methodChecks.length; i++) methods.push(methodChecks[i].value);

    if (methods.length === 0) {
      if (typeof showToast === 'function') showToast('请至少选择一种术数');
      return;
    }

    var masterChecks = container.querySelectorAll('input[name="compMaster"]:checked');
    var masterIds = [];
    for (var j = 0; j < masterChecks.length; j++) masterIds.push(masterChecks[j].value);

    var resultArea = container.querySelector('#comp-result-area');
    var resultContainer = container.querySelector('#comp-result-container');
    if (!resultArea || !resultContainer) return;

    resultArea.classList.remove('hidden');

    var progressBar = container.querySelector('#comp-progress-bar');
    var progressFill = container.querySelector('#comp-progress-fill');
    var progressText = container.querySelector('#comp-progress-text');
    if (progressBar) progressBar.classList.remove('hidden');
    if (progressFill) progressFill.style.width = '10%';
    if (progressText) progressText.textContent = '正在执行术数推演...';

    var submitBtn = container.querySelector('#comp-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ 推演中...';
    }

    var engineParams = {
      birthDate: birthDate || new Date().toISOString().slice(0, 10),
      birthTime: birthTime,
      gender: gender,
      question: question,
      date: birthDate || new Date().toISOString().slice(0, 10),
      hour: birthTime || '',
      zhugeNum1: Math.floor(Math.random() * 999) + 1,
      zhugeNum2: Math.floor(Math.random() * 999) + 1,
      zhugeNum3: Math.floor(Math.random() * 999) + 1,
      dreamText: question || '梦见龙飞翔', // 如果选中周公解梦，问题文本就是梦境描述
    };

    var ENGINE_NAMES = {
      bazi: '八字',
      liuyao: '六爻',
      meihua: '梅花',
      qimen: '奇门',
      taiyi: '太乙',
      zhuge: '诸葛',
      zhougong: '解梦',
    };

    function updateProgress(pct, text) {
      if (progressFill) progressFill.style.width = pct + '%';
      if (progressText) progressText.textContent = text;
    }

    updateProgress(
      10,
      '启动引擎: ' +
        methods
          .map(function (m) {
            return ENGINE_NAMES[m] || m;
          })
          .join(', ')
    );

    if (typeof CompositeEngine === 'undefined') {
      resultContainer.innerHTML =
        '<div class="error-container"><div class="error-icon">⚠️</div><div class="error-text">合参引擎未加载，请刷新页面重试。</div></div>';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🔮 重新推演';
      }
      if (progressBar) progressBar.classList.add('hidden');
      return;
    }

    CompositeEngine.run(methods, engineParams)
      .then(function (data) {
        updateProgress(70, '推理完成，生成报告...');

        // 大师点评
        if (masterIds.length > 0 && typeof MastersEngine !== 'undefined' && MastersEngine.batchAnalyze) {
          try {
            var masterComments = MastersEngine.batchAnalyze(masterIds, data, question);
            data.masterComments = masterComments;
          } catch (me) {
          }
        }

        updateProgress(95, '渲染综合报告...');

        setTimeout(function () {
          renderCompositeResult(resultContainer, data, question, methods, masterIds);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🔮 重新推演';
          }
          if (progressBar) progressBar.classList.add('hidden');
          if (resultArea) {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
      })
      .catch(function (err) {
        resultContainer.innerHTML =
          '<div class="error-container"><div class="error-icon">⚠️</div><div class="error-text">' +
          safeHtml(err.message || '计算失败') +
          '</div></div>';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '🔮 重新推演';
        }
        if (progressBar) progressBar.classList.add('hidden');
      });
    } catch (e) {
    var rc = container.querySelector('#comp-result-container');
    if (rc)
      rc.innerHTML =
        '<div class="error-container"><div class="error-icon">⚠️</div><div class="error-text">' +
        safeHtml(e.message || '未知错误') +
        '</div></div>';
    var sb = container.querySelector('#comp-submit-btn');
    if (sb) {
      sb.disabled = false;
      sb.textContent = '🔮 重新推演';
    }
    var pb = container.querySelector('#comp-progress-bar');
    if (pb) pb.classList.add('hidden');
  }
}

/** 安全的 HTML 转义 */
function safeHtml(str) {
  if (!str && str !== 0) return '';
  var div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/** 格式化分析文本（将 \n 转为段落） */
function formatAnalysisText(text) {
  if (!text) return '';
  return text
    .split('\n')
    .map(function (line) {
      var trimmed = line.trim();
      if (!trimmed) return '<br>';
      if (trimmed.indexOf('【') === 0)
        return '<strong style="color:var(--gold-light);">' + safeHtml(trimmed) + '</strong>';
      return '<span style="color:var(--text-secondary);">' + safeHtml(trimmed) + '</span>';
    })
    .join('<br>');
}

function renderCompositeResult(container, data, question, methods, masterIds) {
  if (!data) {
    container.innerHTML =
      '<div class="error-container"><div class="error-icon">⚠️</div><div class="error-text">无有效结果</div></div>';
    return;
  }

  var score = data.score || 60;
  var trend = data.trend || 'flat';
  var synthesis = data.synthesis || {};
  var results = data.individualResults || [];

  var html = '<div class="fade-in">';

  // --- 综合评分 ---
  var trendEmoji = trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  var trendText = trend === 'up' ? '呈上升态势' : trend === 'down' ? '需谨慎应对' : '趋于平稳';
  var stars = score >= 90 ? '★★★★★' : score >= 75 ? '★★★★☆' : score >= 60 ? '★★★☆☆' : score >= 45 ? '★★☆☆☆' : '★☆☆☆☆';

  html +=
    '' +
    '<div class="glass-card mb-24" style="text-align:center;">' +
    '<div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:8px;">' +
    safeHtml(synthesis.consensus || '合参推演') +
    '</div>' +
    '<div style="font-family:var(--font-serif);font-size:3.5rem;font-weight:900;color:var(--gold-light);line-height:1;">' +
    score +
    '</div>' +
    '<div style="font-size:1.1rem;color:var(--gold);margin:8px 0;">' +
    stars +
    '</div>' +
    '<div style="font-size:0.9rem;color:var(--text-muted);">' +
    trendEmoji +
    ' ' +
    trendText +
    ' · ' +
    results.length +
    ' 门术数参与</div>' +
    '</div>';

  // --- 各术数明细 ---
  if (results.length > 0) {
    html +=
      '<div class="glass-card mb-24"><h3 style="color:var(--gold-light);margin-bottom:12px;">📊 各术数独立推演</h3><div class="card-grid cols-1" style="gap:12px;">';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var starMini = r.score >= 75 ? '★★★☆☆' : r.score >= 60 ? '★★☆☆☆' : '★☆☆☆☆';
      var verdictColor = r.score >= 72 ? '#c8d8a8' : r.score >= 55 ? '#e6e2d8' : '#d8a8a8';
      var trendArr = r.trend === 'up' ? '↑' : r.trend === 'down' ? '↓' : '→';
      html +=
        '' +
        '<div class="glass-card" style="padding:14px;background:rgba(255,255,255,0.02);">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
        '<span style="font-size:1.2rem;">' +
        safeHtml(r.icon) +
        '</span>' +
        '<span style="font-family:var(--font-serif);font-weight:600;color:var(--gold);">' +
        safeHtml(r.name) +
        '</span>' +
        '</div>' +
        '<div style="text-align:right;">' +
        '<div style="font-size:1.1rem;font-weight:700;color:' +
        verdictColor +
        '">' +
        r.score +
        '分</div>' +
        '<div style="font-size:0.7rem;color:var(--text-muted);">' +
        starMini +
        ' ' +
        trendArr +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.6;">' +
        safeHtml(r.summary) +
        '</div>' +
        '<div style="margin-top:6px;font-size:0.75rem;color:var(--text-muted);">断语：' +
        safeHtml(r.verdict) +
        '</div>' +
        '<div style="margin-top:4px;font-size:0.72rem;color:var(--text-muted);">' +
        (r.keyInsights || [])
          .map(function (k) {
            return '✦ ' + safeHtml(k);
          })
          .join(' ') +
        '</div>' +
        '</div>';
    }
    html += '</div></div>';
  }

  // --- 事域交叉分析 ---
  if (synthesis.domainAnalysis) {
    var da = synthesis.domainAnalysis;
    html +=
      '' +
      '<div class="glass-card mb-24">' +
      '<h3 style="color:var(--gold-light);margin-bottom:12px;">' +
      safeHtml(da.domainIcon) +
      ' 事域交叉分析：' +
      safeHtml(da.domainName) +
      '</h3>' +
      '<div class="verdict-block" style="margin:0 0 16px 0;"><div class="verdict-text">' +
      safeHtml(da.consensusText) +
      '</div></div>' +
      '<div style="display:flex;gap:16px;margin-bottom:12px;font-size:0.8rem;">' +
      '<span style="color:var(--success);">↑ 看好 ×' +
      (da.upCount || 0) +
      '</span>' +
      '<span style="color:var(--warning);">→ 平稳 ×' +
      (da.flatCount || 0) +
      '</span>' +
      '<span style="color:var(--danger);">↓ 谨慎 ×' +
      (da.downCount || 0) +
      '</span>' +
      '</div>';
    if (da.insights && da.insights.length > 0) {
      html += '<div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.8;">';
      for (var di = 0; di < da.insights.length; di++) {
        html +=
          '<div style="margin-bottom:6px;">' +
          safeHtml(da.insights[di].icon) +
          ' <strong>' +
          safeHtml(da.insights[di].method) +
          '</strong>：' +
          safeHtml(da.insights[di].insight) +
          '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
  }

  // --- 融洽磨合分析 ---
  if (synthesis.harmonyAnalysis && synthesis.harmonyAnalysis.pairs && synthesis.harmonyAnalysis.pairs.length > 0) {
    var ha = synthesis.harmonyAnalysis;
    html +=
      '' +
      '<div class="glass-card mb-24">' +
      '<h3 style="color:var(--gold-light);margin-bottom:16px;">🤝 融洽磨合分析</h3>' +
      '<div style="display:flex;gap:16px;margin-bottom:16px;text-align:center;">' +
      '<div style="flex:1;background:rgba(184,154,92,0.06);border-radius:8px;padding:12px;">' +
      '<div style="font-size:0.75rem;color:var(--text-muted);">总体融洽度</div>' +
      '<div style="font-size:1.6rem;font-weight:700;color:' +
      (ha.avgHarmony >= 60 ? '#c8d8a8' : '#e6d8a8') +
      ';">' +
      ha.avgHarmony +
      '%</div>' +
      '</div>' +
      '<div style="flex:1;background:rgba(184,154,92,0.06);border-radius:8px;padding:12px;">' +
      '<div style="font-size:0.75rem;color:var(--text-muted);">总体磨合度</div>' +
      '<div style="font-size:1.6rem;font-weight:700;color:' +
      (ha.avgFriction <= 40 ? '#c8d8a8' : '#d8a8a8') +
      ';">' +
      ha.avgFriction +
      '%</div>' +
      '</div>' +
      '</div>' +
      '<div class="analysis-content" style="white-space:normal;margin-bottom:16px;">' +
      formatAnalysisText(ha.analysis) +
      '</div>';

    // 视觉化融洽度条
    html += '<div style="margin-top:12px;">';
    for (var pi = 0; pi < ha.pairs.length; pi++) {
      var p = ha.pairs[pi];
      var harmonyColor =
        p.harmony >= 80 ? '#c8d8a8' : p.harmony >= 60 ? '#e6d8a8' : p.harmony >= 40 ? '#d8c8a8' : '#d8a8a8';
      html +=
        '' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.8rem;">' +
        '<span style="min-width:80px;text-align:right;">' +
        safeHtml(p.iconA) +
        ' ' +
        safeHtml(p.methodA) +
        '</span>' +
        '<span style="color:var(--text-muted);">↔</span>' +
        '<span style="min-width:80px;">' +
        safeHtml(p.iconB) +
        ' ' +
        safeHtml(p.methodB) +
        '</span>' +
        '<div style="flex:1;height:8px;background:rgba(255,255,255,0.04);border-radius:4px;overflow:hidden;">' +
        '<div style="height:100%;width:' +
        p.harmony +
        '%;background:' +
        harmonyColor +
        ';border-radius:4px;transition:width 0.6s ease;"></div>' +
        '</div>' +
        '<span style="min-width:55px;text-align:right;font-size:0.75rem;color:' +
        harmonyColor +
        ';">' +
        p.harmony +
        '% ' +
        p.harmonyLevel +
        '</span>' +
        '</div>';
    }
    html += '</div></div>';
  }

  // --- 融合研判（深度解读） ---
  html +=
    '' +
    '<div class="glass-card mb-24">' +
    '<h3 style="color:var(--gold-light);margin-bottom:16px;">🌐 融合研判</h3>' +
    '<div class="analysis-content" style="white-space:normal;">' +
    formatAnalysisText(synthesis.narrative) +
    '</div>' +
    '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-muted);">' +
    '置信度：<span style="color:' +
    (synthesis.confidence === 'high' ? 'var(--gold)' : 'var(--text-secondary)') +
    ';">' +
    (synthesis.confidence === 'high'
      ? '高 · 各术数结论一致'
      : synthesis.confidence === 'medium'
        ? '中 · 存在部分分歧'
        : '低 · 数据不足') +
    '</span> · 术数分歧度：' +
    (synthesis.spread || 0) +
    '分' +
    '</div>' +
    '</div>';

  // --- 大师点评 ---
  var masterComments = data.masterComments || [];
  if (masterComments.length > 0) {
    html += '<div class="glass-card mb-24"><h3 style="color:var(--gold-light);margin-bottom:16px;">👨‍🏫 宗师汇评</h3>';
    for (var k = 0; k < masterComments.length; k++) {
      var mc = masterComments[k];
      html +=
        '' +
        '<div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">' +
        '<span style="font-size:1.3rem;">' +
        safeHtml(mc.avatar) +
        '</span>' +
        '<span style="font-family:var(--font-serif);font-weight:600;color:var(--gold);">' +
        safeHtml(mc.name) +
        '</span>' +
        '<span style="font-size:0.75rem;color:var(--text-muted);">· ' +
        safeHtml(mc.era) +
        ' · ' +
        safeHtml(mc.title) +
        '</span>' +
        '</div>' +
        '<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;font-style:italic;">「' +
        safeHtml(mc.style) +
        '」</div>' +
        '<div style="font-size:0.85rem;color:var(--text-secondary);line-height:1.8;">' +
        formatAnalysisText(mc.commentary) +
        '</div>' +
        '</div>';
    }
    html += '</div>';
  }

  // --- 免责声明 ---
  html +=
    '<div style="text-align:center;font-size:0.75rem;color:var(--text-muted);margin-top:20px;">多术数合参仅供参考，命由天定，运由己造。天机不可尽泄，留三分与造化。</div>';
  html += '</div>';

  container.innerHTML = html;
}
