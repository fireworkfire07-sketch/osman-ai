import { personalMemoryCollection } from "../data/personalMemory";
import { decisionsCollection } from "../data/decisions";
import { tasksCollection } from "../data/tasks";
import { projectsCollection } from "../data/projects";

// A2 yapım emri Bölüm 2b — tarayıcıdan Groq'a gönderilen araç tanımları.
// route.js bu diziyi olduğu gibi Groq'a iletir, kendisi hiçbir aracı çalıştırmaz.
export const ARACLAR = [
  {
    type: "function",
    function: {
      name: "hafiza_ekle",
      description:
        "Osman hakkinda kalici olarak hatirlanmasi gereken bir bilgiyi kaydeder. " +
        "Fiyat, calisma sekli, tercih, kisit, gecmis deneyim, musteri yaklasimi gibi " +
        "gelecekte de gecerli olacak bilgiler icin kullanilir. " +
        "Gecici sohbet detaylari icin KULLANILMAZ.",
      parameters: {
        type: "object",
        properties: {
          baslik: { type: "string", description: "Kisa baslik, en fazla 8 kelime" },
          durum: { type: "string", description: "Osman'in soyledigi bilgi" },
          kural: {
            type: "string",
            description:
              "Bu bilgiden cikan, gelecekte uygulanacak kural. Ornek: " +
              "'Yerel model onerilmeyecek, bulut tabanli ucretsiz servis tercih edilecek'",
          },
        },
        required: ["baslik", "durum"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "karar_ekle",
      description:
        "Osman'in verdigi kalici bir karari kaydeder. Sonraki onerilerde bu karara " +
        "aykiri bir sey onerilirse uyari verilebilmesi icin kullanilir.",
      parameters: {
        type: "object",
        properties: {
          baslik: { type: "string" },
          karar: { type: "string", description: "Kararin tam metni" },
          gerekce: { type: "string", description: "Osman bu karari neden verdi" },
          proje: { type: "string", description: "Ilgili proje adi, yoksa bos birak" },
        },
        required: ["baslik", "karar"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "gorev_ekle",
      description:
        "Yapilmasi gereken tek bir islemi kaydeder. Ayni projede zaten acik gorev " +
        "varsa yeni gorev EKLEMEZ, once mevcut gorevi bitirmeyi hatirlatir.",
      parameters: {
        type: "object",
        properties: {
          baslik: { type: "string" },
          tek_islem: { type: "string", description: "Yapilacak tek somut islem" },
          test: { type: "string", description: "Bu isin bittigi nasil dogrulanacak" },
          proje: { type: "string" },
        },
        required: ["baslik", "tek_islem", "test"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "proje_guncelle",
      description: "Bir projenin durumunu, calisan/calismayan ozelliklerini veya sonraki adimini gunceller.",
      parameters: {
        type: "object",
        properties: {
          proje: { type: "string" },
          alan: {
            type: "string",
            enum: ["durum", "calisan", "calismayan", "hata", "sonraki_adim"],
          },
          deger: { type: "string" },
        },
        required: ["proje", "alan", "deger"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "hafiza_ara",
      description:
        "Kayitli hafiza, karar, gorev ve projelerde arama yapar. Kayit eklemeden " +
        "once ayni bilginin var olup olmadigini kontrol etmek icin de kullanilir.",
      parameters: {
        type: "object",
        properties: { sorgu: { type: "string" } },
        required: ["sorgu"],
      },
    },
  },
];

const MAX_HAFIZA_ARA_SONUC = 8;

const PROJE_ALAN_HARITASI = {
  durum: "durum",
  calisan: "calisanOzellikler",
  calismayan: "calismayanOzellikler",
  hata: "hatalar",
  sonraki_adim: "sonrakiAdim",
};

function projeBul(proje) {
  if (!proje) return null;
  const aranan = String(proje).toLowerCase();
  return projectsCollection.load().find((p) => p.id === proje || p.ad.toLowerCase() === aranan) || null;
}

function hafizaEkle(girdi) {
  if (!girdi.baslik || !girdi.durum) return { hata: "baslik ve durum zorunlu" };
  const icerik = girdi.kural ? `${girdi.durum}\n\nKural: ${girdi.kural}` : girdi.durum;
  const items = personalMemoryCollection.load();
  const next = personalMemoryCollection.add(items, {
    baslik: girdi.baslik,
    icerik,
    kategori: "Bilgi",
  });
  return { ok: true, id: next[next.length - 1].id, refresh: "personalMemory" };
}

function kararEkle(girdi) {
  if (!girdi.baslik || !girdi.karar) return { hata: "baslik ve karar zorunlu" };
  const aciklama = girdi.gerekce ? `${girdi.karar}\n\nGerekçe: ${girdi.gerekce}` : girdi.karar;
  const proje = projeBul(girdi.proje);
  const items = decisionsCollection.load();
  const next = decisionsCollection.add(items, {
    baslik: girdi.baslik,
    aciklama,
    projeId: proje ? proje.id : "",
    durum: "Aktif",
  });
  return { ok: true, id: next[next.length - 1].id, refresh: "decisions" };
}

function gorevEkle(girdi) {
  if (!girdi.baslik || !girdi.tek_islem || !girdi.test) {
    return { hata: "baslik, tek_islem ve test zorunlu" };
  }
  const proje = projeBul(girdi.proje);
  const projeId = proje ? proje.id : "";
  const items = tasksCollection.load();
  const acikGorev = projeId && items.find((t) => t.projeId === projeId && t.durum !== "Tamamlandı");
  if (acikGorev) {
    return { hata: `Bu projede zaten acik gorev var: ${acikGorev.ad}` };
  }
  const next = tasksCollection.add(items, {
    ad: girdi.baslik,
    projeId,
    aciklama: girdi.tek_islem,
    testYontemi: girdi.test,
    durum: "Bekliyor",
    oncelik: "Orta",
  });
  return { ok: true, id: next[next.length - 1].id, refresh: "tasks" };
}

function projeGuncelle(girdi) {
  if (!girdi.proje || !girdi.alan || girdi.deger === undefined) {
    return { hata: "proje, alan ve deger zorunlu" };
  }
  const alanAdi = PROJE_ALAN_HARITASI[girdi.alan];
  if (!alanAdi) return { hata: `Bilinmeyen alan: ${girdi.alan}` };
  const proje = projeBul(girdi.proje);
  if (!proje) return { hata: `Proje bulunamadi: ${girdi.proje}` };
  const items = projectsCollection.load();
  projectsCollection.update(items, proje.id, { [alanAdi]: girdi.deger });
  return { ok: true, id: proje.id, refresh: "projects" };
}

function hafizaAra(girdi) {
  const sorgu = String(girdi.sorgu || "").toLowerCase();
  if (!sorgu) return { hata: "sorgu zorunlu" };
  const sonuclar = [];

  for (const k of personalMemoryCollection.load()) {
    if (`${k.baslik} ${k.icerik}`.toLowerCase().includes(sorgu)) {
      sonuclar.push({ tur: "hafiza", baslik: k.baslik, ozet: k.icerik });
    }
  }
  for (const k of decisionsCollection.load()) {
    if (`${k.baslik} ${k.aciklama}`.toLowerCase().includes(sorgu)) {
      sonuclar.push({ tur: "karar", baslik: k.baslik, ozet: k.aciklama });
    }
  }
  for (const k of tasksCollection.load()) {
    if (`${k.ad} ${k.aciklama || ""}`.toLowerCase().includes(sorgu)) {
      sonuclar.push({ tur: "gorev", baslik: k.ad, ozet: k.aciklama || "" });
    }
  }
  for (const k of projectsCollection.load()) {
    if (`${k.ad} ${k.durum || ""}`.toLowerCase().includes(sorgu)) {
      sonuclar.push({ tur: "proje", baslik: k.ad, ozet: k.durum || "" });
    }
  }

  return { ok: true, sonuclar: sonuclar.slice(0, MAX_HAFIZA_ARA_SONUC) };
}

const ARAC_HARITASI = {
  hafiza_ekle: hafizaEkle,
  karar_ekle: kararEkle,
  gorev_ekle: gorevEkle,
  proje_guncelle: projeGuncelle,
  hafiza_ara: hafizaAra,
};

// Tarayicida calisir (bkz. yapım emri Bölüm 2a) — sunucu tool çalıştırmaz.
export function araciCalistir(ad, girdi) {
  const fn = ARAC_HARITASI[ad];
  if (!fn) return { hata: `Bilinmeyen arac: ${ad}` };
  try {
    return fn(girdi || {});
  } catch (e) {
    return { hata: e?.message || "arac calistirilamadi" };
  }
}
