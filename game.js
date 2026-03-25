'use strict';

// ========== Google Identity Services 設定 ==========
const GSI_CLIENT_ID = '954206939501-gqjp1k3fn9jpaovnuhlshje5olcpn5mv.apps.googleusercontent.com';

// ========== 教育用GAS URL ==========
const EDU_GAS_URL = 'https://script.google.com/a/macros/oskedu.jp/s/AKfycbxbTQ6tVrySnF4sGy5ZNTcA0c7kAlXJixQPfKX-tpSpYTokTH0ODyG7VvSJo2uO1bLI6g/exec';

// ========== 設定 ==========
const TOTAL_ROUNDS = 3;
const MAX_SCORE_PER_ROUND = 1000;
const MAX_DISTANCE_KM = 2000;        // 全国モード：2000km 基準
const MAX_DISTANCE_LOCAL_KM = 3;     // 地元モード：3km 基準（築港エリア想定）
const MAX_DISTANCE_WORLD_KM = 20000; // 世界チャレンジ：地球半周（約20000km）基準

// ========== 全国モード 出題座標リスト（30か所） ==========
const LOCATIONS = [
  { lat: 35.6595, lng: 139.7004, label: '渋谷スクランブル交差点' },
  { lat: 35.7101, lng: 139.8107, label: '東京スカイツリー周辺' },
  { lat: 35.6586, lng: 139.7454, label: '東京タワー周辺' },
  { lat: 35.6938, lng: 139.7034, label: '新宿西口' },
  { lat: 35.7148, lng: 139.7967, label: '浅草寺周辺' },
  { lat: 34.6937, lng: 135.5023, label: '大阪城周辺' },
  { lat: 34.6727, lng: 135.5022, label: '道頓堀' },
  { lat: 34.7024, lng: 135.4959, label: '梅田' },
  { lat: 35.0116, lng: 135.7681, label: '京都 金閣寺周辺' },
  { lat: 34.9949, lng: 135.7850, label: '京都 祇園' },
  { lat: 35.3606, lng: 138.7274, label: '富士山五合目' },
  { lat: 34.3853, lng: 132.4553, label: '広島 原爆ドーム周辺' },
  { lat: 43.0618, lng: 141.3545, label: '札幌 大通公園' },
  { lat: 43.0688, lng: 141.3508, label: '札幌 時計台' },
  { lat: 33.5904, lng: 130.4017, label: '福岡 天神周辺' },
  { lat: 33.6060, lng: 130.4181, label: '博多駅周辺' },
  { lat: 26.2123, lng: 127.6792, label: '那覇 国際通り' },
  { lat: 26.4588, lng: 127.9294, label: '美ら海水族館周辺' },
  { lat: 38.2682, lng: 140.8694, label: '仙台 青葉城跡' },
  { lat: 36.6485, lng: 138.1952, label: '長野 善光寺周辺' },
  { lat: 35.1855, lng: 136.8994, label: '名古屋城周辺' },
  { lat: 35.1709, lng: 136.8815, label: '名古屋 栄' },
  { lat: 34.6901, lng: 135.1956, label: '神戸 三宮' },
  { lat: 34.6499, lng: 135.1882, label: '神戸 北野異人館' },
  { lat: 32.7503, lng: 129.8779, label: '長崎 平和公園' },
  { lat: 31.5966, lng: 130.5571, label: '鹿児島 城山' },
  { lat: 36.5619, lng: 136.6562, label: '金沢 ひがし茶屋街' },
  { lat: 33.5553, lng: 130.3788, label: '太宰府天満宮周辺' },
  { lat: 34.3948, lng: 132.3152, label: '宮島 厳島神社周辺' },
  { lat: 35.5023, lng: 134.2353, label: '鳥取砂丘' },
];

