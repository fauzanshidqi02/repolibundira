import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SLIMS_BASE_URL = "https://digilib.undira.ac.id/slims/";
const SLIMS_SEARCH_URL = "https://digilib.undira.ac.id/slims/index.php";

function cleanText(value = "") {
  return String(value)
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

function makeAbsoluteUrl(url, fallbackUrl) {
  if (!url) return fallbackUrl;

  try {
    return new URL(url, SLIMS_BASE_URL).href;
  } catch {
    return fallbackUrl;
  }
}

function isBlockedTitle(title = "") {
  const value = cleanText(title).toLowerCase();

  const blockedTitles = [
    "tampilkan detail",
    "detail",
    "show detail",
    "lihat detail",
    "view detail",
    "more detail",
    "read more",
    "selengkapnya",
    "tampilkan",
  ];

  return blockedTitles.includes(value);
}

function getMetaValue(text, labels = []) {
  const cleaned = cleanText(text);

  for (const label of labels) {
    const regex = new RegExp(
      `${label}\\s*:?\\s*([^|]+?)(Judul|Title|Pengarang|Author|Penulis|Publisher|Penerbit|ISBN|ISSN|Call Number|Nomor Panggil|Availability|Ketersediaan|Lokasi|Location|Tahun|Year|Edition|Edisi|Subject|Subjek|$)`,
      "i"
    );

    const match = cleaned.match(regex);

    if (match?.[1]) {
      const value = cleanText(match[1]);

      if (value && !isBlockedTitle(value)) {
        return value;
      }
    }
  }

  return "-";
}

function normalizeBook(book) {
  return {
    title: cleanText(book.title) || "Tanpa judul",
    author: cleanText(book.author) || "-",
    publisher: cleanText(book.publisher) || "-",
    year: cleanText(book.year) || "-",
    callNumber: cleanText(book.callNumber) || "-",
    url: book.url,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const keywords = cleanText(searchParams.get("keywords") || "");

  const slimsUrl = `${SLIMS_SEARCH_URL}?keywords=${encodeURIComponent(
    keywords
  )}&search=search`;

  try {
    const response = await fetch(slimsUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Referer: SLIMS_BASE_URL,
      },
    });

    if (!response.ok) {
      return Response.json({
        success: false,
        keywords,
        slimsUrl,
        status: response.status,
        books: [],
        total: 0,
        error: "SLiMS tidak dapat diakses dari server.",
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const books = [];
    const seen = new Set();

    function addBook(rawBook) {
      const book = normalizeBook(rawBook);

      if (!book.title || book.title === "Tanpa judul") return;
      if (isBlockedTitle(book.title)) return;

      const uniqueKey = `${book.title}-${book.url}`;

      if (seen.has(uniqueKey)) return;

      seen.add(uniqueKey);
      books.push(book);
    }

    $("a[href*='p=show_detail'], a[href*='show_detail']").each((_, el) => {
      const link = $(el).attr("href");
      const rawTitle = cleanText($(el).text());

      if (!rawTitle || rawTitle.length < 3) return;
      if (isBlockedTitle(rawTitle)) return;

      const url = makeAbsoluteUrl(link, slimsUrl);

      const container =
        $(el).closest(".item").length > 0
          ? $(el).closest(".item")
          : $(el).closest(
              "article, .card, .biblioRecord, .list-group-item, li, tr, div"
            );

      const containerText = cleanText(container.text());

      const author = getMetaValue(containerText, [
        "Author\\(s\\)",
        "Author",
        "Pengarang",
        "Penulis",
      ]);

      const publisher = getMetaValue(containerText, [
        "Publisher",
        "Penerbit",
      ]);

      const year = getMetaValue(containerText, ["Year", "Tahun"]);

      const callNumber = getMetaValue(containerText, [
        "Call Number",
        "Nomor Panggil",
      ]);

      addBook({
        title: rawTitle,
        author,
        publisher,
        year,
        callNumber,
        url,
      });
    });

    if (books.length === 0) {
      $(".item, .biblioRecord, .list-group-item, .card, article, li").each(
        (_, el) => {
          const titleCandidates = [
            cleanText($(el).find(".titleField a").first().text()),
            cleanText($(el).find(".titleField").first().text()),
            cleanText($(el).find("h3, h4, .title").first().text()),
            cleanText(
              $(el)
                .find("a")
                .filter((_, linkEl) => !isBlockedTitle($(linkEl).text()))
                .first()
                .text()
            ),
          ].filter(Boolean);

          const title = titleCandidates.find(
            (candidate) => candidate && !isBlockedTitle(candidate)
          );

          const link =
            $(el).find(".titleField a").first().attr("href") ||
            $(el)
              .find("a[href]")
              .filter((_, linkEl) => !isBlockedTitle($(linkEl).text()))
              .first()
              .attr("href");

          if (!title || title.length < 3) return;

          const text = cleanText($(el).text());
          const url = makeAbsoluteUrl(link, slimsUrl);

          addBook({
            title,
            author: getMetaValue(text, [
              "Author\\(s\\)",
              "Author",
              "Pengarang",
              "Penulis",
            ]),
            publisher: getMetaValue(text, ["Publisher", "Penerbit"]),
            year: getMetaValue(text, ["Year", "Tahun"]),
            callNumber: getMetaValue(text, ["Call Number", "Nomor Panggil"]),
            url,
          });
        }
      );
    }

    return Response.json({
      success: true,
      keywords,
      slimsUrl,
      total: books.length,
      books: books.slice(0, 8),
    });
  } catch (error) {
    return Response.json({
      success: false,
      keywords,
      slimsUrl,
      books: [],
      total: 0,
      error: "Gagal mengambil data SLiMS.",
      message: error?.message || "",
    });
  }
}