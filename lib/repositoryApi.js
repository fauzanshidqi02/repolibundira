const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaN7bsDC8VsR5NVneS0ZfWjSVR6MFUAndqVE58WxHiixSHVBwQEE0pP-bUZkjvZfwFbNBdq8jRexuc/pub?gid=519471870&single=true&output=csv";

const GOOGLE_SHEET_HTML_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaN7bsDC8VsR5NVneS0ZfWjSVR6MFUAndqVE58WxHiixSHVBwQEE0pP-bUZkjvZfwFbNBdq8jRexuc/pubhtml?gid=519471870&single=true";

const FETCH_TIMEOUT = 12000;

const DOCUMENT_COLUMNS = {
  cover: 14, // O - Hal Cover
  fullText: 15, // P - Full Text
  abstrak: 18, // S - Abstrak
  bab1: 19, // T - BAB 1
  daftarPustaka: 20, // U - Daftar Pustaka
};

function withCacheBuster(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_=${Date.now()}`;
}

async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(withCacheBuster(url), {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Fetch failed ${response.status}`);
    }

    const text = await response.text();

    if (!text || !text.trim()) {
      throw new Error("Response kosong");
    }

    return text;
  } finally {
    clearTimeout(timer);
  }
}

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentValue += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }

      currentRow.push(currentValue);

      if (currentRow.some((cell) => String(cell).trim() !== "")) {
        rows.push(currentRow);
      }

      currentRow = [];
      currentValue = "";
      continue;
    }

    currentValue += char;
  }

  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue);

    if (currentRow.some((cell) => String(cell).trim() !== "")) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function normalizeHeader(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/[()]/g, " ")
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findColumnIndex(headers, keywords) {
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));

  return normalizedHeaders.findIndex((header) =>
    keywords.some((keyword) => header.includes(normalizeHeader(keyword)))
  );
}

function safeCell(row, index) {
  if (index === -1 || index === undefined || index === null) return "";
  return String(row[index] || "").trim();
}

function normalizeUrl(value = "") {
  let text = String(value || "").trim();

  if (!text) return "";

  text = text.replace(/^<|>$/g, "").trim();

  const directUrl = text.match(/https?:\/\/[^\s"'<>]+/i)?.[0] || "";

  if (!directUrl) return "";

  try {
    const decoded = decodeURIComponent(directUrl);
    const urlObject = new URL(decoded);

    const qUrl = urlObject.searchParams.get("q");
    const urlParam = urlObject.searchParams.get("url");

    if (qUrl?.startsWith("http")) return qUrl;
    if (urlParam?.startsWith("http")) return urlParam;

    return decoded;
  } catch {
    return directUrl;
  }
}

function extractLinkFromHtmlCell(cell) {
  if (!cell) return "";

  const anchor = cell.querySelector("a[href]");

  if (anchor) {
    const href = anchor.getAttribute("href") || "";
    const text = anchor.textContent || "";

    const hrefUrl = normalizeUrl(href);
    if (hrefUrl) return hrefUrl;

    const textUrl = normalizeUrl(text);
    if (textUrl) return textUrl;
  }

  return normalizeUrl(cell.textContent || "");
}

function parseDocumentLinksFromHtml(htmlText) {
  if (typeof window === "undefined") return {};

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");
  const rows = Array.from(doc.querySelectorAll("table tr"));

  const linkMap = {};

  rows.forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll("td"));

    if (cells.length === 0) return;

    const nim = String(cells[1]?.textContent || "").trim();

    if (!nim) return;

    linkMap[nim] = {
      cover: extractLinkFromHtmlCell(cells[DOCUMENT_COLUMNS.cover]),
      fullText: extractLinkFromHtmlCell(cells[DOCUMENT_COLUMNS.fullText]),
      abstrak: extractLinkFromHtmlCell(cells[DOCUMENT_COLUMNS.abstrak]),
      bab1: extractLinkFromHtmlCell(cells[DOCUMENT_COLUMNS.bab1]),
      daftarPustaka: extractLinkFromHtmlCell(
        cells[DOCUMENT_COLUMNS.daftarPustaka]
      ),
    };
  });

  return linkMap;
}

function isRejectedRow(text = "") {
  const value = String(text || "").toLowerCase();

  return (
    value.includes("ditolak") ||
    value.includes("revisi") ||
    value.includes("gagal") ||
    value.includes("invalid")
  );
}

function isValidRepositoryItem(item) {
  const hasTitle = Boolean(item.judul);
  const hasName = Boolean(item.nama || item.pengarang);

  const rejectionText = [
    item.validasi,
    item.status,
    item.catatan,
    item.judul,
    item.nama,
  ]
    .join(" ")
    .toLowerCase();

  if (isRejectedRow(rejectionText)) {
    return false;
  }

  return hasTitle && hasName;
}

