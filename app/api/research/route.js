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
  const blocks = String(html || "").split(/<div class="result[^"]*">/i).slice(1);

  for (const block of blocks) {
    const linkMatch = block.match(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;

    const snippetMatch = block.match(/<a[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i)
      || block.match(/<div[^>]+class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

    let url = decodeHtml(linkMatch[1]);
    const uddg = url.match(/[?&]uddg=([^&]+)/i);
    if (uddg) {
      try { url = decodeURIComponent(uddg[1]); } catch {}
    }

    results.push({
      title: cleanText(linkMatch[2]),
      url,
      snippet: cleanText(snippetMatch?.[1] || ""),
    });

    if (results.length >= MAX_RESULTS) break;
  }

  return results;
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

  try {
    const url = "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(query);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OsmanAIResearch/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return Response.json({ error: "Araştırma kaynağı cevap vermedi.", status: response.status }, { status: 502 });
    }

    const html = await response.text();
    const results = extractResults(html);

    return Response.json({
      ok: true,
      query,
      source: "DuckDuckGo HTML",
      searchedAt: new Date().toISOString(),
      results,
      evidenceRule: "Sonuçlar keşif kanıtıdır; snippet tek başına pazar/başarı kanıtı değildir.",
    });
  } catch (error) {
    return Response.json(
      { error: error?.name === "AbortError" ? "Araştırma zaman aşımına uğradı." : "Araştırma yapılamadı." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
