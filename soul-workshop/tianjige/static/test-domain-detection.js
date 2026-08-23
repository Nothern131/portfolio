/**
 * 天机阁 · 领域检测全面测试
 * 覆盖所有9个领域 + 边界情况 + 混合关键词 + 短输入
 */
'use strict';

global.window = global;
global.self = global;

const fs = require('fs');
const path = require('path');

// 加载 domain-analysis.js
const code = fs.readFileSync(path.join(__dirname, 'js', 'domain-analysis.js'), 'utf-8');
eval(code);

// 获取 detectDomain 函数
const detectDomain = global.DomainAnalysis ? global.DomainAnalysis.detectDomain : null;
if (!detectDomain) {
  console.error('❌ 无法获取 detectDomain 函数');
  process.exit(1);
}

let pass = 0, fail = 0;

function test(name, question, expected) {
  const result = detectDomain(question);
  const ok = result === expected;
  if (ok) {
    pass++;
    console.log(`  ✅ ${name} → "${expected}"`);
  } else {
    fail++;
    console.log(`  ❌ ${name}: 输入="${question}" 期望="${expected}" 实际="${result}"`);
  }
}

console.log('🧪 天机阁 · 领域检测全面测试\n');

// ========== 事业 (career) ==========
console.log('【💼 事业前程】');
test('事业-工作', '工作怎么样', 'career');
test('事业-跳槽', '今年适合跳槽吗', 'career');
test('事业-公务员', '考公务员好还是继续干互联网', 'career');
test('事业-考公', '考公和考研哪个好', 'career');
test('事业-创业', '现在创业合适吗', 'career');
test('事业-职场', '在职场中如何发展', 'career');
test('事业-升职', '什么时候能升职', 'career');
test('事业-面试', '下个月面试能过吗', 'career');
test('事业-转行', '35岁转行还来得及吗', 'career');
test('事业-体制', '进体制内还是留在外面', 'career');
test('事业-互联网', '互联网行业还能干多久', 'career');
test('事业-大厂', '大厂和小公司怎么选', 'career');
test('事业-项目', '这个项目能成功吗', 'career');
test('事业-老板', '老板对我怎么样', 'career');
test('事业-同事', '同事关系怎么处理', 'career');
test('事业-前途', '前途如何', 'career');
test('事业-职业', '职业发展方向', 'career');
test('事业-公司', '公司前景怎么样', 'career');
test('事业-求职', '求职运如何', 'career');
test('事业-晋升', '晋升机会大吗', 'career');
test('事业-行业', '哪个行业适合我', 'career');
test('事业-方向', '发展方向怎么选', 'career');
test('事业-发展', '未来发展怎么样', 'general');
test('事业-生意', '做生意能赚钱吗', 'wealth');
test('事业-选择', '两个选择哪个好', 'general');

// ========== 感情 (love) ==========
console.log('【💕 感情姻缘】');
test('感情-感情', '感情运势如何', 'love');
test('感情-爱情', '爱情什么时候来', 'love');
test('感情-婚姻', '婚姻状况怎么样', 'love');
test('感情-恋爱', '恋爱运如何', 'love');
test('感情-分手', '分手后还能复合吗', 'love');
test('感情-复合', '能复合吗', 'love');
test('感情-对象', '什么时候能找到对象', 'love');
test('感情-伴侣', '伴侣对我是真心的吗', 'love');
test('感情-表白', '表白能成功吗', 'love');
test('感情-暗恋', '暗恋的人喜欢我吗', 'love');
test('感情-相亲', '相亲对象怎么样', 'love');
test('感情-单身', '什么时候能脱单', 'love');
test('感情-出轨', '对方出轨了怎么办', 'love');
test('感情-暧昧', '这段暧昧关系有结果吗', 'love');
test('感情-缘分', '缘分什么时候到', 'love');
test('感情-正缘', '正缘什么时候出现', 'love');
test('感情-桃花', '桃花运怎么样', 'love');
test('感情-离婚', '离婚后运势如何', 'love');
test('感情-结婚', '今年适合结婚吗', 'love');
test('感情-夫妻', '夫妻关系怎么改善', 'love');
test('感情-未婚', '未婚先孕怎么看', 'love');
test('感情-已婚', '已婚女性的事业运', 'career');
test('感情-分居', '分居后是否有复合可能', 'love');
test('感情-复婚', '复婚好不好', 'love');
test('感情-再婚', '再婚运势如何', 'love');
test('感情-姻缘', '姻缘线怎么看', 'love');
test('感情-老公', '老公的事业运', 'career');
test('感情-老婆', '老婆的身体健康', 'health');
test('感情-吵架', '和伴侣吵架了怎么办', 'love');
test('感情-冷战', '冷战中对方在想什么', 'love');
test('感情-配偶', '配偶运势如何', 'love');
test('感情-二婚', '二婚会幸福吗', 'love');
test('感情-嫁人', '什么时候能嫁人', 'love');
test('感情-娶媳', '娶媳妇要看八字吗', 'love');

