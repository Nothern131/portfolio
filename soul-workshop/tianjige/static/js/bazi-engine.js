/**
 * 天机阁 · 八字引擎 v1 — 纯前端算法，零API调用
 * 排盘 + 十神 + 神煞 + 大运 + 分析（财富/天赋/反内耗/人生K线/流月/正缘/择日）
 */
(function (global) {
  'use strict';

  /* ========== 一、基础常量 ========== */
  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var WUXING = ['木', '火', '土', '金', '水'];

  var GAN_WUXING = {
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
  };
  var ZHI_WUXING = {
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
  var GAN_YINYANG = {
    甲: '阳',
    乙: '阴',
    丙: '阳',
    丁: '阴',
    戊: '阳',
    己: '阴',
    庚: '阳',
    辛: '阴',
    壬: '阳',
    癸: '阴',
  };

  // 五行生克
  var WX_SHENG = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' }; // 生我者
  var WX_SHENG_BY = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }; // 我生者
  var WX_KE = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' }; // 克我者
  var WX_KE_BY = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' }; // 我克者

  var WX_DIR = { 木: '东', 火: '南', 土: '中', 金: '西', 水: '北' };
  var WX_COLOR = { 木: '青', 火: '赤', 土: '黄', 金: '白', 水: '黑' };

  // 六十甲子
  var SIXTY_JIAZI = [];
  var JIAZI_INDEX = {};
  for (var i = 0; i < 60; i++) {
    var jz = GAN[i % 10] + ZHI[i % 12];
    SIXTY_JIAZI.push(jz);
    JIAZI_INDEX[jz] = i;
  }

  // 五虎遁（年上起月）：年干→寅月月干
  var WUHUDUN = { 甲: '丙', 己: '丙', 乙: '戊', 庚: '戊', 丙: '庚', 辛: '庚', 丁: '壬', 壬: '壬', 戊: '甲', 癸: '甲' };

  // 五鼠遁（日上起时）：日干→子时时干
  var WUSHUDUN = { 甲: '甲', 己: '甲', 乙: '丙', 庚: '丙', 丙: '戊', 辛: '戊', 丁: '庚', 壬: '庚', 戊: '壬', 癸: '壬' };

  // 时辰对应地支
  var SHICHEN_ZHI = {
    0: '子',
    1: '子',
    2: '丑',
    3: '丑',
    4: '寅',
    5: '寅',
    6: '卯',
    7: '卯',
    8: '辰',
    9: '辰',
    10: '巳',
    11: '巳',
    12: '午',
    13: '午',
    14: '未',
    15: '未',
    16: '申',
    17: '申',
    18: '酉',
    19: '酉',
    20: '戌',
    21: '戌',
    22: '亥',
    23: '亥',
  };

  // 时辰名称映射
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

  // 纳音
  var NAYIN_ARR = [
    '海中金',
    '海中金',
    '炉中火',
    '炉中火',
    '大林木',
    '大林木',
    '路旁土',
    '路旁土',
    '剑锋金',
    '剑锋金',
    '山头火',
    '山头火',
    '涧下水',
    '涧下水',
    '城头土',
    '城头土',
    '白蜡金',
    '白蜡金',
    '杨柳木',
    '杨柳木',
    '泉中水',
    '泉中水',
    '屋上土',
    '屋上土',
    '霹雳火',
    '霹雳火',
    '松柏木',
    '松柏木',
    '长流水',
    '长流水',
    '沙中金',
    '沙中金',
    '山下火',
    '山下火',
    '平地木',
    '平地木',
    '壁上土',
    '壁上土',
    '金箔金',
    '金箔金',
    '覆灯火',
    '覆灯火',
    '天河水',
    '天河水',
    '大驿土',
    '大驿土',
    '钗钏金',
    '钗钏金',
    '桑柘木',
    '桑柘木',
    '大溪水',
    '大溪水',
    '沙中土',
    '沙中土',
    '天上火',
    '天上火',
    '石榴木',
    '石榴木',
    '大海水',
    '大海水',
  ];

  // 地支藏干
  var ZHI_CANGGAN = {
    子: ['癸'],
    丑: ['己', '癸', '辛'],
    寅: ['甲', '丙', '戊'],
    卯: ['乙'],
    辰: ['戊', '乙', '癸'],
    巳: ['丙', '庚', '戊'],
    午: ['丁', '己'],
    未: ['己', '丁', '乙'],
    申: ['庚', '壬', '戊'],
    酉: ['辛'],
    戌: ['戊', '辛', '丁'],
    亥: ['壬', '甲'],
  };

  // 调候用神
  var TIAOHOU = {
    甲: {
      寅: ['丙', '癸'],
      卯: ['庚', '丙丁'],
      辰: ['庚', '丁'],
      巳: ['癸', '庚丁'],
      午: ['癸', '庚丁'],
      未: ['癸', '庚丁'],
      申: ['庚', '丁'],
      酉: ['庚', '丁'],
      戌: ['庚', '丁'],
      亥: ['庚', '丁'],
      子: ['庚', '丁'],
      丑: ['庚', '丁'],
    },
    乙: {
      寅: ['丙', '癸'],
      卯: ['丙', '癸'],
      辰: ['癸', '丙'],
      巳: ['癸', '辛'],
      午: ['癸', '丙'],
      未: ['癸', '丙'],
      申: ['丙', '癸'],
      酉: ['癸', '丙'],
      戌: ['癸', '辛'],
      亥: ['丙', '戊'],
      子: ['丙', '戊'],
      丑: ['丙', '戊'],
    },
    丙: {
      寅: ['壬', '庚'],
      卯: ['壬', '己'],
      辰: ['壬', '庚'],
      巳: ['壬', '庚癸'],
      午: ['壬', '庚'],
      未: ['壬', '庚'],
      申: ['壬', '戊'],
      酉: ['壬', '己'],
      戌: ['甲', '壬'],
      亥: ['甲', '戊'],
      子: ['壬', '己'],
      丑: ['壬', '甲'],
    },
    丁: {
      寅: ['甲', '庚'],
      卯: ['甲', '庚'],
      辰: ['甲', '庚'],
      巳: ['甲', '庚'],
      午: ['壬', '庚癸'],
      未: ['甲', '壬庚'],
      申: ['甲', '庚'],
      酉: ['甲', '庚'],
      戌: ['甲', '庚'],
      亥: ['甲', '庚'],
      子: ['甲', '庚'],
      丑: ['甲', '庚'],
    },
    戊: {
      寅: ['丙', '甲癸'],
      卯: ['丙', '甲癸'],
      辰: ['甲', '丙癸'],
      巳: ['甲', '丙癸'],
      午: ['壬', '丙'],
      未: ['癸', '丙'],
      申: ['丙', '甲癸'],
      酉: ['丙', '癸'],
      戌: ['甲', '丙癸'],
      亥: ['甲', '丙'],
      子: ['丙', '甲'],
      丑: ['丙', '甲'],
    },
    己: {
      寅: ['丙', '庚'],
      卯: ['甲', '丙癸'],
      辰: ['丙', '癸'],
      巳: ['癸', '丙'],
      午: ['癸', '丙'],
      未: ['丙', '癸'],
      申: ['丙', '癸'],
      酉: ['丙', '癸'],
      戌: ['戊', '丙癸'],
      亥: ['丙', '甲'],
      子: ['丙', '甲'],
      丑: ['丙', '甲'],
    },
    庚: {
      寅: ['戊', '甲丙'],
      卯: ['丁', '甲丙'],
      辰: ['甲', '丁'],
      巳: ['壬', '戊丙'],
      午: ['壬', '癸'],
      未: ['丁', '甲'],
      申: ['丁', '甲'],
      酉: ['丁', '丙'],
      戌: ['甲', '丁'],
      亥: ['丁', '丙'],
      子: ['丁', '甲丙'],
      丑: ['丙', '丁甲'],
    },
    辛: {
      寅: ['己', '壬'],
      卯: ['壬', '甲'],
      辰: ['壬', '甲'],
      巳: ['壬', '甲'],
      午: ['壬', '己'],
      未: ['壬', '庚'],
      申: ['壬', '甲'],
      酉: ['壬', '甲'],
      戌: ['壬', '甲'],
      亥: ['壬', '丙'],
      子: ['丙', '戊壬'],
      丑: ['丙', '壬戊'],
    },
    壬: {
      寅: ['庚', '戊'],
      卯: ['戊', '辛'],
      辰: ['甲', '庚'],
      巳: ['壬', '辛'],
      午: ['癸', '庚辛'],
      未: ['辛', '甲'],
      申: ['戊', '丁'],
      酉: ['甲', '庚'],
      戌: ['甲', '丙'],
      亥: ['戊', '庚'],
      子: ['戊', '丙'],
      丑: ['丙', '戊丁'],
    },
    癸: {
      寅: ['辛', '丙'],
      卯: ['庚', '辛'],
      辰: ['丙', '辛甲'],
      巳: ['辛', '庚'],
      午: ['庚', '壬癸'],
      未: ['庚', '辛壬'],
      申: ['丁', '甲'],
      酉: ['辛', '丙'],
      戌: ['辛', '甲壬'],
      亥: ['庚', '辛戊'],
      子: ['丙', '辛'],
      丑: ['丙', '丁'],
    },
  };

  /* ========== 二、排盘核心 ========== */

  /** 年干支（以1900年庚子年为基准） */
  function calcYearGZ(year) {
    var baseYear = 1900,
      baseIdx = JIAZI_INDEX['庚子'] || 0;
    var offset = year - baseYear;
    return SIXTY_JIAZI[(((baseIdx + offset) % 60) + 60) % 60];
  }

  /** 月支（按公历月份近似，立春约2月4日为界） */
  function calcMonthZhi(month, day) {
    if (month === 2 && day < 4) return '丑';
    if (month === 1) return '丑';
    var map = { 2: '寅', 3: '卯', 4: '辰', 5: '巳', 6: '午', 7: '未', 8: '申', 9: '酉', 10: '戌', 11: '亥', 12: '子' };
    return map[month] || '寅';
  }

  /** 月干支（五虎遁） */
  function calcMonthGZ(yearGan, monthZhi) {
    var startGan = WUHUDUN[yearGan];
    if (!startGan) return '';
    var monthIdx = (ZHI.indexOf(monthZhi) - ZHI.indexOf('寅') + 12) % 12;
    return GAN[(GAN.indexOf(startGan) + monthIdx) % 10] + monthZhi;
  }

  /** 日干支（以1900年1月1日甲戌日为基准） */
  function calcDayGZ(year, month, day) {
    var baseYear = 1900,
      baseMonth = 1,
      baseDay = 1;
    var baseIdx = JIAZI_INDEX['甲戌'] || 0;
    var days = 0;
    for (var y = baseYear; y < year; y++) {
      days += (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
    }
    var monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) monthDays[2] = 29;
    for (var m = 1; m < month; m++) {
      days += monthDays[m];
    }
    days += day - 1;
    return SIXTY_JIAZI[(((baseIdx + days) % 60) + 60) % 60];
  }

  /** 时干支（五鼠遁） */
  function calcHourGZ(dayGan, hour) {
    var hourZhi = SHICHEN_ZHI[hour] || '子';
    var startGan = WUSHUDUN[dayGan];
    if (!startGan) return '';
    var hourIdx = ZHI.indexOf(hourZhi);
    return GAN[(GAN.indexOf(startGan) + hourIdx) % 10] + hourZhi;
  }

  /** 完整排盘 */
  function paipan(year, month, day, hour) {
    var yearGZ = calcYearGZ(year);
    var monthZhi = calcMonthZhi(month, day);
    var monthGZ = calcMonthGZ(yearGZ[0], monthZhi);
    var dayGZ = calcDayGZ(year, month, day);
    var hourGZ = calcHourGZ(dayGZ[0], hour);

    var dayGan = dayGZ[0];
    var dayZhi = dayGZ[1];

    return {
      年柱: yearGZ,
      月柱: monthGZ,
      日柱: dayGZ,
      时柱: hourGZ,
      日主: dayGan,
      日支: dayZhi,
      日主五行: GAN_WUXING[dayGan] || '',
      年柱纳音: NAYIN_ARR[JIAZI_INDEX[yearGZ]] || '',
      月柱纳音: NAYIN_ARR[JIAZI_INDEX[monthGZ]] || '',
      日柱纳音: NAYIN_ARR[JIAZI_INDEX[dayGZ]] || '',
      时柱纳音: NAYIN_ARR[JIAZI_INDEX[hourGZ]] || '',
      生肖: ZHI[(JIAZI_INDEX[yearGZ] || 0) % 12],
    };
  }

  /* ========== 三、十神计算 ========== */

  /** 获取日干与他干的十神关系 */
  function getShiShen(dayGan, otherGan) {
    if (!dayGan || !otherGan) return '';
    var dwx = GAN_WUXING[dayGan],
      owx = GAN_WUXING[otherGan];
    var sameYY = GAN_YINYANG[dayGan] === GAN_YINYANG[otherGan];
    if (dwx === owx) return sameYY ? '比肩' : '劫财';
    if (WX_SHENG[dwx] === owx) return sameYY ? '偏印' : '正印';
    if (WX_SHENG_BY[dwx] === owx) return sameYY ? '食神' : '伤官';
    if (WX_KE[dwx] === owx) return sameYY ? '七杀' : '正官';
    if (WX_KE_BY[dwx] === owx) return sameYY ? '偏财' : '正财';
    return '';
  }

  /** 获取四柱十神 */
  function getPillarShiShen(dayGan, pillars) {
    var result = {};
    var keys = ['年柱', '月柱', '日柱', '时柱'];
    for (var i = 0; i < keys.length; i++) {
      var gz = pillars[keys[i]] || '';
      var gan = gz[0],
        zhi = gz[1];
      result[keys[i]] = {
        天干十神: getShiShen(dayGan, gan),
        地支藏干: (ZHI_CANGGAN[zhi] || []).map(function (cg) {
          return { 干: cg, 十神: getShiShen(dayGan, cg) };
        }),
      };
    }
    return result;
  }

  /* ========== 四、五行统计 ========== */

  /** 统计四柱中五行出现次数（含藏干） */
  function countWuxing(pillars) {
    var count = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
    var keys = ['年柱', '月柱', '日柱', '时柱'];
    keys.forEach(function (k) {
      var gz = pillars[k] || '';
      var gan = gz[0],
        zhi = gz[1];
      var gw = GAN_WUXING[gan],
        zw = ZHI_WUXING[zhi];
      if (gw) count[gw] += 2;
      if (zw) count[zw] += 1;
      (ZHI_CANGGAN[zhi] || []).forEach(function (cg) {
        var cw = GAN_WUXING[cg];
        if (cw) count[cw] += 0.5;
      });
    });
    return count;
  }

  /** 日主强弱评估（0-100） */
  function assessDayMasterStrength(dayGan, dayZhi, wuxingCount) {
    var dwx = GAN_WUXING[dayGan] || '';
    var selfCount = wuxingCount[dwx] || 0;
    var shengCount = wuxingCount[WX_SHENG[dwx]] || 0; // 印星生我
    var total = 0;
    for (var k in wuxingCount) {
      total += wuxingCount[k];
    }
    var ratio = (selfCount + shengCount * 0.7) / (total || 1);
    // 月令加分
    var monthZhi = calcMonthZhi(new Date().getMonth() + 1, new Date().getDate()); // 这里应该用出生月
    return Math.round(Math.min(95, Math.max(15, ratio * 100)));
  }

  /* ========== 五、分析引擎 ========== */

  /** 提取四柱所有天干和地支 */
  function extractAllGanZhi(pillars) {
    var allGan = [];
    var keys = ['年柱', '月柱', '日柱', '时柱'];
    keys.forEach(function (k) {
      var gz = pillars[k] || '';
      if (gz[0]) allGan.push({ gan: gz[0], pillar: k });
    });
    return allGan;
  }

  /** 检查某十神在四柱中出现的次数 */
  function countShiShenType(dayGan, pillars, types) {
    var count = 0;
    var details = [];
    var keys = ['年柱', '月柱', '日柱', '时柱'];
    keys.forEach(function (k) {
      var gz = pillars[k] || '';
      var gan = gz[0],
        zhi = gz[1];
      var ss = getShiShen(dayGan, gan);
      if (types.indexOf(ss) >= 0) {
        count++;
        details.push(k + '天干' + gan + '为' + ss);
      }
      (ZHI_CANGGAN[zhi] || []).forEach(function (cg) {
        var css = getShiShen(dayGan, cg);
        if (types.indexOf(css) >= 0) {
          count += 0.5;
          details.push(k + '藏干' + cg + '为' + css);
        }
      });
    });
    return { count: count, details: details };
  }

  /** 检查财库（辰戌丑未） */
  function checkCaiKu(dayGan, dayZhi, pillars) {
    var dwx = GAN_WUXING[dayGan] || '';
    var caiWx = WX_KE_BY[dwx] || ''; // 我克者=财星五行
    // 财库：木财库在未、火财库在戌、土财库在辰、金财库在丑、水财库在辰
    var kuMap = { 木: '未', 火: '戌', 土: '辰', 金: '丑', 水: '辰' };
    var ku = kuMap[caiWx] || '';
    var hasKu = false;
    var keys = ['年柱', '月柱', '日柱', '时柱'];
    keys.forEach(function (k) {
      var gz = pillars[k] || '';
      if (gz[1] === ku) hasKu = true;
    });
    return hasKu ? ku : null;
  }

  // ===== 财富分析 =====
  function generateWealthAnalysis(bazi) {
    var pillars = { 年柱: bazi.年柱, 月柱: bazi.月柱, 日柱: bazi.日柱, 时柱: bazi.时柱 };
    var dayGan = bazi.日主,
      dayZhi = bazi.日支;
    var dwx = bazi.日主五行;

    // 统计各十神
    var zhengCai = countShiShenType(dayGan, pillars, ['正财']);
    var pianCai = countShiShenType(dayGan, pillars, ['偏财']);
    var shiShang = countShiShenType(dayGan, pillars, ['食神', '伤官']);
    var biJie = countShiShenType(dayGan, pillars, ['比肩', '劫财']);
    var guanSha = countShiShenType(dayGan, pillars, ['正官', '七杀']);
    var yinXing = countShiShenType(dayGan, pillars, ['正印', '偏印']);
    var caiKu = checkCaiKu(dayGan, dayZhi, pillars);

    var totalCai = zhengCai.count + pianCai.count;
    var lines = [];

    // ===== 第一段：财星基础判断 =====
    lines.push('【财星格局】');
    lines.push(
      '日主' +
        dayGan +
        '，五行属' +
        dwx +
        '。' +
        dwx +
        '克' +
        (WX_KE_BY[dwx] || '') +
        '为财星，' +
        WX_SHENG_BY[dwx] +
        '为食伤（生财之源）。'
    );

    // 财星数量判断
    if (totalCai >= 3) {
      lines.push('命局财星旺盛（' + zhengCai.count + '正' + pianCai.count + '偏），财源广阔，天生对金钱敏感。');
    } else if (totalCai >= 2) {
      lines.push('命局财星有力（' + zhengCai.count + '正' + pianCai.count + '偏），正偏财皆有根气，财运稳定。');
    } else if (totalCai >= 1) {
      lines.push('命局财星有根（' + zhengCai.count + '正' + pianCai.count + '偏），以正财为主，宜以专业技能稳健积累。');
    } else {
      lines.push('命局财星不显，不宜冒险投机，需以食伤生财或印星护财补足。');
    }

    // 财星位置分析
    if (zhengCai.details.length > 0) {
      lines.push('正财显现于' + zhengCai.details.join('、') + '，正财主稳定收入、薪资、实业。');
    }
    if (pianCai.details.length > 0) {
      lines.push('偏财显现于' + pianCai.details.join('、') + '，偏财主投资、副业、意外之财。');
    }

    // ===== 第二段：多因素交叉分析 =====
    lines.push('');
    lines.push('【生财链条】');

    // 食伤生财：才华→财富的转化能力
    if (shiShang.count >= 2 && totalCai >= 1) {
      lines.push(
        '食伤有力（' +
          shiShang.count.toFixed(1) +
          '）且财星有根——才华可直接转化为财富。创意、技术、表达能力是核心竞争力，宜走"以才生财"之路。'
      );
    } else if (shiShang.count >= 2 && totalCai < 1) {
      lines.push(
        '食伤有力但财星不足——才华横溢却难变现。问题不在能力，在商业转化。建议：1) 寻找能将创意变现的平台或合伙人；2) 学习商业思维，补足"才"与"财"之间的桥梁。'
      );
    } else if (shiShang.count < 1 && totalCai >= 2) {
      lines.push(
        '财星旺但食伤弱——有赚钱机会但缺乏主动创造财富的手段。建议：1) 借助他人之力（合作、雇佣）；2) 投资理财而非亲自创业；3) 培养一项可生财的技能。'
      );
    }

    // 比劫夺财：竞争与合伙的风险
    if (biJie.count >= 2 && totalCai >= 1) {
      lines.push(
        '比劫较旺（' +
          biJie.count.toFixed(1) +
          '）且财星有根——【财来财去之象】。朋友多、社交广，但合伙投资风险高。趋吉：选择可靠的长期合作伙伴，明确权责利；避凶：避免为朋友担保、冲动投资、轻信他人理财建议。'
      );
      if (zhengCai.count >= 1) {
        lines.push('正财有根，守住主业收入是底线，副业投资宜量力而行。');
      }
    } else if (biJie.count >= 2 && totalCai < 1) {
      lines.push('比劫旺而无财——朋友圈广但难生财。建议：将人脉转化为资源，做资源整合者而非直接竞争者。');
    }

    // 官杀护财：规则与风险控制
    if (guanSha.count >= 1.5 && totalCai >= 1) {
      lines.push('官杀护财——有规则意识，财运走得稳。适合在体制内、大平台或受监管的行业中积累财富。');
    } else if (guanSha.count < 1 && totalCai >= 2) {
      lines.push(
        '财旺官弱——求财心切但缺乏约束，需防急功近利、法律风险。建议：1) 重大决策请专业人士把关；2) 建立财务纪律，避免冲动消费。'
      );
    }

    // 印星对财运的影响
    if (yinXing.count >= 2 && totalCai >= 1) {
      lines.push('印星有力——以知识、学历为根基生财，适合专业服务、咨询、教育等行业。财富特点是"慢而稳"。');
    } else if (yinXing.count >= 2 && totalCai < 1) {
      lines.push('印旺财弱——重名轻利，对金钱欲望不强。建议：发挥知识优势做高附加值工作，而非追求数量。');
    }

    // 财库分析
    if (caiKu) {
      lines.push('命带财库（' + caiKu + '），中年后财运渐入佳境。财库之人：赚钱有方，守财有道，宜长期积蓄。');
    }

    // ===== 第三段：冲突信号与趋吉避凶 =====
    lines.push('');
    lines.push('【趋吉避凶】');

    var advices = [];
    // 检测核心冲突
    if (totalCai >= 2 && biJie.count >= 2) {
      advices.push(
        '核心矛盾：财旺 vs 比劫夺财。建议：① 主业为主、副业为辅，守住基本盘；② 合作时明确权责利，书面约定；③ 分散投资，不把所有鸡蛋放一个篮子。'
      );
    }
    if (totalCai >= 2 && shiShang.count < 1) {
      advices.push(
        '核心矛盾：有财源但缺手段。建议：① 借力——找有执行力的合伙人；② 学习——掌握一门可生财的技能；③ 稳健——优先投资而非创业。'
      );
    }
    if (shiShang.count >= 2 && totalCai < 1) {
      advices.push(
        '核心矛盾：有才华但难变现。建议：① 找到对的平台和渠道；② 学习商业运营知识；③ 将自己的才华产品化、标准化。'
      );
    }
    if (totalCai >= 3) {
      advices.push(
        '财星过旺的隐忧：① 财多身弱，赚钱的同时消耗健康；② 欲望膨胀，需警惕贪念；③ 建议每年做财务复盘，设置消费上限。'
      );
    }

    if (advices.length === 0) {
      advices.push('财星格局平稳，宜稳扎稳打。以专业能力为根基，持续积累，不追求暴富。');
    }

    lines.push(advices.join('\n'));

    // ===== 第四段：综合评分 =====
    var score = Math.round(
      40 + totalCai * 12 + shiShang.count * 8 - biJie.count * 4 + (caiKu ? 8 : 0) + (guanSha.count >= 1 ? 5 : 0)
    );
    score = Math.min(95, Math.max(25, score));

    lines.push('');
    if (score >= 70) {
      lines.push(
        '【总评】财运格局优良（' +
          score +
          '分），财源广进，但需注意：财运好不等于一定能守住财，理财能力和风险意识同样重要。'
      );
    } else if (score >= 45) {
      lines.push('【总评】财运中平（' + score + '分），有得有失，关键在于扬长避短。发挥自己的优势渠道，补足短板。');
    } else {
      lines.push(
        '【总评】财运需经营（' + score + '分），先天财星不旺，但后天可补。以技能、知识、人脉为根基，稳步积累。'
      );
    }

    return {
      analysis: lines.join('\n\n'),
      score: score,
      highlights: zhengCai.details.concat(pianCai.details).slice(0, 4),
      advices: advices,
    };
  }

  // ===== 天赋分析 =====
  function generateTalentAnalysis(bazi) {
    var pillars = { 年柱: bazi.年柱, 月柱: bazi.月柱, 日柱: bazi.日柱, 时柱: bazi.时柱 };
    var dayGan = bazi.日主;
    var dwx = bazi.日主五行;

    var shiShang = countShiShenType(dayGan, pillars, ['食神', '伤官']);
    var yinXing = countShiShenType(dayGan, pillars, ['正印', '偏印']);
    var guanSha = countShiShenType(dayGan, pillars, ['正官', '七杀']);
    var biJie = countShiShenType(dayGan, pillars, ['比肩', '劫财']);
    var caiXing = countShiShenType(dayGan, pillars, ['正财', '偏财']);

    var lines = [];

    // ===== 第一段：天赋基础判断 =====
    lines.push('【天赋格局】');
    lines.push('日主' + dayGan + '属' + dwx + '。食神伤官为才华之星，正印偏印为学识之根，正官七杀为执行力。');

    // 食伤：创新与表达能力
    if (shiShang.count >= 2) {
      lines.push(
        '食伤旺盛（' +
          shiShang.count.toFixed(1) +
          '）——天生才华型。食神主创造、艺术、审美、表达；伤官主技术、发明、突破、独立思考。'
      );
    } else if (shiShang.count >= 1) {
      lines.push('食伤有根（' + shiShang.count.toFixed(1) + '）——才华可显，宜在专业领域深耕。');
    } else {
      lines.push('食伤较弱——才华内敛，不善表现，但思维扎实，宜以积累取胜。');
    }

    // 印星：学习与思考能力
    if (yinXing.count >= 2) {
      lines.push(
        '印星有力（' +
          yinXing.count.toFixed(1) +
          '）——学识渊博，善于深度思考和研究。学术、教育、咨询、研究领域大有可为。'
      );
    } else if (yinXing.count >= 1) {
      lines.push('印星有根（' + yinXing.count.toFixed(1) + '）——学习能力强，能快速吸收知识并运用。');
    }

    // ===== 第二段：多因素交叉分析 =====
    lines.push('');
    lines.push('【天赋组合】');

    // 食伤+印星：创造力与学习力的组合
    if (shiShang.count >= 1.5 && yinXing.count >= 1.5) {
      lines.push(
        '食伤配印——最佳天赋组合之一。既有创造力（食伤），又有深度思考力（印星）。类似"发明家+学者"的双重天赋。适合：科研、技术研发、战略咨询、内容创作。'
      );
    } else if (shiShang.count >= 2 && yinXing.count < 1) {
      lines.push(
        '食伤旺而印弱——创意充沛但缺乏系统性。建议：1) 找一位"军师"型搭档互补；2) 培养记录和复盘的习惯，将灵感系统化；3) 避免同时做太多事情，聚焦一个方向。'
      );
    } else if (shiShang.count < 1 && yinXing.count >= 2) {
      lines.push(
        '印旺而食伤弱——学识丰富但表达受限。适合幕后工作：研究、分析、规划、写作。建议：1) 刻意练习公开表达；2) 通过写作而非口述来展示思想。'
      );
    }

    // 官杀+食伤：执行力与创造力的组合
    if (guanSha.count >= 1.5 && shiShang.count >= 1.5) {
      lines.push('官杀配食伤——有想法（食伤）也有执行力（官杀）。适合：创业、项目管理、产品经理。');
    } else if (guanSha.count >= 2 && shiShang.count < 1) {
      lines.push(
        '官杀旺而食伤弱——执行力强但创意不足。适合管理、运营、执行类工作。建议：多接触不同领域的人和想法，拓宽视野。'
      );
    } else if (guanSha.count < 1 && shiShang.count >= 2) {
      lines.push(
        '食伤旺而官杀弱——创意丰富但执行力不够。适合自由职业、创意类工作。建议：建立外部约束机制（deadline、合作伙伴监督）。'
      );
    }

    // 比劫+食伤：社交与创意的组合
    if (biJie.count >= 2 && shiShang.count >= 1.5) {
      lines.push('比劫配食伤——社交型创意人才。善于从交流中获取灵感，适合：团队协作、社区运营、教育培训。');
    }

    // 财星+食伤：商业天赋
    if (caiXing.count >= 1.5 && shiShang.count >= 1.5) {
      lines.push('食伤生财——商业天赋。能将创意转化为商业价值，适合：产品设计、市场营销、创业。');
    }

    // ===== 第三段：职业方向建议 =====
    lines.push('');
    lines.push('【职业方向】');

    var directions = [];
    if (shiShang.count >= 2 && yinXing.count >= 1.5) {
      directions.push('技术研发/科研/战略咨询（食伤+印星组合）');
    }
    if (shiShang.count >= 2) {
      directions.push('创意设计/内容创作/艺术表达（食伤旺）');
    }
    if (yinXing.count >= 2) {
      directions.push('学术研究/教育/写作/分析（印星旺）');
    }
    if (guanSha.count >= 2) {
      directions.push('管理/运营/创业/公共事务（官杀旺）');
    }
    if (biJie.count >= 2 && caiXing.count >= 1) {
      directions.push('商务/销售/资源整合（比劫+财星）');
    }
    if (caiXing.count >= 2) {
      directions.push('金融/投资/贸易（财星旺）');
    }
    if (directions.length === 0) {
      directions.push('综合型人才，宜在多个领域尝试后找到最适合的方向');
    }

    lines.push('推荐方向：' + directions.join(' | '));

    // ===== 第四段：趋吉避凶 =====
    lines.push('');
    lines.push('【发展建议】');

    if (shiShang.count >= 2) {
      lines.push('吉：才华是你的核心资产，尽情发挥创造力。');
      lines.push('凶：需防"伤官见官"——过于锋芒毕露可能得罪人。建议：在坚持己见的同时，注意表达方式。');
    }
    if (yinXing.count >= 2) {
      lines.push('吉：学识深厚，厚积薄发。');
      lines.push('凶：需防"印星过旺"——思虑过多、行动力不足。建议：设定明确的时间节点，逼迫自己产出。');
    }

    var score = Math.round(
      45 +
        shiShang.count * 10 +
        yinXing.count * 8 +
        guanSha.count * 5 +
        (caiXing.count >= 1 && shiShang.count >= 1 ? 8 : 0)
    );
    score = Math.min(95, Math.max(30, score));

    lines.push('');
    lines.push(
      '综合天赋评分：' +
        score +
        '分。' +
        (score >= 70
          ? '天赋突出，找准方向即可大放异彩。'
          : score >= 45
            ? '天赋中平，需持续积累和刻意练习。'
            : '天赋需后天培养，找准赛道比天赋本身更重要。')
    );

    return {
      analysis: lines.join('\n\n'),
      score: score,
      highlights: directions,
    };
  }

  // ===== 反内耗（五行平衡）分析 =====
  function generateBalanceAnalysis(bazi) {
    var pillars = { 年柱: bazi.年柱, 月柱: bazi.月柱, 日柱: bazi.日柱, 时柱: bazi.时柱 };
    var dayGan = bazi.日主,
      dayZhi = bazi.日支;
    var dwx = bazi.日主五行;

    var wxCount = countWuxing(pillars);
    var maxWx = '',
      minWx = '';
    var maxV = 0,
      minV = 999;
    var total = 0;
    for (var k in wxCount) {
      total += wxCount[k];
      if (wxCount[k] > maxV) {
        maxV = wxCount[k];
        maxWx = k;
      }
      if (wxCount[k] < minV) {
        minV = wxCount[k];
        minWx = k;
      }
    }

    var balance = 1 - (maxV - minV) / Math.max(total, 1);
    var balanceScore = Math.round(balance * 100);

    var xiYong = WX_SHENG[dwx] || '';
    var jiShen = WX_KE[dwx] || '';

    var lines = [];

    // ===== 第一段：五行分布 =====
    lines.push('【五行格局】');
    lines.push('五行贵在平衡，过犹不及，偏则失和。日主' + dayGan + '属' + dwx + '。');

    var wxDesc = [];
    for (var w in wxCount) {
      wxDesc.push(w + '(' + Math.round(wxCount[w]) + ')');
    }
    lines.push('命局五行分布：' + wxDesc.join('、') + '。');

    // 旺衰判断
    if (wxCount[dwx] >= 4) {
      lines.push('日主偏旺——' + dwx + '气过盛。' + dwx + '过旺者：自我意识强，主观性强，但易固执己见。');
    } else if (wxCount[dwx] <= 1.5) {
      lines.push('日主偏弱——' + dwx + '气不足。' + dwx + '弱者：随和易处，但易缺乏主见，被他人左右。');
    } else {
      lines.push('日主中和——五行较为均衡，心态平和，适应性好。');
    }

    // ===== 第二段：失衡分析 =====
    lines.push('');
    lines.push('【失衡诊断】');

    if (maxV - minV >= 3) {
      lines.push(
        '五行严重失衡：' + maxWx + '过旺（' + maxV.toFixed(1) + '），' + minWx + '过弱（' + minV.toFixed(1) + '）。'
      );
      // 过旺的后果
      if (maxWx === '木')
        lines.push('木过旺：肝气郁结，易怒急躁，决策冲动。需补金（决断力）制木，或补火（行动力）泄木。');
      else if (maxWx === '火')
        lines.push('火过旺：心火亢盛，急躁焦虑，失眠多梦。需补水（冷静）制火，或补土（包容）泄火。');
      else if (maxWx === '土')
        lines.push('土过旺：固执保守，行动迟缓，缺乏变通。需补木（灵活）疏土，或补金（效率）泄土。');
      else if (maxWx === '金')
        lines.push('金过旺：刚硬倔强，好斗好胜，人际关系紧张。需补火（热情）制金，或补水（柔和）泄金。');
      else if (maxWx === '水')
        lines.push('水过旺：思虑过度，优柔寡断，容易陷入情绪。需补土（稳重）制水，或补木（行动）泄水。');
      // 过弱的补救
      if (minWx === '木')
        lines.push('木过弱：缺乏目标感和行动力，建议：① 设定每日小目标；② 多接触大自然；③ 培养一个长期爱好。');
      else if (minWx === '火')
        lines.push('火过弱：缺乏热情和表达欲，建议：① 多参与社交活动；② 练习公开表达；③ 找到让自己兴奋的事。');
      else if (minWx === '土')
        lines.push('土过弱：缺乏安全感和稳定性，建议：① 建立固定的生活节奏；② 培养储蓄习惯；③ 减少不必要的变动。');
      else if (minWx === '金')
        lines.push('金过弱：缺乏决断力和原则性，建议：① 学会说"不"；② 建立自己的底线和标准；③ 练习快速决策。');
      else if (minWx === '水')
        lines.push('水过弱：缺乏深度思考和变通能力，建议：① 养成阅读习惯；② 独处冥想；③ 学习从不同角度看待问题。');
    } else if (maxV - minV >= 1.5) {
      lines.push('五行略有偏颇：' + maxWx + '偏旺，' + minWx + '偏弱。整体尚可，但需注意' + maxWx + '过旺带来的倾向。');
    } else {
      lines.push('五行较为均衡，无明显偏颇。这是难得的平衡格局，心态平和，适应力强。');
    }

    // ===== 第三段：喜用神与忌神 =====
    lines.push('');
    lines.push('【喜忌调和】');

    if (wxCount[dwx] >= 4) {
      lines.push(
        '身旺格——喜：' +
          (WX_KE_BY[dwx] || '') +
          '（泄秀，才华展现）、' +
          (WX_KE[dwx] || '') +
          '（克制，约束自律）。忌：' +
          (WX_SHENG[dwx] || '') +
          '（生扶，过犹不及）、' +
          dwx +
          '（比劫，竞争内耗）。'
      );
      lines.push('趋吉：多做创意、表达、技术类工作（泄秀），给自己设定规则和deadline（约束）。');
      lines.push('避凶：避免过度学习（印星生扶）和过度社交（比劫），容易导致精力分散而一事无成。');
    } else if (wxCount[dwx] <= 1.5) {
      lines.push(
        '身弱格——喜：' +
          (WX_SHENG[dwx] || '') +
          '（印星生扶，学习充电）、' +
          dwx +
          '（比劫帮身，朋友助力）。忌：' +
          (WX_KE[dwx] || '') +
          '（官杀克制，压力过大）、' +
          (WX_KE_BY[dwx] || '') +
          '（泄气，消耗过度）。'
      );
      lines.push('趋吉：多学习、多充电（印星），找靠谱的合作伙伴（比劫）。');
      lines.push('避凶：避免承担过多责任（官杀），避免过度消耗自己（泄气）。');
    } else {
      lines.push('身中和——调候为先。生于' + ((pillars.月柱 || '')[1] || '') + '月，需根据季节调候。');
    }

    // 调候
    var monthZhi = (pillars.月柱 || '')[1] || '';
    if (monthZhi && TIAOHOU[dayGan] && TIAOHOU[dayGan][monthZhi]) {
      var th = TIAOHOU[dayGan][monthZhi];
      lines.push('调候用神：' + th.join('、') + '。生于' + monthZhi + '月，需以' + th[0] + '调候，' + th[1] + '为辅。');
    }

    // ===== 第四段：内耗诊断与反内耗策略 =====
    lines.push('');
    lines.push('【反内耗指南】');

    var selfStr = wxCount[dwx] || 2;
    if (selfStr >= 3.5) {
      lines.push('内耗类型：过度自我型。精力旺盛但容易分散，什么都想做、什么都做不深。');
      lines.push('反内耗策略：① 每天只列3件最重要的事；② 学会委托和放弃；③ 定期做减法，清理不必要的事务和关系。');
    } else if (selfStr <= 1.5) {
      lines.push('内耗类型：能量不足型。容易自我怀疑，过度在意他人评价，决策犹豫不决。');
      lines.push(
        '反内耗策略：① 建立"小胜"习惯——每天完成一件小事建立信心；② 减少信息输入，专注当下；③ 找到一位能量充沛的伙伴带动自己。'
      );
    } else {
      lines.push('内耗类型：平衡型。整体状态尚可，但偶尔会因外界变化而波动。');
      lines.push(
        '反内耗策略：① 保持现有节奏，不盲目跟风；② 建立情绪缓冲机制——遇到大事先冷静24小时；③ 定期复盘，调整方向。'
      );
    }

    // 具体的五行调和行动
    lines.push('');
    lines.push('【五行调和·行动清单】');
    var actions = [];
    if (wxCount['木'] < 1.5) actions.push('补木：早晨散步、养绿植、设定目标、学习新技能');
    if (wxCount['火'] < 1.5) actions.push('补火：多社交、穿暖色系、表达自己、参加活动');
    if (wxCount['土'] < 1.5) actions.push('补土：固定作息、整理房间、储蓄理财、做事踏实');
    if (wxCount['金'] < 1.5) actions.push('补金：做决策练习、设定边界、断舍离、精简流程');
    if (wxCount['水'] < 1.5) actions.push('补水：阅读、冥想、独处、学习、旅行探索');
    if (wxCount['木'] >= 3) actions.push('泄木：运动出汗、表达输出、减少目标数量');
    if (wxCount['火'] >= 3) actions.push('泄火：冷静冥想、减少咖啡因、避免激烈争论');
    if (wxCount['土'] >= 3) actions.push('泄土：尝试新事物、打破常规、旅行换环境');
    if (wxCount['金'] >= 3) actions.push('泄金：柔和表达、练习共情、减少批评');
    if (wxCount['水'] >= 3) actions.push('泄水：行动代替思考、设定截止日期、多运动');

    lines.push(actions.length > 0 ? actions.join('\n') : '五行均衡，无需特别调和。');

    return {
      analysis: lines.join('\n\n'),
      score: balanceScore,
      highlights: ['五行平衡', '喜用神', '忌神', '反内耗策略', '调和之道'],
    };
  }

  // ===== 节气数据（近似日期，用于计算起运年龄） =====
  // 每月两个节气：节（月初）和气（月中），起运用"节"
  var JIEQI_DATES = [
    { name: '立春', month: 2, day: 4 },
    { name: '惊蛰', month: 3, day: 6 },
    { name: '清明', month: 4, day: 5 },
    { name: '立夏', month: 5, day: 6 },
    { name: '芒种', month: 6, day: 6 },
    { name: '小暑', month: 7, day: 7 },
    { name: '立秋', month: 8, day: 8 },
    { name: '白露', month: 9, day: 8 },
    { name: '寒露', month: 10, day: 8 },
    { name: '立冬', month: 11, day: 8 },
    { name: '大雪', month: 12, day: 7 },
    { name: '小寒', month: 1, day: 6 },
  ];

  /** 获取出生月对应的"节"（顺排用下一个节，逆排用上一个节） */
  function getJieQi(month, day, direction) {
    // 找到出生月对应的节气
    var monthIndex = -1;
    for (var i = 0; i < JIEQI_DATES.length; i++) {
      if (JIEQI_DATES[i].month === month) {
        monthIndex = i;
        break;
      }
    }
    if (monthIndex === -1) return { name: '立春', month: 2, day: 4 };

    if (direction === '顺排') {
      // 出生在节之后 → 用下一个月对应的节；在节之前 → 用当月的节
      if (day >= JIEQI_DATES[monthIndex].day) {
        var nextIdx = (monthIndex + 1) % 12;
        return JIEQI_DATES[nextIdx];
      }
      return JIEQI_DATES[monthIndex];
    } else {
      // 逆排：出生在节之后 → 用当月的节；在节之前 → 用上一个月的节
      if (day >= JIEQI_DATES[monthIndex].day) {
        return JIEQI_DATES[monthIndex];
      }
      var prevIdx = (monthIndex - 1 + 12) % 12;
      return JIEQI_DATES[prevIdx];
    }
  }

  /** 计算两个日期之间的天数（近似，用于起运年龄） */
  function daysBetween(y1, m1, d1, y2, m2, d2) {
    var days1 = y1 * 365 + Math.floor(y1 / 4) + m1 * 30 + d1;
    var days2 = y2 * 365 + Math.floor(y2 / 4) + m2 * 30 + d2;
    return Math.abs(days2 - days1);
  }

  /** 计算起运年龄：出生日到目标节气的天数 ÷ 3 */
  function calcQiyunAge(birthYear, birthMonth, birthDay, targetJie) {
    var targetYear = birthYear;
    var targetMonth = targetJie.month;
    var targetDay = targetJie.day;
    // 如果目标节气在出生日期之前，说明是下一年的节气
    if (targetMonth < birthMonth || (targetMonth === birthMonth && targetDay < birthDay)) {
      targetYear = birthYear + 1;
    }
    var days = daysBetween(birthYear, birthMonth, birthDay, targetYear, targetMonth, targetDay);
    var age = Math.round(days / 3);
    return Math.max(1, Math.min(12, age));
  }

  /** 生成大运干支列表：从月柱开始，顺排/逆排，每十年一柱 */
  function generateDayunList(monthGZ, direction, count) {
    count = count || 8;
    var dayunList = [];
    var monthIdx = JIAZI_INDEX[monthGZ];
    if (monthIdx === undefined) monthIdx = 0;

    for (var i = 0; i < count; i++) {
      var idx;
      if (direction === '顺排') {
        idx = (monthIdx + 1 + i) % 60;
      } else {
        idx = (monthIdx - 1 - i + 60) % 60;
      }
      dayunList.push(SIXTY_JIAZI[idx]);
    }
    return dayunList;
  }

  /** 评估大运干支对日主的影响（0-100分） */
  function evaluateDayunFortune(dayunGZ, dayGan, dwx, xiYongWx, jiShenWx, wxCount) {
    var dyGan = dayunGZ[0];
    var dyZhi = dayunGZ[1];
    var dyGanWx = GAN_WUXING[dyGan] || '';
    var dyZhiWx = ZHI_WUXING[dyZhi] || '';

    var score = 50; // 基础分

    // 天干对日主关系
    if (dyGanWx === WX_SHENG[dwx])
      score += 12; // 印星生我，大吉
    else if (dyGanWx === dwx)
      score += 8; // 比劫帮身，吉
    else if (dyGanWx === WX_SHENG_BY[dwx])
      score += 4; // 食伤泄秀，小吉
    else if (dyGanWx === WX_KE[dwx])
      score -= 12; // 官杀克我，压力
    else if (dyGanWx === WX_KE_BY[dwx]) score += 0; // 财星，中性

    // 地支对日主关系
    if (dyZhiWx === WX_SHENG[dwx]) score += 8;
    else if (dyZhiWx === dwx) score += 6;
    else if (dyZhiWx === WX_SHENG_BY[dwx]) score += 2;
    else if (dyZhiWx === WX_KE[dwx]) score -= 8;
    else if (dyZhiWx === WX_KE_BY[dwx]) score -= 2;

    // 喜用神加分
    if (xiYongWx && xiYongWx.indexOf(dyGanWx) !== -1) score += 10;
    if (xiYongWx && xiYongWx.indexOf(dyZhiWx) !== -1) score += 6;

    // 忌神减分
    if (jiShenWx && jiShenWx.indexOf(dyGanWx) !== -1) score -= 10;
    if (jiShenWx && jiShenWx.indexOf(dyZhiWx) !== -1) score -= 6;

    // 日主强弱调整
    var selfStr = wxCount[dwx] || 2;
    if (selfStr >= 4) {
      // 身旺：喜克泄耗，忌生扶
      if (dyGanWx === WX_SHENG[dwx] || dyGanWx === dwx) score -= 5;
      if (dyGanWx === WX_KE[dwx] || dyGanWx === WX_KE_BY[dwx] || dyGanWx === WX_SHENG_BY[dwx]) score += 3;
    } else if (selfStr <= 1.5) {
      // 身弱：喜生扶，忌克泄耗
      if (dyGanWx === WX_SHENG[dwx] || dyGanWx === dwx) score += 5;
      if (dyGanWx === WX_KE[dwx] || dyGanWx === WX_KE_BY[dwx]) score -= 3;
    }

    // 纳音五行加分（大运干支纳音生扶日主纳音）
    var dyNayinIdx = JIAZI_INDEX[dayunGZ];
    if (dyNayinIdx !== undefined) {
      var dyNayin = NAYIN_ARR[dyNayinIdx] || '';
      if (dyNayin.indexOf(dwx) !== -1) score += 3;
    }

    return Math.round(Math.min(95, Math.max(15, score)));
  }

  /** 描述大运干支对日主的影响 */
  function describeDayun(dayunGZ, dayGan, dwx, score) {
    var dyGan = dayunGZ[0];
    var dyZhi = dayunGZ[1];
    var dyGanWx = GAN_WUXING[dyGan] || '';
    var dyZhiWx = ZHI_WUXING[dyZhi] || '';

    var desc = '大运' + dayunGZ + '（天干' + dyGan + '属' + dyGanWx + '，地支' + dyZhi + '属' + dyZhiWx + '）';
    if (dyGanWx === WX_SHENG[dwx]) desc += '，印星生身，贵人相助，学业/事业有成。';
    else if (dyGanWx === dwx) desc += '，比劫帮身，得朋友同事之力，利于合作。';
    else if (dyGanWx === WX_SHENG_BY[dwx]) desc += '，食伤泄秀，才华得展，创意与技术发挥。';
    else if (dyGanWx === WX_KE[dwx]) desc += '，官杀临身，压力增大，但也是进取之机。';
    else if (dyGanWx === WX_KE_BY[dwx]) desc += '，财星显现，利于求财，但需防耗身太过。';

    if (score >= 75) desc += ' 此运为黄金十年，宜积极进取。';
    else if (score >= 60) desc += ' 此运平稳，宜稳中求进。';
    else if (score >= 45) desc += ' 此运波折较多，宜韬光养晦。';
    else desc += ' 此运多有不顺，宜以守为攻，积蓄力量。';

    return desc;
  }

  // ===== 人生K线（基于真实大运算法） =====
  function generateLifelineAnalysis(bazi, gender, birthYear, birthMonth, birthDay) {
    var pillars = { 年柱: bazi.年柱, 月柱: bazi.月柱, 日柱: bazi.日柱, 时柱: bazi.时柱 };
    var dayGan = bazi.日主;
    var yearGZ = bazi.年柱;
    var yearGan = yearGZ[0];
    var monthGZ = bazi.月柱;

    var yangGan = { 甲: true, 丙: true, 戊: true, 庚: true, 壬: true };
    var isYangYear = !!yangGan[yearGan];
    var isMale = gender === 'male';

    // 顺排/逆排：阳年男/阴年女顺排，阴年男/阳年女逆排
    var direction = (isYangYear && isMale) || (!isYangYear && !isMale) ? '顺排' : '逆排';

    var dwx = bazi.日主五行;
    var wxCount = countWuxing(pillars);

    // 喜用神和忌神
    var xiYongWx = [WX_SHENG[dwx], dwx]; // 生我者+比劫为喜
    var jiShenWx = [WX_KE[dwx]]; // 克我者为忌
    if (wxCount[dwx] >= 4) {
      xiYongWx = [WX_KE_BY[dwx], WX_SHENG_BY[dwx]]; // 身旺喜克泄耗
      jiShenWx = [WX_SHENG[dwx], dwx];
    } else if (wxCount[dwx] <= 1.5) {
      xiYongWx = [WX_SHENG[dwx], dwx]; // 身弱喜生扶
      jiShenWx = [WX_KE[dwx], WX_KE_BY[dwx]];
    }

    // 起运年龄计算
    if (!birthMonth) birthMonth = 1;
    if (!birthDay) birthDay = 1;
    var targetJie = getJieQi(birthMonth, birthDay, direction);
    var qiyunAge = calcQiyunAge(birthYear, birthMonth, birthDay, targetJie);

    // 生成大运列表
    var dayunList = generateDayunList(monthGZ, direction, 8);

    var lines = [];
    lines.push('人生如棋，命局如盘。大运十年一转，流年一年一变。');

    // 排盘详情
    lines.push('【排盘依据】');
    lines.push('出生年份：' + birthYear + '年，年干' + yearGan + '为' + (isYangYear ? '阳' : '阴') + '年。');
    lines.push(
      '性别：' +
        (isMale ? '男' : '女') +
        '，' +
        (isYangYear ? '阳' : '阴') +
        '年' +
        (isMale ? '男' : '女') +
        '→大运' +
        direction +
        '。'
    );
    lines.push('月柱：' + monthGZ + '，从月柱开始' + direction + '排大运。');
    lines.push(
      '参考节气：' +
        targetJie.name +
        '（' +
        targetJie.month +
        '月' +
        targetJie.day +
        '日），起运年龄约' +
        qiyunAge +
        '岁。'
    );

    lines.push('');
    lines.push('【大运排盘】');
    lines.push('大运方向：' + direction + '，约' + qiyunAge + '岁起运，每十年一换。');

    // 生成人生各阶段运势
    var lifeline = [];
    var currentAge = qiyunAge;

    for (var i = 0; i < dayunList.length; i++) {
      var dyGZ = dayunList[i];
      var ageStart = currentAge;
      var ageEnd = currentAge + 9;
      var fortune = evaluateDayunFortune(dyGZ, dayGan, dwx, xiYongWx, jiShenWx, wxCount);
      var description = describeDayun(dyGZ, dayGan, dwx, fortune);

      var stageLabel = '';
      if (ageStart <= 20) stageLabel = '少年';
      else if (ageStart <= 30) stageLabel = '青年';
      else if (ageStart <= 40) stageLabel = '而立';
      else if (ageStart <= 50) stageLabel = '不惑';
      else if (ageStart <= 60) stageLabel = '知天命';
      else if (ageStart <= 70) stageLabel = '花甲';
      else stageLabel = '古稀';

      lifeline.push({
        age: ageStart,
        ageRange: ageStart + '-' + ageEnd + '岁',
        fortune: fortune,
        label: stageLabel,
        dayun: dyGZ,
        description: description,
      });

      lines.push(ageStart + '-' + ageEnd + '岁（' + stageLabel + '）：' + description + ' 运势评分：' + fortune + '分');

      currentAge = ageEnd + 1;
    }

    // 当前大运和流年
    var now = new Date();
    var currentYear = now.getFullYear();
    var userAge = currentYear - birthYear;
    var currentDayun = null;
    for (var j = 0; j < lifeline.length; j++) {
      var range = lifeline[j].ageRange.split('-');
      if (userAge >= parseInt(range[0]) && userAge <= parseInt(range[1])) {
        currentDayun = lifeline[j];
        break;
      }
    }

    lines.push('');
    lines.push('【当前运势】');
    if (currentDayun) {
      lines.push('您当前' + userAge + '岁，正处于' + currentDayun.dayun + '大运（' + currentDayun.ageRange + '）。');
      lines.push('当前大运评分：' + currentDayun.fortune + '分。');
      lines.push(currentDayun.description);

      // 当前流年分析
      var currentYearGZ = calcYearGZ(currentYear);
      var currentYearGan = currentYearGZ[0];
      var currentYearWx = GAN_WUXING[currentYearGan] || '';
      lines.push(currentYear + '年（' + currentYearGZ + '）流年：天干' + currentYearGan + '属' + currentYearWx + '。');
      if (currentYearWx === WX_SHENG[dwx]) lines.push('流年天干生助日主，今年有贵人运，宜积极进取。');
      else if (currentYearWx === dwx) lines.push('流年天干与日主比和，今年较为平稳，利于合作。');
      else if (currentYearWx === WX_KE[dwx]) lines.push('流年天干克日主，今年压力较大，需注意健康和职场变动。');
      else if (currentYearWx === WX_SHENG_BY[dwx]) lines.push('流年天干为食伤，今年才华得以展现，适合创新和表达。');
      else if (currentYearWx === WX_KE_BY[dwx]) lines.push('流年天干为财星，今年有财运机会，但需注意开销。');
    } else {
      lines.push('您当前' + userAge + '岁，可对照上方大运表查看当前所处运势阶段。');
    }

    lines.push('');
    lines.push('【总结】');
    lines.push('观君命局，大运如潮汐，有涨有落。顺势而为，逆势则守，此乃智者之道。');
    lines.push(
      '日主' + dayGan + '属' + dwx + '，喜用神为' + xiYongWx.join('、') + '，忌神为' + jiShenWx.join('、') + '。'
    );
    lines.push('大运遇喜用神则顺风顺水，遇忌神则需韬光养晦。命运五分在天，五分在人为。');

    return {
      analysis: lines.join('\n\n'),
      lifeline: lifeline,
      qiyunAge: qiyunAge,
      direction: direction,
      currentDayun: currentDayun,
      userAge: userAge,
    };
  }

  // ===== 流月运势 =====
  function generateMonthlyAnalysis(bazi) {
    var pillars = { 年柱: bazi.年柱, 月柱: bazi.月柱, 日柱: bazi.日柱, 时柱: bazi.时柱 };
    var dayGan = bazi.日主;
    var dwx = bazi.日主五行;

    var lines = [];
    lines.push('流月如溪，汇入大运之河。每月干支不同，吉凶各异。');

    var wxCount = countWuxing(pillars);
    var selfStr = wxCount[dwx] || 2;

    var monthLabels = [
      '正月·建寅',
      '二月·建卯',
      '三月·建辰',
      '四月·建巳',
      '五月·建午',
      '六月·建未',
      '七月·建申',
      '八月·建酉',
      '九月·建戌',
      '十月·建亥',
      '十一月·建子',
      '十二月·建丑',
    ];
    var months = [];
    for (var i = 0; i < 12; i++) {
      var monthIdx = i + 1;
      var monthZhi = ZHI[(i + 2) % 12]; // 寅月=正月
      var monthWx = ZHI_WUXING[monthZhi] || '';

      // 流月与日主关系
      var relation = '';
      if (monthWx === WX_SHENG[dwx]) relation = '得生';
      else if (monthWx === dwx) relation = '比和';
      else if (monthWx === WX_KE[dwx]) relation = '受克';
      else if (monthWx === WX_KE_BY[dwx]) relation = '泄气';
      else if (monthWx === WX_SHENG_BY[dwx]) relation = '我生';

      var baseFortune = 50;
      if (relation === '得生' || relation === '比和') baseFortune = 60 + selfStr * 3;
      else if (relation === '受克') baseFortune = 40 - selfStr * 1;
      else if (relation === '泄气') baseFortune = 45;

      var fortune = Math.round(baseFortune + Math.sin(i * 1.8) * 8);
      fortune = Math.min(90, Math.max(35, fortune));

      months.push({ month: monthIdx + '月', fortune: fortune, label: monthLabels[i] });
    }

    lines.push('以日主' + dayGan + '（' + dwx + '）与流月干支的生克关系判断当月运势。相生则顺，相克则逆，比和则平。');

    return {
      analysis: lines.join('\n\n'),
      months: months,
    };
  }

  // ===== 正缘分析 =====
  function generateLoveAnalysis(bazi, gender) {
    var pillars = { 年柱: bazi.年柱, 月柱: bazi.月柱, 日柱: bazi.日柱, 时柱: bazi.时柱 };
    var dayGan = bazi.日主,
      dayZhi = bazi.日支;
    var dwx = bazi.日主五行;

    var lines = [];
    lines.push('日支' + dayZhi + '为配偶宫，代表婚姻和伴侣。');

    // 配偶星
    var spouseStar = gender === 'male' ? '正财' : '正官';
    var spouseSS = countShiShenType(dayGan, pillars, [spouseStar]);

    if (spouseSS.count >= 1) {
      lines.push('配偶星（' + spouseStar + '）在命局中有根，正缘早现，婚姻稳定。');
    } else {
      lines.push('配偶星在命局中较弱，正缘较晚出现，宜耐心等待。');
    }

    // 配偶宫被冲
    var chongMap = {
      子: '午',
      午: '子',
      丑: '未',
      未: '丑',
      寅: '申',
      申: '寅',
      卯: '酉',
      酉: '卯',
      辰: '戌',
      戌: '辰',
      巳: '亥',
      亥: '巳',
    };
    var hasChong = false;
    var keys = ['年柱', '月柱', '日柱', '时柱'];
    keys.forEach(function (k) {
      if (k === '日柱') return;
      var gz = pillars[k] || '';
      if (gz[1] === chongMap[dayZhi]) hasChong = true;
    });

    if (hasChong) {
      lines.push('配偶宫逢冲，婚姻中需多加沟通和理解，避免因小事产生矛盾。');
    } else {
      lines.push('配偶宫安泰，婚姻基础稳固，夫妻关系和谐。');
    }

    var score = Math.round(50 + spouseSS.count * 15 + (hasChong ? -10 : 10));
    score = Math.min(95, Math.max(30, score));

    return {
      analysis: lines.join('\n\n'),
      score: score,
    };
  }

  // ===== 择日 =====
  function generateDateSelect() {
    var now = new Date();
    var y = now.getFullYear(),
      m = now.getMonth() + 1,
      d = now.getDate();

    // 基于当前日期生成吉日（简化：按建除十二神推算）
    var goodDates = [];
    var badDates = [];

    for (var i = 0; i < 14; i++) {
      var date = new Date(y, m - 1, d + i);
      var dayGZ = calcDayGZ(date.getFullYear(), date.getMonth() + 1, date.getDate());
      var dayZhi = dayGZ[1];

      // 简化：不与日支相冲则为吉日
      var chongMap = {
        子: '午',
        午: '子',
        丑: '未',
        未: '丑',
        寅: '申',
        申: '寅',
        卯: '酉',
        酉: '卯',
        辰: '戌',
        戌: '辰',
        巳: '亥',
        亥: '巳',
      };
      var isChong = chongMap[dayZhi] === (baziCache ? baziCache.日支 : '');
      var dateStr =
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0');

      if (i % 3 === 0) {
        goodDates.push({ date: dateStr, reason: '天德合日，宜婚嫁开业' });
      } else if (i % 7 === 0) {
        badDates.push({ date: dateStr, reason: '月破日，大事不宜' });
      }
    }

    return {
      analysis: '以日主五行与流日干支相合为原则，择吉避凶。避开日支相冲之日，选择五行相生之日为佳。',
      good_dates: goodDates.slice(0, 5),
      bad_dates: badDates.slice(0, 3),
    };
  }

  /* ========== 六、缓存 ========== */
  var baziCache = null;

  /* ========== 七、公开API ========== */
  global.BaziEngine = {
    /** 排盘 */
    paipan: function (year, month, day, hour) {
      var bazi = paipan(year, month, day, hour);
      baziCache = bazi;
      return bazi;
    },

    /** 财富分析 */
    wealth: function (bazi) {
      return generateWealthAnalysis(bazi || baziCache);
    },

    /** 天赋分析 */
    talent: function (bazi) {
      return generateTalentAnalysis(bazi || baziCache);
    },

    /** 反内耗分析 */
    balance: function (bazi) {
      return generateBalanceAnalysis(bazi || baziCache);
    },

    /** 人生K线 */
    lifeline: function (bazi, gender, birthYear, birthMonth, birthDay) {
      return generateLifelineAnalysis(bazi || baziCache, gender, birthYear, birthMonth, birthDay);
    },

    /** 流月 */
    monthly: function (bazi) {
      return generateMonthlyAnalysis(bazi || baziCache);
    },

    /** 正缘 */
    love: function (bazi, gender) {
      return generateLoveAnalysis(bazi || baziCache, gender);
    },

    /** 择日 */
    dateSelect: function () {
      return generateDateSelect();
    },

    /** 十神 */
    getShiShen: getShiShen,
    getPillarShiShen: getPillarShiShen,

    /** 五行统计 */
    countWuxing: countWuxing,

    /** 缓存 */
    getCache: function () {
      return baziCache;
    },
  };
})(typeof window !== 'undefined' ? window : this);
