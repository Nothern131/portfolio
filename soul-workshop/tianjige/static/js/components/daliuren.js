/**
 * 天机阁 · 大六壬组件
 * 时空类：日期+时辰 → 天地盘 → 四课 → 三传 → 十二天将
 * 后台算法：邵彦和《六壬断案》体系
 */
function renderDaliurenComponent() {
  var container = document.createElement('div');
  container.className = 'fade-in';

  container.innerHTML =
    '\
    <div class="section-header">\
      <h2 class="page-title">大六壬</h2>\
      <p class="page-subtitle">天地盘起课，四课三传定吉凶，十二天将察神机。后台融合邵彦和《六壬断案》算法</p>\
    </div>\
\
    <div class="glass-card mb-24" id="daliuren-input-area">\
      <h3 style="font-family:var(--font-serif);color:var(--gold);margin-bottom:16px;">\u{1F30A} 起课参数</h3>\
      <div class="form-row" style="grid-template-columns:1fr 1fr;">\
        <div class="form-group">\
          <label class="form-label">日期</label>\
          <input type="date" class="form-input" id="daliuren-date">\
        </div>\
        <div class="form-group">\
          <label class="form-label">时辰</label>\
          <select class="form-select" id="daliuren-hour">\
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
      </div>\
\
      <div class="form-group" style="margin-top:16px;">\
        <label class="form-label">\u{1F52E} 你所问之事（可选）</label>\
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;" id="daliuren-domain-tags">\
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
        <input type="text" class="form-input" id="daliuren-question" placeholder="\u6216\u8F93\u5165\u4F60\u60F3\u95EE\u7684\u5177\u4F53\u95EE\u9898\uFF0C\u5982\uFF1A\u6700\u8FD1\u4E8B\u4E1A\u8FD0\u5982\u4F55\uFF1F...">\
      </div>\
\
      <button class="btn-gold lg" id="daliuren-submit" style="width:100%;margin-top:16px;">\u{1F30A} \u8D77\u8BFE\u63A8\u6F14</button>\
    </div>\
\
    <div id="daliuren-result-area" class="hidden">\
      <div class="glass-card" id="daliuren-result-card"></div>\
    </div>\
  ';

  // 设置默认日期
  var dateInput = container.querySelector('#daliuren-date');
  dateInput.value = new Date().toISOString().slice(0, 10);

  // 事域快捷按钮
  var domainTags = container.querySelectorAll('#daliuren-domain-tags button');
  var questionInput = container.querySelector('#daliuren-question');
  domainTags.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var domain = this.getAttribute('data-domain');
      questionInput.value = domain;
      questionInput.focus();
    });
  });

  // 起课推演
  container.querySelector('#daliuren-submit').addEventListener('click', function () {
    var dateStr = dateInput.value;
    var hourStr = container.querySelector('#daliuren-hour').value;
    var question = questionInput.value.trim();

    var hourMap = {
      '\u5B50\u65F6': 0,
      '\u4E11\u65F6': 1,
      '\u5BC5\u65F6': 2,
      '\u536F\u65F6': 3,
      '\u8FB0\u65F6': 4,
      '\u5DF3\u65F6': 5,
      '\u5348\u65F6': 6,
      '\u672A\u65F6': 7,
      '\u7533\u65F6': 8,
      '\u9149\u65F6': 9,
      '\u620C\u65F6': 10,
      '\u4EA5\u65F6': 11,
    };
    var hourNum = hourMap[hourStr] || 5;

    if (!dateStr) {
      window.showToast && window.showToast('\u8BF7\u9009\u62E9\u65E5\u671F');
      return;
    }

    var result;
    try {
      result = DaLiuRenEngine.divine(dateStr, hourNum);
    } catch (e) {
      window.showToast && window.showToast('\u8D77\u8BFE\u5931\u8D25\uFF1A' + e.message);
      return;
    }

    renderDaliurenResult(container, result, question);
  });

  return container;
}

