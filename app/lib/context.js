// Sunucudaki API route'unun her istekte kullandığı bağlam metnini üretir.
// Çekirdek (Personality+Brain) sabittir ve burada değil app/lib/core'da durur;
// bu dosya yalnızca DEĞİŞEBİLİR veriyi (profil, aktif proje, kararlar,
// görevler, kişisel hafıza, stratejik projeler) kısa bir metne çevirir.
export function buildDynamicContext({
  profile,
  personalMemory = [],
  activeProject,
  projectDecisions = [],
  projectTasks = [],
  protocolsSummary,
  futureProblemsSummary,
} = {}) {
  const parts = [];

  if (profile) {
    parts.push(
      `Osman profili — Meslekler: ${profile.meslekler}. Yetenekler: ${profile.yetenekler}. İlgi alanları: ${profile.ilgiAlanlari}. Sanatsal alanlar: ${profile.sanatsalAlanlar}. Çalışma tercihleri: ${profile.calismaTercihleri}. İş hedefleri: ${profile.isHedefleri}. Uzun vadeli hedefler: ${profile.uzunVadeliHedefler}.`
    );
  }

  if (personalMemory.length) {
    const recent = personalMemory.slice(-3);
    parts.push("Bilinen kişisel notlar: " + recent.map((m) => `${m.baslik}: ${m.icerik}`).join(" | "));
  }

  if (activeProject) {
    parts.push(
      `Aktif proje: ${activeProject.ad}. Amaç: ${activeProject.amac}. Durum: ${activeProject.durum}. Son yapılan işlem: ${activeProject.sonYapilanIslem}. Sonraki adım: ${activeProject.sonrakiAdim}.`
    );
  }

  if (projectDecisions.length) {
    parts.push(
      "Bu projeye ait kararlar: " +
        projectDecisions.map((d) => `[${d.tarih}] ${d.baslik}: ${d.aciklama} (${d.durum})`).join(" ")
    );
  }

  if (projectTasks.length) {
    parts.push("Bu projenin görevleri: " + projectTasks.map((t) => `${t.ad} (${t.durum})`).join(", "));
  }

  if (protocolsSummary) parts.push(protocolsSummary);
  if (futureProblemsSummary) parts.push(futureProblemsSummary);

  return parts.join("\n");
}
