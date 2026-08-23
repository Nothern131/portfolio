/**
 * 天机阁 · 引擎注册中心 v1 — 纯前端，零API
 * 统一管理所有术数引擎的注册、参数构建、调度执行
 * 新加引擎只需在此注册一条记录，无需改动合参代码
 */
(function (global) {
  'use strict';

  /* ========== 输入类型枚举 ========== */
  var INPUT_TYPE = {
    BIRTH: 'birthchart', // 命盘类：需要出生日期+时辰
    INSTANT: 'instant', // 即时类：无需额外参数，随机起卦
    SPACETIME: 'spacetime', // 时空类：需要日期+时辰
    TEXT: 'text', // 文本类：需要文本描述
  };

  /* ========== 引擎注册表 ========== */
  var REGISTRY = {};

  /**
   * 注册一个引擎
   * @param {string} key - 引擎唯一标识
   * @param {object} config - 引擎配置
   *   name: 显示名称
   *   icon: 图标
   *   inputType: 输入类型 (INPUT_TYPE 枚举)
   *   engineName: 全局对象名 (如 'BaziEngine')
   *   methodName: 调用方法名 (如 'paipan')
   *   requiredParams: 需要的参数键列表
   *   weight: 权重因子 (默认1.0)
   *   buildParams: function(uiParams) → 返回传递给 engine.methodName 的参数数组
   *   uiFields: 需要额外UI输入的字段描述 [{key, label, type, options}]
   */
  function register(key, config) {
    REGISTRY[key] = config;
  }

  /** 获取引擎配置 */
  function get(key) {
    return REGISTRY[key] || null;
  }

  /** 获取所有已注册引擎的 key */
  function getAllKeys() {
    return Object.keys(REGISTRY);
  }

  /** 按输入类型分组 */
  function getByInputType(type) {
    var result = [];
    var keys = Object.keys(REGISTRY);
    for (var i = 0; i < keys.length; i++) {
      if (REGISTRY[keys[i]].inputType === type) {
        result.push(keys[i]);
      }
    }
    return result;
  }

  /** 获取指定引擎集合需要的所有UI字段（去重合并） */
  function getRequiredUIFields(keys) {
    var fields = [];
    var seen = {};
    for (var i = 0; i < keys.length; i++) {
      var config = REGISTRY[keys[i]];
      if (!config || !config.uiFields) continue;
      for (var j = 0; j < config.uiFields.length; j++) {
        var f = config.uiFields[j];
        if (!seen[f.key]) {
          seen[f.key] = true;
          fields.push(f);
        }
      }
    }
    return fields;
  }

  /** 获取引擎需要的输入类型集合 */
  function getInputTypesForKeys(keys) {
    var types = {};
    for (var i = 0; i < keys.length; i++) {
      var config = REGISTRY[keys[i]];
      if (config) types[config.inputType] = true;
    }
    return Object.keys(types);
  }

  /**
   * 执行单个引擎
   * @param {string} key - 引擎标识
   * @param {object} uiParams - 用户输入的参数
   * @returns {Promise} 返回引擎原始结果
   */
  function execute(key, uiParams) {
    var config = REGISTRY[key];
    if (!config) {
      return Promise.resolve(null);
    }

    try {
      var engineObj = global[config.engineName];
      if (!engineObj) {
        return Promise.resolve(null);
      }

      var fn = engineObj[config.methodName];
      if (typeof fn !== 'function') {
        return Promise.resolve(null);
      }

      // 构建参数
      var args;
      if (typeof config.buildParams === 'function') {
        args = config.buildParams(uiParams || {});
      } else {
        args = [];
      }

      // 确保 args 是数组
      if (!Array.isArray(args)) args = [args];

      // 调用引擎
      var result = fn.apply(engineObj, args);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.resolve(null);
    }
  }

  /**
   * 批量执行引擎
   * @param {string[]} keys - 引擎标识数组
   * @param {object} uiParams - 用户输入的参数
   * @returns {Promise<Array>} 返回 [{key, raw, config}] 数组
   */
  function executeAll(keys, uiParams) {
    var promises = keys.map(function (key) {
      return execute(key, uiParams)
        .then(function (raw) {
          return { key: key, raw: raw, config: REGISTRY[key] };
        })
        .catch(function (err) {
          return { key: key, raw: null, config: REGISTRY[key] };
        });
    });
    return Promise.all(promises);
  }

  /* ========== 注册所有引擎 ========== */

  // 1. 八字排盘 — 命盘类
  register('bazi', {
    name: '八字排盘',
    icon: '📅',
    inputType: INPUT_TYPE.BIRTH,
    engineName: 'BaziEngine',
    methodName: 'paipan',
    weight: 1.0,
    uiFields: [
      { key: 'birthDate', label: '出生日期', type: 'date' },
      {
        key: 'birthTime',
        label: '出生时辰',
        type: 'select',
        options: ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'],
      },
      { key: 'gender', label: '性别', type: 'select', options: ['男', '女'] },
    ],
    buildParams: function (ui) {
      var dp = (ui.birthDate || '2000-01-01').split('-');
      var hourMap = {
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
      var hour = hourMap[ui.birthTime] || 0;
      return [parseInt(dp[0]) || 2000, parseInt(dp[1]) || 1, parseInt(dp[2]) || 1, hour];
    },
  });

  // 2. 六爻占卜 — 即时类
  register('liuyao', {
    name: '六爻占卜',
    icon: '🪙',
    inputType: INPUT_TYPE.INSTANT,
    engineName: 'LiuyaoEngine',
    methodName: 'divine',
    weight: 1.0,
    uiFields: [],
    buildParams: function () {
      var lines = [];
      for (var i = 0; i < 6; i++) {
        var total = (Math.random() > 0.5 ? 3 : 2) + (Math.random() > 0.5 ? 3 : 2) + (Math.random() > 0.5 ? 3 : 2);
        lines.push({ type: total % 2 === 0 ? 'yin' : 'yang', changing: total === 6 || total === 9 });
      }
      return [lines];
    },
  });

  // 3. 梅花易数 — 即时类
  register('meihua', {
    name: '梅花易数',
    icon: '🌸',
    inputType: INPUT_TYPE.INSTANT,
    engineName: 'MeihuaEngine',
    methodName: 'divine',
    weight: 0.9,
    uiFields: [],
    buildParams: function () {
      return [{ method: 'random' }];
    },
  });

  // 4. 奇门遁甲 — 时空类
  register('qimen', {
    name: '奇门遁甲',
    icon: '☯️',
    inputType: INPUT_TYPE.SPACETIME,
    engineName: 'QimenEngine',
    methodName: 'divine',
    weight: 1.1,
    uiFields: [
      { key: 'date', label: '日期', type: 'date' },
      {
        key: 'hour',
        label: '时辰',
        type: 'select',
        options: ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'],
      },
    ],
    buildParams: function (ui) {
      var dateStr = ui.date || new Date().toISOString().slice(0, 10);
      return [dateStr, ui.hour || '子时', 'auto'];
    },
  });

  // 5. 太乙神数 — 时空类
  register('taiyi', {
    name: '太乙神数',
    icon: '🌌',
    inputType: INPUT_TYPE.SPACETIME,
    engineName: 'TaiyiEngine',
    methodName: 'divine',
    weight: 1.0,
    uiFields: [
      { key: 'date', label: '日期', type: 'date' },
      {
        key: 'hour',
        label: '时辰',
        type: 'select',
        options: ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'],
      },
    ],
    buildParams: function (ui) {
      var dateStr = ui.date || new Date().toISOString().slice(0, 10);
      return [dateStr, ui.hour || '子时'];
    },
  });

  // 6. 诸葛神数 — 即时类
  register('zhuge', {
    name: '诸葛神数',
    icon: '📜',
    inputType: INPUT_TYPE.INSTANT,
    engineName: 'ZhugeEngine',
    methodName: 'divine',
    weight: 0.85,
    uiFields: [],
    buildParams: function () {
      var n1 = Math.floor(Math.random() * 999) + 1;
      var n2 = Math.floor(Math.random() * 999) + 1;
      var n3 = Math.floor(Math.random() * 999) + 1;
      return [{ method: 'number', numbers: [n1, n2, n3] }];
    },
  });

  // 7. 周公解梦 — 文本类
  register('zhougong', {
    name: '周公解梦',
    icon: '🌙',
    inputType: INPUT_TYPE.TEXT,
    engineName: 'ZhougongEngine',
    methodName: 'divine',
    weight: 0.8,
    uiFields: [{ key: 'dreamText', label: '梦境描述', type: 'textarea' }],
    buildParams: function (ui) {
      return [ui.dreamText || '梦见龙飞翔', ui.question || ''];
    },
  });

  // 8. 大六壬 — 时空类（新）
  register('daliuren', {
    name: '大六壬',
    icon: '🌊',
    inputType: INPUT_TYPE.SPACETIME,
    engineName: 'DaLiuRenEngine',
    methodName: 'divine',
    weight: 1.1,
    uiFields: [
      { key: 'date', label: '日期', type: 'date' },
      {
        key: 'hour',
        label: '时辰',
        type: 'select',
        options: ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'],
      },
    ],
    buildParams: function (ui) {
      var dateStr = ui.date || new Date().toISOString().slice(0, 10);
      var hourMap = {
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
      return [dateStr, hourMap[ui.hour] || 0];
    },
  });

  // 9. 紫微斗数 — 命盘类（新）
  register('ziwei', {
    name: '紫微斗数',
    icon: '🔮',
    inputType: INPUT_TYPE.BIRTH,
    engineName: 'ZiWeiEngine',
    methodName: 'paipan',
    weight: 1.0,
    uiFields: [
      { key: 'birthDate', label: '出生日期', type: 'date' },
      {
        key: 'birthTime',
        label: '出生时辰',
        type: 'select',
        options: ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'],
      },
      { key: 'gender', label: '性别', type: 'select', options: ['男', '女'] },
    ],
    buildParams: function (ui) {
      var dp = (ui.birthDate || '2000-01-01').split('-');
      return {
        year: parseInt(dp[0]) || 2000,
        month: parseInt(dp[1]) || 1,
        day: parseInt(dp[2]) || 1,
        hour: ui.birthTime || '子时',
        gender: ui.gender || '男',
        isLunar: false,
      };
    },
  });

  // 10. 风水排盘 — 时空类（独立板块，不算在合参）
  register('fengshui', {
    name: '风水格局',
    icon: '🏔️',
    inputType: INPUT_TYPE.SPACETIME,
    engineName: 'FengshuiEngine',
    methodName: 'divine',
    weight: 0,
    uiFields: [
      {
        key: 'fengshuiSitting',
        label: '坐山',
        type: 'select',
        options: [
          '子',
          '午',
          '卯',
          '酉',
          '乾',
          '坤',
          '艮',
          '巽',
          '壬',
          '癸',
          '丑',
          '寅',
          '甲',
          '乙',
          '辰',
          '巳',
          '丙',
          '丁',
          '未',
          '申',
          '庚',
          '辛',
          '戌',
          '亥',
        ],
      },
      {
        key: 'fengshuiFacing',
        label: '朝向',
        type: 'select',
        options: [
          '子',
          '午',
          '卯',
          '酉',
          '乾',
          '坤',
          '艮',
          '巽',
          '壬',
          '癸',
          '丑',
          '寅',
          '甲',
          '乙',
          '辰',
          '巳',
          '丙',
          '丁',
          '未',
          '申',
          '庚',
          '辛',
          '戌',
          '亥',
        ],
      },
      { key: 'fengshuiBuildYear', label: '建房年份', type: 'number' },
    ],
    buildParams: function (ui) {
      return {
        sitting: ui.fengshuiSitting || '子',
        facing: ui.fengshuiFacing || '午',
        buildYear: parseInt(ui.fengshuiBuildYear) || new Date().getFullYear(),
        currentYear: new Date().getFullYear(),
      };
    },
  });

  /* ========== 公开 API ========== */
  global.EngineRegistry = {
    INPUT_TYPE: INPUT_TYPE,
    register: register,
    get: get,
    getAllKeys: getAllKeys,
    getByInputType: getByInputType,
    getRequiredUIFields: getRequiredUIFields,
    getInputTypesForKeys: getInputTypesForKeys,
    execute: execute,
    executeAll: executeAll,
    REGISTRY: REGISTRY,
  };

  if (typeof global.Tianjige !== 'undefined' && global.Tianjige.Logger) {
    global.Tianjige.Logger.log('引擎注册中心加载完成，共 ' + Object.keys(global.EngineRegistry.REGISTRY).length + ' 个引擎');
  }
})(typeof window !== 'undefined' ? window : this);