// ========== 财运 (wealth) ==========
console.log('【💰 财运财富】');
test('财运-财运', '财运怎么样', 'wealth');
test('财运-财富', '财富积累的时机', 'wealth');
test('财运-投资', '投资什么方向好', 'wealth');
test('财运-理财', '理财方面有什么建议', 'wealth');
test('财运-股票', '股票投资运势', 'wealth');
test('财运-基金', '基金能赚钱吗', 'wealth');
test('财运-收入', '收入什么时候能涨', 'wealth');
test('财运-债务', '债务什么时候能还清', 'wealth');
test('财运-亏损', '亏损能挽回吗', 'wealth');
test('财运-赚钱', '赚钱的门路有哪些', 'wealth');
test('财运-偏财', '偏财运怎么样', 'wealth');
test('财运-正财', '正财运好不好', 'wealth');
test('财运-花销', '花销太大了怎么办', 'wealth');
test('财运-贷款', '贷款买房合适吗', 'wealth');
test('财运-买房', '今年买房合适吗', 'wealth');
test('财运-买车', '买车时机对吗', 'wealth');
test('财运-钱', '什么时候能有钱', 'wealth');

// ========== 健康 (health) ==========
console.log('【🏥 健康平安】');
test('健康-健康', '健康状况如何', 'health');
test('健康-身体', '身体状况怎么样', 'health');
test('健康-疾病', '疾病什么时候能好', 'health');
test('健康-生病', '生病了什么时候能康复', 'health');
test('健康-康复', '康复得怎么样', 'health');
test('健康-手术', '手术顺利吗', 'health');
test('健康-体检', '体检结果怎么样', 'health');
test('健康-失眠', '失眠怎么调理', 'health');
test('健康-头痛', '头痛是什么原因', 'health');
test('健康-养生', '养生方面有什么建议', 'health');
test('健康-减肥', '减肥能成功吗', 'health');
test('健康-怀孕', '什么时候能怀孕', 'health');
test('健康-平安', '家人平安吗', 'health');

// ========== 学业 (study) ==========
console.log('【📚 学业考试】');
test('学业-学业', '学业运势如何', 'study');
test('学业-考试', '考试能过吗', 'study');
test('学业-学习', '学习方向怎么选', 'study');
test('学业-成绩', '成绩什么时候出来', 'study');
test('学业-高考', '高考能考好吗', 'study');
test('学业-考研', '考研能上岸吗', 'study');
test('学业-考证', '考证运如何', 'study');
test('学业-升学', '升学顺利吗', 'study');
test('学业-毕业', '毕业后的方向', 'study');
test('学业-论文', '论文能过吗', 'study');
test('学业-学校', '选哪个学校好', 'study');
test('学业-专业', '专业选择建议', 'study');
test('学业-录取', '录取结果怎么样', 'study');
test('学业-分数', '分数够不够', 'study');
test('学业-挂科', '挂科了怎么办', 'study');
test('学业-读书', '读书运怎么样', 'study');
test('学业-备考', '备考期间运势', 'study');
test('学业-复习', '复习效率怎么提高', 'study');

