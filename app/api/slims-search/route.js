export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const SLIMS_BASE_URL = "https://digilib.undira.ac.id/slims/";
const SLIMS_SEARCH_URL = "https://digilib.undira.ac.id/slims/index.php";

const DIRECT_TIMEOUT = 5000;
const PROXY_TIMEOUT = 7000;
const MAX_ITEMS = 24;

const BLOCKED_TITLES = [
  "tampilkan detail",
  "tampilkan detail sitasi",
  "detail sitasi",
  "sitasi",
  "citation",
  "detail",
  "show detail",
  "view detail",
  "selengkapnya",
  "read more",
  "availability",
  "ketersediaan",
  "tambahkan ke dalam keranjang",
  "tambahkan ke keranjang",
  "add to cart",
  "add to basket",
  "keranjang",
  "cart",
];

function cleanText(value = "") {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value = "") {
  return cleanText(
    String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, " | ")
      .replace(/<\/(p|div|li|tr|td|h1|h2|h3|h4|h5|h6)>/gi, " | ")
      .replace(/<[^>]+>/g, " ")
  );
}

function makeAbsoluteUrl(value = "") {
  const url = cleanText(value);

  if (!url) return SLIMS_SEARCH_URL;

  try {
    return new URL(url, SLIMS_BASE_URL).href;
  } catch {
    return SLIMS_SEARCH_URL;
  }
}

function buildSlimsUrl(keyword = "") {
  const url = new URL(SLIMS_SEARCH_URL);
  url.searchParams.set("keywords", keyword);
  url.searchParams.set("search", "search");
  return url.href;
}

function buildProxyUrls(targetUrl) {
  const encoded = encodeURIComponent(targetUrl);

  return [
    {
      name: "allorigins",
      url: `https://api.allorigins.win/raw?url=${encoded}`,
    },
    {
      name: "codetabs",
      url: `https://api.codetabs.com/v1/proxy?quest=${encoded}`,
    },
  ];
}

function isBadHtml(html = "") {
  const value = String(html || "").toLowerCase();

  return (
    !value.trim() ||
    value.includes("access denied") ||
    value.includes("forbidden") ||
    value.includes("captcha") ||
    value.includes("too many requests")
  );
}

async function fetchText(url, timeout = DIRECT_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: SLIMS_BASE_URL,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (isBadHtml(text)) {
      throw new Error("HTML kosong atau diblokir");
    }

    return text;
  } finally {
    clearTimeout(timer);
  }
}

function isValidTitle(title = "") {
  const value = cleanText(title).toLowerCase();

  if (!value) return false;
  if (value.length < 4) return false;

  if (BLOCKED_TITLES.includes(value)) return false;

  if (value.startsWith("tampilkan detail")) return false;
  if (value.includes("tampilkan detail sitasi")) return false;
  if (value.includes("detail sitasi")) return false;
  if (value === "sitasi") return false;
  if (value === "citation") return false;

  if (value.includes("tambahkan ke dalam keranjang")) return false;
  if (value.includes("tambahkan ke keranjang")) return false;
  if (value.includes("add to cart")) return false;
  if (value.includes("add to basket")) return false;

  if (value.includes("availability")) return false;
  if (value.includes("ketersediaan")) return false;

  return true;
}

function extractMeta(block = "", labels = []) {
  const plain = stripTags(block);

  for (const label of labels) {
    const regex = new RegExp(
      `${label}\\s*:?\\s*([^|]+?)(?=\\s*(Author|Authors|Pengarang|Penulis|Publisher|Penerbit|ISBN|ISSN|Call Number|Nomor Panggil|Availability|Ketersediaan|Year|Tahun|Subject|Subjek|Edition|Edisi|\\||$))`,
      "i"
    );

    const match = plain.match(regex);

    if (match?.[1]) {
      const value = cleanText(match[1]);
      if (value) return value;
    }
  }

  return "-";
}

function extractYear(block = "") {
  const fromLabel = extractMeta(block, ["Year", "Tahun"]);

  if (fromLabel !== "-") return fromLabel;

  const plain = stripTags(block);
  const match = plain.match(/\b(19|20)\d{2}\b/);

  return match?.[0] || "-";
}

