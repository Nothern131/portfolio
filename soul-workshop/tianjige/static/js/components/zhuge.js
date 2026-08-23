/**
 * 诸葛神数组件
 * 三种起卦方式 → 签诗展示 → 解签
 */
function renderZhugeComponent() {
  const container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML = `
    <div class="section-header">
      <h2 class="page-title">诸葛神数</h2>
      <p class="page-subtitle">诸葛武侯传世秘法，三百八十四签，占事问卜</p>
    </div>

    <!-- 输入方式 Tab -->
    <div class="glass-card mb-24">
      <div class="tabs" id="zhuge-method-tabs">
        <button class="tab-btn active" data-method="word">📝 报字</button>
        <button class="tab-btn" data-method="number">🔢 报数</button>
        <button class="tab-btn" data-method="random">🎲 随机</button>
      </div>

      <div id="zhuge-method-content">
        <!-- 报字 -->
        <div class="tab-content active" id="zhuge-word">
          <div class="form-group">
            <label class="form-label">请输入三个汉字</label>
            <input type="text" class="form-input" id="zhuge-words" placeholder="请输入三个汉字（如：问前程）" maxlength="10">
          </div>
          <button class="btn-gold" id="zhuge-word-submit">🎋 求签</button>
        </div>

        <!-- 报数 -->
        <div class="tab-content" id="zhuge-number">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">第一个数字</label>
              <input type="number" class="form-input" id="zhuge-num1" placeholder="1-999" min="1" max="999">
            </div>
            <div class="form-group">
              <label class="form-label">第二个数字</label>
              <input type="number" class="form-input" id="zhuge-num2" placeholder="1-999" min="1" max="999">
            </div>
            <div class="form-group">
              <label class="form-label">第三个数字</label>
              <input type="number" class="form-input" id="zhuge-num3" placeholder="1-999" min="1" max="999">
            </div>
          </div>
          <button class="btn-gold" id="zhuge-number-submit">🎋 求签</button>
        </div>

        <!-- 随机 -->
        <div class="tab-content" id="zhuge-random">
          <p style="color:var(--text-secondary);margin-bottom:16px;">心诚则灵，点击按钮随机生成一签</p>
          <button class="btn-gold lg" id="zhuge-random-submit">🎲 随机求签</button>
        </div>
      </div>

      <!-- 所问之事 -->
      <div class="form-group" style="margin-top:20px;">
        <label class="form-label">🔮 你所问之事（可选）—— 想通过此签了解哪个方面的运势？</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;" id="zhuge-domain-tags">
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
        <input type="text" class="form-input" id="zhuge-question-text" placeholder="或输入你想问的具体问题，如：最近事业运如何？...">
      </div>
    </div>

    <!-- 结果区域 -->
    <div id="zhuge-result-area" class="hidden">
      <div class="glass-card" id="zhuge-result-card"></div>
    </div>
  `;

  // 方法切换
  const methodTabs = container.querySelector('#zhuge-method-tabs');
  methodTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    methodTabs.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const method = btn.dataset.method;
    const methodContent = container.querySelector('#zhuge-method-content');
    methodContent.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
    methodContent.querySelector(`#zhuge-${method}`).classList.add('active');
  });

  // 事域快捷按钮
  container.querySelector('#zhuge-domain-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.domain) return;
    var questionInput = container.querySelector('#zhuge-question-text');
    var domainText = btn.dataset.domain.replace(/^[^\s]+\s/, '');
    questionInput.value = '最近' + domainText + '运如何？';
    var allBtns = container.querySelectorAll('#zhuge-domain-tags button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  // 报字提交
  container.querySelector('#zhuge-word-submit').addEventListener('click', async () => {
    const words = container.querySelector('#zhuge-words').value.trim();
    if (!words) {
      showToast('请输入汉字');
      return;
    }
    await handleZhugeSubmit(container, { method: 'word', words });
  });

  // 报数提交
  container.querySelector('#zhuge-number-submit').addEventListener('click', async () => {
    const n1 = container.querySelector('#zhuge-num1').value;
    const n2 = container.querySelector('#zhuge-num2').value;
    const n3 = container.querySelector('#zhuge-num3').value;
    if (!n1 || !n2 || !n3) {
      showToast('请输入三个数字');
      return;
    }
    await handleZhugeSubmit(container, { method: 'number', numbers: [parseInt(n1), parseInt(n2), parseInt(n3)] });
  });

  // 随机提交
  container.querySelector('#zhuge-random-submit').addEventListener('click', async () => {
    const randomNums = [
      Math.floor(Math.random() * 999) + 1,
      Math.floor(Math.random() * 999) + 1,
      Math.floor(Math.random() * 999) + 1,
    ];
    await handleZhugeSubmit(container, { method: 'random', numbers: randomNums });
  });

  return container;
}

/** 处理诸葛神数请求 */
async function handleZhugeSubmit(container, params) {
  const resultArea = container.querySelector('#zhuge-result-area');
  const resultCard = container.querySelector('#zhuge-result-card');

  resultArea.classList.remove('hidden');
  resultCard.innerHTML = '<div class="spinner"></div>';

  try {
    // 纯前端本地算法，零API调用
    const result = ZhugeEngine.divine(params);

    // 问事分析
    var question = container.querySelector('#zhuge-question-text').value.trim();
    var questionAnalysisHtml = '';
    if (question && typeof DomainAnalysis !== 'undefined') {
      var qaResult = DomainAnalysis.analyze('zhuge', result, question);
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

    renderZhugeResult(resultCard, result, questionAnalysisHtml);
  } catch (error) {
    resultCard.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-text">${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

/** 渲染诸葛神数结果 */
function renderZhugeResult(container, result, questionAnalysisHtml) {
  const levelClass = getLevelClass(result.level || '中平');

  container.innerHTML = `
    <div class="verse-display fade-in">
      <div class="verse-number">第 ${escapeHtml(String(result.number || '—'))} 签</div>
      <div class="verse-level ${levelClass}">${escapeHtml(result.level || '中平')}</div>
      <div class="verse-poem">${escapeHtml(result.poem || '签诗待显...')}</div>
      <hr class="section-divider">
      <div class="verse-interpretation">
        <h4 style="color:var(--gold);margin-bottom:12px;">解签</h4>
        <p>${escapeHtml(result.interpretation || '暂无解签内容')}</p>
      </div>
      ${
        result.verdict
          ? `
        <div class="verdict-block mt-24">
          <div class="verdict-text">${escapeHtml(result.verdict)}</div>
        </div>
      `
          : ''
      }
      ${questionAnalysisHtml || ''}
    </div>
  `;
}

/** 获取吉凶等级 CSS 类 */
function getLevelClass(level) {
  if (!level) return 'neutral';
  if (level.includes('上') || level.includes('吉') || level.includes('大')) return 'auspicious';
  if (level.includes('下') || level.includes('凶')) return 'inauspicious';
  return 'neutral';
}
