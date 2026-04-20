'use strict';

// ========== 教育用GAS URL ==========
const EDU_GAS_URL = 'https://script.google.com/a/macros/oskedu.jp/s/AKfycbxbTQ6tVrySnF4sGy5ZNTcA0c7kAlXJixQPfKX-tpSpYTokTH0ODyG7VvSJo2uO1bLI6g/exec';

// ========== 設定 ==========
const TOTAL_ROUNDS = 3;
const MAX_SCORE_PER_ROUND = 1000;
const MAX_DISTANCE_KM = 2000;        // 全国モード：2000km 基準
const MAX_DISTANCE_LOCAL_KM = 3;     // 地元モード：3km 基準（築港エリア想定）
const MAX_DISTANCE_WORLD_KM = 20000; // 世界チャレンジ：地球半周（約20000km）基準

// ========== 全国モード 出題座標リスト（全47都道府県 約500か所） ==========
const LOCATIONS = [
  // ── 北海道 ──
  { lat: 43.0618, lng: 141.3545, label: '札幌 大通公園' },
  { lat: 43.0636, lng: 141.3468, label: '札幌 すすきの' },
  { lat: 43.1907, lng: 140.9947, label: '小樽 運河' },
  { lat: 43.1864, lng: 140.9926, label: '小樽 堺町通り' },
  { lat: 41.7686, lng: 140.7152, label: '函館 赤レンガ倉庫' },
  { lat: 41.7730, lng: 140.7180, label: '函館 元町教会群' },
  { lat: 43.7703, lng: 142.3652, label: '旭川 平和通' },
  { lat: 43.5636, lng: 144.3780, label: '釧路 幣舞橋周辺' },
  { lat: 44.0199, lng: 144.2697, label: '網走 博物館網走監獄周辺' },
  { lat: 43.3506, lng: 142.4788, label: '富良野 ラベンダー畑周辺' },
  { lat: 42.4724, lng: 141.1047, label: '登別温泉 地獄谷周辺' },
  { lat: 42.6018, lng: 140.7866, label: '洞爺湖 湖畔' },
  { lat: 42.9236, lng: 143.1966, label: '帯広 北の屋台周辺' },
  { lat: 43.5839, lng: 142.4660, label: '美瑛 丘の風景' },
  { lat: 44.0709, lng: 144.9786, label: '知床 ウトロ漁港周辺' },

  // ── 青森 ──
  { lat: 40.6066, lng: 140.4636, label: '弘前城周辺' },
  { lat: 40.8244, lng: 140.7400, label: '青森 ねぶたの家周辺' },
  { lat: 41.4875, lng: 141.0433, label: '下北半島 恐山参道' },
  { lat: 40.6127, lng: 141.2096, label: '十和田 官庁街通り' },
  { lat: 40.5473, lng: 140.8927, label: '奥入瀬渓流沿い' },
  { lat: 40.5143, lng: 141.4888, label: '八戸 中心街' },
  { lat: 41.2951, lng: 141.3198, label: 'むつ市街周辺' },
  { lat: 40.6234, lng: 140.3695, label: '弘前 洋館通り' },

  // ── 岩手 ──
  { lat: 38.9877, lng: 141.1132, label: '平泉 中尊寺周辺' },
  { lat: 39.7016, lng: 141.1527, label: '盛岡 城跡公園' },
  { lat: 39.3782, lng: 141.9826, label: '浄土ヶ浜周辺' },
  { lat: 39.3275, lng: 141.5342, label: '遠野 カッパ淵周辺' },
  { lat: 39.3765, lng: 141.1222, label: '花巻温泉周辺' },
  { lat: 38.9042, lng: 141.0928, label: '一ノ関 厳美渓周辺' },
  { lat: 39.6991, lng: 141.1500, label: '盛岡 南部鉄器店通り' },
  { lat: 39.2724, lng: 141.8609, label: '宮古 魚市場周辺' },

  // ── 宮城 ──
  { lat: 38.2682, lng: 140.8694, label: '仙台 青葉城跡' },
  { lat: 38.3686, lng: 141.0679, label: '松島' },
  { lat: 38.4267, lng: 141.3035, label: '石巻 日和山公園周辺' },
  { lat: 38.2671, lng: 140.8719, label: '仙台 定禅寺通り' },
  { lat: 38.3140, lng: 141.0222, label: '塩竈神社周辺' },
  { lat: 38.9027, lng: 141.5694, label: '気仙沼 魚市場周辺' },
  { lat: 38.1083, lng: 140.8710, label: '仙台 秋保温泉周辺' },
  { lat: 38.2536, lng: 140.8667, label: '仙台 勾当台公園周辺' },

  // ── 秋田 ──
  { lat: 39.6033, lng: 140.5598, label: '角館 武家屋敷通り' },
  { lat: 39.7186, lng: 140.1023, label: '秋田駅周辺' },
  { lat: 39.7009, lng: 140.7302, label: '田沢湖 湖畔' },
  { lat: 40.0174, lng: 139.8476, label: '男鹿半島 入道崎' },
  { lat: 39.4359, lng: 140.4986, label: '大曲 花火会場周辺' },
  { lat: 39.3102, lng: 140.5654, label: '横手 かまくら館周辺' },
  { lat: 39.1568, lng: 140.5196, label: '湯沢 稲庭うどん店街' },
  { lat: 40.2079, lng: 140.0291, label: '能代 市街周辺' },

  // ── 山形 ──
  { lat: 38.2611, lng: 140.3472, label: '山形城跡 霞城公園' },
  { lat: 38.5844, lng: 140.5672, label: '銀山温泉' },
  { lat: 38.3114, lng: 140.8836, label: '山寺 立石寺参道' },
  { lat: 38.7295, lng: 139.8256, label: '鶴岡 致道博物館周辺' },
  { lat: 38.9205, lng: 139.8387, label: '酒田 山居倉庫周辺' },
  { lat: 37.9208, lng: 140.1183, label: '米沢城跡周辺' },
  { lat: 38.4456, lng: 140.3633, label: '天童 将棋資料館周辺' },
  { lat: 38.6481, lng: 139.9718, label: '羽黒山 参道五重塔周辺' },

  // ── 福島 ──
  { lat: 37.4896, lng: 139.9266, label: '鶴ヶ城周辺' },
  { lat: 37.3567, lng: 140.3870, label: '福島市 花見山公園付近' },
  { lat: 37.6154, lng: 140.1059, label: '猪苗代湖 湖畔' },
  { lat: 37.2698, lng: 139.9137, label: '大内宿 宿場町' },
  { lat: 37.6697, lng: 140.0683, label: '裏磐梯 五色沼周辺' },
  { lat: 37.0424, lng: 140.8881, label: 'いわき 小名浜漁港周辺' },
  { lat: 37.4026, lng: 140.3628, label: '郡山 開成山公園周辺' },
  { lat: 37.1256, lng: 140.2092, label: '白河 小峰城跡周辺' },

  // ── 茨城 ──
  { lat: 36.3771, lng: 140.4654, label: '偕楽園周辺' },
  { lat: 36.2255, lng: 140.1063, label: '筑波山麓' },
  { lat: 36.3788, lng: 140.4717, label: '水戸駅周辺' },
  { lat: 36.5668, lng: 140.3998, label: '袋田の滝周辺' },
  { lat: 36.3699, lng: 140.3023, label: '笠間稲荷神社周辺' },
  { lat: 35.9678, lng: 140.6332, label: '鹿島神宮周辺' },
  { lat: 36.4062, lng: 140.4445, label: '水戸 弘道館周辺' },
  { lat: 35.6625, lng: 140.0456, label: '牛久大仏周辺' },

  // ── 栃木 ──
  { lat: 36.7581, lng: 139.5990, label: '日光 東照宮参道' },
  { lat: 36.5657, lng: 139.8836, label: '宇都宮 大谷資料館周辺' },
  { lat: 36.6579, lng: 139.9786, label: '足利 足利学校周辺' },
  { lat: 36.8011, lng: 139.7045, label: '鬼怒川温泉 駅周辺' },
  { lat: 36.9249, lng: 139.8796, label: '日光 いろは坂展望台' },
  { lat: 36.4656, lng: 140.0951, label: '益子 陶芸メッセ周辺' },
  { lat: 36.3771, lng: 139.7278, label: '佐野 厄除大師周辺' },
  { lat: 36.5600, lng: 139.8873, label: '宇都宮 餃子通り' },

  // ── 群馬 ──
  { lat: 36.6196, lng: 138.5964, label: '草津温泉 湯畑' },
  { lat: 36.4742, lng: 138.8942, label: '伊香保温泉 石段街' },
  { lat: 36.2549, lng: 138.8791, label: '富岡製糸場周辺' },
  { lat: 36.8480, lng: 138.9841, label: '水上温泉 周辺' },
  { lat: 36.5535, lng: 139.1905, label: '赤城山 大沼周辺' },
  { lat: 36.3327, lng: 138.8148, label: '下仁田 ネギ街道周辺' },
  { lat: 36.3913, lng: 139.0731, label: '高崎 達磨寺周辺' },
  { lat: 36.3889, lng: 139.0607, label: '前橋 敷島公園周辺' },

  // ── 埼玉 ──
  { lat: 35.9249, lng: 139.4849, label: '川越 蔵造りの街並み' },
  { lat: 35.8617, lng: 139.6456, label: 'さいたま新都心' },
  { lat: 35.9916, lng: 139.0853, label: '秩父 秩父神社周辺' },
  { lat: 36.1205, lng: 139.1043, label: '長瀞 岩畳周辺' },
  { lat: 35.7992, lng: 139.4668, label: '所沢 航空記念公園周辺' },
  { lat: 36.1604, lng: 139.3795, label: '深谷 渋沢栄一生誕地周辺' },
  { lat: 35.9888, lng: 139.5252, label: '川越 菓子屋横丁' },
  { lat: 35.8572, lng: 139.6490, label: 'さいたま 氷川神社周辺' },

  // ── 千葉 ──
  { lat: 35.7938, lng: 140.3170, label: '成田山 表参道' },
  { lat: 35.6528, lng: 140.0330, label: '幕張 海浜公園周辺' },
  { lat: 35.7395, lng: 140.8676, label: '銚子 犬吠埼灯台周辺' },
  { lat: 35.5680, lng: 140.4519, label: '九十九里浜 海岸' },
  { lat: 35.1499, lng: 139.8127, label: '鋸山 日本寺周辺' },
  { lat: 35.7235, lng: 140.4993, label: '佐原 香取神宮周辺' },
  { lat: 35.4826, lng: 140.0143, label: '木更津 金田海岸周辺' },
  { lat: 35.0444, lng: 139.8234, label: '館山 城山公園周辺' },

  // ── 東京 ──
  { lat: 35.6595, lng: 139.7004, label: '渋谷スクランブル交差点' },
  { lat: 35.7101, lng: 139.8107, label: '東京スカイツリー周辺' },
  { lat: 35.6938, lng: 139.7034, label: '新宿西口' },
  { lat: 35.7148, lng: 139.7967, label: '浅草寺周辺' },
  { lat: 35.7141, lng: 139.7774, label: '上野公園周辺' },
  { lat: 35.6309, lng: 139.8804, label: 'お台場 潮風公園周辺' },
  { lat: 35.7022, lng: 139.7741, label: '秋葉原 電気街' },
  { lat: 35.6628, lng: 139.7302, label: '六本木 ヒルズ周辺' },
  { lat: 35.6653, lng: 139.7122, label: '表参道' },
  { lat: 35.6812, lng: 139.7671, label: '東京駅 丸の内' },
  { lat: 35.7295, lng: 139.7109, label: '池袋 サンシャイン通り' },
  { lat: 35.6717, lng: 139.7651, label: '銀座 4丁目交差点' },
  { lat: 35.6613, lng: 139.6681, label: '下北沢 駅周辺' },
  { lat: 35.7026, lng: 139.5797, label: '吉祥寺 ハーモニカ横丁周辺' },
  { lat: 35.6586, lng: 139.7454, label: '東京タワー周辺' },

  // ── 神奈川 ──
  { lat: 35.3167, lng: 139.5352, label: '鎌倉 大仏周辺' },
  { lat: 35.4437, lng: 139.6476, label: '横浜 中華街' },
  { lat: 35.4628, lng: 139.6224, label: '横浜 みなとみらい' },
  { lat: 35.2514, lng: 139.1053, label: '小田原城周辺' },
  { lat: 35.2001, lng: 139.0254, label: '箱根 芦ノ湖周辺' },
  { lat: 35.2985, lng: 139.4827, label: '江の島 参道' },
  { lat: 35.5224, lng: 139.3894, label: '川崎大師 表参道' },
  { lat: 35.3369, lng: 139.4906, label: '藤沢 湘南海岸' },
  { lat: 35.2800, lng: 139.6686, label: '横須賀 三笠公園周辺' },
  { lat: 35.4577, lng: 139.6313, label: '横浜 山下公園周辺' },

  // ── 新潟 ──
  { lat: 37.9161, lng: 139.0612, label: '新潟駅周辺' },
  { lat: 37.9508, lng: 139.0254, label: '新潟 古町周辺' },
  { lat: 37.8268, lng: 138.8588, label: '弥彦神社周辺' },
  { lat: 37.4959, lng: 138.8578, label: '佐渡 宿根木' },
  { lat: 37.4451, lng: 138.8509, label: '長岡 花火会場周辺' },
  { lat: 37.1481, lng: 138.2361, label: '上越 春日山城跡' },
  { lat: 36.9833, lng: 138.6875, label: '清津峡 周辺' },
  { lat: 38.0637, lng: 139.4270, label: '村上 武家町通り' },

  // ── 富山 ──
  { lat: 36.6951, lng: 137.2117, label: '富山城周辺' },
  { lat: 36.7197, lng: 137.3631, label: '黒部宇奈月温泉駅周辺' },
  { lat: 36.5548, lng: 136.9856, label: '高岡 瑞龍寺周辺' },
  { lat: 36.5836, lng: 137.6044, label: '立山 室堂周辺' },
  { lat: 36.8555, lng: 136.9834, label: '氷見 漁港周辺' },
  { lat: 36.6451, lng: 136.9651, label: '砺波 散居村展望台' },
  { lat: 36.6988, lng: 137.1953, label: '富山 環水公園周辺' },
  { lat: 36.5617, lng: 137.1347, label: '南砺 福光 井波彫刻通り' },

  // ── 石川 ──
  { lat: 36.5613, lng: 136.6622, label: '金沢 兼六園周辺' },
  { lat: 36.5619, lng: 136.6562, label: '金沢 ひがし茶屋街' },
  { lat: 37.0645, lng: 136.9089, label: '能登 輪島朝市周辺' },
  { lat: 37.1002, lng: 136.9857, label: '和倉温泉 湯っ足りパーク周辺' },
  { lat: 36.5576, lng: 136.6601, label: '金沢 近江町市場' },
  { lat: 36.2376, lng: 136.3814, label: '加賀 山中温泉周辺' },
  { lat: 37.3930, lng: 137.0011, label: '能登 白米千枚田周辺' },
  { lat: 36.9226, lng: 136.8892, label: '七尾 能登食祭市場周辺' },

  // ── 福井 ──
  { lat: 36.0924, lng: 136.5369, label: '永平寺参道' },
  { lat: 36.2293, lng: 136.1434, label: '東尋坊' },
  { lat: 35.9103, lng: 136.1964, label: '三方五湖 梅丈岳周辺' },
  { lat: 35.9776, lng: 136.4960, label: '越前大野城周辺' },
  { lat: 36.0574, lng: 136.5011, label: '勝山 恐竜博物館周辺' },
  { lat: 35.6476, lng: 136.0556, label: '敦賀 気比神宮周辺' },
  { lat: 35.4972, lng: 135.7450, label: '小浜 小浜西組の町並み' },
  { lat: 36.0605, lng: 136.2194, label: '越前 和紙の里周辺' },

  // ── 山梨 ──
  { lat: 35.5111, lng: 138.7520, label: '河口湖 湖畔' },
  { lat: 35.6635, lng: 138.5686, label: '甲府 武田神社周辺' },
  { lat: 35.4667, lng: 138.8013, label: '山中湖 湖畔' },
  { lat: 35.4898, lng: 138.8074, label: '富士吉田 富士山駅周辺' },
  { lat: 35.7007, lng: 138.5631, label: '昇仙峡 渓谷遊歩道' },
  { lat: 35.8983, lng: 138.4250, label: '清里高原 周辺' },
  { lat: 35.6220, lng: 138.6275, label: '甲府 甲州街道周辺' },
  { lat: 35.5843, lng: 138.5763, label: '勝沼 ぶどう畑周辺' },

  // ── 長野 ──
  { lat: 36.2381, lng: 137.9719, label: '松本城周辺' },
  { lat: 36.6485, lng: 138.1952, label: '長野 善光寺周辺' },
  { lat: 36.7048, lng: 137.8534, label: '上高地 河童橋周辺' },
  { lat: 36.3487, lng: 138.5963, label: '軽井沢 旧軽井沢銀座' },
  { lat: 36.3385, lng: 138.1497, label: '別所温泉 北向観音周辺' },
  { lat: 36.0519, lng: 138.0781, label: '諏訪湖 湖畔' },
  { lat: 35.5151, lng: 137.8218, label: '飯田 りんご並木' },
  { lat: 36.9243, lng: 138.4395, label: '野沢温泉 湯畑' },
  { lat: 36.0990, lng: 137.8630, label: '奈良井宿 宿場町' },
  { lat: 36.6987, lng: 137.8587, label: '白馬 スキーリゾート周辺' },

  // ── 岐阜 ──
  { lat: 36.2570, lng: 136.9065, label: '白川郷 合掌集落' },
  { lat: 35.4406, lng: 136.7693, label: '岐阜城周辺' },
  { lat: 36.1399, lng: 137.2521, label: '高山 古い町並み' },
  { lat: 35.8072, lng: 137.2455, label: '下呂温泉 湯之島館周辺' },
  { lat: 35.7539, lng: 136.9665, label: '郡上八幡 城下町' },
  { lat: 35.3697, lng: 136.6194, label: '大垣城周辺' },
  { lat: 35.4826, lng: 136.7249, label: '岐阜 柳ヶ瀬商店街' },
  { lat: 35.3559, lng: 137.0527, label: '恵那峡 周辺' },

  // ── 静岡 ──
  { lat: 35.0969, lng: 139.0722, label: '熱海 駅前周辺' },
  { lat: 34.9776, lng: 138.3831, label: '静岡 駿府城公園' },
  { lat: 34.6872, lng: 137.7327, label: '浜松城周辺' },
  { lat: 34.9694, lng: 138.9267, label: '修善寺温泉 竹林の小径' },
  { lat: 35.1155, lng: 138.9182, label: '三嶋大社周辺' },
  { lat: 34.7692, lng: 138.0143, label: '掛川城周辺' },
  { lat: 34.6798, lng: 138.9426, label: '下田 ペリーロード' },
  { lat: 35.0919, lng: 138.8617, label: '沼津 港周辺' },
  { lat: 35.2212, lng: 138.6178, label: '富士宮 富士山本宮浅間大社' },
  { lat: 34.9654, lng: 139.1009, label: '伊東温泉 松川遊歩道' },

  // ── 愛知 ──
  { lat: 35.1855, lng: 136.8994, label: '名古屋城周辺' },
  { lat: 35.1709, lng: 136.8815, label: '名古屋 栄' },
  { lat: 35.3836, lng: 136.9289, label: '犬山城周辺' },
  { lat: 35.1270, lng: 136.9085, label: '熱田神宮周辺' },
  { lat: 34.9565, lng: 137.1627, label: '岡崎城周辺' },
  { lat: 34.8235, lng: 137.2177, label: '蒲郡 竹島周辺' },
  { lat: 34.7700, lng: 137.3916, label: '豊橋 市電沿線' },
  { lat: 35.3064, lng: 136.8003, label: '一宮 真清田神社周辺' },
  { lat: 34.8878, lng: 136.8393, label: '常滑 やきもの散歩道' },
  { lat: 35.1818, lng: 136.9077, label: '名古屋 大須観音周辺' },

  // ── 三重 ──
  { lat: 34.4553, lng: 136.7258, label: '伊勢神宮 内宮参道' },
  { lat: 34.4967, lng: 136.8447, label: '鳥羽 水族館周辺' },
  { lat: 33.9984, lng: 136.1706, label: '熊野古道 馬越峠周辺' },
  { lat: 34.5777, lng: 136.5270, label: '松阪 御城番屋敷周辺' },
  { lat: 34.7666, lng: 136.1317, label: '伊賀上野城周辺' },
  { lat: 34.4973, lng: 136.7873, label: '二見 夫婦岩周辺' },
  { lat: 34.3292, lng: 136.8333, label: '志摩 英虞湾周辺' },
  { lat: 33.7228, lng: 136.0138, label: '熊野市 鬼ケ城周辺' },

  // ── 滋賀 ──
  { lat: 35.2769, lng: 136.2533, label: '彦根城周辺' },
  { lat: 35.0045, lng: 135.8685, label: '近江八幡 水郷' },
  { lat: 35.3714, lng: 136.1295, label: '長浜城周辺' },
  { lat: 35.0721, lng: 135.8402, label: '比叡山 延暦寺周辺' },
  { lat: 35.0144, lng: 135.9604, label: '草津宿 本陣周辺' },
  { lat: 35.0045, lng: 135.8698, label: '大津 琵琶湖大橋周辺' },
  { lat: 34.8819, lng: 136.0062, label: '信楽 たぬき街道' },
  { lat: 35.1376, lng: 136.0607, label: '多賀大社周辺' },

  // ── 京都 ──
  { lat: 35.0116, lng: 135.7681, label: '京都 金閣寺周辺' },
  { lat: 34.9949, lng: 135.7850, label: '京都 祇園' },
  { lat: 34.9671, lng: 135.7727, label: '京都 伏見稲荷' },
  { lat: 35.0168, lng: 135.6772, label: '嵐山 竹林の道' },
  { lat: 34.9948, lng: 135.7851, label: '京都 清水寺周辺' },
  { lat: 35.0142, lng: 135.7481, label: '京都 二条城周辺' },
  { lat: 35.0239, lng: 135.7929, label: '京都 哲学の道' },
  { lat: 35.0051, lng: 135.7674, label: '京都 錦市場' },
  { lat: 34.8894, lng: 135.8082, label: '宇治 平等院周辺' },
  { lat: 35.5643, lng: 135.1828, label: '天橋立 周辺' },
  { lat: 34.9805, lng: 135.7478, label: '京都 東寺周辺' },
  { lat: 35.0252, lng: 135.7623, label: '京都御所周辺' },

  // ── 大阪 ──
  { lat: 34.6937, lng: 135.5023, label: '大阪城周辺' },
  { lat: 34.6727, lng: 135.5022, label: '道頓堀' },
  { lat: 34.7024, lng: 135.4959, label: '梅田' },
  { lat: 34.6525, lng: 135.5065, label: '大阪 通天閣周辺' },
  { lat: 34.6726, lng: 135.5010, label: '心斎橋周辺' },
  { lat: 34.6686, lng: 135.4985, label: '難波 戎橋' },
  { lat: 34.6122, lng: 135.4933, label: '住吉大社周辺' },
  { lat: 34.6556, lng: 135.4351, label: '天保山 海遊館周辺' },
  { lat: 34.6960, lng: 135.4986, label: '北新地周辺' },
  { lat: 34.6663, lng: 135.5381, label: '鶴橋 コリアタウン' },
  { lat: 34.5672, lng: 135.4870, label: '堺 仁徳天皇陵周辺' },
  { lat: 34.6514, lng: 135.5064, label: '新世界 周辺' },

  // ── 兵庫 ──
  { lat: 34.6901, lng: 135.1956, label: '神戸 三宮' },
  { lat: 34.8394, lng: 134.6939, label: '姫路城周辺' },
  { lat: 35.6218, lng: 134.8202, label: '城崎温泉 外湯めぐり' },
  { lat: 34.6994, lng: 135.1892, label: '神戸 北野異人館' },
  { lat: 34.7972, lng: 135.2471, label: '有馬温泉 金の湯周辺' },
  { lat: 34.6422, lng: 134.9978, label: '明石 時計台周辺' },
  { lat: 34.2974, lng: 134.7196, label: '淡路島 大鳴門橋周辺' },
  { lat: 34.7220, lng: 135.3617, label: '西宮 甲子園球場周辺' },
  { lat: 34.8003, lng: 135.3590, label: '宝塚 大劇場周辺' },
  { lat: 34.6872, lng: 135.1783, label: '神戸 南京町' },

  // ── 奈良 ──
  { lat: 34.6888, lng: 135.8399, label: '奈良 東大寺周辺' },
  { lat: 34.3749, lng: 135.8327, label: '吉野 桜並木周辺' },
  { lat: 34.5034, lng: 135.8327, label: '奈良 春日大社周辺' },
  { lat: 34.6148, lng: 135.7345, label: '法隆寺 参道' },
  { lat: 34.4619, lng: 135.8290, label: '飛鳥 石舞台古墳周辺' },
  { lat: 34.4948, lng: 135.7961, label: '橿原神宮周辺' },
  { lat: 34.6822, lng: 135.8370, label: '奈良 猿沢池周辺' },
  { lat: 34.5694, lng: 136.0395, label: '室生寺 参道' },

  // ── 和歌山 ──
  { lat: 34.2127, lng: 135.5856, label: '高野山 奥の院参道' },
  { lat: 33.7206, lng: 135.9941, label: '那智勝浦 熊野那智大社' },
  { lat: 33.5987, lng: 135.3676, label: '串本 橋杭岩周辺' },
  { lat: 33.6882, lng: 135.3568, label: '白浜 アドベンチャーワールド周辺' },
  { lat: 34.2264, lng: 135.1725, label: '和歌山城周辺' },
  { lat: 33.8464, lng: 135.7850, label: '熊野本宮大社 周辺' },
  { lat: 33.4336, lng: 135.7595, label: '潮岬 灯台周辺' },
  { lat: 34.1958, lng: 135.1594, label: '和歌山 和歌浦周辺' },

  // ── 鳥取 ──
  { lat: 35.5023, lng: 134.2353, label: '鳥取砂丘' },
  { lat: 35.4896, lng: 133.7057, label: '倉吉 白壁土蔵群' },
  { lat: 35.5001, lng: 134.2276, label: '鳥取 砂の美術館周辺' },
  { lat: 35.5448, lng: 133.2325, label: '境港 水木しげるロード' },
  { lat: 35.3760, lng: 133.8391, label: '三朝温泉 周辺' },
  { lat: 35.3671, lng: 133.5467, label: '大山 博労座周辺' },
  { lat: 35.4957, lng: 134.2365, label: '鳥取 砂丘センター周辺' },
  { lat: 35.3896, lng: 133.6966, label: '琴浦 赤碕漁港周辺' },

  // ── 島根 ──
  { lat: 35.4015, lng: 132.6851, label: '出雲大社周辺' },
  { lat: 35.4726, lng: 133.0508, label: '松江城周辺' },
  { lat: 35.1015, lng: 132.4269, label: '石見銀山 大森地区' },
  { lat: 35.4520, lng: 133.1009, label: '宍道湖 夕日スポット周辺' },
  { lat: 35.3893, lng: 133.0567, label: '足立美術館周辺' },
  { lat: 34.4686, lng: 131.7745, label: '津和野 殿町通り' },
  { lat: 35.4610, lng: 132.7100, label: '出雲 古代出雲歴史博物館周辺' },
  { lat: 35.5419, lng: 133.0750, label: '松江 小泉八雲記念館周辺' },

  // ── 岡山 ──
  { lat: 34.6674, lng: 133.9373, label: '岡山 後楽園周辺' },
  { lat: 34.5965, lng: 133.7721, label: '倉敷 美観地区' },
  { lat: 34.7586, lng: 134.3430, label: '津山城跡周辺' },
  { lat: 34.8094, lng: 133.5715, label: '備中松山城 城下町' },
  { lat: 34.6065, lng: 134.1508, label: '牛窓 オリーブ園周辺' },
  { lat: 35.2571, lng: 133.6869, label: '蒜山高原 周辺' },
  { lat: 34.5919, lng: 133.7649, label: '倉敷 アイビースクエア周辺' },
  { lat: 34.6618, lng: 133.9395, label: '岡山駅周辺' },

  // ── 広島 ──
  { lat: 34.3853, lng: 132.4553, label: '広島 原爆ドーム周辺' },
  { lat: 34.3948, lng: 132.3152, label: '宮島 厳島神社周辺' },
  { lat: 34.4073, lng: 133.2052, label: '尾道 千光寺山周辺' },
  { lat: 34.2414, lng: 132.5677, label: '呉 大和ミュージアム周辺' },
  { lat: 34.4868, lng: 133.3636, label: '福山城周辺' },
  { lat: 34.3395, lng: 132.9132, label: '竹原 町並み保存地区' },
  { lat: 34.3960, lng: 132.4586, label: '広島 平和記念公園' },
  { lat: 34.8062, lng: 132.8618, label: '三次 霧の海展望台周辺' },

  // ── 山口 ──
  { lat: 34.1534, lng: 132.1756, label: '錦帯橋周辺' },
  { lat: 33.9543, lng: 130.9434, label: '下関 唐戸市場周辺' },
  { lat: 34.4019, lng: 131.4652, label: '萩 城下町' },
  { lat: 34.3731, lng: 130.8691, label: '角島大橋 周辺' },
  { lat: 34.2311, lng: 131.2997, label: '秋吉台 カルスト台地' },
  { lat: 34.1863, lng: 131.4717, label: '山口 瑠璃光寺周辺' },
  { lat: 34.4527, lng: 131.0611, label: '長門 元乃隅神社周辺' },
  { lat: 33.9510, lng: 131.2464, label: '宇部 ときわ公園周辺' },

  // ── 徳島 ──
  { lat: 34.2156, lng: 134.6372, label: '鳴門 渦の道周辺' },
  { lat: 34.0712, lng: 134.5594, label: '徳島駅周辺' },
  { lat: 33.8631, lng: 133.9125, label: '祖谷 かずら橋周辺' },
  { lat: 33.8820, lng: 133.8683, label: '大歩危峡 周辺' },
  { lat: 34.0623, lng: 134.1819, label: '脇町 うだつの町並み' },
  { lat: 33.9591, lng: 134.5847, label: '阿南 海陽町 海岸' },
  { lat: 34.1282, lng: 134.6143, label: '鳴門 大鳴門橋周辺' },
  { lat: 34.0795, lng: 134.5557, label: '徳島 阿波踊り会館周辺' },

  // ── 香川 ──
  { lat: 34.1849, lng: 133.8181, label: '金刀比羅宮 参道' },
  { lat: 34.3494, lng: 134.0465, label: '高松城周辺' },
  { lat: 34.3181, lng: 134.0464, label: '高松 栗林公園周辺' },
  { lat: 34.4839, lng: 134.2272, label: '小豆島 エンジェルロード周辺' },
  { lat: 34.2858, lng: 133.7962, label: '丸亀城周辺' },
  { lat: 34.2292, lng: 133.7756, label: '善通寺 周辺' },
  { lat: 34.4583, lng: 133.9942, label: '直島 地中美術館周辺' },
  { lat: 34.3530, lng: 134.0501, label: '高松 中央商店街' },

  // ── 愛媛 ──
  { lat: 33.8514, lng: 132.7878, label: '道後温泉 本館周辺' },
  { lat: 33.8456, lng: 132.7658, label: '松山城周辺' },
  { lat: 33.5419, lng: 132.5676, label: '内子 八日市護国の町並み' },
  { lat: 34.0657, lng: 133.0053, label: '今治城周辺' },
  { lat: 33.2220, lng: 132.5554, label: '宇和島城周辺' },
  { lat: 33.5029, lng: 132.5472, label: '大洲城周辺' },
  { lat: 34.0743, lng: 133.0029, label: 'しまなみ海道 来島海峡大橋展望台' },
  { lat: 33.3611, lng: 132.5172, label: '西予 卯之町の町並み' },

  // ── 高知 ──
  { lat: 33.5596, lng: 133.5311, label: '高知城周辺' },
  { lat: 33.5005, lng: 133.5716, label: '桂浜周辺' },
  { lat: 33.2129, lng: 132.9682, label: '四万十川 沈下橋周辺' },
  { lat: 33.5602, lng: 133.5297, label: '高知 龍馬の生まれた町周辺' },
  { lat: 33.2437, lng: 134.1537, label: '室戸岬 周辺' },
  { lat: 32.7295, lng: 132.9720, label: '足摺岬 周辺' },
  { lat: 33.5519, lng: 133.5380, label: '高知 ひろめ市場周辺' },
  { lat: 33.5003, lng: 133.9017, label: '安芸 野良時計周辺' },

  // ── 福岡 ──
  { lat: 33.5904, lng: 130.4017, label: '福岡 天神周辺' },
  { lat: 33.5553, lng: 130.3788, label: '太宰府天満宮周辺' },
  { lat: 33.8826, lng: 130.8792, label: '門司港 レトロ地区' },
  { lat: 33.5896, lng: 130.4208, label: '博多駅周辺' },
  { lat: 33.5560, lng: 130.1809, label: '糸島 二見ヶ浦周辺' },
  { lat: 33.1638, lng: 130.4049, label: '柳川 川下り乗り場' },
  { lat: 33.8833, lng: 130.8748, label: '北九州 小倉城周辺' },
  { lat: 33.5937, lng: 130.3594, label: '博多 中洲川端周辺' },
  { lat: 33.5836, lng: 130.4282, label: '博多 キャナルシティ周辺' },
  { lat: 33.6461, lng: 130.6913, label: '飯塚 嘉穂劇場周辺' },

  // ── 佐賀 ──
  { lat: 33.3217, lng: 130.3949, label: '吉野ヶ里遺跡周辺' },
  { lat: 33.4603, lng: 129.9684, label: '唐津城周辺' },
  { lat: 33.1847, lng: 129.8709, label: '有田 陶器市通り' },
  { lat: 33.1910, lng: 130.0167, label: '武雄温泉 楼門周辺' },
  { lat: 33.0978, lng: 130.0904, label: '嬉野温泉 湯宿広場周辺' },
  { lat: 33.2438, lng: 130.2972, label: '佐賀城本丸歴史館周辺' },
  { lat: 33.4519, lng: 130.0082, label: '唐津 虹の松原' },
  { lat: 33.3629, lng: 129.8726, label: '呼子 朝市周辺' },

  // ── 長崎 ──
  { lat: 32.7503, lng: 129.8779, label: '長崎 平和公園' },
  { lat: 32.7448, lng: 129.8734, label: '長崎 出島周辺' },
  { lat: 33.1017, lng: 129.8692, label: 'ハウステンボス周辺' },
  { lat: 32.7368, lng: 129.8673, label: '長崎 大浦天主堂周辺' },
  { lat: 32.7533, lng: 130.2740, label: '雲仙温泉 周辺' },
  { lat: 33.3671, lng: 129.5528, label: '平戸城周辺' },
  { lat: 32.7480, lng: 129.8811, label: '長崎 グラバー園周辺' },
  { lat: 32.6884, lng: 129.8754, label: '長崎 稲佐山展望台周辺' },

  // ── 熊本 ──
  { lat: 32.8066, lng: 130.7056, label: '熊本城周辺' },
  { lat: 32.8827, lng: 131.1044, label: '阿蘇 草千里周辺' },
  { lat: 32.4649, lng: 130.1875, label: '天草 崎津集落周辺' },
  { lat: 33.0517, lng: 131.0853, label: '黒川温泉 周辺' },
  { lat: 32.7908, lng: 130.7254, label: '水前寺成趣園周辺' },
  { lat: 32.2124, lng: 130.7608, label: '人吉城跡周辺' },
  { lat: 32.8079, lng: 130.7072, label: '熊本 上通アーケード' },
  { lat: 32.9910, lng: 131.0879, label: '産山村 池山水源周辺' },

  // ── 大分 ──
  { lat: 33.2840, lng: 131.4888, label: '別府温泉 地獄めぐり周辺' },
  { lat: 33.2562, lng: 131.3612, label: '湯布院 湯の坪街道' },
  { lat: 33.5815, lng: 131.4040, label: '耶馬渓 青の洞門周辺' },
  { lat: 33.5989, lng: 131.1905, label: '中津城周辺' },
  { lat: 33.1175, lng: 131.8062, label: '臼杵石仏 周辺' },
  { lat: 33.2382, lng: 131.6126, label: '大分市 府内城周辺' },
  { lat: 33.4090, lng: 131.6162, label: '杵築城 城下町' },
  { lat: 32.9726, lng: 131.3916, label: '豊後竹田 岡城跡' },

  // ── 宮崎 ──
  { lat: 31.9418, lng: 131.4239, label: '宮崎神宮周辺' },
  { lat: 32.7093, lng: 131.3040, label: '高千穂峡周辺' },
  { lat: 31.5818, lng: 131.6617, label: '日南海岸 鬼の洗濯板周辺' },
  { lat: 31.8597, lng: 131.4738, label: '青島神社周辺' },
  { lat: 31.4094, lng: 131.0675, label: '都井岬 周辺' },
  { lat: 31.6451, lng: 131.4039, label: '飫肥城 城下町' },
  { lat: 31.9108, lng: 131.4234, label: '宮崎 橘通り' },
  { lat: 32.4199, lng: 131.6643, label: '延岡 城山公園周辺' },

  // ── 鹿児島 ──
  { lat: 31.5966, lng: 130.5571, label: '鹿児島 城山' },
  { lat: 31.7791, lng: 130.7215, label: '霧島神宮周辺' },
  { lat: 31.2438, lng: 130.6520, label: '指宿 砂むし温泉周辺' },
  { lat: 31.5806, lng: 130.6575, label: '桜島 溶岩なぎさ公園' },
  { lat: 31.3634, lng: 130.4346, label: '知覧 特攻平和会館周辺' },
  { lat: 28.3796, lng: 129.4939, label: '奄美大島 奄美市街周辺' },
  { lat: 30.3556, lng: 130.5406, label: '屋久島 ヤクスギランド周辺' },
  { lat: 31.5974, lng: 130.5584, label: '鹿児島 天文館通り' },

  // ── 沖縄 ──
  { lat: 26.2123, lng: 127.6792, label: '那覇 国際通り' },
  { lat: 26.4588, lng: 127.9294, label: '美ら海水族館周辺' },
  { lat: 26.1963, lng: 127.7129, label: '首里城周辺' },
  { lat: 24.3377, lng: 124.1568, label: '石垣島 川平湾周辺' },
  { lat: 24.8057, lng: 125.2812, label: '宮古島 市街周辺' },
  { lat: 24.3253, lng: 124.0931, label: '竹富島 集落' },
  { lat: 26.5085, lng: 127.8624, label: '沖縄 万座毛周辺' },
  { lat: 26.2178, lng: 127.6873, label: '那覇 牧志公設市場周辺' },
  { lat: 26.3986, lng: 127.8560, label: '沖縄 琉球村周辺' },
  { lat: 26.5977, lng: 128.0392, label: '名護 市街周辺' },
];

