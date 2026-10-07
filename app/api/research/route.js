const MAX_RESULTS = 8;
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

  results.push({
    title: cleanTitle,
    url: cleanUrl,
    snippet: cleanText(snippet || ""),
  });
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

function extractResults(html, source) {
  return source === "Bing HTML"
    ? extractBingResults(html)
    : extractDuckDuckGoResults(html);
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
    return { ok: true, source, html, results: extractResults(html, source) };
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

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Geçersiz araştırma isteği." }, { status: 400 });
  }

  const query = String(body?.query || "").trim();
  if (!query) {
    return Response.json({ error: "query zorunlu." }, { status: 400 });
  }

  if (query.length > 300) {
    return Response.json({ error: "query çok uzun." }, { status: 400 });
  }

  const encodedQuery = encodeURIComponent(query);
  const sources = [
    {
      name: "DuckDuckGo HTML",
      url: "https://html.duckduckgo.com/html/?q=" + encodedQuery,
    },
    {
      name: "Bing HTML",
      url: "https://www.bing.com/search?q=" + encodedQuery,
    },
  ];

  const failures = [];

  for (const source of sources) {
    const result = await fetchSearch(source.url, source.name);
    if (result.ok && result.results.length > 0) {
      return Response.json({
        ok: true,
        query,
        source: result.source,
        searchedAt: new Date().toISOString(),
        results: result.results,
        evidenceRule: "Sonuçlar keşif kanıtıdır; snippet tek başına pazar/başarı kanıtı değildir.",
      });
    }
    failures.push({
      source: result.source,
      status: result.status || null,
      error: result.error || "Sonuç bulunamadı.",
    });
  }

  return Response.json(
    {
      ok: false,
      query,
      results: [],
      researchStatus: "research_failed",
      error: "Araştırma kaynakları sonuç döndürmedi.",
      failures,
    },
    { status: 502 }
  );
}
