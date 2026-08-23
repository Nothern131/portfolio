/**
 * 天机阁 · Node.js 引擎测试脚本
 * 模拟浏览器环境，直接测试所有引擎
 */
'use strict';

// 模拟浏览器全局对象
global.window = global;
global.self = global;

// 加载所有引擎
const fs = require('fs');
const path = require('path');

const engineDir = path.join(__dirname, 'js');

const engines = [
  'bazi-engine.js',
  'liuyao-engine.js',
  'meihua-engine.js',
  'qimen-engine.js',
  'taiyi-engine.js',
  'zhuge-engine.js',
  'zhougong-engine.js',
  'daliuren-engine.js',
  'ziwei-engine.js',
  'engine-registry.js',
  'domain-analysis.js',
  'masters-engine.js',
  'composite-engine.js'
];

let passCount = 0;
let failCount = 0;
const results = [];

function test(name, fn) {
  try {
    const result = fn();
    const passed = result !== false && result !== null;
    if (passed) {
      passCount++;
      console.log(`  ✅ PASS: ${name}`);
    } else {
      failCount++;
      console.log(`  ❌ FAIL: ${name} — 返回空/false`);
    }
    results.push({ name, passed, detail: typeof result === 'string' ? result : JSON.stringify(result).substring(0, 200) });
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: ${name} — ${e.message}`);
    results.push({ name, passed: false, detail: e.message });
  }
}

// 加载引擎文件
console.log('📦 加载引擎文件...');
for (const file of engines) {
  try {
    const code = fs.readFileSync(path.join(engineDir, file), 'utf-8');
    eval(code);
    console.log(`  ✅ ${file}`);
  } catch (e) {
    console.log(`  ❌ ${file} — ${e.message}`);
  }
}

console.log('\n🧪 开始测试...\n');

// Test 1: BaziEngine
test('1. BaziEngine.paipan(2000,1,1,8)', () => {
  const r = BaziEngine.paipan(2000, 1, 1, 8);
  if (!r || !r['年柱'] || !r['月柱'] || !r['日柱'] || !r['时柱']) return false;
  return `年柱:${r['年柱']} 月柱:${r['月柱']} 日柱:${r['日柱']} 时柱:${r['时柱']} 运势:${r['综合运势']}`;
});

// Test 2: LiuyaoEngine
test('2. LiuyaoEngine.divine()', () => {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const t = (Math.random() > 0.5 ? 3 : 2) + (Math.random() > 0.5 ? 3 : 2) + (Math.random() > 0.5 ? 3 : 2);
    lines.push({ type: t % 2 === 0 ? 'yin' : 'yang', changing: t === 6 || t === 9 });
  }
  const r = LiuyaoEngine.divine(lines);
  if (!r || !r.gua_name) return false;
  return `卦名:${r.gua_name} level:${r.level}`;
});

// Test 3: MeihuaEngine
test('3. MeihuaEngine.divine({method:"random"})', () => {
  const r = MeihuaEngine.divine({ method: 'random' });
  if (!r || !r.original_gua || !r.original_gua.name) return false;
  return `本卦:${r.original_gua.name} 体用:${JSON.stringify(r.ti_yong)}`;
});

// Test 4: QimenEngine
test('4. QimenEngine.divine("2026-07-27","午时","auto")', () => {
  const r = QimenEngine.divine('2026-07-27', '午时', 'auto');
  if (!r || r.ju === undefined) return false;
  return `局数:${r.ju} 遁:${r.period} 节气:${r.jieqi}`;
});

// Test 5: TaiyiEngine
test('5. TaiyiEngine.divine("2026-07-27","午时")', () => {
  const r = TaiyiEngine.divine('2026-07-27', '午时');
  if (!r || r.ji_nian === undefined) return false;
  return `积年:${r.ji_nian} 纪元:${r.epoch} outcome:${r.outcome}`;
});

// Test 6: ZhugeEngine
test('6. ZhugeEngine.divine({numbers:[123,456,789]})', () => {
  const r = ZhugeEngine.divine({ method: 'number', numbers: [123, 456, 789] });
  if (!r || r.number === undefined || !r.poem) return false;
  return `签号:${r.number} level:${r.level} 签文:${r.poem.substring(0, 40)}`;
});

// Test 7: ZhougongEngine
test('7. ZhougongEngine.divine("梦见龙在天空飞翔","我最近事业运如何")', () => {
  const r = ZhougongEngine.divine('梦见龙在天空飞翔', '我最近事业运如何');
  if (!r || !r.results || r.results.length === 0) return false;
  return `匹配:${r.results.length}条 吉凶:${r.ji}`;
});

// Test 8: DaLiuRenEngine
test('8. DaLiuRenEngine.divine("2026-07-27",6)', () => {
  const r = DaLiuRenEngine.divine('2026-07-27', 6);
  if (!r || !r.ke_name || !r.san_chuan) return false;
  return `课名:${r.ke_name} 日干:${r.ri_gan} 三传:${JSON.stringify(r.san_chuan)}`;
});

// Test 9: ZiWeiEngine
test('9. ZiWeiEngine.paipan({2000,1,1,辰时,男})', () => {
  const r = ZiWeiEngine.paipan({ year: 2000, month: 1, day: 1, hour: '辰时', gender: '男', isLunar: false });
  if (!r || !r.命宫 || !r.命宫主星) return false;
  return `命宫:${r.命宫} 命宫主星:${r.命宫主星} 身宫:${r.身宫} 总体运势:${r.总体运势}`;
});

// Test 10: EngineRegistry
test('10. EngineRegistry.getAllKeys() — 应有10个引擎 (含风水独立板块)', () => {
  const keys = EngineRegistry.getAllKeys();
  if (keys.length !== 10) return false;
  return `注册引擎:${keys.length}个 — ${keys.join(', ')}`;
});

console.log('\n--- 异步测试 ---\n');

// Test 11: CompositeEngine (async)
const engineKeys = ['bazi', 'liuyao', 'meihua', 'qimen', 'taiyi', 'zhuge', 'zhougong', 'daliuren', 'ziwei'];
const uiParams = {
  birthDate: '2000-01-01', birthTime: '辰时', gender: '男',
  date: '2026-07-27', hour: '午时',
  dreamText: '梦见龙飞九天', question: '我今年的事业发展如何'
};

let compositeResult = null;

CompositeEngine.run(engineKeys, uiParams).then(result => {
  compositeResult = result;
  const ok = compositeResult && compositeResult.score !== undefined && compositeResult.individualResults;
  if (ok) {
    passCount++;
    console.log(`  ✅ PASS: 11. CompositeEngine.run() — 合参 (9引擎)`);
    console.log(`     综合评分:${compositeResult.score} 趋势:${compositeResult.trend} 有效引擎:${compositeResult.individualResults.length}`);
    console.log(`     研判:${compositeResult.synthesis ? compositeResult.synthesis.consensus : 'N/A'}`);
  } else {
    failCount++;
    console.log(`  ❌ FAIL: 11. CompositeEngine — 返回数据不完整`);
  }
}).catch(e => {
  failCount++;
  console.log(`  ❌ FAIL: 11. CompositeEngine — ${e.message}`);
}).finally(() => {
  // Test 12: DomainAnalysis
  try {
    const testBaziResult = BaziEngine.paipan(2000, 1, 1, 8);
    const domainResult = DomainAnalysis.analyze('bazi', testBaziResult, '我今年的事业发展如何');
    const ok = domainResult && domainResult.domain && domainResult.domain.key;
    if (ok) {
      passCount++;
      console.log(`  ✅ PASS: 12. DomainAnalysis.analyze("bazi", result, "我今年的事业发展如何")`);
      console.log(`     检测领域:${domainResult.domain.key} ${domainResult.domain.name} 分析长度:${domainResult.analysis ? domainResult.analysis.length : 0}字符`);
    } else {
      failCount++;
      console.log(`  ❌ FAIL: 12. DomainAnalysis — 返回数据不完整`);
    }
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: 12. DomainAnalysis — ${e.message}`);
  }

  // Test 13: MastersEngine.analyze (单个大师蒸馏)
  try {
    const testBazi = BaziEngine.paipan(2000, 1, 1, 8);
    const masterResult = MastersEngine.analyze('guiguzi', 'full', testBazi, '男');
    const ok = masterResult && masterResult.opening && masterResult.overview && masterResult.closing;
    if (ok) {
      passCount++;
      console.log(`  ✅ PASS: 13. MastersEngine.analyze("guiguzi", "full", bazi, "男")`);
      console.log(`     开篇:${masterResult.opening.length}字符 总论:${masterResult.overview.length}字符 结语:${masterResult.closing.length}字符`);
    } else {
      failCount++;
      console.log(`  ❌ FAIL: 13. MastersEngine.analyze — 返回数据不完整: ${JSON.stringify(Object.keys(masterResult || {}))}`);
    }
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: 13. MastersEngine.analyze — ${e.message}`);
  }

  // Test 14: MastersEngine.batchAnalyze (批量大师蒸馏 + 合参)
  try {
    const masterIds = ['guiguzi', 'shaoyong', 'zhugeliang', 'yuanli', 'shaoyanhe', 'nihaihsia'];
    const batchResult = MastersEngine.batchAnalyze(masterIds, compositeResult, '我今年的事业发展如何');
    const ok = batchResult && Array.isArray(batchResult) && batchResult.length === 6;
    if (ok) {
      passCount++;
      console.log(`  ✅ PASS: 14. MastersEngine.batchAnalyze(6位大师, 合参结果)`);
      for (let bi = 0; bi < batchResult.length; bi++) {
        const bm = batchResult[bi];
        console.log(`     ${bm.avatar} ${bm.name}(${bm.era}·${bm.title}): ${bm.commentary ? bm.commentary.length : 0}字符`);
      }
    } else {
      failCount++;
      console.log(`  ❌ FAIL: 14. MastersEngine.batchAnalyze — 返回${batchResult ? batchResult.length : 0}位大师 (期望6)`);
    }
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: 14. MastersEngine.batchAnalyze — ${e.message}`);
  }

  // Test 15: 新增大六壬大师蒸馏 (邵彦和)
  try {
    const testBazi = BaziEngine.paipan(2000, 1, 1, 8);
    const syhResult = MastersEngine.analyze('shaoyanhe', 'full', testBazi, '男');
    const ok = syhResult && syhResult.opening && syhResult.overview && syhResult.closing;
    if (ok) {
      passCount++;
      console.log(`  ✅ PASS: 15. 邵彦和(大六壬) 大师蒸馏`);
      console.log(`     开篇:${syhResult.opening.length}字符 总论:${syhResult.overview.length}字符`);
    } else {
      failCount++;
      console.log(`  ❌ FAIL: 15. 邵彦和大师蒸馏 — 返回: ${JSON.stringify(Object.keys(syhResult || {}))}`);
    }
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: 15. 邵彦和大师蒸馏 — ${e.message}`);
  }

  // Test 16: 新增紫微斗数大师蒸馏 (倪海厦)
  try {
    const testBazi = BaziEngine.paipan(2000, 1, 1, 8);
    const nhxResult = MastersEngine.analyze('nihaihsia', 'full', testBazi, '男');
    const ok = nhxResult && nhxResult.opening && nhxResult.overview && nhxResult.closing;
    if (ok) {
      passCount++;
      console.log(`  ✅ PASS: 16. 倪海厦(紫微斗数) 大师蒸馏`);
      console.log(`     开篇:${nhxResult.opening.length}字符 总论:${nhxResult.overview.length}字符`);
    } else {
      failCount++;
      console.log(`  ❌ FAIL: 16. 倪海厦大师蒸馏 — 返回: ${JSON.stringify(Object.keys(nhxResult || {}))}`);
    }
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: 16. 倪海厦大师蒸馏 — ${e.message}`);
  }

  // Test 17: 新增紫微斗数大师蒸馏 (王亭之)
  try {
    const testBazi = BaziEngine.paipan(2000, 1, 1, 8);
    const wtzResult = MastersEngine.analyze('wangtingzhi', 'full', testBazi, '男');
    const ok = wtzResult && wtzResult.opening && wtzResult.overview && wtzResult.closing;
    if (ok) {
      passCount++;
      console.log(`  ✅ PASS: 17. 王亭之(紫微斗数) 大师蒸馏`);
      console.log(`     开篇:${wtzResult.opening.length}字符 总论:${wtzResult.overview.length}字符`);
    } else {
      failCount++;
      console.log(`  ❌ FAIL: 17. 王亭之大师蒸馏 — 返回: ${JSON.stringify(Object.keys(wtzResult || {}))}`);
    }
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: 17. 王亭之大师蒸馏 — ${e.message}`);
  }

  // Test 18: 新增大六壬大师蒸馏 (陈公献)
  try {
    const testBazi = BaziEngine.paipan(2000, 1, 1, 8);
    const cgxResult = MastersEngine.analyze('chengongxian', 'full', testBazi, '男');
    const ok = cgxResult && cgxResult.opening && cgxResult.overview && cgxResult.closing;
    if (ok) {
      passCount++;
      console.log(`  ✅ PASS: 18. 陈公献(大六壬) 大师蒸馏`);
      console.log(`     开篇:${cgxResult.opening.length}字符 总论:${cgxResult.overview.length}字符`);
    } else {
      failCount++;
      console.log(`  ❌ FAIL: 18. 陈公献大师蒸馏 — 返回: ${JSON.stringify(Object.keys(cgxResult || {}))}`);
    }
  } catch (e) {
    failCount++;
    console.log(`  ❌ FAIL: 18. 陈公献大师蒸馏 — ${e.message}`);
  }

  // 打印总结
  console.log('\n' + '='.repeat(50));
  console.log(`📊 测试总结: 总计 ${passCount + failCount} 项 | 通过 ${passCount} | 失败 ${failCount}`);
  if (failCount === 0) {
    console.log('🎉 全部通过!');
  } else {
    console.log('⚠️ 存在失败项，需要修复');
  }
  console.log('='.repeat(50));
});