// ========== 世界チャレンジ 出題座標リスト（30か所） ==========
const WORLD_LOCATIONS = [
  // ヨーロッパ
  { lat: 48.8530, lng: 2.3499,   label: 'エッフェル塔周辺（フランス）' },
  { lat: 41.8902, lng: 12.4922,  label: 'コロッセオ（イタリア）' },
  { lat: 51.5007, lng: -0.1246,  label: 'ビッグベン周辺（イギリス）' },
  { lat: 41.4036, lng: 2.1744,   label: 'サグラダ・ファミリア（スペイン）' },
  { lat: 50.0755, lng: 14.4378,  label: 'プラハ旧市街（チェコ）' },
  { lat: 48.2082, lng: 16.3738,  label: 'ウィーン（オーストリア）' },
  { lat: 52.3731, lng: 4.8922,   label: 'アムステルダム（オランダ）' },
  { lat: 55.7539, lng: 37.6208,  label: '赤の広場（ロシア）' },
  { lat: 36.3932, lng: 25.4615,  label: 'サントリーニ島（ギリシャ）' },
  { lat: 43.7230, lng: 10.3966,  label: 'ピサの斜塔（イタリア）' },
  // アメリカ大陸
  { lat: 40.7580, lng: -73.9855, label: 'タイムズスクエア（アメリカ）' },
  { lat: 37.8199, lng: -122.4783,label: 'ゴールデンゲートブリッジ（アメリカ）' },
  { lat: 25.7617, lng: -80.1918, label: 'マイアミビーチ（アメリカ）' },
  { lat: -22.9516, lng: -43.2105,label: 'コルコバードの丘（ブラジル）' },
  { lat: -34.6037, lng: -58.3816,label: 'ブエノスアイレス（アルゼンチン）' },
  { lat: 19.4326, lng: -99.1332, label: 'メキシコシティ（メキシコ）' },
  // アジア
  { lat: 40.4319, lng: 116.5704, label: '万里の長城（中国）' },
  { lat: 27.1751, lng: 78.0421,  label: 'タージマハル（インド）' },
  { lat: 13.7563, lng: 100.5018, label: 'バンコク（タイ）' },
  { lat: 37.5665, lng: 126.9780, label: 'ソウル（韓国）' },
  { lat: 1.2894,  lng: 103.8500, label: 'シンガポール' },
  { lat: 25.1972, lng: 55.2744,  label: 'ドバイ（UAE）' },
  { lat: 41.0082, lng: 28.9784,  label: 'イスタンブール（トルコ）' },
  { lat: 13.4125, lng: 103.8670, label: 'アンコールワット（カンボジア）' },
  // アフリカ・中東
  { lat: 30.0444, lng: 31.2357,  label: 'カイロ（エジプト）' },
  { lat: -33.9249, lng: 18.4241, label: 'ケープタウン（南アフリカ）' },
  { lat: -1.2921, lng: 36.8219,  label: 'ナイロビ（ケニア）' },
  // オセアニア・その他
  { lat: -33.8568, lng: 151.2153,label: 'シドニー・オペラハウス（オーストラリア）' },
  { lat: 64.1466, lng: -21.9426, label: 'レイキャビク（アイスランド）' },
  { lat: -13.1631, lng: -72.5450,label: 'マチュピチュ（ペルー）' },
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

// ========== Google Identity Services 認証 ==========
// ログイン情報はsessionStorageのみに保存（タブを閉じると消える）
let gsiTokenClient = null;
let currentUser    = null; // { displayName, email }

// メールのローカルパートで先生・生徒を判別
// 先生: eで始まる / 生徒: 数字で始まる
function isTeacher(email) { return /^e/i.test(email.split('@')[0]); }
function isStudent(email)  { return /^\d/.test(email.split('@')[0]); }

// GSI初期化（Maps APIロード後に呼ぶ）
function initGSI() {
  if (typeof google === 'undefined' || !google.accounts) return;
  gsiTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GSI_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    callback: async (tokenResponse) => {
      if (tokenResponse.error) {
        document.getElementById('login-error').textContent = 'ログインに失敗しました。';
        return;
      }
      try {
        const res  = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: 'Bearer ' + tokenResponse.access_token }
        });
        const info = await res.json();
        // sessionStorageに保存（ブラウザのみ・外部DB不使用）
        sessionStorage.setItem('gsi_name',  info.name  || '');
        sessionStorage.setItem('gsi_email', info.email || '');
        currentUser = { displayName: info.name, email: info.email };
        onLoginSuccess(currentUser);
      } catch {
        document.getElementById('login-error').textContent = 'ユーザー情報の取得に失敗しました。';
      }
    },
  });
}

// Googleログイン実行（ポップアップ）
function signInWithGoogle() {
  if (!gsiTokenClient) initGSI(); // GSIスクリプトの読み込みが遅れた場合に再試行
  if (!gsiTokenClient) {
    document.getElementById('login-error').textContent = 'しばらく待ってから再試行してください。';
    return;
  }
  document.getElementById('login-error').textContent = '';
  gsiTokenClient.requestAccessToken({ prompt: 'select_account' });
}

// ログイン成功後の振り分け
function onLoginSuccess(user) {
  const email = user.email || '';
  if (isTeacher(email)) {
    // 先生 → 名前確認・編集画面へ
    document.getElementById('teacher-name-input').value = user.displayName || '';
    document.getElementById('teacher-name-error').textContent = '';
    showScreen('screen-teacher-name');
  } else {
    // 生徒 → Google表示名をそのまま使用
    playerName = user.displayName || email;
    showScreen('screen-mode');
  }
}

// セッション復元（ページリロード時）
function restoreSession() {
  const name  = sessionStorage.getItem('gsi_name');
  const email = sessionStorage.getItem('gsi_email');
  if (name && email) {
    currentUser = { displayName: name, email };
    return true;
  }
  return false;
}

