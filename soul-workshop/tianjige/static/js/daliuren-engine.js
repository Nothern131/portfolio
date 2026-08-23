/**
 * 天机阁 · 大六壬引擎 v1 — 纯前端算法，零API调用
 * 天地盘 + 四课 + 三传 + 十二天将 + 课体判断 + 解读
 * 参考：邵彦和《六壬断案》体系
 */
(function (global) {
  'use strict';

  /* ========== 一、基础常量 ========== */
  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var ZHI_NUM = { 子: 0, 丑: 1, 寅: 2, 卯: 3, 辰: 4, 巳: 5, 午: 6, 未: 7, 申: 8, 酉: 9, 戌: 10, 亥: 11 };

  // 地支五行
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
  // 地支阴阳
  var ZHI_YY = {
    子: '阳',
    丑: '阴',
    寅: '阳',
    卯: '阴',
    辰: '阳',
    巳: '阴',
    午: '阳',
    未: '阴',
    申: '阳',
    酉: '阴',
    戌: '阳',
    亥: '阴',
  };

  // 六十甲子
  var SIXTY_JIAZI = [];
  var JIAZI_INDEX = {};
  for (var i = 0; i < 60; i++) {
    var jz = GAN[i % 10] + ZHI[i % 12];
    SIXTY_JIAZI.push(jz);
    JIAZI_INDEX[jz] = i;
  }

  // 五鼠遁（日上起时，用于确定时辰天干）
  var WUSHUDUN = { 甲: '甲', 己: '甲', 乙: '丙', 庚: '丙', 丙: '戊', 辛: '戊', 丁: '庚', 壬: '庚', 戊: '壬', 癸: '壬' };

  /* ========== 二、月将（每月中气后的月将） ========== */
  // 月将对应地支：正月亥将登明，二月戌将河魁...
  var MONTH_JIANG = [null, '亥', '戌', '酉', '申', '未', '午', '巳', '辰', '卯', '寅', '丑', '子'];
  // 中气对应日期（近似）
  var ZHONG_QI_DAY = [null, 20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];

  var JIANG_NAMES = {
    亥: '登明',
    戌: '河魁',
    酉: '从魁',
    申: '传送',
    未: '小吉',
    午: '胜光',
    巳: '太乙',
    辰: '天罡',
    卯: '太冲',
    寅: '功曹',
    丑: '大吉',
    子: '神后',
  };

  /** 根据公历月日获取月将 */
  function getYueJiang(month, day) {
    var jiang = MONTH_JIANG[month];
    if (!jiang) return '子';
    // 中气前用上月将
    if (day < ZHONG_QI_DAY[month]) {
      var prevMonth = month === 1 ? 12 : month - 1;
      return MONTH_JIANG[prevMonth] || '亥';
    }
    return jiang;
  }

  /* ========== 三、天盘 ========== */
  /** 月将加时：月将加占时之上，顺行十二辰 */
  function buildTianPan(yueJiang, zhanShi) {
    var jiangPos = ZHI_NUM[yueJiang];
    var shiPos = ZHI_NUM[zhanShi];
    // 天盘[地盘位置] = 天将
    var tianPan = {};
    for (var i = 0; i < 12; i++) {
      var offset = (i - shiPos + 12) % 12;
      var tianPos = (jiangPos + offset) % 12;
      tianPan[ZHI[i]] = ZHI[tianPos];
    }
    return tianPan;
  }

  /* ========== 四、四课 ========== */
  /**
   * 第一课：日干寄宫 → 天盘所临 → 上神
   * 日干寄宫：甲寄寅，乙寄辰，丙戊寄巳，丁己寄未，庚寄申，辛寄戌，壬寄亥，癸寄丑
   */
  var GAN_JI_GONG = {
    甲: '寅',
    乙: '辰',
    丙: '巳',
    丁: '未',
    戊: '巳',
    己: '未',
    庚: '申',
    辛: '戌',
    壬: '亥',
    癸: '丑',
  };

  function buildSiKe(riGan, riZhi, tianPan) {
    // 第一课：日干寄宫 → 天盘
    var ganJi = GAN_JI_GONG[riGan] || '寅';
    var ke1_shang = tianPan[ganJi]; // 干上神

    // 第二课：干上神 → 天盘
    var ke2_shang = tianPan[ke1_shang];

    // 第三课：日支 → 天盘
    var ke3_shang = tianPan[riZhi]; // 支上神

    // 第四课：支上神 → 天盘
    var ke4_shang = tianPan[ke3_shang];

    return {
      ganJi: ganJi,
      ke1: { xia: ganJi, shang: ke1_shang },
      ke2: { xia: ke1_shang, shang: ke2_shang },
      ke3: { xia: riZhi, shang: ke3_shang },
      ke4: { xia: ke3_shang, shang: ke4_shang },
    };
  }

  /* ========== 五、三传 ========== */
  /**
   * 九宗门法确定三传
   * 1. 贼克法（元首/重审/知一）
   * 2. 涉害法
   * 3. 遥克法
   * 4. 昴星法
   * 5. 别责法
   * 6. 八专法
   * 7. 伏吟法
   * 8. 返吟法
   */
  function buildSanChuan(siKe, riGan, riZhi, tianPan) {
    // 确定四课上神和下神的五行生克关系
    var keList = [siKe.ke1, siKe.ke2, siKe.ke3, siKe.ke4];
    var keInfo = [];

    for (var i = 0; i < keList.length; i++) {
      var k = keList[i];
      var xiaWx = ZHI_WX[k.xia];
      var shangWx = ZHI_WX[k.shang];
      var relation = '';
      // 上克下 = 贼
      if (isKe(shangWx, xiaWx)) relation = '上克下';
      // 下克上 = 克
      else if (isKe(xiaWx, shangWx)) relation = '下克上';
      else relation = '无克';

      keInfo.push({
        xia: k.xia,
        shang: k.shang,
        xiaWx: xiaWx,
        shangWx: shangWx,
        relation: relation,
      });
    }

    // 统计克的情况
    var xiaKeShang = []; // 下克上（贼）
    var shangKeXia = []; // 上克下（克）

    for (var j = 0; j < keInfo.length; j++) {
      if (keInfo[j].relation === '下克上') xiaKeShang.push(j);
      if (keInfo[j].relation === '上克下') shangKeXia.push(j);
    }

    var totalKe = xiaKeShang.length + shangKeXia.length;
    var keType = '';
    var chuChuan, zhongChuan, moChuan;

    // === 九宗门判断 ===

    // 1. 有克 → 贼克法
    if (totalKe > 0) {
      // 先取贼（下克上），后取克（上克下）
      var candidates = xiaKeShang.length > 0 ? xiaKeShang : shangKeXia;
      keType = xiaKeShang.length > 0 ? '重审' : '元首';

      if (candidates.length === 1) {
        // 只有一课有克 → 元首/重审
        chuChuan = keInfo[candidates[0]].shang;
      } else if (candidates.length > 1) {
        // 多课有克 → 知一
        keType = '知一';
        // 取与日干相比者（阴阳相同）
        var riGanYY = GAN.indexOf(riGan) % 2 === 0 ? '阳' : '阴';
        var found = false;
        for (var ci = 0; ci < candidates.length; ci++) {
          if (ZHI_YY[keInfo[candidates[ci]].shang] === riGanYY) {
            chuChuan = keInfo[candidates[ci]].shang;
            found = true;
            break;
          }
        }
        if (!found) {
          chuChuan = keInfo[candidates[0]].shang;
        }
      }
    } else {
      // 无克 → 遥克/昴星/别责/八专/伏吟/返吟
      // 判断是否伏吟（天盘=地盘）
      var isFuYin = true;
      for (var di = 0; di < 12; di++) {
        if (tianPan[ZHI[di]] !== ZHI[di]) {
          isFuYin = false;
          break;
        }
      }
      // 判断是否返吟（天盘与地盘对冲）
      var isFanYin = true;
      for (var fi = 0; fi < 12; fi++) {
        var expected = ZHI[(ZHI_NUM[ZHI[fi]] + 6) % 12];
        if (tianPan[ZHI[fi]] !== expected) {
          isFanYin = false;
          break;
        }
      }

      if (isFuYin) {
        // 伏吟
        keType = '伏吟';
        // 刚日（阳干）取干上神为初传，柔日（阴干）取支上神为初传
        var riGanYY2 = GAN.indexOf(riGan) % 2 === 0 ? '阳' : '阴';
        if (riGanYY2 === '阳') {
          chuChuan = siKe.ke1.shang;
        } else {
          chuChuan = siKe.ke3.shang;
        }
        // 中传取初传的刑
        zhongChuan = getXing(chuChuan);
        if (zhongChuan === chuChuan) {
          // 自刑：取冲
          zhongChuan = ZHI[(ZHI_NUM[chuChuan] + 6) % 12];
        }
        // 末传取中传的刑
        moChuan = getXing(zhongChuan);
        if (moChuan === zhongChuan) {
          moChuan = ZHI[(ZHI_NUM[zhongChuan] + 6) % 12];
        }
      } else if (isFanYin) {
        // 返吟
        keType = '返吟';
        // 看是否有克
        if (totalKe > 0) {
          // 有克
          candidates = xiaKeShang.length > 0 ? xiaKeShang : shangKeXia;
          chuChuan = keInfo[candidates[0]].shang;
        } else {
          // 无克：井栏格
          keType = '返吟·井栏';
          // 刚日取干上神，柔日取支上神
          var riGanYY3 = GAN.indexOf(riGan) % 2 === 0 ? '阳' : '阴';
          if (riGanYY3 === '阳') {
            chuChuan = siKe.ke1.shang;
          } else {
            chuChuan = siKe.ke3.shang;
          }
        }
        // 中传取初传的驿马
        zhongChuan = getYiMa(riZhi);
        // 末传取中传的冲
        moChuan = ZHI[(ZHI_NUM[zhongChuan] + 6) % 12];
      } else {
        // 遥克：四课无克，取遥克
        // 检查是否有遥克（日干与上神克）
        var yaoKeIdx = -1;
        for (var yk = 0; yk < keList.length; yk++) {
          var shangWx = ZHI_WX[keList[yk].shang];
          var ganWx = GAN_WX[riGan];
          // 干克上神（蒿矢）或上神克干（弹射）
          if (isKe(ganWx, shangWx) || isKe(shangWx, ganWx)) {
            yaoKeIdx = yk;
            break;
          }
        }

        if (yaoKeIdx >= 0) {
          // 遥克法
          if (isKe(GAN_WX[riGan], ZHI_WX[siKe.ke1.shang]) || isKe(ZHI_WX[siKe.ke1.shang], GAN_WX[riGan])) {
            keType = '蒿矢';
          } else {
            keType = '弹射';
          }
          chuChuan = keList[yaoKeIdx].shang;
        } else {
          // 昴星/别责/八专
          // 判断四课是否全（有无重复）
          var allShangs = [siKe.ke1.shang, siKe.ke2.shang, siKe.ke3.shang, siKe.ke4.shang];
          var uniqueShangs = [];
          for (var us = 0; us < allShangs.length; us++) {
            if (uniqueShangs.indexOf(allShangs[us]) === -1) uniqueShangs.push(allShangs[us]);
          }

          if (uniqueShangs.length === 4) {
            // 昴星
            keType = '昴星';
            var riGanYY4 = GAN.indexOf(riGan) % 2 === 0 ? '阳' : '阴';
            if (riGanYY4 === '阳') {
              // 刚日：仰视酉上所得为初传
              chuChuan = tianPan['酉'];
            } else {
              // 柔日：俯视酉下所得为初传（即酉所临地盘）
              for (var dz = 0; dz < 12; dz++) {
                if (tianPan[ZHI[dz]] === '酉') {
                  chuChuan = ZHI[dz];
                  break;
                }
              }
            }
            // 中传：刚日取支上神，柔日取干上神
            if (riGanYY4 === '阳') {
              zhongChuan = siKe.ke3.shang;
            } else {
              zhongChuan = siKe.ke1.shang;
            }
            // 末传：刚日取干上神，柔日取支上神
            if (riGanYY4 === '阳') {
              moChuan = siKe.ke1.shang;
            } else {
              moChuan = siKe.ke3.shang;
            }
          } else if (uniqueShangs.length === 3) {
            // 别责
            keType = '别责';
            var riGanYY5 = GAN.indexOf(riGan) % 2 === 0 ? '阳' : '阴';
            if (riGanYY5 === '阳') {
              // 刚日：取干合之上神为初传
              chuChuan = tianPan[getGanHe(riGan)];
            } else {
              // 柔日：取支前三合之上神
              // 取日支的三合局
              var sanHe = getSanHe(riZhi);
              if (sanHe) {
                chuChuan = tianPan[sanHe[2]]; // 支前三位
              } else {
                chuChuan = siKe.ke3.shang;
              }
            }
            // 中末传都用干上神
            zhongChuan = siKe.ke1.shang;
            moChuan = siKe.ke1.shang;
          } else {
            // 八专（四课中只有两课不同）
            keType = '八专';
            var riGanYY6 = GAN.indexOf(riGan) % 2 === 0 ? '阳' : '阴';
            if (riGanYY6 === '阳') {
              // 刚日：从干上神顺数三辰为初传
              chuChuan = ZHI[(ZHI_NUM[siKe.ke1.shang] + 3) % 12];
            } else {
              // 柔日：从支上神逆数三辰为初传
              chuChuan = ZHI[(ZHI_NUM[siKe.ke3.shang] - 3 + 12) % 12];
            }
            zhongChuan = siKe.ke1.shang;
            moChuan = siKe.ke1.shang;
          }
        }
      }
    }

    // 如果还没有中传和末传，按标准规则生成
    if (!zhongChuan) {
      // 中传：初传之阴神（初传在天盘所临）
      zhongChuan = tianPan[chuChuan];
    }
    if (!moChuan) {
      // 末传：中传之阴神
      moChuan = tianPan[zhongChuan];
    }

    return {
      chu: chuChuan,
      zhong: zhongChuan,
      mo: moChuan,
      type: keType,
      keInfo: keInfo,
    };
  }

  /** 五行相克判断 */
  function isKe(wx1, wx2) {
    var keMap = { 木: '土', 火: '金', 土: '水', 金: '木', 水: '火' };
    return keMap[wx1] === wx2;
  }

  /** 天干五行 */
  function GAN_WX(gan) {
    return (
      { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' }[gan] || '?'
    );
  }

  /** 地支刑 */
  function getXing(zhi) {
    var xingMap = {
      子: '卯',
      卯: '子',
      寅: '巳',
      巳: '申',
      申: '寅',
      丑: '未',
      未: '戌',
      戌: '丑',
      辰: '辰',
      午: '午',
      酉: '酉',
      亥: '亥',
    };
    return xingMap[zhi] || zhi;
  }

  /** 驿马 */
  function getYiMa(zhi) {
    var maMap = {
      申: '寅',
      子: '寅',
      辰: '寅',
      寅: '申',
      午: '申',
      戌: '申',
      巳: '亥',
      酉: '亥',
      丑: '亥',
      亥: '巳',
      卯: '巳',
      未: '巳',
    };
    return maMap[zhi] || '寅';
  }

  /** 天干合 */
  function getGanHe(gan) {
    var heMap = { 甲: '己', 己: '甲', 乙: '庚', 庚: '乙', 丙: '辛', 辛: '丙', 丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊' };
    return heMap[gan] || '己';
  }

  /** 地支三合 */
  function getSanHe(zhi) {
    var heMap = {
      申: ['申', '子', '辰'],
      子: ['申', '子', '辰'],
      辰: ['申', '子', '辰'],
      巳: ['巳', '酉', '丑'],
      酉: ['巳', '酉', '丑'],
      丑: ['巳', '酉', '丑'],
      寅: ['寅', '午', '戌'],
      午: ['寅', '午', '戌'],
      戌: ['寅', '午', '戌'],
      亥: ['亥', '卯', '未'],
      卯: ['亥', '卯', '未'],
      未: ['亥', '卯', '未'],
    };
    return heMap[zhi] || null;
  }

  /* ========== 六、十二天将 ========== */
  /**
   * 贵人诀：甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，六辛逢马虎，此是贵人方
   * 阳贵（昼）：甲戊庚→丑，乙己→子，丙丁→亥，壬癸→卯，六辛→午
   * 阴贵（夜）：甲戊庚→未，乙己→申，丙丁→酉，壬癸→巳，六辛→寅
   */
  var GUI_REN_DAY = {
    甲: '丑',
    戊: '丑',
    庚: '丑',
    乙: '子',
    己: '子',
    丙: '亥',
    丁: '亥',
    壬: '卯',
    癸: '卯',
    辛: '午',
  };
  var GUI_REN_NIGHT = {
    甲: '未',
    戊: '未',
    庚: '未',
    乙: '申',
    己: '申',
    丙: '酉',
    丁: '酉',
    壬: '巳',
    癸: '巳',
    辛: '寅',
  };

  // 十二天将顺逆排（从贵人开始）
  var TIAN_JIANG = ['贵人', '螣蛇', '朱雀', '六合', '勾陈', '青龙', '天空', '白虎', '太常', '玄武', '太阴', '天后'];

  function buildShiErTianJiang(riGan, zhanShi, tianPan) {
    // 判断昼夜（卯时到申时为昼，酉时到寅时为夜）
    var zhanZhi = zhanShi;
    var shiNum = ZHI_NUM[zhanZhi];
    var isDay = shiNum >= 3 && shiNum <= 8; // 卯(3)到申(8)为昼

    var guiRenZhi = isDay ? GUI_REN_DAY[riGan] : GUI_REN_NIGHT[riGan];
    if (!guiRenZhi) guiRenZhi = '丑';

    // 贵人所在的宫位（天盘）
    // 贵人在天盘上的位置
    var guiRenPos;
    for (var di = 0; di < 12; di++) {
      if (tianPan[ZHI[di]] === guiRenZhi) {
        guiRenPos = ZHI[di];
        break;
      }
    }
    if (!guiRenPos) guiRenPos = ZHI[0];

    var guiRenIdx = ZHI_NUM[guiRenPos];
    // 贵人顺逆：昼贵顺行，夜贵逆行
    // 但需要看贵人所在地支的阴阳：巳亥为界
    var guiRenOriginal = isDay ? GUI_REN_DAY[riGan] : GUI_REN_NIGHT[riGan];
    var guiRenIdx2 = ZHI_NUM[guiRenOriginal];
    // 贵人顺逆：贵人在巳(5)到戌(10)之间逆行，其他顺行
    var isShun = guiRenIdx2 >= 5 && guiRenIdx2 <= 10 ? false : true;

    var tianJiangMap = {};
    for (var i = 0; i < 12; i++) {
      var offset = isShun ? i : 12 - i;
      var pos = (guiRenIdx + offset) % 12;
      tianJiangMap[ZHI[pos]] = TIAN_JIANG[i];
    }

    return tianJiangMap;
  }

  /* ========== 七、六亲关系 ========== */
  function getLiuQin(riGanWx, zhiWx) {
    // 生我者父母，我生者子孙，克我者官鬼，我克者妻财，同我者兄弟
    if (zhiWx === riGanWx) return '兄弟';
    if (isKe(zhiWx, riGanWx)) return '官鬼';
    if (isKe(riGanWx, zhiWx)) return '妻财';
    var wxSheng = { 木: '水', 火: '木', 土: '火', 金: '土', 水: '金' };
    if (wxSheng[zhiWx] === riGanWx) return '父母';
    if (wxSheng[riGanWx] === zhiWx) return '子孙';
    return '?';
  }

  /* ========== 八、课体判断与解读 ========== */
  function getKeTiInfo(keType, siKe, sanChuan, riGan, riZhi) {
    var keTiMap = {
      元首: { desc: '元首课，一上克下，天地得位，万事亨通，为诸课之首。', ji: '吉' },
      重审: { desc: '重审课，一下克上，事须三思，先难后易，不可轻举。', ji: '中平' },
      知一: { desc: '知一课，二上克下或二下克上，择一而取，事有分歧，需审慎抉择。', ji: '中平' },
      涉害: { desc: '涉害课，多克取深，事涉艰难，如涉水而行，需耐心应对。', ji: '偏凶' },
      遥克: { desc: '遥克课，四课无克，取遥克为用，事有阻隔，需等待时机。', ji: '中平' },
      蒿矢: { desc: '蒿矢课，干上神克干，如箭在弦，事有逼迫，但力不足。', ji: '偏凶' },
      弹射: { desc: '弹射课，干克上神，如弹丸射出，主动出击，但力有未逮。', ji: '中平' },
      昴星: { desc: '昴星课，取酉上下为传，如虎视眈眈，事多惊险，需谨慎行事。', ji: '偏凶' },
      别责: { desc: '别责课，四课不全，取合为用，事有缺憾，需另寻他途。', ji: '中平' },
      八专: { desc: '八专业课，干支同位，事有专一，但恐独断专行，需兼听则明。', ji: '中平' },
      伏吟: { desc: '伏吟课，天盘不动，事有停滞，如冬眠之兽，宜静不宜动。', ji: '偏凶' },
      返吟: { desc: '返吟课，天盘对冲，事有反复，如波涛起伏，需以静制动。', ji: '偏凶' },
      '返吟·井栏': { desc: '返吟·井栏格，对冲无克，如井栏斜射，事有迂回，需耐心等待。', ji: '中平' },
    };

    var info = keTiMap[keType] || { desc: '课体复杂，需综合判断。', ji: '中平' };
    return info;
  }

  function generateInterpretation(keType, sanChuan, tianJiangMap, siKe, riGan, riZhi) {
    var keTi = getKeTiInfo(keType, siKe, sanChuan, riGan, riZhi);
    var riGanWx = GAN_WX(riGan);

    var lines = [];

    // 课体
    lines.push('【课体】' + keType + ' — ' + keTi.desc);

    // 三传
    var chuanStr = sanChuan.chu + '→' + sanChuan.zhong + '→' + sanChuan.mo;
    lines.push(
      '【三传】' +
        chuanStr +
        '（初传' +
        JIANG_NAMES[sanChuan.chu] +
        '，中传' +
        JIANG_NAMES[sanChuan.zhong] +
        '，末传' +
        JIANG_NAMES[sanChuan.mo] +
        '）'
    );

    // 四课
    lines.push('【四课】');
    lines.push('  第一课：' + siKe.ke1.xia + '上' + siKe.ke1.shang + '（日干' + riGan + '寄' + siKe.ganJi + '）');
    lines.push('  第二课：' + siKe.ke2.xia + '上' + siKe.ke2.shang);
    lines.push('  第三课：' + siKe.ke3.xia + '上' + siKe.ke3.shang + '（日支' + riZhi + '）');
    lines.push('  第四课：' + siKe.ke4.xia + '上' + siKe.ke4.shang);

    // 十二天将
    var chuJiang = tianJiangMap[sanChuan.chu] || '?';
    var zhongJiang = tianJiangMap[sanChuan.zhong] || '?';
    var moJiang = tianJiangMap[sanChuan.mo] || '?';
    lines.push('【天将】初传' + chuJiang + '，中传' + zhongJiang + '，末传' + moJiang);

    // 六亲
    var chuQin = getLiuQin(riGanWx, ZHI_WX[sanChuan.chu]);
    var zhongQin = getLiuQin(riGanWx, ZHI_WX[sanChuan.zhong]);
    var moQin = getLiuQin(riGanWx, ZHI_WX[sanChuan.mo]);
    lines.push('【六亲】初传' + chuQin + '，中传' + zhongQin + '，末传' + moQin);

    // 解读
    lines.push('【研判】');
    if (keTi.ji === '吉') {
      lines.push('  此课' + keType + '，' + keTi.desc.substring(0, 20) + '。');
      lines.push('  初传' + sanChuan.chu + '临' + chuJiang + '，为' + chuQin + '，主事之始顺遂。');
      lines.push('  中传' + sanChuan.zhong + '临' + zhongJiang + '，为' + zhongQin + '，主事之中发展良好。');
      lines.push('  末传' + sanChuan.mo + '临' + moJiang + '，为' + moQin + '，主事之末有收成。');
      lines.push('  综合来看，此事宜进不宜退，把握初传之机，稳扎稳打，可获善果。');
    } else if (keTi.ji === '偏凶') {
      lines.push('  此课' + keType + '，' + keTi.desc.substring(0, 20) + '。');
      lines.push('  初传' + sanChuan.chu + '临' + chuJiang + '，为' + chuQin + '，主事之始有阻。');
      lines.push('  中传' + sanChuan.zhong + '临' + zhongJiang + '，为' + zhongQin + '，主事之中需谨慎。');
      lines.push('  末传' + sanChuan.mo + '临' + moJiang + '，为' + moQin + '，主事之末有望转机。');
      lines.push('  综合来看，此事宜静不宜动，韬光养晦，待时而发，不可冒进。');
    } else {
      lines.push('  此课' + keType + '，' + keTi.desc.substring(0, 20) + '。');
      lines.push('  初传' + sanChuan.chu + '临' + chuJiang + '，为' + chuQin + '，主事之始需审慎。');
      lines.push('  中传' + sanChuan.zhong + '临' + zhongJiang + '，为' + zhongQin + '，主事之中有变化。');
      lines.push('  末传' + sanChuan.mo + '临' + moJiang + '，为' + moQin + '，主事之末见分晓。');
      lines.push('  综合来看，此事需权衡利弊，顺势而为，不可强求，亦不可放弃。');
    }

    lines.push(
      '【邵彦和按】六壬之道，重在课体与三传。' +
        keType +
        '课之象，' +
        '初传为事之始，中传为事之中，末传为事之终。' +
        '观' +
        sanChuan.chu +
        '→' +
        sanChuan.zhong +
        '→' +
        sanChuan.mo +
        '之序，可知事之演变。' +
        '天时地利人和，缺一不可。今课' +
        keTi.ji +
        '，当据实情而断，不可执一而论。'
    );

    return lines.join('\n');
  }

  /* ========== 九、主入口 ========== */
  /**
   * 大六壬占卜
   * @param {string} dateStr - 日期字符串 YYYY-MM-DD
   * @param {number} hourNum - 时辰编号 0-11（子时=0）
   * @returns {object} 六壬结果
   */
  function divine(dateStr, hourNum) {
    dateStr = dateStr || new Date().toISOString().slice(0, 10);
    hourNum = typeof hourNum === 'number' && hourNum >= 0 && hourNum <= 11 ? hourNum : 0;

    var parts = dateStr.split('-');
    var year = parseInt(parts[0]) || 2024;
    var month = parseInt(parts[1]) || 1;
    var day = parseInt(parts[2]) || 1;

    // 1. 计算日干支
    var baseDate = new Date(1900, 0, 1);
    var targetDate = new Date(year, month - 1, day);
    var diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    var baseIdx = 11; // 1900-01-01 甲戌
    var dayIdx = (((baseIdx + diffDays) % 60) + 60) % 60;
    var riGan = GAN[dayIdx % 10];
    var riZhi = ZHI[dayIdx % 12];

    // 2. 占时
    var zhanShi = ZHI[hourNum];

    // 3. 月将
    var yueJiang = getYueJiang(month, day);

    // 4. 天盘
    var tianPan = buildTianPan(yueJiang, zhanShi);

    // 5. 四课
    var siKe = buildSiKe(riGan, riZhi, tianPan);

    // 6. 三传
    var sanChuan = buildSanChuan(siKe, riGan, riZhi, tianPan);

    // 7. 十二天将
    var tianJiangMap = buildShiErTianJiang(riGan, zhanShi, tianPan);

    // 8. 解读
    var interpretation = generateInterpretation(sanChuan.type, sanChuan, tianJiangMap, siKe, riGan, riZhi);

    // 判断吉凶等级
    var keTi = getKeTiInfo(sanChuan.type, siKe, sanChuan, riGan, riZhi);
    var level = keTi.ji;

    return {
      date: dateStr,
      zhan_shi: zhanShi,
      yue_jiang: yueJiang,
      yue_jiang_name: JIANG_NAMES[yueJiang],
      ri_gan: riGan,
      ri_zhi: riZhi,
      tian_pan: tianPan,
      si_ke: siKe,
      san_chuan: sanChuan,
      tian_jiang: tianJiangMap,
      ke_name: sanChuan.type,
      chuan: sanChuan.chu + '→' + sanChuan.zhong + '→' + sanChuan.mo,
      interpretation: interpretation,
      level: level,
    };
  }

  /* ========== 公开 API ========== */
  global.DaLiuRenEngine = {
    divine: divine,
    getYueJiang: getYueJiang,
    JIANG_NAMES: JIANG_NAMES,
    ZHI: ZHI,
    GAN: GAN,
  };
})(typeof window !== 'undefined' ? window : this);