// ========== 世界チャレンジ 出題座標リスト（150か所） ==========
const WORLD_LOCATIONS = [
  // ── ヨーロッパ：フランス ──
  { lat: 48.8530,  lng: 2.3499,   label: 'エッフェル塔（フランス）' },
  { lat: 48.8606,  lng: 2.3376,   label: 'ルーブル美術館（フランス）' },
  { lat: 48.8049,  lng: 2.1204,   label: 'ヴェルサイユ宮殿（フランス）' },
  { lat: 43.7102,  lng: 7.2620,   label: 'ニース海岸（フランス）' },
  { lat: 43.2965,  lng: 5.3698,   label: 'マルセイユ（フランス）' },

  // ── ヨーロッパ：イタリア ──
  { lat: 41.8902,  lng: 12.4922,  label: 'コロッセオ（イタリア）' },
  { lat: 43.7230,  lng: 10.3966,  label: 'ピサの斜塔（イタリア）' },
  { lat: 45.4341,  lng: 12.3388,  label: 'ヴェネツィア運河（イタリア）' },
  { lat: 41.9029,  lng: 12.4534,  label: 'バチカン市国（イタリア）' },
  { lat: 43.7696,  lng: 11.2558,  label: 'フィレンツェ（イタリア）' },
  { lat: 40.8518,  lng: 14.2681,  label: 'ナポリ（イタリア）' },
  { lat: 37.5079,  lng: 15.0830,  label: 'カターニア（シチリア・イタリア）' },

  // ── ヨーロッパ：スペイン・ポルトガル ──
  { lat: 41.4036,  lng: 2.1744,   label: 'サグラダ・ファミリア（スペイン）' },
  { lat: 37.1760,  lng: -3.5881,  label: 'アルハンブラ宮殿（スペイン）' },
  { lat: 40.4168,  lng: -3.7038,  label: 'マドリード（スペイン）' },
  { lat: 37.3861,  lng: -5.9925,  label: 'セビリア（スペイン）' },
  { lat: 39.4699,  lng: -0.3763,  label: 'バレンシア（スペイン）' },
  { lat: 38.7223,  lng: -9.1393,  label: 'リスボン（ポルトガル）' },
  { lat: 41.1579,  lng: -8.6291,  label: 'ポルト（ポルトガル）' },

  // ── ヨーロッパ：イギリス・アイルランド ──
  { lat: 51.5007,  lng: -0.1246,  label: 'ビッグベン（イギリス）' },
  { lat: 55.9486,  lng: -3.1999,  label: 'エジンバラ城（イギリス）' },
  { lat: 51.1789,  lng: -1.8262,  label: 'ストーンヘンジ（イギリス）' },
  { lat: 53.4808,  lng: -2.2426,  label: 'マンチェスター（イギリス）' },
  { lat: 53.3498,  lng: -6.2603,  label: 'ダブリン（アイルランド）' },

  // ── ヨーロッパ：中欧 ──
  { lat: 50.0755,  lng: 14.4378,  label: 'プラハ旧市街（チェコ）' },
  { lat: 48.2082,  lng: 16.3738,  label: 'ウィーン（オーストリア）' },
  { lat: 47.5576,  lng: 13.6493,  label: 'ハルシュタット（オーストリア）' },
  { lat: 47.8107,  lng: 13.0550,  label: 'ザルツブルク（オーストリア）' },
  { lat: 47.4979,  lng: 19.0402,  label: 'ブダペスト（ハンガリー）' },
  { lat: 48.1486,  lng: 17.1077,  label: 'ブラチスラバ（スロバキア）' },
  { lat: 50.0647,  lng: 19.9450,  label: 'クラクフ（ポーランド）' },
  { lat: 52.2297,  lng: 21.0122,  label: 'ワルシャワ（ポーランド）' },

  // ── ヨーロッパ：ドイツ・スイス・オランダ ──
  { lat: 52.5200,  lng: 13.4050,  label: 'ベルリン（ドイツ）' },
  { lat: 48.1351,  lng: 11.5820,  label: 'ミュンヘン（ドイツ）' },
  { lat: 50.9413,  lng: 6.9583,   label: 'ケルン大聖堂（ドイツ）' },
  { lat: 47.6553,  lng: 10.7395,  label: 'ノイシュバンシュタイン城（ドイツ）' },
  { lat: 46.9480,  lng: 7.4474,   label: 'ベルン（スイス）' },
  { lat: 46.2044,  lng: 6.1432,   label: 'ジュネーブ（スイス）' },
  { lat: 47.3769,  lng: 8.5417,   label: 'チューリッヒ（スイス）' },
  { lat: 52.3731,  lng: 4.8922,   label: 'アムステルダム（オランダ）' },
  { lat: 50.8503,  lng: 4.3517,   label: 'ブリュッセル（ベルギー）' },
  { lat: 51.2093,  lng: 3.2247,   label: 'ブルッヘ（ベルギー）' },

  // ── ヨーロッパ：北欧 ──
  { lat: 55.6761,  lng: 12.5683,  label: 'コペンハーゲン（デンマーク）' },
  { lat: 59.3293,  lng: 18.0686,  label: 'ストックホルム（スウェーデン）' },
  { lat: 59.9139,  lng: 10.7522,  label: 'オスロ（ノルウェー）' },
  { lat: 60.3913,  lng: 5.3221,   label: 'ベルゲン（ノルウェー）' },
  { lat: 60.1699,  lng: 24.9384,  label: 'ヘルシンキ（フィンランド）' },
  { lat: 64.1466,  lng: -21.9426, label: 'レイキャビク（アイスランド）' },
  { lat: 70.6632,  lng: 23.6821,  label: 'トロムソ（ノルウェー）' },

  // ── ヨーロッパ：南東欧・ギリシャ ──
  { lat: 36.3932,  lng: 25.4615,  label: 'サントリーニ島（ギリシャ）' },
  { lat: 37.9715,  lng: 23.7267,  label: 'パルテノン神殿（ギリシャ）' },
  { lat: 40.6401,  lng: 22.9444,  label: 'テッサロニキ（ギリシャ）' },
  { lat: 42.6507,  lng: 18.0944,  label: 'ドゥブロヴニク旧市街（クロアチア）' },
  { lat: 43.5081,  lng: 16.4402,  label: 'スプリト（クロアチア）' },
  { lat: 44.8176,  lng: 20.4569,  label: 'ベオグラード（セルビア）' },
  { lat: 42.6977,  lng: 23.3219,  label: 'ソフィア（ブルガリア）' },
  { lat: 44.4268,  lng: 26.1025,  label: 'ブカレスト（ルーマニア）' },
  { lat: 59.4370,  lng: 24.7536,  label: 'タリン（エストニア）' },
  { lat: 54.6872,  lng: 25.2797,  label: 'ヴィリニュス（リトアニア）' },

  // ── ロシア ──
  { lat: 55.7539,  lng: 37.6208,  label: '赤の広場（ロシア）' },
  { lat: 59.9343,  lng: 30.3351,  label: 'サンクトペテルブルク（ロシア）' },

  // ── アメリカ合衆国 ──
  { lat: 40.7580,  lng: -73.9855, label: 'タイムズスクエア（アメリカ）' },
  { lat: 40.7484,  lng: -73.9967, label: 'エンパイアステートビル（アメリカ）' },
  { lat: 40.6892,  lng: -74.0445, label: '自由の女神（アメリカ）' },
  { lat: 37.8199,  lng: -122.4783,label: 'ゴールデンゲートブリッジ（アメリカ）' },
  { lat: 34.0195,  lng: -118.4912,label: 'サンタモニカ（アメリカ）' },
  { lat: 38.8895,  lng: -77.0353, label: 'リンカーン記念堂（アメリカ）' },
  { lat: 29.9511,  lng: -90.0715, label: 'ニューオーリンズ（アメリカ）' },
  { lat: 36.1147,  lng: -115.1728,label: 'ラスベガス（アメリカ）' },
  { lat: 41.8827,  lng: -87.6233, label: 'シカゴ（アメリカ）' },
  { lat: 25.7617,  lng: -80.1918, label: 'マイアミビーチ（アメリカ）' },
  { lat: 47.6062,  lng: -122.3321,label: 'シアトル（アメリカ）' },
  { lat: 42.3601,  lng: -71.0589, label: 'ボストン（アメリカ）' },
  { lat: 29.7604,  lng: -95.3698, label: 'ヒューストン（アメリカ）' },
  { lat: 30.2672,  lng: -97.7431, label: 'オースティン（アメリカ）' },

  // ── カナダ ──
  { lat: 43.0896,  lng: -79.0849, label: 'ナイアガラの滝（カナダ）' },
  { lat: 45.5017,  lng: -73.5673, label: 'モントリオール（カナダ）' },
  { lat: 43.6532,  lng: -79.3832, label: 'トロント（カナダ）' },
  { lat: 49.2827,  lng: -123.1207,label: 'バンクーバー（カナダ）' },
  { lat: 46.8139,  lng: -71.2080, label: 'ケベックシティ（カナダ）' },

  // ── 中南米 ──
  { lat: -22.9068, lng: -43.1729, label: 'コルコバードの丘（ブラジル）' },
  { lat: -23.5505, lng: -46.6333, label: 'サンパウロ（ブラジル）' },
  { lat: -34.6037, lng: -58.3816, label: 'ブエノスアイレス（アルゼンチン）' },
  { lat: -33.4489, lng: -70.6693, label: 'サンティアゴ（チリ）' },
  { lat: 19.4326,  lng: -99.1332, label: 'メキシコシティ（メキシコ）' },
  { lat: 20.6843,  lng: -88.5678, label: 'チチェン・イッツァ（メキシコ）' },
  { lat: -13.1631, lng: -72.5450, label: 'マチュピチュ（ペルー）' },
  { lat: -12.0464, lng: -77.0428, label: 'リマ（ペルー）' },
  { lat: 23.1136,  lng: -82.3666, label: 'ハバナ（キューバ）' },
  { lat: 4.7110,   lng: -74.0721, label: 'ボゴタ（コロンビア）' },
  { lat: 6.2442,   lng: -75.5812, label: 'メデジン（コロンビア）' },
  { lat: 8.9824,   lng: -79.5199, label: 'パナマシティ（パナマ）' },
  { lat: 9.9281,   lng: -84.0907, label: 'サンホセ（コスタリカ）' },

  // ── アジア：東アジア ──
  { lat: 40.4319,  lng: 116.5704, label: '万里の長城（中国）' },
  { lat: 39.9163,  lng: 116.3972, label: '天安門広場（中国）' },
  { lat: 31.2304,  lng: 121.4737, label: '上海（中国）' },
  { lat: 22.2855,  lng: 114.1577, label: '香港（中国）' },
  { lat: 22.1987,  lng: 113.5439, label: 'マカオ（中国）' },
  { lat: 30.5728,  lng: 104.0668, label: '成都（中国）' },
  { lat: 34.3416,  lng: 108.9398, label: '西安（中国）' },
  { lat: 25.0330,  lng: 121.5654, label: '台北（台湾）' },
  { lat: 37.5665,  lng: 126.9780, label: 'ソウル（韓国）' },
  { lat: 35.1796,  lng: 129.0756, label: '釜山（韓国）' },

  // ── アジア：東南アジア ──
  { lat: 13.7563,  lng: 100.5018, label: 'バンコク（タイ）' },
  { lat: 13.4125,  lng: 103.8670, label: 'アンコールワット（カンボジア）' },
  { lat: 21.0285,  lng: 105.8542, label: 'ハノイ（ベトナム）' },
  { lat: 10.8231,  lng: 106.6297, label: 'ホーチミン（ベトナム）' },
  { lat: 15.8801,  lng: 108.3380, label: 'ホイアン（ベトナム）' },
  { lat: 1.2894,   lng: 103.8500, label: 'マーライオン（シンガポール）' },
  { lat: 3.1390,   lng: 101.6869, label: 'クアラルンプール（マレーシア）' },
  { lat: -8.4095,  lng: 115.1889, label: 'バリ島（インドネシア）' },
  { lat: -6.2088,  lng: 106.8456, label: 'ジャカルタ（インドネシア）' },
  { lat: 14.5995,  lng: 120.9842, label: 'マニラ（フィリピン）' },
  { lat: 16.8661,  lng: 96.1951,  label: 'ヤンゴン（ミャンマー）' },

  // ── アジア：南アジア・中東 ──
  { lat: 27.1751,  lng: 78.0421,  label: 'タージマハル（インド）' },
  { lat: 28.6139,  lng: 77.2090,  label: 'ニューデリー（インド）' },
  { lat: 18.9220,  lng: 72.8347,  label: 'ムンバイ（インド）' },
  { lat: 27.7172,  lng: 85.3240,  label: 'カトマンズ（ネパール）' },
  { lat: 6.9271,   lng: 79.8612,  label: 'コロンボ（スリランカ）' },
  { lat: 25.1972,  lng: 55.2744,  label: 'ブルジュ・ハリファ（UAE）' },
  { lat: 26.2235,  lng: 50.5876,  label: 'マナーマ（バーレーン）' },
  { lat: 41.0082,  lng: 28.9784,  label: 'イスタンブール（トルコ）' },
  { lat: 39.9208,  lng: 32.8541,  label: 'アンカラ（トルコ）' },
  { lat: 30.3285,  lng: 35.4444,  label: 'ペトラ（ヨルダン）' },
  { lat: 31.7683,  lng: 35.2137,  label: 'エルサレム（イスラエル）' },
  { lat: 32.0853,  lng: 34.7818,  label: 'テルアビブ（イスラエル）' },
  { lat: 41.6938,  lng: 44.8015,  label: 'トビリシ（ジョージア）' },
  { lat: 40.4093,  lng: 49.8671,  label: 'バクー（アゼルバイジャン）' },

  // ── アフリカ ──
  { lat: 30.0444,  lng: 31.2357,  label: 'カイロ（エジプト）' },
  { lat: 29.9792,  lng: 31.1342,  label: 'ギザのピラミッド（エジプト）' },
  { lat: 31.6295,  lng: -7.9811,  label: 'マラケシュ（モロッコ）' },
  { lat: 33.5731,  lng: -7.5898,  label: 'カサブランカ（モロッコ）' },
  { lat: 36.8065,  lng: 10.1815,  label: 'チュニス（チュニジア）' },
  { lat: -33.9249, lng: 18.4241,  label: 'ケープタウン（南アフリカ）' },
  { lat: -26.2041, lng: 28.0473,  label: 'ヨハネスブルク（南アフリカ）' },
  { lat: -1.2921,  lng: 36.8219,  label: 'ナイロビ（ケニア）' },
  { lat: -6.7924,  lng: 39.2083,  label: 'ダルエスサラーム（タンザニア）' },
  { lat: -17.9243, lng: 25.8572,  label: 'ヴィクトリアの滝（ザンビア）' },
  { lat: 5.5600,   lng: -0.2057,  label: 'アクラ（ガーナ）' },
  { lat: 14.6937,  lng: -17.4441, label: 'ダカール（セネガル）' },

  // ── オセアニア ──
  { lat: -33.8568, lng: 151.2153, label: 'シドニー・オペラハウス（オーストラリア）' },
  { lat: -37.8136, lng: 144.9631, label: 'メルボルン（オーストラリア）' },
  { lat: -27.4698, lng: 153.0251, label: 'ブリスベン（オーストラリア）' },
  { lat: -31.9505, lng: 115.8605, label: 'パース（オーストラリア）' },
  { lat: -36.8485, lng: 174.7633, label: 'オークランド（ニュージーランド）' },
  { lat: -45.0312, lng: 168.6626, label: 'クイーンズタウン（ニュージーランド）' },
  { lat: -43.5321, lng: 172.6362, label: 'クライストチャーチ（ニュージーランド）' },
];

