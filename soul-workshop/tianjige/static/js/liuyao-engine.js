/**
 * 天机阁 · 六爻占卜引擎 v1 — 纯前端算法，零API调用
 * 鬼谷子·京房纳甲体系
 */
(function (global) {
  'use strict';

  /* ========== 一、基础常量 ========== */
  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 地支五行
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

  // 卦宫五行
  var GONG_WUXING = { 乾: '金', 兑: '金', 离: '火', 震: '木', 巽: '木', 坎: '水', 艮: '土', 坤: '土' };

  // 天干对应六兽起始
  var GAN_LIUSHOU = {
    甲: '青龙',
    乙: '青龙',
    丙: '朱雀',
    丁: '朱雀',
    戊: '勾陈',
    己: '螣蛇',
    庚: '白虎',
    辛: '白虎',
    壬: '玄武',
    癸: '玄武',
  };

  var LIUSHOU_ORDER = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];

  /* ========== 二、八卦基础 ========== */
  // 八卦三爻从下到上，1=阳 0=阴
  var BA_GUA = {
    乾: { yao: [1, 1, 1], wuxing: '金', xiang: '天', fangwei: '西北' },
    兑: { yao: [1, 1, 0], wuxing: '金', xiang: '泽', fangwei: '西' },
    离: { yao: [1, 0, 1], wuxing: '火', xiang: '火', fangwei: '南' },
    震: { yao: [1, 0, 0], wuxing: '木', xiang: '雷', fangwei: '东' },
    巽: { yao: [0, 1, 1], wuxing: '木', xiang: '风', fangwei: '东南' },
    坎: { yao: [0, 1, 0], wuxing: '水', xiang: '水', fangwei: '北' },
    艮: { yao: [0, 0, 1], wuxing: '土', xiang: '山', fangwei: '东北' },
    坤: { yao: [0, 0, 0], wuxing: '土', xiang: '地', fangwei: '西南' },
  };

  /* ========== 二、六十甲子与五虎遁 ========== */
  var SIXTY_JIAZI = [];
  var JIAZI_INDEX = {};
  for (var jzI = 0; jzI < 60; jzI++) {
    var jz = GAN[jzI % 10] + ZHI[jzI % 12];
    SIXTY_JIAZI.push(jz);
    JIAZI_INDEX[jz] = jzI;
  }
  // 五虎遁（年干→寅月月干）：甲己之年丙作首，乙庚之岁戊为头...
  var WUHUDUN = { 甲: '丙', 己: '丙', 乙: '戊', 庚: '戊', 丙: '庚', 辛: '庚', 丁: '壬', 壬: '壬', 戊: '甲', 癸: '甲' };

  /* ========== 三、64卦表（八宫卦序，按"变爻法"生成） ========== */
  // 每卦：{ name, gong, yao[6]从下到上, shi(1-6), upper, lower }
  var GUAS = [];

  function _makeGua(name, gong, yao, shi, upper, lower) {
    GUAS.push({ name: name, gong: gong, yao: yao, shi: shi, upper: upper, lower: lower });
  }

  // --- 乾宫八卦（八纯卦：111111） ---
  _makeGua('乾为天', '乾', [1, 1, 1, 1, 1, 1], 6, '乾', '乾'); // 八纯
  _makeGua('天风姤', '乾', [0, 1, 1, 1, 1, 1], 1, '乾', '巽'); // 一世
  _makeGua('天山遁', '乾', [0, 0, 1, 1, 1, 1], 2, '乾', '艮'); // 二世
  _makeGua('天地否', '乾', [0, 0, 0, 1, 1, 1], 3, '乾', '坤'); // 三世
  _makeGua('风地观', '乾', [0, 0, 0, 0, 1, 1], 4, '巽', '坤'); // 四世
  _makeGua('山地剥', '乾', [0, 0, 0, 0, 0, 1], 5, '艮', '坤'); // 五世
  _makeGua('火地晋', '乾', [0, 0, 0, 1, 0, 1], 4, '离', '坤'); // 游魂
  _makeGua('火天大有', '乾', [1, 1, 1, 1, 0, 1], 3, '离', '乾'); // 归魂

  // --- 坎宫八卦（八纯卦：010010） ---
  _makeGua('坎为水', '坎', [0, 1, 0, 0, 1, 0], 6, '坎', '坎');
  _makeGua('水泽节', '坎', [1, 1, 0, 0, 1, 0], 1, '坎', '兑');
  _makeGua('水雷屯', '坎', [1, 0, 0, 0, 1, 0], 2, '坎', '震');
  _makeGua('水火既济', '坎', [1, 0, 1, 0, 1, 0], 3, '坎', '离');
  _makeGua('泽火革', '坎', [1, 0, 1, 1, 1, 0], 4, '兑', '离');
  _makeGua('雷火丰', '坎', [1, 0, 1, 1, 0, 0], 5, '震', '离');
  _makeGua('地火明夷', '坎', [1, 0, 1, 0, 0, 0], 4, '坤', '离'); // 游魂
  _makeGua('地水师', '坎', [0, 1, 0, 0, 0, 0], 3, '坤', '坎'); // 归魂

  // --- 艮宫八卦（八纯卦：001001） ---
  _makeGua('艮为山', '艮', [0, 0, 1, 0, 0, 1], 6, '艮', '艮');
  _makeGua('山火贲', '艮', [1, 0, 1, 0, 0, 1], 1, '艮', '离');
  _makeGua('山天大畜', '艮', [1, 1, 1, 0, 0, 1], 2, '艮', '乾');
  _makeGua('山泽损', '艮', [1, 1, 0, 0, 0, 1], 3, '艮', '兑');
  _makeGua('火泽睽', '艮', [1, 1, 0, 1, 0, 1], 4, '离', '兑');
  _makeGua('天泽履', '艮', [1, 1, 0, 1, 1, 1], 5, '乾', '兑');
  _makeGua('风泽中孚', '艮', [1, 1, 0, 0, 1, 1], 4, '巽', '兑'); // 游魂
  _makeGua('风山渐', '艮', [0, 0, 1, 0, 1, 1], 3, '巽', '艮'); // 归魂

  // --- 震宫八卦（八纯卦：100100） ---
  _makeGua('震为雷', '震', [1, 0, 0, 1, 0, 0], 6, '震', '震');
  _makeGua('雷地豫', '震', [0, 0, 0, 1, 0, 0], 1, '震', '坤');
  _makeGua('雷水解', '震', [0, 1, 0, 1, 0, 0], 2, '震', '坎');
  _makeGua('雷风恒', '震', [0, 1, 1, 1, 0, 0], 3, '震', '巽');
  _makeGua('地风升', '震', [0, 1, 1, 0, 0, 0], 4, '坤', '巽');
  _makeGua('水风井', '震', [0, 1, 1, 0, 1, 0], 5, '坎', '巽');
  _makeGua('泽风大过', '震', [0, 1, 1, 1, 1, 0], 4, '兑', '巽'); // 游魂
  _makeGua('泽雷随', '震', [1, 0, 0, 1, 1, 0], 3, '兑', '震'); // 归魂

  // --- 巽宫八卦（八纯卦：011011） ---
  _makeGua('巽为风', '巽', [0, 1, 1, 0, 1, 1], 6, '巽', '巽');
  _makeGua('风天小畜', '巽', [1, 1, 1, 0, 1, 1], 1, '巽', '乾');
  _makeGua('风火家人', '巽', [1, 0, 1, 0, 1, 1], 2, '巽', '离');
  _makeGua('风雷益', '巽', [1, 0, 0, 0, 1, 1], 3, '巽', '震');
  _makeGua('天雷无妄', '巽', [1, 0, 0, 1, 1, 1], 4, '乾', '震');
  _makeGua('火雷噬嗑', '巽', [1, 0, 0, 1, 0, 1], 5, '离', '震');
  _makeGua('山雷颐', '巽', [1, 0, 0, 0, 0, 1], 4, '艮', '震'); // 游魂
  _makeGua('山风蛊', '巽', [0, 1, 1, 0, 0, 1], 3, '艮', '巽'); // 归魂

  // --- 离宫八卦（八纯卦：101101） ---
  _makeGua('离为火', '离', [1, 0, 1, 1, 0, 1], 6, '离', '离');
  _makeGua('火山旅', '离', [0, 0, 1, 1, 0, 1], 1, '离', '艮'); // 一世
  _makeGua('火风鼎', '离', [0, 1, 1, 1, 0, 1], 2, '离', '巽');
  _makeGua('火水未济', '离', [0, 1, 0, 1, 0, 1], 3, '离', '坎');
  _makeGua('山水蒙', '离', [0, 1, 0, 0, 0, 1], 4, '艮', '坎');
  _makeGua('风水涣', '离', [0, 1, 0, 0, 1, 1], 5, '巽', '坎');
  _makeGua('天水讼', '离', [0, 1, 0, 1, 1, 1], 4, '乾', '坎'); // 游魂
  _makeGua('天火同人', '离', [1, 0, 1, 1, 1, 1], 3, '乾', '离'); // 归魂

  // --- 坤宫八卦（八纯卦：000000） ---
  _makeGua('坤为地', '坤', [0, 0, 0, 0, 0, 0], 6, '坤', '坤');
  _makeGua('地雷复', '坤', [1, 0, 0, 0, 0, 0], 1, '坤', '震');
  _makeGua('地泽临', '坤', [1, 1, 0, 0, 0, 0], 2, '坤', '兑');
  _makeGua('地天泰', '坤', [1, 1, 1, 0, 0, 0], 3, '坤', '乾');
  _makeGua('雷天大壮', '坤', [1, 1, 1, 1, 0, 0], 4, '震', '乾');
  _makeGua('泽天夬', '坤', [1, 1, 1, 1, 1, 0], 5, '兑', '乾');
  _makeGua('水天需', '坤', [1, 1, 1, 0, 1, 0], 4, '坎', '乾'); // 游魂
  _makeGua('水地比', '坤', [0, 0, 0, 0, 1, 0], 3, '坎', '坤'); // 归魂

  // --- 兑宫八卦（八纯卦：110110） ---
  _makeGua('兑为泽', '兑', [1, 1, 0, 1, 1, 0], 6, '兑', '兑');
  _makeGua('泽水困', '兑', [0, 1, 0, 1, 1, 0], 1, '兑', '坎');
  _makeGua('泽地萃', '兑', [0, 0, 0, 1, 1, 0], 2, '兑', '坤');
  _makeGua('泽山咸', '兑', [0, 0, 1, 1, 1, 0], 3, '兑', '艮');
  _makeGua('水山蹇', '兑', [0, 0, 1, 0, 1, 0], 4, '坎', '艮');
  _makeGua('地山谦', '兑', [0, 0, 1, 0, 0, 0], 5, '坤', '艮');
  _makeGua('雷山小过', '兑', [0, 0, 1, 1, 0, 0], 4, '震', '艮'); // 游魂
  _makeGua('雷泽归妹', '兑', [1, 1, 0, 1, 0, 0], 3, '震', '兑'); // 归魂

  // 构建快速查找：六爻阴阳数组 → 卦
  var YAO_TO_GUA = {};
  for (var gi = 0; gi < GUAS.length; gi++) {
    var g = GUAS[gi];
    YAO_TO_GUA[g.yao.join('')] = g;
  }

  /* ========== 四、京房纳甲 ========== */
  // 八宫卦纳甲：从下到上（初爻→上爻）
  var NAJIA_BASE = {
    乾: [
      { gan: '甲', zhi: '子' },
      { gan: '甲', zhi: '寅' },
      { gan: '甲', zhi: '辰' },
      { gan: '壬', zhi: '午' },
      { gan: '壬', zhi: '申' },
      { gan: '壬', zhi: '戌' },
    ],
    坎: [
      { gan: '戊', zhi: '寅' },
      { gan: '戊', zhi: '辰' },
      { gan: '戊', zhi: '午' },
      { gan: '戊', zhi: '申' },
      { gan: '戊', zhi: '戌' },
      { gan: '戊', zhi: '子' },
    ],
    艮: [
      { gan: '丙', zhi: '辰' },
      { gan: '丙', zhi: '午' },
      { gan: '丙', zhi: '申' },
      { gan: '丙', zhi: '戌' },
      { gan: '丙', zhi: '子' },
      { gan: '丙', zhi: '寅' },
    ],
    震: [
      { gan: '庚', zhi: '子' },
      { gan: '庚', zhi: '寅' },
      { gan: '庚', zhi: '辰' },
      { gan: '庚', zhi: '午' },
      { gan: '庚', zhi: '申' },
      { gan: '庚', zhi: '戌' },
    ],
    巽: [
      { gan: '辛', zhi: '丑' },
      { gan: '辛', zhi: '亥' },
      { gan: '辛', zhi: '酉' },
      { gan: '辛', zhi: '未' },
      { gan: '辛', zhi: '巳' },
      { gan: '辛', zhi: '卯' },
    ],
    离: [
      { gan: '己', zhi: '卯' },
      { gan: '己', zhi: '丑' },
      { gan: '己', zhi: '亥' },
      { gan: '己', zhi: '酉' },
      { gan: '己', zhi: '未' },
      { gan: '己', zhi: '巳' },
    ],
    坤: [
      { gan: '乙', zhi: '未' },
      { gan: '乙', zhi: '巳' },
      { gan: '乙', zhi: '卯' },
      { gan: '癸', zhi: '丑' },
      { gan: '癸', zhi: '亥' },
      { gan: '癸', zhi: '酉' },
    ],
    兑: [
      { gan: '丁', zhi: '巳' },
      { gan: '丁', zhi: '卯' },
      { gan: '丁', zhi: '丑' },
      { gan: '丁', zhi: '亥' },
      { gan: '丁', zhi: '酉' },
      { gan: '丁', zhi: '未' },
    ],
  };

  function getNajia(gua) {
    return NAJIA_BASE[gua.gong];
  }

  /* ========== 五、六亲规则 ========== */
  function getLiuQin(gua) {
    var gongWx = GONG_WUXING[gua.gong];
    var najia = getNajia(gua);
    var result = [];
    for (var i = 0; i < 6; i++) {
      result.push(_wxRelation(gongWx, ZHI_WUXING[najia[i].zhi]));
    }
    return result;
  }

  function _wxRelation(wo, ta) {
    if (wo === ta) return '兄弟';
    // 生我者父母：水生木、木生火、火生土、土生金、金生水
    if (
      (wo === '木' && ta === '水') ||
      (wo === '火' && ta === '木') ||
      (wo === '土' && ta === '火') ||
      (wo === '金' && ta === '土') ||
      (wo === '水' && ta === '金')
    )
      return '父母';
    // 我生者子孙：木生火、火生土、土生金、金生水、水生木
    if (
      (wo === '木' && ta === '火') ||
      (wo === '火' && ta === '土') ||
      (wo === '土' && ta === '金') ||
      (wo === '金' && ta === '水') ||
      (wo === '水' && ta === '木')
    )
      return '子孙';
    // 克我者官鬼：金克木、水克火、木克土、火克金、土克水
    if (
      (wo === '木' && ta === '金') ||
      (wo === '火' && ta === '水') ||
      (wo === '土' && ta === '木') ||
      (wo === '金' && ta === '火') ||
      (wo === '水' && ta === '土')
    )
      return '官鬼';
    // 我克者妻财
    return '妻财';
  }

  /* ========== 六、六兽规则 ========== */
  function getLiuShou(riGan) {
    var start = GAN_LIUSHOU[riGan] || '青龙';
    var startIdx = LIUSHOU_ORDER.indexOf(start);
    var result = [];
    for (var i = 0; i < 6; i++) {
      result.push(LIUSHOU_ORDER[(startIdx + i) % 6]);
    }
    return result;
  }

  /* ========== 七、变卦规则 ========== */
  function getChangedGua(originalGua, dongYao) {
    if (!dongYao || dongYao.length === 0) return null;
    var newYao = originalGua.yao.slice();
    for (var i = 0; i < dongYao.length; i++) {
      var idx = dongYao[i] - 1;
      newYao[idx] = newYao[idx] === 1 ? 0 : 1;
    }
    var key = newYao.join('');
    var changed = YAO_TO_GUA[key];
    if (!changed) return null;
    return { name: changed.name, yao: newYao, dong_yao: dongYao };
  }

  /* ========== 八、解读生成 ========== */
  function generateInterpretation(gua, dongYao, shiYao, yingYao, liuQin, liuShou, changedGua) {
    var parts = [];
    var gong = gua.gong;
    var gongWx = GONG_WUXING[gong];

    // 1. 卦象总览
    parts.push('【卦象总览】');
    parts.push('本卦「' + gua.name + '」，属' + gong + '宫' + gongWx + '卦。');
    parts.push(
      '上卦' + gua.upper + '为' + BA_GUA[gua.upper].xiang + '，下卦' + gua.lower + '为' + BA_GUA[gua.lower].xiang + '。'
    );

    var xiangDesc = _getXiangDesc(gua);
    if (xiangDesc) parts.push(xiangDesc);

    if (changedGua) {
      parts.push('动变之卦为「' + changedGua.name + '」，主事有变动之象。');
    } else {
      parts.push('六爻安静，主事态平稳，宜守不宜攻。');
    }

    // 2. 世应分析
    parts.push('');
    parts.push('【世应分析】');
    parts.push('世爻居第' + shiYao + '爻（' + _yaoPositionName(shiYao) + '），为占者自身之位；');
    parts.push('应爻居第' + yingYao + '爻（' + _yaoPositionName(yingYao) + '），为所占之事或他人之位。');

    var shiLiuQin = liuQin[shiYao - 1];
    parts.push('世爻临' + shiLiuQin + '，主' + _shiLiuQinDesc(shiLiuQin) + '。');

    // 3. 动爻分析
    if (dongYao && dongYao.length > 0) {
      parts.push('');
      parts.push('【动爻分析】');
      for (var di = 0; di < dongYao.length; di++) {
        var dy = dongYao[di];
        var dyQin = liuQin[dy - 1];
        var dyShou = liuShou[dy - 1];
        parts.push('第' + dy + '爻（' + _yaoPositionName(dy) + '）动，临' + dyQin + '，值' + dyShou + '。');
        parts.push('  → ' + _dongYaoDesc(dyQin, dyShou));
      }
    }

    // 4. 六亲布局
    parts.push('');
    parts.push('【六亲布局】');
    parts.push('六爻六亲：' + liuQin.join('、') + '。');
    var qinCount = {};
    for (var qi = 0; qi < liuQin.length; qi++) {
      qinCount[liuQin[qi]] = (qinCount[liuQin[qi]] || 0) + 1;
    }
    var qinSummary = [];
    for (var qk in qinCount) {
      if (qinCount.hasOwnProperty(qk)) {
        qinSummary.push(qk + '现' + qinCount[qk] + '处');
      }
    }
    parts.push(qinSummary.join('，') + '。');

    // 5. 六兽提示
    parts.push('');
    parts.push('【六兽提示】');
    parts.push('六爻六兽：' + liuShou.join('、') + '。');
    var shiShou = liuShou[shiYao - 1];
    parts.push('世爻值' + shiShou + '，' + _liuShouDesc(shiShou));

    // 6. 综合断语
    parts.push('');
    parts.push('【综合断语】');
    parts.push(_getJudgment(gua, dongYao, shiYao, liuQin, changedGua, liuShou, yingYao));

    // 7. 建议
    parts.push('');
    parts.push('【行事建议】');
    parts.push(_getAdvice(gua, dongYao, shiYao, liuQin, liuShou, yingYao, changedGua));

    return parts.join('\n');
  }

  function _yaoPositionName(pos) {
    var names = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    return names[pos - 1] || '第' + pos + '爻';
  }

  function _shiLiuQinDesc(qin) {
    var map = {
      父母: '占者操心劳碌，或与文书、长辈、房屋之事相关',
      官鬼: '占者临事有压力，或与功名、官司、疾病相关',
      兄弟: '占者易有竞争、破财之象，宜团结同道',
      妻财: '占者利求财，或与妻妾、财物、饮食之事相关',
      子孙: '占者心态轻松，利解忧、娱乐、投资之事',
    };
    return map[qin] || '占者临' + qin;
  }

  function _dongYaoDesc(qin, shou) {
    var descs = [];
    if (qin === '官鬼') descs.push('官鬼动主事业有变，或有官方文书、职位变动之兆');
    if (qin === '妻财') descs.push('财爻动主财运波动，宜把握时机，忌贪心冒进');
    if (qin === '父母') descs.push('父爻动主文书契约之事，或有长辈消息，宜谨慎处理文书');
    if (qin === '子孙') descs.push('子孙动主忧愁消散，有解厄之象，利长远规划');
    if (qin === '兄弟') descs.push('兄弟动主竞争加剧，需防破财，宜合作共赢');
    if (shou === '青龙') descs.push('青龙临动，主喜庆之事，吉兆明显');
    if (shou === '白虎') descs.push('白虎临动，主凶险急促，需防意外伤灾');
    if (shou === '玄武') descs.push('玄武临动，主暗昧之事，需防小人暗算或盗窃');
    if (shou === '朱雀') descs.push('朱雀临动，主口舌是非，宜谨言慎行');
    return descs.join('；') || '此爻动而待察，需结合具体事体判断。';
  }

  function _liuShouDesc(shou) {
    var map = {
      青龙: '主喜庆、酒色、生育之喜，吉神临位，诸事顺遂。',
      朱雀: '主口舌、文书、火灾，需防是非争执，宜谨言慎行。',
      勾陈: '主田土、牢狱、迟滞，事多牵延，需耐心应对。',
      螣蛇: '主虚惊、怪异、梦寐，事多诡异，需保持清醒。',
      白虎: '主凶丧、血光、疾病，凶神临位，宜多加小心。',
      玄武: '主盗贼、暗昧、隐私，需防小人暗算，守正为要。',
    };
    return map[shou] || '';
  }

  function _getXiangDesc(gua) {
    var map = {
      乾为天: '六龙御天之象，纯阳至健，主刚健不息，宜积极进取。',
      坤为地: '厚德载物之象，纯阴至顺，主柔顺包容，宜以静制动。',
      水雷屯: '万物始生之象，万事开头难，宜坚定信心，不可轻言放弃。',
      山水蒙: '童蒙求我之象，主蒙昧待启，宜虚心求教，不可自作聪明。',
      水天需: '待时之象，主需等待时机，不宜急进，守正待时。',
      天水讼: '争讼之象，主口舌是非，宜退一步海阔天空。',
      地水师: '出师征伐之象，主竞争对抗，宜师出有名。',
      水地比: '亲附和合之象，主人际关系和谐，宜团结协作。',
      风天小畜: '小有积蓄之象，力量未充，宜蓄势待发。',
      天泽履: '如履薄冰之象，主谨慎行事，守规矩则吉。',
      地天泰: '天地交泰之象，通泰和畅，万事亨通。',
      天地否: '天地不交之象，阻塞不通，宜守正待时。',
      天火同人: '与人同心之象，主志同道合，利合作。',
      火天大有: '大获所有之象，丰收富足，诸事圆满。',
      地山谦: '谦逊退让之象，谦虚受益，骄傲招损。',
      雷地豫: '愉悦安乐之象，宜顺势而为，不可放纵。',
      泽雷随: '随从顺应之象，宜随机应变，不可固执。',
      山风蛊: '腐败生虫之象，主积弊待除，宜革新整顿。',
      地泽临: '临下监察之象，主事在眼前，宜积极面对。',
      风地观: '观仰展示之象，宜观察形势，审时度势。',
      火雷噬嗑: '咬合刑罚之象，主有阻碍需强力突破。',
      山火贲: '文饰美化之象，外华内实，宜内外兼修。',
      山地剥: '剥落衰败之象，宜顺时止损，不可逆势。',
      地雷复: '一阳来复之象，生机重现，宜把握转机。',
      天雷无妄: '真实无妄之象，宜守正，不可妄动。',
      山天大畜: '大有积蓄之象，力量充盈，宜厚积薄发。',
      山雷颐: '颐养之象，宜养精蓄锐，注意饮食养生。',
      泽风大过: '大过之象，事有过当，宜纠偏归正。',
      坎为水: '重重险陷之象，宜守正，以诚感人。',
      离为火: '光明依附之象，宜依附正道，明辨是非。',
      泽山咸: '感应之象，主男女感情，宜真诚相待。',
      雷风恒: '恒久之象，宜持之以恒，不可半途而废。',
      天山遁: '退避之象，宜知进退，适时隐退。',
      雷天大壮: '强壮之象，宜守正，不可恃强凌弱。',
      火地晋: '晋升之象，宜积极进取，步步高升。',
      地火明夷: '光明受伤之象，宜韬光养晦，隐忍待时。',
      风火家人: '家道之象，宜修身齐家，和睦相处。',
      火泽睽: '乖离之象，宜求同存异，化解分歧。',
      水山蹇: '艰难之象，宜知难而退或迂回前进。',
      雷水解: '解脱之象，困难化解，宜把握时机。',
      山泽损: '损下益上之象，宜舍小利求大局。',
      风雷益: '益下之象，宜惠及他人，利人利己。',
      泽天夬: '决断之象，宜果断决策，不可犹豫。',
      天风姤: '不期而遇之象，宜随机应变，防微杜渐。',
      泽地萃: '聚集之象，宜汇聚力量，团结共进。',
      地风升: '上升之象，宜顺势而上，步步为营。',
      泽水困: '困厄之象，宜坚守正道，待时解脱。',
      水风井: '井养之象，宜养人利物，不可废弃。',
      泽火革: '变革之象，宜顺应时势，革故鼎新。',
      火风鼎: '鼎新之象，宜革故鼎新，除旧布新。',
      震为雷: '震动之象，宜临危不乱，镇定自若。',
      艮为山: '静止之象，宜知止不殆，适可而止。',
      风山渐: '渐进之象，宜循序渐进，不可急躁。',
      雷泽归妹: '婚嫁之象，宜慎重选择，不可草率。',
      雷火丰: '丰大之象，宜居安思危，戒奢以俭。',
      火山旅: '旅居在外之象，宜随遇而安，谨慎行事。',
      巽为风: '顺从之象，宜谦逊柔顺，顺势而为。',
      兑为泽: '喜悦之象，宜以和为贵，诚信待人。',
      风水涣: '涣散之象，宜凝聚人心，防止分离。',
      水泽节: '节制之象，宜知节知度，不可放纵。',
      风泽中孚: '诚信之象，宜以诚待人，信守承诺。',
      雷山小过: '小有过越之象，宜小处注意，大处着眼。',
      水火既济: '事已成之象，宜守成防变，居安思危。',
      火水未济: '事未成之象，宜继续努力，不可半途而废。',
    };
    return map[gua.name] || '';
  }

  function _getJudgment(gua, dongYao, shiYao, liuQin, changedGua, liuShou, yingYao) {
    var parts = [];
    var shiQin = liuQin[shiYao - 1];
    var yingQin = yingYao ? liuQin[yingYao - 1] : '';
    var shiShou = liuShou ? liuShou[shiYao - 1] : '';
    var dongCount = dongYao ? dongYao.length : 0;

    // ===== 第一层：世爻核心分析（含双面视角） =====
    parts.push('【世爻核心】');
    var shiJudgments = {
      妻财: {
        yang: '世爻临财，以财为尊。得财之象，求财有利，经营得法，物质丰足，财运亨通',
        yin: '财多易生贪念，若财爻被克或动而化退，则需防破财、投资失利；财旺身弱，反受其累',
        transform: '以财养身而非以身殉财——赚钱为生活服务，而非生活为赚钱服务',
        timing: '财星旺时宜积极经营、把握机遇；财星弱时宜守成为主、减少风险投资',
      },
      官鬼: {
        yang: '世爻临官，事业心强，责任感重，有上进心，得权得位，约束之下出成果',
        yin: '压力过大伤身伤心，需防官非口舌、职场斗争；若官鬼动而化进，变动剧烈，需做好心理准备',
        transform: '化压力为阶梯——接受必要的约束但守住底线，在规则内找到突破口',
        timing: '官鬼旺时宜守规矩、尽职责、积累资历；过旺时宜暂避锋芒、关注健康',
      },
      父母: {
        yang: '世爻临父，以文书学业为重。利于考试、签约、文书之事；得长辈庇护，贵人相助',
        yin: '操劳费神，文书之事易有反复；若父爻过旺则思虑过多、行动力不足，易陷入纸上谈兵',
        transform: '借力而不依赖——善用文书和长辈资源，但保持独立判断和行动力',
        timing: '父爻旺时宜学习进修、处理文书签约；过旺时宜减少思虑、多做少想',
      },
      子孙: {
        yang: '世爻临子，心态轻松豁达。解忧消灾，利于投资、娱乐、创意之事；灵感丰富，思虑通达',
        yin: '若过于安逸则缺乏进取心，需防"乐不思蜀"而耽误正事；重大决策时易因乐观而低估风险',
        transform: '用轻松心态做长远规划——逍遥而不放纵，自由而有方向',
        timing: '子孙旺时宜投资、创作、放松身心；过旺时宜增加行动力、设定明确目标',
      },
      兄弟: {
        yang: '世爻临兄，以人际为关键。得朋友同辈之助，团结力量大，利于合作共赢；人脉资源丰富',
        yin: '竞争激烈，需防因利益分配不均而反目；若兄爻动而克财，则需防破财、合伙纠纷',
        transform: '合而不争——选择志同道合者合作，明确权责利，避免利益不清',
        timing: '比劫旺时宜合作、社交、拓展人脉；过旺时宜独立行动、保护核心利益',
      },
    };
    var shiJ = shiJudgments[shiQin] || {
      yang: '世爻临' + shiQin,
      yin: '需留意相关风险',
      transform: '趋吉避凶，顺势而为',
      timing: '宜守正待时',
    };
    parts.push('吉面：' + shiJ.yang + '。');
    parts.push('凶面：' + shiJ.yin + '。');
    parts.push('转化：' + shiJ.transform + '。');
    parts.push('时机：' + shiJ.timing + '。');

    // 世应关系分析
    if (yingQin) {
      parts.push('');
      parts.push('【世应博弈】');
      var shiYingPair = shiQin + '（世） vs ' + yingQin + '（应）';
      if (shiQin === yingQin) {
        parts.push(
          '世应同临' +
            shiQin +
            '——内外一致，自身与外部环境同频共振。吉面：目标明确，内外统一；凶面：易陷入单一视角，需警惕"同声相应"带来的盲区。'
        );
      } else if ((shiQin === '妻财' && yingQin === '官鬼') || (shiQin === '官鬼' && yingQin === '妻财')) {
        parts.push(
          shiYingPair +
            '——财官相生，事业与财富相互促进。吉面：以事业带财富或以财富助事业；凶面：需防"财官两旺"导致的精力分散。'
        );
      } else if ((shiQin === '子孙' && yingQin === '官鬼') || (shiQin === '官鬼' && yingQin === '子孙')) {
        parts.push(
          shiYingPair +
            '——【冲突信号】福神与官鬼相克，事业压力与逍遥心态矛盾。吉面：在压力中保持轻松心态；凶面：过于放松可能错失良机，过于紧张则身心俱疲。'
        );
      } else if ((shiQin === '兄弟' && yingQin === '妻财') || (shiQin === '妻财' && yingQin === '兄弟')) {
        parts.push(
          shiYingPair +
            '——【冲突信号】兄爻克财，竞争与财富并存。吉面：合作可分利共赢；凶面：需防因利益分配或朋友借贷导致破财。'
        );
      } else if ((shiQin === '父母' && yingQin === '子孙') || (shiQin === '子孙' && yingQin === '父母')) {
        parts.push(
          shiYingPair +
            '——【冲突信号】文书之劳与逍遥之心矛盾。吉面：在规则中保持灵活；凶面：思虑过多阻碍行动，或行动过多忽视规划。'
        );
      } else {
        parts.push(shiYingPair + '——内外关系需综合判断。世为内、应为外，关注两者之间的生克关系和所在爻位。');
      }
    }

    // ===== 第二层：动爻组合分析 =====
    parts.push('');
    parts.push('【动爻格局】');
    if (dongCount === 1) {
      var dyPos = dongYao[0];
      var dyQin = liuQin[dyPos - 1];
      var dyShou = liuShou ? liuShou[dyPos - 1] : '';
      parts.push(
        '一爻独动（第' + dyPos + '爻，临' + dyQin + (dyShou ? '·' + dyShou : '') + '），事态明朗，此爻为全局关键。'
      );

      // 动爻与世爻的交叉分析
      if (dyPos === shiYao) {
        parts.push('动爻即为世爻——变化由您自身引发，主动权在您手中。吉面：可控可调；凶面：成败皆系于己，责任重大。');
      } else if (dyPos === yingYao) {
        parts.push(
          '动爻即为应爻——变化来自外部环境或对方，非您所能完全控制。吉面：顺势而为；凶面：被动应对，需灵活应变。'
        );
      }

      // 动爻六亲与世爻六亲的交叉
      if (dyQin === '妻财' && shiQin === '兄弟') {
        parts.push(
          '【核心冲突】财爻动而世临兄弟——求财之心与竞争之实并存。趋吉：合作分利而非独占，选择可靠的合伙人；避凶：避免因利益分配不均而引发矛盾，谨慎为他人担保。'
        );
      } else if (dyQin === '官鬼' && shiQin === '子孙') {
        parts.push(
          '【核心冲突】官鬼动而世临子孙——事业压力与安逸心态冲突。趋吉：在轻松中保持进取，利用创造力化解压力；避凶：避免因过于放松而错失良机。'
        );
      } else if (dyQin === '子孙' && shiQin === '官鬼') {
        parts.push(
          '【核心冲突】子孙动而世临官鬼——福神解忧之力化解事业压力。趋吉：利用创意和轻松心态化解职场难题；避凶：不要因"解忧"而完全放弃责任。'
        );
      } else if (dyQin === '父母' && shiQin === '子孙') {
        parts.push(
          '【核心冲突】父爻动而世临子孙——文书之劳与逍遥之心矛盾。趋吉：重要文书之事委托他人或设定明确截止日期；避凶：避免因拖延而导致文书纠纷。'
        );
      }

      // 六兽提示
      if (dyShou === '白虎') {
        parts.push('白虎临动爻——事态急迫，吉凶快速显现。趋吉：果断决策，快速行动；避凶：需防意外之灾，行事多加小心。');
      } else if (dyShou === '青龙') {
        parts.push('青龙临动爻——喜庆之兆，吉事将至。趋吉：把握时机，扩大成果；避凶：不可因顺利而麻痹大意。');
      } else if (dyShou === '玄武') {
        parts.push('玄武临动爻——暗昧之事，需防小人。趋吉：暗中布局，以智取胜；避凶：谨防盗窃、欺诈、隐私泄露。');
      }
    } else if (dongCount === 2) {
      parts.push('二爻齐动，事有两端，需权衡轻重。关注两爻之间的关系——若相生则顺，若相克则需调和。');
      // 二爻交叉分析
      var dy1 = dongYao[0],
        dy2 = dongYao[1];
      var q1 = liuQin[dy1 - 1],
        q2 = liuQin[dy2 - 1];
      if ((q1 === '妻财' && q2 === '官鬼') || (q1 === '官鬼' && q2 === '妻财')) {
        parts.push(
          '财官二爻齐动——事业与财富双重变化。趋吉：财官相生，事业带财或财助事业；避凶：精力分散，需明确主次。'
        );
      } else if ((q1 === '子孙' && q2 === '官鬼') || (q1 === '官鬼' && q2 === '子孙')) {
        parts.push(
          '【冲突信号】子孙与官鬼二爻齐动——福祸相依，矛盾交织。趋吉：在变化中找到平衡点；避凶：避免在两个极端之间摇摆不定。'
        );
      }
    } else if (dongCount >= 3) {
      parts.push('三爻以上俱动（' + dongCount + '爻动），事态复杂多变。不宜轻举妄动，以静制动，观其变而后应。');
      parts.push('多爻齐动时，关注世爻是否在其中——世爻动则主动权在己，世爻静则需应对外部变化。');
    } else {
      parts.push('六爻安静，事态稳定。宜守不宜攻，静观其变。此时不宜做重大决策，维持现状为上策。');
      parts.push('静卦之中，世应关系为全局关键——世爻代表您的状态，应爻代表外部环境，两者力量对比决定吉凶。');
    }

    // ===== 第三层：变卦指引 =====
    if (changedGua) {
      parts.push('');
      parts.push('【变卦指引】');
      parts.push('之卦为「' + changedGua.name + '」，主此事最终走向：' + _quickGuaDesc(changedGua.name) + '。');
      if (gua.name === changedGua.name) {
        parts.push(
          '本卦与之卦相同——事态虽有变动但终归原位。吉面：方向正确，坚持即可；凶面：可能原地踏步，需审视是否方法有误。'
        );
      }
    }

    // ===== 第四层：六兽世爻综合 =====
    if (shiShou) {
      parts.push('');
      parts.push('【六兽加持】');
      parts.push('世爻值' + shiShou + '——' + _liuShouDesc(shiShou));
      var shouAdvice = {
        青龙: '宜借喜庆之势推进重要事务，但需防乐极生悲。',
        朱雀: '宜发挥口才与表达能力，但谨言慎行，避免口舌是非。',
        勾陈: '宜稳扎稳打，不急不躁。牵延之事耐心应对，终有结果。',
        螣蛇: '宜保持清醒，不轻信表象。诡异之事多观察、少行动。',
        白虎: '宜果断利落，但也需多加小心。急事缓办，大事化小。',
        玄武: '宜暗中观察、以智取胜。守正为要，不参与暗昧之事。',
      };
      if (shouAdvice[shiShou]) {
        parts.push('趋吉避凶：' + shouAdvice[shiShou]);
      }
    }

    return parts.join('\n');
  }

  function _quickGuaDesc(name) {
    var map = {
      乾为天: '顺利通达',
      坤为地: '包容顺遂',
      水雷屯: '艰难初创',
      山水蒙: '启蒙待发',
      水天需: '等待时机',
      天水讼: '有争讼',
      地水师: '竞争激烈',
      水地比: '亲和团结',
      风天小畜: '小有成效',
      天泽履: '谨慎前行',
      地天泰: '亨通顺利',
      天地否: '阻滞不通',
      天火同人: '志同道合',
      火天大有: '大获丰收',
      地山谦: '谦逊受益',
      雷地豫: '愉悦顺利',
      泽雷随: '顺势而为',
      山风蛊: '整顿革新',
      地泽临: '亲临其事',
      风地观: '观察等待',
      火雷噬嗑: '突破阻碍',
      山火贲: '外华内实',
      山地剥: '衰败止损',
      地雷复: '转机重现',
      天雷无妄: '守正得吉',
      山天大畜: '厚积薄发',
      山雷颐: '养精蓄锐',
      泽风大过: '纠偏归正',
      坎为水: '有险阻',
      离为火: '光明依附',
      泽山咸: '感应和合',
      雷风恒: '持之以恒',
      天山遁: '退避得吉',
      雷天大壮: '强盛得势',
      火地晋: '步步高升',
      地火明夷: '韬光养晦',
      风火家人: '家和事兴',
      火泽睽: '求同存异',
      水山蹇: '艰难曲折',
      雷水解: '困难化解',
      山泽损: '损小利大',
      风雷益: '利人利己',
      泽天夬: '果断决策',
      天风姤: '意外遇合',
      泽地萃: '汇聚力量',
      地风升: '逐步上升',
      泽水困: '困厄待解',
      水风井: '养人利物',
      泽火革: '变革图新',
      火风鼎: '革故鼎新',
      震为雷: '震动不安',
      艮为山: '适可而止',
      风山渐: '循序渐进',
      雷泽归妹: '慎重抉择',
      雷火丰: '丰盛防衰',
      火山旅: '谨慎行事',
      巽为风: '顺势而为',
      兑为泽: '喜悦和合',
      风水涣: '凝聚人心',
      水泽节: '节制有度',
      风泽中孚: '诚信得吉',
      雷山小过: '小处谨慎',
      水火既济: '守成防变',
      火水未济: '继续努力',
    };
    return map[name] || '有所变化';
  }

  function _getAdvice(gua, dongYao, shiYao, liuQin, liuShou, yingYao, changedGua) {
    var shiQin = liuQin[shiYao - 1];
    var yingQin = yingYao ? liuQin[yingYao - 1] : '';
    var shiShou = liuShou ? liuShou[shiYao - 1] : '';
    var dongCount = dongYao ? dongYao.length : 0;
    var advices = [];

    // ===== 针对世爻的趋吉避凶建议 =====
    advices.push('【针对世爻' + shiQin + '的趋吉避凶】');
    var shiAdvices = {
      妻财: [
        '趋吉：把握财运机会，积极经营，但需见好就收，忌贪。定期做财务复盘，设置消费上限。',
        '避凶：避免冲动投资、为他人担保；大额支出需三思；分散投资，不把所有鸡蛋放一个篮子。',
        '关键：以财养身——赚钱是为生活服务，而非生活为赚钱服务。',
      ],
      官鬼: [
        '趋吉：化压力为动力，在工作中展现能力，积累资历。将压力转化为可量化的成果。',
        '避凶：注意劳逸结合，身体是事业的基础；避免卷入办公室政治；定期体检，关注健康信号。',
        '关键：在规则内找到突破口——接受必要的约束，但守住自己的底线。',
      ],
      父母: [
        '趋吉：细心处理文书契约，凡事留书面记录；利于学习考试，把握进修机会。',
        '避凶：避免过度操劳，重要文件做好备份；不要同时处理太多文书事务；减少不必要的思虑。',
        '关键：借力而不依赖——善用文书和长辈资源，但保持独立判断。',
      ],
      子孙: [
        '趋吉：利用心态优势做长远规划，投资学习与健康；创意灵感丰富时及时记录和执行。',
        '避凶：不要让安逸变成懒惰，保持适度的紧迫感；重大决策时多听取他人意见，不凭感觉做决定。',
        '关键：逍遥而不放纵——自由而有方向，轻松但有效率。',
      ],
      兄弟: [
        '趋吉：团结志同道合者，合作共赢；社交带来机会，将人脉转化为资源。',
        '避凶：合作时明确权责利，书面约定；不要轻易借钱或合伙投资；利益分配提前谈清楚。',
        '关键：合而不争——选择对的人合作，明确规则，避免利益不清。',
      ],
    };
    var sa = shiAdvices[shiQin] || [
      '趋吉：顺势而为，把握机遇。',
      '避凶：谨慎行事，避免风险。',
      '关键：趋吉避凶，天道酬勤。',
    ];
    advices.push(sa[0]);
    advices.push(sa[1]);
    advices.push(sa[2]);

    // ===== 世应关系建议 =====
    if (yingQin && yingQin !== shiQin) {
      advices.push('');
      advices.push('【世应调和】');
      if ((shiQin === '妻财' && yingQin === '兄弟') || (shiQin === '兄弟' && yingQin === '妻财')) {
        advices.push(
          '世应财兄相克——核心矛盾在"钱"与"人"。建议：① 合作时明确权责利，书面约定；② 不因朋友关系而放松财务纪律；③ 合理分配利益，避免"兄弟反目"。'
        );
      } else if ((shiQin === '官鬼' && yingQin === '子孙') || (shiQin === '子孙' && yingQin === '官鬼')) {
        advices.push(
          '世应官子相克——核心矛盾在"压力"与"自由"。建议：① 在压力中保持轻松心态，不被焦虑控制；② 过于安逸时主动给自己设定挑战；③ 找到事业与生活的平衡点。'
        );
      } else if ((shiQin === '父母' && yingQin === '妻财') || (shiQin === '妻财' && yingQin === '父母')) {
        advices.push(
          '世应父财相克——核心矛盾在"文书/知识"与"财富"。建议：① 以知识生财，将专业技能转化为收入；② 投资自己（学习）是回报率最高的投资；③ 避免因追求财富而忽视文书和法律风险。'
        );
      }
    }

    // ===== 针对动爻的建议 =====
    advices.push('');
    advices.push('【动爻应对】');
    if (dongCount === 1) {
      var dyQin = liuQin[dongYao[0] - 1];
      advices.push('一爻独动——专注此爻所示方向即可。事在变动之中，宜灵活应变，不可固执己见。');
      if (dongYao[0] === shiYao) {
        advices.push('动爻即世爻——主动权在您手中，果断决策，但需承担相应责任。');
      } else if (dongYao[0] === yingYao) {
        advices.push('动爻即应爻——外部环境在变，您需要适应而非对抗。顺势而为，以柔克刚。');
      }
    } else if (dongCount === 2) {
      advices.push(
        '二爻齐动——两件事同时在变化，建议：① 分清主次，先解决最关键的动爻问题；② 关注两爻之间的生克关系，尽量让它们"相生"而非"相克"。'
      );
    } else if (dongCount >= 3) {
      advices.push(
        '多爻齐动，局势复杂。建议：① 不宜同时推进多个方向，聚焦一处；② 以静制动，观察变化后再决策；③ 重大事项暂缓，待局势明朗。'
      );
    } else {
      advices.push('静卦策略——当前宜静不宜动。守正待时，积蓄力量，等待有利时机再行动。');
      advices.push(
        '静卦不等于"什么都不做"，而是"做该做的事，不做冒险的事"。日常积累、学习、维护关系都是静卦中的"正事"。'
      );
    }

    // ===== 六兽行动建议 =====
    if (shiShou) {
      advices.push('');
      advices.push('【六兽行动指南】');
      var actionMap = {
        青龙: '青龙主喜庆——宜：推进重要项目、签约、举办活动；忌：得意忘形，过度消费。',
        朱雀: '朱雀主口舌——宜：发挥口才，演讲、谈判、写作；忌：与人争执，轻信谣言。',
        勾陈: '勾陈主迟滞——宜：稳扎稳打，耐心处理积压事务；忌：急于求成，频繁变动。',
        螣蛇: '螣蛇主诡异——宜：多观察、少行动，保持清醒头脑；忌：轻信他人，做重大决策。',
        白虎: '白虎主凶险——宜：果断决策，快速行动，加强安全防范；忌：拖延、冒险、忽视健康。',
        玄武: '玄武主暗昧——宜：暗中准备，以智取胜，加强信息安全；忌：参与不明之事，轻信陌生人。',
      };
      if (actionMap[shiShou]) {
        advices.push(actionMap[shiShou]);
      }
    }

    // ===== 变卦行动建议 =====
    if (changedGua && changedGua.name !== gua.name) {
      advices.push('');
      advices.push('【变卦应对】');
      advices.push(
        '之卦「' + changedGua.name + '」提示最终方向。建议提前了解' + changedGua.name + '卦德，为最终结果做好准备。'
      );
      var changedAdvice = {
        乾为天: '最终走向刚健通达——保持积极进取，但需防刚愎自用。',
        坤为地: '最终走向柔顺包容——顺势而为，以柔克刚，厚德载物。',
        地天泰: '最终走向亨通——坚持就是胜利，但需防乐极生悲。',
        天地否: '最终走向阻滞——不必强求，暂时退守也是一种智慧。',
        水火既济: '最终走向成功——守成防变，居安思危，不可松懈。',
        火水未济: '最终尚未完成——继续努力，调整方法，不可半途而废。',
      };
      if (changedAdvice[changedGua.name]) {
        advices.push(changedAdvice[changedGua.name]);
      }
    }

    // ===== 通用心法 =====
    advices.push('');
    advices.push(
      '【心法】占卜为镜，照见的是当下的趋势与可能。吉非纯吉，凶非纯凶。最终的决策权在自己手中——天道酬勤，人事为本，卦象为参考而非宿命。'
    );

    return advices.join('\n');
  }

  /* ========== 九、公开API ========== */

  /**
   * 六爻起卦
   * @param {Array} lines - 6个爻，从下到上，每个 { type: "yang"|"yin", changing: boolean }
   * @returns {Object} 卦象结果
   */
  /**
   * 计算卦象吉凶分数（0-100）
   * 基于：卦象本质 + 世应关系 + 动爻 + 六亲分布
   */
  function calculateScore(gua, dongYao, shiYao, yingYao, liuQin, liuShou, changedGua) {
    var score = 50; // 基准分

    // 1. 卦象本质吉凶（64卦吉凶权重）
    var guaFortune = {
      // 大吉卦
      '天地否': 75, '地天泰': 85, '雷水解': 72, '水雷屯': 68,
      '风雷益': 78, '火雷噬嗑': 65, '山雷颐': 70,
      '天雷无妄': 73, '火天大有': 82, '山天大畜': 75,
      '火泽睽': 55, '泽天夬': 68, '雷泽归妹': 60,
      // 大凶卦
      '地火明夷': 35, '火地晋': 58, '山火贲': 62,
      '天水讼': 42, '火天同人': 68, '地天泰': 85,
      '泽天夬': 68, '天泽履': 70, '风天小畜': 65,
      // 中性卦
      '坎为水': 45, '离为火': 55, '震为雷': 60, '巽为风': 58,
      '艮为山': 50, '兑为泽': 62, '坤为地': 48, '乾为天': 72,
    };
    score += (guaFortune[gua.name] || 50) - 50;

    // 2. 世爻六亲加分/减分
    var shiQin = liuQin[shiYao - 1] || '';
    if (shiQin === '子孙') score += 8;      // 子孙持世，解忧之神
    else if (shiQin === '妻财') score += 5; // 妻财持世，财运主动
    else if (shiQin === '官鬼') score -= 5; // 官鬼持世，压力在身
    else if (shiQin === '兄弟') score -= 3; // 兄弟持世，竞争破财
    else if (shiQin === '父母') score += 2; // 父母持世，文书有利

    // 3. 动爻分析
    if (dongYao.length > 0) {
      for (var di = 0; di < dongYao.length; di++) {
        var d = dongYao[di];
        var dQin = liuQin[d - 1] || '';
        if (d === shiYao) {
          // 世爻动
          if (dQin === '子孙') score += 6;
          else if (dQin === '妻财') score += 4;
          else if (dQin === '官鬼') score -= 4;
        } else if (d === yingYao) {
          // 应爻动
          if (dQin === '子孙') score += 3;
          else if (dQin === '官鬼') score -= 3;
        } else {
          // 其他爻动
          if (dQin === '子孙') score += 2;
          else if (dQin === '官鬼') score -= 2;
        }
      }
    }

    // 4. 世应关系
    var dist = Math.abs(shiYao - yingYao);
    if (dist === 1 || dist === 5) score += 5;      // 世应相邻，助力
    else if (dist >= 3) score -= 3;                 // 世应相隔，阻力

    // 5. 变卦影响
    if (changedGua) {
      var changedFortune = guaFortune[changedGua.name] || 50;
      if (changedFortune > 60) score += 5;
      else if (changedFortune < 45) score -= 5;
    }

    // 6. 六亲数量平衡
    var qinCount = {};
    for (var qi = 0; qi < 6; qi++) {
      var q = liuQin[qi];
      qinCount[q] = (qinCount[q] || 0) + 1;
    }
    var maxCount = Math.max.apply(null, Object.keys(qinCount).map(function(k) { return qinCount[k]; }));
    if (maxCount >= 3) score -= 3;  // 某六亲过多，偏颇

    // 限制分数范围
    return Math.max(0, Math.min(100, score));
  }

  /**
   * 根据分数计算趋势
   */
  function calculateTrend(score) {
    if (score >= 65) return 'up';
    if (score <= 35) return 'down';
    return 'neutral';
  }

  function divine(lines) {
    if (!lines || lines.length !== 6) {
      throw new Error('六爻起卦需要6个爻，从下到上排列');
    }

    var yao = [];
    var dongYao = [];
    for (var i = 0; i < 6; i++) {
      var line = lines[i];
      var isYang = line.type === 'yang' ? 1 : 0;
      yao.push(isYang);
      if (line.changing) {
        dongYao.push(i + 1);
      }
    }

    var yaoKey = yao.join('');
    var gua = YAO_TO_GUA[yaoKey];
    if (!gua) {
      throw new Error('未找到匹配的卦象：' + yaoKey);
    }

    var shiYao = gua.shi;
    var yingYao = shiYao + 3;
    if (yingYao > 6) yingYao -= 6;

    var changedGua = getChangedGua(gua, dongYao);
    var najia = getNajia(gua);
    var liuQin = getLiuQin(gua);

    var today = new Date();
    var riGanZhi = _getRiGanZhi(today);
    var riGan = riGanZhi.gan;
    var riZhi = riGanZhi.zhi;
    var yearGZ = calcYearGZ(today.getFullYear());
    var yearGan = yearGZ[0];
    var yueZhi = _getYueZhi(today.getFullYear(), today.getMonth() + 1, today.getDate());
    var liuShou = getLiuShou(riGan);

    var interpretation = generateInterpretation(gua, dongYao, shiYao, yingYao, liuQin, liuShou, changedGua);

    // 计算吉凶分数和趋势
    var score = calculateScore(gua, dongYao, shiYao, yingYao, liuQin, liuShou, changedGua);
    var trend = calculateTrend(score);

    // 日月建（年干支来自calcYearGZ，月干用五虎遁）
    var riJian = riGan + riZhi;
    var yueGan = _getYueGan(yearGan, yueZhi);
    var yueJian = yueGan + yueZhi;

    // 六冲六合
    var chongHe = checkLiuChongLiuHe(gua.name, changedGua);

    // 爻的旺衰
    var wangShuai = [];
    for (var wi = 0; wi < 6; wi++) {
      wangShuai.push(getYaoWangShuai(najia[wi].zhi, yueZhi));
    }

    // 神煞
    var shenSha = [];
    for (var si = 0; si < 6; si++) {
      var sha = getYaoShenSha(najia[si].zhi, riZhi, yueZhi);
      if (sha.length > 0) shenSha.push({ yao: si + 1, sha: sha });
    }

    return {
      gua_name: gua.name,
      original_gua: {
        yao: yao,
        name: gua.name,
        gong: gua.gong,
        upper: gua.upper,
        lower: gua.lower,
      },
      changed_gua: changedGua,
      dong_yao: dongYao,
      shi_yao: shiYao,
      ying_yao: yingYao,
      liu_qin: liuQin,
      liu_shou: liuShou,
      najia: najia,
      ri_jian: riJian,
      yue_jian: yueJian,
      wang_shuai: wangShuai,
      chong_he: chongHe,
      shen_sha: shenSha,
      interpretation: interpretation,
      score: score,
      trend: trend,
    };
  }

  /**
   * 根据公历日期获取日干（以2000-01-01甲子日为基准）
   */
  function _getRiGan(date) {
    var base = new Date(2000, 0, 1);
    var diff = Math.floor((date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    var riGanIdx = ((diff % 10) + 10) % 10; // 甲=0
    return GAN[riGanIdx];
  }

  /* ========== 六、日月建与旺衰 ========== */
  // 地支序
  var ZHI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 六冲：子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲
  var LIUCHONG = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
  // 六合：子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合
  var LIUHE = { 子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午' };

  // 卦宫归六冲/六合
  var LUCHONG_GUAS = ['坤为地', '巽为风', '震为雷', '水雷屯', '火雷噬嗑', '山火贲', '山雷颐', '山风蛊', '火地晋', '雷地豫', '泽雷随', '水风井', '泽风大过', '泽山咸', '雷山小过', '雷水解', '天雷无妄', '火泽睽', '山泽损'];
  var LIUHE_GUAS = ['天地否', '地天泰', '风天小畜', '火天大有', '水天需', '泽天夬', '乾为天', '地水师', '水地比', '风地观', '雷风恒', '天风姤', '泽水困', '火水未济', '山水蒙', '水火既济'];

  // 神煞计算
  var TAOHUA = { 申子辰: '酉', 亥卯未: '子', 寅午戌: '卯', 巳酉丑: '午' };

  // 日干禄支
  var GAN_LU = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
  // 贵人（天乙贵人）
  var GUIREN = {
    甲: ['丑', '未'], 戊: ['丑', '未'],
    丙: ['申', '子'], 丁: ['亥', '酉'],
    乙: ['子', '申'], 壬: ['巳', '卯'],
    辛: ['寅', '午'], 癸: ['巳', '卯'],
  };

  /**
   * 计算日干支（公历转干支，以2000-01-01甲子日为基准）
   */
  function _getRiGanZhi(date) {
    var base = new Date(2000, 0, 1); // 2000-01-01 甲子日（index 0）
    var diff = Math.floor((date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    var idx = ((diff % 60) + 60) % 60;
    return { gan: GAN[idx % 10], zhi: ZHI[idx % 12] };
  }

  /**
   * 计算年干支（以1900年庚子年为基准）
   */
  function calcYearGZ(year) {
    var baseYear = 1900,
      baseIdx = JIAZI_INDEX['庚子'] || 0;
    var offset = year - baseYear;
    return SIXTY_JIAZI[(((baseIdx + offset) % 60) + 60) % 60];
  }

  /**
   * 计算月支（按节气：立春约2月4日为寅月起点，立秋约8月7-8日为申月起点）
   */
  function _getYueZhi(year, month, day) {
    // 立春：约2月4日，之后为寅月；其余按公历月-1映射（1月→丑月）
    var afterLichun = month > 2 || (month === 2 && day >= 4);
    var beforeLiqiu = month < 8 || (month === 8 && day < 7);
    if (month === 1) return '丑';
    if (month === 2 && day < 4) return '丑';
    if (month >= 8 && day >= 7) return ZHI[month % 12];       // 申(8),酉(9),戌(10),亥(11),子(0)
    if (month >= 2 && month <= 7) return ZHI[(month + 1) % 12]; // 寅(1)..未(6)
    return ZHI[month % 12]; // month >= 9
  }

  /**
   * 计算月干（五虎遁：年干→寅月月干丙/戊/庚/壬/甲）
   */
  function _getYueGan(yearGan, monthZhi) {
    var startGan = WUHUDUN[yearGan] || '丙';
    var monthIdx = (ZHI.indexOf(monthZhi) - ZHI.indexOf('寅') + 12) % 12;
    return GAN[(GAN.indexOf(startGan) + monthIdx) % 10];
  }

  /**
   * 计算爻的旺衰（基于月建）
   */
  function getYaoWangShuai(zhi, yueZhi) {
    var zhiWx = ZHI_WUXING[zhi] || '';
    var yueWx = ZHI_WUXING[yueZhi] || '';
    if (zhiWx === yueWx) return '旺';      // 比和为旺
    var shengMap = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
    if (shengMap[yueWx] === zhiWx) return '相';  // 月生日，相
    if (shengMap[zhiWx] === yueWx) return '休';  // 生月，休
    var keMap = { 木: '土', 土: '金', 金: '水', 水: '火', 火: '木' };
    if (keMap[zhiWx] === yueWx) return '囚';  // 克月，囚
    if (keMap[yueWx] === zhiWx) return '死';  // 月克爻，死
    return '平';
  }

  /**
   * 获取神煞
   */
  function getYaoShenSha(zhi, riZhi, yueZhi) {
    var sha = [];
    // 驿马
    var yimaZhi = { 申子辰: '寅', 亥卯未: '巳', 寅午戌: '申', 巳酉丑: '亥' };
    for (var key in yimaZhi) {
      if (key.indexOf(riZhi) >= 0 && key.indexOf(yueZhi) >= 0) {
        if (zhi === yimaZhi[key]) sha.push('驿马');
      }
    }
    // 桃花
    for (var key2 in TAOHUA) {
      if (key2.indexOf(riZhi) >= 0 && key2.indexOf(yueZhi) >= 0) {
        if (zhi === TAOHUA[key2]) sha.push('桃花');
      }
    }
    return sha;
  }

  /**
   * 检测卦象是否六冲/六合
   */
  function checkLiuChongLiuHe(guaName, changedGua) {
    var result = { isLiuChong: false, isLiuHe: false, desc: '' };
    if (LUCHONG_GUAS.indexOf(guaName) >= 0) {
      result.isLiuChong = true;
      result.desc = '六冲卦，主事有散乱之象，不宜长期坚守。';
    } else if (LIUHE_GUAS.indexOf(guaName) >= 0) {
      result.isLiuHe = true;
      result.desc = '六合卦，主事有和合之象，宜合作经营。';
    }
    if (changedGua) {
      if (LUCHONG_GUAS.indexOf(changedGua.name) >= 0) result.changedLiuChong = true;
      if (LIUHE_GUAS.indexOf(changedGua.name) >= 0) result.changedLiuHe = true;
    }
    return result;
  }

  /**
   * 列出所有64卦
   */
  function listAllGuas() {
    return GUAS.map(function (g) {
      return {
        name: g.name,
        gong: g.gong,
        yao: g.yao,
        shi: g.shi,
        upper: g.upper,
        lower: g.lower,
      };
    });
  }

  /**
   * 根据卦名查找卦象
   */
  function findGua(name) {
    for (var i = 0; i < GUAS.length; i++) {
      if (GUAS[i].name === name) return GUAS[i];
    }
    return null;
  }

  // 暴露 API
  var LiuyaoEngine = {
    divine: divine,
    listAllGuas: listAllGuas,
    findGua: findGua,
  };

  global.LiuyaoEngine = LiuyaoEngine;
})(typeof window !== 'undefined' ? window : this);
