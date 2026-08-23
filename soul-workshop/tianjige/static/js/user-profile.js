/**
 * 天机阁用户档案系统
 * 数据存储在localStorage，微信内置浏览器完全支持
 * Key: tianjige_profile
 */
(function(){
  'use strict';

  var STORAGE_KEY = 'tianjige_profile';
  var DEFAULT_PROFILE = {
    name: '',
    birthDate: '',
    gender: 'male',
    consultations: [],
    settings: { theme: 'dark' }
  };

  // ===== 基础读写 =====
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
      var data = JSON.parse(raw);
      // 合并默认值
      return Object.assign({}, DEFAULT_PROFILE, data, {
        consultations: (data.consultations || []).concat(DEFAULT_PROFILE.consultations.slice(0, 0))
      });
    } catch(e) {
      console.error('[天机阁] 读取档案失败:', e);
      return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }
  }

  function save(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return true;
    } catch(e) {
      console.error('[天机阁] 保存档案失败:', e);
      return false;
    }
  }

  // ===== 用户信息 =====
  function getBasicInfo() {
    var p = load();
    return {
      name: p.name || '',
      birthDate: p.birthDate || '',
      gender: p.gender || 'male'
    };
  }

  function setBasicInfo(info) {
    var p = load();
    if (info.name !== undefined) p.name = info.name;
    if (info.birthDate !== undefined) p.birthDate = info.birthDate;
    if (info.gender !== undefined) p.gender = info.gender;
    return save(p);
  }

  // ===== 咨询记录 =====
  function addConsultation(record) {
    var p = load();
    record.id = record.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    record.timestamp = record.timestamp || Date.now();
    record.type = record.type || 'other';
    record.question = record.question || '';
    record.result = record.result || {};
    record.score = record.score || 0;

    p.consultations.unshift(record);
    // 最多保留500条
    if (p.consultations.length > 500) {
      p.consultations = p.consultations.slice(0, 500);
    }
    return save(p) && record.id;
  }

  function getConsultations(filter) {
    var p = load();
    var list = p.consultations;
    if (!filter) return list;
    if (filter.type) {
      list = list.filter(function(c) { return c.type === filter.type; });
    }
    if (filter.keyword) {
      var kw = filter.keyword.toLowerCase();
      list = list.filter(function(c) {
        return c.question.toLowerCase().indexOf(kw) !== -1;
      });
    }
    return list;
  }

  function deleteConsultation(id) {
    var p = load();
    p.consultations = p.consultations.filter(function(c) { return c.id !== id; });
    return save(p);
  }

  function clearConsultations() {
    var p = load();
    p.consultations = [];
    return save(p);
  }

  // ===== 导出/导入 =====
  function exportProfile() {
    return JSON.stringify(load(), null, 2);
  }

  function importProfile(json) {
    try {
      var data = JSON.parse(json);
      var p = load();
      if (data.name) p.name = data.name;
      if (data.birthDate) p.birthDate = data.birthDate;
      if (data.gender) p.gender = data.gender;
      if (data.consultations && Array.isArray(data.consultations)) {
        p.consultations = data.consultations.concat(p.consultations);
      }
      return save(p);
    } catch(e) {
      console.error('[天机阁] 导入失败:', e);
      return false;
    }
  }

  // ===== EP专用记录 =====
  function addLiuyaoRecord(result, question) {
    return addConsultation({
      type: 'liuyao',
      question: question || '',
      result: {
        mainGua: result.mainGua,
        changeGua: result.changeGua,
        huGua: result.huGua,
        tiGua: result.tiGua,
        yongGua: result.yongGua,
        verdict: result.verdict
      },
      score: result.verdictScore || 0
    });
  }

  function addMeihuaRecord(result, question) {
    return addConsultation({
      type: 'meihua',
      question: question || '',
      result: {
        originalGua: result.original_gua,
        changedGua: result.changed_gua,
        huGua: result.hu_gua,
        tiGua: result.ti_gua,
        yongGua: result.yong_gua,
        shengKe: result.sheng_ke
      },
      score: (result.sheng_ke && result.sheng_ke.等级 || 0) * 20
    });
  }

  function addBaziRecord(result, question) {
    return addConsultation({
      type: 'bazi',
      question: question || '',
      result: {
        pillars: result.pillars,
        analysis: result.analysis
      },
      score: result.score || 0
    });
  }

  // ===== 统计 =====
  function getStats() {
    var p = load();
    var byType = {};
    p.consultations.forEach(function(c) {
      byType[c.type] = (byType[c.type] || 0) + 1;
    });
    return {
      total: p.consultations.length,
      byType: byType,
      name: p.name,
      gender: p.gender
    };
  }

  // ===== 公开API =====
  window.UserProfile = {
    load: load,
    save: save,
    getBasicInfo: getBasicInfo,
    setBasicInfo: setBasicInfo,
    addConsultation: addConsultation,
    getConsultations: getConsultations,
    deleteConsultation: deleteConsultation,
    clearConsultations: clearConsultations,
    exportProfile: exportProfile,
    importProfile: importProfile,
    addLiuyaoRecord: addLiuyaoRecord,
    addMeihuaRecord: addMeihuaRecord,
    addBaziRecord: addBaziRecord,
    getStats: getStats
  };

  // 兼容旧版调用
  window.UserProfile.init = function() {};
  console.log('[天机阁] 用户档案系统已加载');
})();