// ========== カスタムエリア（学校・地域指定） ==========
// searchRadius: その地点周辺の何m以内でStreetViewを探すか（港・海の多い地域は小さめに）
const CUSTOM_REGIONS = {
  chikko: {
    name: '築港エリア（大阪港〜弁天町）',
    north: 34.675, south: 34.636, east: 135.473, west: 135.420,
    searchRadius: 1500,
  },
};

// ========== 都道府県バウンディングボックス ==========
const PREFECTURES = {
  hokkaido:  { name: '北海道', north: 45.5, south: 41.4, east: 145.8, west: 139.3 },
  aomori:    { name: '青森県', north: 41.6, south: 40.2, east: 141.7, west: 139.8 },
  iwate:     { name: '岩手県', north: 40.5, south: 38.7, east: 142.1, west: 140.6 },
  miyagi:    { name: '宮城県', north: 38.9, south: 37.8, east: 141.7, west: 140.2 },
  akita:     { name: '秋田県', north: 40.5, south: 39.0, east: 140.9, west: 139.7 },
  yamagata:  { name: '山形県', north: 39.0, south: 37.8, east: 140.6, west: 139.8 },
  fukushima: { name: '福島県', north: 37.9, south: 36.8, east: 141.1, west: 139.1 },
  ibaraki:   { name: '茨城県', north: 36.8, south: 35.7, east: 140.9, west: 139.7 },
  tochigi:   { name: '栃木県', north: 37.1, south: 36.2, east: 140.3, west: 139.3 },
  gunma:     { name: '群馬県', north: 36.9, south: 36.1, east: 139.5, west: 138.4 },
  saitama:   { name: '埼玉県', north: 36.3, south: 35.8, east: 139.9, west: 138.7 },
  chiba:     { name: '千葉県', north: 35.9, south: 34.9, east: 140.9, west: 139.7 },
  tokyo:     { name: '東京都', north: 35.9, south: 35.5, east: 139.9, west: 138.9 },
  kanagawa:  { name: '神奈川県', north: 35.7, south: 35.1, east: 139.7, west: 139.0 },
  niigata:   { name: '新潟県', north: 38.5, south: 36.8, east: 139.6, west: 137.6 },
  toyama:    { name: '富山県', north: 36.8, south: 36.4, east: 137.7, west: 136.7 },
  ishikawa:  { name: '石川県', north: 37.8, south: 36.2, east: 137.1, west: 136.2 },
  fukui:     { name: '福井県', north: 36.3, south: 35.4, east: 136.8, west: 135.9 },
  yamanashi: { name: '山梨県', north: 35.9, south: 35.2, east: 139.2, west: 138.3 },
  nagano:    { name: '長野県', north: 36.7, south: 35.2, east: 138.6, west: 137.3 },
  shizuoka:  { name: '静岡県', north: 35.5, south: 34.6, east: 139.1, west: 137.5 },
  aichi:     { name: '愛知県', north: 35.4, south: 34.5, east: 137.8, west: 136.7 },
  mie:       { name: '三重県', north: 35.0, south: 33.7, east: 136.8, west: 135.9 },
  shiga:     { name: '滋賀県', north: 35.7, south: 34.8, east: 136.3, west: 135.8 },
  kyoto:     { name: '京都府', north: 35.7, south: 34.7, east: 135.9, west: 134.9 },
  osaka:     { name: '大阪府', north: 34.9, south: 34.3, east: 135.7, west: 135.1 },
  hyogo:     { name: '兵庫県', north: 35.7, south: 34.1, east: 135.5, west: 134.2 },
  nara:      { name: '奈良県', north: 34.7, south: 33.9, east: 136.2, west: 135.6 },
  wakayama:  { name: '和歌山県', north: 34.3, south: 33.4, east: 136.0, west: 135.0 },
  tottori:   { name: '鳥取県', north: 35.6, south: 35.0, east: 134.5, west: 133.2 },
  shimane:   { name: '島根県', north: 35.5, south: 34.3, east: 133.3, west: 131.7 },
  okayama:   { name: '岡山県', north: 35.2, south: 34.5, east: 134.4, west: 133.2 },
  hiroshima: { name: '広島県', north: 34.9, south: 33.9, east: 133.3, west: 131.8 },
  yamaguchi: { name: '山口県', north: 34.5, south: 33.7, east: 132.1, west: 130.6 },
  tokushima: { name: '徳島県', north: 34.2, south: 33.4, east: 134.8, west: 133.7 },
  kagawa:    { name: '香川県', north: 34.4, south: 33.9, east: 134.3, west: 133.5 },
  ehime:     { name: '愛媛県', north: 34.1, south: 32.9, east: 133.7, west: 132.0 },
  kochi:     { name: '高知県', north: 33.9, south: 32.7, east: 134.3, west: 132.5 },
  fukuoka:   { name: '福岡県', north: 33.9, south: 33.1, east: 131.2, west: 130.0 },
  saga:      { name: '佐賀県', north: 33.6, south: 33.0, east: 130.5, west: 129.7 },
  nagasaki:  { name: '長崎県', north: 33.5, south: 32.1, east: 130.4, west: 128.5 },
  kumamoto:  { name: '熊本県', north: 33.2, south: 32.0, east: 131.3, west: 130.0 },
  oita:      { name: '大分県', north: 33.7, south: 32.7, east: 132.1, west: 130.9 },
  miyazaki:  { name: '宮崎県', north: 32.8, south: 31.4, east: 131.9, west: 130.7 },
  kagoshima: { name: '鹿児島県', north: 32.3, south: 30.1, east: 131.3, west: 129.3 },
  okinawa:   { name: '沖縄県', north: 26.9, south: 24.0, east: 128.3, west: 122.9 },
};

