/**
 * 天机阁 · 风水引擎 v1 — 玄空飞星 + 二十四山 + 九宫飞泊
 * 纯前端，零API
 * 独立板块，不算在合参
 */
(function (global) {
  'use strict';

  /* ========== 一、二十四山 ========== */
  var MOUNTAINS_24 = [
    '壬',
    '子',
    '癸',
    '丑',
    '艮',
    '寅',
    '甲',
    '卯',
    '乙',
    '辰',
    '巽',
    '巳',
    '丙',
    '午',
    '丁',
    '未',
    '坤',
    '申',
    '庚',
    '酉',
    '辛',
    '戌',
    '乾',
    '亥',
  ];

  // 二十四山对应八卦
  var MOUNTAIN_GUA = {
    壬: '坎',
    子: '坎',
    癸: '坎',
    丑: '艮',
    艮: '艮',
    寅: '艮',
    甲: '震',
    卯: '震',
    乙: '震',
    辰: '巽',
    巽: '巽',
    巳: '巽',
    丙: '离',
    午: '离',
    丁: '离',
    未: '坤',
    坤: '坤',
    申: '坤',
    庚: '兑',
    酉: '兑',
    辛: '兑',
    戌: '乾',
    乾: '乾',
    亥: '乾',
  };

  // 二十四山对应三元（天元/人元/地元）
  var MOUNTAIN_YUAN = {
    子: '天',
    午: '天',
    卯: '天',
    酉: '天',
    乾: '天',
    坤: '天',
    艮: '天',
    巽: '天',
    壬: '地',
    甲: '地',
    丙: '地',
    庚: '地',
    辰: '地',
    戌: '地',
    丑: '地',
    未: '地',
    癸: '人',
    乙: '人',
    丁: '人',
    辛: '人',
    寅: '人',
    申: '人',
    巳: '人',
    亥: '人',
  };

  // 二十四山阴阳
  var MOUNTAIN_YINYANG = {
    子: '阳',
    丑: '阴',
    寅: '阳',
    卯: '阴',
    辰: '阳',
    巳: '阴',
    午: '阳',
    未: '阴',
    申: '阳',
    酉: '阴',
    戌: '阳',
    亥: '阴',
    壬: '阳',
    癸: '阴',
    甲: '阳',
    乙: '阴',
    丙: '阳',
    丁: '阴',
    庚: '阳',
    辛: '阴',
    乾: '阳',
    坤: '阴',
    艮: '阳',
    巽: '阴',
  };

  /* ========== 二、九宫数据 ========== */
  var GONG_NAMES = [
    '坎一宫(北)',
    '坤二宫(西南)',
    '震三宫(东)',
    '巽四宫(东南)',
    '中五宫',
    '乾六宫(西北)',
    '兑七宫(西)',
    '艮八宫(东北)',
    '离九宫(南)',
  ];

  var GONG_WUXING = ['水', '土', '木', '木', '土', '金', '金', '土', '火'];

  var GONG_GUA = ['坎', '坤', '震', '巽', '中', '乾', '兑', '艮', '离'];

  /* ========== 三、飞星数据 ========== */
  // 九星名称与属性
  var STARS = {
    1: { name: '一白贪狼', wuxing: '水', color: '#4a9eff', ji: '吉', desc: '桃花、人缘、智慧、文昌' },
    2: { name: '二黑巨门', wuxing: '土', color: '#8b7355', ji: '凶', desc: '病符、疾病、伤痛、是非' },
    3: { name: '三碧禄存', wuxing: '木', color: '#5a8a3c', ji: '凶', desc: '是非、官非、口舌、争斗' },
    4: { name: '四绿文曲', wuxing: '木', color: '#7ec87e', ji: '中', desc: '文昌、学业、桃花、艺术' },
    5: { name: '五黄廉贞', wuxing: '土', color: '#c8a000', ji: '大凶', desc: '灾祸、疾病、破财、意外' },
    6: { name: '六白武曲', wuxing: '金', color: '#d4d4d4', ji: '吉', desc: '权力、官运、偏财、贵人' },
    7: { name: '七赤破军', wuxing: '金', color: '#c04040', ji: '凶', desc: '破财、盗贼、口舌、手术' },
    8: { name: '八白左辅', wuxing: '土', color: '#ffd700', ji: '吉', desc: '正财、置业、升职、旺丁' },
    9: { name: '九紫右弼', wuxing: '火', color: '#ff6b6b', ji: '吉', desc: '喜庆、桃花、添丁、贵人' },
  };

  /* ========== 四、三元九运 ========== */
  // 上元
  var PERIOD_1 = { start: 1864, end: 1883, num: 1 };
  var PERIOD_2 = { start: 1884, end: 1903, num: 2 };
  var PERIOD_3 = { start: 1904, end: 1923, num: 3 };
  // 中元
  var PERIOD_4 = { start: 1924, end: 1943, num: 4 };
  var PERIOD_5 = { start: 1944, end: 1963, num: 5 };
  var PERIOD_6 = { start: 1964, end: 1983, num: 6 };
  // 下元
  var PERIOD_7 = { start: 1984, end: 2003, num: 7 };
  var PERIOD_8 = { start: 2004, end: 2023, num: 8 };
  var PERIOD_9 = { start: 2024, end: 2043, num: 9 };

  var ALL_PERIODS = [PERIOD_1, PERIOD_2, PERIOD_3, PERIOD_4, PERIOD_5, PERIOD_6, PERIOD_7, PERIOD_8, PERIOD_9];

  /** 获取年份对应的元运 */
  function getPeriod(year) {
    for (var i = ALL_PERIODS.length - 1; i >= 0; i--) {
      if (year >= ALL_PERIODS[i].start && year <= ALL_PERIODS[i].end) {
        return ALL_PERIODS[i].num;
      }
    }
    return 9; // 默认九运
  }

  /* ========== 五、运盘（洛书九宫） ========== */
  // 各运的运星入中后飞泊九宫
  // 洛书轨迹：中→乾→兑→艮→离→坎→坤→震→巽
  var FLY_PATH = [4, 5, 6, 7, 8, 0, 1, 2, 3]; // index of 宫 for each step

  /** 计算某运的运盘 */
  function getPeriodChart(periodNum) {
    // 5黄入中时按所在元运的阴阳决定寄宫
    var chart = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    // 从入中宫开始，按洛书轨迹飞泊
    chart[4] = periodNum; // 中宫

    // 飞泊顺序：中→乾→兑→艮→离→坎→坤→震→巽
    var flyOrder = [4, 5, 6, 7, 8, 0, 1, 2, 3];
    for (var i = 0; i < 9; i++) {
      var val = periodNum + i;
      if (val > 9) val -= 9;
      chart[flyOrder[i]] = val;
    }
    return chart;
  }

  /* ========== 六、山星与向星计算 ========== */
  /**
   * 根据坐向计算山星和向星
   * @param {string} sitting - 坐山（二十四山之一）
   * @param {string} facing - 朝向（二十四山之一）
   * @param {number} periodNum - 元运数字
   */
  function calcMountainAndFacingStars(sitting, facing, periodNum) {
    var periodChart = getPeriodChart(periodNum);

    // 找到坐山和向山所在的宫位
    var sitGua = MOUNTAIN_GUA[sitting];
    var faceGua = MOUNTAIN_GUA[facing];
    var sitGongIdx = GONG_GUA.indexOf(sitGua);
    var faceGongIdx = GONG_GUA.indexOf(faceGua);

    // 运星在坐宫的数字 = 山星入中数字
    var sitPeriodStar = periodChart[sitGongIdx];
    var facePeriodStar = periodChart[faceGongIdx];

    // 山星入中数字
    var mountainCenter = sitPeriodStar;
    // 向星入中数字
    var facingCenter = facePeriodStar;

    // 判断顺逆飞：坐山阴阳决定山星顺逆，朝向阴阳决定向星顺逆
    var sitYY = MOUNTAIN_YINYANG[sitting] || '阳';
    var faceYY = MOUNTAIN_YINYANG[facing] || '阳';
    var mtnShun = sitYY === '阳'; // 阳顺阴逆
    var facShun = faceYY === '阳';

    var flyOrder = [4, 5, 6, 7, 8, 0, 1, 2, 3]; // 顺飞轨迹
    var revFlyOrder = [4, 3, 2, 1, 0, 8, 7, 6, 5]; // 逆飞轨迹

    // 飞泊山星
    var mountainStars = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    mountainStars[4] = mountainCenter;
    var order = mtnShun ? flyOrder : revFlyOrder;
    for (var i = 0; i < 9; i++) {
      var val = mtnShun ? mountainCenter + i : mountainCenter - i;
      while (val > 9) val -= 9;
      while (val < 1) val += 9;
      mountainStars[order[i]] = val;
    }

    // 飞泊向星
    var facingStars = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    facingStars[4] = facingCenter;
    order = facShun ? flyOrder : revFlyOrder;
    for (var i = 0; i < 9; i++) {
      var val = facShun ? facingCenter + i : facingCenter - i;
      while (val > 9) val -= 9;
      while (val < 1) val += 9;
      facingStars[order[i]] = val;
    }

    return {
      mountainStars: mountainStars,
      facingStars: facingStars,
      sitGongIdx: sitGongIdx,
      faceGongIdx: faceGongIdx,
      mountainShun: mtnShun,
      facingShun: facShun,
    };
  }

  /* ========== 七、年星计算 ========== */
  /** 计算某年的年星飞泊 */
  function getAnnualStars(year) {
    // 1900年一白入中
    var baseYear = 1900;
    var baseStar = 1;
    var diff = year - baseYear;
    // 每年年星减1（逆飞）
    var centerStar = (baseStar - diff) % 9;
    if (centerStar <= 0) centerStar += 9;

    var stars = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    stars[4] = centerStar;
    var flyOrder = [4, 5, 6, 7, 8, 0, 1, 2, 3];
    for (var i = 0; i < 9; i++) {
      var val = centerStar + i;
      if (val > 9) val -= 9;
      stars[flyOrder[i]] = val;
    }
    return stars;
  }

  /* ========== 八、宫位吉凶评估 ========== */
  /** 评估单个宫位的吉凶 */
  function evaluatePalace(periodStar, mountainStar, facingStar, annualStar, gongIdx) {
    var score = 60; // 基础分
    var notes = [];
    var warnings = [];

    var wxSheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' };
    var wxKe = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' };
    var gongWx = GONG_WUXING[gongIdx];
    var pWx = (STARS[periodStar] || {}).wuxing || '';
    var mWx = (STARS[mountainStar] || {}).wuxing || '';
    var fWx = (STARS[facingStar] || {}).wuxing || '';

    // 检查五黄（5）
    if (periodStar === 5) {
      score -= 18;
      warnings.push('运星五黄临宫');
    }
    if (mountainStar === 5) {
      score -= 18;
      warnings.push('山星五黄临宫');
    }
    if (facingStar === 5) {
      score -= 18;
      warnings.push('向星五黄临宫');
    }
    if (annualStar === 5) {
      score -= 22;
      warnings.push('年星五黄临宫——今年此方位大凶');
    }

    // 检查二黑（2）
    if (periodStar === 2) {
      score -= 10;
      warnings.push('运星二黑病符');
    }
    if (mountainStar === 2) {
      score -= 10;
      warnings.push('山星二黑病符');
    }
    if (facingStar === 2) {
      score -= 10;
      warnings.push('向星二黑病符');
    }
    if (annualStar === 2) {
      score -= 12;
      warnings.push('年星二黑病符——今年注意健康');
    }

    // 吉星加分
    if (periodStar === 8) {
      score += 14;
      notes.push('运星八白旺财');
    }
    if (mountainStar === 8) {
      score += 14;
      notes.push('山星八白旺丁');
    }
    if (facingStar === 8) {
      score += 14;
      notes.push('向星八白旺财');
    }
    if (annualStar === 8) {
      score += 12;
      notes.push('年星八白——今年财运佳');
    }

    if (periodStar === 9) {
      score += 12;
      notes.push('运星九紫喜庆');
    }
    if (mountainStar === 9) {
      score += 12;
      notes.push('山星九紫旺丁');
    }
    if (facingStar === 9) {
      score += 12;
      notes.push('向星九紫喜事');
    }
    if (annualStar === 9) {
      score += 10;
      notes.push('年星九紫——今年喜事临门');
    }

    if (periodStar === 1) {
      score += 10;
      notes.push('运星一白文昌');
    }
    if (mountainStar === 1) {
      score += 10;
      notes.push('山星一白旺人缘');
    }
    if (facingStar === 1) {
      score += 10;
      notes.push('向星一白旺桃花');
    }
    if (annualStar === 1) {
      score += 8;
      notes.push('年星一白——今年人缘桃花旺');
    }

    if (periodStar === 6) {
      score += 10;
      notes.push('运星六白权贵');
    }
    if (mountainStar === 6) {
      score += 10;
      notes.push('山星六白旺官运');
    }
    if (facingStar === 6) {
      score += 10;
      notes.push('向星六白旺偏财');
    }
    if (annualStar === 6) {
      score += 8;
      notes.push('年星六白——今年官运/偏财佳');
    }

    if (periodStar === 4) {
      score += 6;
      notes.push('运星四绿文昌');
    }
    if (mountainStar === 4) {
      score += 6;
      notes.push('山星四绿利学业');
    }
    if (facingStar === 4) {
      score += 6;
      notes.push('向星四绿利考试');
    }
    if (annualStar === 4) {
      score += 5;
      notes.push('年星四绿——今年文昌运旺');
    }

    // 凶星减分
    if (periodStar === 3) {
      score -= 6;
      warnings.push('运星三碧是非');
    }
    if (mountainStar === 3) {
      score -= 6;
      warnings.push('山星三碧口舌');
    }
    if (facingStar === 3) {
      score -= 6;
      warnings.push('向星三碧争斗');
    }
    if (annualStar === 3) {
      score -= 8;
      warnings.push('年星三碧——今年防口舌是非');
    }

    if (periodStar === 7) {
      score -= 6;
      warnings.push('运星七赤破财');
    }
    if (mountainStar === 7) {
      score -= 6;
      warnings.push('山星七赤盗贼');
    }
    if (facingStar === 7) {
      score -= 6;
      warnings.push('向星七赤手术');
    }
    if (annualStar === 7) {
      score -= 8;
      warnings.push('年星七赤——今年防盗贼破财');
    }

    // 山向合十（山星+向星=10）为吉
    if (mountainStar + facingStar === 10) {
      score += 12;
      notes.push('山向合十——夫妻同心，大局安稳');
    }

    // 宫位五行与星曜五行生克
    if (pWx && wxSheng[gongWx] === pWx) {
      score += 6;
      notes.push('运星' + pWx + '生宫' + gongWx + '——宫位得生，根基稳固');
    }
    if (pWx && wxKe[gongWx] === pWx) {
      score -= 6;
      warnings.push('运星' + pWx + '克宫' + gongWx + '——宫位受克，根基不稳');
    }
    if (mWx && wxSheng[gongWx] === mWx) {
      score += 5;
      notes.push('山星' + mWx + '生宫' + gongWx + '——人丁得气');
    }
    if (mWx && wxKe[gongWx] === mWx) {
      score -= 5;
      warnings.push('山星' + mWx + '克宫' + gongWx + '——人丁受损');
    }
    if (fWx && wxSheng[gongWx] === fWx) {
      score += 5;
      notes.push('向星' + fWx + '生宫' + gongWx + '——财运得气');
    }
    if (fWx && wxKe[gongWx] === fWx) {
      score -= 5;
      warnings.push('向星' + fWx + '克宫' + gongWx + '——财运受损');
    }

    // ═══ 星组组合分析 ═══
    var combos = [
      { s1: periodStar, s2: mountainStar, label: '运山' },
      { s1: periodStar, s2: facingStar, label: '运向' },
      { s1: periodStar, s2: annualStar, label: '运年' },
      { s1: mountainStar, s2: facingStar, label: '山向' },
      { s1: mountainStar, s2: annualStar, label: '山年' },
      { s1: facingStar, s2: annualStar, label: '向年' },
    ];
    for (var ci = 0; ci < combos.length; ci++) {
      var c = combos[ci];
      if ((c.s1 === 2 && c.s2 === 5) || (c.s1 === 5 && c.s2 === 2)) {
        score -= 20;
        warnings.push(c.label + '二五交加——主重病、灾祸，此方大凶！宜以金属器物（铜铃、六帝钱）化泄');
      }
      if ((c.s1 === 5 && c.s2 === 9) || (c.s1 === 9 && c.s2 === 5)) {
        score -= 12;
        warnings.push(c.label + '九五火土相生——凶焰更炽，主火灾、急症、血光。宜用水制火（黑色物品、鱼缸）');
      }
      if ((c.s1 === 2 && c.s2 === 9) || (c.s1 === 9 && c.s2 === 2)) {
        score -= 10;
        warnings.push(c.label + '二九火土——病符遇火，炎症发热之象。宜金泄土（铜器）');
      }
      if ((c.s1 === 1 && c.s2 === 4) || (c.s1 === 4 && c.s2 === 1)) {
        score += 10;
        notes.push(c.label + '一四同宫——文昌大旺，利学业、考试、功名！宜摆放文昌塔、毛笔、绿色植物');
      }
      if ((c.s1 === 3 && c.s2 === 8) || (c.s1 === 8 && c.s2 === 3)) {
        score -= 6;
        warnings.push(c.label + '三八木克土——财星受损，因是非破财。宜火泄木（红色物品）');
      }
      if ((c.s1 === 7 && c.s2 === 9) || (c.s1 === 9 && c.s2 === 7)) {
        score -= 8;
        warnings.push(c.label + '七九火克金——回禄之灾，防火盗。宜土泄火（黄色物品）');
      }
      if ((c.s1 === 6 && c.s2 === 8) || (c.s1 === 8 && c.s2 === 6)) {
        score += 10;
        notes.push(c.label + '六八土生金——官财两旺，富贵双全之象！宜金属摆件、水晶球催旺');
      }
      if ((c.s1 === 8 && c.s2 === 9) || (c.s1 === 9 && c.s2 === 8)) {
        score += 8;
        notes.push(c.label + '八九火土相生——财喜双至，旺财添丁。宜红色/黄色装饰催旺');
      }
      if ((c.s1 === 4 && c.s2 === 9) || (c.s1 === 9 && c.s2 === 4)) {
        score += 6;
        notes.push(c.label + '四九木火通明——文采飞扬，利于创作、考试。宜绿色植物搭配红色装饰');
      }
    }

    // 分数限制
    score = Math.max(5, Math.min(100, Math.round(score)));

    // 等级判定
    var level;
    if (score >= 80) level = '大吉';
    else if (score >= 65) level = '吉';
    else if (score >= 50) level = '中平';
    else if (score >= 35) level = '凶';
    else level = '大凶';

    return {
      score: score,
      level: level,
      notes: notes,
      warnings: warnings,
    };
  }

  /* ========== 九、综合风水分析 ========== */
  function fullAnalysis(sitting, facing, buildYear, currentYear) {
    var periodNum = getPeriod(buildYear);
    var periodChart = getPeriodChart(periodNum);
    var stars = calcMountainAndFacingStars(sitting, facing, periodNum);
    var annualStars = getAnnualStars(currentYear);

    var palaces = [];
    var totalScore = 0;

    for (var i = 0; i < 9; i++) {
      var palaceEval = evaluatePalace(periodChart[i], stars.mountainStars[i], stars.facingStars[i], annualStars[i], i);
      palaces.push({
        idx: i,
        name: GONG_NAMES[i],
        gua: GONG_GUA[i],
        wuxing: GONG_WUXING[i],
        periodStar: periodChart[i],
        mountainStar: stars.mountainStars[i],
        facingStar: stars.facingStars[i],
        annualStar: annualStars[i],
        score: palaceEval.score,
        level: palaceEval.level,
        notes: palaceEval.notes,
        warnings: palaceEval.warnings,
      });
      totalScore += palaceEval.score;
    }

    var overallScore = Math.round(totalScore / 9);
    var overallLevel;
    if (overallScore >= 75) overallLevel = '上吉';
    else if (overallScore >= 60) overallLevel = '中吉';
    else if (overallScore >= 45) overallLevel = '中平';
    else if (overallScore >= 30) overallLevel = '凶';
    else overallLevel = '大凶';

    // 找出最佳和最差方位
    var bestPalace = palaces[0],
      worstPalace = palaces[0];
    for (var i = 1; i < palaces.length; i++) {
      if (palaces[i].score > bestPalace.score) bestPalace = palaces[i];
      if (palaces[i].score < worstPalace.score) worstPalace = palaces[i];
    }

    return {
      sitting: sitting,
      facing: facing,
      buildYear: buildYear,
      currentYear: currentYear,
      periodNum: periodNum,
      overallScore: overallScore,
      overallLevel: overallLevel,
      palaces: palaces,
      bestPalace: bestPalace,
      worstPalace: worstPalace,
      periodChart: periodChart,
      annualStars: annualStars,
      mountainStars: stars.mountainStars,
      facingStars: stars.facingStars,
      mountainShun: stars.mountainShun,
      facingShun: stars.facingShun,
      // 三般卦检测
      sanBanGua: (function () {
        var mtnStars = stars.mountainStars,
          facStars = stars.facingStars;
        var checkSBG = [147, 258, 369];
        for (var si = 0; si < checkSBG.length; si++) {
          var nums = checkSBG[si];
          var a = nums % 10,
            b = Math.floor(nums / 10) % 10,
            c = Math.floor(nums / 100);
          var found = true;
          for (var gi = 0; gi < 9; gi++) {
            var hasA = mtnStars[gi] === a || facStars[gi] === a;
            var hasB = mtnStars[gi] === b || facStars[gi] === b;
            var hasC = mtnStars[gi] === c || facStars[gi] === c;
            if (!hasA && !hasB && !hasC) {
              found = false;
              break;
            }
          }
          if (found) {
            return {
              type: '父母三般卦',
              nums: '' + a + b + c,
              desc: '山向飞星各宫均含' + a + b + c + '三数，此为大吉之局！主世代昌盛、人财两旺、官运亨通。',
            };
          }
        }
        return null;
      })(),
      // 七星打劫检测
      qiXingDJ: (function () {
        var liGong = palaces[8],
          kanGong = palaces[0],
          zhenGong = palaces[2];
        if (
          liGong.mountainStar === periodNum &&
          kanGong.facingStar === periodNum &&
          zhenGong.facingStar === periodNum
        ) {
          return {
            type: '离震坎打劫',
            desc:
              '离宫山星、坎宫向星、震宫向星均为当令旺星' +
              periodNum +
              '，此乃七星打劫之局！主富贵骤至、横发一时，但需防劫后回落。',
          };
        }
        if (
          liGong.facingStar === periodNum &&
          kanGong.mountainStar === periodNum &&
          zhenGong.mountainStar === periodNum
        ) {
          return {
            type: '离震坎打劫(向)',
            desc: '离宫向星、坎宫山星、震宫山星均为当令旺星' + periodNum + '，七星打劫之局已成！主横财暴发。',
          };
        }
        return null;
      })(),
      // 城门诀
      chengMenJue: (function () {
        var sitIdx = MOUNTAINS_24.indexOf(sitting);
        if (sitIdx < 0) return null;
        var leftIdx = (sitIdx - 1 + 24) % 24,
          rightIdx = (sitIdx + 1) % 24;
        var leftMtn = MOUNTAINS_24[leftIdx],
          rightMtn = MOUNTAINS_24[rightIdx];
        var leftGua = MOUNTAIN_GUA[leftMtn],
          rightGua = MOUNTAIN_GUA[rightMtn];
        var sitGua = MOUNTAIN_GUA[sitting];
        if (leftGua === sitGua) {
          return {
            side: '左',
            mtn: leftMtn,
            gua: leftGua,
            desc: '坐山' + sitting + '左侧' + leftMtn + '同为' + leftGua + '卦，可开城门以纳旺气。',
          };
        }
        if (rightGua === sitGua) {
          return {
            side: '右',
            mtn: rightMtn,
            gua: rightGua,
            desc: '坐山' + sitting + '右侧' + rightMtn + '同为' + rightGua + '卦，可开城门引吉气入宅。',
          };
        }
        return null;
      })(),
    };
  }

  /* ========== 十、公开 API ========== */
  global.FengshuiEngine = {
    MOUNTAINS_24: MOUNTAINS_24,
    MOUNTAIN_GUA: MOUNTAIN_GUA,
    MOUNTAIN_YUAN: MOUNTAIN_YUAN,
    MOUNTAIN_YINYANG: MOUNTAIN_YINYANG,
    STARS: STARS,
    GONG_NAMES: GONG_NAMES,
    getPeriod: getPeriod,
    getPeriodChart: getPeriodChart,
    getAnnualStars: getAnnualStars,
    fullAnalysis: fullAnalysis,

    /**
     * 风水排盘主入口
     * @param {object} params
     *   sitting: 坐山（二十四山之一）
     *   facing: 朝向（二十四山之一）
     *   buildYear: 建房年份
     *   currentYear: 当前年份
     */
    divine: function (params) {
      params = params || {};
      var sitting = params.sitting || '子';
      var facing = params.facing || '午';
      var buildYear = params.buildYear || new Date().getFullYear();
      var currentYear = params.currentYear || new Date().getFullYear();

      return fullAnalysis(sitting, facing, buildYear, currentYear);
    },
  };
})(typeof window !== 'undefined' ? window : this);