function normalizeBook(book) {
  return {
    title: cleanText(book.title) || "Tanpa judul",
    author: cleanText(book.author) || "-",
    publisher: cleanText(book.publisher) || "-",
    year: cleanText(book.year) || "-",
    callNumber: cleanText(book.callNumber) || "-",
    url: book.url || SLIMS_SEARCH_URL,
  };
}

function getRecordBlocks(html = "") {
  const blocks = [];

  const patterns = [
    /<div[^>]+class=["'][^"']*biblioRecord[^"']*["'][^>]*>[\s\S]*?(?=<div[^>]+class=["'][^"']*biblioRecord|<\/body>|$)/gi,
    /<div[^>]+class=["'][^"']*item[^"']*["'][^>]*>[\s\S]*?(?=<div[^>]+class=["'][^"']*item|<\/body>|$)/gi,
    /<li[^>]*>[\s\S]*?(?:show_detail|p=show_detail)[\s\S]*?<\/li>/gi,
    /<div[^>]+class=["'][^"']*card[^"']*["'][^>]*>[\s\S]*?(?:show_detail|p=show_detail)[\s\S]*?<\/div>/gi,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const block = match[0] || "";

      if (block.includes("show_detail") || block.includes("p=show_detail")) {
        blocks.push(block);
      }
    }

    if (blocks.length > 0) break;
  }

  return blocks;
}

