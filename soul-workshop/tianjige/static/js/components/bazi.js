/**
 * 八字排盘组件 v2
 * 出生信息输入 → 四柱展示 → 分析 Tab
 */
function renderBaziComponent(state) {
  state = state || {};
  state.userInfo = state.userInfo || {};

  const container = document.createElement('div');
  container.className = 'fade-in';

  let baziResult = null;

  container.innerHTML = `
    <div class="section-header">
      <h2 class="page-title">八字排盘</h2>
      <p class="page-subtitle">请输入出生信息，查看四柱八字与命理分析</p>
    </div>

    <!-- 输入区域 -->
    <div class="glass-card mb-24" id="bazi-input-card">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">姓名</label>
          <input type="text" class="form-input" id="bazi-name" placeholder="请输入姓名" value="${escapeHtml(state.userInfo.name || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">性别</label>
          <select class="form-select" id="bazi-gender">
            <option value="male" ${state.userInfo.gender === 'male' ? 'selected' : ''}>男</option>
            <option value="female" ${state.userInfo.gender === 'female' ? 'selected' : ''}>女</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">出生日期</label>
          <input type="date" class="form-input" id="bazi-date" value="${state.userInfo.birthDate || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">出生时辰</label>
          <select class="form-select" id="bazi-time">
            <option value="">请选择时辰</option>
            <option value="子时">子时 (23:00-01:00)</option>
            <option value="丑时">丑时 (01:00-03:00)</option>
            <option value="寅时">寅时 (03:00-05:00)</option>
            <option value="卯时">卯时 (05:00-07:00)</option>
            <option value="辰时">辰时 (07:00-09:00)</option>
            <option value="巳时">巳时 (09:00-11:00)</option>
            <option value="午时">午时 (11:00-13:00)</option>
            <option value="未时">未时 (13:00-15:00)</option>
            <option value="申时">申时 (15:00-17:00)</option>
            <option value="酉时">酉时 (17:00-19:00)</option>
            <option value="戌时">戌时 (19:00-21:00)</option>
            <option value="亥时">亥时 (21:00-23:00)</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">出生地点</label>
        <input type="text" class="form-input" id="bazi-location" placeholder="如：北京" value="${escapeHtml(state.userInfo.location || '')}">
      </div>

      <!-- 所问之事 -->
      <div class="form-group" style="margin-top:16px;">
        <label class="form-label">🔮 你所问之事（可选）—— 想通过八字了解哪个方面的运势？</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;" id="bazi-domain-tags">
          ${['💼 事业', '💕 感情', '💰 财运', '🏥 健康', '📚 学业', '🏠 家庭', '🤝 人际', '✈️ 出行']
            .map(function (d) {
              return (
                '<button class="btn-gold outline" style="font-size:0.75rem;padding:4px 10px;" data-domain="' +
                d +
                '">' +
                d +
                '</button>'
              );
            })
            .join('')}
        </div>
        <input type="text" class="form-input" id="bazi-question-text" placeholder="或输入你想问的具体问题，如：最近事业运如何？...">
      </div>

      <button class="btn-gold lg" id="bazi-submit-btn" style="width:100%;margin-top:8px;">☯ 开始排盘</button>
    </div>

    <!-- 结果区域（初始隐藏） -->
    <div id="bazi-result-area" class="hidden">
      <!-- 四柱 -->
      <div class="glass-card mb-24" id="bazi-pillars-card">
        <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;">四柱八字</h3>
        <div id="bazi-pillars-content"></div>
      </div>

      <!-- 问事分析 -->
      <div id="bazi-question-analysis" class="hidden"></div>

      <!-- 分析 Tab -->
      <div class="glass-card" id="bazi-analysis-card">
        <div class="tabs" id="bazi-analysis-tabs"></div>
        <div id="bazi-tab-content"></div>
      </div>
    </div>
  `;

  // 预填时辰
  var timeSelect = container.querySelector('#bazi-time');
  if (state.userInfo.birthTime && timeSelect) {
    timeSelect.value = state.userInfo.birthTime;
  }

  // 绑定提交
  container.querySelector('#bazi-submit-btn').addEventListener('click', function () {
    handleBaziSubmit(container, state);
  });

  // 事域快捷按钮
  container.querySelector('#bazi-domain-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.domain) return;
    var questionInput = container.querySelector('#bazi-question-text');
    var domainText = btn.dataset.domain.replace(/^[^\s]+\s/, '');
    questionInput.value = '最近' + domainText + '运如何？';
    var allBtns = container.querySelectorAll('#bazi-domain-tags button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  return container;
}

/** 处理八字提交 */
async function handleBaziSubmit(container, state) {
  var name = container.querySelector('#bazi-name').value.trim();
  var gender = container.querySelector('#bazi-gender').value;
  var date = container.querySelector('#bazi-date').value;
  var time = container.querySelector('#bazi-time').value;
  var location = container.querySelector('#bazi-location').value.trim();

  if (!date) {
    showToast('请输入出生日期');
    return;
  }
  if (!time) {
    showToast('请选择出生时辰');
    return;
  }

  state.userInfo = { name: name, gender: gender, birthDate: date, birthTime: time, location: location };

  var resultArea = container.querySelector('#bazi-result-area');
  var pillarsContent = container.querySelector('#bazi-pillars-content');
  var submitBtn = container.querySelector('#bazi-submit-btn');

  resultArea.classList.remove('hidden');
  pillarsContent.innerHTML = '<div class="spinner"></div>';
  submitBtn.disabled = true;
  submitBtn.textContent = '排盘中...';

  try {
    // 纯前端算法排盘，无API调用
    var dateParts = date.split('-');
    var year = parseInt(dateParts[0]),
      month = parseInt(dateParts[1]),
      day = parseInt(dateParts[2]);
    var hour = SHICHEN_NAMES[time] || 0;
    var result = BaziEngine.paipan(year, month, day, hour);

    // 渲染四柱
    renderPillarsV2(pillarsContent, result);

    // 问事分析
    var question = container.querySelector('#bazi-question-text').value.trim();
    var qaDiv = container.querySelector('#bazi-question-analysis');
    if (question && typeof DomainAnalysis !== 'undefined') {
      var qaResult = DomainAnalysis.analyze('bazi', result, question);
      if (qaResult) {
        qaDiv.classList.remove('hidden');
        qaDiv.innerHTML =
          '<div class="glass-card mb-24" style="background:rgba(184,154,92,0.03);border:1px solid var(--border-subtle);"><h3 style="color:var(--gold-light);">' +
          qaResult.domain.icon +
          ' 所问之事：' +
          qaResult.domain.name +
          '</h3><div class="analysis-content" style="margin-top:12px;">' +
          formatAnalysisText(qaResult.analysis) +
          '</div></div>';
      } else {
        qaDiv.classList.add('hidden');
      }
    } else {
      qaDiv.classList.add('hidden');
    }

    // 渲染分析 Tab
    renderAnalysisTabs(container, result, state);

    // 自动保存咨询记录到用户档案
    try {
      if (typeof UserProfileAPI !== 'undefined') {
        UserProfileAPI.addRecord({
          type: 'bazi',
          question: '八字排盘',
          score: 60,
          result: {
            pillars: result.pillars || {},
            name: state.userInfo && state.userInfo.name ? state.userInfo.name : ''
          }
        });
      }
    } catch(e) {}
  } catch (error) {
    pillarsContent.innerHTML =
      '<div class="error-container">' +
      '<div class="error-icon">⚠️</div>' +
      '<div class="error-text">' +
      escapeHtml(error.message || '排盘失败') +
      '</div>' +
      '<button class="btn-gold outline sm mt-16" onclick="this.closest(\'#bazi-result-area\').classList.add(\'hidden\')">返回</button>' +
      '</div>';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '☯ 开始排盘';
  }
}

/** 渲染四柱表格 v2 — 适配实际 API 返回格式 */
function renderPillarsV2(container, result) {
  var pillars = ['年柱', '月柱', '日柱', '时柱'];
  var labels = ['年柱', '月柱', '日柱', '时柱'];
  var gan = ['', '', '', '']; // 天干
  var zhi = ['', '', '', '']; // 地支

  pillars.forEach(function (key, i) {
    var val = result[key] || '';
    if (val.length >= 2) {
      gan[i] = val[0];
      zhi[i] = val[1];
    } else {
      gan[i] = val;
    }
  });

  // 五行属性
  var wuxingMap = {
    甲: '木',
    乙: '木',
    丙: '火',
    丁: '火',
    戊: '土',
    己: '土',
    庚: '金',
    辛: '金',
    壬: '水',
    癸: '水',
    子: '水',
    丑: '土',
    寅: '木',
    卯: '木',
    辰: '土',
    巳: '火',
    午: '火',
    未: '土',
    申: '金',
    酉: '金',
    戌: '土',
    亥: '水',
  };

  // 阴阳
  var yinyangMap = {
    甲: '阳',
    丙: '阳',
    戊: '阳',
    庚: '阳',
    壬: '阳',
    乙: '阴',
    丁: '阴',
    己: '阴',
    辛: '阴',
    癸: '阴',
    子: '阳',
    寅: '阳',
    辰: '阳',
    午: '阳',
    申: '阳',
    戌: '阳',
    丑: '阴',
    卯: '阴',
    巳: '阴',
    未: '阴',
    酉: '阴',
    亥: '阴',
  };

  var html = '<table class="data-table"><thead><tr><th></th>';
  labels.forEach(function (l) {
    html += '<th>' + l + '</th>';
  });
  html += '</tr></thead><tbody>';

  // 天干行
  html += '<tr><td style="color:var(--text-muted);">天干</td>';
  gan.forEach(function (g, i) {
    var wx = wuxingMap[g] || '';
    var yy = yinyangMap[g] || '';
    html +=
      '<td><span class="stem-branch" style="font-size:1.2rem;font-weight:700;color:var(--gold-light);">' +
      escapeHtml(g) +
      '</span><br><span style="font-size:0.7rem;color:var(--text-muted);">' +
      wx +
      ' ' +
      yy +
      '</span></td>';
  });
  html += '</tr>';

  // 地支行
  html += '<tr><td style="color:var(--text-muted);">地支</td>';
  zhi.forEach(function (z, i) {
    var wx = wuxingMap[z] || '';
    var yy = yinyangMap[z] || '';
    html +=
      '<td><span class="stem-branch" style="font-size:1.2rem;font-weight:700;color:var(--gold-light);">' +
      escapeHtml(z) +
      '</span><br><span style="font-size:0.7rem;color:var(--text-muted);">' +
      wx +
      ' ' +
      yy +
      '</span></td>';
  });
  html += '</tr>';

  // 干支合并行
  html += '<tr><td style="color:var(--text-muted);">干支</td>';
  gan.forEach(function (g, i) {
    html +=
      '<td style="font-family:var(--font-serif);font-size:1.1rem;color:var(--gold);">' +
      escapeHtml(g + zhi[i]) +
      '</td>';
  });
  html += '</tr>';

  html += '</tbody></table>';
  container.innerHTML = html;
}

// 时辰名称→小时映射
var SHICHEN_NAMES = {
  子时: 0,
  丑时: 2,
  寅时: 4,
  卯时: 6,
  辰时: 8,
  巳时: 10,
  午时: 12,
  未时: 14,
  申时: 16,
  酉时: 18,
  戌时: 20,
  亥时: 22,
};

/** 渲染分析 Tab 导航 */
function renderAnalysisTabs(container, result, state) {
  var tabsEl = container.querySelector('#bazi-analysis-tabs');
  var contentEl = container.querySelector('#bazi-tab-content');
  if (!tabsEl || !contentEl) return;

  var analysisTabs = [
    { id: 'lifeline', label: '人生K线', icon: '📈' },
    { id: 'monthly', label: '流月', icon: '🌙' },
    { id: 'wealth', label: '财富', icon: '💰' },
    { id: 'talent', label: '天赋', icon: '🌟' },
    { id: 'balance', label: '反内耗', icon: '🧘' },
    { id: 'dateselect', label: '择日', icon: '📆' },
    { id: 'love', label: '正缘', icon: '💕' },
  ];

  tabsEl.innerHTML = analysisTabs
    .map(function (tab) {
      return (
        '<button class="tab-btn' +
        (tab.id === 'lifeline' ? ' active' : '') +
        '" data-tab="' +
        tab.id +
        '">' +
        tab.icon +
        ' ' +
        tab.label +
        '</button>'
      );
    })
    .join('');

  // 加载默认 Tab
  setTimeout(function () {
    loadAnalysisTab(contentEl, 'lifeline', state, result);
  }, 100);

  // Tab 切换
  tabsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabsEl.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    loadAnalysisTab(contentEl, btn.dataset.tab, state, result);
  });
}

