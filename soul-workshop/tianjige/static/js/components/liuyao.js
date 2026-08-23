/**
 * 六爻占卜组件
 * 自动起卦（铜钱动画）→ 六爻排盘 → 卦象解读
 * 后台综合算法：鬼谷子 + 京房 纳甲体系
 */
function renderLiuyaoComponent() {
  const container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML = `
    <div class="section-header">
      <h2 class="page-title">六爻占卜</h2>
      <p class="page-subtitle">纳甲筮法，以三枚铜钱演六十四卦，断吉凶悔吝。后台融合鬼谷子·京房纳甲算法</p>
    </div>

    <!-- 起卦区域 -->
    <div class="glass-card mb-24" id="liuyao-cast-area">
      <div class="liuyao-coins-stage" id="liuyao-coins-stage">
        <div class="liuyao-coins" id="liuyao-coins">
          <span class="liuyao-coin">🪙</span>
          <span class="liuyao-coin">🪙</span>
          <span class="liuyao-coin">🪙</span>
        </div>
        <p class="liuyao-prompt" id="liuyao-prompt">心中默念所问之事，点击"自动起卦"</p>
        <div class="liuyao-lines-progress" id="liuyao-lines-progress"></div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn-gold lg" id="liuyao-auto-cast">
          <span>🪙</span> 自动起卦
        </button>
        <button class="btn-gold outline sm" id="liuyao-manual-toggle">
          ✋ 手动输入
        </button>
      </div>

      <!-- 所问之事 -->
      <div class="form-group" style="margin-top:20px;max-width:500px;margin-left:auto;margin-right:auto;">
        <label class="form-label">🔮 你所问之事（可选）—— 想通过此卦了解哪个方面的运势？</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;justify-content:center;" id="liuyao-domain-tags">
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
        <input type="text" class="form-input" id="liuyao-question-text" placeholder="或输入你想问的具体问题，如：最近事业运如何？...">
      </div>

      <!-- 手动输入（默认隐藏） -->
      <div class="hidden mt-24" id="liuyao-manual-panel">
        <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.85rem;">手动设置六爻（从下到上），每爻选择阴阳和动变</p>
        ${[6, 5, 4, 3, 2, 1]
          .map(
            (i) => `
          <div class="form-row mb-8" style="align-items:center;grid-template-columns:50px 1fr;">
            <span style="color:var(--gold);font-size:0.85rem;">第${i}爻</span>
            <select class="form-select" id="liuyao-line-${i}">
              <option value="yang">⚊ 阳爻</option>
              <option value="yin">⚋ 阴爻</option>
              <option value="yang-changing">⚊ 阳爻（动）</option>
              <option value="yin-changing">⚋ 阴爻（动）</option>
            </select>
          </div>
        `
          )
          .join('')}
        <button class="btn-gold mt-16" id="liuyao-manual-submit">🔮 排卦</button>
      </div>
    </div>

    <!-- 结果区域 -->
    <div id="liuyao-result-area" class="hidden">
      <div class="glass-card" id="liuyao-result-card"></div>
    </div>
  `;

  // 手动输入切换
  const manualToggle = container.querySelector('#liuyao-manual-toggle');
  const manualPanel = container.querySelector('#liuyao-manual-panel');
  manualToggle.addEventListener('click', () => {
    const isHidden = manualPanel.classList.contains('hidden');
    manualPanel.classList.toggle('hidden', !isHidden);
    manualToggle.textContent = isHidden ? '✋ 收起' : '✋ 手动输入';
  });

  // 事域快捷按钮
  container.querySelector('#liuyao-domain-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.domain) return;
    var questionInput = container.querySelector('#liuyao-question-text');
    var domainText = btn.dataset.domain.replace(/^[^\s]+\s/, '');
    questionInput.value = '最近' + domainText + '运如何？';
    var allBtns = container.querySelectorAll('#liuyao-domain-tags button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  // 自动起卦
  const autoCastBtn = container.querySelector('#liuyao-auto-cast');
  const coinsEl = container.querySelector('#liuyao-coins');
  const promptEl = container.querySelector('#liuyao-prompt');
  const progressEl = container.querySelector('#liuyao-lines-progress');
  const castArea = container.querySelector('#liuyao-cast-area');

  let isCasting = false;
  const coinLines = [];

  autoCastBtn.addEventListener('click', async () => {
    if (isCasting) return;
    isCasting = true;
    autoCastBtn.disabled = true;
    coinLines.length = 0;
    progressEl.innerHTML = '';

    const lineMap = {
      6: { type: 'yin', changing: true, label: '⚋ 老阴(动)', cls: 'yin' },
      7: { type: 'yang', changing: false, label: '⚊ 少阳', cls: 'yang' },
      8: { type: 'yin', changing: false, label: '⚋ 少阴', cls: 'yin' },
      9: { type: 'yang', changing: true, label: '⚊ 老阳(动)', cls: 'yang' },
    };

    for (let i = 0; i < 6; i++) {
      promptEl.textContent = `第 ${i + 1} 次摇卦...`;

      // 铜钱震荡动画
      coinsEl.classList.add('shaking');
      await sleep(600);
      coinsEl.classList.remove('shaking');

      const total =
        [2, 3][Math.random() > 0.5 ? 1 : 0] + [2, 3][Math.random() > 0.5 ? 1 : 0] + [2, 3][Math.random() > 0.5 ? 1 : 0];
      const line = lineMap[total];
      coinLines.push(line);

      // 显示结果
      const lineEl = document.createElement('div');
      lineEl.className = `liuyao-line-result ${line.cls}${line.changing ? ' changing' : ''}`;
      lineEl.innerHTML = `<span class="liuyao-line-label">第${i + 1}爻</span><span class="liuyao-line-symbol">${line.label}</span>`;
      lineEl.style.animationDelay = '0s';
      progressEl.appendChild(lineEl);

      await sleep(350);
    }

    promptEl.textContent = '起卦完成，正在排盘...';
    autoCastBtn.textContent = '🔄 重新起卦';
    autoCastBtn.disabled = false;
    isCasting = false;

    // 提交到后端
    await handleLiuyaoSubmit(container, coinLines);
  });

  // 手动输入提交
  container.querySelector('#liuyao-manual-submit').addEventListener('click', async () => {
    const manualLines = [];
    for (let i = 1; i <= 6; i++) {
      const val = container.querySelector(`#liuyao-line-${i}`).value;
      manualLines.push({
        type: val.startsWith('yang') ? 'yang' : 'yin',
        changing: val.includes('changing'),
      });
    }
    await handleLiuyaoSubmit(container, manualLines);
  });

  return container;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** 处理六爻提交 */
async function handleLiuyaoSubmit(container, lines) {
  const resultArea = container.querySelector('#liuyao-result-area');
  const resultCard = container.querySelector('#liuyao-result-card');

  resultArea.classList.remove('hidden');
  resultCard.innerHTML = '<div class="spinner"></div>';
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    // 纯前端本地算法，零API调用
    const result = LiuyaoEngine.divine(lines);

    const guaName = result.gua_name || '';
    const changedName = result.changed_gua ? result.changed_gua.name : '';
    const yaoArr = result.original_gua ? result.original_gua.yao : [];
    const dongYao = result.dong_yao || [];
    const shiYao = result.shi_yao;
    const yingYao = result.ying_yao;
    const liuQin = result.liu_qin || [];
    const liuShou = result.liu_shou || [];
    const najia = result.najia || [];

    // 问事分析
    var question = container.querySelector('#liuyao-question-text').value.trim();
    var questionAnalysisHtml = '';
    if (question && typeof DomainAnalysis !== 'undefined') {
      var qaResult = DomainAnalysis.analyze('liuyao', result, question);
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

    // 构建爻线数据（含阴阳和动变）
    const lineData = [];
    for (let i = 0; i < 6; i++) {
      const v = yaoArr[i] !== undefined ? yaoArr[i] : 1;
      const isYang = v === 1;
      const isChanging = dongYao.includes(i + 1);
      lineData.push({ type: isYang ? 'yang' : 'yin', changing: isChanging });
    }

    resultCard.innerHTML = `
      <div class="hexagram fade-in">
        <div class="hexagram-lines">
          ${renderHexagramLines(lineData)}
        </div>
        <div class="hexagram-name">${escapeHtml(guaName)}</div>
        ${
          changedName
            ? `
          <p style="color:var(--text-muted);font-size:0.9rem;">之卦：${escapeHtml(changedName)}</p>
        `
            : ''
        }

        <div class="hexagram-detail">
          <div class="detail-item">
            <div class="detail-label">世爻</div>
            <div class="detail-value">第${shiYao || '?'}爻</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">应爻</div>
            <div class="detail-value">第${yingYao || '?'}爻</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">动爻</div>
            <div class="detail-value">${dongYao.length ? dongYao.map((d) => `第${d}爻`).join('、') : '无'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">六亲</div>
            <div class="detail-value">${liuQin.join(' · ') || '—'}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">六兽</div>
            <div class="detail-value">${liuShou.join(' · ') || '—'}</div>
          </div>
          ${
            najia.length
              ? `
            <div class="detail-item">
              <div class="detail-label">纳甲</div>
              <div class="detail-value">${najia.map((n) => `${n.gan}${n.zhi}`).join(' · ')}</div>
            </div>
          `
              : ''
          }
        </div>

        ${
          result.interpretation
            ? `
          <hr class="section-divider">
          <div class="analysis-section">
            <h3>📖 卦象解读</h3>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">
              后台算法：鬼谷子·京房纳甲体系 → 综合断卦
            </div>
            <div class="analysis-content">${formatAnalysisText(result.interpretation)}</div>
          </div>
        `
            : ''
        }
        ${questionAnalysisHtml}
      </div>
    `;
  } catch (error) {
    resultCard.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-text">${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

function renderHexagramLines(lines) {
  if (!lines || !lines.length) return '';
  return lines
    .map((line, i) => {
      const isYang = line.type === 'yang';
      const isChanging = line.changing;
      let lineHtml = '';
      if (isYang) {
        lineHtml = `<div class="line-bar yang${isChanging ? ' changing' : ''}"></div>`;
      } else {
        lineHtml = `<div class="line-bar yin${isChanging ? ' changing' : ''}"><div class="half"></div><div class="half"></div></div>`;
      }
      return `
      <div class="hexagram-line">
        <span style="min-width:40px;text-align:right;">第${i + 1}爻</span>
        ${lineHtml}
        <span>${isYang ? '⚊' : '⚋'}${isChanging ? ' ⚡' : ''}</span>
      </div>
    `;
    })
    .join('');
}
