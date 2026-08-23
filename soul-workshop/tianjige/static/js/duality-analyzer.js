/**
 * 天机阁 · 双面性分析引擎 v1
 * 共享模块：为所有术数引擎提供"吉中带凶、凶中有吉"的双面解读能力
 *
 * 核心理念：世间万物皆有阴阳两面，吉非纯吉，凶非纯凶。
 * 每一个结论都应包含：优势面、风险面、转化关键、时机建议。
 *
 * 使用方式：
 *   var duality = DualityAnalyzer.analyze({ type: 'wuxing', signals: [...] });
 *   // 或引擎直接调用工具函数
 *   var warning = DualityAnalyzer.addBalance(positiveText, score);
 */

(function (global) {
  'use strict';

  /* ========== 一、五行生克双面解读库 ========== */

  /**
   * 五行关系的双面解读
   * 每种关系都有"吉面"和"凶面"
   */
  var WUXING_DUALITY = {
    // 生我（印星）：吉在贵人相助，凶在依赖心重
    生我: {
      yang: '贵人相助，长辈提携，学业事业得外力支持，事半功倍',
      yin: '易生依赖心理，自主性减弱，若印星过旺则思虑过多、行动力不足',
      transform: '借力而不依赖——感恩贵人但保持独立判断，将外力转化为自身能力',
      timing: '印星旺时宜学习进修、寻求指导；过旺时宜独立行动、减少求教',
    },
    // 我生（食伤）：吉在才华展现，凶在锋芒太露
    我生: {
      yang: '才华得以展现，创意与技术爆发，表达能力强，适合创新与艺术',
      yin: '锋芒太露易招嫉妒，言辞不慎得罪人，过度消耗精力导致身心疲惫',
      transform: '藏锋于鞘——才华展示需择时择人，将过剩精力投入创作而非争辩',
      timing: '食伤旺时宜创作、表达、展示；过旺时宜内省、收敛、休养',
    },
    // 克我（官杀）：吉在有所成就，凶在压力过大
    克我: {
      yang: '有压力才有动力，事业心强，责任感重，约束之下出成果，纪律带来自由',
      yin: '压力过大伤身伤心，官非口舌，职场斗争，束缚过多导致焦虑压抑',
      transform: '化压力为阶梯——接受必要的约束但守住底线，在规则内找到突破口',
      timing: '官杀旺时宜守规矩、尽职责、积累资历；过旺时宜暂避锋芒、关注健康',
    },
    // 我克（财星）：吉在财富机遇，凶在贪欲耗身
    我克: {
      yang: '财运亨通，求财有利，物质生活丰富，理财能力增强',
      yin: '贪欲膨胀，为财所累，身心被消耗，财多身弱反受其害',
      transform: '以财养身而非以身殉财——赚钱是为生活服务，而非生活为赚钱服务',
      timing: '财星旺时宜积极经营、投资理财；过旺时宜节制消费、关注健康',
    },
    // 比和（比劫）：吉在朋友互助，凶在竞争内耗
    比和: {
      yang: '朋友同事相助，合作共赢，人脉资源丰富，团结力量大',
      yin: '竞争激烈，朋友反目，资源被分夺，合伙易生纠纷',
      transform: '合而不争——选择志同道合者合作，明确权责利，避免利益不清',
      timing: '比劫旺时宜合作、社交、拓展人脉；过旺时宜独立行动、保护核心利益',
    },
  };

  /**
   * 根据五行关系获取双面解读
   * @param {string} relation - '生我'|'我生'|'克我'|'我克'|'比和'
   * @returns {object} { yang, yin, transform, timing }
   */
  function getWuxingDuality(relation) {
    return (
      WUXING_DUALITY[relation] || {
        yang: '运势平稳，无大起大落',
        yin: '缺乏突破契机，易陷入平庸',
        transform: '主动求变，在稳定中寻找突破口',
        timing: '当前宜守正待时，积累实力',
      }
    );
  }

  /* ========== 二、通用双面性生成器 ========== */

  /**
   * 为核心判断添加"但是"转折——自动生成双面解读
   *
   * @param {string} mainText - 主判断文本（正面或负面）
   * @param {number} score - 评分 0-100，50为中性
   * @param {object} options - 可选配置
   *   - counterSignals: 反向信号列表 [{label, weight}]
   *   - context: 上下文描述
   * @returns {string} 包含双面视角的完整解读
   */
  function addBalance(mainText, score, options) {
    options = options || {};
    var counterSignals = options.counterSignals || [];
    var context = options.context || '';

    var parts = [];
    parts.push(mainText);

    // 高分但仍有隐忧
    if (score >= 70 && counterSignals.length > 0) {
      parts.push(
        '然而，' +
          counterSignals
            .map(function (s) {
              return s.label;
            })
            .join('，') +
          '，需加以留意。'
      );
    }
    // 低分但有转机
    else if (score <= 40 && counterSignals.length > 0) {
      parts.push(
        '不过，' +
          counterSignals
            .map(function (s) {
              return s.label;
            })
            .join('，') +
          '，仍有转圜余地。'
      );
    }
    // 中等分数，正反两面都要展示
    else if (score >= 40 && score <= 60 && counterSignals.length > 0) {
      parts.push(
        '需注意，' +
          counterSignals
            .map(function (s) {
              return s.label;
            })
            .join('，') +
          '，利弊并存，需仔细权衡。'
      );
    }

    // 高分的提醒
    if (score >= 80) {
      parts.push('运势虽佳，但需防乐极生悲，保持谦逊谨慎。');
    }
    // 低分的鼓励
    else if (score <= 30) {
      parts.push('运势低迷，但否极泰来，低谷正是积蓄力量之时。');
    }

    if (context) {
      parts.push(context);
    }

    return parts.join(' ');
  }

  /**
   * 生成完整的"吉凶双面"分析报告
   *
   * @param {object} params
   *   - positives: 正面因素列表 [{label, weight}]
   *   - negatives: 负面因素列表 [{label, weight}]
   *   - overallScore: 综合评分 0-100
   *   - engineType: 引擎类型 'bazi'|'liuyao'|'meihua'|'qimen'|...
   * @returns {object} { summary, positiveSide, negativeSide, key, advice }
   */
  function generateFullDuality(params) {
    params = params || {};
    var positives = params.positives || [];
    var negatives = params.negatives || [];
    var overallScore = params.overallScore || 50;
    var engineType = params.engineType || '';

    // 计算正负权重
    var posWeight = positives.reduce(function (sum, p) {
      return sum + (p.weight || 1);
    }, 0);
    var negWeight = negatives.reduce(function (sum, n) {
      return sum + (n.weight || 1);
    }, 0);

    // 正负比
    var balanceRatio = posWeight / Math.max(1, negWeight);

    // 生成概述
    var summary = '';
    if (balanceRatio >= 3) {
      summary = '格局以吉为主，但吉中藏有隐忧，不可掉以轻心。';
    } else if (balanceRatio >= 1.5) {
      summary = '吉多凶少，整体向好，但需注意局部风险。';
    } else if (balanceRatio >= 0.7) {
      summary = '吉凶参半，利弊交织，关键在于如何趋吉避凶。';
    } else if (balanceRatio >= 0.3) {
      summary = '凶多吉少，形势不利，但逆境中亦有生机。';
    } else {
      summary = '格局以凶为主，但凶中藏有转机，静待时机可化险为夷。';
    }

    // 生成正面
    var positiveLines = [];
    positives.forEach(function (p) {
      if (p.detail) {
        positiveLines.push('▸ ' + p.label + '：' + p.detail);
      } else {
        positiveLines.push('▸ ' + p.label);
      }
    });

    // 生成负面
    var negativeLines = [];
    negatives.forEach(function (n) {
      if (n.detail) {
        negativeLines.push('▸ ' + n.label + '：' + n.detail);
      } else {
        negativeLines.push('▸ ' + n.label);
      }
    });

    // 生成转化关键
    var key = '';
    if (balanceRatio >= 1.5) {
      key =
        '吉势已成，关键在于"守"——守住优势不骄不躁，将好运转化为实际成果。同时警惕' +
        (negatives.length > 0 ? negatives[0].label : '潜在风险') +
        '，不可因顺境而失去警觉。';
    } else if (balanceRatio >= 0.7) {
      key =
        '吉凶交织，关键在于"择"——明辨利弊，在复杂的局面中找到最有利的方向。' +
        '强化' +
        (positives.length > 0 ? positives[0].label : '优势面') +
        '，规避' +
        (negatives.length > 0 ? negatives[0].label : '风险面') +
        '。';
    } else {
      key =
        '形势不利，但关键在于"忍"与"变"——忍一时之困，变不利为有利。' +
        '低谷期宜' +
        (positives.length > 0 ? '发挥' + positives[0].label + '的优势' : '韬光养晦') +
        '，等待转机到来。';
    }

    // 生成建议
    var advice = '';
    if (overallScore >= 70) {
      advice = '当前运势向上，宜积极进取，但需：1) 保持谦逊，不骄不躁；2) 关注细节，防微杜渐；3) 分享成果，广结善缘。';
    } else if (overallScore >= 40) {
      advice = '运势平稳，宜稳中求进：1) 做好当下之事，不急于求成；2) 关注自身成长，积累实力；3) 等待时机，谋定后动。';
    } else {
      advice =
        '运势低迷，宜以守为攻：1) 减少不必要的大动作；2) 关注身心健康，保持良好状态；3) 利用低谷期学习充电，为未来蓄力。';
    }

    return {
      summary: summary,
      positiveSide: positiveLines.length > 0 ? positiveLines.join('\n') : '▸ 命局自有贵人，天无绝人之路',
      negativeSide: negativeLines.length > 0 ? negativeLines.join('\n') : '▸ 需留意细节，不可大意',
      key: key,
      advice: advice,
      score: overallScore,
      balanceLabel: balanceRatio >= 1.5 ? '吉多凶少' : balanceRatio >= 0.7 ? '吉凶参半' : '凶多吉少',
    };
  }

  /**
   * 快速生成双面标签（用于简洁输出）
   * @param {number} score 0-100
   * @returns {string} 如 "吉中带凶" "凶中有吉" 等
   */
  function getDualityLabel(score) {
    if (score >= 80) return '大吉，但需防盛极而衰';
    if (score >= 65) return '吉，留意小有波折';
    if (score >= 50) return '中平，吉凶参半，需权衡';
    if (score >= 35) return '凶中有吉，暗藏转机';
    return '大凶，但否极泰来，低谷即转机';
  }

  /* ========== 三、输入校验工具 ========== */

  /**
   * 校验必填参数，缺失时抛出明确错误
   * @param {object} params - 参数对象
   * @param {Array} required - 必填字段列表 [{name, type}]
   * @param {string} engineName - 引擎名称（用于错误消息）
   */
  function validateParams(params, required, engineName) {
    if (!params) {
      throw new Error('[' + (engineName || '引擎') + '] 参数不能为空');
    }
    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      var value = params[field.name];
      if (value === undefined || value === null) {
        throw new Error('[' + (engineName || '引擎') + '] 缺少必填参数：' + field.name);
      }
      if (field.type === 'string' && typeof value !== 'string') {
        throw new Error('[' + (engineName || '引擎') + '] 参数 ' + field.name + ' 应为字符串类型');
      }
      if (field.type === 'number' && typeof value !== 'number' && isNaN(Number(value))) {
        throw new Error('[' + (engineName || '引擎') + '] 参数 ' + field.name + ' 应为数字类型');
      }
      if (field.type === 'array' && !Array.isArray(value)) {
        throw new Error('[' + (engineName || '引擎') + '] 参数 ' + field.name + ' 应为数组类型');
      }
    }
  }

  /**
   * 安全获取值，提供默认值
   * @param {*} value - 待检查的值
   * @param {*} defaultValue - 默认值
   * @param {function} validator - 可选校验函数
   * @returns {*}
   */
  function safeGet(value, defaultValue, validator) {
    if (value === undefined || value === null) return defaultValue;
    if (validator && !validator(value)) return defaultValue;
    return value;
  }

  /**
   * 限制数值范围
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || min));
  }

  /* ========== 四、错误恢复工具 ========== */

  /**
   * 安全执行引擎方法，失败时返回降级结果
   * @param {function} fn - 引擎方法
   * @param {*} fallback - 降级返回值
   * @param {string} context - 错误上下文（用于日志）
   * @returns {*}
   */
  function safeExecute(fn, fallback, context) {
    try {
      return fn();
    } catch (e) {
      return fallback;
    }
  }

  // ===== 暴露 API =====
  var DualityAnalyzer = {
    // 双面解读
    getWuxingDuality: getWuxingDuality,
    addBalance: addBalance,
    generateFullDuality: generateFullDuality,
    getDualityLabel: getDualityLabel,

    // 输入校验
    validateParams: validateParams,
    safeGet: safeGet,
    clamp: clamp,

    // 错误恢复
    safeExecute: safeExecute,

    // 五行关系常量
    WUXING_DUALITY: WUXING_DUALITY,
  };

  // 挂载到全局（也挂到 Tianjige 命名空间，如果存在）
  global.DualityAnalyzer = DualityAnalyzer;
  if (global.Tianjige) {
    global.Tianjige.Duality = DualityAnalyzer;
  }
})(typeof window !== 'undefined' ? window : this);
