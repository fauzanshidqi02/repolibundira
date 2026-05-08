import * as cheerio from "cheerio";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get("keywords") || "";

  const slimsUrl = `https://digilib.undira.ac.id/slims/index.php?keywords=${encodeURIComponent(
    keywords
  )}&search=search`;

  try {
    const response = await fetch(slimsUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const books = [];
    const seen = new Set();

    $("a[href*='p=show_detail'], a[href*='show_detail']").each((_, el) => {
      const link = $(el).attr("href");
      const title = $(el).text().replace(/\s+/g, " ").trim();

      if (!title || title.length < 3) return;

      const url = link
        ? new URL(link, "https://digilib.undira.ac.id/slims/").href
        : slimsUrl;

      if (seen.has(url)) return;
      seen.add(url);

      const container = $(el).closest("div, article, li, tr");
      const text = container.text().replace(/\s+/g, " ").trim();

      let author = "-";

      const authorMatch =
        text.match(/Author\(s\)\s*:\s*([^|]+?)(Publisher|ISBN|Call Number|Availability|$)/i) ||
        text.match(/Pengarang\s*:\s*([^|]+?)(Penerbit|ISBN|Nomor|Ketersediaan|$)/i);

      if (authorMatch?.[1]) {
        author = authorMatch[1].trim();
      }

      books.push({
        title,
        author,
        url,
      });
    });

    if (books.length === 0) {
      $(".item, .biblioRecord, .list-group-item, .card, article").each(
        (_, el) => {
          const title =
            $(el).find("a").first().text().replace(/\s+/g, " ").trim() ||
            $(el).find("h3, h4, .title, .titleField").first().text().trim();

          const link = $(el).find("a").first().attr("href");

          if (!title || title.length < 3) return;

          const url = link
            ? new URL(link, "https://digilib.undira.ac.id/slims/").href
            : slimsUrl;

          if (seen.has(url)) return;
          seen.add(url);

          books.push({
            title,
            author: "-",
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
      error: "Gagal mengambil data SLiMS.",
    });
  }
}