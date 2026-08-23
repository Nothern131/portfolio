/**
 * 周公解梦组件 v2
 * 输入梦境描述 + 所问之事 → 关键词匹配 → 多条目解读 → 事域交叉分析
 */
function renderZhougongComponent() {
  var container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML = `
    <div class="section-header">
      <h2 class="page-title">周公解梦</h2>
      <p class="page-subtitle">周公旦所传梦学经典，以梦境占吉凶，解天地人事之兆</p>
    </div>

    <!-- 输入区域 -->
    <div class="glass-card mb-24" id="zhougong-input-card">
      <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;font-size:1rem;">🌙 描述你的梦境</h3>
      <div class="form-group">
        <label class="form-label">请尽可能详细地描述你梦到的内容</label>
        <textarea class="form-input" id="zhougong-dream-text" placeholder="例如：梦见自己在一条大河中游泳，河水很清澈，还看到一条大鱼跃出水面..." rows="4" style="resize:vertical;min-height:80px;"></textarea>
      </div>

      <!-- 所问之事 -->
      <div class="form-group" style="margin-top:16px;">
        <label class="form-label">🔮 你所问之事（可选）—— 想通过此梦了解哪个方面的运势？</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;" id="zhougong-domain-tags">
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
        <input type="text" class="form-input" id="zhougong-question-text" placeholder="或输入你想问的具体问题，如：最近事业运如何？这段感情有结果吗？...">
      </div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button class="btn-gold lg" id="zhougong-submit-btn">
          <span>🌙</span> 解梦
        </button>
        <button class="btn-gold outline sm" id="zhougong-random-btn">
          🎲 随机梦境
        </button>
      </div>

      <!-- 快捷关键词 -->
      <div style="margin-top:16px;">
        <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">常见梦境快速查询：</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;" id="zhougong-quick-tags">
          ${['蛇', '鱼', '水', '火', '飞', '坠落', '牙齿', '考试', '死人', '棺材', '龙', '钱', '花', '树', '房子', '车']
            .map(function (k) {
              return (
                '<button class="btn-gold outline" style="font-size:0.75rem;padding:4px 10px;" data-keyword="' +
                k +
                '">' +
                k +
                '</button>'
              );
            })
            .join('')}
        </div>
      </div>
    </div>

    <!-- 结果区域 -->
    <div id="zhougong-result-area" class="hidden">
      <div class="glass-card" id="zhougong-result-card"></div>
    </div>
  `;

  // 提交解梦
  container.querySelector('#zhougong-submit-btn').addEventListener('click', function () {
    handleZhougongSubmit(container);
  });

  // 回车提交
  var textarea = container.querySelector('#zhougong-dream-text');
  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleZhougongSubmit(container);
    }
  });

  // 随机梦境
  container.querySelector('#zhougong-random-btn').addEventListener('click', function () {
    var allDreams = ZhougongEngine.getAllDreams();
    var randomDream = allDreams[Math.floor(Math.random() * allDreams.length)];
    textarea.value = '梦见' + randomDream.keyword;
    handleZhougongSubmit(container);
  });

  // 快捷关键词
  container.querySelector('#zhougong-quick-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.keyword) return;
    textarea.value = '梦见' + btn.dataset.keyword;
    handleZhougongSubmit(container);
  });

  // 事域快捷按钮
  container.querySelector('#zhougong-domain-tags').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || !btn.dataset.domain) return;
    var questionInput = container.querySelector('#zhougong-question-text');
    // 提取纯文本（去掉emoji）
    var domainText = btn.dataset.domain.replace(/^[^\s]+\s/, '');
    questionInput.value = '最近' + domainText + '运如何？';
    // 高亮当前选中
    var allBtns = container.querySelectorAll('#zhougong-domain-tags button');
    for (var i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove('active');
    }
    btn.classList.add('active');
  });

  return container;
}