// ========== ランダムネーム自動生成 ==========
const HANDLE_COLORS  = ['赤い', '青い', '黄色い', '緑の', '白い', '黒い', '紫の', 'オレンジの', 'ピンクの', '水色の'];
const HANDLE_ANIMALS = ['ライオン', 'パンダ', 'カバ', 'キリン', 'ゾウ', 'トラ', 'シマウマ', 'コアラ', 'ペンギン', 'イルカ',
                        'サル', 'ウサギ', 'キツネ', 'オオカミ', 'タヌキ', 'クマ', 'ネコ', 'イヌ', 'ウマ', 'ヒョウ'];

function generateHandle() {
  const c = HANDLE_COLORS[Math.floor(Math.random() * HANDLE_COLORS.length)];
  const a = HANDLE_ANIMALS[Math.floor(Math.random() * HANDLE_ANIMALS.length)];
  return c + a;
}

// 端末ごとに固定のランダムネームを返す（初回のみ生成してlocalStorageに保存）
function getOrCreateHandle() {
  let h = localStorage.getItem('player_handle');
  if (!h) {
    h = generateHandle();
    localStorage.setItem('player_handle', h);
  }
  return h;
}

// ========== 状態 ==========
let panorama, answerMap, answerMarker, resultMap, svService;
let playerName = '';
let currentMode = 'japan'; // 'japan' | 'local' | 'world'
let currentPrefKey = '';
let currentRound = 0;
let currentLocation = null; // { lat, lng } または LatLng
let currentLocationLabel = ''; // 世界モード用：正解地名
let startLocation = null;  // スタート地点（戻るボタン用）
let startPov = null;       // スタート時のカメラ角度（戻るボタン用）
let totalScore = 0;
let roundOrder = [];
let usedLocationIndices = new Set(); // 使用済み場所インデックス（重複防止）
let candidatePool = []; // ゲーム開始時にシャッフル済みのインデックスプール
let localPanoramas = []; // 地元モードで収集した座標