function renderDaliurenResult(container, result, question) {
  var resultArea = container.querySelector('#daliuren-result-area');
  var resultCard = container.querySelector('#daliuren-result-card');

  var keName = result.ke_name || '\u672A\u77E5\u8BFE';
  var level = result.level || '\u4E2D\u5E73';
  var levelClass = level === '\u5409' ? 'level-good' : level === '\u504F\u51F6' ? 'level-bad' : 'level-neutral';

  var siKe = result.si_ke || {};
  var sanChuan = result.san_chuan || {};
  var tianJiang = result.tian_jiang || {};

  var chuChuan = sanChuan.chu || '?';
  var zhongChuan = sanChuan.zhong || '?';
  var moChuan = sanChuan.mo || '?';

  var jiangNames = DaLiuRenEngine.JIANG_NAMES || {};

  var html =
    '\
    <div class="section-header">\
      <h2 class="page-title">\u{1F30A} \u5927\u516D\u58EC\u8BFE\u5F0F</h2>\
      <p class="page-subtitle">\u65E5\u671F\uFF1A' +
    result.date +
    ' | \u5360\u65F6\uFF1A' +
    result.zhan_shi +
    ' | \u6708\u5C06\uFF1A' +
    (result.yue_jiang_name || '?') +
    '</p>\
    </div>\
\
    <div class="glass-card mb-24">\
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">\
        <span class="' +
    levelClass +
    '" style="font-size:1.2rem;font-weight:700;">' +
    level +
    '</span>\
        <span style="font-size:1.5rem;font-family:var(--font-serif);color:var(--gold);">\u300C' +
    keName +
    '\u300D\u8BFE</span>\
      </div>\
      <p style="color:var(--text-secondary);margin-bottom:16px;">\u65E5\u5E72' +
    result.ri_gan +
    ' \u00B7 \u65E5\u652F' +
    result.ri_zhi +
    '</p>\
\
      <h4 style="color:var(--gold);margin-bottom:8px;">\u{1F4DC} \u4E09\u4F20</h4>\
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">\
        <div class="chuan-card">\
          <div class="chuan-label">\u521D\u4F20</div>\
          <div class="chuan-value">' +
    chuChuan +
    '</div>\
          <div class="chuan-name">' +
    (jiangNames[chuChuan] || '') +
    '</div>\
          <div class="chuan-jiang">' +
    (tianJiang[chuChuan] || '') +
    '</div>\
        </div>\
        <div class="chuan-arrow">\u2192</div>\
        <div class="chuan-card">\
          <div class="chuan-label">\u4E2D\u4F20</div>\
          <div class="chuan-value">' +
    zhongChuan +
    '</div>\
          <div class="chuan-name">' +
    (jiangNames[zhongChuan] || '') +
    '</div>\
          <div class="chuan-jiang">' +
    (tianJiang[zhongChuan] || '') +
    '</div>\
        </div>\
        <div class="chuan-arrow">\u2192</div>\
        <div class="chuan-card">\
          <div class="chuan-label">\u672B\u4F20</div>\
          <div class="chuan-value">' +
    moChuan +
    '</div>\
          <div class="chuan-name">' +
    (jiangNames[moChuan] || '') +
    '</div>\
          <div class="chuan-jiang">' +
    (tianJiang[moChuan] || '') +
    '</div>\
        </div>\
      </div>\
\
      <h4 style="color:var(--gold);margin-bottom:8px;">\u{1F4CB} \u56DB\u8BFE</h4>\
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">\
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:6px;">\
          \u7B2C\u4E00\u8BFE\uFF1A' +
    (siKe.ke1 ? siKe.ke1.xia + '\u4E0A' + siKe.ke1.shang : '?') +
    '\
        </div>\
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:6px;">\
          \u7B2C\u4E8C\u8BFE\uFF1A' +
    (siKe.ke2 ? siKe.ke2.xia + '\u4E0A' + siKe.ke2.shang : '?') +
    '\
        </div>\
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:6px;">\
          \u7B2C\u4E09\u8BFE\uFF1A' +
    (siKe.ke3 ? siKe.ke3.xia + '\u4E0A' + siKe.ke3.shang : '?') +
    '\
        </div>\
        <div style="background:rgba(255,255,255,0.03);padding:8px 12px;border-radius:6px;">\
          \u7B2C\u56DB\u8BFE\uFF1A' +
    (siKe.ke4 ? siKe.ke4.xia + '\u4E0A' + siKe.ke4.shang : '?') +
    '\
        </div>\
      </div>\
\
      <h4 style="color:var(--gold);margin-bottom:8px;">\u{1F4DD} \u8BFE\u5F0F\u89E3\u8BFB</h4>\
      <div style="background:rgba(184,154,92,0.05);padding:16px;border-radius:8px;border-left:3px solid var(--gold);white-space:pre-wrap;line-height:1.8;font-size:0.9rem;">' +
    (result.interpretation || '') +
    '</div>\
    </div>\
  ';

  // 问事分析
  if (question && window.DomainAnalysis) {
    var da = window.DomainAnalysis.analyze('daliuren', result, question);
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