// ========== 家庭 (family) ==========
console.log('【🏠 家庭关系】');
test('家庭-家庭', '家庭关系怎么样', 'family');
test('家庭-家人', '家人健康运', 'health');
test('家庭-父母', '父母的身体状况', 'health');
test('家庭-子女', '子女的学业运', 'study');
test('家庭-孩子', '孩子的未来发展', 'family');
test('家庭-亲情', '亲情关系怎么维护', 'family');
test('家庭-婆媳', '婆媳关系怎么处理', 'family');
test('家庭-亲戚', '亲戚之间有纠纷', 'social');
test('家庭-长辈', '长辈的身体健康', 'health');
test('家庭-兄弟姐妹', '兄弟姐妹的关系', 'family');
test('家庭-公公', '公公脾气不好怎么办', 'family');
test('家庭-婆婆', '婆婆对我有意见', 'family');
test('家庭-岳父', '岳父对我的态度', 'family');
test('家庭-岳母', '岳母喜欢我吗', 'family');
test('家庭-继母', '继母关系怎么处理', 'family');
test('家庭-继父', '继父对我好不好', 'family');
test('家庭-养父', '养父的身体状况', 'health');
test('家庭-养母', '养母对我怎么样', 'family');
test('家庭-独生子', '独生子的压力', 'family');
test('家庭-独生女', '独生女的责任', 'family');
test('家庭-亲家', '亲家关系怎么处', 'family');
test('家庭-后代', '后代运势如何', 'family');
test('家庭-生育', '生育方面的问题', 'family');
test('家庭-代沟', '代沟怎么解决', 'family');
test('家庭-家教', '家教方式对吗', 'family');
test('家庭-家风', '家风传承问题', 'family');
test('家庭-祖孙', '祖孙关系怎么样', 'family');
test('家庭-家族', '家族运势如何', 'family');
test('家庭-传宗', '传宗接代的压力', 'family');
test('家庭-香火', '香火传承问题', 'family');
test('家庭-过继', '过继给孩子好不好', 'family');
test('家庭-领养', '领养孩子运势', 'family');
test('家庭-原生家庭', '原生家庭的影响', 'family');
test('家庭-房产', '房产继承问题', 'family');
test('家庭-继承', '继承问题怎么处理', 'family');

// ========== 社交 (social) ==========
console.log('【🤝 人际关系】');
test('社交-朋友', '朋友关系怎么样', 'social');
test('社交-社交', '社交运势如何', 'social');
test('社交-人际', '人际关系怎么处理', 'social');
test('社交-合作', '合作能成功吗', 'social');
test('社交-合伙', '合伙做生意怎么样', 'career');
test('社交-纠纷', '纠纷能解决吗', 'social');
test('社交-矛盾', '矛盾怎么化解', 'social');
test('社交-小人', '有小人作祟吗', 'social');
test('社交-贵人', '贵人什么时候出现', 'social');
test('社交-人脉', '人脉拓展方向', 'social');
test('社交-客户', '客户关系怎么维护', 'social');
test('社交-竞争', '竞争能赢吗', 'social');
test('社交-对手', '对手实力怎么样', 'social');
test('社交-和解', '和解的时机', 'social');
test('社交-背叛', '被背叛了怎么办', 'social');

// ========== 出行 (travel) ==========
console.log('【✈️ 出行迁移】');
test('出行-出行', '出行运怎么样', 'travel');
test('出行-旅游', '旅游去哪里好', 'travel');
test('出行-出国', '出国运势如何', 'travel');
test('出行-移民', '移民合适吗', 'travel');
test('出行-远行', '远行要注意什么', 'travel');
test('出行-搬家', '搬家时机对吗', 'travel');
test('出行-出差', '出差顺利吗', 'travel');
test('出行-旅行', '旅行运势', 'travel');
test('出行-签证', '签证能过吗', 'travel');
test('出行-留学', '留学方向怎么选', 'travel');
test('出行-航班', '航班安全吗', 'travel');
test('出行-旅途', '旅途顺利吗', 'travel');
test('出行-异地', '异地发展怎么样', 'travel');