/** 处理解梦提交 */
function handleZhougongSubmit(container) {
  var text = container.querySelector('#zhougong-dream-text').value.trim();
  if (!text) {
    showToast('请输入梦境描述');
    return;
  }

  var question = container.querySelector('#zhougong-question-text').value.trim();

  var resultArea = container.querySelector('#zhougong-result-area');
  var resultCard = container.querySelector('#zhougong-result-card');

  resultArea.classList.remove('hidden');
  resultCard.innerHTML = '<div class="spinner"></div>';
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

  try {
    // 纯前端本地算法，零API调用
    var result = ZhougongEngine.divine(text, question);
    renderZhougongResult(resultCard, result);
  } catch (error) {
    resultCard.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-text">${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

/** 渲染解梦结果 */
function renderZhougongResult(container, result) {
  var jiClass = result.ji === '吉' ? 'auspicious' : result.ji === '凶' ? 'inauspicious' : 'neutral';
  var jiEmoji = result.ji === '吉' ? '🌟' : result.ji === '凶' ? '⚠️' : '🔮';

  var html = '<div class="fade-in">';

  // 头部
  html += `
    <div style="text-align:center;margin-bottom:20px;">
      <div style="font-size:2.5rem;margin-bottom:8px;">${jiEmoji}</div>
      <h3 style="font-family:var(--font-serif);color:var(--gold-light);">梦境解析</h3>
      <p style="font-size:0.85rem;color:var(--text-muted);">您梦到了：${escapeHtml(result.input)}</p>
      ${result.question ? '<p style="font-size:0.85rem;color:var(--gold);margin-top:4px;">所问之事：' + escapeHtml(result.question) + '</p>' : ''}
      ${result.count > 0 ? '<span class="verse-level ' + jiClass + '">匹配到 ' + result.count + ' 个梦境条目</span>' : ''}
    </div>
  `;

  // 梦境条目
  if (result.results && result.results.length > 0) {
    html += '<div class="card-grid cols-2 mb-24">';
    result.results.forEach(function (item) {
      var itemJiClass = item.ji === '吉' ? 'auspicious' : item.ji === '凶' ? 'inauspicious' : 'neutral';
      var catName =
        {
          天象: '🌤️',
          地理: '⛰️',
          人物: '👤',
          身体: '🦴',
          动物: '🐾',
          植物: '🌿',
          建筑: '🏠',
          器物: '🔧',
          衣饰: '👗',
          饮食: '🍜',
          文书: '📜',
          交通: '🚗',
          水火: '💧🔥',
          佛道: '🛕',
          丧葬: '⚰️',
          其他: '🔮',
        }[item.cat] || '🔮';
      html += `
        <div class="glass-card" style="padding:14px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-size:1.1rem;">${catName}</span>
            <span style="font-family:var(--font-serif);font-size:1rem;color:var(--gold-light);">${escapeHtml(item.keyword)}</span>
            <span class="verse-level ${itemJiClass}" style="font-size:0.7rem;padding:2px 8px;">${item.ji}</span>
          </div>
          <p style="font-size:0.85rem;line-height:1.7;color:var(--text-secondary);">${escapeHtml(item.interpretation)}</p>
        </div>
      `;
    });
    html += '</div>';
  }

  // 经典解梦综合解读
  html += `
    <hr class="section-divider">
    <div class="analysis-section">
      <h3>📖 经典解梦综合解读</h3>
      <div class="analysis-content">${formatAnalysisText(result.interpretation)}</div>
    </div>
  `;

  // 问事分析（如果有）
  if (result.questionAnalysis) {
    html += `
      <hr class="section-divider">
      <div class="analysis-section" style="background:rgba(184,154,92,0.03);border:1px solid var(--border-subtle);border-radius:12px;padding:20px;margin-top:20px;">
        <h3 style="color:var(--gold-light);">${result.domain ? result.domain.icon : '🔮'} 所问之事分析</h3>
        <div class="analysis-content">${formatAnalysisText(result.questionAnalysis)}</div>
      </div>
    `;
  }

  html += '</div>';
  container.innerHTML = html;
}
