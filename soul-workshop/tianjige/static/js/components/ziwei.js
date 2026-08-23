/**
 * 天机阁 · 紫微斗数组件
 * 命盘类：出生日期+时辰+性别 → 十二宫 → 十四主星 → 四化 → 解读
 * 后台算法：陈希夷《紫微斗数全书》体系
 */
function renderZiweiComponent() {
  var container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML =
    '\
    <div class="section-header">\
      <h2 class="page-title">紫微斗数</h2>\
      <p class="page-subtitle">紫微帝星照命宫，十二宫垣定一生。后台融合陈希夷《紫微斗数全书》算法</p>\
    </div>\
\
    <div class="glass-card mb-24" id="ziwei-input-area">\
      <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;">\u{1F52E} 排盘参数</h3>\
      <div class="form-row" style="grid-template-columns:1fr 1fr 1fr;">\
        <div class="form-group">\
          <label class="form-label">出生日期</label>\
          <input type="date" class="form-input" id="ziwei-birthdate">\
        </div>\
        <div class="form-group">\
          <label class="form-label">出生时辰</label>\
          <select class="form-select" id="ziwei-birthtime">\
            <option value="\u5B50\u65F6">\u5B50\u65F6 (23:00-01:00)</option>\
            <option value="\u4E11\u65F6">\u4E11\u65F6 (01:00-03:00)</option>\
            <option value="\u5BC5\u65F6">\u5BC5\u65F6 (03:00-05:00)</option>\
            <option value="\u536F\u65F6">\u536F\u65F6 (05:00-07:00)</option>\
            <option value="\u8FB0\u65F6">\u8FB0\u65F6 (07:00-09:00)</option>\
            <option value="\u5DF3\u65F6" selected>\u5DF3\u65F6 (09:00-11:00)</option>\
            <option value="\u5348\u65F6">\u5348\u65F6 (11:00-13:00)</option>\
            <option value="\u672A\u65F6">\u672A\u65F6 (13:00-15:00)</option>\
            <option value="\u7533\u65F6">\u7533\u65F6 (15:00-17:00)</option>\
            <option value="\u9149\u65F6">\u9149\u65F6 (17:00-19:00)</option>\
            <option value="\u620C\u65F6">\u620C\u65F6 (19:00-21:00)</option>\
            <option value="\u4EA5\u65F6">\u4EA5\u65F6 (21:00-23:00)</option>\
          </select>\
        </div>\
        <div class="form-group">\
          <label class="form-label">性别</label>\
          <select class="form-select" id="ziwei-gender">\
            <option value="\u7537">\u7537</option>\
            <option value="\u5973">\u5973</option>\
          </select>\
        </div>\
      </div>\
\
      <div class="form-group" style="margin-top:16px;">\
        <label class="form-label">\u{1F52E} 你所问之事（可选）</label>\
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;" id="ziwei-domain-tags">\
          ' +
    [
      '\u{1F4BC} \u4E8B\u4E1A',
      '\u{1F495} \u611F\u60C5',
      '\u{1F4B0} \u8D22\u8FD0',
      '\u{1F3E5} \u5065\u5EB7',
      '\u{1F4DA} \u5B66\u4E1A',
      '\u{1F3E0} \u5BB6\u5EAD',
      '\u{1F91D} \u4EBA\u9645',
      '\u2708\uFE0F \u51FA\u884C',
    ]
      .map(function (d) {
        return (
          '<button class="btn-gold outline" style="font-size:0.75rem;padding:4px 10px;" data-domain="' +
          d +
          '">' +
          d +
          '</button>'
        );
      })
      .join('') +
    '\
        </div>\
        <input type="text" class="form-input" id="ziwei-question" placeholder="\u6216\u8F93\u5165\u4F60\u60F3\u95EE\u7684\u5177\u4F53\u95EE\u9898\uFF0C\u5982\uFF1A\u6700\u8FD1\u4E8B\u4E1A\u8FD0\u5982\u4F55\uFF1F...">\
      </div>\
\
      <button class="btn-gold lg" id="ziwei-submit" style="width:100%;margin-top:16px;">\u{1F52E} \u6392\u76D8\u63A8\u6F14</button>\
    </div>\
\
    <div id="ziwei-result-area" class="hidden">\
      <div class="glass-card" id="ziwei-result-card"></div>\
    </div>\
  ';

  // 设置默认日期
  var dateInput = container.querySelector('#ziwei-birthdate');
  dateInput.value = '2000-01-01';

  // 事域快捷按钮
  var domainTags = container.querySelectorAll('#ziwei-domain-tags button');
  var questionInput = container.querySelector('#ziwei-question');
  domainTags.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var domain = this.getAttribute('data-domain');
      questionInput.value = domain;
      questionInput.focus();
    });
  });

  // 排盘推演
  container.querySelector('#ziwei-submit').addEventListener('click', function () {
    var dateStr = dateInput.value;
    var birthTime = container.querySelector('#ziwei-birthtime').value;
    var gender = container.querySelector('#ziwei-gender').value;
    var question = questionInput.value.trim();

    if (!dateStr) {
      window.showToast && window.showToast('\u8BF7\u9009\u62E9\u51FA\u751F\u65E5\u671F');
      return;
    }

    var dp = dateStr.split('-');
    var params = {
      year: parseInt(dp[0]) || 2000,
      month: parseInt(dp[1]) || 1,
      day: parseInt(dp[2]) || 1,
      hour: birthTime,
      gender: gender,
      isLunar: false,
    };

    var result;
    try {
      result = ZiWeiEngine.paipan(params);
    } catch (e) {
      window.showToast && window.showToast('\u6392\u76D8\u5931\u8D25\uFF1A' + e.message);
      return;
    }

    renderZiweiResult(container, result, question);
  });

  return container;
}

