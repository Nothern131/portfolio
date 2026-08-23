/**
 * 天机阁 · 合参引擎 v3 — 多术数融合研判
 * 基于 EngineRegistry 统一调度 → 归一化 → 事域交叉 → 融合研判
 * 纯前端，零API
 */
(function (global) {
  'use strict';

  /* ========== 评分提取（通用） ========== */
  function getScoreFromResult(raw, key) {
    if (!raw) return 60;
    try {
      switch (key) {
        case 'bazi':
          if (raw['综合运势']) {
            var v = raw['综合运势'];
            if (typeof v === 'string') {
              if (v.indexOf('上') !== -1 || v.indexOf('吉') !== -1) return 75 + Math.floor(Math.random() * 15);
              if (v.indexOf('平') !== -1) return 55 + Math.floor(Math.random() * 10);
              return 45 + Math.floor(Math.random() * 10);
            }
          }
          return 65 + Math.floor(Math.random() * 20);
        case 'liuyao':
          if (raw.level) {
            if (raw.level.includes('上')) return 78 + Math.floor(Math.random() * 17);
            if (raw.level.includes('中')) return 58 + Math.floor(Math.random() * 15);
            return 38 + Math.floor(Math.random() * 15);
          }
          return 60 + Math.floor(Math.random() * 15);
        case 'meihua':
          if (raw.ti_yong && raw.ti_yong.relation) {
            var r = raw.ti_yong.relation;
            if (r === '用生体') return 82 + Math.floor(Math.random() * 13);
            if (r === '体用比和') return 75 + Math.floor(Math.random() * 10);
            if (r === '体克用') return 70 + Math.floor(Math.random() * 10);
            if (r === '体生用') return 55 + Math.floor(Math.random() * 10);
            return 38 + Math.floor(Math.random() * 12);
          }
          return 60 + Math.floor(Math.random() * 20);
        case 'qimen':
          if (raw.interpretation && raw.interpretation.indexOf('吉') !== -1 && raw.interpretation.indexOf('凶') === -1)
            return 72 + Math.floor(Math.random() * 18);
          if (raw.interpretation && raw.interpretation.indexOf('凶') !== -1) return 38 + Math.floor(Math.random() * 15);
          return 55 + Math.floor(Math.random() * 20);
        case 'taiyi':
          if (raw.outcome) {
            if (raw.outcome === '利主') return 70 + Math.floor(Math.random() * 15);
            if (raw.outcome === '利客') return 55 + Math.floor(Math.random() * 15);
          }
          return 55 + Math.floor(Math.random() * 20);
        case 'zhuge':
          if (raw.level) {
            if (raw.level.includes('上上')) return 88 + Math.floor(Math.random() * 12);
            if (raw.level.includes('上吉')) return 80 + Math.floor(Math.random() * 8);
            if (raw.level.includes('中吉')) return 68 + Math.floor(Math.random() * 12);
            if (raw.level.includes('中平')) return 52 + Math.floor(Math.random() * 13);
            return 35 + Math.floor(Math.random() * 17);
          }
          return 55 + Math.floor(Math.random() * 20);
        case 'zhougong':
          if (raw.ji) {
            if (raw.ji === '吉') return 72 + Math.floor(Math.random() * 18);
            if (raw.ji === '凶') return 30 + Math.floor(Math.random() * 20);
          }
          return 50 + Math.floor(Math.random() * 20);
        case 'daliuren':
          if (raw.level) {
            if (raw.level.includes('吉') || raw.level.includes('上')) return 75 + Math.floor(Math.random() * 15);
            if (raw.level.includes('凶')) return 35 + Math.floor(Math.random() * 15);
          }
          return 60 + Math.floor(Math.random() * 15);
        case 'ziwei':
          if (raw.总体运势) {
            if (raw.总体运势.indexOf('吉') !== -1 || raw.总体运势.indexOf('上') !== -1)
              return 75 + Math.floor(Math.random() * 15);
            if (raw.总体运势.indexOf('平') !== -1) return 55 + Math.floor(Math.random() * 10);
          }
          return 60 + Math.floor(Math.random() * 20);
        default:
          return 60 + Math.floor(Math.random() * 15);
      }
    } catch (e) {
      return 60 + Math.floor(Math.random() * 15);
    }
  }

  function getTrendFromResult(raw, key) {
    var score = getScoreFromResult(raw, key);
    if (score >= 72) return 'up';
    if (score <= 45) return 'down';
    return 'flat';
  }

  /* ========== 归一化（通用） ========== */
  function normalizeResult(key, raw, config) {
    if (!raw) {
      raw = {};
    }
    var cfg = config || { name: key, icon: '❓', weight: 1.0 };
    var score = getScoreFromResult(raw, key);
    var trend = getTrendFromResult(raw, key);
    var summary = '',
      detail = '',
      keyInsights = [],
      verdict = '';

    try {
      switch (key) {
        case 'bazi': {
          var riZhu = raw['日柱'] || '?';
          var dayMaster = typeof riZhu === 'string' && riZhu.length > 0 ? riZhu[0] : '?';
          var dayWx =
            { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[
              dayMaster
            ] || '?';
          summary = '日主' + dayMaster + '（五行属' + dayWx + '），本命格局稳固，五行流通有情。';
          detail = raw['分析'] || '八字整体五行较为均衡，喜用神得力。';
          keyInsights = ['五行流通有情', '日主得令得地', '大运流年可借势'];
          verdict = raw['综合运势'] || '中上';
          break;
        }
        case 'liuyao': {
          var guaName = raw.gua_name || '未知卦';
          var changedName = raw.changed_gua ? raw.changed_gua.name : '';
          summary = '得「' + guaName + (changedName ? '→' + changedName : '') + '」，爻象动而趋吉。';
          detail = raw.interpretation || '';
          keyInsights = ['世应关系明确', '动爻提示关键节点', '变卦显最终走向'];
          verdict = raw.level || '小吉';
          break;
        }
        case 'meihua': {
          var origName = raw.original_gua && raw.original_gua.name ? raw.original_gua.name : '';
          var tiYong = raw.ti_yong || {};
          summary = '本卦为「' + origName + '」，体用关系为「' + (tiYong.relation || '?') + '」。';
          detail = raw.interpretation || '';
          keyInsights = ['体用生克有法度', '本互变三卦有序', '动静变化有象可寻'];
          verdict = tiYong.relation || '中性';
          break;
        }
        case 'qimen': {
          var juShu = raw.ju_num || raw.ju || '?';
          var isYang = raw.period && raw.period.indexOf('阳') !== -1 ? '阳遁' : '阴遁';
          summary = '当前为' + juShu + '局（' + isYang + '），时空格局已显。';
          detail = raw.interpretation || '';
          keyInsights = ['吉门临宫得位', '方位得时顺势', '格局无战克之象'];
          verdict = raw.interpretation && raw.interpretation.indexOf('凶') !== -1 ? '偏凶' : '吉凶参半';
          break;
        }
        case 'taiyi': {
          var jiNian = raw.ji_nian || '?';
          var epoch = raw.epoch || '?';
          summary = '太乙积年' + jiNian + '，当前为' + epoch + '元，十六神各有归位。';
          detail = raw.interpretation || '';
          keyInsights = ['神数归位有序', '大势持平无偏', '无凶星直冲之象'];
          verdict = raw.outcome || '主客相安';
          break;
        }
        case 'zhuge': {
          var num = raw.number || '?';
          var lvl = raw.level || '中平';
          var poem = raw.poem || '';
          var shortPoem = poem.replace(/\n/g, ' ').substring(0, 40);
          summary = '第' + num + '签「' + lvl + '」—— "' + shortPoem + '"';
          detail = raw.interpretation || '';
          keyInsights = ['签文寓意明确', '指引方向清晰', '暗合古贤智慧'];
          if (lvl.includes('上')) verdict = '上签';
          else if (lvl.includes('中')) verdict = '中签';
          else verdict = '下签';
          break;
        }
        case 'zhougong': {
          var cnt = raw.results && raw.results.length ? raw.results.length : 0;
          var jiStr = raw.ji || '中';
          summary = '匹配到' + cnt + '个梦境条目，梦兆' + jiStr + '。';
          detail = raw.interpretation || raw.questionAnalysis || '';
          keyInsights = ['梦境映射潜意识', '象煞提示吉凶转化', '可结合现实对照'];
          verdict = jiStr;
          break;
        }
        case 'daliuren': {
          var keName = raw.ke_name || '未知课';
          var chuanName = raw.chuan || '';
          summary = '得「' + keName + '」课' + (chuanName ? '，三传' + chuanName : '') + '。';
          detail = raw.interpretation || '';
          keyInsights = ['月将得时', '四课有象', '三传显变化之机'];
          verdict = raw.level || '吉凶参半';
          break;
        }
        case 'ziwei': {
          var mingGong = raw.命宫主星 || '?';
          summary = '命宫主星' + mingGong + '，十二宫各有归位。';
          detail = raw.interpretation || raw.总体运势 || '';
          keyInsights = ['命宫主星定格局', '三方四正有照应', '四化飞星显吉凶'];
          verdict = raw.总体运势 || '中平';
          break;
        }
        default:
          summary = key + '推演完成';
          detail = raw.interpretation || (typeof raw === 'string' ? raw : JSON.stringify(raw).substring(0, 100));
          keyInsights = ['推演完成'];
          verdict = '待判';
      }
    } catch (e) {
      summary = key + '推演完成';
      detail = '数据解析异常：' + e.message;
      keyInsights = ['推演完成'];
      verdict = '待判';
    }

    return {
      method: key,
      name: cfg.name,
      icon: cfg.icon,
      score: score,
      trend: trend,
      verdict: verdict,
      summary: summary,
      detail: detail,
      keyInsights: keyInsights,
      weight: cfg.weight || 1.0,
    };
  }

  /* ========== 事域交叉分析 ========== */
  function crossDomainAnalysis(results, question, domainKey) {
    var domainName = '综合运势';
    var domainIcon = '🔮';

    if (global.DomainAnalysis && global.DomainAnalysis.getDomains) {
      var domains = global.DomainAnalysis.getDomains();
      for (var i = 0; i < domains.length; i++) {
        if (domains[i].key === domainKey) {
          domainName = domains[i].name;
          domainIcon = domains[i].icon;
          break;
        }
      }
    }

    var domainInsights = [];
    var domainScores = { up: 0, flat: 0, down: 0 };

    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var methodInsight = '';

      if (r.score >= 72) {
        domainScores.up++;
        methodInsight = r.name + '对此事持积极态度（' + r.score + '分），提示' + domainName + '方面有上升势能。';
      } else if (r.score <= 45) {
        domainScores.down++;
        methodInsight = r.name + '对此事持谨慎态度（' + r.score + '分），' + domainName + '方面需注意潜在风险。';
      } else {
        domainScores.flat++;
        methodInsight = r.name + '对此事持中性态度（' + r.score + '分），' + domainName + '方面趋于平稳。';
      }

      if (r.keyInsights && r.keyInsights.length > 0) {
        methodInsight += ' 关键提示：' + r.keyInsights.slice(0, 2).join('；') + '。';
      }

      domainInsights.push({ method: r.name, icon: r.icon, insight: methodInsight, score: r.score });
    }

    var totalDomain = domainScores.up + domainScores.flat + domainScores.down;
    var domainConsensusText = '';

    if (domainScores.up > totalDomain * 0.6) {
      domainConsensusText = '多术数一致看好' + domainName + '，此领域当前处于上升通道，宜积极作为。';
    } else if (domainScores.down > totalDomain * 0.6) {
      domainConsensusText = '多术数一致警示' + domainName + '，此领域当前承压，宜韬光养晦、蓄力待发。';
    } else if (domainScores.up > domainScores.down) {
      domainConsensusText = '多数术数看好' + domainName + '，虽有分歧但整体向好，建议审慎推进。';
    } else if (domainScores.down > domainScores.up) {
      domainConsensusText = '多数术数对' + domainName + '持谨慎态度，建议暂缓重大决策，观察后再动。';
    } else {
      domainConsensusText = '各术数对' + domainName + '看法不一，此事尚需更多信息才能判断，建议多角度观察。';
    }

    return {
      domainKey: domainKey,
      domainName: domainName,
      domainIcon: domainIcon,
      consensusText: domainConsensusText,
      insights: domainInsights,
      upCount: domainScores.up,
      flatCount: domainScores.flat,
      downCount: domainScores.down,
    };
  }

  /* ========== 融洽磨合分析（两两比对） ========== */
  function harmonyAnalysis(results) {
    if (!results || results.length < 2) return null;

    var pairs = [];
    for (var i = 0; i < results.length; i++) {
      for (var j = i + 1; j < results.length; j++) {
        var a = results[i];
        var b = results[j];
        var pair = analyzePair(a, b);
        pairs.push(pair);
      }
    }

    // 按融洽度排序
    pairs.sort(function (a, b) {
      return b.harmony - a.harmony;
    });

    // 计算总体融洽磨合指标
    var totalHarmony = 0;
    var totalFriction = 0;
    for (var pi = 0; pi < pairs.length; pi++) {
      totalHarmony += pairs[pi].harmony;
      totalFriction += pairs[pi].friction;
    }
    var avgHarmony = pairs.length > 0 ? Math.round(totalHarmony / pairs.length) : 50;
    var avgFriction = pairs.length > 0 ? Math.round(totalFriction / pairs.length) : 50;

    // 融洽度最高和最低的组合
    var bestPair = pairs[0];
    var worstPair = pairs[pairs.length - 1];

    // 生成分析文本
    var analysis = generateHarmonyNarrative(pairs, avgHarmony, avgFriction, bestPair, worstPair);

    return {
      pairs: pairs,
      avgHarmony: avgHarmony,
      avgFriction: avgFriction,
      bestPair: bestPair,
      worstPair: worstPair,
      analysis: analysis,
    };
  }

  /** 分析两个术数之间的融洽磨合关系 */
  function analyzePair(a, b) {
    var scoreDiff = Math.abs(a.score - b.score);
    var trendAgree = a.trend === b.trend;
    var scoreGap = Math.abs(a.score - b.score);

    // 融洽度：分数越接近、趋势一致 → 融洽度高
    var harmony = 100 - scoreGap;
    if (trendAgree) harmony += 15;
    if (scoreGap <= 10) harmony += 10;
    if (scoreGap >= 30) harmony -= 15;
    harmony = Math.round(Math.min(100, Math.max(0, harmony)));

    // 磨合度：分数差距越大 → 需要更多磨合
    var friction = scoreGap;
    if (!trendAgree) friction += 15; // 趋势不一致增加磨合
    if (a.score >= 70 && b.score <= 45) friction += 10; // 一方看好一方看衰
    friction = Math.round(Math.min(100, Math.max(0, friction)));

    // 融洽度等级
    var harmonyLevel;
    if (harmony >= 80) harmonyLevel = '高度融洽';
    else if (harmony >= 65) harmonyLevel = '较为融洽';
    else if (harmony >= 50) harmonyLevel = '基本融洽';
    else if (harmony >= 35) harmonyLevel = '需要磨合';
    else harmonyLevel = '分歧较大';

    // 磨合度等级
    var frictionLevel;
    if (friction <= 15) frictionLevel = '几乎无摩擦';
    else if (friction <= 30) frictionLevel = '轻微摩擦';
    else if (friction <= 50) frictionLevel = '中等摩擦';
    else if (friction <= 70) frictionLevel = '较大摩擦';
    else frictionLevel = '严重摩擦';

    // 生成描述
    var description = generatePairDescription(a, b, scoreDiff, trendAgree, harmonyLevel, frictionLevel);

    return {
      methodA: a.name,
      methodB: b.name,
      iconA: a.icon,
      iconB: b.icon,
      scoreA: a.score,
      scoreB: b.score,
      trendA: a.trend,
      trendB: b.trend,
      scoreDiff: scoreDiff,
      trendAgree: trendAgree,
      harmony: harmony,
      friction: friction,
      harmonyLevel: harmonyLevel,
      frictionLevel: frictionLevel,
      description: description,
    };
  }

  /** 生成一对术数的融洽磨合描述 */
  function generatePairDescription(a, b, scoreDiff, trendAgree, harmonyLevel, frictionLevel) {
    var desc = '';

    // 分数对比
    var higher = a.score >= b.score ? a : b;
    var lower = a.score >= b.score ? b : a;

    desc += higher.name + '（' + higher.score + '分）比' + lower.name + '（' + lower.score + '分）';
    if (scoreDiff <= 5) desc += '几乎一致，两术数所见略同。';
    else if (scoreDiff <= 15) desc += '略有差异，但总体方向一致。';
    else if (scoreDiff <= 25) desc += '存在一定差距，需仔细甄别。';
    else desc += '差距较大，需要综合分析。';

    // 趋势分析
    if (trendAgree) {
      if (a.trend === 'up') desc += ' 两术数均呈上升态势，说明此方向有较强支撑。';
      else if (a.trend === 'down') desc += ' 两术数均呈下行态势，宜谨慎对待。';
      else desc += ' 两术数均趋于平稳，不宜激进。';
    } else {
      desc +=
        ' 但趋势方向不一致：' +
        higher.name +
        '倾向' +
        (higher.trend === 'up' ? '乐观' : higher.trend === 'down' ? '谨慎' : '中性') +
        '，' +
        lower.name +
        '倾向' +
        (lower.trend === 'up' ? '乐观' : lower.trend === 'down' ? '谨慎' : '中性') +
        '。';
    }

    // 融洽/磨合建议
    if (harmonyLevel === '高度融洽') {
      desc += ' 此组合融洽度极高，结论高度一致，可以放心采纳。';
    } else if (harmonyLevel === '较为融洽') {
      desc += ' 此组合较为融洽，小有分歧但大方向一致，可作为主要参考。';
    } else if (harmonyLevel === '基本融洽') {
      desc += ' 此组合基本融洽，存在一定分歧，建议结合其他术数综合判断。';
    } else if (harmonyLevel === '需要磨合') {
      desc += ' 此组合需要磨合，两术数从不同维度揭示了不同信号，建议分开解读后综合。';
    } else {
      desc += ' 此组合分歧较大，说明此事在玄学层面存在不确定性，不宜草率决策。';
    }

    return desc;
  }

  /** 生成融洽磨合总体分析文本 */
  function generateHarmonyNarrative(pairs, avgHarmony, avgFriction, bestPair, worstPair) {
    var lines = [];

    lines.push('【融洽度总评】');
    lines.push('参与合参的术数之间，总体融洽度为' + avgHarmony + '分，磨合度为' + avgFriction + '分。');

    if (avgHarmony >= 75) {
      lines.push('各术数之间高度融洽，结论一致性强，说明此事在玄学层面有明确指向。');
    } else if (avgHarmony >= 60) {
      lines.push('各术数之间较为融洽，虽有细微差异，但大方向可辨。');
    } else if (avgHarmony >= 45) {
      lines.push('各术数之间存在一定分歧，需仔细甄别各术数的侧重维度。');
    } else {
      lines.push('各术数之间分歧较大，建议增加术数参与量或重新聚焦问题。');
    }

    lines.push('');
    lines.push('【最佳融洽组合】');
    lines.push(bestPair.iconA + ' ' + bestPair.methodA + ' ↔ ' + bestPair.iconB + ' ' + bestPair.methodB);
    lines.push(
      '融洽度：' +
        bestPair.harmony +
        '分（' +
        bestPair.harmonyLevel +
        '），磨合度：' +
        bestPair.friction +
        '分（' +
        bestPair.frictionLevel +
        '）'
    );
    lines.push(bestPair.description);

    if (worstPair && worstPair !== bestPair) {
      lines.push('');
      lines.push('【最需磨合组合】');
      lines.push(worstPair.iconA + ' ' + worstPair.methodA + ' ↔ ' + worstPair.iconB + ' ' + worstPair.methodB);
      lines.push(
        '融洽度：' +
          worstPair.harmony +
          '分（' +
          worstPair.harmonyLevel +
          '），磨合度：' +
          worstPair.friction +
          '分（' +
          worstPair.frictionLevel +
          '）'
      );
      lines.push(worstPair.description);
    }

    lines.push('');
    lines.push('【两两对比明细】');
    for (var i = 0; i < pairs.length; i++) {
      var p = pairs[i];
      var bar = '';
      for (var b = 0; b < Math.round(p.harmony / 10); b++) bar += '█';
      for (var eb = Math.round(p.harmony / 10); eb < 10; eb++) bar += '░';
      lines.push(p.iconA + p.methodA + '(' + p.scoreA + '分) ↔ ' + p.iconB + p.methodB + '(' + p.scoreB + '分)');
      lines.push(
        '  融洽度 ' +
          p.harmony +
          '% ' +
          bar +
          ' | ' +
          p.harmonyLevel +
          ' | 磨合度 ' +
          p.friction +
          '%（' +
          p.frictionLevel +
          '）'
      );
    }

    return lines.join('\n');
  }
  function synthesizeResults(results, question) {
    var count = results.length;
    if (count === 0) {
      return { consensus: '无足够数据', confidence: 'low', narrative: '请至少选择一种术数进行推演。' };
    }

    var totalWeight = 0,
      weightedSum = 0;
    var scores = [];
    for (var i = 0; i < results.length; i++) {
      var w = results[i].weight || 1.0;
      totalWeight += w;
      weightedSum += (results[i].score || 60) * w;
      scores.push(results[i].score || 60);
    }
    var avgScore = Math.round(weightedSum / totalWeight);
    var maxScore = Math.max.apply(null, scores);
    var minScore = Math.min.apply(null, scores);
    var range = maxScore - minScore;
    var isConsistent = range <= 25;

    var domainKey = null;
    if (global.DomainAnalysis && global.DomainAnalysis.analyze && question && question.trim()) {
      try {
        var firstMethod = results[0] && results[0].method ? results[0].method : 'bazi';
        var daResult = global.DomainAnalysis.analyze(firstMethod, {}, question);
        if (daResult && daResult.domain) {
          domainKey = daResult.domain.key;
        }
      } catch (daErr) {
      }
    }
    if (!domainKey) domainKey = 'career';

    var domainAnalysis = crossDomainAnalysis(results, question, domainKey);

    var narrative = '';
    var consensusLabel = '';

    var questionText = question || '当前运势';
    var domainName = domainAnalysis.domainName;

    var sorted = results.slice().sort(function (a, b) {
      return b.score - a.score;
    });
    var topMethod = sorted[0];
    var bottomMethod = sorted[sorted.length - 1];

    var detailBreakdown = '';
    for (var di = 0; di < results.length; di++) {
      var r = results[di];
      detailBreakdown += '■ ' + r.icon + ' ' + r.name + '（' + r.score + '分）：' + r.summary;
      if (r.keyInsights && r.keyInsights.length > 0) {
        detailBreakdown += ' 关键提示：' + r.keyInsights.slice(0, 2).join('；');
      }
      detailBreakdown += '\n';
    }

    if (isConsistent) {
      if (avgScore >= 75) {
        consensusLabel = '诸术同辉 · 吉兆明确';
        narrative =
          '【总体研判】\n' +
          count +
          '门术数同频共振，加权综合评分' +
          avgScore +
          '分，结论高度一致。\n' +
          '这种高度一致性本身就说明问题——' +
          domainName +
          '方面，天时地利人和的叠加效应正在显现。\n\n' +
          '【各术推演详情】\n' +
          detailBreakdown +
          '\n' +
          '【' +
          domainName +
          '专项研判】\n' +
          domainAnalysis.consensusText +
          '\n\n' +
          '【三阶段推演】\n' +
          '▶ 近期（1-3个月）：' +
          topMethod.name +
          '提示，' +
          domainName +
          '方面将迎来一个关键窗口期。此时宜主动出击，把握先机。\n' +
          '▶ 中期（3-6个月）：前期积累的势能将开始释放，但需注意节奏控制。顺势而为比逆势强求更有效。\n' +
          '▶ 远期（6-12个月）：' +
          domainName +
          '方面的格局将趋于稳定，此时宜做长远规划，巩固已有成果。\n\n';
      } else if (avgScore >= 60) {
        consensusLabel = '诸术同源 · 平稳向好';
        narrative =
          '【总体研判】\n' +
          count +
          '门术数结论一致，加权综合评分' +
          avgScore +
          '分，皆示平稳向好。\n' +
          '这个分数段意味着：' +
          domainName +
          '方面不会出现戏剧性的大起大落，而是稳步推进的态势。\n\n' +
          '【各术推演详情】\n' +
          detailBreakdown +
          '\n' +
          '【' +
          domainName +
          '专项研判】\n' +
          domainAnalysis.consensusText +
          '\n\n' +
          '【三阶段推演】\n' +
          '▶ 近期（1-3个月）：' +
          domainName +
          '方面趋于平稳，此时不宜冒进，但也不应消极等待。稳中求进是当前最优策略。\n' +
          '▶ 中期（3-6个月）：随着外部环境变化，' +
          domainName +
          '方面可能出现新的机遇窗口。建议在此期间做好能力储备和资源积累。\n' +
          '▶ 远期（6-12个月）：' +
          domainName +
          '方面的格局将逐步明朗，届时可基于实际情况做出更精准的决策。\n\n';
      } else {
        consensusLabel = '诸术同示 · 谨慎前行';
        narrative =
          '【总体研判】\n' +
          count +
          '门术数一致指向，加权综合评分' +
          avgScore +
          '分，' +
          domainName +
          '方面需谨慎应对。\n' +
          '这个分数段提示：' +
          domainName +
          '方面当前承压，但一致的低分恰好说明问题所在——看清了问题，才能有针对性地解决。\n\n' +
          '【各术推演详情】\n' +
          detailBreakdown +
          '\n' +
          '【' +
          domainName +
          '专项研判】\n' +
          domainAnalysis.consensusText +
          '\n\n' +
          '【三阶段推演】\n' +
          '▶ 近期（1-3个月）：' +
          domainName +
          '方面可能面临挑战，建议暂缓重大决策，先观察局势变化。\n' +
          '▶ 中期（3-6个月）：随着外部环境调整，' +
          domainName +
          '方面可能出现转机，但需主动出击而非被动等待。\n' +
          '▶ 远期（6-12个月）：' +
          domainName +
          '方面的格局将重新洗牌，届时宜重新评估方向，做出调整。\n\n';
      }
    } else {
      consensusLabel = '参差见微 · 动态演化';
      narrative =
        '【总体研判】\n' +
        count +
        '门术数结论存在分歧，最高' +
        maxScore +
        '分，最低' +
        minScore +
        '分，跨度' +
        range +
        '分。\n' +
        '这种分歧本身就是重要信息：' +
        domainName +
        '方面正处于变化之中，不同术数从不同角度捕捉到了不同的信号。\n\n' +
        '【各术推演详情】\n' +
        detailBreakdown +
        '\n' +
        '【' +
        domainName +
        '专项研判】\n' +
        domainAnalysis.consensusText +
        '\n\n' +
        '【分歧解析】\n' +
        topMethod.name +
        '（' +
        topMethod.score +
        '分）最为乐观，提示' +
        domainName +
        '方面有向好趋势。\n' +
        bottomMethod.name +
        '（' +
        bottomMethod.score +
        '分）最为谨慎，提示' +
        domainName +
        '方面存在隐患。\n' +
        '两术数从不同维度揭示了同一件事的不同面向——乐观的一面让你看到希望，谨慎的一面让你保持清醒。\n\n' +
        '【三阶段推演】\n' +
        '▶ 近期（1-3个月）：' +
        domainName +
        '方面可能会经历波动，不宜做重大决策，先观察再说。\n' +
        '▶ 中期（3-6个月）：随着更多信息浮现，' +
        domainName +
        '方面的方向将更加清晰，届时再做判断。\n' +
        '▶ 远期（6-12个月）：' +
        domainName +
        '方面的格局将趋于稳定，前期的谨慎观望将换来更准确的判断。\n\n';
    }

    return {
      consensus: consensusLabel,
      confidence: isConsistent ? 'high' : 'medium',
      narrative: narrative,
      count: count,
      spread: range,
      hasConflict: !isConsistent,
      domainAnalysis: domainAnalysis,
      harmonyAnalysis: harmonyAnalysis(results),
    };
  }

  /* ========== 公开 API ========== */
  global.CompositeEngine = {
    /**
     * 执行合参推演
     * @param {string[]} methods - 引擎标识数组
     * @param {object} uiParams - 用户输入参数
     * @returns {Promise<object>} 合参结果
     */
    run: function (methods, uiParams) {
      methods = methods || ['bazi'];
      uiParams = uiParams || {};

      var registry = global.EngineRegistry;
      if (!registry) {
        return Promise.resolve({
          score: 50,
          trend: 'flat',
          individualResults: [],
          synthesis: { consensus: '引擎注册中心未加载', confidence: 'low', narrative: '请刷新页面重试。' },
          timestamp: new Date().toISOString(),
        });
      }

      return registry
        .executeAll(methods, uiParams)
        .then(function (engineResults) {
          try {
            // 归一化各引擎结果
            var normalized = [];
            for (var i = 0; i < engineResults.length; i++) {
              var er = engineResults[i];
              if (er.raw === null) continue;
              var norm = normalizeResult(er.key, er.raw, er.config);
              normalized.push(norm);
            }

            var overallScore = calculateOverallScore(normalized);
            var overallTrend = calculateOverallTrend(normalized);
            var synthesis = synthesizeResults(normalized, uiParams.question);

            return {
              score: overallScore,
              trend: overallTrend,
              individualResults: normalized,
              synthesis: synthesis,
              timestamp: new Date().toISOString(),
            };
          } catch (e) {
            return {
              score: 60,
              trend: 'flat',
              individualResults: engineResults
                .filter(function (er) {
                  return er.raw !== null;
                })
                .map(function (er) {
                  return normalizeResult(er.key, er.raw || {}, er.config);
                }),
              synthesis: {
                consensus: '推演完成（部分结果异常）',
                confidence: 'low',
                narrative: '部分术数推演异常，但已完成的基础分析如下：\n' + (e.message || '未知错误'),
              },
              timestamp: new Date().toISOString(),
            };
          }
        })
        .catch(function (err) {
          return {
            score: 50,
            trend: 'flat',
            individualResults: [],
            synthesis: {
              consensus: '推演异常',
              confidence: 'low',
              narrative: '合参引擎执行异常：' + (err.message || '未知错误') + '\n请刷新页面重试。',
            },
            timestamp: new Date().toISOString(),
          };
        });
    },

    calculateOverallScore: calculateOverallScore,
    calculateOverallTrend: calculateOverallTrend,
    normalizeResult: normalizeResult,
    synthesizeResults: synthesizeResults,
  };

  function calculateOverallScore(results) {
    if (!results || results.length === 0) return 60;
    var totalW = 0,
      sumW = 0;
    for (var i = 0; i < results.length; i++) {
      var w = results[i].weight || 1.0;
      totalW += w;
      sumW += (results[i].score || 60) * w;
    }
    return Math.round(sumW / totalW);
  }

  function calculateOverallTrend(results) {
    if (!results || results.length === 0) return 'flat';
    var up = 0,
      down = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i].trend === 'up') up++;
      if (results[i].trend === 'down') down++;
    }
    if (up > down) return 'up';
    if (down > up) return 'down';
    return 'flat';
  }
})(typeof window !== 'undefined' ? window : this);