// ========== 画面切り替え ==========
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // StreetViewのWebGLテクスチャが崩れないようにリサイズを通知
  if (id === 'screen-game' && panorama) {
    setTimeout(() => google.maps.event.trigger(panorama, 'resize'), 50);
  }
}

// ========== Google Maps API 初期化コールバック ==========
window.initGame = function () {
  svService = new google.maps.StreetViewService();

  // タイトル → ランダムネーム確認画面
  document.getElementById('btn-to-name').addEventListener('click', () => {
    playerName = getOrCreateHandle();
    document.getElementById('handle-display').textContent = playerName;
    showScreen('screen-login');
  });

  // ランダムネーム確認画面
  document.getElementById('btn-handle-ok').addEventListener('click', () => {
    showScreen('screen-mode');
  });
  document.getElementById('btn-handle-reset').addEventListener('click', () => {
    const h = generateHandle();
    localStorage.setItem('player_handle', h);
    playerName = h;
    document.getElementById('handle-display').textContent = h;
  });
  document.getElementById('btn-handle-back').addEventListener('click', () => showScreen('screen-title'));

  // タイトル → ランキング確認
  document.getElementById('btn-view-ranking').addEventListener('click', () => showRanking('nationwide', true));

  // モード選択
  document.getElementById('mode-japan').addEventListener('click', () => {
    selectMode('japan');
    startGame();
  });

  document.getElementById('mode-local').addEventListener('click', () => {
    selectMode('local');
    currentPrefKey = 'chikko';
    startGame();
  });

  document.getElementById('mode-world').addEventListener('click', () => {
    selectMode('world');
    startGame();
  });

  // ゲーム内
  document.getElementById('btn-submit').addEventListener('click', onSubmit);

  // フルスクリーン
  const btnFs = document.getElementById('btn-fullscreen');
  btnFs.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
  document.addEventListener('fullscreenchange', () => {
    btnFs.textContent = document.fullscreenElement ? '✕' : '⛶';
    btnFs.title       = document.fullscreenElement ? 'フルスクリーン解除' : 'フルスクリーン';
    if (panorama) setTimeout(() => google.maps.event.trigger(panorama, 'resize'), 100);
  });

  document.getElementById('btn-return-start').addEventListener('click', () => {
    if (startLocation && startPov) {
      panorama.setPosition(startLocation);
      panorama.setPov(startPov);
    }
  });

  // 結果画面
  document.getElementById('btn-next').addEventListener('click', nextRound);

  // 最終結果
  document.getElementById('btn-submit-score').addEventListener('click', submitScore);
  document.getElementById('btn-skip-score').addEventListener('click', () => {
    const tab = currentMode === 'local' ? 'local' : currentMode === 'world' ? 'world' : 'nationwide';
    showRanking(tab);
  });

  // ランキング画面
  document.getElementById('btn-retry').addEventListener('click', () => {
    resetGame();
    showScreen('screen-mode');
  });
  document.getElementById('btn-back-title').addEventListener('click', () => {
    resetGame();
    showScreen('screen-title');
  });
};