/** 加载分析 Tab 内容 */
async function loadAnalysisTab(contentEl, tabId, state, result) {
  contentEl.innerHTML = '<div class="spinner"></div>';

  var tabLabels = {
    lifeline: '人生K线',
    monthly: '流月',
    wealth: '财富',
    talent: '天赋',
    balance: '反内耗',
    dateselect: '择日',
    love: '正缘',
  };

  var label = tabLabels[tabId] || tabId;
  if (!label || label === tabId) {
    contentEl.innerHTML = '<div class="error-container"><div class="error-text">未知分析类型</div></div>';
    return;
  }

  try {
    var analysisData;

    // 纯前端算法分析，无API调用
    switch (tabId) {
      case 'lifeline':
        var dateParts = state.userInfo.birthDate.split('-');
        analysisData = BaziEngine.lifeline(
          result,
          state.userInfo.gender,
          parseInt(dateParts[0]),
          parseInt(dateParts[1]),
          parseInt(dateParts[2])
        );
        break;
      case 'monthly':
        analysisData = BaziEngine.monthly(result);
        break;
      case 'wealth':
        analysisData = BaziEngine.wealth(result);
        break;
      case 'talent':
        analysisData = BaziEngine.talent(result);
        break;
      case 'balance':
        analysisData = BaziEngine.balance(result);
        break;
      case 'dateselect':
        analysisData = BaziEngine.dateSelect();
        break;
      case 'love':
        analysisData = BaziEngine.love(result, state.userInfo.gender);
        break;
      default:
        analysisData = { analysis: '暂无分析结果' };
    }

    // K线特殊处理：渲染Canvas图表
    if (tabId === 'lifeline' && analysisData.lifeline && analysisData.lifeline.length > 0) {
      renderLifelineChart(contentEl, analysisData, label);
      return;
    }

    var text = analysisData.analysis || '暂无分析结果';
    var scoreHtml = analysisData.score ? '<span class="score-badge">评分：' + analysisData.score + '</span>' : '';

    contentEl.innerHTML =
      '<div class="analysis-section fade-in">' +
      '<h3>' +
      label +
      '分析 ' +
      scoreHtml +
      '</h3>' +
      '<div class="analysis-content">' +
      formatAnalysisText(text) +
      '</div>' +
      '</div>';
  } catch (error) {
    contentEl.innerHTML =
      '<div class="error-container">' +
      '<div class="error-icon">⚠️</div>' +
      '<div class="error-text">' +
      escapeHtml(error.message || '分析失败') +
      '</div>' +
      '</div>';
  }
}

