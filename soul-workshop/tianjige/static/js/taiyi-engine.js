/**
 * 天机阁 · 太乙神数引擎 v1 — 纯前端算法，零API调用
 * 太乙积年 · 十六神 · 九宫 · 五福三基 · 四神
 */
(function (global) {
  'use strict';

  /* ========== 一、基础常量 ========== */

  /** 太乙十六神，按顺序排列 */
  var GODS_16 = [
    '地主',
    '阳德',
    '和德',
    '吕申',
    '高丛',
    '太阳',
    '大炅',
    '大神',
    '大威',
    '天道',
    '大武',
    '武德',
    '太簇',
    '阴主',
    '阴德',
    '大义',
  ];

  /** 九宫 */
  var GONG_9 = ['乾', '离', '艮', '震', '中', '兑', '坤', '坎', '巽'];

  /** 九宫方位 */
  var GONG_DIR = {
    乾: '西北',
    离: '南',
    艮: '东北',
    震: '东',
    中: '中',
    兑: '西',
    坤: '西南',
    坎: '北',
    巽: '东南',
  };

  /** 十六神对应宫位（按局数0-23排列，每局太乙入一宫，十六神依次排布） */
  var GONG_POSITIONS = ['乾', '离', '艮', '震', '中', '兑', '坤', '坎', '巽'];

  /** 太乙上古甲子年（公元前10153917年） */
  var TAIYI_EPOCH = 10153917;

  /** 天干 */
  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  /** 地支 */
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  /** 时辰对应地支索引 */
  var SHICHEN_ZHI_MAP = {
    子时: 0,
    丑时: 1,
    寅时: 2,
    卯时: 3,
    辰时: 4,
    巳时: 5,
    午时: 6,
    未时: 7,
    申时: 8,
    酉时: 9,
    戌时: 10,
    亥时: 11,
  };

  /** 十六神吉凶属性 */
  var GOD_AUSPICIOUS = {
    地主: '吉',
    阳德: '吉',
    和德: '吉',
    吕申: '吉',
    高丛: '吉',
    太阳: '大吉',
    大炅: '凶',
    大神: '凶',
    大威: '凶',
    天道: '吉',
    大武: '凶',
    武德: '吉',
    太簇: '凶',
    阴主: '凶',
    阴德: '吉',
    大义: '吉',
  };

  /** 十六神五行属性 */
  var GOD_WUXING = {
    地主: '土',
    阳德: '木',
    和德: '火',
    吕申: '土',
    高丛: '金',
    太阳: '火',
    大炅: '水',
    大神: '水',
    大威: '金',
    天道: '金',
    大武: '水',
    武德: '金',
    太簇: '木',
    阴主: '水',
    阴德: '木',
    大义: '火',
  };

  /* ========== 二、太乙核心计算 ========== */

  /**
   * 计算太乙积年数
   * 公式：积年 = 上古甲子年(10153917) + 目标年份
   */
  function calcJiNian(year) {
    return TAIYI_EPOCH + year;
  }

  /**
   * 计算太乙局数
   * 积年 mod 24
   */
  function calcJuShu(jiNian) {
    return jiNian % 24;
  }

  /**
   * 计算太乙行度（入宫数）
   * 太乙每年行一宫，二十四年巡行一周
   * 积年 mod 24 得入宫序数
   * 太乙入宫规则：阳局顺行，阴局逆行（简化：按局数取模）
   */
  function calcTaiyiGong(juShu) {
    // 太乙行宫：每24年一周，局数0→乾1，局数1→离2，...局数8→巽9，局数9→离2，以此类推
    // 奇数为阳局（顺行），偶数为阴局（逆行）
    var cycle = juShu % 18; // 18局一个完整九宫循环
    if (cycle < 9) {
      return GONG_POSITIONS[cycle];
    } else {
      // 逆行
      return GONG_POSITIONS[17 - cycle];
    }
  }

  /**
   * 排列十六神位置
   * 根据局数，太乙入某宫，十六神依次排列于九宫和间神位
   */
  function arrangeGods(juShu) {
    var gods = [];
    var startIdx = juShu % 16; // 起始神索引

    // 九宫循环索引
    for (var i = 0; i < 16; i++) {
      var godIdx = (startIdx + i) % 16;
      var godName = GODS_16[godIdx];

      // 宫位映射：每16神对应9宫+7间神
      var position;
      var gongIdx = i % 9;
      if (i < 9) {
        position = GONG_POSITIONS[gongIdx] + '宫(正)';
      } else if (i < 16) {
        var between = GONG_POSITIONS[gongIdx] + '-' + GONG_POSITIONS[(gongIdx + 1) % 9];
        position = between + '(间)';
      } else {
        position = GONG_POSITIONS[gongIdx] + '宫';
      }

      gods.push({
        name: godName,
        position: GONG_DIR[GONG_POSITIONS[gongIdx]] || '中',
        auspicious: GOD_AUSPICIOUS[godName] || '平',
        wuxing: GOD_WUXING[godName] || '',
      });
    }

    // 按宫位重排：乾→离→艮→震→中→兑→坤→坎→巽，间神插入宫之间
    var ordered = [];
    var gongNames = ['乾', '离', '艮', '震', '中', '兑', '坤', '坎', '巽'];

    for (var g = 0; g < gongNames.length; g++) {
      var gName = gongNames[g];
      // 找该宫的正神
      for (var j = 0; j < gods.length; j++) {
        if (gods[j].position === GONG_DIR[gName]) {
          ordered.push(gods[j]);
          break;
        }
      }
    }

    // 补间神
    for (var k = 0; k < gods.length; k++) {
      if (ordered.indexOf(gods[k]) === -1) {
        ordered.push(gods[k]);
      }
    }

    return ordered;
  }

  /**
   * 计算五福
   * 五福：太乙五福之神，主福禄
   * 公式：积年 mod 225 ÷ 45
   */
  function calcWufu(jiNian) {
    var wufuIdx = Math.floor((jiNian % 225) / 45);
    var gongNames = ['乾', '离', '艮', '震', '中', '兑', '坤', '坎', '巽'];
    var wufuGong = gongNames[wufuIdx % 9];
    var wufuDir = GONG_DIR[wufuGong];
    return '五福入' + wufuGong + '宫（' + wufuDir + '），主福禄双全，百事顺遂';
  }

  /**
   * 计算三基（君基、臣基、民基）
   * 太乙三基：君基主国运，臣基主臣道，民基主民生
   * 君基：积年 mod 360 ÷ 30
   * 臣基：积年 mod 360 ÷ 30（偏移）
   * 民基：积年 mod 360 ÷ 30（偏移）
   */
  function calcSanji(jiNian) {
    var gongNames = ['乾', '离', '艮', '震', '中', '兑', '坤', '坎', '巽'];

    var junIdx = Math.floor((jiNian % 360) / 30) % 9;
    var chenIdx = Math.floor(((jiNian + 120) % 360) / 30) % 9;
    var minIdx = Math.floor(((jiNian + 240) % 360) / 30) % 9;

    var jun = gongNames[junIdx];
    var chen = gongNames[chenIdx];
    var min = gongNames[minIdx];

    return (
      '君基入' +
      jun +
      '宫（' +
      GONG_DIR[jun] +
      '），臣基入' +
      chen +
      '宫（' +
      GONG_DIR[chen] +
      '），民基入' +
      min +
      '宫（' +
      GONG_DIR[min] +
      '）'
    );
  }

  /**
   * 计算四神（天乙、地乙、直符、四神）
   * 天乙：积年 mod 360 ÷ 36
   * 地乙：积年 + 180 mod 360 ÷ 36
   * 直符：积年 + 90 mod 360 ÷ 36
   * 四神：积年 + 270 mod 360 ÷ 36
   */
  function calcSishen(jiNian) {
    var gongNames = ['乾', '离', '艮', '震', '中', '兑', '坤', '坎', '巽'];

    var tianyiIdx = Math.floor((jiNian % 360) / 36) % 9;
    var diyiIdx = Math.floor(((jiNian + 180) % 360) / 36) % 9;
    var zhifuIdx = Math.floor(((jiNian + 90) % 360) / 36) % 9;
    var sishenIdx = Math.floor(((jiNian + 270) % 360) / 36) % 9;

    return {
      tianyi: { name: '天乙', position: gongNames[tianyiIdx] + '宫（' + GONG_DIR[gongNames[tianyiIdx]] + '）' },
      diyi: { name: '地乙', position: gongNames[diyiIdx] + '宫（' + GONG_DIR[gongNames[diyiIdx]] + '）' },
      zhifu: { name: '直符', position: gongNames[zhifuIdx] + '宫（' + GONG_DIR[gongNames[zhifuIdx]] + '）' },
      sishen: { name: '四神', position: gongNames[sishenIdx] + '宫（' + GONG_DIR[gongNames[sishenIdx]] + '）' },
    };
  }

  /**
   * 计算太乙行度（360度制）
   */
  function calcTaiyiDegree(jiNian) {
    return jiNian % 360;
  }

  /* ========== 三、解读生成 ========== */

  /**
   * 生成太乙解读文本
   */
  function generateInterpretation(taiyiGong, gods, wufu, sanji, sishen, juShu) {
    var lines = [];
    var taiyiDir = GONG_DIR[taiyiGong] || '中';

    // 开篇：太乙落宫
    lines.push('太乙行至' + taiyiGong + '宫（' + taiyiDir + '方），局数' + juShu + '。');

    // 根据太乙落宫解读
    var gongInterpretations = {
      乾: '乾为天，太乙入乾宫，主天道昭彰，国运昌隆。利于开拓进取，宜行大事。',
      离: '离为火，太乙入离宫，主文明昌盛，礼乐兴隆。利于文化教育，宜修文德。',
      艮: '艮为山，太乙入艮宫，主静止蓄势，厚积薄发。利于内省修身，宜守不宜攻。',
      震: '震为雷，太乙入震宫，主震动变革，万象更新。利于改革创新，宜顺势而动。',
      中: '中为枢，太乙入中宫，主统御四方，执中守正。利于全局谋划，宜稳健行事。',
      兑: '兑为泽，太乙入兑宫，主喜悦沟通，口舌是非。利于外交谈判，宜慎言谨行。',
      坤: '坤为地，太乙入坤宫，主厚德载物，包容万象。利于积蓄力量，宜以柔克刚。',
      坎: '坎为水，太乙入坎宫，主险陷暗流，危机潜伏。利于内省反思，宜谨慎行事。',
      巽: '巽为风，太乙入巽宫，主风行天下，政令畅通。利于传播推广，宜顺势而为。',
    };
    lines.push(gongInterpretations[taiyiGong] || '');

    // 十六神吉凶分析
    var jiGods = [];
    var xiongGods = [];
    for (var i = 0; i < gods.length; i++) {
      if (gods[i].auspicious === '大吉' || gods[i].auspicious === '吉') {
        jiGods.push(gods[i].name + '（' + gods[i].position + '）');
      } else if (gods[i].auspicious === '凶') {
        xiongGods.push(gods[i].name + '（' + gods[i].position + '）');
      }
    }

    if (jiGods.length > 0) {
      lines.push('吉神汇聚：' + jiGods.join('、') + '。吉神在位，百事可成。');
    }
    if (xiongGods.length > 0) {
      lines.push('凶神在野：' + xiongGods.join('、') + '。凶神当道，宜避其锋芒，韬光养晦。');
    }

    // 五福解读
    if (wufu) {
      lines.push(wufu + '。');
    }

    // 三基解读
    if (sanji) {
      lines.push(sanji + '。三基得位，君臣民各安其分，则天下大治。');
    }

    // 四神解读
    if (sishen) {
      lines.push(
        '天乙' +
          sishen.tianyi.position +
          '，地乙' +
          sishen.diyi.position +
          '，直符' +
          sishen.zhifu.position +
          '，四神' +
          sishen.sishen.position +
          '。四神护佑，吉凶互见。'
      );
    }

    // 总体断语
    var jiCount = jiGods.length;
    var xiongCount = xiongGods.length;
    if (jiCount >= 8) {
      lines.push('纵观全局，吉神当道，太乙得位，此乃大吉之象。诸事顺遂，宜积极进取，建功立业。');
    } else if (jiCount >= 5) {
      lines.push('综合而论，吉神过半，运势平稳向好。宜顺势而为，趋吉避凶，方能事半功倍。');
    } else if (jiCount >= 3) {
      lines.push('通盘审视，吉凶参半。宜守正待时，不可冒进。避凶就吉，方能化险为夷。');
    } else {
      lines.push('纵观全局，凶神较盛。宜韬光养晦，以静制动。待时而动，不可强求。');
    }

    return lines.join('\n\n');
  }

  /**
   * 获取纪元名称
   */
  function getEpochName(jiNian) {
    var cycles = ['上元', '中元', '下元'];
    var cycle = Math.floor((jiNian % 360) / 120);
    return cycles[cycle] + '·第' + (Math.floor(jiNian / 360) + 1) + '纪';
  }

  /* ========== 四、公开API ========== */

  global.TaiyiEngine = {
    /**
     * 太乙神数起算
     * @param {string} date - 日期字符串 YYYY-MM-DD
     * @param {string} time - 时辰名称 如 '子时'
     * @returns {object} 太乙盘结果
     */
    divine: function (date, time) {
      var parts = date.split('-');
      var year = parseInt(parts[0], 10);
      var month = parseInt(parts[1], 10);
      var day = parseInt(parts[2], 10);

      var jiNian = calcJiNian(year);
      var juShu = calcJuShu(jiNian);
      var taiyiGong = calcTaiyiGong(juShu);
      var gods = arrangeGods(juShu);
      var wufu = calcWufu(jiNian);
      var sanji = calcSanji(jiNian);
      var sishen = calcSishen(jiNian);
      var degree = calcTaiyiDegree(jiNian);
      var epoch = getEpochName(jiNian);
      var interpretation = generateInterpretation(taiyiGong, gods, wufu, sanji, sishen, juShu);

      return {
        epoch: epoch,
        ji_nian: jiNian,
        gods: gods,
        wufu: wufu,
        sanji: sanji,
        taiyi_position: taiyiGong + '宫（' + (GONG_DIR[taiyiGong] || '') + '）',
        interpretation: interpretation,
      };
    },
  };
})(typeof window !== 'undefined' ? window : this);
