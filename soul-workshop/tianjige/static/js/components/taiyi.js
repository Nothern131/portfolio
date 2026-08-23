/**
 * 太乙神数组件
 * 日期时间起算 → 太乙十六神 → 五福三基
 */
function renderTaiyiComponent() {
  const container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML = `
    <div class="section-header">
      <h2 class="page-title">太乙神数</h2>
      <p class="page-subtitle">三式之首，太乙巡行九宫，十六神定吉凶</p>
    </div>

    <!-- 起算 -->
    <div class="glass-card mb-24">
      <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;font-size:1rem;">起算参数</h3>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">日期</label>
          <input type="date" class="form-input" id="taiyi-date">
        </div>
        <div class="form-group">
          <label class="form-label">时辰</label>
          <select class="form-select" id="taiyi-time">
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
      <button class="btn-gold lg" id="taiyi-submit-btn" style="width:100%;margin-top:8px;">⭐ 起算</button>

      <!-- 所问之事 -->
      <div class="form-group" style="margin-top:16px;">
        <label class="form-label">🔮 你所问之事（可选）—— 想通过太乙了解哪个方面的运势？</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;" id="taiyi-domain-tags">
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
        <input type="text" class="form-input" id="taiyi-question-text" placeholder="或输入你想问的具体问题，如：最近事业运如何？...">
      </div>
    </div>

    <!-- 结果 -->
    <div id="taiyi-result-area" class="hidden">
      <div class="glass-card" id="taiyi-result-card"></div>
    </div>
  `;

  // 提交
  container.querySelector('#taiyi-submit-btn').addEventListener('click', async () => {
    const date = container.querySelector('#taiyi-date').value;
    const time = container.querySelector('#taiyi-time').value;

    if (!date) {
      showToast('请选择日期');
      return;
    }
    if (!time) {
      showToast('请选择时辰');
      return;
    }

    await handleTaiyiSubmit(container, { date, time });
  });

  // 事域快捷按钮
  container.querySelector('#taiyi-domain-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.domain) return;
    var questionInput = container.querySelector('#taiyi-question-text');
    var domainText = btn.dataset.domain.replace(/^[^\s]+\s/, '');
    questionInput.value = '最近' + domainText + '运如何？';
    var allBtns = container.querySelectorAll('#taiyi-domain-tags button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  return container;
}

/** 处理太乙神数请求 */
async function handleTaiyiSubmit(container, params) {
  const resultArea = container.querySelector('#taiyi-result-area');
  const resultCard = container.querySelector('#taiyi-result-card');

  resultArea.classList.remove('hidden');
  resultCard.innerHTML = '<div class="spinner"></div>';

  try {
    // 纯前端本地算法，零API调用
    const result = TaiyiEngine.divine(params.date, params.time);

    // 问事分析
    var question = container.querySelector('#taiyi-question-text').value.trim();
    var questionAnalysisHtml = '';
    if (question && typeof DomainAnalysis !== 'undefined') {
      var qaResult = DomainAnalysis.analyze('taiyi', result, question);
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

    renderTaiyiResult(resultCard, result, questionAnalysisHtml);
  } catch (error) {
    resultCard.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-text">${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

/** 渲染太乙神数结果 */
function renderTaiyiResult(container, result, questionAnalysisHtml) {
  let html = `
    <div class="fade-in">
      <div style="text-align:center;margin-bottom:20px;">
        <h3 style="font-family:var(--font-serif);color:var(--gold-light);">太乙神数盘</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);">
          ${escapeHtml(result.epoch || '')} · 积年 ${escapeHtml(String(result.ji_nian || '—'))}
        </p>
      </div>
  `;

  // 太乙十六神
  if (result.gods && result.gods.length) {
    html += `
      <h4 style="color:var(--gold);margin-bottom:12px;font-size:0.9rem;">太乙十六神</h4>
      <div class="taiyi-positions">
    `;

    result.gods.forEach((god) => {
      html += `
        <div class="taiyi-card">
          <div class="taiyi-name">${escapeHtml(god.name || '—')}</div>
          <div class="taiyi-position">${escapeHtml(god.position || '')}</div>
        </div>
      `;
    });

    html += '</div>';
  }

  // 五福三基
  if (result.wufu || result.sanji) {
    html += `
      <div class="card-grid cols-2 mt-24">
    `;

    if (result.wufu) {
      html += `
        <div class="glass-card" style="text-align:center;">
          <div style="font-size:1.5rem;margin-bottom:8px;">🪷</div>
          <div style="font-family:var(--font-serif);color:var(--gold);margin-bottom:4px;">五福</div>
          <div style="color:var(--text-secondary);font-size:0.9rem;">${escapeHtml(typeof result.wufu === 'string' ? result.wufu : JSON.stringify(result.wufu))}</div>
        </div>
      `;
    }

    if (result.sanji) {
      html += `
        <div class="glass-card" style="text-align:center;">
          <div style="font-size:1.5rem;margin-bottom:8px;">🏛️</div>
          <div style="font-family:var(--font-serif);color:var(--gold);margin-bottom:4px;">三基</div>
          <div style="color:var(--text-secondary);font-size:0.9rem;">${escapeHtml(typeof result.sanji === 'string' ? result.sanji : JSON.stringify(result.sanji))}</div>
        </div>
      `;
    }

    html += '</div>';
  }

  // 太乙位置
  if (result.taiyi_position) {
    html += `
      <div class="glass-card mt-24" style="text-align:center;">
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px;">太乙所在</div>
        <div style="font-family:var(--font-serif);font-size:1.3rem;color:var(--gold-light);">${escapeHtml(result.taiyi_position)}</div>
      </div>
    `;
  }

  // 解读
  if (result.interpretation) {
    html += `
      <hr class="section-divider">
      <div class="analysis-section">
        <h3>📖 太乙解读</h3>
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
