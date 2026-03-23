// ========================================
// ここどこ？ ランキング用 GAS コード
// ========================================
// 【使い方】
// 1. Google スプレッドシートを新規作成
// 2. 拡張機能 → Apps Script を開く
// 3. このファイルの内容を貼り付けて保存（Ctrl+S）
// 4. デプロイ → 新しいデプロイ → 種類「ウェブアプリ」
//    ・次のユーザーとして実行: 自分
//    ・アクセスできるユーザー: 全員
// 5. デプロイ → URLをコピー
// 6. game.js の GAS_URL = '' の '' の中に貼り付ける
// ========================================

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // 1行目はヘッダー（なければスキップ）
  const rows = data.length > 1 ? data.slice(1) : [];

  const scores = rows
    .filter(row => row[0] && row[1]) // 名前とスコアがある行のみ
    .map(row => ({
      name:  String(row[0]),
      score: Number(row[1]),
      mode:  String(row[2] || '全国'),
      date:  String(row[3] || ''),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // 上位10件

  return ContentService
    .createTextOutput(JSON.stringify(scores))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // ヘッダーがなければ追加
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['名前', 'スコア', 'モード', '日時']);
    }

    const data = JSON.parse(e.postData.contents);
    const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');

    sheet.appendRow([
      data.name  || '名無し',
      data.score || 0,
      data.mode  || '全国',
      now,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
