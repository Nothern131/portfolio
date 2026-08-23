/**
 * 梅花易数组件
 * 自动起卦（日期/随机数）→ 本卦互卦变卦 → 体用生克
 * 后台综合算法：邵雍先天易学 + 体用生克体系
 */
function renderMeihuaComponent() {
  const container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML = `
    <div class="section-header">
      <h2 class="page-title">梅花易数</h2>
      <p class="page-subtitle">邵康节先生所创，以数起卦，观象玩辞。后台融合邵雍·先天易学算法</p>
    </div>

    <!-- 起卦 -->
    <div class="glass-card mb-24" id="meihua-cast-area">
      <div class="meihua-stage" id="meihua-stage">
        <div class="meihua-bagua-ring" id="meihua-bagua-ring">
          <span class="meihua-bagua-item">☰</span>
          <span class="meihua-bagua-item">☱</span>
          <span class="meihua-bagua-item">☲</span>
          <span class="meihua-bagua-item">☳</span>
          <span class="meihua-bagua-item">☴</span>
          <span class="meihua-bagua-item">☵</span>
          <span class="meihua-bagua-item">☶</span>
          <span class="meihua-bagua-item">☷</span>
        </div>
        <p class="meihua-prompt" id="meihua-prompt">以当前时辰之数，自动起卦</p>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn-gold lg" id="meihua-auto-cast">
          <span>🌸</span> 自动起卦
        </button>
        <button class="btn-gold outline sm" id="meihua-manual-toggle">
          🔢 自定义数字
        </button>
      </div>

      <!-- 所问之事 -->
      <div class="form-group" style="margin-top:20px;max-width:500px;margin-left:auto;margin-right:auto;">
        <label class="form-label">🔮 你所问之事（可选）—— 想通过此卦了解哪个方面的运势？</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;justify-content:center;" id="meihua-domain-tags">
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
        <input type="text" class="form-input" id="meihua-question-text" placeholder="或输入你想问的具体问题，如：最近事业运如何？...">
      </div>

      <!-- 自定义数字 -->
      <div class="hidden mt-24" id="meihua-manual-panel">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">上卦数</label>
            <input type="number" class="form-input" id="meihua-upper" placeholder="1-999" min="1" max="999">
          </div>
          <div class="form-group">
            <label class="form-label">下卦数</label>
            <input type="number" class="form-input" id="meihua-lower" placeholder="1-999" min="1" max="999">
          </div>
          <div class="form-group">
            <label class="form-label">动爻数</label>
            <input type="number" class="form-input" id="meihua-moving" placeholder="1-999" min="1" max="999">
          </div>
        </div>
        <button class="btn-gold" id="meihua-number-submit">🌸 起卦</button>
      </div>
    </div>

    <!-- 结果 -->
    <div id="meihua-result-area" class="hidden">
      <div class="glass-card" id="meihua-result-card"></div>
    </div>
  `;

  // 手动输入切换
  const manualToggle = container.querySelector('#meihua-manual-toggle');
  const manualPanel = container.querySelector('#meihua-manual-panel');
  manualToggle.addEventListener('click', () => {
    const isHidden = manualPanel.classList.contains('hidden');
    manualPanel.classList.toggle('hidden', !isHidden);
    manualToggle.textContent = isHidden ? '🔢 收起' : '🔢 自定义数字';
  });

  // 事域快捷按钮
  container.querySelector('#meihua-domain-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.domain) return;
    var questionInput = container.querySelector('#meihua-question-text');
    var domainText = btn.dataset.domain.replace(/^[^\s]+\s/, '');
    questionInput.value = '最近' + domainText + '运如何？';
    var allBtns = container.querySelectorAll('#meihua-domain-tags button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  // 自动起卦
  const autoCastBtn = container.querySelector('#meihua-auto-cast');
  const ringEl = container.querySelector('#meihua-bagua-ring');
  const promptEl = container.querySelector('#meihua-prompt');

  autoCastBtn.addEventListener('click', async () => {
    autoCastBtn.disabled = true;
    autoCastBtn.textContent = '⏳ 起卦中...';

    // 八卦环旋转动画
    ringEl.classList.add('spinning');
    promptEl.textContent = '天地定位，山泽通气...';

    await sleep(1200);

    ringEl.classList.remove('spinning');
    promptEl.textContent = '起卦完成，正在排盘...';

    await sleep(400);

    autoCastBtn.disabled = false;
    autoCastBtn.textContent = '🔄 重新起卦';

    await handleMeihuaSubmit(container, { method: 'datetime' });
  });

  // 自定义数字提交
  container.querySelector('#meihua-number-submit').addEventListener('click', async () => {
    const upper = container.querySelector('#meihua-upper').value;
    const lower = container.querySelector('#meihua-lower').value;
    const moving = container.querySelector('#meihua-moving').value;
    if (!upper || !lower) {
      showToast('请输入上卦数和下卦数');
      return;
    }
    await handleMeihuaSubmit(container, {
      method: 'number',
      upper: parseInt(upper),
      lower: parseInt(lower),
      moving: moving ? parseInt(moving) : undefined,
    });
  });

  return container;
}

/** 处理梅花易数请求 */
async function handleMeihuaSubmit(container, params) {
  const resultArea = container.querySelector('#meihua-result-area');
  const resultCard = container.querySelector('#meihua-result-card');

  resultArea.classList.remove('hidden');
  resultCard.innerHTML = '<div class="spinner"></div>';
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    // 纯前端本地算法，零API调用
    const result = MeihuaEngine.divine(params);

    // 问事分析
    var question = container.querySelector('#meihua-question-text').value.trim();
    var questionAnalysisHtml = '';
    if (question && typeof DomainAnalysis !== 'undefined') {
      var qaResult = DomainAnalysis.analyze('meihua', result, question);
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

    renderMeihuaResult(resultCard, result, questionAnalysisHtml);
  } catch (error) {
    resultCard.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-text">${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

function renderMeihuaResult(container, result, questionAnalysisHtml) {
  let html = '<div class="fade-in">';

  const original = result.original_gua || {};
  const hu = result.hu_gua || {};
  const changed = result.changed_gua || {};
  const tiGua = result.ti_gua || '';
  const yongGua = result.yong_gua || '';
  const shengKe = result.sheng_ke || {};

  // 三卦展示
  html += '<div class="card-grid cols-3 mb-24">';
  const guaTypes = [
    { label: '本卦', name: original.name || '—', detail: `${original.shang_gua || ''}上${original.xia_gua || ''}下` },
    { label: '互卦', name: hu.name || '—', detail: hu.shang_gua ? `${hu.shang_gua}上${hu.xia_gua}下` : '过程之象' },
    {
      label: '变卦',
      name: changed.name || '—',
      detail: changed.shang_gua ? `${changed.shang_gua}上${changed.xia_gua}下` : '结果之象',
    },
  ];
  guaTypes.forEach((g) => {
    html += `
      <div class="glass-card" style="text-align:center;">
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;letter-spacing:0.1em;">${g.label}</div>
        <div style="font-family:var(--font-serif);font-size:1.5rem;color:var(--gold-light);margin-bottom:6px;">${escapeHtml(g.name)}</div>
        <div style="font-size:0.8rem;color:var(--text-secondary);">${escapeHtml(g.detail)}</div>
      </div>
    `;
  });
  html += '</div>';

  // 体用生克
  const level = shengKe.等级 !== undefined ? shengKe.等级 : 2;
  const levelMap = { 0: '大凶', 1: '凶', 2: '小吉', 3: '中吉', 4: '大吉' };
  const levelLabel = levelMap[level] || '中平';
  const levelCls = level >= 3 ? 'auspicious' : level <= 1 ? 'inauspicious' : 'neutral';
  html += `
    <div class="glass-card mb-24">
      <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:12px;font-size:1rem;">⚖️ 体用生克</h3>
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <span class="badge badge-gold" style="font-size:0.85rem;padding:6px 18px;">体：${escapeHtml(tiGua)}</span>
        <span class="badge badge-gold" style="font-size:0.85rem;padding:6px 18px;">用：${escapeHtml(yongGua)}</span>
        <span style="font-size:0.9rem;color:var(--text-primary);">→ ${escapeHtml(shengKe.关系 || '')}</span>
        <span class="verse-level ${levelCls}">${levelLabel}</span>
      </div>
      ${shengKe.说明 ? `<div class="analysis-content mt-16">${escapeHtml(shengKe.说明)}</div>` : ''}
    </div>
  `;

  // 万物类象
  if (result.wanwu_leixiang) {
    const wx = result.wanwu_leixiang;
    html += `
      <div class="glass-card mb-24">
        <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:12px;font-size:1rem;">🌏 万物类象</h3>
        <div class="card-grid cols-2">
          ${
            wx.体卦
              ? `
            <div class="detail-item">
              <div class="detail-label">体卦 · ${escapeHtml(wx.体卦.卦名 || '')}（${escapeHtml(wx.体卦.五行 || '')}）</div>
              <div class="detail-value">方位${escapeHtml(wx.体卦.方位 || '')} · ${escapeHtml(wx.体卦.人事 || '')} · ${escapeHtml(wx.体卦.身体 || '')} · ${escapeHtml(wx.体卦.颜色 || '')} · ${escapeHtml(wx.体卦.季节 || '')}</div>
            </div>
          `
              : ''
          }
          ${
            wx.用卦
              ? `
            <div class="detail-item">
              <div class="detail-label">用卦 · ${escapeHtml(wx.用卦.卦名 || '')}（${escapeHtml(wx.用卦.五行 || '')}）</div>
              <div class="detail-value">方位${escapeHtml(wx.用卦.方位 || '')} · ${escapeHtml(wx.用卦.人事 || '')} · ${escapeHtml(wx.用卦.身体 || '')} · ${escapeHtml(wx.用卦.颜色 || '')} · ${escapeHtml(wx.用卦.季节 || '')}</div>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  // 解读
  if (result.interpretation) {
    html += `
      <div class="glass-card">
        <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:12px;font-size:1rem;">📖 卦象解读</h3>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">
          后台算法：邵雍·先天易学 → 体用生克综合断卦
        </div>
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