// ========== 状態 ==========
let panorama, answerMap, answerMarker, resultMap, svService;
let playerName = '';
let currentMode = 'japan'; // 'japan' | 'local' | 'world'
let currentPrefKey = '';
let currentRound = 0;
let currentLocation = null; // { lat, lng } または LatLng
let currentLocationLabel = ''; // 世界モード用：正解地名
let totalScore = 0;
let roundOrder = [];
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
  initGSI();

  // タイトル → ログイン画面（セッション復元チェック）
  document.getElementById('btn-to-name').addEventListener('click', () => {
    if (restoreSession()) {
      // セッション有効 → 直接振り分け
      onLoginSuccess(currentUser);
    } else {
      document.getElementById('login-error').textContent = '';
      showScreen('screen-login');
    }
  });

  // ログイン画面
  document.getElementById('btn-google-login').addEventListener('click', signInWithGoogle);
  document.getElementById('btn-login-back').addEventListener('click', () => showScreen('screen-title'));

  // 先生用名前確認画面
  document.getElementById('btn-teacher-ok').addEventListener('click', () => {
    const name = document.getElementById('teacher-name-input').value.trim();
    if (!name) {
      document.getElementById('teacher-name-error').textContent = '名前を入力してください';
      return;
    }
    playerName = name;
    showScreen('screen-mode');
  });
  document.getElementById('btn-teacher-back').addEventListener('click', () => {
    // ログアウト：sessionStorageを削除
    sessionStorage.removeItem('gsi_name');
    sessionStorage.removeItem('gsi_email');
    currentUser = null;
    showScreen('screen-title');
  });

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
    showScreen('screen-name');
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
    roundOrder = shuffled([...Array(locs.length).keys()]).slice(0, TOTAL_ROUNDS);
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
  findPanoramaInRegion(region, 0, (latLng) => {
    if (latLng) localPanoramas.push(latLng);
    else {
      // 見つからなければ全国モードの座標で代替
      const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      localPanoramas.push(new google.maps.LatLng(loc.lat, loc.lng));
    }
    collectLocalPanoramas(count + 1);
  });
}

// ========== 地域内ランダムパノラマ探索 ==========
// links が2本以上ある屋外パノラマのみ採用（行き止まり・屋内・店内を除外）
const MIN_LINKS = 2;

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
          callback(data.location.latLng);
        } else {
          // 移動できる方向が少なすぎる（行き止まり・屋内）→ 再試行
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
function loadRound() {
  if (answerMarker) { answerMarker.setMap(null); answerMarker = null; }
  document.getElementById('btn-submit').disabled = true;
  document.getElementById('total-score').textContent = totalScore;
  buildRoundDots();
  resetAnswerMapView();

  if (currentMode === 'local') {
    currentLocation = localPanoramas[currentRound];
    panorama.setPosition(currentLocation);
    panorama.setPov({ heading: Math.random() * 360, pitch: 0 });
  } else {
    const locs = currentMode === 'world' ? WORLD_LOCATIONS : LOCATIONS;
    tryLoadFixedRound(locs, roundOrder[currentRound], 0);
  }
}

// 固定リストモード（全国・世界）：リンク数が足りない場所は次の候補にスキップ
function tryLoadFixedRound(locs, idx, tries) {
  const loc = locs[idx % locs.length];
  const radius = currentMode === 'world' ? 500 : 100;
  svService.getPanorama(
    { location: { lat: loc.lat, lng: loc.lng }, radius, source: google.maps.StreetViewSource.OUTDOOR },
    (data, status) => {
      if (status === 'OK' && (data.links || []).length >= MIN_LINKS) {
        currentLocation = data.location.latLng;
        currentLocationLabel = currentMode === 'world' ? loc.label : '';
        panorama.setPosition(currentLocation);
        panorama.setPov({ heading: Math.random() * 360, pitch: 0 });
      } else if (tries < 5) {
        tryLoadFixedRound(locs, idx + 1, tries + 1);
      } else {
        currentLocation = new google.maps.LatLng(loc.lat, loc.lng);
        currentLocationLabel = currentMode === 'world' ? loc.label : '';
        panorama.setPosition(currentLocation);
        panorama.setPov({ heading: Math.random() * 360, pitch: 0 });
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

  window.open(url, '_blank');

  btn.disabled    = true;
  btn.textContent = '登録済み ✅';
  status.classList.remove('hidden');
  status.textContent = '✅ 登録しました！別タブが自動で閉じます';

  const tab = currentMode === 'local' ? 'local' : currentMode === 'world' ? 'world' : 'nationwide';
  setTimeout(() => showRanking(tab), 1500);
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