function mapRowsToRepositoryItems(rows, htmlLinks = {}) {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];

  const col = {
    timestamp: findColumnIndex(headers, ["timestamp", "waktu"]),
    nim: findColumnIndex(headers, ["nim"]),
    nama: findColumnIndex(headers, ["nama mahasiswa", "nama"]),
    judul: findColumnIndex(headers, ["judul tugas akhir", "judul"]),
    pengarang: findColumnIndex(headers, ["pengarang", "author", "penulis"]),
    tanggungJawab: findColumnIndex(headers, [
      "pernyataan tanggung jawab",
      "tanggung jawab",
    ]),
    gmd: findColumnIndex(headers, ["gmd", "general material designation"]),
    tahun: findColumnIndex(headers, ["tahun"]),
    lokasiKampus: findColumnIndex(headers, ["lokasi kampus", "kampus"]),
    subjek: findColumnIndex(headers, ["subjek", "program studi", "prodi"]),
    bahasa: findColumnIndex(headers, ["bahasa"]),
    pembimbing: findColumnIndex(headers, [
      "dosen pembimbing",
      "pembimbing",
      "supervisor",
    ]),
    validasi: findColumnIndex(headers, ["validasi", "validation"]),
    status: findColumnIndex(headers, ["status"]),
    catatan: findColumnIndex(headers, ["catatan", "keterangan"]),

    cover: DOCUMENT_COLUMNS.cover,
    fullText: DOCUMENT_COLUMNS.fullText,
    abstrak: DOCUMENT_COLUMNS.abstrak,
    bab1: DOCUMENT_COLUMNS.bab1,
    daftarPustaka: DOCUMENT_COLUMNS.daftarPustaka,
  };

  return rows
    .slice(1)
    .map((row, index) => {
      const nim = safeCell(row, col.nim);
      const nama = safeCell(row, col.nama);
      const pengarang = safeCell(row, col.pengarang) || nama;
      const judul = safeCell(row, col.judul);

      const docLinks = htmlLinks[nim] || {};

      const coverFromCsv = normalizeUrl(safeCell(row, col.cover));
      const fullTextFromCsv = normalizeUrl(safeCell(row, col.fullText));
      const abstrakFromCsv = normalizeUrl(safeCell(row, col.abstrak));
      const bab1FromCsv = normalizeUrl(safeCell(row, col.bab1));
      const daftarPustakaFromCsv = normalizeUrl(
        safeCell(row, col.daftarPustaka)
      );

      const coverLink = docLinks.cover || coverFromCsv;
      const fullTextLink = docLinks.fullText || fullTextFromCsv;
      const abstrakLink = docLinks.abstrak || abstrakFromCsv;
      const bab1Link = docLinks.bab1 || bab1FromCsv;
      const daftarPustakaLink =
        docLinks.daftarPustaka || daftarPustakaFromCsv;

      const item = {
        id: `${nim || "repo"}-${index}`,
        timestamp: safeCell(row, col.timestamp),
        nim,
        nama,
        judul,
        pengarang,
        tanggungJawab: safeCell(row, col.tanggungJawab),
        gmd: safeCell(row, col.gmd) || "Text",
        tahun: safeCell(row, col.tahun),
        lokasiKampus: safeCell(row, col.lokasiKampus),
        subjek: safeCell(row, col.subjek),
        bahasa: safeCell(row, col.bahasa) || "Indonesia",
        dosenPembimbing: safeCell(row, col.pembimbing),
        validasi: safeCell(row, col.validasi),
        status: safeCell(row, col.status),
        catatan: safeCell(row, col.catatan),

        cover: coverLink,
        fullText: fullTextLink,
        abstrak: abstrakLink,
        bab1: bab1Link,
        daftarPustaka: daftarPustakaLink,

        links: {
          cover: coverLink,
          fullText: fullTextLink,
          abstrak: abstrakLink,
          bab1: bab1Link,
          daftarPustaka: daftarPustakaLink,
        },
      };

      return item;
    })
    .filter(isValidRepositoryItem);
}

export async function fetchRepositoryData() {
  const csvText = await fetchWithTimeout(GOOGLE_SHEET_CSV_URL);

  if (!csvText) return [];

  const rows = parseCSV(csvText);

  let htmlLinks = {};

  try {
    const htmlText = await fetchWithTimeout(GOOGLE_SHEET_HTML_URL);
    htmlLinks = parseDocumentLinksFromHtml(htmlText);
  } catch (error) {
    console.warn("Gagal mengambil link dokumen dari pubhtml:", error);
  }

  return mapRowsToRepositoryItems(rows, htmlLinks);
}

export {
  GOOGLE_SHEET_CSV_URL,
  GOOGLE_SHEET_HTML_URL,
  DOCUMENT_COLUMNS,
  parseCSV,
  mapRowsToRepositoryItems,
};