// ========== モード選択UI ==========
function selectMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  const cardId = mode === 'japan' ? 'mode-japan' : mode === 'world' ? 'mode-world' : 'mode-local';
  document.getElementById(cardId).classList.add('selected');
  if (mode !== 'local') {
    document.getElementById('pref-selector').classList.add('hidden');
  }
}

// ========== ゲーム開始 ==========
function startGame() {
  totalScore = 0;
  currentRound = 0;
  localPanoramas = [];

  initMaps();
  updateHeader();

  if (currentMode === 'local') {
    // 地元モード：先に全問分のパノラマを探す
    showScreen('screen-loading');
    collectLocalPanoramas(0);
  } else {
    const locs = currentMode === 'world' ? WORLD_LOCATIONS : LOCATIONS;
    usedLocationIndices = new Set();
    // ゲーム開始時に全場所をシャッフルしてプール化（順番に取り出すことで偏りをなくす）
    candidatePool = shuffled([...Array(locs.length).keys()]);
    showScreen('screen-game');
    loadRound();
  }
}

// ========== 地元モード：パノラマをN問分収集 ==========
function collectLocalPanoramas(count) {
  if (count >= TOTAL_ROUNDS) {
    showScreen('screen-game');
    loadRound();
    return;
  }
  const region = CUSTOM_REGIONS[currentPrefKey] || PREFECTURES[currentPrefKey];
  findPanoramaInRegion(region, 0, (latLng, pano) => {
    if (latLng && pano) {
      localPanoramas.push({ latLng, pano });
    } else {
      // 見つからなければ全国モードの座標で代替（panoなし）
      const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      localPanoramas.push({ latLng: new google.maps.LatLng(loc.lat, loc.lng), pano: null });
    }
    collectLocalPanoramas(count + 1);
  });
}