// ========== 综合 (general) ==========
console.log('【🌟 综合运势】');
test('综合-运势', '运势怎么样', 'general');
test('综合-命运', '命运如何', 'general');
test('综合-运气', '运气好不好', 'general');
test('综合-前程', '前程如何', 'general');
test('综合-整体', '整体运势', 'general');
test('综合-综合', '综合来看', 'general');
test('综合-人生', '人生运势', 'general');
test('综合-未来', '未来怎么样', 'general');
test('综合-怎么样', '最近怎么样', 'general');
test('综合-如何', '如何发展', 'general');
test('综合-好不好', '今年好不好', 'general');
test('综合-顺利', '事情顺利吗', 'general');
test('综合-吉凶', '吉凶如何', 'general');
test('综合-好坏', '好坏怎么看', 'general');
test('综合-走向', '走向怎么样', 'general');
test('综合-趋势', '趋势如何', 'general');
test('综合-近况', '近况怎么样', 'general');
test('综合-前路', '前路如何', 'general');
test('综合-前景', '前景怎么样', 'general');
test('综合-天命', '天命如何', 'general');
test('综合-命数', '命数怎么样', 'general');
test('综合-造化', '造化如何', 'general');

// ========== 边界情况 ==========
console.log('【🔬 边界情况】');
test('边界-空字符串', '', null);
test('边界-纯空格', '   ', null);
test('边界-纯数字', '12345', 'general');
test('边界-纯英文', 'hello world', 'general');
test('边界-单字', '运', 'general');
test('边界-特殊字符', '!@#$%', 'general');
test('边界-无意义词', '今天天气真好', 'general');

// ========== 混合关键词（优先匹配） ==========
console.log('【🔀 混合关键词 - love 优先于 family】');
test('混合-离婚家庭', '离婚后家庭关系怎么处理', 'love');  // love 在 family 之前，离婚(2) > 家庭(2) 但 love 先匹配
test('混合-夫妻家庭', '夫妻关系好但家庭关系差', 'love');  // love 在 family 之前
test('混合-结婚家庭', '结婚后家庭责任怎么分配', 'love');  // love 在 family 之前

// ========== 短输入测试（单关键词） ==========
console.log('【📝 短输入测试】');
test('短输入-工作', '工作', 'career');
test('短输入-感情', '感情', 'love');
test('短输入-财运', '财运', 'wealth');
test('短输入-健康', '健康', 'health');
test('短输入-学业', '学业', 'study');
test('短输入-家庭', '家庭', 'family');
test('短输入-社交', '社交', 'social');
test('短输入-出行', '出行', 'travel');
test('短输入-运势', '运势', 'general');

// ========== 用户报告的Bug: input/h3 ==========
console.log('【🐛 Bug回归: input/h3 相关】');
test('Bug回归-纯input', 'input', 'general');
test('Bug回归-纯h3', 'h3', 'general');
test('Bug回归-input+h3', 'input和h3标签怎么用', 'general');
test('Bug回归-HTML标签', 'div和input标签的区别', 'general');
test('Bug回归-代码', '这段代码的input有问题', 'general');

// ========== 感情/家庭边界测试 ==========
console.log('【🔍 感情/家庭边界测试】');
test('边界-夫妻吵架', '夫妻吵架怎么解决', 'love');
test('边界-父母离婚', '父母离婚对我的影响', 'love');  // 离婚优先
test('边界-家庭矛盾', '家庭矛盾怎么化解', 'family');
test('边界-子女婚姻', '子女的婚姻问题', 'family');  // 子女优先
test('边界-婆媳矛盾', '婆媳矛盾怎么化解', 'family');
test('边界-夫妻关系', '夫妻关系怎么改善', 'love');
test('边界-老公出轨', '老公出轨了怎么办', 'love');
test('边界-老婆出轨', '老婆出轨了怎么办', 'love');
test('边界-配偶出轨', '配偶出轨了怎么办', 'love');
test('边界-孩子婚姻', '孩子的婚姻大事', 'family');
test('边界-原生家庭感情', '原生家庭对感情的影响', 'family');  // 原生家庭(4) > 感情(2)

// ========== 总结 ==========
console.log('\n' + '='.repeat(50));
const total = pass + fail;
console.log(`📊 测试总结: 总计 ${total} 项 | 通过 ${pass} | 失败 ${fail}`);
if (fail === 0) {
  console.log('🎉 全部通过!');
} else {
  console.log('⚠️ 存在失败项，需要修复');
}
console.log('='.repeat(50));

process.exit(fail > 0 ? 1 : 0);