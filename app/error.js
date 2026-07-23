"use client";

import { wipeAllData } from "./lib/dataManagement";

// Next.js App Router genel hata sınırı. page.js içinde beklenmeyen bir
// JavaScript hatası (ör. bozuk/uyumsuz bir içe aktarma dosyasının veri
// şeklini bozması) fırlatılırsa React ağacının tamamı beyaz ekran yerine
// bu ekranı gösterir; kullanıcı buradan güvenle kurtarabilir.
export default function GlobalError({ error, reset }) {
  function handleReset() {
    reset();
  }

  function handleWipe() {
    if (
      !window.confirm(
        "Sorunun kaynağı bozuk bir veri olabilir. Tüm OSMAN AI verisi bu cihazdan temizlenip baştan başlatılsın mı?"
      )
    ) {
      return;
    }
    wipeAllData();
    window.location.reload();
  }

  return (
    <div id="osman-app">
      <header className="osman-header">
        <h1>OSMAN AI</h1>
        <p>Osman'ın kişisel dijital zekâsı</p>
      </header>
      <div className="osman-panel">
        <h2>Bir şeyler ters gitti</h2>
        <p className="osman-note">
          OSMAN AI beklenmeyen bir hatayla karşılaştı. Bunun sebebi genellikle bozuk veya uyumsuz bir içe
          aktarma dosyasıdır. Önce &quot;Tekrar dene&quot; ile devam etmeyi deneyebilirsin; sorun devam ederse
          veriyi temizleyip baştan başlatabilirsin — bu geri alınamaz bir işlemdir.
        </p>
        {error?.message && (
          <p className="osman-note">
            <strong>Teknik ayrıntı:</strong> {String(error.message)}
          </p>
        )}
        <div className="osman-panel-actions">
          <button onClick={handleReset}>Tekrar Dene</button>
          <button className="danger" onClick={handleWipe}>
            Tüm Veriyi Temizle ve Yeniden Başlat
          </button>
        </div>
      </div>
    </div>
  );
}