// ========== 地域内ランダムパノラマ探索 ==========
// links が2本以上ある屋外パノラマのみ採用（行き止まり・屋内・店内を除外）
const MIN_LINKS = 4; // 4方向以上あれば屋外の交差点・道路と判断できる

function findPanoramaInRegion(region, attempts, callback) {
  if (attempts >= 30) { callback(null); return; }
  const lat = region.south + Math.random() * (region.north - region.south);
  const lng = region.west  + Math.random() * (region.east  - region.west);
  const radius = region.searchRadius || 10000;
  svService.getPanorama(
    { location: { lat, lng }, radius, source: google.maps.StreetViewSource.OUTDOOR },
    (data, status) => {
      if (status === 'OK') {
        const links = data.links || [];
        if (links.length >= MIN_LINKS) {
          // latLngとpanoIdの両方を返す（setPanoで正確に指定するため）
          callback(data.location.latLng, data.location.pano);
        } else {
          findPanoramaInRegion(region, attempts + 1, callback);
        }
      } else {
        findPanoramaInRegion(region, attempts + 1, callback);
      }
    }
  );
}

// ========== マップ初期化（初回のみ）==========
function initMaps() {
  if (panorama) return;

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('streetview'),
    {
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: false,
      fullscreenControl: false,
      motionTracking: false,
      motionTrackingControl: false,
      showRoadLabels: false,
    }
  );

  // タイルが読み込まれたらオーバーレイを非表示（pano_changedとtiles_loadedの両方を監視）
  panorama.addListener('tiles_loaded', () => showSvLoading(false));
  panorama.addListener('pano_changed',  () => {
    // pano_changedは位置確定時点で発火。タイル完了を少し待ってから非表示
    setTimeout(() => showSvLoading(false), 600);
  });

  // 地元モードは大阪港駅中心・ズーム14、全国モードは日本全体
  const mapCenter = currentMode === 'local'
    ? { lat: 34.6544, lng: 135.4371 }
    : { lat: 36.5, lng: 137.0 };
  const mapZoom = currentMode === 'local' ? 14 : 5;

  answerMap = new google.maps.Map(document.getElementById('answer-map'), {
    center: mapCenter,
    zoom: mapZoom,
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'greedy',
  });

  answerMap.addListener('click', e => placeMarker(e.latLng));
}

// ========== マーカー設置 ==========
function placeMarker(latLng) {
  if (answerMarker) {
    answerMarker.setPosition(latLng);
  } else {
    answerMarker = new google.maps.Marker({
      position: latLng,
      map: answerMap,
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 8, fillColor: '#ff6b9d', fillOpacity: 1,
        strokeColor: '#fff', strokeWeight: 2,
      },
      animation: google.maps.Animation.DROP,
    });
  }
  document.getElementById('btn-submit').disabled = false;
}

// ========== ヘッダー更新 ==========
function updateHeader() {
  document.getElementById('header-name').textContent = playerName;
  buildRoundDots();
}

function buildRoundDots() {
  const container = document.getElementById('round-dots');
  container.innerHTML = '';
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const dot = document.createElement('div');
    dot.className = 'round-dot' + (i < currentRound ? ' done' : i === currentRound ? ' current' : '');
    container.appendChild(dot);
  }
}

