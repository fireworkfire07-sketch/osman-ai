// GROQ ücretsiz günlük kotasını (14.400 istek/gün) korumak için IP başına
// en-basit, sunucu-içi (in-memory) oran sınırlama. Ücretli bir servis veya
// yeni bir veritabanı gerektirmez; Vercel'in serverless yapısında bu Map
// yalnızca aynı sıcak (warm) fonksiyon örneği içinde kalıcıdır — soğuk
// başlangıçta veya farklı bölgede/örnekte sıfırlanır. Bu yüzden mükemmel
// (global, dağıtık) bir sınırlama DEĞİLDİR; tek bir IP'den gelen hızlı,
// art arda kötüye kullanımı engelleyen en basit, ücretsiz önlemdir.
const WINDOW_MS = 5 * 60 * 1000; // 5 dakika
// A2'den itibaren tek bir kullanıcı mesajı, araç çağırma döngüsü yüzünden
// (bkz. ChatPanel.js MAX_ARAC_TURU) sunucuya en fazla 4 Groq isteği yaptırabilir.
// 20'de kalınsaydı araç kullanan tek bir mesaj bile pencereyi hızla tüketirdi.
export const MAX_REQUESTS_PER_WINDOW = 60; // ~15 mesaj / 5 dakika, tek kullanıcı için bol pay
const MAX_TRACKED_IPS = 500; // sınırsız büyümeyi önlemek için basit bir tavan

const buckets = new Map();

export function checkRateLimit(ip, now = Date.now()) {
  if (buckets.size > MAX_TRACKED_IPS) {
    buckets.clear();
  }

  const bucket = buckets.get(ip);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - bucket.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  bucket.count += 1;
  return { allowed: true };
}

export function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// Yalnızca testler için: sayaçları sıfırlar.
export function _resetRateLimitState() {
  buckets.clear();
}