function renderZiweiResult(container, result, question) {
  var resultArea = container.querySelector('#ziwei-result-area');
  var resultCard = container.querySelector('#ziwei-result-card');

  var mingGongZhuXing = result['\u547D\u5BAB\u4E3B\u661F'] || '\u65E0\u4E3B\u661F';
  var mingGong = result['\u547D\u5BAB'] || '?';
  var shenGong = result['\u8EAB\u5BAB'] || '?';
  var wuxingJu = result['\u4E94\u884C\u5C40'] || '?';
  var siHua = result['\u56DB\u5316'] || {};
  var gongs = result['\u5341\u4E8C\u5BAB'] || [];
  var overallVerdict = result['\u603B\u4F53\u8FD0\u52BF'] || '\u4E2D\u5E73';

  var gongNames = ZiWeiEngine.GONG_NAMES || [
    '\u547D\u5BAB',
    '\u5144\u5F1F',
    '\u592B\u59BB',
    '\u5B50\u5973',
    '\u8D22\u5E1B',
    '\u75BE\u5384',
    '\u8FC1\u79FB',
    '\u4EA4\u53CB',
    '\u5B98\u797F',
    '\u7530\u5B85',
    '\u798F\u5FB7',
    '\u7236\u6BCD',
  ];

  var gongCards = '';
  for (var i = 0; i < gongs.length; i++) {
    var g = gongs[i];
    var isMing = g.isMingGong ? 'minggong-highlight' : '';
    var isShen = g.isShenGong ? 'shengong-highlight' : '';
    var starStr = g.stars && g.stars.length > 0 ? g.stars.join('\u3001') : '\u2014';
    var marker = '';
    if (g.isMingGong) marker = ' <span style="color:var(--gold);font-size:0.7rem;">\u547D</span>';
    if (g.isShenGong) marker += ' <span style="color:#c9a84c;font-size:0.7rem;">\u8EAB</span>';

    gongCards +=
      '\
      <div class="ziwei-gong-card ' +
      isMing +
      ' ' +
      isShen +
      '">\
        <div class="gong-header">\
          <span class="gong-name">' +
      g.name +
      marker +
      '</span>\
          <span class="gong-ganzhi">' +
      g.ganZhi +
      '</span>\
        </div>\
        <div class="gong-stars">' +
      starStr +
      '</div>\
      </div>\
    ';
  }

  var html =
    '\
    <div class="section-header">\
      <h2 class="page-title">\u{1F52E} \u7D2B\u5FAE\u6597\u6570\u547D\u76D8</h2>\
      <p class="page-subtitle">\u519C\u5386' +
    (result['\u519C\u5386\u5E74'] || '?') +
    '\u5E74' +
    (result['\u519C\u5386\u6708'] || '?') +
    '\u6708' +
    (result['\u519C\u5386\u65E5'] || '?') +
    '\u65E5 | \u5E74\u5E72' +
    (result['\u5E74\u5E72'] || '?') +
    ' | \u547D\u5BAB\u4E3B\u661F\uFF1A' +
    mingGongZhuXing +
    '</p>\
    </div>\
\
    <div class="glass-card mb-24">\
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap;">\
        <span style="font-size:1.2rem;font-weight:700;color:var(--gold);">\u547D\u5BAB\uFF1A' +
    mingGong +
    '</span>\
        <span style="color:var(--text-secondary);">\u8EAB\u5BAB\uFF1A' +
    shenGong +
    '</span>\
        <span style="color:var(--text-secondary);">' +
    wuxingJu +
    '</span>\
      </div>\
\
      <div style="margin-bottom:16px;color:var(--text-secondary);">\
        \u56DB\u5316\uFF1A' +
    (siHua.lu || '?') +
    '\u5316\u7984 \u00B7 ' +
    (siHua.quan || '?') +
    '\u5316\u6743 \u00B7 ' +
    (siHua.ke || '?') +
    '\u5316\u79D1 \u00B7 ' +
    (siHua.ji || '?') +
    '\u5316\u5FCC\
      </div>\
\
      <div style="margin-bottom:16px;padding:12px;background:rgba(184,154,92,0.05);border-radius:8px;border-left:3px solid var(--gold);">\
        <strong style="color:var(--gold);">\u603B\u4F53\u8FD0\u52BF\uFF1A</strong> ' +
    overallVerdict +
    '\
      </div>\
\
      <h4 style="color:var(--gold);margin-bottom:8px;">\u{1F3E0} \u5341\u4E8C\u5BAB\u661F\u66DC\u5206\u5E03</h4>\
      <div class="ziwei-gongs-grid">\
        ' +
    gongCards +
    '\
      </div>\
\
      <h4 style="color:var(--gold);margin:20px 0 8px;">\u{1F4DD} \u547D\u76D8\u89E3\u8BFB</h4>\
      <div style="background:rgba(184,154,92,0.05);padding:16px;border-radius:8px;border-left:3px solid var(--gold);white-space:pre-wrap;line-height:1.8;font-size:0.9rem;">' +
    (result.interpretation || '') +
    '</div>\
    </div>\
  ';

  // 问事分析
  if (question && window.DomainAnalysis) {
    var da = window.DomainAnalysis.analyze('ziwei', result, question);
    if (da && da.analysis) {
      html +=
        '\
        <div class="glass-card mb-24">\
          <div style="background:rgba(184,154,92,0.05);padding:16px;border-radius:8px;white-space:pre-wrap;line-height:1.8;font-size:0.9rem;">' +
        da.analysis +
        '</div>\
        </div>\
      ';
    }
  }

  resultCard.innerHTML = html;
  resultArea.classList.remove('hidden');
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