/** 渲染K线Canvas图表 */
function renderLifelineChart(contentEl, data, label) {
  var lifeline = data.lifeline;
  var qiyunAge = data.qiyunAge || 0;
  var direction = data.direction || '';
  var userAge = data.userAge || 0;
  var currentDayun = data.currentDayun;
  var text = data.analysis || '';

  // 构建HTML：Canvas图表 + 文字分析
  var html = '<div class="analysis-section fade-in">';
  html += '<h3>' + label + '分析</h3>';

  // Canvas容器
  html += '<div class="glass-card" style="padding:12px;margin-bottom:16px;background:rgba(18,18,26,0.6);">';
  html += '<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;text-align:center;">';
  html += '大运' + direction + ' · 起运年龄：' + qiyunAge + '岁 · 当前' + userAge + '岁';
  html += '</div>';
  html += '<canvas id="lifeline-canvas" style="width:100%;height:320px;display:block;"></canvas>';
  html +=
    '<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:0.7rem;color:var(--text-muted);">';
  html += '<span>🔴 低潮期（<45分）</span><span>🟡 平稳期（45-60分）</span><span>🟢 上升期（>60分）</span>';
  html += '</div>';
  html += '</div>';

  // 详细文字分析
  html += '<div class="analysis-content">' + formatAnalysisText(text) + '</div>';
  html += '</div>';

  contentEl.innerHTML = html;

  // 绘制Canvas图表
  setTimeout(function () {
    drawLifelineCanvas(lifeline, userAge, currentDayun);
  }, 150);
}

