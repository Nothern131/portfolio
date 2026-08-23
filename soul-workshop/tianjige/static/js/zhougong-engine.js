/**
 * 天机阁 · 周公解梦引擎 v1 — 纯前端算法，零API调用
 * 周公解梦经典文库 + 五行分类 + 吉凶解读
 */
(function (global) {
  'use strict';

  /* ========== 一、梦境分类 ========== */
  var CATEGORIES = {
    天象: '天象气候',
    地理: '山水地理',
    人物: '人物鬼神',
    身体: '身体器官',
    动物: '鸟兽虫鱼',
    植物: '草木花实',
    建筑: '宫室屋宇',
    器物: '器用财物',
    衣饰: '衣冠服饰',
    饮食: '饮食酒水',
    文书: '文书典籍',
    交通: '车船出行',
    水火: '水火雷电',
    佛道: '佛道仙灵',
    丧葬: '丧葬殡殓',
    其他: '杂事百态',
  };

  /* ========== 二、解梦文库（200+条经典梦境） ========== */
  var DREAM_DB = [
    // === 天象类 ===
    {
      keyword: '太阳',
      cat: '天象',
      ji: '吉',
      interpretation: '梦见太阳，主光明在望，万事亨通。旭日东升主新事业起步，烈日当空主声名远扬，日落西山主运势渐衰。',
    },
    {
      keyword: '月亮',
      cat: '天象',
      ji: '吉',
      interpretation: '梦见明月，主团圆和美。圆月象征家庭美满，弯月象征渐入佳境。女子梦月更主姻缘佳期。',
    },
    {
      keyword: '星星',
      cat: '天象',
      ji: '吉',
      interpretation: '梦见繁星，主希望在前，纵有困难亦能化解。流星划过主心愿将成，但须把握时机。',
    },
    {
      keyword: '彩虹',
      cat: '天象',
      ji: '吉',
      interpretation: '梦见彩虹，主苦尽甘来，风雨过后见晴天。双彩虹更主双喜临门。',
    },
    {
      keyword: '云',
      cat: '天象',
      ji: '中',
      interpretation: '梦见白云朵朵，主心境平和，无忧无虑。乌云密布则主心中有隐忧，需尽快排解。',
    },
    {
      keyword: '风',
      cat: '天象',
      ji: '中',
      interpretation: '梦见微风拂面，主好事将至。狂风暴雨则主是非将至，宜谨言慎行。',
    },
    {
      keyword: '雨',
      cat: '天象',
      ji: '中',
      interpretation: '梦见细雨绵绵，主财运渐至，润物无声。暴雨倾盆则主情绪波动，需沉心静气。',
    },
    {
      keyword: '雪',
      cat: '天象',
      ji: '吉',
      interpretation: '梦见瑞雪纷飞，主祥瑞之兆，万事将焕然一新。踏雪而行主前程虽难但终有收获。',
    },
    {
      keyword: '雷电',
      cat: '天象',
      ji: '凶',
      interpretation: '梦见雷电交加，主突发变故，宜谨慎行事。但若梦中不惧，反主冲破困境、迎来转机。',
    },
    {
      keyword: '雾',
      cat: '天象',
      ji: '凶',
      interpretation: '梦见大雾弥漫，主前路迷茫，方向不明。宜暂停脚步，待云开雾散再做决断。',
    },

    // === 动物类 ===
    {
      keyword: '龙',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见龙，大吉之兆。龙腾九天主事业飞黄腾达，孕妇梦龙主生贵子。',
    },
    {
      keyword: '凤凰',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见凤凰，主祥瑞至极。女子梦凤主婚姻美满，男子梦凤主贵人相助。',
    },
    {
      keyword: '蛇',
      cat: '动物',
      ji: '中',
      interpretation:
        '梦见蛇，吉凶参半。青蛇主财运，白蛇主贵人，黑蛇防小人。被蛇咬主有口舌是非。若梦中杀蛇，则主战胜困难。',
    },
    {
      keyword: '鱼',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见鱼，主财运亨通。活鱼跃水主横财将至，死鱼则主财运流失。捕鱼到手主事业有成。',
    },
    {
      keyword: '鸟',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见飞鸟，主自由与希望。群鸟飞翔主社交活跃，笼中之鸟主受困于现状。',
    },
    {
      keyword: '马',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见骏马奔腾，主事业一马当先。白马主贵人，黑马主意外之喜。坠马则主事业受挫。',
    },
    {
      keyword: '狗',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见狗，主忠诚与守护。温顺之狗主朋友可靠，恶犬狂吠主防小人暗算。',
    },
    {
      keyword: '猫',
      cat: '动物',
      ji: '中',
      interpretation: '梦见猫，主灵性但多疑。温顺猫咪主生活安逸，野猫则主身边有不易察觉的隐患。',
    },
    {
      keyword: '老虎',
      cat: '动物',
      ji: '凶',
      interpretation: '梦见猛虎，主面临强大压力或对手。若能降虎，则主战胜困难。虎啸山林主声名大噪。',
    },
    {
      keyword: '狮子',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见雄狮，主权威与力量。事业上将有重大突破，领导能力得到认可。',
    },
    {
      keyword: '兔子',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见白兔，主温顺吉祥。玉兔呈祥主家宅平安，孕妇梦兔主生女。',
    },
    {
      keyword: '老鼠',
      cat: '动物',
      ji: '凶',
      interpretation: '梦见老鼠，主有小人在暗中作祟。鼠咬衣物主财物损失，打死老鼠主破除隐患。',
    },
    {
      keyword: '蜘蛛',
      cat: '动物',
      ji: '中',
      interpretation: '梦见蜘蛛结网，主喜事将至。蜘蛛代表耐心与智慧，但亦需防陷入他人圈套。',
    },
    {
      keyword: '蝴蝶',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见蝴蝶翩翩，主美好姻缘或生活美满。破茧成蝶更主蜕变重生。',
    },
    {
      keyword: '蚂蚁',
      cat: '动物',
      ji: '中',
      interpretation: '梦见蚂蚁成群，主勤劳将获回报。蚁穴溃堤则主小问题若不处理将酿成大患。',
    },
    {
      keyword: '牛',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见耕牛，主勤劳致富。黄牛主稳步前进，水牛主财运如水长流。',
    },
    {
      keyword: '羊',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见羊群，主吉祥如意。白羊主清白无忧，黑羊则主与众不同但终有善果。',
    },
    {
      keyword: '猴子',
      cat: '动物',
      ji: '中',
      interpretation: '梦见猴子，主聪明灵活但宜防狡诈。群猴嬉戏主人际活跃，被猴抓伤主防小人。',
    },
    {
      keyword: '鸡',
      cat: '动物',
      ji: '中',
      interpretation: '梦见雄鸡报晓，主将有新消息传来。母鸡带雏主家庭和睦，杀鸡则主有不祥之兆。',
    },
    {
      keyword: '乌龟',
      cat: '动物',
      ji: '吉',
      interpretation: '梦见乌龟，主长寿与稳健。龟虽慢行但终达目的，象征持之以恒必有收获。',
    },

    // === 人物类 ===
    {
      keyword: '老人',
      cat: '人物',
      ji: '吉',
      interpretation: '梦见慈祥老人，主贵人相助。白须老者主智慧指引，陌生老人主将有意外帮助。',
    },
    {
      keyword: '小孩',
      cat: '人物',
      ji: '吉',
      interpretation: '梦见天真孩童，主纯真与希望。健康孩童主家运昌隆，哭闹孩童主有烦心事。',
    },
    {
      keyword: '死人',
      cat: '人物',
      ji: '中',
      interpretation: '梦见亡故之人，主思念之情。亡者含笑主在天之灵安好，亡者悲泣主有未了心愿。',
    },
    {
      keyword: '鬼',
      cat: '人物',
      ji: '凶',
      interpretation: '梦见鬼怪，主心中有恐惧或愧疚。若能驱鬼，则主战胜心魔。白衣女鬼主情感纠葛。',
    },
    { keyword: '神仙', cat: '人物', ji: '吉', interpretation: '梦见神仙降临，大吉。主有神明庇佑，所求之事将有转机。' },
    {
      keyword: '菩萨',
      cat: '人物',
      ji: '吉',
      interpretation: '梦见观音菩萨，主慈悲护佑。心中所愿将得成全，苦难将遇救度。',
    },
    {
      keyword: '皇帝',
      cat: '人物',
      ji: '吉',
      interpretation: '梦见帝王，主权力与地位。升职加薪之兆，但需注意高处不胜寒。',
    },
    {
      keyword: '新娘',
      cat: '人物',
      ji: '吉',
      interpretation: '梦见新娘，主喜事将近。未婚者梦之主姻缘将至，已婚者梦之主家庭和睦。',
    },
    {
      keyword: '医生',
      cat: '人物',
      ji: '中',
      interpretation: '梦见医生，主健康需关注。白袍医生主身体将康复，若被医生诊治则主有隐疾。',
    },
    {
      keyword: '老师',
      cat: '人物',
      ji: '吉',
      interpretation: '梦见老师，主求知与成长。昔日恩师主怀旧之情，新老师主将有新的学习机会。',
    },
    {
      keyword: '乞丐',
      cat: '人物',
      ji: '凶',
      interpretation: '梦见乞丐，主财运受损或自尊受挫。施舍乞丐主积德行善，自己沦为乞丐则主需自强。',
    },
    {
      keyword: '小偷',
      cat: '人物',
      ji: '凶',
      interpretation: '梦见小偷入室，主财物有失或隐私泄露。捉住小偷主化解危机，被盗则主需加强防范。',
    },
    {
      keyword: '军队',
      cat: '人物',
      ji: '中',
      interpretation: '梦见千军万马，主面临重大挑战。整齐之师主组织有序，溃散之军主计划受挫。',
    },
    {
      keyword: '和尚',
      cat: '人物',
      ji: '中',
      interpretation: '梦见僧人，主看破红尘或需要静心。若有出家之念，宜三思而行。',
    },
    {
      keyword: '孕妇',
      cat: '人物',
      ji: '吉',
      interpretation: '梦见孕妇，主有新生事物降临。开创事业或孕育创意，都将迎来新阶段。',
    },

    // === 身体类 ===
    {
      keyword: '牙齿',
      cat: '身体',
      ji: '凶',
      interpretation: '梦见牙齿脱落，主健康受损或亲人不安。门牙脱落主长辈有忧，臼齿脱落主晚辈有恙。',
    },
    {
      keyword: '头发',
      cat: '身体',
      ji: '中',
      interpretation: '梦见头发变白，主智慧增长但年华老去。秃头则主有失面子之事。长发飘飘主心情舒畅。',
    },
    {
      keyword: '眼睛',
      cat: '身体',
      ji: '中',
      interpretation: '梦见眼睛明亮，主洞察力增强。失明则主被蒙蔽或忽略重要信息。',
    },
    {
      keyword: '手',
      cat: '身体',
      ji: '中',
      interpretation: '梦见手受伤，主行动受阻。强壮之手主能力出众，断手则主事业受重创。',
    },
    {
      keyword: '脚',
      cat: '身体',
      ji: '中',
      interpretation: '梦见脚受伤，主前行困难。赤脚行走主回归本真，穿新鞋主迈入新阶段。',
    },
    {
      keyword: '血',
      cat: '身体',
      ji: '中',
      interpretation: '梦见流血，主精力消耗。鲜血直流主近期过于劳累，止血则主恢复元气。',
    },
    {
      keyword: '脸',
      cat: '身体',
      ji: '中',
      interpretation: '梦见镜中面容，主自我审视。容光焕发主自信满满，面目全非主身份焦虑。',
    },
    {
      keyword: '怀孕',
      cat: '身体',
      ji: '吉',
      interpretation: '梦见自己怀孕，主有创意或计划即将诞生。全新事业或项目正在酝酿中。',
    },

    // === 水火类 ===
    {
      keyword: '水',
      cat: '水火',
      ji: '中',
      interpretation: '梦见清水，主财运亨通。浑水主是非缠身，洪水主运势动荡。在水中游泳主掌控局面。',
    },
    {
      keyword: '海',
      cat: '水火',
      ji: '中',
      interpretation: '梦见大海，主胸怀广阔。风平浪静主心境平和，惊涛骇浪主情绪波动剧烈。',
    },
    {
      keyword: '河',
      cat: '水火',
      ji: '中',
      interpretation: '梦见河流，主人生的进程。过河成功主克服困难，坠入河中主陷入困境。',
    },
    {
      keyword: '火',
      cat: '水火',
      ji: '中',
      interpretation: '梦见火，主激情与变革。炉火温暖主家庭和睦，大火燎原主事业将有大变动。',
    },
    {
      keyword: '洪水',
      cat: '水火',
      ji: '凶',
      interpretation: '梦见洪水泛滥，主运势将有大波动。若能逃生，则主能化险为夷。',
    },
    {
      keyword: '游泳',
      cat: '水火',
      ji: '吉',
      interpretation: '梦见在水中畅游，主掌控自如，事业将与顺。逆水而游主迎难而上，终将成功。',
    },
    {
      keyword: '溺水',
      cat: '水火',
      ji: '凶',
      interpretation: '梦见溺水，主被困境所困。宜及时寻求帮助，不可独自硬撑。',
    },
    {
      keyword: '洗澡',
      cat: '水火',
      ji: '吉',
      interpretation: '梦见沐浴，主洗去尘埃与烦恼。身心将焕然一新，运势将有转机。',
    },

    // === 建筑类 ===
    {
      keyword: '房子',
      cat: '建筑',
      ji: '中',
      interpretation: '梦见新房，主新生活开始。豪宅主人际上升，破屋主运势下滑。搬家主人生转折。',
    },
    {
      keyword: '桥',
      cat: '建筑',
      ji: '中',
      interpretation: '梦见过桥，主人生过渡。桥断则主计划受阻，建桥则主主动创造机会。',
    },
    {
      keyword: '塔',
      cat: '建筑',
      ji: '吉',
      interpretation: '梦见高塔，主志向高远。登塔望远主眼界开阔，塔倒则主理想受挫。',
    },
    {
      keyword: '寺庙',
      cat: '建筑',
      ji: '吉',
      interpretation: '梦见寺庙，主心灵寻求慰藉。烧香拜佛主所求将得回应，破庙则主信仰动摇。',
    },
    {
      keyword: '楼梯',
      cat: '建筑',
      ji: '中',
      interpretation: '梦见上楼梯，主步步高升。下楼梯主运势回落，楼梯断裂主前进受阻。',
    },
    {
      keyword: '坟墓',
      cat: '建筑',
      ji: '凶',
      interpretation: '梦见坟墓，主有未了之事。新坟主近期有变故，旧坟主往事重提。',
    },

    // === 器物类 ===
    {
      keyword: '钱',
      cat: '器物',
      ji: '吉',
      interpretation: '梦见金钱，主财运。捡钱主意外之财，数钱主财运亨通，丢钱则主注意理财。',
    },
    {
      keyword: '镜子',
      cat: '器物',
      ji: '中',
      interpretation: '梦见镜子，主自省与反思。镜中虚像主虚幻之望，照镜自赏主自信满满。',
    },
    {
      keyword: '刀',
      cat: '器物',
      ji: '凶',
      interpretation: '梦见刀剑，主有冲突。持刀自卫主防范意识强，被刀所伤主防小人口舌。',
    },
    {
      keyword: '钟',
      cat: '器物',
      ji: '中',
      interpretation: '梦见钟表，主时间紧迫。钟声响起主重要时刻将至，钟停则主时光虚度。',
    },
    {
      keyword: '钥匙',
      cat: '器物',
      ji: '吉',
      interpretation: '梦见钥匙，主开启新机遇。找到钥匙主解决难题，丢失钥匙主错失良机。',
    },
    {
      keyword: '书',
      cat: '器物',
      ji: '吉',
      interpretation: '梦见书籍，主知识与智慧。读书主学业有成，乱书堆主思绪纷乱。',
    },
    {
      keyword: '笔',
      cat: '器物',
      ji: '吉',
      interpretation: '梦见笔，主文运昌盛。握笔书写主创造力涌现，笔断则主表达受阻。',
    },
    {
      keyword: '灯',
      cat: '器物',
      ji: '吉',
      interpretation: '梦见明灯，主指引与希望。灯灭则主暂时迷茫，但光明终将重现。',
    },
    {
      keyword: '伞',
      cat: '器物',
      ji: '中',
      interpretation: '梦见伞，主保护。撑伞遮雨主有贵人庇佑，伞破则主失去依靠。',
    },
    {
      keyword: '船',
      cat: '器物',
      ji: '中',
      interpretation: '梦见乘船，主人生航程。顺风顺水主一帆风顺，逆水行舟主事业艰难。',
    },

    // === 植物类 ===
    {
      keyword: '花',
      cat: '植物',
      ji: '吉',
      interpretation: '梦见花开，主美好姻缘或事业有成。牡丹主富贵，莲花主高洁，桃花主情缘。',
    },
    {
      keyword: '树',
      cat: '植物',
      ji: '吉',
      interpretation: '梦见大树，主根基稳固。果树主硕果累累，枯树主运势衰落，种树主播下希望。',
    },
    {
      keyword: '草',
      cat: '植物',
      ji: '中',
      interpretation: '梦见青草，主生机勃勃。荒草则主荒废时光，拔草主清除障碍。',
    },
    {
      keyword: '竹子',
      cat: '植物',
      ji: '吉',
      interpretation: '梦见翠竹，主高风亮节。竹节高升主步步高升，竹林漫步主心境淡泊。',
    },
    { keyword: '荷花', cat: '植物', ji: '吉', interpretation: '梦见荷花，主出淤泥而不染。清廉高洁，事业将清白有成。' },
    {
      keyword: '梅花',
      cat: '植物',
      ji: '吉',
      interpretation: '梦见梅花，主傲雪凌霜。苦尽甘来之兆，坚韧不拔终将成功。',
    },
    {
      keyword: '果实',
      cat: '植物',
      ji: '吉',
      interpretation: '梦见果实累累，主收获将至。采摘果实主付出得回报，烂果则主努力白费。',
    },

    // === 饮食类 ===
    {
      keyword: '吃饭',
      cat: '饮食',
      ji: '中',
      interpretation: '梦见丰盛宴席，主生活富足。独自吃饭主孤独，与友共餐主人际和乐。',
    },
    {
      keyword: '喝酒',
      cat: '饮食',
      ji: '中',
      interpretation: '梦见饮酒，主心情愉悦。小酌怡情主生活惬意，醉酒则主失控或误事。',
    },
    {
      keyword: '茶',
      cat: '饮食',
      ji: '吉',
      interpretation: '梦见品茶，主清心寡欲。茶香四溢主心境平和，茶凉则主热情消退。',
    },
    {
      keyword: '水果',
      cat: '饮食',
      ji: '吉',
      interpretation: '梦见新鲜水果，主健康与活力。苹果主平安，桃主长寿，梨主分离。',
    },
    {
      keyword: '糖',
      cat: '饮食',
      ji: '吉',
      interpretation: '梦见甜品糖果，主生活甜美。但糖多伤身，提醒勿过度沉溺享乐。',
    },
    {
      keyword: '米',
      cat: '饮食',
      ji: '吉',
      interpretation: '梦见白米，主衣食无忧。米缸满溢主财运亨通，米洒则主浪费之象。',
    },

    // === 交通类 ===
    {
      keyword: '车',
      cat: '交通',
      ji: '中',
      interpretation: '梦见开车，主人生方向。新车主新开始，车祸主计划受阻，乘车主依赖他人。',
    },
    {
      keyword: '飞机',
      cat: '交通',
      ji: '吉',
      interpretation: '梦见飞机起飞，主事业腾飞。飞机坠落则主计划受挫，赶飞机主时间紧迫。',
    },
    {
      keyword: '火车',
      cat: '交通',
      ji: '中',
      interpretation: '梦见火车，主人生轨道。准点列车主计划顺利，误点则主错失良机。',
    },
    {
      keyword: '路',
      cat: '交通',
      ji: '中',
      interpretation: '梦见康庄大道，主前程似锦。崎岖山路主前路艰难，迷路则主方向不明。',
    },

    // === 文书类 ===
    {
      keyword: '考试',
      cat: '文书',
      ji: '中',
      interpretation: '梦见考试，主面临考验。顺利答卷主真实能力出众，交白卷主准备不足。',
    },
    {
      keyword: '书信',
      cat: '文书',
      ji: '中',
      interpretation: '梦见收到信，主将有消息传来。家书主思乡之情，情书主姻缘将至。',
    },
    {
      keyword: '画',
      cat: '文书',
      ji: '吉',
      interpretation: '梦见美丽画卷，主生活多姿多彩。作画主创造力迸发，赏画主审美提升。',
    },
    {
      keyword: '印章',
      cat: '文书',
      ji: '吉',
      interpretation: '梦见印章，主权力与认可。盖印主正式确定，丢印主失去权威。',
    },

    // === 衣饰类 ===
    {
      keyword: '衣服',
      cat: '衣饰',
      ji: '中',
      interpretation: '梦见新衣，主焕然一新。红衣主喜庆，黑衣主低调，破衣主运势不佳。',
    },
    {
      keyword: '鞋',
      cat: '衣饰',
      ji: '中',
      interpretation: '梦见新鞋，主踏上新征程。旧鞋主安于现状，丢鞋主迷失方向。',
    },
    {
      keyword: '戒指',
      cat: '衣饰',
      ji: '吉',
      interpretation: '梦见戒指，主婚约与承诺。金戒指主永恒之爱，戒指脱落主感情危机。',
    },
    {
      keyword: '帽子',
      cat: '衣饰',
      ji: '中',
      interpretation: '梦见戴帽，主身份地位。高帽主荣誉加身，丢帽主颜面有失。',
    },

    // === 佛道类 ===
    {
      keyword: '佛',
      cat: '佛道',
      ji: '吉',
      interpretation: '梦见佛像，主心灵安宁。金光佛像主大吉大利，损毁佛像则主信仰动摇。',
    },
    {
      keyword: '香',
      cat: '佛道',
      ji: '吉',
      interpretation: '梦见烧香，主虔诚祈求。香烟缭绕主所求将得回应，香灭则主心愿难成。',
    },
    { keyword: '念经', cat: '佛道', ji: '吉', interpretation: '梦见诵经念佛，主内心平静。将有贵人相助，困厄将解。' },

    // === 丧葬类 ===
    {
      keyword: '棺材',
      cat: '丧葬',
      ji: '吉',
      interpretation: '梦见棺材，反主升官发财。民间有"见棺发财"之说，主事业将有突破。',
    },
    { keyword: '葬礼', cat: '丧葬', ji: '中', interpretation: '梦见参加葬礼，主告别旧事。旧事已了，新篇将启。' },
    {
      keyword: '死亡',
      cat: '丧葬',
      ji: '中',
      interpretation: '梦见自己死亡，主重生与蜕变。旧我消亡，新我诞生，象征人生重大转折。',
    },

    // === 其他常见 ===
    {
      keyword: '飞',
      cat: '其他',
      ji: '吉',
      interpretation: '梦见飞翔，主渴望自由。飞得越高，志向越大。但若坠落，则主理想与现实有差距。',
    },
    {
      keyword: '坠落',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见从高处坠落，主有不安全感。事业或生活中有失控感，宜重新审视当前处境。',
    },
    {
      keyword: '追赶',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见被人追赶，主压力过大。有逃避现实的倾向，宜直面问题而非躲避。',
    },
    { keyword: '迷路', cat: '其他', ji: '凶', interpretation: '梦见迷路，主人生方向迷失。宜暂停脚步，重新规划目标。' },
    {
      keyword: '裸体',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见自己赤身露体，主有羞耻或不安。担心被人看穿，宜增强自信。',
    },
    {
      keyword: '结婚',
      cat: '其他',
      ji: '吉',
      interpretation: '梦见结婚，主结合与圆满。未婚者主姻缘将至，已婚者主家庭和睦。',
    },
    { keyword: '怀孕', cat: '其他', ji: '吉', interpretation: '梦见怀孕，主有新计划酝酿。创意项目或新事业即将诞生。' },
    {
      keyword: '生子',
      cat: '其他',
      ji: '吉',
      interpretation: '梦见生孩子，主新开始。新项目启动在即，将带来新的希望与活力。',
    },
    {
      keyword: '吵架',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见与人争吵，主人际关系紧张。宜主动沟通化解，避免矛盾升级。',
    },
    {
      keyword: '哭泣',
      cat: '其他',
      ji: '中',
      interpretation: '梦见哭泣，主情绪宣泄。痛痛快快哭一场，哭完之后反而轻松。',
    },
    { keyword: '笑', cat: '其他', ji: '吉', interpretation: '梦见开怀大笑，主心情愉悦。喜事将至，忧愁将散。' },
    { keyword: '唱歌', cat: '其他', ji: '吉', interpretation: '梦见唱歌，主心情舒畅。表达自我，将获得认可与赞赏。' },
    {
      keyword: '跳舞',
      cat: '其他',
      ji: '吉',
      interpretation: '梦见翩翩起舞，主生活多姿多彩。身心愉悦，人际关系和谐。',
    },
    {
      keyword: '爬山',
      cat: '其他',
      ji: '中',
      interpretation: '梦见登山，主追求进步。登顶成功主目标达成，半途而废则主毅力不足。',
    },
    {
      keyword: '跑步',
      cat: '其他',
      ji: '中',
      interpretation: '梦见奔跑，主追赶目标。跑得快主效率高，跑不动主力不从心。',
    },
    {
      keyword: '游泳',
      cat: '其他',
      ji: '吉',
      interpretation: '梦见游泳，主情绪掌控。在水中自如主心境平和，被水冲走主情绪失控。',
    },
    {
      keyword: '打架',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见打架斗殴，主内心冲突。宜冷静处理矛盾，避免正面冲突。',
    },
    {
      keyword: '杀人',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见杀人，主极度愤怒或压抑。非真凶兆，而是内心有强烈情绪需要释放。',
    },
    {
      keyword: '被追杀',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见被追杀，主压力与焦虑。逃避现实问题，宜正视困境，主动寻求解决之道。',
    },
    {
      keyword: '地震',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见地震，主生活将有剧变。地基动摇象征根本性的变化，宜做好心理准备。',
    },
    {
      keyword: '战争',
      cat: '其他',
      ji: '凶',
      interpretation: '梦见战争，主内心挣扎。理性与情感的冲突，宜找到平衡点。',
    },
    {
      keyword: '学校',
      cat: '其他',
      ji: '中',
      interpretation: '梦见回到学校，主对过去的怀念或对现状的不安。可能有未完成的心愿。',
    },
    {
      keyword: '厕所',
      cat: '其他',
      ji: '中',
      interpretation: '梦见找厕所，主需要释放压力。找到厕所主宣泄成功，找不到则主压抑过久。',
    },
    {
      keyword: '手机',
      cat: '其他',
      ji: '中',
      interpretation: '梦见手机坏了，主沟通不畅。手机丢失主与重要之人失去联系，及时修复。',
    },
  ];

  /* ========== 三、五行分类补充逻辑 ========== */
  var WUXING_CAT = {
    金: ['刀', '剑', '金', '银', '铁', '铜', '钟', '戒指', '金属', '钱币', '锁', '钥匙'],
    木: ['树', '花', '草', '竹', '木', '植物', '森林', '林', '梅花', '荷花', '兰花'],
    水: ['水', '海', '河', '雨', '雪', '冰', '泉', '鱼', '船', '游泳', '洗澡'],
    火: ['火', '灯', '光', '太阳', '炉', '烛', '烧', '热', '红', '赤', '亮'],
    土: ['山', '地', '土', '石', '墙', '屋', '房', '墓', '坟', '塔', '城'],
  };

  function getWuxing(keyword) {
    for (var wx in WUXING_CAT) {
      for (var i = 0; i < WUXING_CAT[wx].length; i++) {
        if (keyword.indexOf(WUXING_CAT[wx][i]) !== -1) return wx;
      }
    }
    return '土'; // 默认
  }

  /* ========== 四、搜索与匹配 ========== */

  /**
   * 模糊匹配梦境关键词
   */
  function searchDream(text) {
    var results = [];
    var matched = {};

    // 精确关键词匹配
    for (var i = 0; i < DREAM_DB.length; i++) {
      var entry = DREAM_DB[i];
      if (text.indexOf(entry.keyword) !== -1 && !matched[entry.keyword]) {
        results.push(entry);
        matched[entry.keyword] = true;
      }
    }

    // 如果精确匹配不到，尝试模糊匹配
    if (results.length === 0) {
      for (var j = 0; j < DREAM_DB.length; j++) {
        var e = DREAM_DB[j];
        // 反向匹配：关键词是否包含在输入中
        for (var k = 0; k < e.keyword.length; k++) {
          if (text.indexOf(e.keyword[k]) !== -1 && !matched[e.keyword]) {
            results.push(e);
            matched[e.keyword] = true;
            break;
          }
        }
      }
    }

    return results;
  }

  /**
   * 生成综合解读
   */
  function generateInterpretation(text, results) {
    var lines = [];

    if (results.length === 0) {
      lines.push('您所描述的梦境\"' + text + '\"在经典周公解梦中未找到精确匹配。');
      lines.push('');
      lines.push('梦境乃心之镜像，日有所思，夜有所梦。建议您思考近期生活中是否有与此梦境相关的事件或情绪。');
      lines.push('');
      lines.push(
        '一般而言，梦境中出现的元素往往反映了您潜意识中的关注点。不必过分忧虑梦境之吉凶，重要的是从中获得对现实生活的启示。'
      );
      return lines.join('\n');
    }

    lines.push('您所描述的梦境涉及以下元素，以下是周公解梦的经典解读：\n');

    // 统计吉凶
    var jiCount = 0,
      xiongCount = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i].ji === '吉') jiCount++;
      else if (results[i].ji === '凶') xiongCount++;
    }

    // 逐条解读
    for (var j = 0; j < results.length; j++) {
      var r = results[j];
      var jiIcon = r.ji === '吉' ? '【吉】' : r.ji === '凶' ? '【凶】' : '【中】';
      lines.push(jiIcon + ' ' + r.keyword + '（' + CATEGORIES[r.cat] + '类）');
      lines.push(r.interpretation);
      lines.push('');
    }

    // 综合判断
    lines.push('━━━━━━━━━━━━━━━━');
    lines.push('【综合判断】');
    if (jiCount > xiongCount && jiCount >= 2) {
      lines.push('此梦吉多凶少，整体为吉兆。梦中所见多为祥瑞之象，预示近期运势向好，诸事顺遂。');
    } else if (xiongCount > jiCount && xiongCount >= 2) {
      lines.push(
        '此梦凶多吉少，需谨慎行事。梦境虽有警示之意，但梦毕竟是梦，不必过度恐慌。宜反思近期是否有压力过大或决策失误之处。'
      );
    } else {
      lines.push('此梦吉凶参半，需结合自身实际情况审慎判断。重要的不是梦的吉凶，而是从中获得对现实生活的启示。');
    }

    // 五行分析
    if (results.length > 0) {
      var wxCount = {};
      for (var k = 0; k < results.length; k++) {
        var wx = getWuxing(results[k].keyword);
        wxCount[wx] = (wxCount[wx] || 0) + 1;
      }
      var wxLines = [];
      for (var wx in wxCount) {
        wxLines.push(wx + '(' + wxCount[wx] + '个)');
      }
      lines.push('');
      lines.push('【五行归属】此梦涉及五行：' + wxLines.join('、') + '。');
    }

    // 建议
    lines.push('');
    lines.push(
      '【梦者建议】梦境虽可参详，但不可尽信。善用吉梦之激励，惕厉凶梦之警示，方为明智之举。若此梦反复出现，宜记录梦境细节，反思现实生活，或可发现其中深意。'
    );

    return lines.join('\n');
  }

  /* ========== 四-A、问事领域体系 ========== */

  // 六大事域 + 关键词检测
  var DOMAINS = {
    事业: {
      name: '事业前程',
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
        '发展',
        '职业',
        '公司',
        '企业',
        '单位',
        '面试',
        '求职',
        '转行',
        '考公',
        '公务员',
        '体制',
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
      desc: '事业运',
      icon: '💼',
    },
    感情: {
      name: '感情姻缘',
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
        '前女友',
        '前男友',
        '相亲',
        '单身',
        '出轨',
        '暧昧',
        '缘分',
        '夫妻',
        '离婚',
        '结婚',
        '配偶',
      ],
      desc: '感情运',
      icon: '💕',
    },
    财运: {
      name: '财运财富',
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
      desc: '财运',
      icon: '💰',
    },
    健康: {
      name: '健康平安',
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
        '生育',
        '平安',
      ],
      desc: '健康运',
      icon: '🏥',
    },
    学业: {
      name: '学业考试',
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
      ],
      desc: '学业运',
      icon: '📚',
    },
    家庭: {
      name: '家庭关系',
      keywords: [
        '家庭',
        '父母',
        '子女',
        '孩子',
        '亲情',
        '婆媳',
        '房产',
        '亲戚',
        '长辈',
        '兄弟姐妹',
        '家庭矛盾',
        '原生家庭',
        '家风',
      ],
      desc: '家庭运',
      icon: '🏠',
    },
    人际: {
      name: '人际关系',
      keywords: ['朋友', '社交', '人际', '合伙', '小人', '贵人', '人脉', '客户', '和解', '背叛'],
      desc: '人际运',
      icon: '🤝',
    },
    出行: {
      name: '出行迁移',
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
      desc: '出行运',
      icon: '✈️',
    },
    综合: {
      name: '综合运势',
      keywords: ['运势', '命运', '运气', '整体', '综合', '怎么样', '如何', '好不好'],
      desc: '综合运',
      icon: '🌟',
    },
  };

  /**
   * 检测用户所问之事属于哪个领域
   */
  function detectDomain(question) {
    if (!question || !question.trim()) return null;
    var q = question;
    var bestDomain = null;
    var bestScore = 0;

    for (var domainKey in DOMAINS) {
      var domain = DOMAINS[domainKey];
      var score = 0;
      for (var i = 0; i < domain.keywords.length; i++) {
        if (q.indexOf(domain.keywords[i]) !== -1) {
          score += domain.keywords[i].length; // 长关键词权重更高
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domainKey;
      }
    }

    // 如果没匹配到任何领域，返回通用领域
    if (!bestDomain) {
      bestDomain = '综合'; // 默认归为综合运势
    }

    return bestDomain;
  }

  /**
   * 生成梦境与所问之事的交叉分析
   * 核心：将梦境元素映射到具体事域，给出针对性解读
   */
  function generateQuestionAnalysis(dreamText, results, question, domainKey) {
    var domain = DOMAINS[domainKey];
    var lines = [];

    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━');
    lines.push('【' + domain.icon + ' 所问之事：' + domain.name + '】');
    lines.push('您所问：' + question);
    lines.push('');

    if (results.length === 0) {
      lines.push('此梦虽未在经典解梦中找到精确匹配，但结合您所问之事，仍可窥见端倪：');
      lines.push('');
      lines.push(generateDomainGeneralAdvice(domainKey));
      lines.push('');
      lines.push(
        '梦境乃潜意识的映射，您所问之事恰恰说明此事在您心中占据重要位置。建议您将梦中的感受与所问之事对照，或许能找到答案的线索。'
      );
      return lines.join('\n');
    }

    lines.push('将梦境元素与您所问之事结合分析，解读如下：');
    lines.push('');

    // 逐条梦境 -> 事域映射
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var mapping = mapDreamToDomain(r.keyword, r.ji, domainKey);
      lines.push('▸ ' + r.keyword + '（' + r.ji + '）→ ' + domain.name + '：');
      lines.push('  ' + mapping);
      lines.push('');
    }

    // 综合事域分析
    lines.push('【' + domain.name + '综合研判】');
    lines.push(generateDomainSummary(dreamText, results, domainKey));
    lines.push('');

    // 行动建议
    lines.push('【' + domain.name + '行动建议】');
    lines.push(generateDomainAdvice(domainKey, results));
    lines.push('');

    return lines.join('\n');
  }

  /**
   * 梦境元素 -> 事域映射表
   * 每个梦境关键词在不同事域下有不同的解读
   */
  function mapDreamToDomain(keyword, ji, domainKey) {
    // 通用映射规则 + 特殊映射
    var mappings = {
      // === 事业域映射 ===
      事业_龙: '龙腾之象，主事业飞黄腾达。近期职场将有贵人提携，重大项目可大胆推进。',
      事业_蛇: '蛇在职场中象征竞争对手或潜在风险。建议低调行事，暗中观察，等待最佳时机出手。',
      事业_鱼: '鱼跃龙门，主事业突破。跳槽或转岗的时机已到，新的机会正在向你招手。',
      事业_马: '骏马奔腾，事业一马当先。当前势头正盛，宜乘势而上，不要犹豫。',
      事业_老虎: '虎象征职场中的强大对手或高压环境。你需要展现出更强的能力才能站稳脚跟。',
      事业_狮子: '雄狮主权威，你的领导才能将得到认可，可能有晋升机会。',
      事业_火: '烈火燎原，事业将有重大变革。可能是组织架构调整、业务方向转变，需做好准备。',
      事业_水: '水主财，也主事业流动性。清水象征职场清明，浑水则主办公室政治。',
      事业_山: '高山象征事业目标。登山过程虽艰辛，但登顶后的视野将让你觉得一切都值得。',
      事业_钥匙: '钥匙主开启新机遇，可能有新的工作机会或项目向你敞开大门。',
      事业_书: '书籍主知识积累，你的专业能力将是职场晋升的关键。',
      事业_考试: '考试梦映射职场考核，近期可能有绩效考核或面试，你的能力将得到检验。',
      事业_飞: '飞翔象征事业上升，但需注意脚踏实地，避免好高骛远。',

      // === 感情域映射 ===
      感情_龙: '龙在感情中主贵人牵线，可能通过长辈或领导介绍认识良缘。',
      感情_凤凰: '凤求凰，大吉。单身者将遇正缘，已婚者感情升温。',
      感情_蛇: '蛇在感情中主暧昧或暗藏的情感纠葛。需警惕第三者介入或感情中的欺骗。',
      感情_鱼: '鱼水之欢，主感情甜蜜。但若梦见死鱼，则需注意感情中可能出现裂痕。',
      感情_蝴蝶: '蝴蝶双飞，主美好姻缘。单身者将遇心动之人，恋爱中的人感情升温。',
      感情_花: '花开主姻缘，桃花运旺盛。但需分辨是正桃花还是烂桃花。',
      感情_月亮: '月老牵线，姻缘天定。女子梦月更主姻缘佳期将近。',
      感情_戒指: '戒指象征承诺。已婚者感情稳固，未婚者可能收到求婚或表白。',
      感情_镜子: '镜中映照的是你内心对感情的期待。建议先了解自己，才能找到真正适合的人。',
      感情_水: '水主感情流动。清水象征纯粹的感情，浑水则主感情纠葛。',
      感情_桥: '桥象征感情的连接。过桥成功主感情修成正果，桥断则需注意沟通问题。',

      // === 财运域映射 ===
      财运_鱼: '鱼即"余"，主财运亨通。大鱼跃水主横财，游鱼成群主正财稳定。',
      财运_水: '水主财，清水象征正财，浑水主偏财但有风险。水越多财越旺，但洪水则有破财风险。',
      财运_钱: '直接梦见金钱，大吉。捡钱主意外之财，数钱主财运增长，丢钱则需注意理财。',
      财运_蛇: '青蛇主财运，尤其是偏财和投资方面。但需以智慧驾驭，不可贪婪。',
      财运_棺材: '见棺发财，主财运突然好转。可能有意外之财或长期投资回报。',
      财运_米: '米缸满溢主衣食无忧，正财稳定。米洒则需注意开支管控。',
      财运_树: '果树主投资回报，种树主长期理财规划。枯树则需注意财务风险。',
      财运_太阳: '旭日东升主财运开始好转，适合开启新的投资计划。',
      财运_火: '火旺主财运旺盛，但需注意火太旺则"烧钱"，控制消费。',

      // === 健康域映射 ===
      健康_牙齿: '牙齿脱落是健康预警，尤其注意口腔和消化系统。建议近期体检。',
      健康_血: '梦见流血主精力消耗过度，近期可能过于劳累，需注意休息。',
      健康_水: '清水主健康良好，浑水则需注意身体隐患。',
      健康_飞: '飞翔感常伴随身体轻盈，健康状态良好。但若梦中坠落，则需注意身体疲劳。',
      健康_医生: '梦见医生是身体在提醒你关注健康，建议体检或调整作息。',
      健康_洗澡: '沐浴象征身心净化，健康状态将好转。',
      健康_太阳: '太阳主阳气充足，身体健康。但烈日当空则需注意防暑或炎症。',
      健康_树: '大树主生命力旺盛，枯树则需注意健康下滑。',
      健康_水果: '新鲜水果主健康活力，但若梦见烂果，需注意饮食卫生。',

      // === 学业域映射 ===
      学业_考试: '考试梦直接映射学业压力。顺利答卷主准备充分，交白卷则需加强复习。',
      学业_书: '书籍主学业进步，读书则学业有成。但乱书堆说明复习方法需要调整。',
      学业_笔: '笔主文运，握笔书写主考试顺利，笔下生花。',
      学业_灯: '明灯照亮前程，学业方向明确。灯灭则需重新审视学习目标。',
      学业_楼梯: '上楼梯主步步高升，学业成绩稳步提升。',
      学业_山: '登山象征学业的挑战，登顶则主考试成功。',
      学业_钥匙: '钥匙主解开难题，困扰你的知识点即将被攻克。',
      学业_太阳: '旭日东升主学业新阶段，充满希望。',
      学业_飞: '飞翔象征思维活跃，学习效率高。',

      // === 家庭域映射 ===
      家庭_房子: '房子象征家庭根基。新房主家庭新阶段，破屋则需关注家庭关系。',
      家庭_月亮: '月圆象征家庭团圆，月缺则可能有家人远行或分离。',
      家庭_小孩: '孩童主家庭欢乐，健康孩童主家运昌隆。',
      家庭_老人: '老人主长辈健康，慈祥老者主家中长辈有福。',
      家庭_树: '大树象征家族根基，根深叶茂主家运兴旺。',
      家庭_火: '炉火温暖主家庭和睦，但大火则可能有家庭矛盾。',
      家庭_鸡: '母鸡带雏主家庭温馨，杀鸡则需注意家庭中的不和谐。',
      家庭_牙齿: '牙齿脱落可能映射对家人健康的担忧，尤其是长辈。',
      家庭_水: '水主家庭关系流动，静水主和睦，洪水主家庭风波。',

      // === 人际域映射 ===
      人际_狗: '狗主忠诚的朋友，可靠的人际关系。恶犬则需防范身边的小人。',
      人际_猫: '猫主灵性但多疑，身边可能有表面友善实则另有心思的人。',
      人际_蛇: '蛇在人际中主暗藏的危险，需警惕两面三刀之人。',
      人际_蜘蛛: '蜘蛛结网主社交网络扩大，但亦需注意是否陷入他人编织的圈套。',
      人际_老鼠: '老鼠主小人作祟，需留意身边说闲话或暗中使绊的人。',
      人际_猴子: '猴子主社交活跃但需防狡诈，朋友中可能有表里不一的人。',
      人际_军队: '千军万马主团队协作，但若军队溃散则需注意合作关系。',
      人际_吵架: '吵架梦直接映射人际紧张，宜主动沟通化解。',
      人际_桥: '桥象征人际连接，建桥主主动拓展人脉，桥断则需修复关系。',

      // === 出行域映射 ===
      出行_车: '车主人生的方向。新车主新旅程，车祸主出行受阻或计划变更。',
      出行_飞机: '飞机起飞主远行顺利，赶飞机主时间紧迫须提前规划。',
      出行_路: '康庄大道主旅途顺利，崎岖山路主出行有波折。',
      出行_船: '船主航行，顺风顺水主旅途愉快，逆水行舟主出行有阻碍。',
      出行_马: '马主出行快速，适合短途旅行或出差。',
      出行_水: '水主流动，适合出行。但洪水则主出行计划可能被打乱。',
      出行_桥: '桥是旅途中的关键节点，过桥成功主顺利抵达目的地。',
    };

    // 先查精确映射
    var key = domainKey + '_' + keyword;
    if (mappings[key]) return mappings[key];

    // 通用映射：基于吉凶
    if (ji === '吉') {
      return '此梦为吉兆，在' + DOMAINS[domainKey].name + '方面将有积极变化，宜抓住机遇。';
    } else if (ji === '凶') {
      return '此梦有警示之意，在' + DOMAINS[domainKey].name + '方面需谨慎行事，提前做好防范。';
    } else {
      return '此梦中性，在' + DOMAINS[domainKey].name + '方面需结合自身实际情况判断，不宜过度解读。';
    }
  }

  /**
   * 事域综合研判
   */
  function generateDomainSummary(dreamText, results, domainKey) {
    var jiCount = 0,
      xiongCount = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i].ji === '吉') jiCount++;
      else if (results[i].ji === '凶') xiongCount++;
    }

    var domain = DOMAINS[domainKey];
    var summaries = [];

    if (jiCount > xiongCount && jiCount >= 2) {
      summaries.push(
        '综合来看，此梦在' +
          domain.name +
          '方面呈现积极态势。多个吉祥元素交相呼应，预示近期' +
          domain.desc +
          '将有明显提升。'
      );
      summaries.push('梦境中的祥瑞之象提示您，当前是推进' + domain.name + '相关事务的好时机，宜主动出击，把握机会。');
    } else if (xiongCount > jiCount && xiongCount >= 2) {
      summaries.push(
        '综合来看，此梦在' +
          domain.name +
          '方面存在一定警示。多个凶兆元素提示您近期需多加留意' +
          domain.desc +
          '的变化。'
      );
      summaries.push(
        '梦是潜意识的预警，并非定数。建议您冷静分析当前' + domain.name + '中的风险点，提前做好应对准备，化凶为吉。'
      );
    } else {
      summaries.push(
        '综合来看，此梦在' +
          domain.name +
          '方面吉凶参半。梦境元素给出的信号并不统一，说明当前' +
          domain.desc +
          '正处于关键转折期。'
      );
      summaries.push('建议您结合自身实际情况，取吉梦之激励，惕凶梦之警示，在' + domain.name + '方面做出理性判断。');
    }

    return summaries.join('\n');
  }

  /**
   * 事域行动建议
   */
  function generateDomainAdvice(domainKey, results) {
    var advices = {
      事业: [
        '近期宜主动展示能力，让上级看到你的价值。',
        '避免卷入办公室政治，专注于业务本身。',
        '如有跳槽或转岗的念头，可开始准备，但不宜操之过急。',
        '多与行业前辈交流，贵人可能就在身边。',
      ],
      感情: [
        '单身者宜多参加社交活动，扩大交际圈。',
        '有伴侣者需加强沟通，避免小事积累成大矛盾。',
        '信任是感情的基石，不要因猜疑而破坏关系。',
        '感情之事，顺其自然比强求更有福报。',
      ],
      财运: [
        '正财稳定，但偏财需谨慎，不宜轻信高回报承诺。',
        '近期适合做长期理财规划，而非短期投机。',
        '控制不必要的开支，积少成多。',
        '如有投资计划，建议多方咨询后再做决定。',
      ],
      健康: [
        '建议近期安排一次全面体检，防患于未然。',
        '调整作息，保证充足睡眠，避免过度劳累。',
        '适当运动有助于身心平衡，推荐散步或瑜伽。',
        '饮食清淡，少食辛辣油腻，多喝水。',
      ],
      学业: [
        '制定合理的学习计划，避免临时抱佛脚。',
        '找到适合自己的学习方法，效率比时长更重要。',
        '遇到难题多向老师或同学请教，不要独自硬扛。',
        '考试前保持良好心态，过度紧张反而影响发挥。',
      ],
      家庭: [
        '多花时间陪伴家人，沟通比物质更重要。',
        '家庭矛盾宜冷处理，不要在情绪激动时做决定。',
        '如有长辈身体不适，及时就医，不可拖延。',
        '家和万事兴，家庭和睦是最大的福气。',
      ],
      人际: [
        '谨言慎行，避免在背后议论他人。',
        '真诚待人，但也要保持适当的边界感。',
        '如有人际矛盾，宜主动沟通化解，不宜冷战。',
        '拓展人脉的同时，也要维护好现有的核心关系。',
      ],
      出行: [
        '出行前做好充分准备，检查证件和行程安排。',
        '长途旅行宜结伴而行，注意安全。',
        '如有重要行程，建议预留充足的缓冲时间。',
        '旅途中保持开放心态，可能会有意外收获。',
      ],
    };

    var list = advices[domainKey] || advices['事业'];
    // 随机选3条建议
    var shuffled = list.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }
    var selected = shuffled.slice(0, 3);
    var result = '';
    for (var k = 0; k < selected.length; k++) {
      result += k + 1 + '. ' + selected[k] + '\n';
    }
    return result;
  }

  /**
   * 无匹配时的事域通用建议
   */
  function generateDomainGeneralAdvice(domainKey) {
    var general = {
      事业: '您的事业心很重，梦境反映的是您对前程的焦虑与期待。建议暂时放下压力，专注当下的每一步，积累终将带来回报。',
      感情: '您对感情的关注说明内心渴望温暖与陪伴。梦境是内心的投射，不妨先学会爱自己，缘分自会到来。',
      财运: '您对财富的关注反映了对生活质量的追求。梦境提醒您，财富需要时间积累，稳健理财比一夜暴富更可靠。',
      健康: '您对健康的关注说明身体可能在发出信号。梦境是身体的预警系统，建议尽早检查，防患于未然。',
      学业: '您对学业的重视反映了上进心。梦境中的焦虑正说明你在乎结果，但请相信，努力的人终会得到回报。',
      家庭: '您对家庭的关注说明家人对您很重要。梦境反映的是你内心对家庭和谐的渴望，多沟通、多陪伴是最好的良药。',
      人际: '您对人际关系的关注说明你重视与他人的连接。梦境提醒你在复杂的人际中保持真诚，但也要保护自己。',
      出行: '您对出行的关注说明内心渴望改变或放松。梦境是远方的呼唤，规划好行程，安全第一。',
    };
    return general[domainKey] || general['事业'];
  }

  /* ========== 五、公开API ========== */

  global.ZhougongEngine = {
    /**
     * 解梦（含问事分析）
     * @param {string} text - 梦境描述文字
     * @param {string} question - 所问之事（可选）
     * @returns {object} 解梦结果
     */
    divine: function (text, question) {
      if (!text || !text.trim()) {
        return {
          input: '',
          question: question || '',
          results: [],
          interpretation: '请输入您的梦境描述。',
          questionAnalysis: '',
          domain: null,
          ji: '中',
          categories: [],
        };
      }

      var results = searchDream(text);
      var interpretation = generateInterpretation(text, results);

      // 问事分析
      var domainKey = null;
      var questionAnalysis = '';
      if (question && question.trim()) {
        domainKey = detectDomain(question);
        questionAnalysis = generateQuestionAnalysis(text, results, question, domainKey);
      }

      var jiCount = 0,
        xiongCount = 0;
      for (var i = 0; i < results.length; i++) {
        if (results[i].ji === '吉') jiCount++;
        else if (results[i].ji === '凶') xiongCount++;
      }

      var overallJi = '中';
      if (jiCount > xiongCount && jiCount >= 2) overallJi = '吉';
      else if (xiongCount > jiCount && xiongCount >= 2) overallJi = '凶';

      var categories = [];
      var catMap = {};
      for (var j = 0; j < results.length; j++) {
        var cat = results[j].cat;
        if (!catMap[cat]) {
          categories.push(cat);
          catMap[cat] = true;
        }
      }

      return {
        input: text,
        question: question || '',
        results: results,
        interpretation: interpretation,
        questionAnalysis: questionAnalysis,
        domain: domainKey ? { key: domainKey, name: DOMAINS[domainKey].name, icon: DOMAINS[domainKey].icon } : null,
        ji: overallJi,
        categories: categories,
        count: results.length,
      };
    },

    /** 获取所有梦境分类 */
    getCategories: function () {
      var cats = [];
      for (var k in CATEGORIES) {
        cats.push({ id: k, name: CATEGORIES[k] });
      }
      return cats;
    },

    /** 获取所有梦境条目 */
    getAllDreams: function () {
      return DREAM_DB;
    },

    /** 按分类搜索 */
    searchByCategory: function (cat) {
      var results = [];
      for (var i = 0; i < DREAM_DB.length; i++) {
        if (DREAM_DB[i].cat === cat) {
          results.push(DREAM_DB[i]);
        }
      }
      return results;
    },
  };
})(typeof window !== 'undefined' ? window : this);