// ========== 問題読み込み ==========
function showSvLoading(visible) {
  const el = document.getElementById('sv-loading');
  if (!el) return;
  if (visible) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

function loadRound() {
  if (answerMarker) { answerMarker.setMap(null); answerMarker = null; }
  document.getElementById('btn-submit').disabled = true;
  document.getElementById('total-score').textContent = totalScore;
  buildRoundDots();
  resetAnswerMapView();

  // 新しい問題の読み込み中はオーバーレイを表示
  showSvLoading(true);

  if (currentMode === 'local') {
    const entry = localPanoramas[currentRound];
    currentLocation = entry.latLng;
    startPov = { heading: Math.random() * 360, pitch: 0 };
    startLocation = currentLocation;
    if (entry.pano) {
      panorama.setPano(entry.pano);
    } else {
      panorama.setPosition(currentLocation);
    }
    panorama.setPov(startPov);
  } else {
    const locs = currentMode === 'world' ? WORLD_LOCATIONS : LOCATIONS;
    tryLoadFixedRound(locs, 0);
  }
}

// 固定リストモード：ゲーム開始時にシャッフル済みのcandidatePoolから順に取り出す
// → 同じ場所に偏らず、全150か所を均等に出題できる
function tryLoadFixedRound(locs, tries) {
  // プールが空になったら再シャッフルして補充（全問使い切った場合）
  if (candidatePool.length === 0) {
    candidatePool = shuffled([...Array(locs.length).keys()]);
    usedLocationIndices.clear();
  }

  // プールの先頭から取り出す（既に使用済みならスキップ）
  const idx = candidatePool.shift();

  // 既に使用済みの場合は次へ（再帰）
  if (usedLocationIndices.has(idx) && tries < locs.length) {
    tryLoadFixedRound(locs, tries + 1);
    return;
  }

  const loc = locs[idx];
  const radius = currentMode === 'world' ? 500 : 100;
  svService.getPanorama(
    { location: { lat: loc.lat, lng: loc.lng }, radius, source: google.maps.StreetViewSource.OUTDOOR },
    (data, status) => {
      if (status === 'OK' && (data.links || []).length >= MIN_LINKS) {
        // StreetView取得成功 → 使用済みに登録してパノラマをセット
        usedLocationIndices.add(idx);
        currentLocation = data.location.latLng;
        currentLocationLabel = currentMode === 'world' ? loc.label : '';
        startPov = { heading: Math.random() * 360, pitch: 0 };
        startLocation = currentLocation;
        panorama.setPano(data.location.pano);
        panorama.setPov(startPov);
      } else {
        // StreetView取得失敗 → プールの次の候補へ（この場所は捨てる）
        tryLoadFixedRound(locs, tries + 1);
      }
    }
  );
}

// 回答マップをモードに合ったビューにリセット
function resetAnswerMapView() {
  if (!answerMap) return;
  if (currentMode === 'local') {
    answerMap.setCenter({ lat: 34.6544, lng: 135.4371 });
    answerMap.setZoom(14);
  } else if (currentMode === 'world') {
    answerMap.setCenter({ lat: 20, lng: 0 });
    answerMap.setZoom(2);
  } else {
    answerMap.setCenter({ lat: 36.5, lng: 137.0 });
    answerMap.setZoom(5);
  }
}

// ========== 解答決定 ==========
function onSubmit() {
  if (!answerMarker) return;
  const playerLatLng = answerMarker.getPosition();
  const distanceM = haversineDistance(playerLatLng, currentLocation) * 1000;
  const distanceKm = distanceM / 1000;
  const roundScore = calcScore(distanceKm);
  totalScore += roundScore;
  showResultScreen(distanceKm, roundScore, playerLatLng, currentLocation);
}

// ========== スコア計算 ==========
function calcScore(distanceKm) {
  const maxDist = currentMode === 'local' ? MAX_DISTANCE_LOCAL_KM
                : currentMode === 'world' ? MAX_DISTANCE_WORLD_KM
                : MAX_DISTANCE_KM;
  // 世界モードは4乗で急峻な曲線（遠いほど大幅減点）
  const exp = currentMode === 'world' ? 4 : 2;
  if (distanceKm >= maxDist) return 0;
  return Math.round(MAX_SCORE_PER_ROUND * Math.pow(1 - distanceKm / maxDist, exp));
}

// ========== 1問結果画面 ==========
function showResultScreen(distanceKm, roundScore, playerLatLng, correctLatLng) {
  const distStr = distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`;

  // メダル判定
  let medal = '📍';
  if (distanceKm < 1)   medal = '🎯';
  else if (distanceKm < 10)  medal = '🥇';
  else if (distanceKm < 50)  medal = '🥈';
  else if (distanceKm < 200) medal = '🥉';

  document.getElementById('result-medal').textContent = medal;
  document.getElementById('result-distance').textContent = `距離: ${distStr}`;
  document.getElementById('result-score-msg').textContent = `+${roundScore}点（合計: ${totalScore}点）`;

  // 世界モード：正解地名を表示
  const labelEl = document.getElementById('result-location-label');
  if (labelEl) {
    labelEl.textContent = currentLocationLabel ? `📍 ${currentLocationLabel}` : '';
    labelEl.style.display = currentLocationLabel ? '' : 'none';
  }

  const isLast = currentRound >= TOTAL_ROUNDS - 1;
  document.getElementById('btn-next').textContent = isLast ? '結果を見る！' : '次の問題へ →';

  showScreen('screen-result');

  // 結果マップ
  if (!resultMap) {
    resultMap = new google.maps.Map(document.getElementById('result-map'), {
      disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy',
    });
  }
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(playerLatLng);
  bounds.extend(correctLatLng);
  resultMap.fitBounds(bounds, 50);

  new google.maps.Marker({
    position: correctLatLng, map: resultMap,
    label: { text: '正解', color: '#fff', fontWeight: 'bold', fontSize: '12px' },
    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 11, fillColor: '#2ecc71', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
  });
  new google.maps.Marker({
    position: playerLatLng, map: resultMap,
    label: { text: 'あなた', color: '#fff', fontWeight: 'bold', fontSize: '11px' },
    icon: { path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW, scale: 8, fillColor: '#ff6b9d', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
  });
  new google.maps.Polyline({
    path: [playerLatLng, correctLatLng], map: resultMap,
    strokeColor: '#ffd700', strokeOpacity: 0.9, strokeWeight: 2,
  });
}

// ========== 次の問題 ==========
function nextRound() {
  if (resultMap) { resultMap = null; document.getElementById('result-map').innerHTML = ''; }
  currentRound++;
  if (currentRound >= TOTAL_ROUNDS) {
    showFinalScreen();
  } else {
    showScreen('screen-game');
    loadRound();
  }
}

// ========== 最終結果画面 ==========
function showFinalScreen() {
  document.getElementById('final-score').textContent = `${totalScore}点`;
  document.getElementById('final-rank').textContent = getRank(totalScore);
  document.getElementById('final-medal').textContent = getFinalMedal(totalScore);

  const gasArea = document.getElementById('gas-submit-area');
  const gasStatus = document.getElementById('gas-status');
  gasArea.style.display = EDU_GAS_URL ? '' : 'none';
  // 2回目以降のプレイでボタンをリセット
  const submitBtn = document.getElementById('btn-submit-score');
  submitBtn.disabled = false;
  submitBtn.textContent = '登録する！';
  gasStatus.classList.add('hidden');
  gasStatus.textContent = '';

  showScreen('screen-final');
}

function getRank(score) {
  const max = MAX_SCORE_PER_ROUND * TOTAL_ROUNDS;
  const pct = score / max;
  if (pct >= 0.9) return '地理マスター！！';
  if (pct >= 0.7) return 'すごい！かなり正確だ！';
  if (pct >= 0.5) return 'なかなかいい感じ！';
  if (pct >= 0.3) return 'もう少し！練習しよう';
  return '次は地図をよく見てみよう！';
}

function getFinalMedal(score) {
  const max = MAX_SCORE_PER_ROUND * TOTAL_ROUNDS;
  const pct = score / max;
  if (pct >= 0.9) return '🏆';
  if (pct >= 0.7) return '🥇';
  if (pct >= 0.5) return '🥈';
  if (pct >= 0.3) return '🥉';
  return '📍';
}

// ========== スコア送信（教育用GASへwindow.open） ==========
function submitScore() {
  const btn    = document.getElementById('btn-submit-score');
  const status = document.getElementById('gas-status');
  const modeStr = currentMode === 'local' ? '地元'
                : currentMode === 'world' ? '世界' : '全国';

  const url = EDU_GAS_URL
    + '?action=submit'
    + '&name='  + encodeURIComponent(playerName)
    + '&score=' + encodeURIComponent(totalScore)
    + '&mode='  + encodeURIComponent(modeStr);

  const newWin = window.open(url, '_blank');

  btn.disabled    = true;
  btn.textContent = '登録済み ✅';
  status.classList.remove('hidden');
  status.textContent = '✅ 登録しました！別タブが自動で閉じます';

  // 親ウィンドウ側から閉じる（GAS側のwindow.closeはリダイレクト後にブロックされるため）
  setTimeout(() => {
    if (newWin && !newWin.closed) newWin.close();
  }, 2000);

  const tab = currentMode === 'local' ? 'local' : currentMode === 'world' ? 'world' : 'nationwide';
  setTimeout(() => showRanking(tab), 2200);
}

// ========== ランキング画面表示 ==========
function showRanking(tabMode, fromTitle = false) {
  showScreen('screen-ranking');
  document.getElementById('btn-retry').style.display = fromTitle ? 'none' : '';

  const activeTab = tabMode || 'nationwide';
  document.querySelectorAll('.ranking-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.mode === activeTab);
    t.onclick = () => {
      document.querySelectorAll('.ranking-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      renderOpenButton(t.dataset.mode);
    };
  });

  renderOpenButton(activeTab);
}

// ランキングを開くボタンをリスト欄に表示
function renderOpenButton(tabMode) {
  const modeLabel = { nationwide: '全国', local: '地元', world: '世界' };
  const label = modeLabel[tabMode] || '全国';
  document.getElementById('ranking-list').innerHTML = `
    <div style="text-align:center;padding:28px 0">
      <p style="color:#fff;opacity:0.85;margin-bottom:18px;font-size:0.95rem">
        ランキングは別タブで開きます
      </p>
      <button class="btn btn-primary"
        style="width:auto;padding:12px 36px;font-size:1rem"
        onclick="openRankingTab('${tabMode}')">
        🏆 ${label}ランキングを開く
      </button>
    </div>`;
}

// 教育用GASのランキングページを別タブで開く
function openRankingTab(tabMode) {
  const modeLabel = { nationwide: '全国', local: '地元', world: '世界' };
  const modeStr = modeLabel[tabMode] || '全国';
  window.open(
    EDU_GAS_URL + '?action=ranking&mode=' + encodeURIComponent(modeStr),
    '_blank'
  );
}

// ========== リセット ==========
function resetGame() {
  if (resultMap) { resultMap = null; document.getElementById('result-map').innerHTML = ''; }
  currentMode = 'japan';
  currentPrefKey = '';
  localPanoramas = [];
  document.getElementById('pref-selector').classList.add('hidden');
  document.getElementById('pref-select').value = '';
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
}

// ========== ユーティリティ ==========
function shuffled(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function haversineDistance(a, b) {
  const R = 6371;
  const lat1 = typeof a.lat === 'function' ? a.lat() : a.lat;
  const lng1 = typeof a.lng === 'function' ? a.lng() : a.lng;
  const lat2 = typeof b.lat === 'function' ? b.lat() : b.lat;
  const lng2 = typeof b.lng === 'function' ? b.lng() : b.lng;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const x = Math.sin(dLat/2)**2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function deg2rad(d) { return d * Math.PI / 180; }

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
