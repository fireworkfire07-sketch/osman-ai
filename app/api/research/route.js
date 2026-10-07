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

function extractResults(html) {
  const results = [];
  const source = String(html || "");
  const blocks = source.split(/<div[^>]+class=["'][^"']*result[^"']*["'][^>]*>/i).slice(1);

  for (const block of blocks) {
    const linkMatch = block.match(/<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i)
      || block.match(/<a[^>]*href=["']([^"']+)["'][^>]*class=["'][^"']*result__a[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;

    const snippetMatch = block.match(/<(?:a|div)[^>]+class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\/(?:a|div)>/i);

    let url = decodeHtml(linkMatch[1]);
    const uddg = url.match(/[?&]uddg=([^&]+)/i);
    if (uddg) {
      try { url = decodeURIComponent(uddg[1]); } catch {}
    }

    const title = cleanText(linkMatch[2]);
    if (!title || !/^https?:\/\//i.test(url)) continue;

    results.push({
      title,
      url,
      snippet: cleanText(snippetMatch?.[1] || ""),
    });

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
    return { ok: true, source, html, results: extractResults(html) };
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
