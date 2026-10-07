const MAX_RESULTS = 8;
const NEWS_DOMAINS = ["dha.com.tr", "trthaber.com", "tgrthaber.com", "aa.com.tr", "ntv.com.tr", "haberturk.com", "reuters.com", "apnews.com"];
const SEARCH_TIMEOUT_MS = 8000;

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanText(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseUrl(value) {
  let url = decodeHtml(value).trim();
  const uddg = url.match(/[?&]uddg=([^&]+)/i);
  if (uddg) {
    try { url = decodeURIComponent(uddg[1]); } catch {}
  }
  return url;
}

function addResult(results, title, url, snippet) {
  const cleanUrl = normaliseUrl(url);
  const cleanTitle = cleanText(title);
  if (!cleanTitle || !/^https?:\/\//i.test(cleanUrl)) return;
  if (results.some((item) => item.url === cleanUrl)) return;
  results.push({ title: cleanTitle, url: cleanUrl, snippet: cleanText(snippet || "") });
}

function extractDuckDuckGoResults(html) {
  const results = [];
  const blocks = String(html || "")
    .split(/<div[^>]+class=["'][^"']*result[^"']*["'][^>]*>/i)
    .slice(1);

  for (const block of blocks) {
    const linkMatch =
      block.match(/<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i) ||
      block.match(/<a[^>]*href=["']([^"']+)["'][^>]*class=["'][^"']*result__a[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;

    const snippetMatch = block.match(/<(?:a|div)[^>]+class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\/(?:a|div)>/i);
    addResult(results, linkMatch[2], linkMatch[1], snippetMatch?.[1] || "");
    if (results.length >= MAX_RESULTS) break;
  }
  return results;
}

function extractBingResults(html) {
  const results = [];
  const blocks = String(html || "")
    .split(/<li[^>]+class=["'][^"']*b_algo[^"']*["'][^>]*>/i)
    .slice(1);

  for (const block of blocks) {
    const linkMatch = block.match(/<h2[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h2>/i);
    if (!linkMatch) continue;

    const snippetMatch =
      block.match(/<p[^>]*>([\s\S]*?)<\/p>/i) ||
      block.match(/<div[^>]+class=["'][^"']*b_caption[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

    addResult(results, linkMatch[2], linkMatch[1], snippetMatch?.[1] || "");
    if (results.length >= MAX_RESULTS) break;
  }
  return results;
}

async function fetchSearch(url, source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OsmanAIResearch/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    if (!response.ok) return { ok: false, status: response.status, source };

    const html = await response.text();
    const results = source === "Bing HTML"
      ? extractBingResults(html)
      : extractDuckDuckGoResults(html);

    return { ok: true, source, html, results };
  } catch (error) {
    return {
      ok: false,
      source,
      error: error?.name === "AbortError" ? "Araştırma zaman aşımına uğradı." : "Araştırma yapılamadı.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function performWebResearch(rawQuery) {
  const query = String(rawQuery || "").trim().slice(0, 300);
  const wantsNews = /haber|güncel|son dakika|bugün|son günler|olay/i.test(query);
  if (!query) {
    return { ok: false, query, results: [], researchStatus: "research_failed", error: "query zorunlu." };
  }

  const searchQueries = wantsNews
    ? [
        `${query} (site:dha.com.tr OR site:trthaber.com OR site:tgrthaber.com OR site:aa.com.tr OR site:ntv.com.tr OR site:haberturk.com)`,
        `${query} Antalya haber son dakika 2026`,
      ]
    : [query];

  const sources = [];
  for (const searchQuery of searchQueries) {
    const encodedQuery = encodeURIComponent(searchQuery);
    sources.push(
      { name: "DuckDuckGo HTML", url: "https://html.duckduckgo.com/html/?q=" + encodedQuery },
      { name: "Bing HTML", url: "https://www.bing.com/search?q=" + encodedQuery },
    );
  }

  const failures = [];

  const merged = [];
  for (const source of sources) {
    const result = await fetchSearch(source.url, source.name);
    if (result.ok && result.results.length > 0) {
      for (const item of result.results) {
        const isNewsDomain = NEWS_DOMAINS.some((domain) => item.url.toLowerCase().includes(domain));
        const looksLikeNews = /haber|son dakika|gündem|ekonomi|olay|bakan|vali|yangın|kaza|operasyon/i.test(item.title + " " + item.snippet);
        if (!wantsNews || isNewsDomain || looksLikeNews) {
          addResult(merged, item.title, item.url, item.snippet);
        }
        if (merged.length >= MAX_RESULTS) break;
      }
    } else {
      failures.push({
        source: result.source,
        status: result.status || null,
        error: result.error || "Sonuç bulunamadı.",
      });
    }
    if (merged.length >= MAX_RESULTS) break;
  }

  if (merged.length > 0) {
    return {
      ok: true,
      query,
      source: wantsNews ? "Haber odaklı web araştırması" : "Web araştırması",
      searchedAt: new Date().toISOString(),
      results: merged.slice(0, MAX_RESULTS),
      researchStatus: "success",
      evidenceRule: "Sonuçlar keşif kanıtıdır; güncellik ve içerik iddiası kaynak sayfasıyla doğrulanmalıdır.",
    };
  }

  return {
    ok: false,
    query,
    results: [],
    researchStatus: "research_failed",
    error: "Araştırma kaynakları sonuç döndürmedi.",
    failures,
  };
}
