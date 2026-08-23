/**
 * 天机阁 · 梅花易数引擎 v1 — 纯前端算法，零API调用
 * 邵雍先天易学 + 体用生克体系 + 万物类象
 */
(function (global) {
  'use strict';

  /* ========== 一、八卦基础数据 ========== */

  /** 八卦：索引(1-8) → {名称, 符号, 五行, 阴阳} */
  var BAGUA = {
    1: { name: '乾', symbol: '☰', wuxing: '金', yinyang: '阳', yao: [1, 1, 1] },
    2: { name: '兑', symbol: '☱', wuxing: '金', yinyang: '阴', yao: [1, 1, 0] },
    3: { name: '离', symbol: '☲', wuxing: '火', yinyang: '阴', yao: [1, 0, 1] },
    4: { name: '震', symbol: '☳', wuxing: '木', yinyang: '阳', yao: [1, 0, 0] },
    5: { name: '巽', symbol: '☴', wuxing: '木', yinyang: '阴', yao: [0, 1, 1] },
    6: { name: '坎', symbol: '☵', wuxing: '水', yinyang: '阳', yao: [0, 1, 0] },
    7: { name: '艮', symbol: '☶', wuxing: '土', yinyang: '阳', yao: [0, 0, 1] },
    8: { name: '坤', symbol: '☷', wuxing: '土', yinyang: '阴', yao: [0, 0, 0] },
  };

  /** 八卦名称 → 索引 */
  var BAGUA_NAME_TO_IDX = {};
  for (var k in BAGUA) {
    if (BAGUA.hasOwnProperty(k)) {
      BAGUA_NAME_TO_IDX[BAGUA[k].name] = parseInt(k);
    }
  }

  /** 五行生克 */
  var WX_SHENG = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' }; // 生我者
  var WX_SHENG_BY = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' }; // 我生者
  var WX_KE = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' }; // 克我者
  var WX_KE_BY = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' }; // 我克者

  /* ========== 二、万物类象 ========== */

  /** 万物类象：每个卦的方位、人事、身体、颜色、季节 */
  var WANWU_LEIXIANG = {
    乾: { 方位: '西北', 人事: '君/父/首', 身体: '首/骨/肺', 颜色: '金白', 季节: '秋冬' },
    兑: { 方位: '西', 人事: '少女/口舌', 身体: '口/肺/气管', 颜色: '白', 季节: '秋' },
    离: { 方位: '南', 人事: '中女/丽', 身体: '目/心/小肠', 颜色: '赤', 季节: '夏' },
    震: { 方位: '东', 人事: '长男/动', 身体: '足/肝/胆', 颜色: '青绿', 季节: '春' },
    巽: { 方位: '东南', 人事: '长女/入', 身体: '股/气/胆', 颜色: '青绿', 季节: '春夏' },
    坎: { 方位: '北', 人事: '中男/陷', 身体: '耳/肾/膀胱', 颜色: '黑', 季节: '冬' },
    艮: { 方位: '东北', 人事: '少男/止', 身体: '手/胃/脾', 颜色: '黄', 季节: '冬春' },
    坤: { 方位: '西南', 人事: '母/众/顺', 身体: '腹/脾/胃', 颜色: '黄', 季节: '夏秋' },
  };

  /* ========== 三、六十四卦表 ========== */

  /**
   * 64卦：上卦索引-下卦索引 → 卦名
   * 索引：1乾 2兑 3离 4震 5巽 6坎 7艮 8坤
   */
  var GUA64 = {
    '1-1': '乾为天',
    '1-2': '天泽履',
    '1-3': '天火同人',
    '1-4': '天雷无妄',
    '1-5': '天风姤',
    '1-6': '天水讼',
    '1-7': '天山遁',
    '1-8': '天地否',
    '2-1': '泽天夬',
    '2-2': '兑为泽',
    '2-3': '泽火革',
    '2-4': '泽雷随',
    '2-5': '泽风大过',
    '2-6': '泽水困',
    '2-7': '泽山咸',
    '2-8': '泽地萃',
    '3-1': '火天大有',
    '3-2': '火泽睽',
    '3-3': '离为火',
    '3-4': '火雷噬嗑',
    '3-5': '火风鼎',
    '3-6': '火水未济',
    '3-7': '火山旅',
    '3-8': '火地晋',
    '4-1': '雷天大壮',
    '4-2': '雷泽归妹',
    '4-3': '雷火丰',
    '4-4': '震为雷',
    '4-5': '雷风恒',
    '4-6': '雷水解',
    '4-7': '雷山小过',
    '4-8': '雷地豫',
    '5-1': '风天小畜',
    '5-2': '风泽中孚',
    '5-3': '风火家人',
    '5-4': '风雷益',
    '5-5': '巽为风',
    '5-6': '风水涣',
    '5-7': '风山渐',
    '5-8': '风地观',
    '6-1': '水天需',
    '6-2': '水泽节',
    '6-3': '水火既济',
    '6-4': '水雷屯',
    '6-5': '水风井',
    '6-6': '坎为水',
    '6-7': '水山蹇',
    '6-8': '水地比',
    '7-1': '山天大畜',
    '7-2': '山泽损',
    '7-3': '山火贲',
    '7-4': '山雷颐',
    '7-5': '山风蛊',
    '7-6': '山水蒙',
    '7-7': '艮为山',
    '7-8': '山地剥',
    '8-1': '地天泰',
    '8-2': '地泽临',
    '8-3': '地火明夷',
    '8-4': '地雷复',
    '8-5': '地风升',
    '8-6': '地水师',
    '8-7': '地山谦',
    '8-8': '坤为地',
  };

  /** 卦名 → 上卦名+下卦名 */
  var GUA64_DECOMPOSE = {};
  for (var k64 in GUA64) {
    if (GUA64.hasOwnProperty(k64)) {
      var parts = k64.split('-');
      var shang = BAGUA[parseInt(parts[0])].name;
      var xia = BAGUA[parseInt(parts[1])].name;
      GUA64_DECOMPOSE[GUA64[k64]] = { shang: shang, xia: xia };
    }
  }

  /* ========== 四、六十四卦解读速查 ========== */

  /** 部分卦的简要解读（用于生成解释文本） */
  var GUA_INTERPRETATION = {
    乾为天: '乾卦六爻纯阳，刚健中正，自强不息，元亨利贞。得此卦者，运势亨通，宜主动进取，但需防刚愎自用。',
    坤为地: '坤卦六爻纯阴，柔顺利贞，厚德载物。得此卦者，宜以柔克刚，顺势而为，守静待时，不宜妄动。',
    火风鼎: '鼎卦火在上风在下，以木巽火，烹饪之象。象征革故鼎新，去旧取新，事业当有新的突破。',
    泽天夬: '夬卦泽在天上，决断之象。君子道长，小人道消，宜果断决策，但需防过刚则折。',
    火天大有: '大有卦火在天上，光照万物，富有之象。得此卦者，运势亨通，财富丰足，但需戒骄戒躁，保持谦逊。',
    水火既济: '既济卦水在火上，事已成也。象征功业初成，但盛极必衰，当居安思危，防微杜渐。',
    火水未济: '未济卦火在水上，事未成也。象征尚未成功，仍需努力，但离明坎险，需谨慎行事。',
    地天泰: '泰卦天地交而万物通，上下交而其志同。小往大来，吉亨，阴阳和合，万事顺遂。',
    天地否: '否卦天地不交，万物不通。大往小来，不利君子，宜退守隐忍，等待时机。',
    水雷屯: '屯卦雷在水中，万物始生，创业维艰。得此卦者，宜坚守正道，耐心经营，终将成功。',
    山水蒙: '蒙卦山下有水，童蒙求我。启蒙之象，宜虚心求教，不宜贸然行动。',
    水天需: '需卦水在天上，待时而动。饮食宴乐，等待时机成熟，不宜冒进。',
    天水讼: '讼卦天与水违行，争讼之象。宜以和为贵，避免纷争，退一步海阔天空。',
    地水师: '师卦地中有水，师出以律。用兵之象，宜纪律严明，师出有名。',
    水地比: '比卦地上有水，亲附之象。吉，宜亲近贤者，团结一致。',
    风天小畜: '小畜卦风行天上，小有积蓄。密云不雨，积蓄力量，不宜大举。',
    天泽履: '履卦天上泽下，履虎尾不咥人。如履薄冰，谨慎行事，终获吉祥。',
    地雷复: '复卦雷在地中，一阳来复。生机复始，运势回转，宜把握时机重新出发。',
    天雷无妄: '无妄卦天下雷行，真实无妄。元亨利贞，但若其匪正，则有眚不利。',
    山天大畜: '大畜卦天在山中，蓄养其德。利涉大川，宜厚积薄发，养精蓄锐。',
    山雷颐: '颐卦山下有雷，养正之道。自求口实，宜养德修身，不宜妄动。',
    泽风大过: '大过卦泽灭木，栋桡之象。宜有所作为，但需防过犹不及。',
    坎为水: '坎卦水流洊至，习坎之象。面临险阻，宜以诚信之心坚持，终能渡过难关。',
    离为火: '离卦明两作，附丽之象。利贞亨，宜光明正大，依附正道而行。',
    泽山咸: '咸卦山上有泽，感应之象。亨，利贞，取女吉。男女感应，万事亨通。',
    雷风恒: '恒卦雷风相与，恒久之象。亨，无咎，利贞。宜持之以恒，不宜朝三暮四。',
    天山遁: '遁卦天下有山，退避之象。小利贞，宜暂时退避，保全实力。',
    雷天大壮: '大壮卦雷在天上，强盛之象。利贞，宜守正不阿，但需防恃强凌弱。',
    火地晋: '晋卦明出地上，晋升之象。康侯用锡马蕃庶，宜进取向上。',
    地火明夷: '明夷卦明入地中，光明受伤。利艰贞，宜韬光养晦，坚守正道。',
    风火家人: '家人卦风自火出，家道之象。利女贞，宜重视家庭和睦。',
    火泽睽: '睽卦上火下泽，乖离之象。小事吉，宜求同存异，化解矛盾。',
    雷水解: '解卦雷雨作，解难之象。利西南，宜化解困难，宽以待人。',
    山泽损: '损卦山下有泽，损下益上。损而有孚，元吉，宜适当取舍。',
    风雷益: '益卦风雷相益，增益之象。利有攸往，利涉大川，宜积极进取。',
    泽地萃: '萃卦泽上于地，聚集之象。亨，宜团结众人，集思广益。',
    地风升: '升卦地中生木，上升之象。元亨，宜循序渐进，稳步上升。',
    泽水困: '困卦泽无水，困顿之象。亨，贞，大人吉。宜坚守正道，等待转机。',
    水风井: '井卦木上有水，养而不穷。改邑不改井，宜坚守根本。',
    泽火革: '革卦泽中有火，变革之象。已日乃孚，宜顺应时势，推动变革。',
    火风鼎: '鼎卦火在上风在下，以木巽火，烹饪之象。象征革故鼎新，去旧取新，事业当有新的突破。',
    震为雷: '震卦洊雷，震惊百里。亨，临危不惧，宜泰然处之。',
    艮为山: '艮卦兼山，止于其所。不获其身，行其庭不见其人，宜知止而止。',
    风山渐: '渐卦山上有木，循序渐进。女归吉，利贞，宜稳步推进。',
    雷泽归妹: '归妹卦泽上有雷，婚嫁之象。征凶，无攸利，宜谨慎对待结合之事。',
    雷火丰: '丰卦雷电皆至，丰盛之象。亨，宜日中则昃，盛极必衰，当居安思危。',
    火山旅: '旅卦山上有火，旅居之象。小亨，旅贞吉，宜谨慎行事，不宜久留。',
    巽为风: '巽卦随风，入也。小亨，利有攸往，利见大人，宜顺势而为。',
    兑为泽: '兑卦丽泽，悦也。亨，利贞，宜以和为贵，悦而应之。',
    风水涣: '涣卦风行水上，涣散之象。亨，王假有庙，宜凝聚人心。',
    水泽节: '节卦泽上有水，节制之象。亨，苦节不可贞，宜适度节制。',
    风泽中孚: '中孚卦泽上有风，诚信之象。豚鱼吉，利涉大川，宜以诚待人。',
    雷山小过: '小过卦山上有雷，小有过越。亨，利贞，可小事不可大事。',
    地山谦: '谦卦地中有山，谦逊之象。亨，君子有终，宜谦虚谨慎。',
    雷地豫: '豫卦雷出地奋，愉悦之象。利建侯行师，宜顺势而为，把握时机。',
    泽雷随: '随卦泽中有雷，随从之象。元亨利贞，无咎，宜随顺时势。',
    山风蛊: '蛊卦山下有风，整治之象。元亨，利涉大川，先甲三日后甲三日，宜整顿改革。',
    地泽临: '临卦泽上有地，临下之象。元亨利贞，宜亲临其事，体察民情。',
    风地观: '观卦风行地上，观察之象。盥而不荐，有孚颙若，宜观察局势，冷静分析。',
    火雷噬嗑: '噬嗑卦雷电噬嗑，刑罚之象。亨，利用狱，宜明断是非。',
    山火贲: '贲卦山下有火，文饰之象。亨，小利有攸往，宜注重形式与内涵的统一。',
    山地剥: '剥卦山附于地，剥落之象。不利有攸往，宜守成待时，不宜进取。',
    水雷屯: '屯卦雷在水中，万物始生，创业维艰。得此卦者，宜坚守正道，耐心经营。',
    天风姤: '姤卦天下有风，遇合之象。女壮，勿用取女，宜谨慎对待偶然相遇之事。',
    水山蹇: '蹇卦山上有水，艰难之象。利西南不利东北，利见大人，宜寻求帮助。',
  };

  /* ========== 五、核心算法 ========== */

  /**
   * 根据数字取八卦索引
   * @param {number} num - 任意正整数
   * @returns {number} 1-8 的八卦索引
   */
  function numToBaguaIdx(num) {
    var mod = num % 8;
    return mod === 0 ? 8 : mod;
  }

  /**
   * 根据数字取动爻
   * @param {number} num - 任意正整数
   * @returns {number} 1-6 的爻位
   */
  function numToMovingYao(num) {
    var mod = num % 6;
    return mod === 0 ? 6 : mod;
  }

  /**
   * 根据上下卦索引查卦名
   * @param {number} shangIdx - 上卦索引
   * @param {number} xiaIdx - 下卦索引
   * @returns {object} { name, shang_gua, xia_gua }
   */
  function getGuaByIndex(shangIdx, xiaIdx) {
    var key = shangIdx + '-' + xiaIdx;
    return {
      name: GUA64[key] || '未知卦',
      shang_gua: BAGUA[shangIdx].name,
      xia_gua: BAGUA[xiaIdx].name,
    };
  }

  /**
   * 计算互卦
   * 互卦：本卦2-4爻为下卦，3-5爻为上卦
   * @param {number} shangIdx - 本卦上卦索引
   * @param {number} xiaIdx - 本卦下卦索引
   * @returns {object} { name, shang_gua, xia_gua }
   */
  function calcHuGua(shangIdx, xiaIdx) {
    // 获取本卦6爻（从下往上：初爻=下卦下爻，二爻=下卦中爻，三爻=下卦上爻，四爻=上卦下爻，五爻=上卦中爻，上爻=上卦上爻）
    var xiaYao = BAGUA[xiaIdx].yao; // 下卦三爻 [初, 二, 三]
    var shangYao = BAGUA[shangIdx].yao; // 上卦三爻 [四, 五, 上]

    // 互卦下卦 = 本卦2-4爻（二爻、三爻、四爻）
    var huXiaYao = [xiaYao[1], xiaYao[2], shangYao[0]];
    // 互卦上卦 = 本卦3-5爻（三爻、四爻、五爻）
    var huShangYao = [xiaYao[2], shangYao[0], shangYao[1]];

    var huXiaIdx = yaoToBaguaIdx(huXiaYao);
    var huShangIdx = yaoToBaguaIdx(huShangYao);

    return getGuaByIndex(huShangIdx, huXiaIdx);
  }

  /**
   * 三爻数组 → 八卦索引
   */
  function yaoToBaguaIdx(yao) {
    // 将三爻转为八卦索引
    var key = yao.join('');
    for (var k in BAGUA) {
      if (BAGUA.hasOwnProperty(k) && BAGUA[k].yao.join('') === key) {
        return parseInt(k);
      }
    }
    return 1; // fallback
  }

  /**
   * 计算变卦
   * 动爻处阴阳互变
   * @param {number} shangIdx - 上卦索引
   * @param {number} xiaIdx - 下卦索引
   * @param {number} movingYao - 动爻位置 1-6
   * @returns {object} { name, shang_gua, xia_gua, movingYao, changedYao }
   */
  function calcBianGua(shangIdx, xiaIdx, movingYao) {
    var xiaYao = BAGUA[xiaIdx].yao.slice(); // 复制
    var shangYao = BAGUA[shangIdx].yao.slice(); // 复制

    var changedYao = '';
    if (movingYao <= 3) {
      // 动爻在下卦
      var idx = movingYao - 1;
      changedYao = (idx === 0 ? '初' : idx === 1 ? '二' : '三') + '爻';
      xiaYao[idx] = xiaYao[idx] === 1 ? 0 : 1;
    } else {
      // 动爻在上卦
      var idx2 = movingYao - 4;
      changedYao = (idx2 === 0 ? '四' : idx2 === 1 ? '五' : '上') + '爻';
      shangYao[idx2] = shangYao[idx2] === 1 ? 0 : 1;
    }

    var newXiaIdx = yaoToBaguaIdx(xiaYao);
    var newShangIdx = yaoToBaguaIdx(shangYao);

    var result = getGuaByIndex(newShangIdx, newXiaIdx);
    result.movingYao = movingYao;
    result.changedYao = changedYao;
    return result;
  }

  /**
   * 计算体用生克
   * @param {string} tiWuxing - 体卦五行
   * @param {string} yongWuxing - 用卦五行
   * @returns {object} { 等级, 关系, 说明 }
   */
  function calcShengKe(tiWuxing, yongWuxing) {
    var level, relation, desc, duality;

    if (tiWuxing === yongWuxing) {
      // 比和
      level = 3;
      relation = '体用比和，中吉';
      desc =
        '体卦' +
        tiWuxing +
        '与用卦' +
        yongWuxing +
        '五行相同，比和之象。双方力量均衡，相互扶持，主事可成，但需主动争取。';
      duality = {
        yang: '同气相求，合作共赢，人脉资源丰富，得朋友同事之力。气场和谐，内外统一，顺水行舟。',
        yin: '竞争内耗，资源被分夺，合伙易生纠纷。比和之时易安于现状，缺乏突破动力，需防"温水煮蛙"。',
        transform: '合而不争——选择志同道合者合作，明确权责利，在和谐中保持进取心。',
        timing: '比和之时宜合作、社交、巩固关系；但需主动寻找突破口，不可坐等其成。',
      };
    } else if (WX_SHENG[tiWuxing] === yongWuxing) {
      // 用生体
      level = 4;
      relation = '用生体，大吉';
      desc =
        '用卦' +
        yongWuxing +
        '生体卦' +
        tiWuxing +
        '，用卦之气滋养体卦。凡事顺遂，他人相助，事半功倍，求谋有成，财利可期。此为上吉之象。';
      duality = {
        yang: '贵人相助，外力支持，运势上扬，事半功倍。天时地利人和，所求之事多有成望，诸事顺遂。',
        yin: '易生依赖心理，若过于被动则自主性减弱。需防坐享其成而失去进取心，外部助力终有尽时。',
        transform: '借力而不依赖——感恩贵人但保持独立判断，将外力转化为自身能力。',
        timing: '用生体时宜积极进取、把握良机；但需在顺利时积累实力，为将来做准备。',
      };
    } else if (WX_SHENG_BY[tiWuxing] === yongWuxing) {
      // 体生用
      level = 2;
      relation = '体生用，小吉';
      desc =
        '体卦' +
        tiWuxing +
        '生用卦' +
        yongWuxing +
        '，体卦之气泄于用卦。虽有付出，但可积德结缘，长远有利。宜主动付出，不宜急求回报。';
      duality = {
        yang: '付出有回报，积德结缘，长远有利。主动付出能建立信任和口碑，为未来铺路。',
        yin: '能量外泄，易感疲惫。若付出过多而回报不足，则身心俱耗。需防"为人作嫁"而忽视自身利益。',
        transform: '先舍后得——付出是投资而非消耗，但需明确边界，避免无底线的付出。',
        timing: '体生用时宜播种、耕耘、建立关系；短期内不求回报，但需设定止损线。',
      };
    } else if (WX_KE[tiWuxing] === yongWuxing) {
      // 用克体
      level = 0;
      relation = '用克体，大凶';
      desc =
        '用卦' +
        yongWuxing +
        '克体卦' +
        tiWuxing +
        '，用卦克制体卦。诸事不顺，外力压制，宜守不宜攻，静待时机。行事需格外谨慎，避免正面冲突。';
      duality = {
        yang: '危机中藏转机——压力之下可激发潜能，困境中能看清真朋友。逆境是成长最快的时期。',
        yin: '外力压制，诸事不顺。正面冲突易受损，需防小人暗算、意外之灾。身心俱疲，压力山大。',
        transform: '以柔克刚，避实就虚——不正面硬碰，寻找迂回之路。低谷期宜韬光养晦、积蓄力量。',
        timing: '用克体时宜守不宜攻，静待时机。不利做重大决策，但可学习、充电、为未来做准备。',
      };
    } else if (WX_KE_BY[tiWuxing] === yongWuxing) {
      // 体克用
      level = 1;
      relation = '体克用，凶';
      desc =
        '体卦' +
        tiWuxing +
        '克用卦' +
        yongWuxing +
        '，体卦克制用卦。虽能成事，但耗费心力，劳而有获。宜量力而行，不宜过度消耗。';
      duality = {
        yang: '主动权在握，有能力掌控局面。虽劳但有获，付出看得到成果。适合攻坚克难。',
        yin: '耗费心力，事倍功半。过度用力可能适得其反，需防"用力过猛"导致资源枯竭或关系紧张。',
        transform: '以巧取胜而非以力取胜——找到杠杆点，借力打力，减少不必要的消耗。',
        timing: '体克用时宜量力而行，设定阶段性目标。不过度消耗，定期休整。',
      };
    } else {
      level = 2;
      relation = '难以判断';
      desc = '体用生克关系复杂，需结合具体卦象综合判断。';
      duality = {
        yang: '保持信心，积极面对',
        yin: '需谨慎行事，不可大意',
        transform: '综合判断，多方考量',
        timing: '宜守正待时',
      };
    }

    return { 等级: level, 关系: relation, 说明: desc, 双面: duality };
  }

  /**
   * 生成卦象解读文本
   */
  function generateInterpretation(original, hu, changed, shengKe, tiGua, yongGua) {
    var lines = [];
    var tiWx = BAGUA[BAGUA_NAME_TO_IDX[tiGua]].wuxing;
    var yongWx = BAGUA[BAGUA_NAME_TO_IDX[yongGua]].wuxing;
    var duality = shengKe.双面 || {};

    // ===== 本卦解读 =====
    var origInterp = GUA_INTERPRETATION[original.name] || '';
    lines.push('【本卦】' + original.name + '（' + original.shang_gua + '上' + original.xia_gua + '下）');
    if (origInterp) {
      lines.push(origInterp);
    } else {
      lines.push(
        '上卦' +
          original.shang_gua +
          '为' +
          BAGUA[BAGUA_NAME_TO_IDX[original.shang_gua]].wuxing +
          '，下卦' +
          original.xia_gua +
          '为' +
          BAGUA[BAGUA_NAME_TO_IDX[original.xia_gua]].wuxing +
          '。'
      );
    }

    // ===== 互卦解读 =====
    lines.push('');
    lines.push('【互卦】' + hu.name + '（' + hu.shang_gua + '上' + hu.xia_gua + '下）');
    var huInterp = GUA_INTERPRETATION[hu.name] || '';
    if (huInterp) {
      lines.push(huInterp);
    } else {
      lines.push('为事物发展之中间过程，揭示内在变化和隐藏因素。');
    }

    // ===== 变卦解读 =====
    lines.push('');
    lines.push('【变卦】' + changed.name + '（' + changed.shang_gua + '上' + changed.xia_gua + '下）');
    var changedInterp = GUA_INTERPRETATION[changed.name] || '';
    if (changedInterp) {
      lines.push(changedInterp);
    } else {
      lines.push('为事物发展之最终结果，揭示事态归宿。');
    }

    // ===== 三卦联动分析 =====
    lines.push('');
    lines.push('【三卦联动——本卦→互卦→变卦的演化路径】');
    var pathAnalysis = analyzeThreeGuaPath(original, hu, changed, tiGua, yongGua);
    lines.push(pathAnalysis);

    // ===== 体用生克双面解读 =====
    lines.push('');
    lines.push('【体用生克——双面解读】');
    lines.push('体卦为' + tiGua + '（五行属' + tiWx + '），代表您自身。');
    lines.push('用卦为' + yongGua + '（五行属' + yongWx + '），代表所问之事。');
    lines.push('关系：' + shengKe.关系 + '。' + shengKe.说明);
    if (duality.yang) {
      lines.push('');
      lines.push('吉面：' + duality.yang);
      lines.push('凶面：' + duality.yin);
      lines.push('转化关键：' + duality.transform);
      lines.push('时机建议：' + duality.timing);
    }

    // ===== 综合断语（含趋吉避凶） =====
    var level = shengKe.等级;
    lines.push('');
    lines.push('【综合断语】');
    var judgments = {
      4: '大吉之象，用生体，万事亨通。此时宜积极进取，把握良机，所求之事多有成望。但需防乐极生悲——运势虽佳，不可骄纵，保持谦逊谨慎方能长久。',
      3: '中吉之象，体用比和，阴阳调和。凡事需主动争取，不可坐等。宜稳扎稳打，步步为营。但需防"温水煮蛙"——和谐之中也要保持警觉，主动寻找突破口。',
      2: '小吉之象，体生用，虽有付出但可积德结缘。宜放长线钓大鱼，不宜急功近利。付出终有回报，但需有耐心。同时注意：付出要有边界，不可无底线地消耗自己。',
      1: '凶象，体克用，劳而有获但耗费心力。宜量力而行，不宜强求。可借助外力减轻自身负担。关键：以巧取胜而非以力取胜，找到杠杆点。',
      0: '大凶之象，用克体，外力压制。宜守不宜攻，静待时机。此时不宜做重大决策，韬光养晦为上策。但凶中也有吉——逆境是最快的成长时期，低谷正是积蓄力量之时。',
    };
    lines.push(judgments[level] || '体用关系复杂，需结合具体卦象综合判断。');

    // ===== 趋吉避凶策略 =====
    lines.push('');
    lines.push('【趋吉避凶策略】');
    var strategies = buildMeihuaStrategy(level, tiWx, yongWx, original.name, hu.name, changed.name);
    lines.push(strategies);

    return lines.join('\n');
  }

  /**
   * 三卦联动分析：本卦→互卦→变卦的演化路径
   */
  function analyzeThreeGuaPath(original, hu, changed, tiGua, yongGua) {
    var parts = [];
    var origName = original.name;
    var huName = hu.name;
    var chgName = changed.name;

    // 本卦→互卦：当前状态的内在变化
    if (origName === huName) {
      parts.push(
        '本卦与互卦相同——当前状态的内在变化与外表一致，表里如一。吉面：方向明确，没有隐藏矛盾；凶面：缺乏变化的内在动力，可能陷入惯性。'
      );
    } else {
      parts.push('从本卦「' + origName + '」到互卦「' + huName + '」——这是事物发展的内在过程。');
      if (origName === '天地否' && huName === '风山渐') {
        parts.push('否极泰来之前的渐变——阻滞之中暗藏生机，需耐心等待转机。');
      } else if (origName === '地天泰' && huName === '雷泽归妹') {
        parts.push('亨通之中有变数——顺利时需警惕潜在的变化，不可掉以轻心。');
      }
    }

    // 互卦→变卦：内在过程到最终结果
    if (huName === chgName) {
      parts.push('互卦与变卦相同——内在过程直接导向最终结果，中间没有意外转折。按当前路径走下去，结果可期。');
    } else {
      parts.push('从互卦「' + huName + '」到变卦「' + chgName + '」——内在过程将导向最终结果。');
    }

    // 本卦→变卦：起点到终点
    if (origName === chgName) {
      parts.push(
        '本卦与变卦相同——事态虽有波折但终归原位。吉面：初心不改，方向正确；凶面：可能原地踏步，需审视方法是否需要调整。'
      );
    }

    if (parts.length === 0) {
      parts.push('三卦联动，事态经历"本→互→变"的完整演化过程。关注每一步的变化，顺应时势。');
    }

    return parts.join('\n');
  }

  /**
   * 梅花易数趋吉避凶策略生成
   */
  function buildMeihuaStrategy(level, tiWx, yongWx, origName, huName, chgName) {
    var strategies = [];

    // 基于体用等级的通用策略
    if (level >= 4) {
      strategies.push('1. 抓住机遇：当前运势极佳，看到机会就果断出手，不宜犹豫。');
      strategies.push('2. 防盛极而衰：运势好时最容易放松警惕——保持谦逊，定期复盘，不盲目扩张。');
      strategies.push('3. 分享成果：运势好时宜广结善缘，分享成果，为将来积累人脉和口碑。');
    } else if (level === 3) {
      strategies.push('1. 主动出击：比和之时需主动争取，不可坐等。主动一步，局面就打开一步。');
      strategies.push('2. 寻找差异化：比和容易陷入同质化竞争——找到自己的独特优势，避免正面硬碰。');
      strategies.push('3. 巩固关系：维护好已有的合作关系，比和之时关系最稳固。');
    } else if (level === 2) {
      strategies.push('1. 设定边界：付出要有底线，明确"什么可以给、什么不能给"。');
      strategies.push('2. 放长线钓大鱼：短期不求回报，但要有长期规划，确保付出是投资而非消耗。');
      strategies.push('3. 自我保护：在付出的同时，留出时间精力给自己，保持身心健康。');
    } else if (level === 1) {
      strategies.push('1. 借力打力：体克用虽能成事但耗费心力——寻找杠杆点，以巧取胜。');
      strategies.push('2. 分批推进：不要一次性投入全部精力，分阶段、分步骤地推进。');
      strategies.push('3. 定期休整：每完成一个阶段就停下来复盘和休整，避免消耗过度。');
    } else {
      strategies.push('1. 以守为攻：当前宜守不宜攻，减少不必要的大动作，保存实力。');
      strategies.push('2. 韬光养晦：利用低谷期学习充电、提升自己，为未来积蓄力量。');
      strategies.push('3. 寻找转机：用克体并非绝路——关注互卦和变卦中的积极信号，转机往往在最困难时出现。');
    }

    // 基于本卦卦德的补充建议
    var guaAdvice = {
      乾为天: '乾卦刚健——行动要果断，但需防刚愎自用，多听他人意见。',
      坤为地: '坤卦柔顺——顺势而为，以柔克刚，厚德载物。',
      地天泰: '泰卦亨通——坚持就是胜利，但需防乐极生悲。',
      天地否: '否卦阻滞——不必强求，暂时退守也是一种智慧。',
      水火既济: '既济已成——守成防变，居安思危，不可松懈。',
      火水未济: '未济未成——继续努力，调整方法，不可半途而废。',
    };
    if (guaAdvice[origName]) {
      strategies.push('4. 卦德指引：' + guaAdvice[origName]);
    }

    return strategies.join('\n');
  }

  /* ========== 六、公开API ========== */

  /**
   * 梅花易数起卦
   * @param {object} params
   *   - method: 'datetime'(默认) | 'number'
   *   - upper: 上卦数（method='number'时必填）
   *   - lower: 下卦数（method='number'时必填）
   *   - moving: 动爻数（method='number'时必填）
   * @returns {object} 完整卦象结果
   */
  function divine(params) {
    params = params || {};
    var method = params.method || 'datetime';
    var shangNum, xiaNum, movingNum;

    if (method === 'number') {
      shangNum = parseInt(params.upper) || 1;
      xiaNum = parseInt(params.lower) || 1;
      movingNum = parseInt(params.moving) || 1;
    } else {
      // datetime模式：用当前时间
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      shangNum = year;
      xiaNum = month;
      movingNum = day;
    }

    // 上卦、下卦、动爻
    var shangIdx = numToBaguaIdx(shangNum);
    var xiaIdx = numToBaguaIdx(xiaNum);
    var movingYao = numToMovingYao(movingNum);

    // 本卦
    var original = getGuaByIndex(shangIdx, xiaIdx);

    // 互卦
    var hu = calcHuGua(shangIdx, xiaIdx);

    // 变卦
    var changed = calcBianGua(shangIdx, xiaIdx, movingYao);

    // 体用：动爻在上卦则上卦为用下卦为体，反之
    var tiGua, yongGua;
    if (movingYao >= 4) {
      // 动爻在上卦，上卦为用
      yongGua = original.shang_gua;
      tiGua = original.xia_gua;
    } else {
      // 动爻在下卦，下卦为用
      yongGua = original.xia_gua;
      tiGua = original.shang_gua;
    }

    // 体用生克
    var tiWuxing = BAGUA[BAGUA_NAME_TO_IDX[tiGua]].wuxing;
    var yongWuxing = BAGUA[BAGUA_NAME_TO_IDX[yongGua]].wuxing;
    var shengKe = calcShengKe(tiWuxing, yongWuxing);

    // 万物类象
    var wanwuLeixiang = {
      体卦: Object.assign({ 卦名: tiGua, 五行: tiWuxing }, WANWU_LEIXIANG[tiGua]),
      用卦: Object.assign({ 卦名: yongGua, 五行: yongWuxing }, WANWU_LEIXIANG[yongGua]),
    };

    // 解读
    var interpretation = generateInterpretation(original, hu, changed, shengKe, tiGua, yongGua);

    return {
      original_gua: original,
      hu_gua: hu,
      changed_gua: changed,
      ti_gua: tiGua,
      yong_gua: yongGua,
      sheng_ke: shengKe,
      wanwu_leixiang: wanwuLeixiang,
      interpretation: interpretation,
    };
  }

  // 暴露到全局
  global.MeihuaEngine = {
    divine: divine,
    BAGUA: BAGUA,
    GUA64: GUA64,
    WANWU_LEIXIANG: WANWU_LEIXIANG,
  };
})(typeof window !== 'undefined' ? window : this);
