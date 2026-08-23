/**
 * 天机阁 · 问事分析引擎 v1 — 纯前端，零API
 * 为所有术数板块提供统一的「所问之事」交叉分析
 * 八字/六爻/梅花/奇门/太乙/诸葛 → 8大事域解读
 */
(function (global) {
  'use strict';

  /* ========== 一、事域体系 ========== */
  var DOMAINS = {
    career: {
      key: 'career',
      name: '事业前程',
      desc: '事业运',
      icon: '💼',
      keywords: [
        '事业',
        '工作',
        '职场',
        '升职',
        '跳槽',
        '创业',
        '生意',
        '老板',
        '同事',
        '项目',
        '前途',
        '职业',
        '公司',
        '企业',
        '单位',
        '面试',
        '求职',
        '转行',
        '晋升',
        '公务员',
        '考公',
        '体制',
        '编制',
        '铁饭碗',
        '互联网',
        '大厂',
        'IT',
        '行业',
        '上班',
        '辞职',
        '离职',
        '招聘',
        '应聘',
        '加班',
        '薪资',
        '待遇',
        '家族企业',
        '继承家业',
      ],
    },
    love: {
      key: 'love',
      name: '感情姻缘',
      desc: '感情运',
      icon: '💕',
      keywords: [
        '感情',
        '爱情',
        '婚姻',
        '恋爱',
        '分手',
        '复合',
        '对象',
        '伴侣',
        '表白',
        '暗恋',
        '相亲',
        '单身',
        '脱单',
        '出轨',
        '暧昧',
        '缘分',
        '正缘',
        '桃花',
        '离婚',
        '结婚',
        '夫妻',
        '未婚',
        '已婚',
        '分居',
        '复婚',
        '再婚',
        '姻缘',
        '老公',
        '老婆',
        '吵架',
        '冷战',
        '配偶',
        '二婚',
        '头婚',
        '再嫁',
        '续弦',
        '改嫁',
        '娶媳',
        '嫁人',
      ],
    },
    wealth: {
      key: 'wealth',
      name: '财运财富',
      desc: '财运',
      icon: '💰',
      keywords: [
        '财运',
        '钱',
        '财富',
        '投资',
        '理财',
        '股票',
        '基金',
        '收入',
        '债务',
        '亏损',
        '赚钱',
        '偏财',
        '正财',
        '花销',
        '贷款',
        '买房',
        '买车',
      ],
    },
    health: {
      key: 'health',
      name: '健康平安',
      desc: '健康运',
      icon: '🏥',
      keywords: [
        '健康',
        '身体',
        '疾病',
        '生病',
        '康复',
        '手术',
        '体检',
        '失眠',
        '头痛',
        '疼痛',
        '养生',
        '锻炼',
        '减肥',
        '怀孕',
        '平安',
      ],
    },
    study: {
      key: 'study',
      name: '学业考试',
      desc: '学业运',
      icon: '📚',
      keywords: [
        '学业',
        '考试',
        '学习',
        '成绩',
        '高考',
        '考研',
        '考证',
        '升学',
        '毕业',
        '论文',
        '学校',
        '专业',
        '录取',
        '分数',
        '挂科',
        '读书',
        '备考',
        '复习',
        '科目',
      ],
    },
    family: {
      key: 'family',
      name: '家庭关系',
      desc: '家庭运',
      icon: '🏠',
      keywords: [
        '家庭',
        '家人',
        '父母',
        '子女',
        '孩子',
        '亲情',
        '婆媳',
        '婆媳矛盾',
        '亲戚',
        '长辈',
        '兄弟姐妹',
        '公公',
        '婆婆',
        '岳父',
        '岳母',
        '继母',
        '继父',
        '养父',
        '养母',
        '独生子',
        '独生女',
        '亲家',
        '后代',
        '生育',
        '代沟',
        '家教',
        '家风',
        '祖孙',
        '传宗',
        '香火',
        '过继',
        '领养',
        '原生家庭',
        '家庭矛盾',
        '父母婚姻',
        '子女婚姻',
        '子女的婚姻',
        '孩子婚姻',
        '孩子的婚姻',
      ],
    },
    social: {
      key: 'social',
      name: '人际关系',
      desc: '人际运',
      icon: '🤝',
      keywords: ['朋友', '社交', '人际', '合伙', '小人', '贵人', '人脉', '客户', '和解', '背叛'],
    },
    travel: {
      key: 'travel',
      name: '出行迁移',
      desc: '出行运',
      icon: '✈️',
      keywords: [
        '出行',
        '旅游',
        '出国',
        '移民',
        '远行',
        '搬家',
        '出差',
        '旅行',
        '签证',
        '留学',
        '航班',
        '旅途',
        '异地',
      ],
    },
    general: {
      key: 'general',
      name: '综合运势',
      desc: '综合运',
      icon: '🌟',
      keywords: [
        '运势',
        '命运',
        '运气',
        '前程',
        '整体',
        '综合',
        '人生',
        '未来',
        '怎么样',
        '如何',
        '好不好',
        '顺利',
        '吉凶',
        '好坏',
        '走向',
        '趋势',
        '近况',
        '前路',
        '前景',
        '天命',
        '命数',
        '造化',
      ],
    },
  };

  var DOMAIN_LIST = ['career', 'love', 'wealth', 'health', 'study', 'social', 'family', 'travel', 'general'];

  /* ========== 二、领域检测 ========== */
  function detectDomain(question) {
    if (!question || !question.trim()) return null;
    var q = question;
    var best = null,
      bestScore = 0;
    for (var i = 0; i < DOMAIN_LIST.length; i++) {
      var dk = DOMAIN_LIST[i];
      // > 如果已有非general领域匹配，跳过general（通用词不应覆盖明确领域）
      if (dk === 'general' && best && best !== 'general') continue;
      var dm = DOMAINS[dk];
      var score = 0;
      for (var j = 0; j < dm.keywords.length; j++) {
        if (q.indexOf(dm.keywords[j]) !== -1) score += dm.keywords[j].length;
      }
      // > 确保先匹配的领域优先（love 在 family 之前，感情相关优先归入感情）
      if (score > bestScore && score > 0) {
        bestScore = score;
        best = dk;
      }
    }
    // 兜底：如果关键词没匹配到，尝试模糊匹配
    // 注意：模糊匹配使用多字符词组，避免单字符过于宽泛导致误匹配
    if (!best) {
      var fuzzyMap = [
        {
          regex:
            /感情|爱情|恋爱|婚姻|分手|复合|对象|伴侣|表白|暗恋|相亲|单身|脱单|出轨|暧昧|缘分|正缘|桃花|姻缘|离婚|结婚|夫妻|未婚|已婚|分居|复婚|再婚|老公|老婆|吵架|冷战|配偶|二婚|嫁人|娶媳/,
          domain: 'love',
        },
        { regex: /财运|财富|钱|投资|理财|股票|基金|收入|债务|亏损|赚钱|花销|贷款|买房|买车/, domain: 'wealth' },
        { regex: /健康|身体|疾病|生病|康复|手术|体检|失眠|头痛|养生|减肥|怀孕|平安/, domain: 'health' },
        { regex: /学业|考试|学习|成绩|高考|考研|考证|升学|毕业|论文|学校|专业|录取|分数|挂科|读书/, domain: 'study' },
        {
          regex:
            /家庭|家人|亲情|父母|子女|孩子|婆媳|亲戚|长辈|兄弟姐妹|公公|婆婆|岳父|岳母|继母|继父|养父|养母|独生子|独生女|亲家|后代|生育|代沟|家教|家风|祖孙|传宗|香火|过继|领养|原生家庭|家庭矛盾|父母婚姻|子女婚姻/,
          domain: 'family',
        },
        { regex: /朋友|社交|人际|合作|合伙|纠纷|小人|贵人|人脉|客户|竞争|对手|和解|背叛/, domain: 'social' },
        { regex: /出行|旅游|出国|移民|远行|搬家|出差|旅行|签证|留学|航班|旅途|异地/, domain: 'travel' },
        {
          regex:
            /工作|职场|升职|跳槽|创业|生意|老板|同事|项目|前途|职业|公司|企业|单位|面试|求职|转行|晋升|公务员|考公|体制|行业|发展|上班|辞职|离职|招聘|应聘|加班|薪资|待遇|家族企业|继承家业/,
          domain: 'career',
        },
        {
          regex:
            /运势|命运|运气|前程|整体|综合|人生|未来|怎么样|如何|好不好|顺利|吉凶|好坏|走向|趋势|近况|前路|前景|天命|命数|造化/,
          domain: 'general',
        },
      ];
      for (var fi = 0; fi < fuzzyMap.length; fi++) {
        if (fuzzyMap[fi].regex.test(q)) {
          best = fuzzyMap[fi].domain;
          break;
        }
      }
    }
    return best || 'general';
  }

  /* ========== 三、各术数的事域解读模板 ========== */

  // 五行映射
  var GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
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
  var WX_SHENG = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' };
  var WX_KE = { 木: '金', 火: '水', 土: '木', 金: '火', 水: '土' };
  var WX_SHENG_BY = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
  var WX_KE_BY = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };

  /** 从八字结果计算十神信息 */
  function calcBaziShiShen(bazi) {
    bazi = bazi || {};
    var dm = bazi.日主 || '甲';
    var dwx = bazi.日主五行 || '木';
    var pillars = {
      年柱: bazi.年柱 || '甲子',
      月柱: bazi.月柱 || '甲子',
      日柱: bazi.日柱 || '甲子',
      时柱: bazi.时柱 || '甲子',
    };
    var keys = ['年柱', '月柱', '日柱', '时柱'];
    var result = {};

    // 十神判定规则
    function getShiShen(dayGan, otherGan) {
      var dw = GAN_WX[dayGan],
        ow = GAN_WX[otherGan];
      if (dw === ow) return GAN_WX[dayGan + '阳'] === GAN_WX[otherGan + '阳'] ? '比肩' : '劫财';
      if (WX_SHENG[dw] === ow) return '正印';
      if (WX_SHENG_BY[dw] === ow) return '食神';
      if (WX_KE[dw] === ow) return '正官';
      if (WX_KE_BY[dw] === ow) return '正财';
      return '?';
    }

    // 统计各十神出现次数
    var counts = { 正官: 0, 七杀: 0, 正印: 0, 偏印: 0, 比肩: 0, 劫财: 0, 食神: 0, 伤官: 0, 正财: 0, 偏财: 0 };
    var details = [];
    for (var i = 0; i < keys.length; i++) {
      var gz = pillars[keys[i]];
      var gan = gz[0],
        zhi = gz[1];
      var ss = getShiShen(dm, gan);
      counts[ss] = (counts[ss] || 0) + 1;
      details.push({ pillar: keys[i], gan: gan, zhi: zhi, shiShen: ss, ganWx: GAN_WX[gan], zhiWx: ZHI_WX[zhi] });
    }

    // 日支十神
    var dayZhi = bazi.日支;
    var dayZhiWx = ZHI_WX[dayZhi];
    var dayZhiSS = '';
    if (dayZhiWx === dwx) dayZhiSS = '比劫';
    else if (WX_SHENG[dwx] === dayZhiWx) dayZhiSS = '印星';
    else if (WX_SHENG_BY[dwx] === dayZhiWx) dayZhiSS = '食伤';
    else if (WX_KE[dwx] === dayZhiWx) dayZhiSS = '官杀';
    else if (WX_KE_BY[dwx] === dayZhiWx) dayZhiSS = '财星';

    return { counts: counts, details: details, dayZhiSS: dayZhiSS, dayZhiWx: dayZhiWx };
  }

  /**
   * 八字命理 → 事域解读（深度版 — 引用具体命盘数据）
   */
  function analyzeBazi(result, question, domainKey) {
    result = result || {};
    var dm = DOMAINS[domainKey];
    var dayMaster = result.日柱 && result.日柱.length > 0 ? result.日柱[0] : '?';
    var dayWx = result.日主五行 || '';
    var dayZhi = result.日支 || '';
    var shiShen = calcBaziShiShen(result);

    var lines = [];
    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');

    // 命盘概况
    var pillars =
      (result.年柱 || '?') + ' ' + (result.月柱 || '?') + ' ' + (result.日柱 || '?') + ' ' + (result.时柱 || '?');
    lines.push(
      '命盘：' +
        pillars +
        '  |  日主' +
        dayMaster +
        '（五行' +
        dayWx +
        '）|  日支' +
        dayZhi +
        '（' +
        shiShen.dayZhiSS +
        '）'
    );
    lines.push('');

    // 基于各柱十神做具体分析
    lines.push('【命盘逐柱分析】');
    for (var i = 0; i < shiShen.details.length; i++) {
      var d = shiShen.details[i];
      lines.push(d.pillar + '：' + d.gan + '（' + d.ganWx + '，' + d.shiShen + '）' + d.zhi + '（' + d.zhiWx + '）');
    }
    lines.push('');

    // 事域专项分析
    lines.push('【' + dm.name + '专项研判】');
    var domainAnalysis = analyzeBaziDomain(dayMaster, dayWx, dayZhi, shiShen, domainKey, result);
    lines.push(domainAnalysis);
    lines.push('');

    // 因果链
    lines.push('【因果推演】');
    lines.push(buildBaziCausalChain(dayMaster, dayWx, shiShen, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }

    return lines.join('\n');
  }

  /** 八字事域深度分析（引用具体数据） */
  function analyzeBaziDomain(dm, dwx, dayZhi, ss, domainKey, bazi) {
    var lines = [];
    var hasGuan = ss.counts.正官 + ss.counts.七杀 > 0;
    var hasYin = ss.counts.正印 + ss.counts.偏印 > 0;
    var hasCai = ss.counts.正财 + ss.counts.偏财 > 0;
    var hasShiShang = ss.counts.食神 + ss.counts.伤官 > 0;
    var hasBiJie = ss.counts.比肩 + ss.counts.劫财 > 0;

    // 找出各柱的十神
    var nianSS = ss.details[0].shiShen;
    var yueSS = ss.details[1].shiShen;
    var riSS = ss.details[2].shiShen;
    var shiSS = ss.details[3].shiShen;

    switch (domainKey) {
      case 'career':
        lines.push('事业看官杀（正官/七杀）和印星（正印/偏印）。');
        if (hasGuan) {
          var guanPillars = [];
          for (var i = 0; i < ss.details.length; i++) {
            if (ss.details[i].shiShen === '正官' || ss.details[i].shiShen === '七杀') {
              guanPillars.push(ss.details[i].pillar + '临' + ss.details[i].shiShen);
            }
          }
          lines.push(
            '√ 您的命盘中' + guanPillars.join('、') + '，说明事业方面有官星照临，天生具备管理能力和职场竞争力。'
          );
          if (yueSS === '正官' || yueSS === '七杀') {
            lines.push('  月柱为事业宫，' + yueSS + '坐月令，主中年事业有成，35-45岁是职业黄金期。');
          }
        } else {
          lines.push('△ 命盘中官杀不显，事业上需靠自身努力打拼，不宜依赖体制或等待晋升，更适合自主创业或自由职业。');
        }
        if (hasYin) {
          lines.push('√ 印星护身，主有贵人相助、学习能力强。' + dwx + '日主得印生扶，在专业领域深耕可获成就。');
        }
        if (dwxyCheck(dwx, ss)) {
          lines.push('△ 日主' + dm + '（' + dwx + '）在命局中力量偏弱，需注意职场压力管理和精力分配。');
        }

        // 五行-行业匹配分析
        lines.push('');
        lines.push('【五行-行业匹配】');
        lines.push('您的日主五行属' + dwx + '，以下是五行与职业的对应关系：');
        var wxIndustry = {
          木: '五行属木，主生发、条达。适合行业：教育、文化传媒、出版、医疗健康、环保、园林、设计、咨询。木主"仁"，宜从事与人打交道、帮助他人成长的工作。',
          火: '五行属火，主炎上、光明。适合行业：互联网科技、能源、餐饮、娱乐、传媒、美容、电力、照明。火主"礼"，宜从事需要热情和创意的工作。',
          土: '五行属土，主承载、厚重。适合行业：房地产、建筑、金融、农业、矿产、仓储、保险、公务员。土主"信"，宜从事需要稳定性和责任心的工作。',
          金: '五行属金，主变革、锋利。适合行业：金融投资、法律、机械制造、珠宝、军警、审计、精密仪器。金主"义"，宜从事需要决断力和规则感的工作。',
          水: '五行属水，主润下、智慧。适合行业：物流贸易、旅游、渔业、水利、销售、公关、心理咨询、自由职业。水主"智"，宜从事需要灵活应变和沟通能力的工作。',
        };
        lines.push(wxIndustry[dwx] || '');
        // 五行相生行业拓展
        var shengWx = WX_SHENG_BY[dwx];
        var shengExpand = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
        var expandWx = shengExpand[dwx];
        lines.push(
          '日主' +
            dwx +
            '生' +
            shengWx +
            '，' +
            shengWx +
            '行业可作为第二选择（如' +
            (wxIndustry[shengWx] || '').substring(0, 30) +
            '...）。'
        );

        // 职业路径对比
        lines.push('');
        lines.push('【职业路径对比】');
        var guanScore = ss.counts.正官 + ss.counts.七杀;
        var shiShangScore = ss.counts.食神 + ss.counts.伤官;
        var yinScore = ss.counts.正印 + ss.counts.偏印;
        var caiScore = ss.counts.正财 + ss.counts.偏财;

        lines.push('路径A：体制内（公务员/事业单位/国企）');
        lines.push('  - 命理依据：正官星代表体制、稳定、规则。正印星代表学习能力、考试运。');
        lines.push('  - 您的官星数：' + guanScore + '个，印星数：' + yinScore + '个。');
        if (guanScore >= 2 && yinScore >= 1) {
          lines.push('  √ 官印相生，非常适合体制内发展。官星旺则考试运佳，印星足则能适应体制规则。');
        } else if (guanScore >= 1) {
          lines.push('  → 官星有根，体制内有一定竞争力，但需加强印星（学习、考证）来补足。');
        } else {
          lines.push('  △ 官星不显，体制内晋升较慢，若执意考公需付出更多努力。');
        }

        lines.push('');
        lines.push('路径B：互联网/私企/创业（体制外）');
        lines.push('  - 命理依据：食伤星代表创新、灵活、技术能力。财星代表商业头脑、变现能力。');
        lines.push('  - 您的食伤数：' + shiShangScore + '个，财星数：' + caiScore + '个。');
        if (shiShangScore >= 2 || caiScore >= 2) {
          lines.push('  √ 食伤或财星旺，适合体制外发展。食伤旺则创新能力强，财星旺则商业嗅觉敏锐。');
        } else if (shiShangScore + caiScore >= 1) {
          lines.push('  → 有一定体制外潜力，但需借助团队或平台来放大自身优势。');
        } else {
          lines.push('  △ 食伤财星不显，体制外发展需更多积累，建议先在大平台锻炼。');
        }

        lines.push('');
        lines.push('【综合建议】');
        if (guanScore >= 2 && yinScore >= 1) {
          lines.push('→ 命局官印有力，体制内（公务员/事业单位/国企）是更优选择。');
        } else if (shiShangScore >= 2 || caiScore >= 2) {
          lines.push('→ 命局食伤/财星有力，互联网/私企/创业更有发展空间。');
        } else if (guanScore >= 1 && shiShangScore >= 1) {
          lines.push('→ 官星与食伤并存，建议先体制内积累资源，再择机转向体制外或副业。');
        } else {
          lines.push('→ 命局事业星偏弱，建议先提升专业技能（印星），以能力而非运势驱动事业。');
        }
        break;

      case 'love':
        lines.push('感情看日支（配偶宫）和财官星。');
        lines.push('日支' + dayZhi + '为配偶宫，五行属' + ss.dayZhiWx + '，属' + ss.dayZhiSS + '。');
        if (ss.dayZhiSS === '财星') {
          lines.push('√ 配偶宫坐财星，主配偶经济能力强或感情中物质基础较好。');
        } else if (ss.dayZhiSS === '官杀') {
          lines.push('√ 配偶宫坐官星，主配偶事业有成或有社会地位，但感情中需注意权力平衡。');
        } else if (ss.dayZhiSS === '印星') {
          lines.push('→ 配偶宫坐印星，主配偶性格温和顾家，但感情中可能缺乏激情，需主动经营浪漫。');
        } else if (ss.dayZhiSS === '食伤') {
          lines.push('△ 配偶宫坐食伤，主感情中表达欲望强，但需注意言语分寸，避免因直率伤及对方。');
        } else {
          lines.push('→ 配偶宫坐比劫，主感情中竞争意识强，需注意第三方干扰，加强信任建设。');
        }
        if ((hasCai && dm === '男') || (hasGuan && dm === '女')) {
          lines.push('√ 命局中配偶星（男看财/女看官）得位，正缘运佳。');
        }
        if (dayZhi === '子' || dayZhi === '午' || dayZhi === '卯' || dayZhi === '酉') {
          lines.push('★ 日支为桃花位（' + dayZhi + '），异性缘佳，但也需注意感情中的三角关系。');
        }
        break;

      case 'wealth':
        lines.push('财运看财星（正财/偏财）和财库。');
        if (hasCai) {
          var caiPillars = [];
          for (var i = 0; i < ss.details.length; i++) {
            if (ss.details[i].shiShen === '正财' || ss.details[i].shiShen === '偏财') {
              caiPillars.push(ss.details[i].pillar + '临' + ss.details[i].shiShen);
            }
          }
          lines.push('√ ' + caiPillars.join('、') + '，财星入命，天生具备赚钱能力。');
          if (shiSS === '正财' || shiSS === '偏财') {
            lines.push('  时柱为财库之位，' + shiSS + '坐时柱，主晚年财运丰足，宜做长期理财规划。');
          }
        } else {
          lines.push('△ 财星不显，不宜投机或高风险投资，应以正职收入为主，稳健理财。');
        }
        // 财库检查
        var caiWx = WX_KE_BY[dwx];
        var kuMap = { 木: '未', 火: '戌', 土: '辰', 金: '丑', 水: '辰' };
        var caiKu = kuMap[caiWx];
        var hasKu =
          bazi.年柱.indexOf(caiKu) >= 0 ||
          bazi.月柱.indexOf(caiKu) >= 0 ||
          bazi.日柱.indexOf(caiKu) >= 0 ||
          bazi.时柱.indexOf(caiKu) >= 0;
        if (hasKu) {
          lines.push('√ 命局带财库（' + caiKu + '），主有积蓄能力，财来能聚。');
        }
        if (hasBiJie && hasCai) {
          lines.push('⚠ 比劫与财星同现，需注意合伙中的财务纠纷，不宜与人合财。');
        }
        break;

      case 'health':
        var wxBody = { 木: '肝胆', 火: '心血管', 土: '脾胃', 金: '肺与呼吸系统', 水: '肾脏与泌尿系统' };
        var keWx = WX_KE[dwx];
        lines.push('健康看五行平衡和日主强弱。');
        lines.push('日主' + dm + '五行属' + dwx + '，对应身体部位：' + (wxBody[dwx] || '全身') + '。');
        if (hasYin) {
          lines.push('√ 印星护身（' + (ss.counts.正印 + ss.counts.偏印) + '个），主恢复能力强，抗病能力好。');
        }
        // 检查是否有克日主的五行过旺
        var keCount = 0;
        for (var i = 0; i < ss.details.length; i++) {
          if (ss.details[i].ganWx === keWx) keCount++;
          if (ss.details[i].zhiWx === keWx) keCount++;
        }
        if (keCount >= 3) {
          lines.push(
            '⚠ ' +
              keWx +
              '在命局中偏旺（出现' +
              keCount +
              '次），克制日主' +
              dwx +
              '，需重点关注' +
              (wxBody[dwx] || '') +
              '健康。'
          );
        }
        lines.push('→ 建议：每季度体检一次，重点关注' + (wxBody[dwx] || '') + '指标。');
        break;

      case 'study':
        lines.push('学业看印星（正印/偏印）和食伤（食神/伤官）。');
        if (hasYin) {
          lines.push(
            '√ 印星' + (ss.counts.正印 + ss.counts.偏印) + '个，主学习能力强、记忆力好，适合系统性的学术研究。'
          );
          if (yueSS === '正印' || yueSS === '偏印') {
            lines.push('  月柱为学业宫，印星坐月令，青少年时期学业运势佳，考试运强。');
          }
        }
        if (hasShiShang) {
          lines.push(
            '√ 食伤' + (ss.counts.食神 + ss.counts.伤官) + '个，主创造力强、思维活跃，适合需要创新思维的学科。'
          );
        }
        if (!hasYin && !hasShiShang) {
          lines.push('→ 印星食伤不显，学习需付出更多努力，但扎实程度反而更高，适合实践型学习。');
        }
        break;

      case 'family':
        lines.push('家庭看月柱（父母宫）、日支（配偶宫）、时柱（子女宫）。');
        lines.push('月柱' + (bazi.月柱 || '') + '为父母宫，' + ss.details[1].shiShen + '坐月令。');
        if (ss.details[1].shiShen === '正印' || ss.details[1].shiShen === '偏印') {
          lines.push('√ 月柱临印星，与母亲缘分深厚，得长辈庇护。');
        }
        lines.push('日支' + dayZhi + '为配偶宫，属' + ss.dayZhiSS + '。');
        lines.push('时柱' + (bazi.时柱 || '') + '为子女宫，' + ss.details[3].shiShen + '坐时柱。');
        if (ss.details[3].shiShen === '食神' || ss.details[3].shiShen === '伤官') {
          lines.push('√ 时柱临食伤，子女聪明伶俐，晚年有子女福。');
        }
        break;

      case 'social':
        lines.push('人际看比劫（比肩/劫财）和印星。');
        if (hasBiJie) {
          lines.push('√ 比劫' + (ss.counts.比肩 + ss.counts.劫财) + '个，主社交能力强、朋友多。');
          if (ss.counts.劫财 > ss.counts.比肩) {
            lines.push('  劫财多于比肩，朋友中需注意利益冲突，合伙事宜需谨慎。');
          }
        }
        if (hasYin) {
          lines.push('√ 印星' + (ss.counts.正印 + ss.counts.偏印) + '个，主贵人运佳，易得长辈或上级赏识。');
        }
        break;

      case 'travel':
        lines.push('出行看马星（寅申巳亥）。');
        var maStars = [];
        for (var i = 0; i < ss.details.length; i++) {
          var zhi = ss.details[i].zhi;
          if (zhi === '寅' || zhi === '申' || zhi === '巳' || zhi === '亥') {
            maStars.push(ss.details[i].pillar + '(' + zhi + ')');
          }
        }
        if (maStars.length > 0) {
          lines.push('√ 命带马星：' + maStars.join('、') + '，主一生多动，宜在外发展或经常出差。');
        } else {
          lines.push('→ 命局无马星，宜安居乐业，不宜频繁远行。');
        }
        break;

      case 'general':
        lines.push('综合运势看日主强弱和五行平衡。');
        lines.push('日主' + dm + '（' + dwx + '）在命局中的状态是运势的根基。');
        if (hasYin) {
          lines.push('√ 印星护身（' + (ss.counts.正印 + ss.counts.偏印) + '个），主一生有贵人庇护，运势有根基。');
        }
        if (hasGuan) {
          lines.push('√ 官星照命（' + (ss.counts.正官 + ss.counts.七杀) + '个），主事业有方向，人生有目标。');
        }
        if (hasCai) {
          lines.push('√ 财星入命（' + (ss.counts.正财 + ss.counts.偏财) + '个），主财富运势在线，物质生活有保障。');
        }
        // 日主强弱综合判断
        var strongCount = ss.counts.正印 + ss.counts.偏印 + ss.counts.比肩 + ss.counts.劫财;
        var weakCount =
          ss.counts.正官 + ss.counts.七杀 + ss.counts.食神 + ss.counts.伤官 + ss.counts.正财 + ss.counts.偏财;
        if (strongCount >= 3) {
          lines.push('→ 命局中印比之力充足（' + strongCount + '个），日主偏强，整体运势以稳健为主，守成优于开拓。');
        } else if (weakCount >= 3) {
          lines.push('→ 命局中财官食伤之力偏重（' + weakCount + '个），日主偏弱，需借运势之助，宜顺势而为。');
        } else {
          lines.push('→ 命局五行相对均衡，运势起伏平稳，宜顺势而为，不过分强求。');
        }
        // 五行均衡分析
        var wxCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
        for (var i = 0; i < ss.details.length; i++) {
          wxCount[ss.details[i].ganWx] = (wxCount[ss.details[i].ganWx] || 0) + 1;
          wxCount[ss.details[i].zhiWx] = (wxCount[ss.details[i].zhiWx] || 0) + 1;
        }
        var missingWx = [];
        for (var wk in wxCount) {
          if (wxCount[wk] === 0) missingWx.push(wk);
        }
        if (missingWx.length > 0) {
          lines.push('△ 命局五行缺' + missingWx.join('、') + '，对应领域可能成为人生的短板，需有意识补足。');
        }
        var wxBody = {
          木: '肝胆与决策力',
          火: '心血管与热情',
          土: '脾胃与诚信',
          金: '呼吸系统与决断力',
          水: '肾脏与智慧',
        };
        var weakWx = [];
        for (var wk in wxCount) {
          if (wxCount[wk] === 1) weakWx.push(wk);
        }
        if (weakWx.length > 0) {
          lines.push(
            '→ 五行偏弱领域：' +
              weakWx
                .map(function (w) {
                  return w + '（' + (wxBody[w] || '') + '）';
                })
                .join('、') +
              '，需重点养护。'
          );
        }
        break;
    }

    return lines.join('\n');
  }

  /** 日主强弱检查 */
  function dwxyCheck(dwx, ss) {
    var shengCount = 0;
    for (var i = 0; i < ss.details.length; i++) {
      if (ss.details[i].ganWx === WX_SHENG[dwx]) shengCount++;
      if (ss.details[i].zhiWx === WX_SHENG[dwx]) shengCount++;
    }
    return shengCount < 2;
  }

  /** 构建因果链 */
  function buildBaziCausalChain(dm, dwx, ss, domainKey) {
    var lines = [];
    lines.push('为什么得出上述结论？以下是命盘中具体依据的因果链条：');
    lines.push('');

    for (var i = 0; i < ss.details.length; i++) {
      var d = ss.details[i];
      var cause = d.pillar + '天干' + d.gan + '（' + d.ganWx + '）为日主' + dm + '之' + d.shiShen;
      var effect = '';
      switch (d.shiShen) {
        case '正官':
          effect = '→ 正官主事业、纪律、责任，此生事业运有基础支撑，宜走正规职业路径';
          break;
        case '七杀':
          effect = '→ 七杀主压力、竞争、突破，此生需经历挑战方能成就，宜在高压环境中成长';
          break;
        case '正印':
          effect = '→ 正印主学识、贵人、庇护，学习能力和贵人运是核心优势';
          break;
        case '偏印':
          effect = '→ 偏印主特殊才能、偏门学问，适合在细分领域深耕';
          break;
        case '正财':
          effect = '→ 正财主稳定收入、积蓄能力，正职收入是财富基石';
          break;
        case '偏财':
          effect = '→ 偏财主意外之财、投资运，但需注意风险控制';
          break;
        case '食神':
          effect = '→ 食神主创造力、享受、表达，天赋在创意和沟通领域';
          break;
        case '伤官':
          effect = '→ 伤官主才华外露、不拘一格，但需注意锋芒太露';
          break;
        case '比肩':
          effect = '→ 比肩主自我、独立、竞争，宜独立发展不依赖他人';
          break;
        case '劫财':
          effect = '→ 劫财主社交、合作、分享，但需注意利益分配';
          break;
        default:
          effect = '';
      }
      lines.push(cause + ' ' + effect);
    }

    // 日支特别说明
    lines.push('');
    lines.push('日支' + ss.details[2].zhi + '为配偶宫兼自身根基，属' + ss.dayZhiSS + '，这意味着：');
    switch (ss.dayZhiSS) {
      case '财星':
        lines.push('→ 您的内在驱动力与经济利益相关，对物质安全感有天然需求');
        break;
      case '官杀':
        lines.push('→ 您的内在驱动力与社会地位相关，对成就感和认可有天然需求');
        break;
      case '印星':
        lines.push('→ 您的内在驱动力与知识和安全感相关，对学习和稳定有天然需求');
        break;
      case '食伤':
        lines.push('→ 您的内在驱动力与自我表达相关，对创造和自由有天然需求');
        break;
      case '比劫':
        lines.push('→ 您的内在驱动力与自我实现相关，对独立和掌控有天然需求');
        break;
    }

    return lines.join('\n');
  }

  /**
   * 六爻 → 事域解读（深度版——引用具体卦象数据）
   */
  function analyzeLiuyao(result, question, domainKey) {
    var dm = DOMAINS[domainKey];
    var guaName = result.gua_name || '未知卦';
    var changedName = result.changed_gua && result.changed_gua.name ? result.changed_gua.name : '';
    var shiYao = result.shi_yao || 0;
    var yingYao = result.ying_yao || 0;
    var dongYao = result.dong_yao || [];
    var liuQin = result.liu_qin || [];
    var liuShou = result.liu_shou || [];
    var najia = result.najia || [];
    var lines = [];

    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');

    // 卦象概览
    lines.push('──────────────────────────────');
    lines.push('卦象：' + guaName + (changedName ? ' → ' + changedName : ''));
    if (result.original_gua && result.original_gua.yao) {
      var yaoDesc = [];
      for (var yi = 0; yi < 6; yi++) {
        var yv = result.original_gua.yao[yi] === 1 ? '⚊' : '⚋';
        var isDong = dongYao.indexOf(yi + 1) >= 0;
        yaoDesc.push('第' + (yi + 1) + '爻' + yv + (isDong ? '动' : ''));
      }
      lines.push('六爻排列（下→上）：' + yaoDesc.join(' | '));
    }
    lines.push('──────────────────────────────');
    lines.push('');

    // 世应关系
    lines.push('【世应关系——卦象核心】');
    lines.push('世爻（您自身）在第' + shiYao + '爻，应爻（所问之事）在第' + yingYao + '爻。');
    var shiYingDist = Math.abs(shiYao - yingYao);
    if (shiYingDist <= 1) {
      lines.push('→ 世应相邻，说明您与此事距离很近，事态发展直接影响您。');
    } else if (shiYingDist >= 3) {
      lines.push('→ 世应相隔较远（' + shiYingDist + '爻），说明您与所问之事之间存在距离或需要时间才能见到结果。');
    } else {
      lines.push('→ 世应距离适中，您与所问之事的关系处于可控范围。');
    }

    if (liuQin.length >= Math.max(shiYao, yingYao)) {
      var shiQin = liuQin[shiYao - 1] || '?';
      var yingQin = liuQin[yingYao - 1] || '?';
      var qinMap = {
        父母: '文书/长辈/庇佑',
        兄弟: '同辈/竞争/分担',
        子孙: '福气/晚辈/解忧',
        妻财: '财运/伴侣/资源',
        官鬼: '事业/官非/压力',
      };
      lines.push('世爻临【' + shiQin + '】（' + (qinMap[shiQin] || '') + '）——这是您当前面对此事的内在状态。');
      lines.push('应爻临【' + yingQin + '】（' + (qinMap[yingQin] || '') + '）——这是所问之事呈现出的外部面貌。');
    }
    lines.push('');

    // 动爻分析
    lines.push('【动爻分析——变化之机】');
    if (dongYao.length > 0) {
      lines.push('本卦共有' + dongYao.length + '个动爻，位于第' + dongYao.join('、') + '爻。');
      lines.push('六爻中动爻为变化之机，动爻越多，事情变化越复杂：');
      for (var di = 0; di < dongYao.length; di++) {
        var dyPos = dongYao[di];
        var dyQin = liuQin[dyPos - 1] || '?';
        var dyShou = liuShou[dyPos - 1] || '';
        var dyNajia = najia[dyPos - 1] || {};
        var dyDesc = '第' + dyPos + '爻动（临' + dyQin;
        if (dyShou) dyDesc += '·' + dyShou;
        if (dyNajia.gan) dyDesc += '·纳' + dyNajia.gan + dyNajia.zhi;
        dyDesc += '）';
        lines.push('  ' + dyDesc);
        // 动爻含义
        if (dyPos === shiYao) {
          lines.push('    → 此动爻恰为世爻！说明变化由您自身引发，主动权在您手中。');
        }
        if (dyPos === yingYao) {
          lines.push('    → 此动爻恰为应爻！说明变化来自外部环境或对方，非您所能完全控制。');
        }
      }
    } else {
      lines.push('本卦六爻俱静，无动爻。这意味着：');
      lines.push('→ 所问之事当前处于稳定状态，短期内不会有结构性变化。');
      lines.push('→ 但这不意味着无事发生——静卦中世爻和应爻的力量对比更为关键。');
    }
    lines.push('');

    // 六亲逐爻分析
    lines.push('【六亲逐爻详解】');
    var yaoLabels = ['初爻（基础）', '二爻（内在）', '三爻（过渡）', '四爻（外部）', '五爻（高位）', '上爻（结果）'];
    for (var qi = 0; qi < 6; qi++) {
      var qin = liuQin[qi] || '?';
      var shou = liuShou[qi] || '';
      var na = najia[qi] || {};
      var marker = '';
      if (qi + 1 === shiYao) marker = ' ← 世爻（您）';
      if (qi + 1 === yingYao) marker = ' ← 应爻（事）';
      if (dongYao.indexOf(qi + 1) >= 0) marker += ' ⚡动爻';
      lines.push(
        yaoLabels[qi] + '：' + qin + (shou ? '·' + shou : '') + (na.gan ? '·' + na.gan + na.zhi : '') + marker
      );
    }
    lines.push('');

    // 事域专项研判
    lines.push('【' + dm.name + '专项研判——基于以上卦象数据】');
    lines.push(
      buildLiuyaoDomainAnalysis(guaName, changedName, shiYao, yingYao, dongYao, liuQin, liuShou, najia, domainKey)
    );
    lines.push('');

    // 因果链
    lines.push('【因果推演——为什么得出以上结论？】');
    lines.push(buildLiuyaoCausalChain(guaName, shiYao, yingYao, dongYao, liuQin, liuShou, najia, domainKey));
    lines.push('');

    // 趋吉避凶
    lines.push('【趋吉避凶——双面视角】');
    lines.push(buildLiuyaoDualityAdvice(guaName, shiYao, yingYao, dongYao, liuQin, liuShou, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }
    return lines.join('\n');
  }

  /** 六爻事域专项研判 */
  function buildLiuyaoDomainAnalysis(guaName, changedName, shi, ying, dong, liuQin, liuShou, najia, domainKey) {
    var out = [];
    var shiQin = liuQin[shi - 1] || '';
    var yingQin = liuQin[ying - 1] || '';
    var shiShou = liuShou[shi - 1] || '';
    var yingShou = liuShou[ying - 1] || '';

    // 找出各六亲在哪些爻
    var qinPositions = {};
    for (var i = 0; i < 6; i++) {
      var q = liuQin[i] || '';
      if (!qinPositions[q]) qinPositions[q] = [];
      qinPositions[q].push(i + 1);
    }

    switch (domainKey) {
      case 'career':
        out.push('事业看官鬼（事业运/压力）和父母（文书/贵人）。');
        var guanPos = qinPositions['官鬼'] || [];
        var fuPos = qinPositions['父母'] || [];
        var caiPos = qinPositions['妻财'] || [];
        var ziPos = qinPositions['子孙'] || [];
        if (guanPos.length > 0) {
          out.push('√ 官鬼爻出现在第' + guanPos.join('、') + '爻，说明事业方面有明确的运势支撑。');
          if (guanPos.indexOf(shi) >= 0) {
            out.push('  官鬼临世爻——事业压力直接压在您身上，但这也意味着您对事业有掌控力。');
          }
          if (guanPos.indexOf(ying) >= 0) {
            out.push('  官鬼临应爻——外部环境对您的事业有要求或期待，需关注外界评价。');
          }
        } else {
          out.push('△ 官鬼爻不显，当前事业运处于低谷期，不宜强求晋升或变动。');
        }
        if (fuPos.length > 0) {
          out.push('√ 父母爻在第' + fuPos.join('、') + '爻，主文书/贵人运。');
          if (fuPos.indexOf(5) >= 0) out.push('  五爻（君位）临父母，有上级或贵人提携之象。');
        }
        if (caiPos.length > 0) {
          out.push('→ 妻财爻在第' + caiPos.join('、') + '爻，财能生官，事业发展的经济基础存在。');
        }

        // 六爻事业路径对比
        out.push('');
        out.push('【职业路径对比】');
        var guanOnShi = guanPos.indexOf(shi) >= 0;
        var fuOnShi = fuPos.indexOf(shi) >= 0;
        var ziOnShi = ziPos.indexOf(shi) >= 0;
        var caiOnShi = caiPos.indexOf(shi) >= 0;
        var shiShouCareer = liuShou[shi - 1] || '';

        out.push('路径A：体制内（公务员/事业单位/国企）');
        if (guanOnShi || fuOnShi) {
          out.push('  √ 世爻临' + shiQin + '，官鬼/父母临世，天生适合体制内发展。');
          if (fuPos.indexOf(5) >= 0) out.push('    五爻父母临贵人位，考公/晋升有贵人提携。');
        } else if (guanPos.length > 0 && fuPos.length > 0) {
          out.push('  → 官鬼与父母爻均在卦中，体制内有基础，但需主动争取。');
        } else {
          out.push('  △ 官鬼/父母爻不临世，体制内发展需付出更多努力。');
        }

        out.push('');
        out.push('路径B：互联网/私企/创业（体制外）');
        if (ziOnShi || caiOnShi) {
          out.push('  √ 世爻临' + shiQin + '，子孙/妻财临世，天生适合体制外发展。');
          out.push('    子孙主创新和自由，妻财主商业头脑，与互联网/创业气场契合。');
        } else if (caiPos.length > 0 && ziPos.length > 0) {
          out.push('  → 妻财与子孙均在卦中，体制外有发展潜力，宜借助平台放大。');
        } else {
          out.push('  △ 妻财/子孙爻不显，体制外发展需更多积累和人脉。');
        }

        // 六兽行业提示
        if (shiShouCareer) {
          out.push('');
          out.push('【行业方向提示（六兽）】');
          switch (shiShouCareer) {
            case '青龙':
              out.push('世爻临青龙→宜从事管理、政府关系、品牌公关、高端服务业。');
              break;
            case '朱雀':
              out.push('世爻临朱雀→宜从事传媒、教育、咨询、法律、演讲培训。');
              break;
            case '勾陈':
              out.push('世爻临勾陈→宜从事地产、基建、农业、传统制造业、行政管理。');
              break;
            case '螣蛇':
              out.push('世爻临螣蛇→宜从事IT技术、科研、心理、创意设计、精密工艺。');
              break;
            case '白虎':
              out.push('世爻临白虎→宜从事军警、医疗、金融风控、竞技体育、机械工程。');
              break;
            case '玄武':
              out.push('世爻临玄武→宜从事水利、物流、贸易、数据分析、网络安全。');
              break;
          }
        }
        break;

      case 'love':
        out.push('感情看妻财（男）或官鬼（女）与世爻的关系。');
        var caiPos = qinPositions['妻财'] || [];
        var guanLovePos = qinPositions['官鬼'] || [];
        out.push('世爻临' + shiQin + '（第' + shi + '爻），应爻临' + yingQin + '（第' + ying + '爻）。');
        if (shiQin === '妻财' || shiQin === '官鬼') {
          out.push('√ 世爻临' + shiQin + '，说明您当前对感情之事有强烈关注，桃花运自身带。');
        }
        if (caiPos.indexOf(ying) >= 0 || guanLovePos.indexOf(ying) >= 0) {
          out.push('√ 应爻临' + yingQin + '，所问之对象（或缘分）对您有实质影响。');
        }
        if (dong.indexOf(shi) >= 0) {
          out.push('★ 世爻发动——感情变化由您主动发起，主动权在您。');
        }
        if (dong.indexOf(ying) >= 0) {
          out.push('★ 应爻发动——对方或外部环境将推动感情变化，您需做好应对。');
        }
        break;

      case 'wealth':
        out.push('财运看妻财爻是否旺相得位。');
        var caiWealthPos = qinPositions['妻财'] || [];
        if (caiWealthPos.length > 0) {
          out.push('√ 妻财爻出现在第' + caiWealthPos.join('、') + '爻。');
          if (caiWealthPos.indexOf(shi) >= 0) out.push('  财临世爻——财运与您自身紧密相关，赚钱能力在线。');
          if (caiWealthPos.indexOf(ying) >= 0) out.push('  财临应爻——外部有赚钱机会，但需主动争取。');
          if (
            dong.some(function (d) {
              return caiWealthPos.indexOf(d) >= 0;
            })
          ) {
            out.push('  ★ 财爻发动——财运将有变动，可能是收入增加或意外支出。');
          }
        } else {
          out.push('△ 妻财爻不显，当前财运一般，不宜投机，以正职收入为主。');
        }
        if (qinPositions['兄弟'] && qinPositions['兄弟'].length > 0) {
          out.push('⚠ 兄弟爻在第' + qinPositions['兄弟'].join('、') + '爻，兄弟克财，需注意合伙财务纠纷或朋友借钱。');
        }
        break;

      case 'health':
        out.push('健康看世爻强弱和官鬼爻（病符）状态。');
        out.push('世爻在第' + shi + '爻临' + shiQin + (shiShou ? '·' + shiShou : '') + '。');
        if (shiQin === '子孙') {
          out.push('√ 世爻临子孙（福神），主身体健康、抗病能力强。');
        } else if (shiQin === '官鬼') {
          out.push('⚠ 世爻临官鬼（病符），需重点关注健康，建议近期体检。');
        }
        var guanHealthPos = qinPositions['官鬼'] || [];
        if (
          guanHealthPos.length > 0 &&
          dong.some(function (d) {
            return guanHealthPos.indexOf(d) >= 0;
          })
        ) {
          out.push('⚠ 官鬼爻动——健康方面有潜在问题需关注，不可掉以轻心。');
        }
        break;

      case 'study':
        out.push('学业看父母爻（文书/成绩）和官鬼爻（考试/功名）。');
        var fuStudyPos = qinPositions['父母'] || [];
        var guanStudyPos = qinPositions['官鬼'] || [];
        if (fuStudyPos.length > 0) {
          out.push('√ 父母爻在第' + fuStudyPos.join('、') + '爻，文书运有基础。');
          if (fuStudyPos.indexOf(shi) >= 0) out.push('  父母临世爻——学习能力强，考试运佳。');
        }
        if (guanStudyPos.length > 0) {
          out.push('√ 官鬼爻在第' + guanStudyPos.join('、') + '爻，功名运有支撑。');
        }
        break;

      case 'family':
        out.push('家庭看父母爻（长辈）和兄弟爻（平辈/家庭关系）。');
        var fuFamPos = qinPositions['父母'] || [];
        var xiongFamPos = qinPositions['兄弟'] || [];
        if (fuFamPos.length > 0) out.push('√ 父母爻在第' + fuFamPos.join('、') + '爻，长辈运势有体现。');
        if (xiongFamPos.length > 0) out.push('→ 兄弟爻在第' + xiongFamPos.join('、') + '爻，家庭关系需注意平衡。');
        if (shiQin === '父母') out.push('√ 世爻临父母，您对家庭有责任感，家人是您的后盾。');
        break;

      case 'social':
        out.push('人际看兄弟爻（朋友/同辈）和应爻（外部关系）。');
        var xiongSocPos = qinPositions['兄弟'] || [];
        if (xiongSocPos.length > 0) {
          out.push('√ 兄弟爻在第' + xiongSocPos.join('、') + '爻，社交运有基础。');
          if (
            dong.some(function (d) {
              return xiongSocPos.indexOf(d) >= 0;
            })
          ) {
            out.push('  兄弟爻动——人际关系将有变动，可能结识新朋友或与旧友产生摩擦。');
          }
        }
        out.push('应爻临' + yingQin + '（第' + ying + '爻），外部关系呈现' + yingQin + '之象。');
        break;

      case 'travel':
        out.push('出行看世爻状态和卦中驿马星（寅申巳亥）。');
        var maZhi = '';
        for (var mi = 0; mi < najia.length; mi++) {
          var nz = (najia[mi] && najia[mi].zhi) || '';
          if (nz === '寅' || nz === '申' || nz === '巳' || nz === '亥') {
            maZhi = nz;
            out.push('√ 第' + (mi + 1) + '爻纳' + najia[mi].gan + nz + '，' + nz + '为驿马，主出行之象。');
          }
        }
        if (!maZhi) out.push('→ 卦中无驿马星，近期出行计划可能推迟。');
        if (dong.indexOf(shi) >= 0) out.push('★ 世爻发动——您自身有出行意愿，宜主动规划。');
        break;
    }

    return out.join('\n');
  }

  /** 六爻因果链 */
  function buildLiuyaoCausalChain(guaName, shi, ying, dong, liuQin, liuShou, najia, domainKey) {
    var out = [];
    out.push('以下是从卦象到结论的完整因果链条：');
    out.push('');

    // 步骤1：卦名含义
    out.push(
      '1. 卦名「' +
        guaName +
        '」本身已蕴含此事的基本性质。六十四卦每卦皆有特定卦德，' +
        guaName +
        '之卦德决定了此事的基调。'
    );

    // 步骤2：世应关系
    out.push('2. 世爻（第' + shi + '爻）与应爻（第' + ying + '爻）的关系是卦象的核心判断依据。');
    if (shi === ying) {
      out.push('   世应同位，说明您与所问之事融为一体，此事对您影响深远。');
    } else if (Math.abs(shi - ying) === 1) {
      out.push('   世应相邻，说明您与所问之事距离很近，变化会迅速传导。');
    } else {
      out.push('   世应相隔' + Math.abs(shi - ying) + '爻，说明此事需要一定时间才能显现结果。');
    }

    // 步骤3：世爻六亲
    out.push('3. 世爻临' + (liuQin[shi - 1] || '?') + '，这是您面对此事的内在状态。');
    var shiQin = liuQin[shi - 1] || '';
    switch (shiQin) {
      case '官鬼':
        out.push('   官鬼主压力和责任——您在此事上感受到较大压力，但压力也是动力。');
        break;
      case '妻财':
        out.push('   妻财主资源和利益——您对此事有明确的利益诉求，驱动力来自实际收益。');
        break;
      case '子孙':
        out.push('   子孙主福气和创造力——您以轻松心态面对此事，反而容易有意外收获。');
        break;
      case '父母':
        out.push('   父母主庇佑和学习——您在此事上有贵人相助或知识储备作为支撑。');
        break;
      case '兄弟':
        out.push('   兄弟主竞争和分担——您在此事上需要与他人合作或竞争，不宜单打独斗。');
        break;
    }

    // 步骤4：动爻影响
    out.push('4. 动爻是变化的关键触发点。');
    if (dong.length > 0) {
      for (var i = 0; i < dong.length; i++) {
        var dp = dong[i];
        out.push('   第' + dp + '爻动（临' + (liuQin[dp - 1] || '?') + '）→ 此处的变化将引发连锁反应。');
        if (dp === shi) out.push('     动在世爻，变化由您主导——您的一举一动将直接影响结果。');
        if (dp === ying) out.push('     动在应爻，变化由外部推动——您需要适应而非对抗。');
      }
    } else {
      out.push('   六爻俱静，无外力触发变化——此事当前处于稳态，但静极则动，需留意变盘信号。');
    }

    // 步骤5：六兽提示
    out.push('5. 六兽（' + (liuShou.join('·') || '—') + '）提供了额外的情境信息。');
    var shiShou = liuShou[shi - 1] || '';
    if (shiShou === '青龙') out.push('   世爻临青龙——喜事临近，有贵人相助之象。');
    else if (shiShou === '朱雀') out.push('   世爻临朱雀——口舌是非需注意，但文书/沟通运佳。');
    else if (shiShou === '白虎') out.push('   世爻临白虎——需注意冲突或健康问题，但破旧立新之机。');
    else if (shiShou === '玄武') out.push('   世爻临玄武——有暗藏之事未显，需多观察少表态。');

    return out.join('\n');
  }

  /**
   * 六爻趋吉避凶——双面视角
   * 为每个事域提供"吉中带凶、凶中有吉"的深度分析
   */
  function buildLiuyaoDualityAdvice(guaName, shi, ying, dong, liuQin, liuShou, domainKey) {
    var out = [];
    var shiQin = liuQin[shi - 1] || '';
    var yingQin = liuQin[ying - 1] || '';
    var shiShou = liuShou[shi - 1] || '';
    var dongCount = dong ? dong.length : 0;

    // 评估当前格局的吉凶倾向
    var posSignals = [];
    var negSignals = [];

    // 正面信号
    if (shiQin === '妻财' || shiQin === '子孙') {
      posSignals.push('世爻临' + shiQin + '，心态积极有利');
    }
    if (shiShou === '青龙' || shiShou === '朱雀') {
      posSignals.push('世爻值' + shiShou + '，有吉神护佑');
    }
    if (dongCount === 1) {
      posSignals.push('一爻独动，事态明朗可掌控');
    }

    // 负面信号
    if (shiQin === '官鬼' || shiQin === '兄弟') {
      negSignals.push('世爻临' + shiQin + '，压力或竞争较大');
    }
    if (shiShou === '白虎' || shiShou === '玄武') {
      negSignals.push('世爻值' + shiShou + '，需防凶险或暗昧之事');
    }
    if (dongCount >= 3) {
      negSignals.push('多爻齐动，局势复杂多变');
    }

    out.push('世间万物皆有阴阳两面，吉非纯吉，凶非纯凶。此卦亦然：');
    out.push('');

    if (posSignals.length > 0) {
      out.push('优势面：' + posSignals.join('；') + '。');
    }
    if (negSignals.length > 0) {
      out.push('风险面：' + negSignals.join('；') + '。');
    }

    // 事域特化趋吉避凶
    switch (domainKey) {
      case 'career':
        out.push('');
        out.push('事业趋吉：专注自身优势领域，在' + shiQin + '所示的方面发力。');
        out.push(
          '事业避凶：避免' +
            (shiQin === '官鬼'
              ? '过度承担压力、卷入办公室政治'
              : shiQin === '兄弟'
                ? '与同事正面竞争、利益分配不清'
                : '急功近利、忽视长期规划') +
            '。'
        );
        out.push(
          '关键：事业不是百米冲刺而是马拉松——' + (dongCount > 0 ? '变动时期保持灵活' : '稳定时期深耕积累') + '。'
        );
        break;
      case 'love':
        out.push('');
        out.push(
          '感情趋吉：' +
            (shiQin === '妻财'
              ? '积极表达，把握缘分'
              : shiQin === '子孙'
                ? '保持轻松心态，不急于求成'
                : '真诚沟通，建立信任') +
            '。'
        );
        out.push(
          '感情避凶：避免' +
            (shiQin === '兄弟'
              ? '因朋友介入而影响感情'
              : shiQin === '官鬼'
                ? '因工作压力忽视对方'
                : '因猜疑和不信任破坏关系') +
            '。'
        );
        out.push('关键：感情中"好"与"不好"往往只在一念之间，经营比选择更重要。');
        break;
      case 'wealth':
        out.push('');
        out.push('财运趋吉：' + (shiQin === '妻财' ? '把握财运机会，积极经营' : '以专业技能或知识积累生财') + '。');
        out.push('财运避凶：避免' + (shiQin === '兄弟' ? '合伙投资、为他人担保' : '冲动消费、高风险投机') + '。');
        out.push('关键：以财养身而非以身殉财——赚钱为生活服务，而非生活为赚钱服务。');
        break;
      case 'health':
        out.push('');
        out.push('健康趋吉：关注' + (shiQin === '官鬼' ? '作息规律和压力管理' : '饮食均衡和适度运动') + '。');
        out.push('健康避凶：避免' + (shiShou === '白虎' ? '高风险活动和过度劳累' : '忽视身体信号、拖延就医') + '。');
        out.push('关键：身体是革命的本钱，健康是最大的财富。');
        break;
      case 'study':
        out.push('');
        out.push(
          '学业趋吉：' + (shiQin === '父母' ? '利考试、文书、进修——把握学习机会' : '保持专注，按计划推进') + '。'
        );
        out.push('学业避凶：避免' + (dongCount >= 2 ? '同时推进太多学习目标' : '临阵磨枪、临时抱佛脚') + '。');
        out.push('关键：学业靠积累而非突击，扎实的基础比天赋更重要。');
        break;
      default:
        out.push('');
        out.push('趋吉：顺势而为，把握机遇，做好当下之事。');
        out.push('避凶：谨慎行事，不冒险，不冲动决策。');
        out.push('关键：吉凶转换往往在一念之间，保持清醒和冷静。');
    }

    return out.join('\n');
  }

  /**
   * 梅花易数 → 事域解读（深度版——引用具体卦象数据）
   */
  function analyzeMeihua(result, question, domainKey) {
    var dm = DOMAINS[domainKey];
    var lines = [];
    var originalGua = result.original_gua || {};
    var mutualGua = result.mutual_gua || {};
    var changedGua = result.changed_gua || {};
    var tiYong = result.ti_yong || {};
    var tiGua = tiYong.ti || {};
    var yongGua = tiYong.yong || {};

    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');

    // 卦象概览
    lines.push('──────────────────────────────');
    lines.push(
      '本卦：' +
        (originalGua.name || '?') +
        '（' +
        (originalGua.upper || '') +
        '上' +
        (originalGua.lower || '') +
        '下）'
    );
    if (mutualGua.name) {
      lines.push('互卦：' + mutualGua.name + '（' + (mutualGua.upper || '') + '上' + (mutualGua.lower || '') + '下）');
    }
    if (changedGua.name) {
      lines.push(
        '变卦：' + changedGua.name + '（' + (changedGua.upper || '') + '上' + (changedGua.lower || '') + '下）'
      );
    }
    lines.push('──────────────────────────────');
    lines.push('');

    // 体用分析
    lines.push('【体用生克——卦象核心】');
    if (tiGua.name && yongGua.name) {
      lines.push('体卦（您自身）：' + tiGua.name + '（五行属' + (tiGua.element || '?') + '）');
      lines.push('用卦（所问之事）：' + yongGua.name + '（五行属' + (yongGua.element || '?') + '）');
      lines.push('体用关系：' + (tiYong.relation || '?'));
      lines.push('');

      var tiWx = tiGua.element || '';
      var yongWx = yongGua.element || '';

      // 五行生克详解
      if (tiYong.relation === '用生体') {
        lines.push('用卦（' + yongWx + '）生体卦（' + tiWx + '）——大吉之象。');
        lines.push('这意味着：所问之事的外部环境对您有利，外界能量会主动滋养您。');
        lines.push('在' + dm.name + '方面，您不需要强行推动，顺势而为即可获得好的结果。');
      } else if (tiYong.relation === '体用比和') {
        lines.push('体卦（' + tiWx + '）与用卦（' + yongWx + '）比和——和谐之象。');
        lines.push('这意味着：您与所问之事处于同一频率，内外统一，没有冲突。');
        lines.push('在' + dm.name + '方面，您只需保持现状，按部就班推进即可。');
      } else if (tiYong.relation === '体克用') {
        lines.push('体卦（' + tiWx + '）克用卦（' + yongWx + '）——可控之象。');
        lines.push('这意味着：您有足够的能力掌控此事，但需要付出努力去"克"制。');
        lines.push('在' + dm.name + '方面，主动权在您手中，但过度用力反而可能适得其反。');
      } else if (tiYong.relation === '体生用') {
        lines.push('体卦（' + tiWx + '）生用卦（' + yongWx + '）——付出之象。');
        lines.push('这意味着：您在此事上需要付出较多精力去滋养对方（或目标）。');
        lines.push('在' + dm.name + '方面，您可能需要先投入才能看到回报，过程辛苦但结果可期。');
      } else if (tiYong.relation === '用克体') {
        lines.push('用卦（' + yongWx + '）克体卦（' + tiWx + '）——压力之象。');
        lines.push('这意味着：外部环境/所问之事对您形成压制，您处于被动位置。');
        lines.push('在' + dm.name + '方面，不宜冒进，需先化解外部压力再图发展。');
      }
    }
    lines.push('');

    // 事域专项研判
    lines.push('【' + dm.name + '专项研判——基于卦象组合】');
    lines.push(buildMeihuaDomainAnalysis(originalGua, mutualGua, changedGua, tiYong, domainKey));
    lines.push('');

    // 因果链
    lines.push('【因果推演——为什么得出以上结论？】');
    lines.push(buildMeihuaCausalChain(originalGua, mutualGua, changedGua, tiYong, domainKey));
    lines.push('');

    // 趋吉避凶
    lines.push('【趋吉避凶——双面视角】');
    lines.push(buildMeihuaDualityAdvice(originalGua, mutualGua, changedGua, tiYong, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }
    return lines.join('\n');
  }

  /** 梅花事域专项研判 */
  function buildMeihuaDomainAnalysis(originalGua, mutualGua, changedGua, tiYong, domainKey) {
    var out = [];
    var rel = tiYong.relation || '';
    var isGood = rel === '用生体' || rel === '体用比和';
    var isBad = rel === '用克体';
    var isNeutral = !isGood && !isBad;
    var origName = originalGua.name || '';
    var mutName = mutualGua.name || '';
    var chgName = changedGua.name || '';
    var tiWx = (tiYong.ti && tiYong.ti.element) || '';
    var yongWx = (tiYong.yong && tiYong.yong.element) || '';

    out.push(
      '本卦「' + origName + '」体现当前状态，互卦「' + mutName + '」揭示内在过程，变卦「' + chgName + '」指向最终结果。'
    );

    switch (domainKey) {
      case 'career':
        out.push('事业看本卦的事业象征和体用生克。');
        if (isGood) {
          out.push('√ 体用关系吉利（' + rel + '），事业前景光明。');
          out.push('  因为：体卦' + tiWx + '得用卦' + yongWx + '之生/比和，说明外部环境对您的事业有利。');
          if (chgName) out.push('  变卦「' + chgName + '」提示：事业发展的最终方向将向' + chgName + '卦德靠拢。');
        } else if (isBad) {
          out.push('⚠ 体用关系不利（' + rel + '），事业上存在阻力。');
          out.push('  因为：用卦' + yongWx + '克体卦' + tiWx + '，说明外部竞争或压力正压制您的发挥。');
          if (mutName) out.push('  互卦「' + mutName + '」提示：过程中需要关注内部团队或自身能力瓶颈。');
        } else {
          out.push('→ 体用关系中（' + rel + '），事业需稳扎稳打。');
          out.push('  因为：体卦' + tiWx + '生用卦' + yongWx + '，说明您需要先付出才能在事业上看到回报。');
        }

        // 梅花五行-行业匹配
        out.push('');
        out.push('【五行-行业方向】');
        var wxIndustryMH = {
          木: '体卦' + tiWx + '→适合教育、文化传媒、医疗、环保、咨询等与人相关的行业。',
          火: '体卦' + tiWx + '→适合互联网、能源、娱乐、餐饮、传媒等需要创意的行业。',
          土: '体卦' + tiWx + '→适合房地产、建筑、金融、农业、公务员等注重稳定的行业。',
          金: '体卦' + tiWx + '→适合金融、法律、机械、军警、审计等需要规则的行业。',
          水: '体卦' + tiWx + '→适合物流、贸易、旅游、销售、咨询等需要灵活的行业。',
        };
        out.push(wxIndustryMH[tiWx] || '体卦' + tiWx + '→请结合自身特长选择行业方向。');

        // 梅花职业路径对比
        out.push('');
        out.push('【职业路径对比】');
        if (isGood) {
          out.push('路径A：体制内（公务员/事业单位/国企）');
          if (rel === '用生体') {
            out.push(
              '  √ 用生体，外部环境有利，考公/晋升有贵人相助。体卦' +
                tiWx +
                '得' +
                yongWx +
                '生，说明体制环境对您友好。'
            );
          } else {
            out.push('  → 体用比和，体制内可稳步发展，但缺乏爆发力，适合长期规划。');
          }
          out.push('');
          out.push('路径B：互联网/私企/创业（体制外）');
          if (rel === '用生体' || rel === '体用比和') {
            out.push('  → 体用关系不错，体制外也能发展，但需注意' + origName + '卦德提示的方向。');
          }
        } else if (isBad) {
          out.push('路径A：体制内（公务员/事业单位/国企）');
          out.push('  ⚠ 用克体，外部环境对您不利，考公/晋升可能遇到阻力。');
          out.push('  互卦「' + mutName + '」提示：过程中需关注' + (mutName || '内在') + '因素。');
          out.push('');
          out.push('路径B：互联网/私企/创业（体制外）');
          out.push('  → 用克体时，体制外反而可能更灵活——私企/创业环境变化快，反而能化解用克体的压力。');
        } else {
          out.push('→ 体生用，无论体制内外，都需要您先付出才能看到回报。');
          out.push('  建议选择自己更有热情的路径，因为"体生用"意味着您需要持续投入能量。');
        }
        break;

      case 'love':
        out.push('感情看本卦的阴阳交感与体用关系。');
        if (isGood) {
          out.push('√ 体用关系吉利（' + rel + '），感情运势上升。');
          out.push('  因为：体卦' + tiWx + '与用卦' + yongWx + '相生/比和，双方气场和谐。');
          if (chgName) out.push('  变卦「' + chgName + '」提示：感情的最终走向，' + chgName + '卦德是感情发展的方向。');
        } else if (isBad) {
          out.push('⚠ 体用关系不利（' + rel + '），感情中可能有波折。');
          out.push('  因为：用卦' + yongWx + '克体卦' + tiWx + '，说明对方或外部环境给您带来压力。');
          if (mutName) out.push('  互卦「' + mutName + '」提示：感情中的内在矛盾需要正视，不宜回避。');
        }
        break;

      case 'wealth':
        out.push('财运看体卦是否得生和卦中财象。');
        if (isGood) {
          out.push('√ 体用关系吉利（' + rel + '），财运有上升空间。');
          out.push('  因为：用卦' + yongWx + '对体卦' + tiWx + '有利，外部财源有流入之势。');
        } else if (isBad) {
          out.push('⚠ 体用关系不利（' + rel + '），财运需谨慎。');
          out.push('  因为：用卦' + yongWx + '克体卦' + tiWx + '，财来财去，不易守住。');
        } else {
          out.push('→ 体用关系中（' + rel + '），财运需主动经营。');
          out.push('  因为：体卦生用卦，您需要先投入资源（时间/金钱/精力）才能获得回报。');
        }
        break;

      case 'health':
        out.push('健康看体卦是否被克。');
        if (isBad) {
          out.push('⚠ 用卦' + yongWx + '克体卦' + tiWx + '，需关注' + tiWx + '对应身体部位的健康。');
          var wxBody = { 木: '肝胆', 火: '心血管', 土: '脾胃', 金: '肺与呼吸系统', 水: '肾脏与泌尿系统' };
          out.push('  ' + tiWx + '对应' + (wxBody[tiWx] || '全身') + '，建议重点检查。');
        } else {
          out.push('√ 体用关系不克，健康状态稳定。');
        }
        if (mutName) out.push('  互卦「' + mutName + '」提示：健康的内在变化需通过定期体检来监测。');
        break;

      case 'study':
        out.push('学业看体卦是否得生和本卦卦德。');
        if (isGood) {
          out.push('√ 体用关系吉利（' + rel + '），学业运势上升。');
          out.push('  因为：用卦' + yongWx + '对体卦' + tiWx + '有利，考试/学习环境对您友好。');
        } else {
          out.push('→ 体用关系需努力（' + rel + '），学业需付出更多。');
          out.push('  但' + origName + '卦德提示：扎实的学习态度比天赋更重要。');
        }
        break;

      case 'family':
        out.push('家庭看本卦的阴阳和谐程度。');
        out.push('本卦「' + origName + '」的卦德对家庭关系有直接影响。');
        if (isGood) {
          out.push('√ 体用关系吉利，家庭和睦，沟通顺畅。');
        } else if (isBad) {
          out.push('⚠ 体用关系不利，家庭可能有矛盾。');
          if (mutName) out.push('  互卦「' + mutName + '」提示：矛盾的核心在于内在沟通方式，非表面问题。');
        }
        break;

      case 'social':
        out.push('人际看体卦与用卦的互动关系。');
        out.push('体卦' + tiWx + '与用卦' + yongWx + '的' + rel + '关系决定了人际交往的基调。');
        if (isGood) {
          out.push('√ 体用关系吉利，人际关系和谐，适合拓展人脉。');
        } else if (isBad) {
          out.push('⚠ 用克体，人际关系中可能遇到强势方或小人，需保持警惕。');
        }
        break;

      case 'travel':
        out.push('出行看本卦是否有动象和体卦状态。');
        if (origName.indexOf('旅') >= 0 || origName.indexOf('行') >= 0 || origName.indexOf('动') >= 0) {
          out.push('√ 本卦「' + origName + '」卦名含动象，出行之兆已显。');
        }
        if (isBad) {
          out.push('⚠ 用克体，出行需注意安全，不宜冒险。');
        } else {
          out.push('→ 体用关系可出行，但需做好充分准备。');
        }
        break;
    }

    return out.join('\n');
  }

  /** 梅花因果链 */
  function buildMeihuaCausalChain(originalGua, mutualGua, changedGua, tiYong, domainKey) {
    var out = [];
    out.push('以下是从卦象到结论的完整因果链条：');
    out.push('');

    var origName = originalGua.name || '?';
    var mutName = mutualGua.name || '';
    var chgName = changedGua.name || '';
    var tiName = (tiYong.ti && tiYong.ti.name) || '?';
    var yongName = (tiYong.yong && tiYong.yong.name) || '?';
    var tiWx = (tiYong.ti && tiYong.ti.element) || '?';
    var yongWx = (tiYong.yong && tiYong.yong.element) || '?';

    out.push(
      '1. 本卦「' +
        origName +
        '」由' +
        tiName +
        '（体卦，' +
        tiWx +
        '）和' +
        yongName +
        '（用卦，' +
        yongWx +
        '）组成。'
    );
    out.push('   体卦代表您自身，用卦代表所问之事。这是梅花易数最基础的判断框架。');
    out.push('');

    out.push('2. 体用五行生克——' + tiWx + '与' + yongWx + '的关系为「' + (tiYong.relation || '?') + '」。');
    var wxCycle = {
      木: '木生火→火生土→土生金→金生水→水生木',
      火: '火生土→土生金→金生水→水生木→木生火',
      土: '土生金→金生水→水生木→木生火→火生土',
      金: '金生水→水生木→木生火→火生土→土生金',
      水: '水生木→木生火→火生土→土生金→金生水',
    };
    out.push('   五行流转：' + (wxCycle[tiWx] || '') + '。');
    out.push('   在此五行链中，' + tiWx + '与' + yongWx + '的关系决定了吉凶基调。');
    out.push('');

    if (mutName) {
      out.push('3. 互卦「' + mutName + '」揭示事件的内在过程。');
      out.push('   互卦由本卦中间四爻组成，反映事情的内部演变和潜在因素。');
      out.push('   互卦的卦德提示您在过程中需要关注的方向。');
      out.push('');
    }

    if (chgName) {
      out.push('4. 变卦「' + chgName + '」指向事件的最终结果。');
      out.push('   变卦由本卦动爻变化而来，是本卦能量的最终走向。');
      out.push('   如果您在过程中正确应对（参考互卦提示），结果将向' + chgName + '卦德所示的方向发展。');
      out.push('');
    }

    out.push('5. 综上：本卦（当前）→ 互卦（过程）→ 变卦（结果），三卦递进，形成完整的因果链条。');
    out.push('   体用' + (tiYong.relation || '?') + '是贯穿始终的主线，决定了您在此事中需要采取的策略。');

    return out.join('\n');
  }

  /**
   * 梅花易数趋吉避凶——双面视角
   * 为每个事域提供"吉中带凶、凶中有吉"的深度分析
   */
  function buildMeihuaDualityAdvice(originalGua, mutualGua, changedGua, tiYong, domainKey) {
    var out = [];
    var rel = tiYong.relation || '';
    var tiWx = (tiYong.ti && tiYong.ti.element) || '';
    var yongWx = (tiYong.yong && tiYong.yong.element) || '';
    var origName = originalGua.name || '';
    var chgName = changedGua.name || '';

    out.push('世间万物皆有阴阳两面，吉非纯吉，凶非纯凶。此卦亦然：');
    out.push('');

    // 正面信号
    var posSignals = [];
    if (rel === '用生体') {
      posSignals.push('用卦生体卦——外部环境滋养您，贵人相助，运势上扬');
      posSignals.push('所求之事有天时地利之助，事半功倍');
    } else if (rel === '体用比和') {
      posSignals.push('体用比和——内外和谐，气场统一，没有冲突');
      posSignals.push('人脉资源丰富，得朋友同事之力');
    } else if (rel === '体生用') {
      posSignals.push('体生用——付出可积德结缘，长远有利');
      posSignals.push('主动付出能建立信任和口碑');
    }

    // 负面信号
    var negSignals = [];
    if (rel === '用克体') {
      negSignals.push('用卦克体卦——外部环境压制您，压力较大');
      negSignals.push('正面冲突易受损，需防小人暗算');
    } else if (rel === '体克用') {
      negSignals.push('体克用——虽能成事但耗费心力，事倍功半');
      negSignals.push('过度用力可能适得其反，需防资源枯竭');
    } else if (rel === '体用比和') {
      negSignals.push('比和之时易安于现状，缺乏突破动力');
      negSignals.push('同质化竞争加剧，需找到差异化优势');
    } else if (rel === '用生体') {
      negSignals.push('运势虽好，易生依赖心，需防坐享其成');
      negSignals.push('顺利时最易放松警惕，需防乐极生悲');
    }

    if (posSignals.length > 0) {
      out.push('优势面：' + posSignals.join('；') + '。');
    }
    if (negSignals.length > 0) {
      out.push('风险面：' + negSignals.join('；') + '。');
    }

    // 事域特化趋吉避凶
    switch (domainKey) {
      case 'career':
        out.push('');
        out.push(
          '事业趋吉：' +
            (rel === '用生体'
              ? '把握良机，积极进取，所求之事多有成望'
              : rel === '体用比和'
                ? '主动出击，在和谐中寻找突破口'
                : rel === '体生用'
                  ? '先付出后收获，放长线钓大鱼'
                  : '以守为攻，积蓄力量等待时机') +
            '。'
        );
        out.push(
          '事业避凶：避免' +
            (rel === '用克体'
              ? '正面冲突、硬碰硬，宜迂回前进'
              : rel === '体克用'
                ? '过度消耗、用力过猛，需量力而行'
                : '急功近利、盲目扩张，需稳扎稳打') +
            '。'
        );
        if (chgName) {
          out.push('变卦提示：最终走向' + chgName + '卦德，提前了解并做好准备。');
        }
        break;
      case 'love':
        out.push('');
        out.push(
          '感情趋吉：' +
            (rel === '用生体' || rel === '体用比和'
              ? '双方气场和谐，感情运势上升，宜真诚相待'
              : '虽有不顺，但坚持真诚沟通可化解矛盾') +
            '。'
        );
        out.push(
          '感情避凶：避免' +
            (rel === '用克体' ? '因外部压力影响感情，需保护二人世界' : '因猜疑和不信任破坏关系，坦诚是感情的基石') +
            '。'
        );
        break;
      case 'wealth':
        out.push('');
        out.push(
          '财运趋吉：' +
            (rel === '用生体'
              ? '财源有流入之势，宜积极经营'
              : rel === '体生用'
                ? '先投入后回报，长期投资可期'
                : '稳扎稳打，以专业能力积累财富') +
            '。'
        );
        out.push('财运避凶：避免' + (rel === '用克体' ? '高风险投资、冲动消费' : '贪心冒进、不设止损') + '。');
        break;
      case 'health':
        out.push('');
        out.push('健康趋吉：关注' + tiWx + '对应身体部位，保持良好生活习惯。');
        out.push('健康避凶：避免' + (rel === '用克体' ? '过度劳累、忽视身体信号' : '不良生活习惯、拖延就医') + '。');
        break;
      case 'study':
        out.push('');
        out.push(
          '学业趋吉：' + (rel === '用生体' ? '学习环境有利，考试运势佳' : '扎实积累比天赋更重要，坚持就是胜利') + '。'
        );
        out.push('学业避凶：避免临时抱佛脚，学习靠日积月累。');
        break;
      default:
        out.push('');
        out.push('趋吉：顺势而为，把握机遇，做好当下之事。');
        out.push('避凶：谨慎行事，不冒险，不冲动决策。');
    }

    out.push('');
    out.push(
      '关键：吉凶转换往往在一念之间——' +
        (rel === '用生体'
          ? '在顺境中保持谦逊，为将来做准备'
          : rel === '用克体'
            ? '逆境是最快的成长时期，低谷正是积蓄力量之时'
            : '在变动中保持清醒，在稳定中保持进取') +
        '。'
    );

    return out.join('\n');
  }

  /**
   * 奇门遁甲 → 事域解读（深度版——引用具体局象数据）
   */
  function analyzeQimen(result, question, domainKey) {
    var dm = DOMAINS[domainKey];
    var lines = [];
    var juShu = result.ju_shu || 0;
    var isYang = result.is_yang_dun ? '阳遁' : '阴遁';
    var palaces = result.palaces || [];
    var goodAdvice = result.good_advice || '';
    var badAdvice = result.bad_advice || '';

    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');

    // 局象概览
    lines.push('──────────────────────────────');
    lines.push('奇门局数：第' + juShu + '局（' + isYang + '）');
    lines.push(
      isYang ? '阳遁顺布六仪，逆布三奇——阳气上升，宜主动出击。' : '阴遁逆布六仪，顺布三奇——阴气下沉，宜以静制动。'
    );
    lines.push('──────────────────────────────');
    lines.push('');

    // 九宫分析
    if (palaces.length > 0) {
      lines.push('【九宫落位——逐宫分析】');
      var palaceNames = [
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
      for (var pi = 0; pi < Math.min(palaces.length, 9); pi++) {
        var p = palaces[pi] || {};
        var pn = palaceNames[pi] || '第' + (pi + 1) + '宫';
        var pInfo = [];
        if (p.door) pInfo.push('门:' + p.door);
        if (p.star) pInfo.push('星:' + p.star);
        if (p.god) pInfo.push('神:' + p.god);
        if (p.gan) pInfo.push('干:' + p.gan);
        if (pInfo.length > 0) {
          lines.push(pn + '：' + pInfo.join(' | '));
        }
      }
      lines.push('');
    }

    // 事域专项研判
    lines.push('【' + dm.name + '专项研判——基于奇门局象】');
    lines.push(buildQimenDomainAnalysis(juShu, isYang, palaces, goodAdvice, badAdvice, domainKey));
    lines.push('');

    // 因果链
    lines.push('【因果推演——为什么得出以上结论？】');
    lines.push(buildQimenCausalChain(juShu, isYang, palaces, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }
    return lines.join('\n');
  }

  function buildQimenDomainAnalysis(juShu, isYang, palaces, goodAdvice, badAdvice, domainKey) {
    var out = [];
    out.push('奇门遁甲以时家转盘为框架，' + juShu + '局' + (isYang ? '阳遁' : '阴遁') + '决定了时空的基本格局。');

    var domainFocus = {
      career: '开门（事业门）和值符（大首领）的落宫状态。',
      love: '六合（婚姻门）和乙庚（夫妻星）的落宫状态。',
      wealth: '生门（财门）和戊（资本星）的落宫状态。',
      health: '天芮星（病星）和乙奇（药星）的落宫状态。',
      study: '天辅星（文曲星）和丁奇（文书星）的落宫状态。',
      family: '值使门和太岁（年干）的落宫状态。',
      social: '六合（和合神）和天乙（贵神）的落宫状态。',
      travel: '马星（寅申巳亥）和伤门（车船门）的落宫状态。',
    };
    out.push(domainFocus[domainKey] || domainFocus['career']);

    if (goodAdvice) {
      out.push('√ 吉格提示：' + goodAdvice);
    }
    if (badAdvice) {
      out.push('⚠ 凶格警示：' + badAdvice);
    }

    if (palaces.length > 0) {
      // 找到关键宫位
      for (var i = 0; i < palaces.length; i++) {
        var p = palaces[i] || {};
        if (p.door === '开门' || p.door === '生门' || p.door === '休门') {
          out.push('√ 吉门「' + p.door + '」落宫，对应方位有吉气。');
        }
        if (p.door === '死门' || p.door === '惊门' || p.door === '伤门') {
          out.push('⚠ 凶门「' + p.door + '」落宫，对应方位需避开。');
        }
      }
    }

    if (isYang) {
      out.push('→ 阳遁局中阳气上升，' + dm.name + '方面宜主动推进，把握窗口期。');
    } else {
      out.push('→ 阴遁局中阴气下沉，' + dm.name + '方面宜以静制动，等待时机成熟。');
    }

    // 奇门事业路径对比
    if (domainKey === 'career') {
      out.push('');
      out.push('【职业路径对比】');
      out.push('路径A：体制内（公务员/事业单位/国企）');
      out.push('  - 奇门看开门（事业门）和值符（首领星）的落宫。');
      var hasOpenDoor = false,
        hasShengDoor = false;
      for (var pi = 0; pi < palaces.length; pi++) {
        if (palaces[pi].door === '开门') hasOpenDoor = true;
        if (palaces[pi].door === '生门') hasShengDoor = true;
      }
      if (hasOpenDoor) {
        out.push('  √ 开门落宫，事业门开启，考公/晋升有明确的机会窗口。');
      } else {
        out.push('  → 开门未显，体制内发展需等待时机或主动创造机会。');
      }
      out.push('');
      out.push('路径B：互联网/私企/创业（体制外）');
      if (hasShengDoor) {
        out.push('  √ 生门落宫，生机勃勃，创业/转型有生机，宜把握市场机会。');
      } else {
        out.push('  → 生门未显，体制外发展需先积累资源，不宜贸然创业。');
      }
      out.push(
        '结合奇门' +
          juShu +
          '局' +
          (isYang ? '阳遁' : '阴遁') +
          '：' +
          (isYang ? '宜主动出击，抢占先机。' : '宜以静制动，等待时机成熟。')
      );
    }

    return out.join('\n');
  }

  function buildQimenCausalChain(juShu, isYang, palaces, domainKey) {
    var out = [];
    out.push('以下是从奇门局象到结论的完整因果链条：');
    out.push('');
    out.push('1. 奇门遁甲以时家转盘为框架，' + juShu + '局（' + (isYang ? '阳遁' : '阴遁') + '）是当前时空的"快照"。');
    out.push('   阳遁/阴遁决定了能量流动的基本方向：' + (isYang ? '阳气上升，主动' : '阴气下沉，主静') + '。');
    out.push('');

    out.push('2. 九宫是奇门分析的基本单元。每个宫位包含门、星、神、干四个要素，四者叠加形成吉凶判断。');
    if (palaces.length > 0) {
      out.push('   您的局象中，吉门所在宫位即为有利方位，凶门所在宫位需避开。');
    }
    out.push('');

    out.push('3. 奇门最重"用神"——即与所问之事对应的门、星、神。');
    out.push('   用神落宫的状态直接决定了此事的吉凶。吉门+吉星+吉神=大吉；凶门+凶星=大凶。');
    out.push('');

    out.push('4. 综上，' + juShu + '局' + (isYang ? '阳遁' : '阴遁') + '的时空格局已经确定，');
    out.push('   您在此事上的策略应遵循' + (isYang ? '主动出击' : '以静制动') + '的原则。');

    return out.join('\n');
  }

  /**
   * 太乙神数 → 事域解读（深度版——引用具体神数数据）
   */
  function analyzeTaiyi(result, question, domainKey) {
    var dm = DOMAINS[domainKey];
    var lines = [];
    var jiNian = result.ji_nian || 0;
    var epoch = result.epoch || '';
    var gods = result.gods || [];
    var outcome = result.outcome || '';

    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');

    // 太乙概览
    lines.push('──────────────────────────────');
    lines.push('太乙积年：' + jiNian);
    lines.push('当前纪元：' + (epoch || '?'));
    lines.push('太乙行度：' + (result.taiyi_position || '?'));
    lines.push('──────────────────────────────');
    lines.push('');

    // 十六神分析
    if (gods.length > 0) {
      lines.push('【十六神落位——逐神分析】');
      for (var gi = 0; gi < Math.min(gods.length, 16); gi++) {
        var g = gods[gi] || {};
        if (g.name) {
          lines.push(g.name + '：' + (g.position || '?') + (g.direction ? '（' + g.direction + '）' : ''));
        }
      }
      lines.push('');
    }

    // 事域专项研判
    lines.push('【' + dm.name + '专项研判——基于太乙神数】');
    lines.push(buildTaiyiDomainAnalysis(jiNian, epoch, gods, outcome, domainKey));
    lines.push('');

    // 因果链
    lines.push('【因果推演——为什么得出以上结论？】');
    lines.push(buildTaiyiCausalChain(jiNian, epoch, gods, outcome, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }
    return lines.join('\n');
  }

  function buildTaiyiDomainAnalysis(jiNian, epoch, gods, outcome, domainKey) {
    var out = [];
    out.push('太乙神数以天文推算为基础，积年' + jiNian + '是当前宇宙周期的定位点。');

    var domainFocus = {
      career: '文昌（主文运/事业）和始击（主竞争/挑战）的态势。',
      love: '太乙（主君）和五福（主福气）的态势。',
      wealth: '五福（主福禄）和计神（主谋划）的态势。',
      health: '天乙（主天医）和太乙（主生命力）的态势。',
      study: '文昌（主文曲）和君基（主根基）的态势。',
      family: '臣基（主臣属）和民基（主百姓）的态势。',
      social: '合神（主和合）和太乙的态势。',
      travel: '小游（主出行）和太乙的态势。',
    };
    out.push(domainFocus[domainKey] || domainFocus['career']);

    if (outcome) {
      if (outcome === '利主') {
        out.push('√ 太乙利主——您在此事上处于主场优势，宜守不宜攻，稳坐钓鱼台。');
      } else if (outcome === '利客') {
        out.push('√ 太乙利客——您在此事上宜主动出击，先发制人，抢占先机。');
      } else {
        out.push('→ 太乙' + outcome + '——主客形势平衡，需根据具体情况灵活应对。');
      }
    }

    if (gods.length > 0) {
      out.push('→ 十六神中与' + dm.name + '相关的神煞落位，决定了此事的能量分布。');
      var keyGods = {
        career: ['文昌', '始击', '君基'],
        love: ['太乙', '五福', '合神'],
        wealth: ['五福', '计神', '太乙'],
        health: ['天乙', '太乙', '五福'],
        study: ['文昌', '君基', '太乙'],
        family: ['臣基', '民基', '太乙'],
        social: ['合神', '太乙', '始击'],
        travel: ['小游', '太乙', '文昌'],
      };
      var relevantGods = keyGods[domainKey] || keyGods['career'];
      for (var i = 0; i < gods.length; i++) {
        if (relevantGods.indexOf(gods[i].name) >= 0) {
          out.push('  ' + gods[i].name + '在' + (gods[i].position || '?') + '——' + (gods[i].desc || ''));
        }
      }
    }

    // 太乙事业路径对比
    if (domainKey === 'career') {
      out.push('');
      out.push('【职业路径对比】');
      out.push('路径A：体制内（公务员/事业单位/国企）');
      if (outcome === '利主') {
        out.push('  √ 太乙利主，体制内处于主场优势，考公/晋升运势佳。');
        out.push('    文昌（文运星）若在吉位，考试运更佳。');
      } else if (outcome === '利客') {
        out.push('  → 太乙利客，体制内需主动出击，先发制人才能占得先机。');
      } else {
        out.push('  → 太乙' + (outcome || '主客平衡') + '，体制内发展需根据具体情况灵活应对。');
      }
      out.push('');
      out.push('路径B：互联网/私企/创业（体制外）');
      if (outcome === '利客') {
        out.push('  √ 太乙利客，体制外宜主动出击，互联网/创业环境正契合"利客"之势。');
      } else if (outcome === '利主') {
        out.push('  → 太乙利主，体制外发展需稳扎稳打，不宜冒进。');
      } else {
        out.push('  → 太乙主客平衡，体制外发展需灵活把握攻守节奏。');
      }
    }

    return out.join('\n');
  }

  function buildTaiyiCausalChain(jiNian, epoch, gods, outcome, domainKey) {
    var out = [];
    out.push('以下是从太乙神数到结论的完整因果链条：');
    out.push('');
    out.push('1. 太乙积年' + jiNian + '是推算起点。太乙神数以天体运行周期为框架，积年数决定了当前所处的宇宙"时刻"。');
    out.push('');

    out.push(
      '2. ' +
        (epoch || '?') +
        '元是更大的周期背景。太乙分五元（上元、中元、下元等），每元72年，不同元有不同的能量基调。'
    );
    out.push('');

    out.push('3. 太乙十六神各归其位，形成完整的"能量地图"。' + dm.name + '相关的神煞落位直接决定了此事的吉凶。');
    out.push('');

    out.push('4. 主客判断（' + (outcome || '?') + '）是太乙断事的核心——利主则守，利客则攻。');
    out.push('   这是太乙区别于其他术数的独特之处：不是单纯判断吉凶，而是给出"攻守"策略。');

    return out.join('\n');
  }

  /**
   * 诸葛神数 → 事域解读（深度版——引用具体签文数据）
   */
  function analyzeZhuge(result, question, domainKey) {
    var dm = DOMAINS[domainKey];
    var lines = [];
    var num = result.number || '?';
    var level = result.level || '中平';
    var poem = result.poem || '';
    var interpretation = result.interpretation || '';

    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');

    // 签文概览
    lines.push('──────────────────────────────');
    lines.push('诸葛神数 第' + num + '签');
    lines.push('等级：' + level);
    if (poem) {
      lines.push('签文：' + poem);
    }
    lines.push('──────────────────────────────');
    lines.push('');

    // 签文解读
    lines.push('【签文逐句解读】');
    if (poem) {
      var poemLines = poem.replace(/[，,。！!？?；;]/g, '\n').split('\n');
      for (var pi = 0; pi < poemLines.length; pi++) {
        var pl = poemLines[pi].trim();
        if (pl) lines.push('「' + pl + '」——' + interpretPoemLine(pl, domainKey));
      }
    }
    lines.push('');

    // 事域专项研判
    lines.push('【' + dm.name + '专项研判——基于签文】');
    lines.push(buildZhugeDomainAnalysis(num, level, poem, interpretation, domainKey));
    lines.push('');

    // 因果链
    lines.push('【因果推演——为什么得出以上结论？】');
    lines.push(buildZhugeCausalChain(num, level, poem, interpretation, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }
    return lines.join('\n');
  }

  /** 解读签文单句 */
  function interpretPoemLine(line, domainKey) {
    var interpretations = {
      career: {
        龙: '龙为贵人之象，事业上有贵人相助或升迁之机。',
        虎: '虎为威猛之象，事业上需展现魄力，但不可过于强势。',
        水: '水主流动和智慧，事业上宜灵活应变，顺势而为。',
        山: '山主稳固，事业根基扎实，但需防固步自封。',
        风: '风主变动，事业上可能有变化，宜随机应变。',
        云: '云主遮蔽，事业上可能有不确定因素，需耐心等待云开。',
        日: '日主光明，事业前景明朗，宜积极进取。',
        月: '月主阴柔，事业上宜以柔克刚，不宜强攻。',
        花: '花主繁荣，但花开花落有时，事业需把握时机。',
        春: '春主新生，事业有新的开始或转机。',
        秋: '秋主收获，事业成果即将显现，但需防得意忘形。',
      },
      love: {
        龙: '龙为贵人之象，感情中可能有贵人引荐或缘分降临。',
        凤: '凤为良缘之象，单身者桃花运旺，有伴者感情升温。',
        水: '水主柔情，感情中需多些温柔包容，顺其自然。',
        花: '花主桃花，但需分辨是正缘还是烂桃花。',
        月: '月主阴晴圆缺，感情中需接受不完美，珍惜当下。',
        春: '春主萌动，感情有新的开始，宜主动表达。',
      },
      wealth: {
        金: '金主财富，财运上升，但需防贪多嚼不烂。',
        水: '水主流动，钱财来去较快，需做好理财规划。',
        山: '山主积蓄，财运稳健，适合长期投资。',
        秋: '秋主收获，之前的投资或努力将有回报。',
      },
    };
    var domainInterp = interpretations[domainKey] || interpretations['career'];
    for (var key in domainInterp) {
      if (line.indexOf(key) >= 0) return domainInterp[key];
    }
    return '此句提示：需结合自身情况理解签文深意。';
  }

  function buildZhugeDomainAnalysis(num, level, poem, interpretation, domainKey) {
    var out = [];
    out.push('诸葛神数第' + num + '签，' + level + '。');

    if (level.indexOf('上上') >= 0 || level.indexOf('大吉') >= 0) {
      out.push('√ 此签等级极高（' + level + '），在' + dm.name + '方面是明确的好兆头。');
      out.push('  签文中的意象暗示运势上升，所问之事有望得到理想结果。');
    } else if (level.indexOf('上吉') >= 0 || level.indexOf('上') >= 0) {
      out.push('√ 此签为' + level + '，在' + dm.name + '方面整体向好，但需注意细节。');
    } else if (level.indexOf('中平') >= 0 || level.indexOf('中吉') >= 0) {
      out.push('→ 此签为' + level + '，在' + dm.name + '方面需稳扎稳打，不宜冒进。');
    } else if (level.indexOf('下') >= 0 || level.indexOf('凶') >= 0) {
      out.push('⚠ 此签为' + level + '，在' + dm.name + '方面需谨慎行事，但签文也暗示转机。');
    }

    if (interpretation) {
      out.push('→ 签文解读：' + interpretation.substring(0, 200));
    }

    // 签文与事域关联
    out.push('');
    out.push('签文与' + dm.name + '的关联解读：');
    switch (domainKey) {
      case 'career':
        out.push('诸葛神数以签文意象映射事业运势。' + level + '签在事业上需看签文中是否有"升""进""达"等字眼。');
        out.push('');
        out.push('【职业路径对比】');
        if (level.indexOf('上') >= 0 || level.indexOf('吉') >= 0) {
          out.push('路径A：体制内（公务员/事业单位/国企）');
          out.push('  √ ' + level + '签，考公/晋升运势佳，签文提示有"贵人引路"或"时机成熟"之象。');
          out.push('路径B：互联网/私企/创业（体制外）');
          out.push('  → ' + level + '签，体制外发展同样有利，但需注意签文中关于"时机"的提示。');
        } else if (level.indexOf('凶') >= 0 || level.indexOf('下') >= 0) {
          out.push('路径A：体制内（公务员/事业单位/国企）');
          out.push('  ⚠ ' + level + '签，考公/晋升可能遇阻，签文暗示需等待时机或另寻出路。');
          out.push('路径B：互联网/私企/创业（体制外）');
          out.push('  → ' + level + '签时，体制外灵活度高，反而可能避开签文所示的阻力。');
        } else {
          out.push('→ ' + level + '签，事业方面宜稳扎稳打，无论体制内外，都需要耐心积累。');
          out.push('  签文提示：' + (poem ? poem.substring(0, 30) + '...' : '') + '——等待时机比盲目行动更重要。');
        }
        break;
      case 'love':
        out.push('诸葛神数中感情签看重"合""缘""遇"等字眼。' + level + '签在感情上的启示需结合签文中的意象。');
        break;
      case 'wealth':
        out.push('诸葛神数中财运签看重"金""宝""得"等字眼。' + level + '签在财运上提示了资源和机会的分布。');
        break;
      default:
        out.push(level + '签在' + dm.name + '方面的启示，需结合签文中的具体意象来理解。');
    }

    return out.join('\n');
  }

  function buildZhugeCausalChain(num, level, poem, interpretation, domainKey) {
    var out = [];
    out.push('以下是从签文到结论的完整因果链条：');
    out.push('');
    out.push('1. 诸葛神数共384签，每签对应一个特定卦象和签文。第' + num + '签的签文内容决定了此签的基本性质。');
    out.push('');
    out.push('2. 签文等级「' + level + '」是综合判断的核心指标。等级越高，所问之事越顺利。');
    out.push('');
    out.push('3. 签文中的意象（如' + (poem ? poem.substring(0, 20) + '...' : '') + '）是祖先智慧的结晶。');
    out.push('   每个意象都有其象征意义，与' + dm.name + '的结合产生了针对性的解读。');
    out.push('');
    out.push('4. 诸葛神数不同于其他术数——它不依赖五行生克，而是通过签文意象直接映射事理。');
    out.push('   因此，签文的字面意思和深层寓意同样重要。');

    return out.join('\n');
  }

  /* ========== 大六壬 → 事域解读（深度版） ========== */
  function analyzeDaliuren(result, question, domainKey) {
    var dm = DOMAINS[domainKey];
    var lines = [];
    var keName = result.ke_name || '未知课';
    var chuan = result.chuan || '';
    var riGan = result.ri_gan || '?';
    var riZhi = result.ri_zhi || '?';
    var yueJiang = result.yue_jiang_name || '?';
    var siKe = result.si_ke || [];
    var sanChuan = result.san_chuan || {};
    var tianJiang = result.tian_jiang || {};
    var level = result.level || '吉凶参半';

    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');
    lines.push('──────────────────────────────');
    lines.push('六壬课体：' + keName + '  |  月将：' + yueJiang + '  |  日干：' + riGan);
    lines.push('三传：' + (chuan || '?'));
    lines.push('──────────────────────────────');
    lines.push('');

    // 四课分析
    if (siKe.length > 0) {
      lines.push('【四课——天地盘象】');
      for (var ki = 0; ki < Math.min(siKe.length, 4); ki++) {
        var ke = siKe[ki];
        lines.push('第' + (ki + 1) + '课：' + (ke.upper || '?') + '（上）' + (ke.lower || '?') + '（下）');
      }
      lines.push('');
    }

    // 三传分析
    lines.push('【三传——变化之机】');
    lines.push('初传：' + (sanChuan.chu || '?') + '（事之始）');
    lines.push('中传：' + (sanChuan.zhong || '?') + '（事之中）');
    lines.push('末传：' + (sanChuan.mo || '?') + '（事之终）');
    lines.push('');

    // 事域专项研判
    lines.push('【' + dm.name + '专项研判——基于六壬课体】');
    lines.push(buildDaliurenDomainAnalysis(keName, riGan, riZhi, siKe, sanChuan, tianJiang, level, domainKey));
    lines.push('');

    // 因果链
    lines.push('【因果推演——为什么得出以上结论？】');
    lines.push(buildDaliurenCausalChain(keName, riGan, riZhi, siKe, sanChuan, tianJiang, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }
    return lines.join('\n');
  }

  function buildDaliurenDomainAnalysis(keName, riGan, riZhi, siKe, sanChuan, tianJiang, level, domainKey) {
    var out = [];
    out.push('大六壬以「' + keName + '」课体断事，' + level + '。');

    // 通用的六壬领域判断
    var isJi = level.indexOf('吉') >= 0 || level.indexOf('上') >= 0;
    var isXiong = level.indexOf('凶') >= 0;

    switch (domainKey) {
      case 'career':
        out.push('事业看三传中的官鬼爻和日干旺衰。');
        if (isJi) {
          out.push('√ 课体' + keName + '，' + level + '，事业方面有贵人相助之象，宜积极进取。');
          out.push(
            '  三传' +
              (sanChuan.chu || '') +
              '→' +
              (sanChuan.zhong || '') +
              '→' +
              (sanChuan.mo || '') +
              '显示事业发展的三个阶段。'
          );
        } else if (isXiong) {
          out.push('⚠ 课体' + keName + '，' + level + '，事业方面需谨慎行事，不宜冒进。');
        } else {
          out.push('→ 课体' + keName + '，' + level + '，事业方面宜稳扎稳打，伺机而动。');
        }

        // 大六壬事业路径对比
        out.push('');
        out.push('【职业路径对比】');
        var chuanStrDM = (sanChuan.chu || '') + (sanChuan.zhong || '') + (sanChuan.mo || '');
        var hasGuanDM = chuanStrDM.indexOf('官') >= 0 || chuanStrDM.indexOf('鬼') >= 0;
        if (isJi) {
          out.push('路径A：体制内（公务员/事业单位/国企）');
          if (hasGuanDM) {
            out.push('  √ 三传中有官鬼，且课体' + level + '，考公/晋升运势强。');
          } else {
            out.push('  → 课体吉利但三传无官鬼，体制内发展需借助贵人（青龙/太常临课）。');
          }
          out.push('');
          out.push('路径B：互联网/私企/创业（体制外）');
          out.push(
            '  → 课体吉利，体制外同样有发展空间。三传' +
              (sanChuan.chu || '') +
              '→' +
              (sanChuan.zhong || '') +
              '→' +
              (sanChuan.mo || '') +
              '提示事业发展的节奏。'
          );
        } else if (isXiong) {
          out.push('路径A：体制内（公务员/事业单位/国企）');
          out.push('  ⚠ 课体' + level + '，考公/晋升可能遇阻。');
          out.push('路径B：互联网/私企/创业（体制外）');
          out.push('  → 凶课体时，体制外灵活性更高，可以避开部分不利因素。');
        } else {
          out.push('→ 课体' + level + '，无论体制内外，都需稳扎稳打。');
          out.push(
            '  初传' +
              (sanChuan.chu || '?') +
              '决定事业开端，中传' +
              (sanChuan.zhong || '?') +
              '决定中期发展，末传' +
              (sanChuan.mo || '?') +
              '决定最终结果。'
          );
        }
        break;
      case 'love':
        out.push('感情看日干日支关系和课传中的青龙/六合。');
        if (tianJiang && tianJiang['青龙']) {
          out.push('√ 青龙临课，主喜事临近，感情运势上升。');
        }
        if (tianJiang && tianJiang['六合']) {
          out.push('√ 六合临课，主和合之事，姻缘运佳。');
        }
        out.push('日干' + riGan + '与日支' + riZhi + '的关系提示感情中的内在平衡。');
        break;
      case 'wealth':
        out.push('财运看课传中的财爻和青龙。');
        if (tianJiang && tianJiang['青龙']) {
          out.push('√ 青龙临课，主财运亨通，有意外之财。');
        }
        if (isJi) {
          out.push('√ 课体吉利，投资理财方面可适度进取。');
        } else {
          out.push('→ 财运需谨慎，以正财为主，不宜投机。');
        }
        break;
      case 'health':
        out.push('健康看日干旺衰和课传中的白虎/病符。');
        if (tianJiang && tianJiang['白虎']) {
          out.push('⚠ 白虎临课，需注意意外伤害或突发疾病。');
        } else {
          out.push('√ 课中无白虎，健康状态相对稳定。');
        }
        break;
      case 'study':
        out.push('学业看课传中的朱雀（文书）和青龙（贵人）。');
        if (tianJiang && tianJiang['朱雀']) {
          out.push('√ 朱雀临课，文书运佳，利考试和学习。');
        }
        if (tianJiang && tianJiang['青龙']) {
          out.push('√ 青龙临课，有贵人相助，学业可期。');
        }
        break;
      case 'family':
        out.push('家庭看日支（配偶宫）和课传中的太常/太阴。');
        out.push('日支' + riZhi + '为配偶宫，课传提示家庭关系的变化趋势。');
        break;
      case 'social':
        out.push('人际看课传中的六合（和合）和朱雀（口舌）。');
        if (tianJiang && tianJiang['六合']) {
          out.push('√ 六合临课，人际关系和谐，宜拓展人脉。');
        }
        if (tianJiang && tianJiang['朱雀']) {
          out.push('→ 朱雀临课，需注意口舌是非，谨言慎行。');
        }
        break;
      case 'travel':
        out.push('出行看课传中的驿马（寅申巳亥）和青龙。');
        if (tianJiang && tianJiang['青龙']) {
          out.push('√ 青龙临课，出行顺利，旅途愉快。');
        }
        // 检查三传中是否有驿马
        var maZhi = ['寅', '申', '巳', '亥'];
        var chuanStr = (sanChuan.chu || '') + (sanChuan.zhong || '') + (sanChuan.mo || '');
        for (var mi = 0; mi < maZhi.length; mi++) {
          if (chuanStr.indexOf(maZhi[mi]) >= 0) {
            out.push('√ 三传中有驿马' + maZhi[mi] + '，出行之兆已显。');
            break;
          }
        }
        break;
    }

    return out.join('\n');
  }

  function buildDaliurenCausalChain(keName, riGan, riZhi, siKe, sanChuan, tianJiang, domainKey) {
    var out = [];
    out.push('以下是从六壬课体到结论的完整因果链条：');
    out.push('');
    out.push(
      '1. 六壬起课以月将加占时，布成天地盘。这是六壬最基础的时空框架，天地盘一经确定，万事万物的变化规律便在其中。'
    );
    out.push('');
    out.push('2. 四课由日干日支各取两课而成，四课反映的是当前所问之事的"全息影像"。');
    out.push('   日干' + riGan + '代表您自身，日支' + riZhi + '代表外部环境。四课的关系决定了吉凶基调。');
    out.push('');
    out.push('3. 三传由四课中的贼克/比用/涉害等法则推演而出，是课体的"核心变化线"。');
    out.push(
      '   初传' +
        (sanChuan.chu || '?') +
        '→中传' +
        (sanChuan.zhong || '?') +
        '→末传' +
        (sanChuan.mo || '?') +
        '，三传递进，揭示事态从开始到结果的完整演变。'
    );
    out.push('');
    out.push('4. 课体「' + keName + '」是六壬判断的总纲。六壬共有64课体，每种课体都有特定的吉凶属性和适用场景。');
    out.push('   课体一经确定，此事的基本性质便已明了。');
    out.push('');
    out.push(
      '5. 十二天将（贵人、螣蛇、朱雀、六合、勾陈、青龙、天空、白虎、太常、玄武、太阴、天后）各有所主，临于课传之上，提供额外信息。'
    );
    out.push('   综合课体、四课、三传、天将四者，得出的结论具有高度可信性。');

    return out.join('\n');
  }

  /* ========== 紫微斗数 → 事域解读（深度版） ========== */
  function analyzeZiwei(result, question, domainKey) {
    var dm = DOMAINS[domainKey];
    var lines = [];
    var mingGongZhi = result.命宫 || '?';
    var mingGongZhuXing = result.命宫主星 || '?';
    var shenGongZhi = result.身宫 || '?';
    var wuxingJu = result.五行局 || '?';
    var siHua = result.四化 || {};
    var ziWeiZhi = result.紫微星落 || '?';
    var gongs = result.十二宫 || [];
    var allStars = result.所有星曜 || [];

    lines.push('【' + dm.icon + ' 所问之事：' + dm.name + '】');
    lines.push('您所问：' + question);
    lines.push('');
    lines.push('──────────────────────────────');
    lines.push('命宫：' + mingGongZhi + '（主星：' + mingGongZhuXing + '）');
    lines.push('身宫：' + shenGongZhi + '  |  五行局：' + wuxingJu);
    lines.push('紫微落：' + ziWeiZhi + '宫');
    if (siHua.化禄)
      lines.push(
        '四化：化禄[' +
          siHua.化禄 +
          '] 化权[' +
          (siHua.化权 || '—') +
          '] 化科[' +
          (siHua.化科 || '—') +
          '] 化忌[' +
          (siHua.化忌 || '—') +
          ']'
      );
    lines.push('──────────────────────────────');
    lines.push('');

    // 十二宫概览
    if (gongs.length > 0) {
      lines.push('【十二宫星曜分布】');
      for (var gi = 0; gi < Math.min(gongs.length, 12); gi++) {
        var g = gongs[gi] || {};
        var gName = GONG_NAMES[gi] || '宫' + (gi + 1);
        var stars = g.stars && g.stars.length > 0 ? g.stars.join('、') : '无主星';
        lines.push(gName + '（' + (g.zhi || '?') + '）：' + stars);
      }
      lines.push('');
    }

    // 事域专项研判
    lines.push('【' + dm.name + '专项研判——基于紫微斗数】');
    lines.push(buildZiweiDomainAnalysis(mingGongZhi, mingGongZhuXing, gongs, siHua, allStars, domainKey));
    lines.push('');

    // 因果链
    lines.push('【因果推演——为什么得出以上结论？】');
    lines.push(buildZiweiCausalChain(mingGongZhi, mingGongZhuXing, gongs, siHua, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【行动建议】');
    var advices = DOMAIN_ADVICES[domainKey] || DOMAIN_ADVICES['career'];
    var shuffled = advices.slice().sort(function () {
      return Math.random() - 0.5;
    });
    for (var i = 0; i < 3; i++) {
      lines.push(i + 1 + '. ' + shuffled[i]);
    }
    return lines.join('\n');
  }

  function buildZiweiDomainAnalysis(mingGongZhi, mingGongZhuXing, gongs, siHua, allStars, domainKey) {
    var out = [];
    out.push('紫微斗数以命宫' + mingGongZhi + '（主星' + mingGongZhuXing + '）为根基，十二宫各有归位。');

    // 找出与事域相关的宫位
    var domainGongMap = {
      career: 8, // 官禄宫 (index 8)
      love: 2, // 夫妻宫 (index 2)
      wealth: 4, // 财帛宫 (index 4)
      health: 5, // 疾厄宫 (index 5)
      study: 8, // 官禄宫也管学业
      family: 6, // 迁移宫 — 不对，家庭应该是田宅宫 index 9, 父母宫 index 11
      social: 7, // 交友宫 (index 7)
      travel: 6, // 迁移宫 (index 6)
    };

    var gongIdx = domainGongMap[domainKey];
    if (domainKey === 'family') gongIdx = 9; // 田宅宫

    if (gongIdx !== undefined && gongs[gongIdx]) {
      var g = gongs[gongIdx];
      var gongName = GONG_NAMES[gongIdx];
      var stars = g.stars && g.stars.length > 0 ? g.stars.join('、') : '无主星';
      out.push(
        gongName + '（' + (g.zhi || '?') + '）星曜：' + stars + '——这是' + DOMAINS[domainKey].name + '的命理根基。'
      );
    }

    // 四化分析
    if (siHua.化禄) {
      out.push('→ 化禄在' + siHua.化禄 + '，主' + DOMAINS[domainKey].name + '方面有增益之象。');
    }
    if (siHua.化忌) {
      out.push('⚠ 化忌在' + siHua.化忌 + '，' + DOMAINS[domainKey].name + '方面需注意潜在障碍。');
    }
    if (siHua.化权) {
      out.push('→ 化权在' + siHua.化权 + '，主' + DOMAINS[domainKey].name + '方面有掌控力和主动权。');
    }
    if (siHua.化科) {
      out.push('√ 化科在' + siHua.化科 + '，主' + DOMAINS[domainKey].name + '方面有声名和贵人相助。');
    }

    // 命宫主星对事域的影响
    var mingStars = mingGongZhuXing.split('、');
    for (var ms = 0; ms < mingStars.length; ms++) {
      var star = mingStars[ms].trim();
      if (star === '紫微')
        out.push('√ 命宫紫微坐守，天生具备领导力和格局，' + DOMAINS[domainKey].name + '方面有先天优势。');
      if (star === '天府') out.push('√ 命宫天府坐守，稳重踏实，' + DOMAINS[domainKey].name + '方面宜稳健发展。');
      if (star === '天相') out.push('→ 命宫天相坐守，善于协调，' + DOMAINS[domainKey].name + '方面宜借力而行。');
      if (star === '七杀') out.push('→ 命宫七杀坐守，敢闯敢拼，' + DOMAINS[domainKey].name + '方面宜主动出击。');
      if (star === '破军') out.push('→ 命宫破军坐守，不破不立，' + DOMAINS[domainKey].name + '方面可能有重大变革。');
      if (star === '贪狼') out.push('→ 命宫贪狼坐守，多才多艺，' + DOMAINS[domainKey].name + '方面宜多元化发展。');
      if (star === '天机') out.push('→ 命宫天机坐守，思维敏捷，' + DOMAINS[domainKey].name + '方面宜以智取胜。');
      if (star === '太阳') out.push('√ 命宫太阳坐守，光明磊落，' + DOMAINS[domainKey].name + '方面宜走正道。');
      if (star === '太阴') out.push('→ 命宫太阴坐守，内敛细腻，' + DOMAINS[domainKey].name + '方面宜以柔克刚。');
    }

    // 紫微斗数事业路径对比
    if (domainKey === 'career') {
      out.push('');
      out.push('【职业路径对比】');
      // 官禄宫星曜分析
      var guanLuGong = gongs[8]; // 官禄宫 index 8
      if (guanLuGong && guanLuGong.stars && guanLuGong.stars.length > 0) {
        out.push('路径A：体制内（公务员/事业单位/国企）');
        var guanLuStars = guanLuGong.stars.join('、');
        var hasZiwei = guanLuStars.indexOf('紫微') >= 0;
        var hasTianfu = guanLuStars.indexOf('天府') >= 0;
        var hasTianxiang = guanLuStars.indexOf('天相') >= 0;
        var hasTaiyang = guanLuStars.indexOf('太阳') >= 0;
        if (hasZiwei || hasTianfu || hasTianxiang) {
          out.push(
            '  √ 官禄宫有' + (hasZiwei ? '紫微' : hasTianfu ? '天府' : '天相') + '坐守，天生适合体制内管理岗位。'
          );
        } else if (hasTaiyang) {
          out.push('  → 官禄宫太阳坐守，适合体制内需展现领导力的岗位，但需注意锋芒太露。');
        } else {
          out.push('  → 官禄宫' + guanLuStars + '，体制内竞争力取决于具体星曜组合。');
        }
        out.push('');
        out.push('路径B：互联网/私企/创业（体制外）');
        var hasQisha = guanLuStars.indexOf('七杀') >= 0;
        var hasPojun = guanLuStars.indexOf('破军') >= 0;
        var hasTanlang = guanLuStars.indexOf('贪狼') >= 0;
        var hasTianji = guanLuStars.indexOf('天机') >= 0;
        if (hasQisha || hasPojun || hasTanlang) {
          out.push(
            '  √ 官禄宫' +
              (hasQisha ? '七杀' : hasPojun ? '破军' : '贪狼') +
              '坐守，敢闯敢拼，天生适合体制外创业/互联网行业。'
          );
        } else if (hasTianji) {
          out.push('  → 官禄宫天机坐守，思维敏捷，适合互联网/科技行业的技术或策略岗位。');
        } else {
          out.push('  → 官禄宫' + guanLuStars + '，体制外发展需结合命宫主星综合判断。');
        }
      }
      // 四化对事业的影响
      out.push('');
      out.push('【四化事业提示】');
      if (siHua.化禄) out.push('化禄在' + siHua.化禄 + '→事业方面有增益，宜在' + siHua.化禄 + '相关领域发力。');
      if (siHua.化权) out.push('化权在' + siHua.化权 + '→事业方面有掌控力，宜争取管理岗位或自主创业。');
      if (siHua.化科) out.push('化科在' + siHua.化科 + '→事业方面有声名运，宜注重个人品牌建设。');
      if (siHua.化忌) out.push('化忌在' + siHua.化忌 + '→' + siHua.化忌 + '领域需谨慎，避免在此方向上过度投入。');
    }

    return out.join('\n');
  }

  function buildZiweiCausalChain(mingGongZhi, mingGongZhuXing, gongs, siHua, domainKey) {
    var out = [];
    out.push('以下是从紫微斗数命盘到结论的完整因果链条：');
    out.push('');
    out.push(
      '1. 紫微斗数以命宫' +
        mingGongZhi +
        '为起点，安十二宫，定十四主星。命宫是十二宫之首，代表一个人的先天格局和性格底色。'
    );
    out.push('');
    out.push(
      '2. 命宫主星「' +
        mingGongZhuXing +
        '」决定了命主的基本特质。每颗主星都有其独特的性格和运势特征，主星之间的组合会产生化学反应。'
    );
    out.push('');
    out.push(
      '3. 十二宫各有其掌管领域。' + DOMAINS[domainKey].name + '对应的宫位星曜分布，直接决定了此领域的先天运势。'
    );
    out.push('   三方四正（本宫的对宫、三合宫）的星曜也会对此领域产生影响。');
    out.push('');
    out.push('4. 四化（化禄、化权、化科、化忌）是紫微斗数中最重要的动态因素。');
    out.push('   化禄主增益，化权主掌控，化科主声名，化忌主波折。四化飞入不同宫位，便在不同领域产生相应的能量变化。');
    out.push('');
    out.push('5. 综上，命宫主星定格局，十二宫星曜分布定各领域运势，四化飞星定动态变化。');
    out.push('   三者结合，形成对' + DOMAINS[domainKey].name + '的完整判断。');

    return out.join('\n');
  }

  /* ========== 四、各事域通用行动建议 ========== */
  var DOMAIN_ADVICES = {
    career: [
      '近期宜主动展示能力，让上级看到你的价值。',
      '避免卷入办公室政治，专注于业务本身。',
      '如有跳槽或转岗的念头，可开始准备，但不宜操之过急。',
      '多与行业前辈交流，贵人可能就在身边。',
    ],
    career_job: [
      '面试前仔细研究目标公司，展现你的诚意和专业度。',
      '简历要突出与岗位最匹配的经历，不要泛泛而谈。',
      '如有多个机会，优先选择平台更大、发展空间更好的。',
      '求职期间保持规律作息，面试状态直接影响发挥。',
    ],
    career_promote: [
      '近期主动承担关键任务，让领导看到你的担当。',
      '晋升不只是能力问题，沟通能力同样重要。',
      '如有竞争对手，专注自身成长比关注对手更有效。',
      '晋升前后可适当表达上进心，但切忌过于张扬。',
    ],
    career_start: [
      '创业前需有清晰的商业计划和足够的流动资金储备。',
      '初期宜小步快跑，验证模式后再加大投入。',
      '合伙之事须先明权责利，避免日后纠纷。',
      '创业期间保持耐心，前三年是最艰难的时期。',
    ],
    career_diff: [
      '当前阶段不宜强行推进，宜韬光养晦、等待时机。',
      '如有职场矛盾，先反思自身，再沟通化解。',
      '暂时受挫不代表能力不足，可能是时机未到。',
      '可考虑暂时调整方向，不必在一棵树上吊死。',
    ],
    love: [
      '单身者宜多参加社交活动，扩大交际圈。',
      '有伴侣者需加强沟通，避免小事积累成大矛盾。',
      '信任是感情的基石，不要因猜疑而破坏关系。',
      '感情之事，顺其自然比强求更有福报。',
    ],
    wealth: [
      '正财稳定，但偏财需谨慎，不宜轻信高回报承诺。',
      '近期适合做长期理财规划，而非短期投机。',
      '控制不必要的开支，积少成多。',
      '如有投资计划，建议多方咨询后再做决定。',
    ],
    health: [
      '建议近期安排一次全面体检，防患于未然。',
      '调整作息，保证充足睡眠，避免过度劳累。',
      '适当运动有助于身心平衡，推荐散步或瑜伽。',
      '饮食清淡，少食辛辣油腻，多喝水。',
    ],
    study: [
      '制定合理的学习计划，避免临时抱佛脚。',
      '找到适合自己的学习方法，效率比时长更重要。',
      '遇到难题多向老师或同学请教，不要独自硬扛。',
      '考试前保持良好心态，过度紧张反而影响发挥。',
    ],
    family: [
      '多花时间陪伴家人，沟通比物质更重要。',
      '家庭矛盾宜冷处理，不要在情绪激动时做决定。',
      '如有长辈身体不适，及时就医，不可拖延。',
      '家和万事兴，家庭和睦是最大的福气。',
    ],
    social: [
      '谨言慎行，避免在背后议论他人。',
      '真诚待人，但也要保持适当的边界感。',
      '如有人际矛盾，宜主动沟通化解，不宜冷战。',
      '拓展人脉的同时，也要维护好现有的核心关系。',
    ],
    travel: [
      '出行前做好充分准备，检查证件和行程安排。',
      '长途旅行宜结伴而行，注意安全。',
      '如有重要行程，建议预留充足的缓冲时间。',
      '旅途中保持开放心态，可能会有意外收获。',
    ],
    general: [
      '近期宜稳扎稳打，不宜冒进，等待时机成熟再行动。',
      '多关注自身内心感受，倾听直觉的声音。',
      '人生如棋，落子无悔，每一步都是修行。',
      '运势如潮汐，有起有落，低谷时更要沉住气。',
      '顺势而为，不逆天而行，是最大的智慧。',
    ],
  };

  /* ========== 事业子分类检测 ========== */
  function detectCareerSubtype(question) {
    if (!question) return 'career';
    var q = question;
    var jobKeywords = ['找', '面试', '应聘', '求职', '投', '简历', 'offer', '入职', '换工作', '跳槽', '离职', '辞职'];
    var promoteKeywords = ['升', '晋升', '升职', '提拔', '考核', '绩效', '考核', '评职称', '转正', '调薪', '加薪', '涨薪'];
    var startKeywords = ['创业', '开', '自己做', '当老板', '合伙', '投资', '做生意', '开公司', '单干', '副业'];
    var diffKeywords = ['被裁', '失业', '丢', '被辞', '卷', '难', '不顺', '阻碍', '瓶颈', '困境', '压力', '困难'];
    for (var i = 0; i < diffKeywords.length; i++) {
      if (q.indexOf(diffKeywords[i]) !== -1) return 'career_diff';
    }
    for (var j = 0; j < startKeywords.length; j++) {
      if (q.indexOf(startKeywords[j]) !== -1) return 'career_start';
    }
    for (var k = 0; k < promoteKeywords.length; k++) {
      if (q.indexOf(promoteKeywords[k]) !== -1) return 'career_promote';
    }
    for (var l = 0; l < jobKeywords.length; l++) {
      if (q.indexOf(jobKeywords[l]) !== -1) return 'career_job';
    }
    return 'career';
  }

  /* ========== 五、公开 API ========== */

  global.DomainAnalysis = {
    /** 暴露领域检测函数供测试使用 */
    detectDomain: detectDomain,
    /** 暴露事业子分类检测函数 */
    detectCareerSubtype: detectCareerSubtype,
    /** 暴露领域建议列表供大师分析使用 */
    DOMAIN_ADVICES: DOMAIN_ADVICES,

    /**
     * 统一问事分析入口
     * @param {string} method - 术数方法：bazi/liuyao/meihua/qimen/taiyi/zhuge
     * @param {object} result - 术数引擎返回的原始结果
     * @param {string} question - 用户所问之事
     * @returns {object} { domain, analysis }
     */
    analyze: function (method, result, question) {
      if (!question || !question.trim()) return null;

      var domainKey = detectDomain(question);
      var domain = DOMAINS[domainKey];
      var analysis = '';

      switch (method) {
        case 'bazi':
          analysis = analyzeBazi(result, question, domainKey);
          break;
        case 'liuyao':
          analysis = analyzeLiuyao(result, question, domainKey);
          break;
        case 'meihua':
          analysis = analyzeMeihua(result, question, domainKey);
          break;
        case 'qimen':
          analysis = analyzeQimen(result, question, domainKey);
          break;
        case 'taiyi':
          analysis = analyzeTaiyi(result, question, domainKey);
          break;
        case 'zhuge':
          analysis = analyzeZhuge(result, question, domainKey);
          break;
        case 'zhougong':
          // 周公解梦复用诸葛神数的事域模板
          analysis = analyzeZhuge(result, question, domainKey);
          break;
        case 'daliuren':
          analysis = analyzeDaliuren(result, question, domainKey);
          break;
        case 'ziwei':
          analysis = analyzeZiwei(result, question, domainKey);
          break;
        default:
          // 未知术数：仅返回领域检测结果，不做事域分析
          return { domain: { key: domainKey, name: domain.name, icon: domain.icon }, analysis: '' };
      }

      return {
        domain: { key: domainKey, name: domain.name, icon: domain.icon },
        analysis: analysis,
      };
    },

    /** 获取所有事域列表 */
    getDomains: function () {
      return DOMAIN_LIST.map(function (k) {
        var d = DOMAINS[k];
        return { key: k, name: d.name, icon: d.icon };
      });
    },
  };
})(typeof window !== 'undefined' ? window : this);