function extractTitleFromBlock(block = "") {
  const patterns = [
    /<[^>]+class=["'][^"']*(?:titleField|title-field|biblio-title|judul|title)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i,
    /<h[1-6][^>]*>\s*<a[^>]*href=["'][^"']*(?:show_detail|p=show_detail)[^"']*["'][^>]*>([\s\S]*?)<\/a>\s*<\/h[1-6]>/i,
    /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i,
    /<strong[^>]*>([\s\S]*?)<\/strong>/i,
    /<a[^>]*href=["'][^"']*(?:show_detail|p=show_detail)[^"']*["'][^>]*>([\s\S]*?)<\/a>/i,
  ];

  for (const pattern of patterns) {
    const match = block.match(pattern);

    if (match?.[1]) {
      const title = stripTags(match[1]);

      if (isValidTitle(title)) return title;
    }
  }

  const plainLines = stripTags(block)
    .split("|")
    .map((line) => cleanText(line))
    .filter(Boolean);

  const fallback = plainLines.find(
    (line) =>
      isValidTitle(line) &&
      !/^(author|authors|pengarang|penulis|publisher|penerbit|isbn|issn|call number|nomor panggil|availability|ketersediaan|tambahkan|add to|tampilkan detail|detail sitasi|sitasi|citation)/i.test(
        line
      )
  );

  return fallback || "";
}

function extractUrlFromBlock(block = "") {
  const match = block.match(
    /<a[^>]*href=["']([^"']*(?:p=show_detail|show_detail)[^"']*)["'][^>]*>/i
  );

  return makeAbsoluteUrl(match?.[1] || "");
}

function parseBooksFromBlocks(html = "") {
  const blocks = getRecordBlocks(html);
  const books = [];
  const seen = new Set();

  for (const block of blocks) {
    const title = extractTitleFromBlock(block);

    if (!isValidTitle(title)) continue;

    const url = extractUrlFromBlock(block);
    const key = `${title.toLowerCase()}-${url}`;

    if (seen.has(key)) continue;

    seen.add(key);

    books.push(
      normalizeBook({
        title,
        author: extractMeta(block, [
          "Author\\(s\\)",
          "Authors",
          "Author",
          "Pengarang",
          "Penulis",
        ]),
        publisher: extractMeta(block, ["Publisher", "Penerbit"]),
        year: extractYear(block),
        callNumber: extractMeta(block, ["Call Number", "Nomor Panggil"]),
        url,
      })
    );
  }

  return books;
}

function parseBooksFromAnchors(html = "") {
  const books = [];
  const seen = new Set();

  const anchorRegex =
    /<a[^>]*href=["']([^"']*(?:p=show_detail|show_detail)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(anchorRegex)) {
    const href = match[1] || "";
    const rawText = match[2] || "";
    const title = stripTags(rawText);

    if (!isValidTitle(title)) continue;

    const url = makeAbsoluteUrl(href);
    const key = `${title.toLowerCase()}-${url}`;

    if (seen.has(key)) continue;

    seen.add(key);

    const index = typeof match.index === "number" ? match.index : 0;
    const block = html.slice(Math.max(0, index - 1500), index + 3000);

    books.push(
      normalizeBook({
        title,
        author: extractMeta(block, [
          "Author\\(s\\)",
          "Authors",
          "Author",
          "Pengarang",
          "Penulis",
        ]),
        publisher: extractMeta(block, ["Publisher", "Penerbit"]),
        year: extractYear(block),
        callNumber: extractMeta(block, ["Call Number", "Nomor Panggil"]),
        url,
      })
    );
  }

  return books;
}

function filterBooks(books = []) {
  const seen = new Set();

  return books.filter((book) => {
    const title = cleanText(book?.title || "");

    if (!isValidTitle(title)) return false;

    const key = `${title.toLowerCase()}-${book?.url || ""}`;

    if (seen.has(key)) return false;

    seen.add(key);

    return true;
  });
}

function parseBooks(html = "") {
  const fromBlocks = filterBooks(parseBooksFromBlocks(html));

  if (fromBlocks.length > 0) return fromBlocks;

  return filterBooks(parseBooksFromAnchors(html));
}

async function fetchAndParse(targetUrl, timeout, sourceName) {
  const html = await fetchText(targetUrl, timeout);
  const books = parseBooks(html);

  return {
    source: sourceName,
    htmlLength: html.length,
    total: books.length,
    books,
  };
}

async function getSlimsBooks(slimsUrl) {
  const errors = [];

  try {
    const direct = await fetchAndParse(slimsUrl, DIRECT_TIMEOUT, "direct");

    if (direct.books.length > 0) {
      return {
        ...direct,
        errors,
      };
    }

    errors.push({
      source: "direct",
      message: "Direct fetch berhasil, tapi parser tidak menemukan data.",
      htmlLength: direct.htmlLength,
    });
  } catch (error) {
    errors.push({
      source: "direct",
      message: error?.message || "Direct fetch gagal",
    });
  }

  const proxies = buildProxyUrls(slimsUrl);

  const proxyResults = await Promise.allSettled(
    proxies.map((proxy, index) =>
      fetchAndParse(proxy.url, PROXY_TIMEOUT, `${proxy.name}-${index + 1}`)
    )
  );

  for (const result of proxyResults) {
    if (result.status === "fulfilled" && result.value.books.length > 0) {
      return {
        ...result.value,
        errors,
      };
    }

    if (result.status === "fulfilled") {
      errors.push({
        source: result.value.source,
        message: "Proxy berhasil, tapi parser tidak menemukan data.",
        htmlLength: result.value.htmlLength,
      });
    }

    if (result.status === "rejected") {
      errors.push({
        source: "proxy",
        message: result.reason?.message || "Proxy gagal",
      });
    }
  }

  return {
    source: "none",
    htmlLength: 0,
    total: 0,
    books: [],
    errors,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const keywords = cleanText(searchParams.get("keywords") || "");
  const limitRaw = Number(searchParams.get("limit") || MAX_ITEMS);
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), MAX_ITEMS)
    : MAX_ITEMS;

  const slimsUrl = buildSlimsUrl(keywords);

  if (!keywords) {
    return Response.json({
      success: true,
      keywords,
      slimsUrl,
      source: "empty",
      total: 0,
      books: [],
      errors: [],
    });
  }

  try {
    const result = await getSlimsBooks(slimsUrl);
    const books = filterBooks(result.books).slice(0, limit);

    return Response.json({
      success: books.length > 0,
      keywords,
      slimsUrl,
      source: result.source,
      htmlLength: result.htmlLength,
      total: books.length,
      books,
      errors: result.errors,
      message:
        books.length > 0
          ? ""
          : "Data buku belum berhasil diparse otomatis dari SLiMS.",
    });
  } catch (error) {
    return Response.json({
      success: false,
      keywords,
      slimsUrl,
      source: "error",
      total: 0,
      books: [],
      errors: [
        {
          source: "route",
          message: error?.message || "Unknown error",
        },
      ],
      message: "Gagal mengambil data SLiMS.",
    });
  }
}