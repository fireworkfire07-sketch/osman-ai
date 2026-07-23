// Sunucudaki API route'unun her istekte kullandığı bağlam metnini üretir.
// Çekirdek (Personality+Brain) sabittir ve burada değil app/lib/core'da durur;
// bu dosya yalnızca DEĞİŞEBİLİR veriyi (profil, aktif proje, kararlar,
// görevler, kişisel hafıza, stratejik projeler) kısa bir metne çevirir.
//
// Sınırlar bilinçlidir: yalnızca aktif projenin EN GÜNCEL birkaç kararı/görevi
// eklenir (tamamı değil), ve toplam metin bir güvenlik sınırına kırpılır.
// Bu, GROQ'un ücretsiz kotasındaki dakikalık token limitine (6.000 TPM)
// zamanla yaklaşmayı önlemek içindir — proje büyüdükçe prompt boyutu
// sınırsız büyümez.
const MAX_RECENT_DECISIONS = 5;
const MAX_RECENT_TASKS = 5;
const MAX_PERSONAL_MEMORY = 3;
const MAX_PROJECTS_LISTED = 10;
const MAX_CONTEXT_CHARS = 4000;

export function buildDynamicContext({
  profile,
  personalMemory = [],
  activeProject,
  allProjects = [],
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
    const recent = personalMemory.slice(-MAX_PERSONAL_MEMORY);
    parts.push("Bilinen kişisel notlar: " + recent.map((m) => `${m.baslik}: ${m.icerik}`).join(" | "));
  }

  if (allProjects.length) {
    const listed = allProjects.slice(0, MAX_PROJECTS_LISTED);
    const note =
      allProjects.length > listed.length ? ` (ilk ${MAX_PROJECTS_LISTED}, toplam ${allProjects.length})` : "";
    parts.push(`Kayıtlı tüm projeler${note}: ` + listed.map((p) => `${p.ad} (${p.durum})`).join(", "));
  }

  if (activeProject) {
    parts.push(
      `Aktif proje: ${activeProject.ad}. Amaç: ${activeProject.amac}. Durum: ${activeProject.durum}. Son yapılan işlem: ${activeProject.sonYapilanIslem}. Sonraki adım: ${activeProject.sonrakiAdim}.`
    );
  }

  if (projectDecisions.length) {
    const recent = projectDecisions.slice(-MAX_RECENT_DECISIONS);
    const note = projectDecisions.length > recent.length ? ` (son ${MAX_RECENT_DECISIONS}, toplam ${projectDecisions.length})` : "";
    parts.push(
      `Bu projeye ait güncel kararlar${note}: ` +
        recent.map((d) => `[${d.tarih}] ${d.baslik}: ${d.aciklama} (${d.durum})`).join(" ")
    );
  }

  if (projectTasks.length) {
    const recent = projectTasks.slice(-MAX_RECENT_TASKS);
    const note = projectTasks.length > recent.length ? ` (son ${MAX_RECENT_TASKS}, toplam ${projectTasks.length})` : "";
    parts.push(`Bu projenin güncel görevleri${note}: ` + recent.map((t) => `${t.ad} (${t.durum})`).join(", "));
  }

  if (protocolsSummary) parts.push(protocolsSummary);
  if (futureProblemsSummary) parts.push(futureProblemsSummary);

  let result = parts.join("\n");
  if (result.length > MAX_CONTEXT_CHARS) {
    result = result.slice(0, MAX_CONTEXT_CHARS) + "\n[Bağlam uzunluk sınırı nedeniyle kısaltıldı.]";
  }
  return result;
}