/** 在Canvas上绘制K线图 */
function drawLifelineCanvas(lifeline, userAge, currentDayun) {
  var canvas = document.getElementById('lifeline-canvas');
  if (!canvas) return;

  var container = canvas.parentElement;
  var containerWidth = container.clientWidth - 24; // padding
  canvas.width = containerWidth * 2; // 2x for retina
  canvas.height = 640;
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = '320px';

  var ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  var W = containerWidth;
  var H = 320;
  var padding = { top: 30, right: 20, bottom: 50, left: 50 };
  var chartW = W - padding.left - padding.right;
  var chartH = H - padding.top - padding.bottom;

  // 清除
  ctx.clearRect(0, 0, W, H);

  // 背景网格
  ctx.strokeStyle = 'rgba(184,154,92,0.06)';
  ctx.lineWidth = 0.5;
  for (var i = 0; i <= 6; i++) {
    var y = padding.top + (chartH / 6) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();
  }

  // 水平参考线标注
  ctx.fillStyle = 'rgba(184,154,92,0.3)';
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'right';
  var scoreLabels = [100, 80, 60, 40, 20, 0];
  for (var si = 0; si < scoreLabels.length; si++) {
    var sy = padding.top + (chartH / 5) * si;
    ctx.fillText(scoreLabels[si], padding.left - 8, sy + 3);
  }

  // 颜色区域
  var gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
  gradient.addColorStop(0, 'rgba(200,216,168,0.08)'); // 绿色区（高分）
  gradient.addColorStop(0.4, 'rgba(200,216,168,0.08)');
  gradient.addColorStop(0.4, 'rgba(230,226,216,0.04)'); // 黄色区
  gradient.addColorStop(0.7, 'rgba(230,226,216,0.04)');
  gradient.addColorStop(0.7, 'rgba(216,168,168,0.06)'); // 红色区
  gradient.addColorStop(1, 'rgba(216,168,168,0.06)');
  ctx.fillStyle = gradient;
  ctx.fillRect(padding.left, padding.top, chartW, chartH);

  // 及格线（60分）
  var passLineY = padding.top + chartH * (1 - 60 / 100);
  ctx.strokeStyle = 'rgba(201,169,110,0.2)';
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(padding.left, passLineY);
  ctx.lineTo(W - padding.right, passLineY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(201,169,110,0.5)';
  ctx.textAlign = 'left';
  ctx.fillText('60分', W - padding.right + 4, passLineY + 3);

  // 计算数据点位置
  var points = [];
  var minAge = lifeline[0].age;
  var maxAge = lifeline[lifeline.length - 1].age + 10;

  for (var i = 0; i < lifeline.length; i++) {
    var d = lifeline[i];
    var x = padding.left + ((d.age - minAge) / (maxAge - minAge)) * chartW;
    var y = padding.top + chartH * (1 - d.fortune / 100);
    points.push({ x: x, y: y, data: d });
  }

  // 绘制折线下方渐变填充
  ctx.beginPath();
  ctx.moveTo(points[0].x, padding.top + chartH);
  for (var pi = 0; pi < points.length; pi++) {
    ctx.lineTo(points[pi].x, points[pi].y);
  }
  ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
  ctx.closePath();
  var fillGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
  fillGrad.addColorStop(0, 'rgba(200,216,168,0.2)');
  fillGrad.addColorStop(0.5, 'rgba(230,226,216,0.1)');
  fillGrad.addColorStop(1, 'rgba(216,168,168,0.1)');
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // 绘制折线
  ctx.strokeStyle = 'rgba(201,169,110,0.8)';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (var pj = 1; pj < points.length; pj++) {
    ctx.lineTo(points[pj].x, points[pj].y);
  }
  ctx.stroke();

  // 绘制数据点和标签
  for (var pk = 0; pk < points.length; pk++) {
    var pt = points[pk];
    var d = pt.data;

    // 判断颜色
    var pointColor;
    if (d.fortune >= 65) pointColor = '#c8d8a8';
    else if (d.fortune >= 45) pointColor = '#e6d8a8';
    else pointColor = '#d8a8a8';

    // 当前大运高亮
    if (currentDayun && d.dayun === currentDayun.dayun) {
      // 光晕
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,169,110,0.15)';
      ctx.fill();
      // 外圈
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201,169,110,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 数据点圆
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = pointColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(18,18,26,0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 分数标签
    ctx.fillStyle = pointColor;
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.fortune, pt.x, pt.y - 12);

    // 大运干支标签
    ctx.fillStyle = 'rgba(230,226,216,0.7)';
    ctx.font = '9px sans-serif';
    ctx.fillText(d.dayun, pt.x, pt.y + 18);

    // 年龄段标签
    ctx.fillStyle = 'rgba(184,154,92,0.5)';
    ctx.font = '8px sans-serif';
    var ageLabel = d.ageRange || d.age + '岁';
    ctx.fillText(ageLabel, pt.x, pt.y + 30);
  }

  // 当前年龄指示线
  if (userAge > 0 && currentDayun) {
    var currentAgeX = padding.left + ((userAge - minAge) / (maxAge - minAge)) * chartW;
    if (currentAgeX >= padding.left && currentAgeX <= W - padding.right) {
      ctx.strokeStyle = 'rgba(201,169,110,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(currentAgeX, padding.top);
      ctx.lineTo(currentAgeX, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      // 标签
      ctx.fillStyle = 'rgba(201,169,110,0.9)';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('当前' + userAge + '岁', currentAgeX, padding.top - 8);
    }
  }

  // 轴标签
  ctx.fillStyle = 'rgba(184,154,92,0.5)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('年龄 →', W / 2, H - 8);
}

/** 格式化分析文本 */
function formatAnalysisText(text) {
  if (!text) return '<p>暂无数据</p>';
  return text
    .split('\n')
    .filter(function (line) {
      return line.trim();
    })
    .map(function (line) {
      return '<p>' + escapeHtml(line) + '</p>';
    })
    .join('');
}

/** HTML 转义 */
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  var div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/** Toast 提示 */
function showToast(message, duration) {
  duration = duration || 3000;
  var toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.style.cssText =
      'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);' +
      'background:rgba(18,18,26,0.95);border:1px solid rgba(201,169,110,0.2);' +
      'color:#e6e2d8;padding:12px 24px;border-radius:8px;' +
      'font-size:0.9rem;z-index:9999;backdrop-filter:blur(12px);' +
      'transition:opacity 0.3s ease;opacity:0;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(function () {
    toast.style.opacity = '0';
  }, duration);
}
