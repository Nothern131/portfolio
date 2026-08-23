/**
 * 天机阁 · 紫微斗数引擎 v1 — 纯前端算法，零API调用
 * 安命宫 + 十二宫 + 十四主星 + 辅星 + 四化 + 解读
 * 参考：陈希夷《紫微斗数全书》体系
 */
(function (global) {
  'use strict';

  /* ========== 一、基础常量 ========== */
  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var ZHI_NUM = { 子: 0, 丑: 1, 寅: 2, 卯: 3, 辰: 4, 巳: 5, 午: 6, 未: 7, 申: 8, 酉: 9, 戌: 10, 亥: 11 };

  // 十二宫名称
  var GONG_NAMES = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '交友', '官禄', '田宅', '福德', '父母'];

  // 地支五行
  var ZHI_WX = {
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

  // 天干五行
  var GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };

  // 六十甲子
  var SIXTY_JIAZI = [];
  var JIAZI_INDEX = {};
  for (var i = 0; i < 60; i++) {
    var jz = GAN[i % 10] + ZHI[i % 12];
    SIXTY_JIAZI.push(jz);
    JIAZI_INDEX[jz] = i;
  }

  /* ========== 二、农历转换（简化版） ========== */
  // 1900-2100 农历数据（简化：仅用于演示，实际精度有限）
  // 每个数字表示当年农历正月初一对应的公历日期（前两位月，后两位日）
  // 以及闰月信息
  var LUNAR_INFO = {
    2024: { firstDay: [2, 10], leapMonth: 0 },
    2025: { firstDay: [1, 29], leapMonth: 6 },
    2026: { firstDay: [2, 17], leapMonth: 0 },
  };

  /** 简化农历转换（按年份近似） */
  function solarToLunarApprox(year, month, day) {
    var info = LUNAR_INFO[year];
    if (!info) {
      // 默认按立春约2月4日估算
      var lunarYear = month < 2 || (month === 2 && day < 4) ? year - 1 : year;
      var solarDate = new Date(year, month - 1, day);
      var springDate = new Date(year, 1, 4); // 2月4日立春
      var diffDays = Math.floor((solarDate - springDate) / (1000 * 60 * 60 * 24));
      var lunarMonth = Math.floor(diffDays / 30) + 1;
      if (lunarMonth < 1) {
        lunarMonth += 12;
        lunarYear -= 1;
      }
      if (lunarMonth > 12) lunarMonth = 12;
      var lunarDay = (diffDays % 30) + 1;
      if (lunarDay < 1) lunarDay = 1;
      if (lunarDay > 30) lunarDay = 30;
      return { year: lunarYear, month: lunarMonth, day: lunarDay };
    }
    // 有具体数据时计算
    var firstDay = new Date(year, info.firstDay[0] - 1, info.firstDay[1]);
    var target = new Date(year, month - 1, day);
    var diff = Math.floor((target - firstDay) / (1000 * 60 * 60 * 24));
    if (diff < 0) {
      // 还在上一年农历
      var prevInfo = LUNAR_INFO[year - 1] || { firstDay: [2, 1], leapMonth: 0 };
      var prevFirst = new Date(year - 1, prevInfo.firstDay[0] - 1, prevInfo.firstDay[1]);
      var prevDiff = Math.floor((target - prevFirst) / (1000 * 60 * 60 * 24));
      var lunarMonth = Math.floor(prevDiff / 30) + 1;
      if (lunarMonth > 12) lunarMonth = 12;
      var lunarDay = (prevDiff % 30) + 1;
      return { year: year - 1, month: lunarMonth, day: lunarDay };
    }
    var lunarMonth = Math.floor(diff / 30) + 1;
    if (lunarMonth > 12) lunarMonth = 12;
    var lunarDay = (diff % 30) + 1;
    if (lunarDay > 30) lunarDay = 30;
    return { year: year, month: lunarMonth, day: lunarDay };
  }

  /* ========== 三、安命宫/身宫 ========== */
  /**
   * 安命宫：从寅宫起正月，顺数至生月，再从该宫起子时，逆数至生时
   * 安身宫：从寅宫起正月，顺数至生月，再从该宫起子时，顺数至生时
   */
  function anMingGong(lunarMonth, shichen) {
    // 生月起寅宫，顺数
    var startPos = (2 + lunarMonth - 1) % 12; // 寅=2
    // 从该宫起子时，逆数至生时
    var shichenNum = ZHI_NUM[shichen];
    var mingGong = (startPos - shichenNum + 12) % 12;
    return ZHI[mingGong];
  }

  function anShenGong(lunarMonth, shichen) {
    // 生月起寅宫，顺数
    var startPos = (2 + lunarMonth - 1) % 12;
    // 从该宫起子时，顺数至生时
    var shichenNum = ZHI_NUM[shichen];
    var shenGong = (startPos + shichenNum) % 12;
    return ZHI[shenGong];
  }

  /* ========== 四、定十二宫天干 ========== */
  /**
   * 生年干定寅首天干：
   * 甲己→丙寅，乙庚→戊寅，丙辛→庚寅，丁壬→壬寅，戊癸→甲寅
   */
  var YIN_SHOU_GAN = {
    甲: '丙',
    己: '丙',
    乙: '戊',
    庚: '戊',
    丙: '庚',
    辛: '庚',
    丁: '壬',
    壬: '壬',
    戊: '甲',
    癸: '甲',
  };

  function buildGongGan(yearGan) {
    var yinGan = YIN_SHOU_GAN[yearGan] || '甲';
    var yinIdx = GAN.indexOf(yinGan);
    var gongGan = {};
    for (var i = 0; i < 12; i++) {
      gongGan[ZHI[i]] = GAN[(yinIdx + i) % 10];
    }
    return gongGan;
  }

  /* ========== 五、定五行局 ========== */
  /**
   * 五行局由命宫干支决定（纳音五行）
   * 简化版：直接用命宫天干地支查表
   */
  var NAYIN_WX = [
    '金',
    '金',
    '火',
    '火',
    '木',
    '木',
    '土',
    '土',
    '金',
    '金',
    '火',
    '火',
    '水',
    '水',
    '土',
    '土',
    '金',
    '金',
    '木',
    '木',
    '水',
    '水',
    '土',
    '土',
    '火',
    '火',
    '木',
    '木',
    '水',
    '水',
    '火',
    '火',
    '土',
    '土',
    '木',
    '木',
    '水',
    '水',
    '金',
    '金',
    '土',
    '土',
    '木',
    '木',
    '水',
    '水',
    '金',
    '金',
    '火',
    '火',
    '木',
    '木',
    '水',
    '水',
    '金',
    '金',
    '火',
    '火',
    '土',
    '土',
  ];

  var WX_JU_NUM = { 金: 4, 木: 3, 水: 2, 火: 6, 土: 5 };

  function getWuxingJu(mingGongGanZhi) {
    var idx = JIAZI_INDEX[mingGongGanZhi];
    if (idx === undefined) return { wx: '木', ju: 3 };
    var wx = NAYIN_WX[idx % 60];
    return { wx: wx, ju: WX_JU_NUM[wx] || 3 };
  }

  /* ========== 六、安紫微星 ========== */
  /**
   * 根据五行局数和农历生日安紫微星
   * 简化公式法
   */
  function anZiWei(juNum, lunarDay) {
    // 紫微星定位表（简化算法）
    // 公式：紫微星位置 = 生日除以局数的商和余数决定
    var quotient = Math.floor(lunarDay / juNum);
    var remainder = lunarDay % juNum;

    var ziWeiPos;
    if (remainder === 0) {
      ziWeiPos = quotient;
    } else {
      // 奇余数加，偶余数减
      if (remainder % 2 === 1) {
        ziWeiPos = quotient + remainder;
      } else {
        ziWeiPos = quotient - remainder;
      }
    }

    // 确保在1-12范围内，对应寅1到丑12
    // 紫微星从寅宫(2)开始安
    ziWeiPos = (((ziWeiPos - 1) % 12) + 12) % 12;
    return ZHI[ziWeiPos];
  }

  /* ========== 七、安十四主星 ========== */
  /**
   * 紫微系：紫微→天机(隔一)→(空)→太阳(隔一)→武曲(隔一)→天同(隔一)→(空)→廉贞(隔一)
   * 天府系：天府→太阴(隔一)→贪狼(隔一)→巨门(隔一)→天相(隔一)→天梁(隔一)→七杀(隔一)→(空)→破军(隔一)
   */

  // 紫微→天府位置映射
  var ZIWEI_TO_TIANFU = {
    子: '辰',
    丑: '卯',
    寅: '辰',
    卯: '丑',
    辰: '子',
    巳: '亥',
    午: '戌',
    未: '酉',
    申: '申',
    酉: '未',
    戌: '午',
    亥: '巳',
  };

  function anShiSiZhuXing(ziWeiZhi) {
    var ziWeiPos = ZHI_NUM[ziWeiZhi];
    var stars = {};

    // 紫微
    stars[ziWeiZhi] = (stars[ziWeiZhi] || []).concat(['紫微']);

    // 紫微系（逆时针隔一格安一星）
    // 天机：紫微隔一（逆数=减1）
    var tianJiPos = (ziWeiPos - 1 + 12) % 12;
    stars[ZHI[tianJiPos]] = (stars[ZHI[tianJiPos]] || []).concat(['天机']);

    // 跳过一格（空）
    // 太阳：再隔一
    var taiYangPos = (ziWeiPos - 3 + 12) % 12;
    stars[ZHI[taiYangPos]] = (stars[ZHI[taiYangPos]] || []).concat(['太阳']);

    // 武曲：再隔一
    var wuQuPos = (ziWeiPos - 4 + 12) % 12;
    stars[ZHI[wuQuPos]] = (stars[ZHI[wuQuPos]] || []).concat(['武曲']);

    // 天同：再隔一
    var tianTongPos = (ziWeiPos - 5 + 12) % 12;
    stars[ZHI[tianTongPos]] = (stars[ZHI[tianTongPos]] || []).concat(['天同']);

    // 跳过一格（空）
    // 廉贞：再隔一
    var lianZhenPos = (ziWeiPos - 7 + 12) % 12;
    stars[ZHI[lianZhenPos]] = (stars[ZHI[lianZhenPos]] || []).concat(['廉贞']);

    // 天府系
    var tianFuZhi = ZIWEI_TO_TIANFU[ziWeiZhi] || '辰';
    var tianFuPos = ZHI_NUM[tianFuZhi];

    stars[tianFuZhi] = (stars[tianFuZhi] || []).concat(['天府']);

    // 太阴：天府隔一（顺数=加1）
    var taiYinPos = (tianFuPos + 1) % 12;
    stars[ZHI[taiYinPos]] = (stars[ZHI[taiYinPos]] || []).concat(['太阴']);

    // 贪狼：再隔一
    var tanLangPos = (tianFuPos + 2) % 12;
    stars[ZHI[tanLangPos]] = (stars[ZHI[tanLangPos]] || []).concat(['贪狼']);

    // 巨门：再隔一
    var juMenPos = (tianFuPos + 3) % 12;
    stars[ZHI[juMenPos]] = (stars[ZHI[juMenPos]] || []).concat(['巨门']);

    // 天相：再隔一
    var tianXiangPos = (tianFuPos + 4) % 12;
    stars[ZHI[tianXiangPos]] = (stars[ZHI[tianXiangPos]] || []).concat(['天相']);

    // 天梁：再隔一
    var tianLiangPos = (tianFuPos + 5) % 12;
    stars[ZHI[tianLiangPos]] = (stars[ZHI[tianLiangPos]] || []).concat(['天梁']);

    // 七杀：再隔一
    var qiShaPos = (tianFuPos + 6) % 12;
    stars[ZHI[qiShaPos]] = (stars[ZHI[qiShaPos]] || []).concat(['七杀']);

    // 跳过一格（空）
    // 破军：再隔一
    var poJunPos = (tianFuPos + 8) % 12;
    stars[ZHI[poJunPos]] = (stars[ZHI[poJunPos]] || []).concat(['破军']);

    return stars;
  }

  /* ========== 八、安辅星 ========== */
  function anFuXing(yearZhi, lunarMonth, shichen, yearGan) {
    var fuXing = {};

    // 左辅：辰宫起正月，顺数至生月
    var zuoFuPos = (4 + lunarMonth - 1) % 12;
    fuXing[ZHI[zuoFuPos]] = (fuXing[ZHI[zuoFuPos]] || []).concat(['左辅']);

    // 右弼：戌宫起正月，逆数至生月
    var youBiPos = (10 - lunarMonth + 1 + 12) % 12;
    fuXing[ZHI[youBiPos]] = (fuXing[ZHI[youBiPos]] || []).concat(['右弼']);

    // 文昌：戌宫起子时，逆数至生时
    var wenChangPos = (10 - ZHI_NUM[shichen] + 12) % 12;
    fuXing[ZHI[wenChangPos]] = (fuXing[ZHI[wenChangPos]] || []).concat(['文昌']);

    // 文曲：辰宫起子时，顺数至生时
    var wenQuPos = (4 + ZHI_NUM[shichen]) % 12;
    fuXing[ZHI[wenQuPos]] = (fuXing[ZHI[wenQuPos]] || []).concat(['文曲']);

    // 天魁：甲戊庚→丑未，乙己→子申，丙丁→亥酉，壬癸→卯巳，辛→午寅
    var tianKuiMap = {
      甲: '丑',
      戊: '丑',
      庚: '丑',
      乙: '子',
      己: '子',
      丙: '亥',
      丁: '亥',
      壬: '卯',
      癸: '卯',
      辛: '午',
    };
    var tianKui = tianKuiMap[yearGan] || '丑';
    fuXing[tianKui] = (fuXing[tianKui] || []).concat(['天魁']);

    // 天钺
    var tianYueMap = {
      甲: '未',
      戊: '未',
      庚: '未',
      乙: '申',
      己: '申',
      丙: '酉',
      丁: '酉',
      壬: '巳',
      癸: '巳',
      辛: '寅',
    };
    var tianYue = tianYueMap[yearGan] || '未';
    fuXing[tianYue] = (fuXing[tianYue] || []).concat(['天钺']);

    // 禄存：甲→寅，乙→卯，丙戊→巳，丁己→午，庚→申，辛→酉，壬→亥，癸→子
    var luCunMap = {
      甲: '寅',
      乙: '卯',
      丙: '巳',
      丁: '午',
      戊: '巳',
      己: '午',
      庚: '申',
      辛: '酉',
      壬: '亥',
      癸: '子',
    };
    var luCun = luCunMap[yearGan] || '寅';
    fuXing[luCun] = (fuXing[luCun] || []).concat(['禄存']);

    // 擎羊：禄存前一宫
    var luCunPos = ZHI_NUM[luCun];
    var qingYangPos = (luCunPos + 1) % 12;
    fuXing[ZHI[qingYangPos]] = (fuXing[ZHI[qingYangPos]] || []).concat(['擎羊']);

    // 陀罗：禄存前一宫（逆）
    var tuoLuoPos = (luCunPos - 1 + 12) % 12;
    fuXing[ZHI[tuoLuoPos]] = (fuXing[ZHI[tuoLuoPos]] || []).concat(['陀罗']);

    // 火星：寅午戌→丑，申子辰→寅，巳酉丑→卯，亥卯未→酉
    var huoXingMap = {
      寅: '丑',
      午: '丑',
      戌: '丑',
      申: '寅',
      子: '寅',
      辰: '寅',
      巳: '卯',
      酉: '卯',
      丑: '卯',
      亥: '酉',
      卯: '酉',
      未: '酉',
    };
    var huoXing = huoXingMap[yearZhi] || '寅';
    fuXing[huoXing] = (fuXing[huoXing] || []).concat(['火星']);

    // 铃星：寅午戌→卯，申子辰→戌，巳酉丑→戌，亥卯未→戌
    var lingXingMap = {
      寅: '卯',
      午: '卯',
      戌: '卯',
      申: '戌',
      子: '戌',
      辰: '戌',
      巳: '戌',
      酉: '戌',
      丑: '戌',
      亥: '戌',
      卯: '戌',
      未: '戌',
    };
    var lingXing = lingXingMap[yearZhi] || '戌';
    fuXing[lingXing] = (fuXing[lingXing] || []).concat(['铃星']);

    // 地空：亥宫起子时，逆数至生时
    var diKongPos = (11 - ZHI_NUM[shichen] + 12) % 12;
    fuXing[ZHI[diKongPos]] = (fuXing[ZHI[diKongPos]] || []).concat(['地空']);

    // 地劫：亥宫起子时，顺数至生时
    var diJiePos = (11 + ZHI_NUM[shichen]) % 12;
    fuXing[ZHI[diJiePos]] = (fuXing[ZHI[diJiePos]] || []).concat(['地劫']);

    return fuXing;
  }

  /* ========== 九、四化 ========== */
  /**
   * 生年干定四化
   * 甲：廉贞化禄、破军化权、武曲化科、太阳化忌
   * 乙：天机化禄、天梁化权、紫微化科、太阴化忌
   * 丙：天同化禄、天机化权、文昌化科、廉贞化忌
   * 丁：太阴化禄、天同化权、天机化科、巨门化忌
   * 戊：贪狼化禄、太阴化权、右弼化科、天机化忌
   * 己：武曲化禄、贪狼化权、天梁化科、文曲化忌
   * 庚：太阳化禄、武曲化权、太阴化科、天同化忌
   * 辛：巨门化禄、太阳化权、文曲化科、文昌化忌
   * 壬：天梁化禄、紫微化权、左辅化科、武曲化忌
   * 癸：破军化禄、巨门化权、太阴化科、贪狼化忌
   */
  var SI_HUA = {
    甲: { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
    乙: { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
    丙: { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
    丁: { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
    戊: { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
    己: { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
    庚: { lu: '太阳', quan: '武曲', ke: '太阴', ji: '天同' },
    辛: { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
    壬: { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
    癸: { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' },
  };

  /* ========== 十、十二宫构建 ========== */
  function buildShiErGong(mingGongZhi, gongGan) {
    var mingGongPos = ZHI_NUM[mingGongZhi];
    var gongs = [];
    for (var i = 0; i < 12; i++) {
      var zhiPos = (mingGongPos + i) % 12;
      var zhi = ZHI[zhiPos];
      gongs.push({
        name: GONG_NAMES[i],
        zhi: zhi,
        gan: gongGan[zhi],
        ganZhi: gongGan[zhi] + zhi,
      });
    }
    return gongs;
  }

  /* ========== 十一、主入口 ========== */
  /**
   * 紫微斗数排盘
   * @param {object} params - { year, month, day, hour, gender, isLunar }
   *   hour: 时辰名称如 '子时'
   *   gender: '男' 或 '女'
   * @returns {object} 紫微斗数排盘结果
   */
  function paipan(params) {
    params = params || {};
    var year = params.year || 2000;
    var month = params.month || 1;
    var day = params.day || 1;
    var hour = params.hour || '子时';
    var gender = params.gender || '男';
    var isLunar = params.isLunar || false;

    // 时辰地支
    var shichenMap = {
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
    var shichen = shichenMap[hour] || '子';

    // 农历转换
    var lunar;
    if (isLunar) {
      lunar = { year: year, month: month, day: day };
    } else {
      lunar = solarToLunarApprox(year, month, day);
    }

    // 年干支
    var baseYear = 1900;
    var yearOffset = lunar.year - baseYear;
    var baseIdx = JIAZI_INDEX['庚子'] || 0;
    var yearGzIdx = (((baseIdx + yearOffset) % 60) + 60) % 60;
    var yearGan = GAN[yearGzIdx % 10];
    var yearZhi = ZHI[yearGzIdx % 12];

    // 安命宫
    var mingGongZhi = anMingGong(lunar.month, shichen);

    // 安身宫
    var shenGongZhi = anShenGong(lunar.month, shichen);

    // 十二宫天干
    var gongGan = buildGongGan(yearGan);

    // 五行局
    var mingGongGanZhi = gongGan[mingGongZhi] + mingGongZhi;
    var wuxingJu = getWuxingJu(mingGongGanZhi);

    // 安紫微星
    var ziWeiZhi = anZiWei(wuxingJu.ju, lunar.day);

    // 安十四主星
    var zhuXing = anShiSiZhuXing(ziWeiZhi);

    // 安辅星
    var fuXing = anFuXing(yearZhi, lunar.month, shichen, yearGan);

    // 四化
    var siHua = SI_HUA[yearGan] || SI_HUA['甲'];

    // 合并所有星曜
    var allStars = {};
    for (var zhi in zhuXing) {
      if (zhuXing.hasOwnProperty(zhi)) {
        allStars[zhi] = (allStars[zhi] || []).concat(zhuXing[zhi]);
      }
    }
    for (var zhi2 in fuXing) {
      if (fuXing.hasOwnProperty(zhi2)) {
        allStars[zhi2] = (allStars[zhi2] || []).concat(fuXing[zhi2]);
      }
    }

    // 构建十二宫
    var gongs = buildShiErGong(mingGongZhi, gongGan);

    // 为每宫分配星曜
    for (var i = 0; i < gongs.length; i++) {
      var gong = gongs[i];
      gong.stars = allStars[gong.zhi] || [];
      gong.isMingGong = gong.zhi === mingGongZhi;
      gong.isShenGong = gong.zhi === shenGongZhi;
    }

    // 命宫主星
    var mingGongStars = allStars[mingGongZhi] || [];
    var mingGongZhuXing = [];
    for (var si = 0; si < mingGongStars.length; si++) {
      var s = mingGongStars[si];
      if (
        [
          '紫微',
          '天机',
          '太阳',
          '武曲',
          '天同',
          '廉贞',
          '天府',
          '太阴',
          '贪狼',
          '巨门',
          '天相',
          '天梁',
          '七杀',
          '破军',
        ].indexOf(s) !== -1
      ) {
        mingGongZhuXing.push(s);
      }
    }

    // 生成解读
    var interpretation = generateZiWeiInterpretation(gongs, mingGongZhi, shenGongZhi, siHua, wuxingJu, yearGan, gender);

    // 总体运势判断
    var overallVerdict = judgeOverall(mingGongZhuXing, mingGongZhi, allStars);

    return {
      农历年: lunar.year,
      农历月: lunar.month,
      农历日: lunar.day,
      年干: yearGan,
      年支: yearZhi,
      命宫: mingGongZhi,
      命宫主星: mingGongZhuXing.join('、') || '无主星',
      身宫: shenGongZhi,
      五行局: wuxingJu.wx + wuxingJu.ju + '局',
      十二宫: gongs,
      四化: siHua,
      紫微星落: ziWeiZhi,
      所有星曜: allStars,
      interpretation: interpretation,
      总体运势: overallVerdict,
    };
  }

  /* ========== 十二、解读 ========== */
  function generateZiWeiInterpretation(gongs, mingGongZhi, shenGongZhi, siHua, wuxingJu, yearGan, gender) {
    var lines = [];

    lines.push('【紫微斗数排盘】');

    // 命宫分析
    var mingGong = findGong(gongs, mingGongZhi);
    var mingStars = mingGong ? mingGong.stars : [];
    lines.push(
      '命宫在' + mingGongZhi + '（' + (mingGong ? mingGong.ganZhi : '') + '），' + wuxingJu.wx + wuxingJu.ju + '局。'
    );

    if (mingStars.length > 0) {
      lines.push('命宫主星：' + mingStars.join('、'));
    } else {
      lines.push('命宫无主星，借对宫（迁移宫）星曜为用。');
    }

    // 身宫
    var shenGong = findGong(gongs, shenGongZhi);
    lines.push('身宫在' + shenGongZhi + '（' + (shenGong ? shenGong.name : '') + '），主后天发展重心所在。');

    // 四化
    lines.push(
      '四化：' + yearGan + '干→化禄' + siHua.lu + '、化权' + siHua.quan + '、化科' + siHua.ke + '、化忌' + siHua.ji
    );

    // 十二宫概况
    lines.push('【十二宫星曜分布】');
    for (var i = 0; i < gongs.length; i++) {
      var g = gongs[i];
      var marker = '';
      if (g.isMingGong) marker = ' ←命宫';
      if (g.isShenGong) marker += ' ←身宫';
      var starStr = g.stars.length > 0 ? g.stars.join('、') : '无主星';
      lines.push('  ' + g.name + '（' + g.ganZhi + '）：' + starStr + marker);
    }

    // 命宫解读
    lines.push('【命宫解读】');
    var mingInterpret = interpretMingGong(mingStars, mingGongZhi, siHua, gender);
    lines.push(mingInterpret);

    return lines.join('\n');
  }

  function findGong(gongs, zhi) {
    for (var i = 0; i < gongs.length; i++) {
      if (gongs[i].zhi === zhi) return gongs[i];
    }
    return null;
  }

  function interpretMingGong(stars, mingGongZhi, siHua, gender) {
    var lines = [];

    // 主星特质
    var starTraits = {
      紫微: '帝星坐命，天生有领导气质，自尊心强，好面子，有管理才能。',
      天机: '智星坐命，思维敏捷，善于谋划，但有时想太多而行动不足。',
      太阳: '日星坐命，热情开朗，光明磊落，乐于助人，但有时过于主观。',
      武曲: '财星坐命，刚毅果断，执行力强，善于理财，但有时过于刚硬。',
      天同: '福星坐命，性情温和，知足常乐，人缘好，但有时缺乏进取心。',
      廉贞: '囚星坐命，心思细腻，有艺术天赋，但有时情绪化，易纠结。',
      天府: '库星坐命，稳重踏实，有包容心，善于守成，但有时过于保守。',
      太阴: '月星坐命，温柔细腻，有审美品味，善于理财，但有时过于内敛。',
      贪狼: '桃花星坐命，多才多艺，交际广泛，欲望强，但有时过于贪心。',
      巨门: '暗星坐命，口才好，善辩论，但有时言语犀利，易得罪人。',
      天相: '印星坐命，公正无私，乐于助人，有服务精神，但有时过于刻板。',
      天梁: '荫星坐命，有长者风范，乐于提携后辈，但有时过于清高。',
      七杀: '将星坐命，勇敢果断，有开拓精神，但有时过于冲动，缺乏耐心。',
      破军: '耗星坐命，敢作敢为，有创新精神，但有时破坏力强，不按常理出牌。',
    };

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (starTraits[s]) {
        lines.push('  ' + s + '：' + starTraits[s]);
      }
    }

    if (lines.length === 0) {
      lines.push('  命宫无主星，需看对宫（迁移宫）星曜来定格局。');
    }

    // 四化影响
    lines.push(
      '  四化影响：' +
        siHua.lu +
        '化禄（财禄之喜）、' +
        siHua.quan +
        '化权（权力之增）、' +
        siHua.ke +
        '化科（名声之显）、' +
        siHua.ji +
        '化忌（波折之象）。'
    );

    return lines.join('\n');
  }

  function judgeOverall(mingGongZhuXing, mingGongZhi, allStars) {
    var jiStars = ['紫微', '天府', '太阳', '天相', '天梁', '天同', '太阴'];
    var xiongStars = ['七杀', '破军', '贪狼', '巨门', '廉贞'];
    var jiCount = 0,
      xiongCount = 0;

    for (var i = 0; i < mingGongZhuXing.length; i++) {
      if (jiStars.indexOf(mingGongZhuXing[i]) !== -1) jiCount++;
      if (xiongStars.indexOf(mingGongZhuXing[i]) !== -1) xiongCount++;
    }

    if (jiCount > xiongCount) return '命宫吉星汇聚，格局中上，一生运势平稳向好。';
    if (xiongCount > jiCount) return '命宫煞星较重，早年多波折，中晚年可望转好。';
    return '命宫格局中平，吉凶参半，需后天努力辅助。';
  }

  /* ========== 公开 API ========== */
  global.ZiWeiEngine = {
    paipan: paipan,
    GONG_NAMES: GONG_NAMES,
  };
})(typeof window !== 'undefined' ? window : this);
