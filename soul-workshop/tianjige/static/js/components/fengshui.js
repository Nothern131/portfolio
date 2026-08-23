/**
 * 天机阁 · 风水组件 v2 — 玄空飞星 + 拼户型建造器 + 户型图上传
 * 纯前端，零API
 */
(function (global) {
  'use strict';

  var ROOM_TYPES = [
    { id: 'living', name: '客厅', icon: '🏠', color: '#d4bb7c' },
    { id: 'master', name: '主卧', icon: '🛏️', color: '#c8a8d8' },
    { id: 'second', name: '次卧', icon: '🛏️', color: '#a8c8d8' },
    { id: 'kitchen', name: '厨房', icon: '🍳', color: '#d8a8a8' },
    { id: 'bath', name: '卫生间', icon: '🚿', color: '#a8d8d8' },
    { id: 'study', name: '书房', icon: '📚', color: '#a8d8a8' },
    { id: 'dining', name: '餐厅', icon: '🍽️', color: '#d8c8a8' },
    { id: 'balcony', name: '阳台', icon: '🌿', color: '#a8d8c8' },
    { id: 'entrance', name: '玄关', icon: '🚪', color: '#c8c8a8' },
  ];

  var GRID_DISPLAY = [3, 8, 1, 2, 4, 6, 7, 0, 5];
  var PALACE_SHORT = ['坎一', '坤二', '震三', '巽四', '中五', '乾六', '兑七', '艮八', '离九'];

  function render(container) {
    if (!container) return;

    var now = new Date();
    var currentYear = now.getFullYear();

    container.innerHTML =
      '<div class="fengshui-page">' +
      '<div class="page-header">' +
      '<h2 class="page-title">🏔️ 风水格局</h2>' +
      '<p class="page-subtitle">玄空飞星 · 二十四山 · 九宫飞泊</p>' +
      '</div>' +
      // 户型图 / 拼户型
      '<div class="glass-card mb-24">' +
      '<h3 style="color:var(--gold-light);margin-bottom:16px;">📐 户型图</h3>' +
      // Tab 切换
      '<div class="fs-tab-switcher" id="fs-tab-switcher">' +
      '<button class="fs-tab-btn active" data-fs-tab="build">拼 户 型</button>' +
      '<button class="fs-tab-btn" data-fs-tab="upload">上 传 图 片</button>' +
      '</div>' +
      // 拼户型 Tab
      '<div class="fs-builder-wrap" id="fs-build-tab">' +
      '<div class="fs-builder-main">' +
      '<div class="fs-room-palette" id="fs-room-palette">' +
      '<div class="fs-room-palette-label">房间类型</div>' +
      '</div>' +
      '<div class="fs-grid-container">' +
      '<div class="fs-grid-size-selector" id="fs-grid-size-selector">' +
      '<span class="fs-grid-size-label">网格：</span>' +
      '<button class="fs-grid-size-btn active" data-fs-cols="3" data-fs-rows="3">3×3</button>' +
      '<button class="fs-grid-size-btn" data-fs-cols="4" data-fs-rows="3">4×3</button>' +
      '<button class="fs-grid-size-btn" data-fs-cols="4" data-fs-rows="4">4×4</button>' +
      '<button class="fs-grid-size-btn" data-fs-cols="5" data-fs-rows="4">5×4</button>' +
      '<button class="fs-grid-size-btn" data-fs-cols="5" data-fs-rows="5">5×5</button>' +
      '</div>' +
      '<div class="fs-grid-wrapper" id="fs-grid-wrapper">' +
      '<canvas id="fs-compass-canvas"></canvas>' +
      '<div class="fs-builder-grid" id="fs-builder-grid"></div>' +
      '<div class="fs-dir-label n">北</div>' +
      '<div class="fs-dir-label s">南</div>' +
      '<div class="fs-dir-label e">东</div>' +
      '<div class="fs-dir-label w">西</div>' +
      '<div class="fs-dir-label ne">东北</div>' +
      '<div class="fs-dir-label nw">西北</div>' +
      '<div class="fs-dir-label se">东南</div>' +
      '<div class="fs-dir-label sw">西南</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="fs-builder-info">' +
      '<span class="fs-info-item">坐山：<span class="fs-info-val" id="fs-info-sitting">子(正北)</span></span>' +
      '<span class="fs-info-divider"></span>' +
      '<span class="fs-info-item">朝向：<span class="fs-info-val" id="fs-info-facing">午(正南)</span></span>' +
      '<span class="fs-info-divider"></span>' +
      '<span class="fs-info-item">旋转罗盘调整朝向</span>' +
      '</div>' +
      '<div class="fs-builder-tip">从左侧选择房间类型 → 点击九宫格放置 → 旋转罗盘调整朝向 → 开始排盘</div>' +
      '<div class="fs-btn-row">' +
      '<button class="fs-btn fs-btn-secondary" id="fs-clear-rooms-btn" style="font-size:0.78rem;padding:8px 18px">清空房间</button>' +
      '<button class="fs-btn fs-btn-secondary" id="fs-random-rooms-btn" style="font-size:0.78rem;padding:8px 18px">随机布局</button>' +
      '<button class="fs-btn" id="fs-build-calc-btn">开始排盘</button>' +
      '</div>' +
      '</div>' +
      // 上传图片 Tab
      '<div id="fs-upload-tab" style="display:none">' +
      '<div class="fs-upload-section">' +
      '<div class="fs-upload-zone" id="fs-upload-zone">' +
      '<div id="fs-upload-placeholder">' +
      '<div class="fs-upload-icon">&#x2302;</div>' +
      '<div class="fs-upload-text">点击上传户型图或拖拽图片到此处</div>' +
      '<div class="fs-upload-hint">支持 JPG / PNG / WebP，九宫格将叠加在户型图上</div>' +
      '</div>' +
      '<input type="file" id="fs-file-input" accept="image/*">' +
      '</div>' +
      '<div class="fs-floor-plan-wrap" id="fs-floor-plan-wrap" style="display:none">' +
      '<canvas id="fs-floor-canvas"></canvas>' +
      '</div>' +
      '<div class="fs-floor-plan-controls" id="fs-floor-controls" style="display:none">' +
      '<label>网格透明度</label>' +
      '<input type="range" id="fs-grid-opacity" min="20" max="100" value="60">' +
      '<button class="fs-btn-sm" id="fs-reset-grid-btn">重置位置</button>' +
      '<button class="fs-btn-sm" id="fs-toggle-grid-btn">隐藏网格</button>' +
      '<button class="fs-btn-sm danger" id="fs-remove-img-btn">移除图片</button>' +
      '<span class="fs-floor-plan-tip">拖拽网格调整位置 · 滚轮缩放</span>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      // 输入区
      '<div class="glass-card mb-24" id="fs-input-card">' +
      '<h3 style="color:var(--gold-light);margin-bottom:16px;">📐 排盘参数</h3>' +
      '<div class="fs-input-row">' +
      '<div class="fs-input-group">' +
      '<label class="fs-label">建房年份</label>' +
      '<input type="number" id="fs-build-year" class="fs-input" value="' +
      currentYear +
      '" min="1900" max="2100" placeholder="如 2024">' +
      '</div>' +
      '<div class="fs-input-group">' +
      '<label class="fs-label">坐山（背靠方向）</label>' +
      '<select id="fs-sitting" class="fs-input"></select>' +
      '</div>' +
      '<div class="fs-input-group">' +
      '<label class="fs-label">朝向（面朝方向）</label>' +
      '<select id="fs-facing" class="fs-input"></select>' +
      '</div>' +
      '<div class="fs-input-group">' +
      '<label class="fs-label">当前年份</label>' +
      '<input type="number" id="fs-current-year" class="fs-input" value="' +
      currentYear +
      '" min="2020" max="2100">' +
      '</div>' +
      '</div>' +
      '<div class="fs-btn-row">' +
      '<button class="fs-btn" id="fs-calc-btn">⚡ 排盘</button>' +
      '<button class="fs-btn fs-btn-secondary" id="fs-random-btn">🎲 随机坐向</button>' +
      '</div>' +
      '</div>' +
      // 结果区
      '<div id="fs-result-area" style="display:none;">' +
      '<div class="glass-card mb-24" id="fs-overview-card">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">' +
      '<div>' +
      '<h3 style="color:var(--gold-light);margin-bottom:8px;">📊 风水总体评估</h3>' +
      '<p style="color:var(--text-muted);margin:0;" id="fs-overview-info"></p>' +
      '</div>' +
      '<div style="text-align:center;">' +
      '<div style="font-size:0.75rem;color:var(--text-muted);">综合评分</div>' +
      '<div style="font-size:2.4rem;font-weight:700;" id="fs-overall-score"></div>' +
      '<div style="font-size:0.9rem;font-weight:600;" id="fs-overall-level"></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="glass-card mb-24">' +
      '<h3 style="color:var(--gold-light);margin-bottom:16px;">🏯 九宫飞星盘</h3>' +
      '<div class="fs-legend">' +
      '<span class="fs-legend-item"><span class="fs-legend-dot" style="background:#c8a000;"></span>五黄 大凶</span>' +
      '<span class="fs-legend-item"><span class="fs-legend-dot" style="background:#8b7355;"></span>二黑 病符</span>' +
      '<span class="fs-legend-item"><span class="fs-legend-dot" style="background:#ffd700;"></span>八白 旺财</span>' +
      '<span class="fs-legend-item"><span class="fs-legend-dot" style="background:#ff6b6b;"></span>九紫 喜庆</span>' +
      '<span class="fs-legend-item"><span class="fs-legend-dot" style="background:#4a9eff;"></span>一白 文昌</span>' +
      '<span class="fs-legend-item"><span class="fs-legend-dot" style="background:#d4d4d4;"></span>六白 权贵</span>' +
      '</div>' +
      '<div class="fs-grid" id="fs-grid"></div>' +
      '</div>' +
      '<div class="fs-two-col">' +
      '<div class="glass-card" id="fs-best-card"></div>' +
      '<div class="glass-card" id="fs-worst-card"></div>' +
      '</div>' +
      '<div class="glass-card mb-24" style="margin-top:24px;">' +
      '<h3 style="color:var(--gold-light);margin-bottom:16px;">📋 九宫详解</h3>' +
      '<div class="fs-table-wrap" id="fs-table"></div>' +
      '</div>' +
      '</div>' +
      '</div>';

    // 填充24山选择器
    initMountainSelects(container);
    // 初始化建造器
    initBuilder(container);
    // 初始化上传
    initUpload(container);
    // 绑定事件
    bindEvents(container);
    // 自动排盘
    setTimeout(function () {
      doCalc(container);
    }, 200);
  }

  /* ========== 24山选择器 ========== */
  function initMountainSelects(container) {
    var mountains = (global.FengshuiEngine && global.FengshuiEngine.MOUNTAINS_24) || [];
    var sitSelect = container.querySelector('#fs-sitting');
    var faceSelect = container.querySelector('#fs-facing');
    var mountainNames = {
      壬: '壬(北偏西)',
      子: '子(正北)',
      癸: '癸(北偏东)',
      丑: '丑(东北偏北)',
      艮: '艮(东北)',
      寅: '寅(东北偏东)',
      甲: '甲(东偏北)',
      卯: '卯(正东)',
      乙: '乙(东偏南)',
      辰: '辰(东南偏东)',
      巽: '巽(东南)',
      巳: '巳(东南偏南)',
      丙: '丙(南偏东)',
      午: '午(正南)',
      丁: '丁(南偏西)',
      未: '未(西南偏南)',
      坤: '坤(西南)',
      申: '申(西南偏西)',
      庚: '庚(西偏南)',
      酉: '酉(正西)',
      辛: '辛(西偏北)',
      戌: '戌(西北偏西)',
      乾: '乾(西北)',
      亥: '亥(西北偏北)',
    };

    for (var i = 0; i < mountains.length; i++) {
      var m = mountains[i];
      var opt1 = document.createElement('option');
      opt1.value = m;
      opt1.textContent = mountainNames[m] || m;
      sitSelect.appendChild(opt1);
      var opt2 = document.createElement('option');
      opt2.value = m;
      opt2.textContent = mountainNames[m] || m;
      faceSelect.appendChild(opt2);
    }
    sitSelect.value = '子';
    faceSelect.value = '午';
  }

  /* ========== 绑定事件 ========== */
  function bindEvents(container) {
    var mountains = (global.FengshuiEngine && global.FengshuiEngine.MOUNTAINS_24) || [];

    container.querySelector('#fs-calc-btn').addEventListener('click', function () {
      doCalc(container);
    });
    container.querySelector('#fs-random-btn').addEventListener('click', function () {
      var sitSelect = container.querySelector('#fs-sitting');
      var faceSelect = container.querySelector('#fs-facing');
      var mi = Math.floor(Math.random() * mountains.length);
      sitSelect.value = mountains[mi];
      faceSelect.value = mountains[(mi + 12) % mountains.length];
      doCalc(container);
    });

    // Tab 切换
    var tabBtns = container.querySelectorAll('.fs-tab-btn');
    var buildTab = container.querySelector('#fs-build-tab');
    var uploadTab = container.querySelector('#fs-upload-tab');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        if (this.dataset.fsTab === 'build') {
          buildTab.style.display = '';
          uploadTab.style.display = 'none';
        } else {
          buildTab.style.display = 'none';
          uploadTab.style.display = '';
        }
      });
    });
  }

  /* ========== 建造器 ========== */
  function initBuilder(container) {
    var selectedRoom = null;
    var gridCols = 3;
    var gridRows = 3;
    var gridRooms = new Array(9).fill(null);
    var compassAngle = 0;
    var currentSitting = '子';
    var currentFacing = '午';
    var currentResult = null;

    var palette = container.querySelector('#fs-room-palette');
    var builderGrid = container.querySelector('#fs-builder-grid');
    var compassCanvas = container.querySelector('#fs-compass-canvas');
    var compassCtx = compassCanvas.getContext('2d');
    var infoSitting = container.querySelector('#fs-info-sitting');
    var infoFacing = container.querySelector('#fs-info-facing');
    var gridWrapper = container.querySelector('#fs-grid-wrapper');

    // 初始化房间面板
    ROOM_TYPES.forEach(function (room) {
      var btn = document.createElement('button');
      btn.className = 'fs-room-btn';
      btn.innerHTML =
        '<span class="fs-room-icon">' + room.icon + '</span><span class="fs-room-name">' + room.name + '</span>';
      btn.dataset.roomId = room.id;
      btn.addEventListener('click', function () {
        selectRoom(room, btn);
      });
      palette.appendChild(btn);
    });

    var eraseBtn = document.createElement('button');
    eraseBtn.className = 'fs-room-btn fs-room-btn-erase';
    eraseBtn.innerHTML = '<span class="fs-room-icon">✕</span><span class="fs-room-name">擦除</span>';
    eraseBtn.addEventListener('click', function () {
      selectRoom({ id: 'erase', name: '擦除', icon: '✕', color: '#c04040' }, eraseBtn);
    });
    palette.appendChild(eraseBtn);

    function selectRoom(room, btn) {
      selectedRoom = room;
      palette.querySelectorAll('.fs-room-btn').forEach(function (b) {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');
    }

    // 网格大小选择器
    container.querySelectorAll('.fs-grid-size-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cols = parseInt(this.dataset.fsCols);
        var rows = parseInt(this.dataset.fsRows);
        if (cols === gridCols && rows === gridRows) return;
        gridCols = cols;
        gridRows = rows;
        regenerateGrid(cols, rows);
        container.querySelectorAll('.fs-grid-size-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
      });
    });

    // 动态重建网格
    function regenerateGrid(cols, rows) {
      builderGrid.style.setProperty('--fs-grid-cols', cols);
      builderGrid.style.setProperty('--fs-grid-rows', rows);
      builderGrid.innerHTML = '';

      var totalCells = cols * rows;
      gridRooms = new Array(totalCells).fill(null);

      for (var i = 0; i < totalCells; i++) {
        var cell = document.createElement('div');
        cell.className = 'fs-grid-cell';
        cell.dataset.gridIdx = i;

        var col = i % cols;
        var row = Math.floor(i / cols);
        var palaceCol = Math.floor((col * 3) / cols);
        var palaceRow = Math.floor((row * 3) / rows);
        var palaceIdx3x3 = Math.min(palaceRow * 3 + palaceCol, 8);
        var pi = GRID_DISPLAY[palaceIdx3x3];
        cell.dataset.palaceIdx = pi;

        cell.innerHTML = '<span class="fs-cell-placeholder">+</span>';
        cell.addEventListener('click', function () {
          var gi = parseInt(this.dataset.gridIdx);
          if (selectedRoom && selectedRoom.id === 'erase') {
            gridRooms[gi] = null;
          } else if (selectedRoom) {
            gridRooms[gi] = selectedRoom;
          }
          renderGrid();
          if (currentResult) updateFloorPlanOverlay();
        });
        builderGrid.appendChild(cell);
      }
    }

    regenerateGrid(3, 3);

    function renderGrid() {
      var cells = builderGrid.querySelectorAll('.fs-grid-cell');
      cells.forEach(function (cell) {
        var gi = parseInt(cell.dataset.gridIdx);
        var pi = parseInt(cell.dataset.palaceIdx);
        var room = gridRooms[gi];
        cell.classList.remove('has-room');
        if (room) {
          cell.classList.add('has-room');
          cell.innerHTML =
            '<span class="fs-cell-room-icon">' +
            room.icon +
            '</span>' +
            '<span class="fs-cell-room-name">' +
            room.name +
            '</span>' +
            '<span class="fs-cell-palace-name">' +
            PALACE_SHORT[pi] +
            '</span>';
        } else {
          cell.innerHTML = '<span class="fs-cell-placeholder">+</span>';
        }
      });
    }

    // 罗盘绘制
    function drawCompass() {
      var wrapper = compassCanvas.parentElement;
      // 强制正方形：wrapper 有 aspect-ratio:1，但 clientWidth/Height 可能不一致
      var baseSize = Math.round(Math.min(wrapper.clientWidth, wrapper.clientHeight) * 1.24);
      if (!baseSize || baseSize < 20) baseSize = 520; // 兜底：布局未完成时
      var cw = (compassCanvas.width = baseSize);
      var ch = (compassCanvas.height = baseSize);
      var cx = cw / 2,
        cy = ch / 2;
      var rOuter = (cw / 2) * 0.82;
      var rInner = (cw / 2) * 0.68;
      var rGrid = (cw / 2) * 0.44;

      compassCtx.clearRect(0, 0, cw, ch);

      // 外环底色
      compassCtx.beginPath();
      compassCtx.arc(cx, cy, rOuter, 0, Math.PI * 2);
      compassCtx.fillStyle = 'rgba(20,16,12,0.7)';
      compassCtx.fill();
      compassCtx.strokeStyle = 'rgba(184,154,92,0.2)';
      compassCtx.lineWidth = 1;
      compassCtx.stroke();

      // 24山刻度
      var mountains = (global.FengshuiEngine && global.FengshuiEngine.MOUNTAINS_24) || [];
      for (var i = 0; i < 24; i++) {
        var angle = compassAngle + ((i * 15 - 90) * Math.PI) / 180;
        var isCardinal = i % 3 === 0;
        var x1 = cx + Math.cos(angle) * (rInner - 2);
        var y1 = cy + Math.sin(angle) * (rInner - 2);
        var x2 = cx + Math.cos(angle) * (rOuter - 6);
        var y2 = cy + Math.sin(angle) * (rOuter - 6);

        compassCtx.beginPath();
        compassCtx.moveTo(x1, y1);
        compassCtx.lineTo(x2, y2);
        compassCtx.strokeStyle = isCardinal ? 'rgba(184,154,92,0.5)' : 'rgba(184,154,92,0.2)';
        compassCtx.lineWidth = isCardinal ? 1.5 : 0.5;
        compassCtx.stroke();

        if (isCardinal && mountains[i]) {
          var tx = cx + Math.cos(angle) * (rOuter - 14);
          var ty = cy + Math.sin(angle) * (rOuter - 14);
          compassCtx.save();
          compassCtx.translate(tx, ty);
          compassCtx.rotate(angle + Math.PI / 2);
          compassCtx.fillStyle = 'rgba(212,187,124,0.8)';
          compassCtx.font = 'bold 9px "Noto Serif SC","SimSun",serif';
          compassCtx.textAlign = 'center';
          compassCtx.textBaseline = 'middle';
          compassCtx.fillText(mountains[i], 0, 0);
          compassCtx.restore();
        }
      }

      // 内环
      compassCtx.beginPath();
      compassCtx.arc(cx, cy, rInner, 0, Math.PI * 2);
      compassCtx.strokeStyle = 'rgba(184,154,92,0.3)';
      compassCtx.lineWidth = 1;
      compassCtx.stroke();

      // 网格区域边框
      compassCtx.beginPath();
      compassCtx.arc(cx, cy, rGrid, 0, Math.PI * 2);
      compassCtx.strokeStyle = 'rgba(184,154,92,0.15)';
      compassCtx.lineWidth = 1;
      compassCtx.setLineDash([4, 8]);
      compassCtx.stroke();
      compassCtx.setLineDash([]);

      // 朝向指示箭头
      var faceAngle = compassAngle - Math.PI / 2;
      var arrowBase = rInner - 8;
      var arrowLen = rOuter - rInner + 20;
      var ax = cx + Math.cos(faceAngle) * arrowBase;
      var ay = cy + Math.sin(faceAngle) * arrowBase;
      var bx = cx + Math.cos(faceAngle) * (arrowBase + arrowLen);
      var by = cy + Math.sin(faceAngle) * (arrowBase + arrowLen);

      compassCtx.beginPath();
      compassCtx.moveTo(ax, ay);
      compassCtx.lineTo(bx, by);
      compassCtx.strokeStyle = '#d4bb7c';
      compassCtx.lineWidth = 2.5;
      compassCtx.stroke();

      var tipAngle = 0.4;
      var tipLen = 20;
      compassCtx.beginPath();
      compassCtx.moveTo(bx, by);
      compassCtx.lineTo(bx - tipLen * Math.cos(faceAngle - tipAngle), by - tipLen * Math.sin(faceAngle - tipAngle));
      compassCtx.lineTo(bx - tipLen * Math.cos(faceAngle + tipAngle), by - tipLen * Math.sin(faceAngle + tipAngle));
      compassCtx.closePath();
      compassCtx.fillStyle = '#d4bb7c';
      compassCtx.fill();

      // 中心圆
      compassCtx.beginPath();
      compassCtx.arc(cx, cy, 8, 0, Math.PI * 2);
      compassCtx.fillStyle = 'rgba(184,154,92,0.3)';
      compassCtx.fill();
      compassCtx.beginPath();
      compassCtx.arc(cx, cy, 3, 0, Math.PI * 2);
      compassCtx.fillStyle = '#d4bb7c';
      compassCtx.fill();

      // 朝向标签
      var labelX = cx + Math.cos(faceAngle) * (rOuter + 18);
      var labelY = cy + Math.sin(faceAngle) * (rOuter + 18);
      compassCtx.fillStyle = '#d4bb7c';
      compassCtx.font = 'bold 11px "Noto Serif SC","SimSun",serif';
      compassCtx.textAlign = 'center';
      compassCtx.textBaseline = 'middle';
      compassCtx.fillText('向', labelX, labelY);

      // 坐山标签
      var sitAngle = faceAngle + Math.PI;
      var sitX = cx + Math.cos(sitAngle) * (rOuter + 18);
      var sitY = cy + Math.sin(sitAngle) * (rOuter + 18);
      compassCtx.fillStyle = 'rgba(184,154,92,0.6)';
      compassCtx.font = '10px "Noto Serif SC","SimSun",serif';
      compassCtx.fillText('坐', sitX, sitY);
    }

    // 根据罗盘角度计算坐向
    function updateCompassInfo() {
      var mountains = (global.FengshuiEngine && global.FengshuiEngine.MOUNTAINS_24) || [];
      var faceAngleDeg = ((((compassAngle * 180) / Math.PI) % 360) + 360) % 360;
      var mountainIdx = Math.round(faceAngleDeg / 15) % 24;
      if (mountainIdx < 0) mountainIdx += 24;
      currentFacing = mountains[mountainIdx] || '午';
      currentSitting = mountains[(mountainIdx + 12) % 24] || '子';
      infoSitting.textContent = currentSitting + '（' + getMountainName(currentSitting) + '）';
      infoFacing.textContent = currentFacing + '（' + getMountainName(currentFacing) + '）';
    }

    function getMountainName(m) {
      var names = {
        壬: '北偏西',
        子: '正北',
        癸: '北偏东',
        丑: '东北偏北',
        艮: '东北',
        寅: '东北偏东',
        甲: '东偏北',
        卯: '正东',
        乙: '东偏南',
        辰: '东南偏东',
        巽: '东南',
        巳: '东南偏南',
        丙: '南偏东',
        午: '正南',
        丁: '南偏西',
        未: '西南偏南',
        坤: '西南',
        申: '西南偏西',
        庚: '西偏南',
        酉: '正西',
        辛: '西偏北',
        戌: '西北偏西',
        乾: '西北',
        亥: '西北偏北',
      };
      return names[m] || m;
    }

    // 罗盘拖拽
    var isDragging = false;
    var dragStartAngle = 0;
    var dragStartCompassAngle = 0;

    gridWrapper.addEventListener('mousedown', function (e) {
      var rect = gridWrapper.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      var cx = rect.width / 2,
        cy = rect.height / 2;
      var dist = Math.sqrt((mx - cx) * (mx - cx) + (my - cy) * (my - cy));
      var wrapperSize = Math.min(rect.width, rect.height);
      // 与 drawCompass 中 rInner=size/2*0.68, rOuter=size/2*0.82，映射到 wrapper 空间: *1.24/2
      var rInner = wrapperSize * 0.4216;
      var rOuter = wrapperSize * 0.5084;
      if (dist >= rInner && dist <= rOuter) {
        isDragging = true;
        dragStartAngle = Math.atan2(my - cy, mx - cx);
        dragStartCompassAngle = compassAngle;
        gridWrapper.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation();
      }
    });

    gridWrapper.addEventListener('mousemove', function (e) {
      if (isDragging) {
        var rect = gridWrapper.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;
        var cx = rect.width / 2,
          cy = rect.height / 2;
        var currentAngle = Math.atan2(my - cy, mx - cx);
        compassAngle = dragStartCompassAngle + (currentAngle - dragStartAngle);
        updateCompassInfo();
        drawCompass();
      } else {
        var rect = gridWrapper.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;
        var cx = rect.width / 2,
          cy = rect.height / 2;
        var dist = Math.sqrt((mx - cx) * (mx - cx) + (my - cy) * (my - cy));
        var ws = Math.min(rect.width, rect.height);
        if (dist >= ws * 0.4216 && dist <= ws * 0.5084) {
          gridWrapper.style.cursor = 'grab';
        } else {
          gridWrapper.style.cursor = '';
        }
      }
    });

    window.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        gridWrapper.style.cursor = '';
        if (currentResult) doCalcWithCompass();
      }
    });

    // 触摸事件
    gridWrapper.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length === 1) {
          var rect = gridWrapper.getBoundingClientRect();
          var mx = e.touches[0].clientX - rect.left;
          var my = e.touches[0].clientY - rect.top;
          var cx = rect.width / 2,
            cy = rect.height / 2;
          var dist = Math.sqrt((mx - cx) * (mx - cx) + (my - cy) * (my - cy));
          var wrapperSize = Math.min(rect.width, rect.height);
          var rInner = wrapperSize * 0.4216;
          var rOuter = wrapperSize * 0.5084;
          if (dist >= rInner && dist <= rOuter) {
            isDragging = true;
            dragStartAngle = Math.atan2(my - cy, mx - cx);
            dragStartCompassAngle = compassAngle;
            e.preventDefault();
          }
        }
      },
      { passive: false }
    );

    window.addEventListener(
      'touchmove',
      function (e) {
        if (!isDragging) return;
        var rect = gridWrapper.getBoundingClientRect();
        var mx = e.touches[0].clientX - rect.left;
        var my = e.touches[0].clientY - rect.top;
        var cx = rect.width / 2,
          cy = rect.height / 2;
        var currentAngle = Math.atan2(my - cy, mx - cx);
        compassAngle = dragStartCompassAngle + (currentAngle - dragStartAngle);
        updateCompassInfo();
        drawCompass();
        e.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener('touchend', function () {
      if (isDragging) {
        isDragging = false;
        if (currentResult) doCalcWithCompass();
      }
    });

    function doCalcWithCompass() {
      updateCompassInfo();
      var buildYear = parseInt(container.querySelector('#fs-build-year').value) || 2024;
      var currentYr = parseInt(container.querySelector('#fs-current-year').value) || 2026;
      currentResult = global.FengshuiEngine.divine({
        sitting: currentSitting,
        facing: currentFacing,
        buildYear: buildYear,
        currentYear: currentYr,
      });
      container.querySelector('#fs-sitting').value = currentSitting;
      container.querySelector('#fs-facing').value = currentFacing;
      displayResult(container, currentResult);
      updateFloorPlanOverlay();
      // 同步到上传 Tab 的户型图叠加
      if (container._setFloorPlanResult) {
        container._setFloorPlanResult(currentResult);
      }
    }

    function updateFloorPlanOverlay() {
      if (!currentResult) return;
      var cells = builderGrid.querySelectorAll('.fs-grid-cell');
      cells.forEach(function (cell) {
        var pi = parseInt(cell.dataset.palaceIdx);
        var palace = currentResult.palaces[pi];
        if (palace) {
          var levelColor =
            palace.level === '大吉' || palace.level === '吉'
              ? 'rgba(90,138,90,0.15)'
              : palace.level === '中平'
                ? 'rgba(138,130,120,0.1)'
                : 'rgba(200,64,64,0.12)';
          cell.style.boxShadow = 'inset 0 0 20px ' + levelColor;
          if (palace.level === '大吉' || palace.level === '吉') {
            cell.style.borderColor = 'rgba(90,138,90,0.3)';
          } else if (palace.level === '中平') {
            cell.style.borderColor = 'rgba(184,154,92,0.2)';
          } else {
            cell.style.borderColor = 'rgba(200,64,64,0.2)';
          }
        }
      });
    }

    // 暴露给手动排盘 doCalc() 同步更新拼户型叠加
    container._updateBuilderOverlay = function (result) {
      currentResult = result;
      updateFloorPlanOverlay();
    };

    // 建造器排盘按钮
    container.querySelector('#fs-build-calc-btn').addEventListener('click', function () {
      updateCompassInfo();
      doCalcWithCompass();
    });

    // 清空房间
    container.querySelector('#fs-clear-rooms-btn').addEventListener('click', function () {
      gridRooms = new Array(gridCols * gridRows).fill(null);
      renderGrid();
      if (currentResult) updateFloorPlanOverlay();
    });

    // 随机布局
    container.querySelector('#fs-random-rooms-btn').addEventListener('click', function () {
      var essential = ['living', 'master', 'kitchen', 'bath'];
      var optional = ['second', 'study', 'dining', 'balcony', 'entrance'];
      var totalCells = gridCols * gridRows;
      gridRooms = new Array(totalCells).fill(null);
      var indices = [];
      for (var i = 0; i < totalCells; i++) indices.push(i);
      shuffle(indices);
      for (var i = 0; i < essential.length && i < totalCells; i++) {
        gridRooms[indices[i]] = ROOM_TYPES.find(function (r) {
          return r.id === essential[i];
        });
      }
      var maxExtra = Math.min(optional.length, totalCells - essential.length);
      var extraCount = Math.min(maxExtra, Math.floor(totalCells * 0.4));
      if (extraCount < 2) extraCount = Math.min(2, maxExtra);
      shuffle(optional);
      for (var i = 0; i < extraCount && i + essential.length < totalCells; i++) {
        gridRooms[indices[i + essential.length]] = ROOM_TYPES.find(function (r) {
          return r.id === optional[i];
        });
      }
      renderGrid();
      if (currentResult) updateFloorPlanOverlay();
    });

    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
    }

    // 初始化
    updateCompassInfo();
    drawCompass();
    window.addEventListener('resize', function () {
      drawCompass();
    });
  }

  /* ========== 户型图上传 ========== */
  function initUpload(container) {
    var floorCanvas = container.querySelector('#fs-floor-canvas');
    var fctx = floorCanvas.getContext('2d');
    var uploadZone = container.querySelector('#fs-upload-zone');
    var fileInput = container.querySelector('#fs-file-input');
    var floorWrap = container.querySelector('#fs-floor-plan-wrap');
    var floorControls = container.querySelector('#fs-floor-controls');
    var gridOpacitySlider = container.querySelector('#fs-grid-opacity');
    var toggleGridBtn = container.querySelector('#fs-toggle-grid-btn');

    var floorImg = null;
    var gridVisible = true;
    var gridX = 0,
      gridY = 0,
      gridW = 300,
      gridH = 300;
    var dragging = false,
      dragStartX = 0,
      dragStartY = 0,
      gridStartX = 0,
      gridStartY = 0;
    var currentResult = null;

    uploadZone.addEventListener('click', function (e) {
      if (e.target !== fileInput) fileInput.click();
    });
    fileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) loadImage(e.target.files[0]);
    });

    uploadZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.add('drag-over');
    });
    uploadZone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.remove('drag-over');
    });
    uploadZone.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.remove('drag-over');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]);
    });

    function loadImage(file) {
      var reader = new FileReader();
      reader.onload = function (ev) {
        var img = new Image();
        img.onload = function () {
          floorImg = img;
          uploadZone.classList.add('has-image');
          container.querySelector('#fs-upload-placeholder').style.display = 'none';
          floorWrap.style.display = 'block';
          floorControls.style.display = 'flex';
          resetGrid();
          drawFloorPlan();
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }

    function resetGrid() {
      if (!floorImg) return;
      var cw = (floorCanvas.width = floorCanvas.parentElement.clientWidth);
      floorCanvas.height = Math.round(cw * (floorImg.height / floorImg.width));
      var minDim = Math.min(floorCanvas.width, floorCanvas.height);
      gridW = minDim * 0.75;
      gridH = gridW;
      gridX = (floorCanvas.width - gridW) / 2;
      gridY = (floorCanvas.height - gridH) / 2;
    }

    window.addEventListener('resize', function () {
      if (floorImg) {
        resetGrid();
        drawFloorPlan();
      }
    });

    floorCanvas.addEventListener('mousedown', function (e) {
      var rect = floorCanvas.getBoundingClientRect();
      var scaleX = floorCanvas.width / rect.width;
      var scaleY = floorCanvas.height / rect.height;
      var mx = (e.clientX - rect.left) * scaleX;
      var my = (e.clientY - rect.top) * scaleY;
      if (mx >= gridX && mx <= gridX + gridW && my >= gridY && my <= gridY + gridH) {
        dragging = true;
        dragStartX = mx;
        dragStartY = my;
        gridStartX = gridX;
        gridStartY = gridY;
        floorCanvas.style.cursor = 'grabbing';
      }
    });

    floorCanvas.addEventListener('mousemove', function (e) {
      var rect = floorCanvas.getBoundingClientRect();
      var scaleX = floorCanvas.width / rect.width;
      var scaleY = floorCanvas.height / rect.height;
      var mx = (e.clientX - rect.left) * scaleX;
      var my = (e.clientY - rect.top) * scaleY;
      if (dragging) {
        gridX = gridStartX + (mx - dragStartX);
        gridY = gridStartY + (my - dragStartY);
        gridX = Math.max(-gridW * 0.5, Math.min(floorCanvas.width - gridW * 0.5, gridX));
        gridY = Math.max(-gridH * 0.5, Math.min(floorCanvas.height - gridH * 0.5, gridY));
        drawFloorPlan();
      } else {
        floorCanvas.style.cursor =
          mx >= gridX && mx <= gridX + gridW && my >= gridY && my <= gridY + gridH ? 'grab' : 'default';
      }
    });

    window.addEventListener('mouseup', function () {
      dragging = false;
      floorCanvas.style.cursor = 'grab';
    });

    floorCanvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      var rect = floorCanvas.getBoundingClientRect();
      var scaleX = floorCanvas.width / rect.width;
      var scaleY = floorCanvas.height / rect.height;
      var mx = (e.clientX - rect.left) * scaleX;
      var my = (e.clientY - rect.top) * scaleY;
      var zoom = 1 + (e.deltaY > 0 ? -0.05 : 0.05);
      var newW = gridW * zoom,
        newH = gridH * zoom;
      if (newW < 40 || newH < 40 || newW > floorCanvas.width * 2 || newH > floorCanvas.height * 2) return;
      var ratioX = (mx - gridX) / gridW;
      var ratioY = (my - gridY) / gridH;
      gridX = mx - newW * ratioX;
      gridY = my - newH * ratioY;
      gridW = newW;
      gridH = newH;
      drawFloorPlan();
    });

    gridOpacitySlider.addEventListener('input', function () {
      drawFloorPlan();
    });
    container.querySelector('#fs-reset-grid-btn').addEventListener('click', function () {
      resetGrid();
      drawFloorPlan();
    });
    toggleGridBtn.addEventListener('click', function () {
      gridVisible = !gridVisible;
      toggleGridBtn.textContent = gridVisible ? '隐藏网格' : '显示网格';
      drawFloorPlan();
    });
    container.querySelector('#fs-remove-img-btn').addEventListener('click', function () {
      floorImg = null;
      uploadZone.classList.remove('has-image');
      container.querySelector('#fs-upload-placeholder').style.display = '';
      floorWrap.style.display = 'none';
      floorControls.style.display = 'none';
      fileInput.value = '';
    });

    function drawFloorPlan() {
      if (!floorImg) return;
      var cw = floorCanvas.width,
        ch = floorCanvas.height;
      fctx.clearRect(0, 0, cw, ch);
      fctx.drawImage(floorImg, 0, 0, cw, ch);
      if (!gridVisible) return;
      var opacity = parseInt(gridOpacitySlider.value) / 100;
      var cellW = gridW / 3,
        cellH = gridH / 3;
      var displayIdx = [3, 8, 1, 2, 4, 6, 7, 0, 5];
      for (var di = 0; di < displayIdx.length; di++) {
        var pi = displayIdx[di];
        var row = Math.floor(di / 3),
          col = di % 3;
        var cx = gridX + col * cellW,
          cy = gridY + row * cellH;
        var palace = currentResult ? currentResult.palaces[pi] : null;
        var bgColor = 'rgba(20,16,12,';
        if (palace) {
          if (palace.level === '大吉' || palace.level === '吉') bgColor = 'rgba(90,138,90,';
          else if (palace.level === '中平') bgColor = 'rgba(138,130,120,';
          else bgColor = 'rgba(200,64,64,';
        }
        fctx.fillStyle = bgColor + opacity * 0.5 + ')';
        fctx.fillRect(cx, cy, cellW, cellH);
        fctx.strokeStyle = 'rgba(184,154,92,' + opacity * 0.6 + ')';
        fctx.lineWidth = 1.5;
        fctx.strokeRect(cx, cy, cellW, cellH);
        if (palace) {
          fctx.fillStyle = 'rgba(255,255,255,' + opacity * 0.9 + ')';
          fctx.font = 'bold ' + Math.min(cellW, cellH) * 0.12 + 'px "Noto Serif SC","SimSun",serif';
          fctx.textAlign = 'center';
          fctx.textBaseline = 'middle';
          fctx.fillText(palace.name.replace(/\(.*\)/, ''), cx + cellW / 2, cy + cellH * 0.3);
          fctx.font = Math.min(cellW, cellH) * 0.1 + 'px "Noto Sans SC","Microsoft YaHei",sans-serif';
          var levelColor =
            palace.level === '大吉' || palace.level === '吉'
              ? '#a8d8a8'
              : palace.level === '中平'
                ? '#a8b8c8'
                : '#d8a8a8';
          fctx.fillStyle = levelColor;
          fctx.fillText(palace.level + ' ' + palace.score, cx + cellW / 2, cy + cellH * 0.6);
          fctx.font = 'bold ' + Math.min(cellW, cellH) * 0.09 + 'px "Noto Sans SC","Microsoft YaHei",sans-serif';
          fctx.fillStyle = 'rgba(255,255,255,' + opacity * 0.7 + ')';
          fctx.fillText(
            '运' +
              palace.periodStar +
              ' 山' +
              palace.mountainStar +
              ' 向' +
              palace.facingStar +
              ' 年' +
              palace.annualStar,
            cx + cellW / 2,
            cy + cellH * 0.82
          );
        }
      }
      fctx.strokeStyle = 'rgba(184,154,92,' + opacity * 0.8 + ')';
      fctx.lineWidth = 2;
      fctx.strokeRect(gridX, gridY, gridW, gridH);
      var cornerSize = Math.min(cellW, cellH) * 0.12;
      fctx.fillStyle = 'rgba(184,154,92,' + opacity * 0.6 + ')';
      [
        [gridX, gridY],
        [gridX + gridW - cornerSize, gridY],
        [gridX, gridY + gridH - cornerSize],
        [gridX + gridW - cornerSize, gridY + gridH - cornerSize],
      ].forEach(function (pt) {
        fctx.fillRect(pt[0], pt[1], cornerSize, cornerSize);
      });
    }

    // 暴露给排盘结果更新
    container._setFloorPlanResult = function (result) {
      currentResult = result;
      if (floorImg) drawFloorPlan();
    };
  }

  /* ========== 排盘 ========== */
  function doCalc(container) {
    var engine = global.FengshuiEngine;
    if (!engine) {
      var resultArea = container.querySelector('#fs-result-area');
      if (resultArea) resultArea.style.display = 'none';
      return;
    }

    var buildYear = parseInt(container.querySelector('#fs-build-year').value) || 2024;
    var sitting = container.querySelector('#fs-sitting').value || '子';
    var facing = container.querySelector('#fs-facing').value || '午';
    var currentYear = parseInt(container.querySelector('#fs-current-year').value) || 2026;

    var result = engine.divine({
      sitting: sitting,
      facing: facing,
      buildYear: buildYear,
      currentYear: currentYear,
    });

    displayResult(container, result);

    // 通知上传模块更新
    if (container._setFloorPlanResult) {
      container._setFloorPlanResult(result);
    }
    // 同步到拼户型 Tab 的九宫叠加
    if (container._updateBuilderOverlay) {
      container._updateBuilderOverlay(result);
    }
  }

  /* ========== 结果展示 ========== */
  function displayResult(container, result) {
    container.querySelector('#fs-result-area').style.display = 'block';

    var levelColors = {
      上吉: '#c8d8a8',
      中吉: '#d8c8a8',
      中平: '#a8b8c8',
      凶: '#d8a8a8',
      大凶: '#d84040',
    };
    var scoreEl = container.querySelector('#fs-overall-score');
    var levelEl = container.querySelector('#fs-overall-level');
    scoreEl.textContent = result.overallScore;
    scoreEl.style.color = levelColors[result.overallLevel] || '#c8d8a8';
    levelEl.textContent = result.overallLevel;
    levelEl.style.color = levelColors[result.overallLevel] || '#c8d8a8';
    container.querySelector('#fs-overview-info').textContent =
      '坐' +
      result.sitting +
      '向' +
      result.facing +
      ' | ' +
      result.buildYear +
      '年建（' +
      result.periodNum +
      '运）| ' +
      result.currentYear +
      '年流年飞星';

    renderGrid(container, result);
    renderBestWorst(container, result);
    renderTable(container, result);
  }

  function renderGrid(container, result) {
    var gridEl = container.querySelector('#fs-grid');
    if (!gridEl) return;

    var stars = (global.FengshuiEngine && global.FengshuiEngine.STARS) || {};
    var displayIdx = [3, 8, 1, 2, 4, 6, 7, 0, 5];

    var html = '';
    for (var di = 0; di < displayIdx.length; di++) {
      if (di === 0 || di === 3 || di === 6) html += '<div class="fs-grid-row">';
      var pi = displayIdx[di];
      var p = result.palaces[pi];
      var levelClass =
        'fs-cell-' + (p.level === '大吉' || p.level === '吉' ? 'ji' : p.level === '中平' ? 'zhong' : 'xiong');
      html +=
        '<div class="fs-cell ' +
        levelClass +
        '">' +
        '<div class="fs-cell-name">' +
        (p.name || '') +
        '</div>' +
        '<div class="fs-cell-stars">' +
        '<span class="fs-star-tag" style="background:' +
        getStarColor(p.periodStar, stars) +
        ';">运' +
        p.periodStar +
        '</span>' +
        '<span class="fs-star-tag" style="background:' +
        getStarColor(p.mountainStar, stars) +
        ';">山' +
        p.mountainStar +
        '</span>' +
        '<span class="fs-star-tag" style="background:' +
        getStarColor(p.facingStar, stars) +
        ';">向' +
        p.facingStar +
        '</span>' +
        '<span class="fs-star-tag" style="background:' +
        getStarColor(p.annualStar, stars) +
        ';">年' +
        p.annualStar +
        '</span>' +
        '</div>' +
        '<div class="fs-cell-level">' +
        p.level +
        ' (' +
        p.score +
        ')</div>' +
        '</div>';
      if (di === 2 || di === 5 || di === 8) html += '</div>';
    }

    gridEl.innerHTML = html;
  }

  function renderBestWorst(container, result) {
    var bestEl = container.querySelector('#fs-best-card');
    var worstEl = container.querySelector('#fs-worst-card');
    if (!bestEl || !worstEl) return;

    var bp = result.bestPalace;
    var wp = result.worstPalace;

    bestEl.innerHTML =
      '<h3 style="color:#c8d8a8;margin-bottom:12px;">✅ 最佳方位</h3>' +
      '<div style="font-size:1.1rem;font-weight:600;color:var(--gold-light);">' +
      (bp.name || '') +
      '</div>' +
      '<div style="color:var(--text-muted);margin:8px 0;">综合评分：' +
      bp.score +
      '（' +
      bp.level +
      '）</div>' +
      (bp.notes && bp.notes.length > 0 ? '<div style="color:#a8c8a8;">' + bp.notes.join('；') + '</div>' : '');

    worstEl.innerHTML =
      '<h3 style="color:#d8a8a8;margin-bottom:12px;">⚠️ 最差方位</h3>' +
      '<div style="font-size:1.1rem;font-weight:600;color:var(--gold-light);">' +
      (wp.name || '') +
      '</div>' +
      '<div style="color:var(--text-muted);margin:8px 0;">综合评分：' +
      wp.score +
      '（' +
      wp.level +
      '）</div>' +
      (wp.warnings && wp.warnings.length > 0 ? '<div style="color:#d8a8a8;">' + wp.warnings.join('；') + '</div>' : '');
  }

  function renderTable(container, result) {
    var tableEl = container.querySelector('#fs-table');
    if (!tableEl) return;

    var stars = (global.FengshuiEngine && global.FengshuiEngine.STARS) || {};
    var html =
      '<table class="fs-detail-table"><thead><tr>' +
      '<th>宫位</th><th>八卦</th><th>五行</th><th>运星</th><th>山星</th><th>向星</th><th>年星</th><th>评分</th><th>等级</th><th>提示</th>' +
      '</tr></thead><tbody>';

    for (var i = 0; i < result.palaces.length; i++) {
      var p = result.palaces[i];
      var allNotes = (p.notes || []).concat(p.warnings || []);
      html +=
        '<tr>' +
        '<td>' +
        (p.name || '') +
        '</td>' +
        '<td>' +
        (p.gua || '') +
        '</td>' +
        '<td>' +
        (p.wuxing || '') +
        '</td>' +
        '<td><span class="fs-star-dot" style="background:' +
        getStarColor(p.periodStar, stars) +
        ';"></span>' +
        p.periodStar +
        '</td>' +
        '<td><span class="fs-star-dot" style="background:' +
        getStarColor(p.mountainStar, stars) +
        ';"></span>' +
        p.mountainStar +
        '</td>' +
        '<td><span class="fs-star-dot" style="background:' +
        getStarColor(p.facingStar, stars) +
        ';"></span>' +
        p.facingStar +
        '</td>' +
        '<td><span class="fs-star-dot" style="background:' +
        getStarColor(p.annualStar, stars) +
        ';"></span>' +
        p.annualStar +
        '</td>' +
        '<td style="font-weight:600;">' +
        p.score +
        '</td>' +
        '<td style="color:' +
        (p.level === '大吉' || p.level === '吉' ? '#c8d8a8' : p.level === '中平' ? '#a8b8c8' : '#d8a8a8') +
        ';font-weight:600;">' +
        p.level +
        '</td>' +
        '<td style="font-size:0.8rem;color:var(--text-muted);">' +
        (allNotes.length > 0 ? allNotes.join('；') : '—') +
        '</td>' +
        '</tr>';
    }
    html += '</tbody></table>';
    tableEl.innerHTML = html;
  }

  function getStarColor(starNum, stars) {
    var s = stars[starNum];
    return s ? s.color : '#888';
  }

  /* ========== 公开 API ========== */
  global.FengshuiComponent = {
    render: render,
  };

  global.renderFengshuiComponent = function () {
    var div = document.createElement('div');
    render(div);
    return div;
  };
})(typeof window !== 'undefined' ? window : this);
