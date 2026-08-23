/**
 * 奇门遁甲组件
 * 日期时间起局 → 九宫格展示 → 八门九星八神
 */
function renderQimenComponent() {
  const container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML = `
    <div class="section-header">
      <h2 class="page-title">奇门遁甲</h2>
      <p class="page-subtitle">帝王之学，九宫八卦，八门九星八神，趋吉避凶</p>
    </div>

    <!-- 起局 -->
    <div class="glass-card mb-24">
      <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;font-size:1rem;">起局参数</h3>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">日期</label>
          <input type="date" class="form-input" id="qimen-date">
        </div>
        <div class="form-group">
          <label class="form-label">时辰</label>
          <select class="form-select" id="qimen-time">
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
        <div class="form-group">
          <label class="form-label">局数</label>
          <select class="form-select" id="qimen-ju">
            <option value="auto">自动</option>
            <option value="yang-1">阳遁一局</option>
            <option value="yang-2">阳遁二局</option>
            <option value="yang-3">阳遁三局</option>
            <option value="yang-4">阳遁四局</option>
            <option value="yang-5">阳遁五局</option>
            <option value="yang-6">阳遁六局</option>
            <option value="yang-7">阳遁七局</option>
            <option value="yang-8">阳遁八局</option>
            <option value="yang-9">阳遁九局</option>
            <option value="yin-1">阴遁一局</option>
            <option value="yin-2">阴遁二局</option>
            <option value="yin-3">阴遁三局</option>
            <option value="yin-4">阴遁四局</option>
            <option value="yin-5">阴遁五局</option>
            <option value="yin-6">阴遁六局</option>
            <option value="yin-7">阴遁七局</option>
            <option value="yin-8">阴遁八局</option>
            <option value="yin-9">阴遁九局</option>
          </select>
        </div>
      </div>
      <button class="btn-gold lg" id="qimen-submit-btn" style="width:100%;margin-top:8px;">🚪 起局</button>

      <!-- 所问之事 -->
      <div class="form-group" style="margin-top:16px;">
        <label class="form-label">🔮 你所问之事（可选）—— 想通过奇门了解哪个方面的运势？</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;" id="qimen-domain-tags">
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
        <input type="text" class="form-input" id="qimen-question-text" placeholder="或输入你想问的具体问题，如：最近事业运如何？...">
      </div>
    </div>

    <!-- 九宫格 -->
    <div id="qimen-result-area" class="hidden">
      <div class="glass-card" id="qimen-result-card"></div>
    </div>
  `;

  // 提交
  container.querySelector('#qimen-submit-btn').addEventListener('click', async () => {
    const date = container.querySelector('#qimen-date').value;
    const time = container.querySelector('#qimen-time').value;
    const ju = container.querySelector('#qimen-ju').value;

    if (!date) {
      showToast('请选择日期');
      return;
    }
    if (!time) {
      showToast('请选择时辰');
      return;
    }

    await handleQimenSubmit(container, { date, time, ju });
  });

  // 事域快捷按钮
  container.querySelector('#qimen-domain-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.domain) return;
    var questionInput = container.querySelector('#qimen-question-text');
    var domainText = btn.dataset.domain.replace(/^[^\s]+\s/, '');
    questionInput.value = '最近' + domainText + '运如何？';
    var allBtns = container.querySelectorAll('#qimen-domain-tags button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  return container;
}

/** 处理奇门遁甲请求 */
async function handleQimenSubmit(container, params) {
  const resultArea = container.querySelector('#qimen-result-area');
  const resultCard = container.querySelector('#qimen-result-card');

  resultArea.classList.remove('hidden');
  resultCard.innerHTML = '<div class="spinner"></div>';

  try {
    // 纯前端本地算法，零API调用
    const result = QimenEngine.divine(params.date, params.time, params.ju);

    // 问事分析
    var question = container.querySelector('#qimen-question-text').value.trim();
    var questionAnalysisHtml = '';
    if (question && typeof DomainAnalysis !== 'undefined') {
      var qaResult = DomainAnalysis.analyze('qimen', result, question);
      if (qaResult) {
        questionAnalysisHtml =
          '<hr class="section-divider"><div class="analysis-section" style="background:rgba(184,154,92,0.03);border:1px solid var(--border-subtle);border-radius:12px;padding:20px;margin-top:20px;"><h3 style="color:var(--gold-light);">' +
          qaResult.domain.icon +
          ' 所问之事：' +
          qaResult.domain.name +
          '</h3><div class="analysis-content">' +
          formatAnalysisText(qaResult.analysis) +
          '</div></div>';
      }
    }

    renderQimenResult(resultCard, result, questionAnalysisHtml);
  } catch (error) {
    resultCard.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-text">${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

/** 渲染奇门遁甲九宫格 */
function renderQimenResult(container, result, questionAnalysisHtml) {
  // 九宫格布局：4 9 2 / 3 5 7 / 8 1 6
  const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  const gridLabels = {
    1: '坎一宫',
    2: '坤二宫',
    3: '震三宫',
    4: '巽四宫',
    5: '中五宫',
    6: '乾六宫',
    7: '兑七宫',
    8: '艮八宫',
    9: '离九宫',
  };

  const cells = result.cells || {};

  let html = `
    <div class="fade-in">
      <div style="text-align:center;margin-bottom:20px;">
        <h3 style="font-family:var(--font-serif);color:var(--gold-light);">奇门遁甲盘</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);">${escapeHtml(result.period || '')} · ${escapeHtml(result.ju || '')}局</p>
      </div>

      <div class="qimen-grid">
  `;

  gridOrder.forEach((pos) => {
    const cell = cells[pos] || {};
    const label = gridLabels[pos] || `宫${pos}`;

    html += `
      <div class="qimen-cell">
        <div style="font-size:0.65rem;color:var(--text-muted);">${label}</div>
        <div class="cell-main">${escapeHtml(cell.di_pan || '—')}</div>
        <div class="cell-sub">${escapeHtml(cell.tian_pan || '')}</div>
        <div class="cell-door">${escapeHtml(cell.door || '')}</div>
        <div class="cell-sub">${escapeHtml(cell.star || '')}</div>
        <div class="cell-sub">${escapeHtml(cell.god || '')}</div>
      </div>
    `;
  });

  html += `
      </div>
  `;

  // 图例
  html += `
      <div style="margin-top:20px;padding:12px;background:rgba(255,255,255,0.02);border-radius:8px;display:flex;flex-wrap:wrap;gap:16px;justify-content:center;font-size:0.8rem;color:var(--text-muted);">
        <span>大字：地盘干</span>
        <span>小字：天盘干</span>
        <span style="color:var(--gold);">彩字：八门</span>
        <span>小字：九星 / 八神</span>
      </div>
  `;

  // 解读
  if (result.interpretation) {
    html += `
      <hr class="section-divider">
      <div class="analysis-section">
        <h3>📖 局象解读</h3>
        <div class="analysis-content">${formatAnalysisText(result.interpretation)}</div>
      </div>
    `;
  }

  if (questionAnalysisHtml) {
    html += questionAnalysisHtml;
  }

  html += '</div>';

  container.innerHTML = html;
}
