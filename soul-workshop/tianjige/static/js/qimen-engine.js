/**
 * 天机阁 · 奇门遁甲引擎 v1 — 纯前端算法，零API调用
 * 时家奇门 · 排地盘天盘 · 八门九星八神 · 局象解读
 */
(function (global) {
  'use strict';

  /* ========== 一、基础常量 ========== */

  /** 二十四节气（近似公历日期） */
  var SOLAR_TERMS = [
    { name: '冬至', month: 12, day: 22 },
    { name: '小寒', month: 1, day: 6 },
    { name: '大寒', month: 1, day: 20 },
    { name: '立春', month: 2, day: 4 },
    { name: '雨水', month: 2, day: 19 },
    { name: '惊蛰', month: 3, day: 6 },
    { name: '春分', month: 3, day: 21 },
    { name: '清明', month: 4, day: 5 },
    { name: '谷雨', month: 4, day: 20 },
    { name: '立夏', month: 5, day: 6 },
    { name: '小满', month: 5, day: 21 },
    { name: '芒种', month: 6, day: 6 },
    { name: '夏至', month: 6, day: 21 },
    { name: '小暑', month: 7, day: 7 },
    { name: '大暑', month: 7, day: 23 },
    { name: '立秋', month: 8, day: 7 },
    { name: '处暑', month: 8, day: 23 },
    { name: '白露', month: 9, day: 8 },
    { name: '秋分', month: 9, day: 23 },
    { name: '寒露', month: 10, day: 8 },
    { name: '霜降', month: 10, day: 23 },
    { name: '立冬', month: 11, day: 7 },
    { name: '小雪', month: 11, day: 22 },
    { name: '大雪', month: 12, day: 7 },
  ];

  /** 阳遁节气局数：冬至→小寒→大寒→立春→雨水→惊蛰→春分→清明→谷雨→立夏→小满→芒种 */
  var YANG_DUN_JU = {
    冬至: 1,
    小寒: 2,
    大寒: 3,
    立春: 8,
    雨水: 9,
    惊蛰: 1,
    春分: 3,
    清明: 4,
    谷雨: 5,
    立夏: 4,
    小满: 5,
    芒种: 6,
  };

  /** 阴遁节气局数：夏至→小暑→大暑→立秋→处暑→白露→秋分→寒露→霜降→立冬→小雪→大雪 */
  var YIN_DUN_JU = {
    夏至: 9,
    小暑: 8,
    大暑: 7,
    立秋: 2,
    处暑: 1,
    白露: 9,
    秋分: 7,
    寒露: 6,
    霜降: 5,
    立冬: 6,
    小雪: 5,
    大雪: 4,
  };

  /** 天干 */
  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  /** 地支 */
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  /** 六十甲子 */
  var SIXTY_JIAZI = [];
  var JIAZI_INDEX = {};
  for (var i = 0; i < 60; i++) {
    var jz = GAN[i % 10] + ZHI[i % 12];
    SIXTY_JIAZI.push(jz);
    JIAZI_INDEX[jz] = i;
  }

  /** 五鼠遁（日上起时）：日干 → 子时时干 */
  var WUSHUDUN = {
    甲: '甲',
    己: '甲',
    乙: '丙',
    庚: '丙',
    丙: '戊',
    辛: '戊',
    丁: '庚',
    壬: '庚',
    戊: '壬',
    癸: '壬',
  };

  /** 时辰名称 → 地支 */
  var SHICHEN_MAP = {
    子时: '子',
    丑时: '丑',
    寅时: '寅',
    卯时: '卯',
    辰时: '辰',
    巳时: '巳',
    午时: '午',
    未时: '未',
    申时: '申',
    酉时: '酉',
    戌时: '戌',
    亥时: '亥',
  };

  /** 九宫顺序：4 9 2 / 3 5 7 / 8 1 6 */
  var GONG_ORDER = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  /** 九宫名称 */
  var GONG_NAMES = {
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

  /** 九宫五行 */
  var GONG_WUXING = {
    1: '水',
    2: '土',
    3: '木',
    4: '木',
    5: '土',
    6: '金',
    7: '金',
    8: '土',
    9: '火',
  };

  /** 九星 */
  var STARS = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];

  /** 九星原始宫位（对应天盘九宫） */
  var STAR_HOME = {
    天蓬: 1,
    天芮: 2,
    天冲: 3,
    天辅: 4,
    天禽: 5,
    天心: 6,
    天柱: 7,
    天任: 8,
    天英: 9,
  };

  /** 八门 */
  var DOORS = ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门'];

  /** 八门原始宫位 */
  var DOOR_HOME = {
    休门: 1,
    生门: 8,
    伤门: 3,
    杜门: 4,
    景门: 9,
    死门: 2,
    惊门: 7,
    开门: 6,
  };

  /** 八神：阳遁顺排，阴遁逆排 */
  var GODS = ['值符', '螣蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];

  /** 天干 → 六甲旬首（甲子戊、甲戌己、甲申庚、甲午辛、甲辰壬、甲寅癸） */
  var LIUJIA_XUNSHOU = {
    戊: '甲子',
    己: '甲戌',
    庚: '甲申',
    辛: '甲午',
    壬: '甲辰',
    癸: '甲寅',
  };

  /** 六甲旬首 → 地支 */
  var XUNSHOU_ZHI = {
    甲子: '子',
    甲戌: '戌',
    甲申: '申',
    甲午: '午',
    甲辰: '辰',
    甲寅: '寅',
  };

  /* ========== 二、日期计算工具 ========== */

  /**
   * 根据公历日期确定节气
   * @param {number} month - 1-12
   * @param {number} day - 1-31
   * @returns {string} 节气名称
   */
  function getCurrentJieqi(month, day) {
    // 找到当前日期所在的节气区间
    for (var i = SOLAR_TERMS.length - 1; i >= 0; i--) {
      var t = SOLAR_TERMS[i];
      if (month > t.month || (month === t.month && day >= t.day)) {
        return t.name;
      }
    }
    // 1月1日～1月5日，还在冬至区间
    return '冬至';
  }

  /**
   * 判断阳遁/阴遁，返回局数
   * @param {string} jieqi - 节气名称
   * @returns {object} { period, ju }
   */
  function getYinYangAndJu(jieqi) {
    if (YANG_DUN_JU.hasOwnProperty(jieqi)) {
      return { period: '阳遁', ju: YANG_DUN_JU[jieqi] };
    } else if (YIN_DUN_JU.hasOwnProperty(jieqi)) {
      return { period: '阴遁', ju: YIN_DUN_JU[jieqi] };
    }
    // 默认
    return { period: '阳遁', ju: 1 };
  }

  /**
   * 计算日干支（以1900年1月1日甲戌日为基准）
   */
  function calcDayGZ(year, month, day) {
    // 以1900年1月1日甲戌日（索引11）为基准
    var baseDate = new Date(1900, 0, 1);
    var targetDate = new Date(year, month - 1, day);
    var diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    var baseIdx = JIAZI_INDEX['甲戌'] || 11;
    var idx = (((baseIdx + diffDays) % 60) + 60) % 60;
    return SIXTY_JIAZI[idx];
  }

  /**
   * 根据日干和时辰计算时干支
   */
  function calcTimeGZ(dayGan, shichen) {
    var ziGan = WUSHUDUN[dayGan] || '甲';
    var ziIdx = GAN.indexOf(ziGan);
    var zhiIdx = ZHI.indexOf(SHICHEN_MAP[shichen] || '子');
    var ganIdx = (ziIdx + zhiIdx) % 10;
    return GAN[ganIdx] + (SHICHEN_MAP[shichen] || '子');
  }

  /* ========== 三、排盘核心 ========== */

  /**
   * 排地盘：天干按顺序排入九宫
   * 阳遁顺排：戊在ju宫，己庚辛壬癸丁丙乙依次顺行
   * 阴遁逆排：戊在ju宫，己庚辛壬癸丁丙乙依次逆行
   */
  function arrangeDiPan(ju, period) {
    var diPan = {}; // 宫位 → 天干
    var ganOrder = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];

    // 阳遁九宫顺行序：1→2→3→4→5→6→7→8→9→1...
    // 阴遁九宫逆行序：1→9→8→7→6→5→4→3→2→1...
    var gongSeq = period === '阴遁' ? [1, 9, 8, 7, 6, 5, 4, 3, 2] : [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // 找到ju宫在序列中的起始位置
    var startIdx = 0;
    for (var i = 0; i < gongSeq.length; i++) {
      if (gongSeq[i] === ju) {
        startIdx = i;
        break;
      }
    }

    for (var j = 0; j < ganOrder.length; j++) {
      var gong = gongSeq[(startIdx + j) % gongSeq.length];
      diPan[gong] = ganOrder[j];
    }

    return diPan;
  }

  /**
   * 排天盘：根据时辰干支确定值符星，天盘星随值符转动
   * 值符星 = 时辰干所在宫位的原始星
   * 天盘干 = 地盘干随值符星转动
   */
  function arrangeTianPan(diPan, timeGZ, period) {
    var tianPan = {}; // 宫位 → 天干
    var starPan = {}; // 宫位 → 九星

    // 找到时辰干在地盘中的宫位
    var timeGan = timeGZ[0];
    var zhiFuGong = null;
    for (var gong in diPan) {
      if (diPan.hasOwnProperty(gong) && diPan[gong] === timeGan) {
        zhiFuGong = parseInt(gong);
        break;
      }
    }
    if (zhiFuGong === null) {
      zhiFuGong = 1;
    }

    // 该宫位的原始星即为值符星
    var zhiFuStar = STARS[zhiFuGong - 1]; // 天蓬星在1宫...

    // 将值符星转到时辰地支所在宫位
    var timeZhi = timeGZ[1];
    var timeZhiIdx = ZHI.indexOf(timeZhi); // 0-11
    // 地支对应九宫：子1, 丑8, 寅8, 卯3, 辰4, 巳4, 午9, 未2, 申2, 酉7, 戌6, 亥6
    var zhiToGong = { 0: 1, 1: 8, 2: 8, 3: 3, 4: 4, 5: 4, 6: 9, 7: 2, 8: 2, 9: 7, 10: 6, 11: 6 };
    var targetGong = zhiToGong[timeZhiIdx] || 1;

    // 计算偏移量
    var offset = targetGong - zhiFuGong;
    if (offset < 0) offset += 9;

    // 根据偏移量旋转天盘和星盘
    var gongSeq = period === '阴遁' ? [1, 9, 8, 7, 6, 5, 4, 3, 2] : [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (var k = 0; k < gongSeq.length; k++) {
      var srcGong = gongSeq[k];
      var dstIdx = (k + offset) % gongSeq.length;
      var dstGong = gongSeq[dstIdx];

      tianPan[dstGong] = diPan[srcGong] || '';
      starPan[dstGong] = STARS[srcGong - 1] || '';
    }

    return { tianPan: tianPan, starPan: starPan, zhiFuStar: zhiFuStar };
  }

  /**
   * 排八门：根据时辰确定值使门，值使门随值符转动
   * 值使门 = 时辰地支对应的原始门
   * 门随值符转动至目标宫位
   */
  function arrangeDoors(zhiFuGong, timeGZ, period) {
    var doorPan = {}; // 宫位 → 门名

    // 时辰地支对应的原始门
    var timeZhi = timeGZ[1];
    var zhiIdx = ZHI.indexOf(timeZhi);
    // 地支 → 原始门：子寅辰午申戌为阳，丑卯巳未酉亥为阴
    // 阳遁值使门依次为：休死伤杜中开惊生景
    // 简化：用时辰地支确定值使门
    var doorOrder = ['休门', '死门', '伤门', '杜门', '', '开门', '惊门', '生门', '景门'];

    // 值使门 = 本局值符星对应的门（简化：用时支定位）
    // 时支对应的原始宫位
    var zhiToGong = { 0: 1, 1: 8, 2: 8, 3: 3, 4: 4, 5: 4, 6: 9, 7: 2, 8: 2, 9: 7, 10: 6, 11: 6 };
    var zhiShiGong = zhiToGong[zhiIdx] || 1;

    // 值使门 = 该宫位对应的原始门
    var doorHomeMap = { 1: '休门', 8: '生门', 3: '伤门', 4: '杜门', 9: '景门', 2: '死门', 7: '惊门', 6: '开门' };
    var zhiShiDoor = doorHomeMap[zhiShiGong] || '休门';

    // 值使门转到 targetGong
    var targetGong = zhiShiGong; // 值使门落宫
    var doorHomeGong = DOOR_HOME[zhiShiDoor] || 1;

    // 计算偏移
    var doorOffset = targetGong - doorHomeGong;
    if (doorOffset < 0) doorOffset += 9;

    // 旋转八门
    var gongSeq = period === '阴遁' ? [1, 9, 8, 7, 6, 5, 4, 3, 2] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var doorSeq =
      period === '阴遁'
        ? ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门']
        : ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门'];

    for (var d = 0; d < doorSeq.length; d++) {
      var homeGong = DOOR_HOME[doorSeq[d]] || 1;
      var homeIdx = gongSeq.indexOf(homeGong);
      if (homeIdx < 0) homeIdx = 0;
      var newIdx = (homeIdx + doorOffset) % gongSeq.length;
      var newGong = gongSeq[newIdx];
      doorPan[newGong] = doorSeq[d];
    }

    return doorPan;
  }

  /**
   * 排八神：值符随大值符星落宫，其他七神顺排
   * 阳遁顺排（1→2→3...），阴遁逆排（1→9→8...）
   */
  function arrangeGods(zhiFuGong, period) {
    var godPan = {}; // 宫位 → 神名
    var gongSeq = period === '阴遁' ? [1, 9, 8, 7, 6, 5, 4, 3, 2] : [1, 2, 3, 4, 5, 6, 7, 8, 9];

    var startIdx = gongSeq.indexOf(zhiFuGong);
    if (startIdx < 0) startIdx = 0;

    for (var i = 0; i < GODS.length; i++) {
      var gong = gongSeq[(startIdx + i) % gongSeq.length];
      godPan[gong] = GODS[i];
    }

    return godPan;
  }

  /**
   * 生成局象解读文本
   */
  function generateInterpretation(cells, period, ju, diPan, starPan, doorPan, godPan) {
    var lines = [];
    lines.push('【局象概述】' + period + ju + '局。');

    // 旬首分析
    var juGan = diPan[ju] || '';
    var xunShou = LIUJIA_XUNSHOU[juGan] || '';
    if (xunShou) {
      lines.push('【旬首】' + juGan + '为' + xunShou + '，' + xunShou + '遁于' + juGan + '下。');
    }

    // 分析各宫
    lines.push('【宫位分析】');
    for (var g = 0; g < GONG_ORDER.length; g++) {
      var pos = GONG_ORDER[g];
      var cell = cells[pos] || {};
      var gongName = GONG_NAMES[pos] || '宫' + pos;
      var wuxing = GONG_WUXING[pos] || '';

      var line = gongName + '（' + wuxing + '）：';
      if (cell.di_pan) line += '地盘' + cell.di_pan + ' ';
      if (cell.tian_pan) line += '天盘' + cell.tian_pan + ' ';
      if (cell.door) line += cell.door + ' ';
      if (cell.star) line += cell.star + ' ';
      if (cell.god) line += cell.god + ' ';
      lines.push(line);
    }

    // 吉凶判断
    var auspiciousDoors = ['休门', '生门', '开门'];
    var auspiciousStars = ['天心', '天任', '天辅', '天禽'];
    var auspiciousGods = ['值符', '太阴', '六合', '九天', '九地'];

    var auspiciousCount = 0;
    var inauspiciousCount = 0;
    for (var g2 = 0; g2 < GONG_ORDER.length; g2++) {
      var pos2 = GONG_ORDER[g2];
      if (pos2 === 5) continue; // 中五宫寄坤二宫
      var cell2 = cells[pos2] || {};
      var isGood = false;
      if (auspiciousDoors.indexOf(cell2.door) >= 0) isGood = true;
      if (auspiciousStars.indexOf(cell2.star) >= 0) isGood = true;
      if (auspiciousGods.indexOf(cell2.god) >= 0) isGood = true;
      if (isGood) auspiciousCount++;
      else inauspiciousCount++;
    }

    lines.push('');
    if (auspiciousCount > inauspiciousCount) {
      lines.push(
        '【综合判断】此局吉多凶少，' +
          auspiciousCount +
          '宫得吉，' +
          inauspiciousCount +
          '宫不吉。总体运势向好，宜把握时机，积极进取。'
      );
    } else if (auspiciousCount < inauspiciousCount) {
      lines.push(
        '【综合判断】此局凶多吉少，' +
          inauspiciousCount +
          '宫不吉，' +
          auspiciousCount +
          '宫得吉。宜守不宜攻，谨慎行事，避免重大决策。'
      );
    } else {
      lines.push('【综合判断】此局吉凶参半，宜权衡利弊，取吉避凶。可参考各宫门星神之吉凶，择吉方而动。');
    }

    // 出行建议
    var bestPos = null;
    for (var g3 = 0; g3 < GONG_ORDER.length; g3++) {
      var pos3 = GONG_ORDER[g3];
      if (pos3 === 5) continue;
      var cell3 = cells[pos3] || {};
      if (auspiciousDoors.indexOf(cell3.door) >= 0 && auspiciousGods.indexOf(cell3.god) >= 0) {
        bestPos = pos3;
        break;
      }
    }
    if (bestPos) {
      lines.push('【出行建议】' + GONG_NAMES[bestPos] + '方吉，宜向此方出行或布局。');
    }

    return lines.join('\n');
  }

  /* ========== 四、公开API ========== */

  /**
   * 奇门遁甲起局
   * @param {string} dateStr - 日期 YYYY-MM-DD（默认今天）
   * @param {string} shichen - 时辰名（如'子时'，默认当前时辰）
   * @param {string} juStr - 局数 'auto' | 'yang-1' ~ 'yang-9' | 'yin-1' ~ 'yin-9'
   * @returns {object} 完整奇门盘
   */
  function divine(dateStr, shichen, juStr) {
    // 解析日期
    var year, month, day;
    if (dateStr) {
      var parts = dateStr.split('-');
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    } else {
      var now = new Date();
      year = now.getFullYear();
      month = now.getMonth() + 1;
      day = now.getDate();
    }

    // 解析时辰
    if (!shichen) {
      var nowHour = new Date().getHours();
      var shichenNames = [
        '子时',
        '丑时',
        '丑时',
        '寅时',
        '寅时',
        '卯时',
        '卯时',
        '辰时',
        '辰时',
        '巳时',
        '巳时',
        '午时',
        '午时',
        '未时',
        '未时',
        '申时',
        '申时',
        '酉时',
        '酉时',
        '戌时',
        '戌时',
        '亥时',
        '亥时',
        '子时',
      ];
      shichen = shichenNames[nowHour] || '子时';
    }

    // 确定节气、阴阳遁、局数
    var jieqi = getCurrentJieqi(month, day);
    var yyAndJu = getYinYangAndJu(jieqi);
    var period = yyAndJu.period;
    var ju = yyAndJu.ju;

    // 手动指定局数
    if (juStr && juStr !== 'auto') {
      var juParts = juStr.split('-');
      if (juParts[0] === 'yang') {
        period = '阳遁';
        ju = parseInt(juParts[1]) || 1;
      } else if (juParts[0] === 'yin') {
        period = '阴遁';
        ju = parseInt(juParts[1]) || 1;
      }
    }

    // 计算日干支
    var dayGZ = calcDayGZ(year, month, day);
    var dayGan = dayGZ[0];

    // 计算时干支
    var timeGZ = calcTimeGZ(dayGan, shichen);
    var timeGan = timeGZ[0]; // 时干

    // 排地盘
    var diPan = arrangeDiPan(ju, period);

    // 排天盘和星盘
    var tianAndStar = arrangeTianPan(diPan, timeGZ, period);
    var tianPan = tianAndStar.tianPan;
    var starPan = tianAndStar.starPan;

    // 时干在地盘中的宫位（值符宫）
    var zhiFuGong = null;
    for (var gong in diPan) {
      if (diPan.hasOwnProperty(gong) && diPan[gong] === timeGan) {
        zhiFuGong = parseInt(gong);
        break;
      }
    }
    if (zhiFuGong === null) zhiFuGong = 1;

    // 排八门
    var doorPan = arrangeDoors(zhiFuGong, timeGZ, period);

    // 排八神
    var godPan = arrangeGods(zhiFuGong, period);

    // 组装 cells
    var cells = {};
    for (var g = 0; g < GONG_ORDER.length; g++) {
      var pos = GONG_ORDER[g];
      cells[pos] = {
        di_pan: diPan[pos] || '',
        tian_pan: tianPan[pos] || '',
        door: pos === 5 ? '' : doorPan[pos] || '',
        star: starPan[pos] || '',
        god: pos === 5 ? '' : godPan[pos] || '',
      };
    }

    // 生成解读
    var interpretation = generateInterpretation(cells, period, ju, diPan, starPan, doorPan, godPan);

    return {
      period: period,
      ju: period + ju + '局',
      ju_num: ju,
      jieqi: jieqi,
      day_gz: dayGZ,
      time_gz: timeGZ,
      shichen: shichen,
      cells: cells,
      interpretation: interpretation,
    };
  }

  // 暴露到全局
  global.QimenEngine = {
    divine: divine,
    SOLAR_TERMS: SOLAR_TERMS,
    YANG_DUN_JU: YANG_DUN_JU,
    YIN_DUN_JU: YIN_DUN_JU,
  };
})(typeof window !== 'undefined' ? window : this);
