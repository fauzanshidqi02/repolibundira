const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaN7bsDC8VsR5NVneS0ZfWjSVR6MFUAndqVE58WxHiixSHVBwQEE0pP-bUZkjvZfwFbNBdq8jRexuc/pub?gid=519471870&single=true&output=csv";

const FETCH_TIMEOUT = 12000;

function withCacheBuster(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_=${Date.now()}`;
}

function proxyUrls(originalUrl) {
  const encoded = encodeURIComponent(originalUrl);

  return [
    withCacheBuster(originalUrl),
    `https://api.codetabs.com/v1/proxy?quest=${encoded}`,
    `https://api.allorigins.win/raw?url=${encoded}`,
  ];
}

async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "text/csv,text/plain,*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed ${response.status}`);
    }

    const text = await response.text();

    if (!text || !text.trim()) {
      throw new Error("CSV kosong");
    }

    if (
      text.includes("<!DOCTYPE html") ||
      text.includes("<html") ||
      text.toLowerCase().includes("too many requests")
    ) {
      throw new Error("Response bukan CSV valid");
    }

    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchCsvText() {
  const urls = proxyUrls(GOOGLE_SHEET_CSV_URL);
  let lastError = null;

  for (const url of urls) {
    try {
      const csv = await fetchWithTimeout(url);

      if (csv && csv.trim()) {
        return csv;
      }
    } catch (error) {
      lastError = error;
      console.warn("Gagal fetch CSV, mencoba sumber berikutnya:", error);
    }
  }

  console.error("Semua sumber CSV gagal:", lastError);
  return "";
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

      const hasValue = currentRow.some((cell) => String(cell).trim() !== "");

      if (hasValue) {
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

    const hasValue = currentRow.some((cell) => String(cell).trim() !== "");

    if (hasValue) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function normalizeHeader(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[_-]/g, " ")
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
  const url = String(value || "").trim();

  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return "";
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
  const hasValidation = Boolean(item.validasi);

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

  return hasTitle && hasName && hasValidation;
}

function mapRowsToRepositoryItems(rows) {
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
    cover: findColumnIndex(headers, [
      "halaman judul",
      "hal cover",
      "cover",
      "text hal cover",
    ]),
    abstrak: findColumnIndex(headers, ["abstrak", "abstract"]),
    bab1: findColumnIndex(headers, ["bab 1", "bab i"]),
    daftarPustaka: findColumnIndex(headers, [
      "daftar pustaka",
      "bibliography",
      "references",
    ]),
    fullText: findColumnIndex(headers, [
      "full pdf",
      "full text",
      "fulltext",
      "file full",
    ]),
  };

  return rows
    .slice(1)
    .map((row, index) => {
      const nama = safeCell(row, col.nama);
      const pengarang = safeCell(row, col.pengarang) || nama;
      const judul = safeCell(row, col.judul);

      const item = {
        id: `${safeCell(row, col.nim) || "repo"}-${index}`,
        timestamp: safeCell(row, col.timestamp),
        nim: safeCell(row, col.nim),
        nama,
        judul,
        pengarang,
        tanggungJawab: safeCell(row, col.tanggungJawab),
        gmd: safeCell(row, col.gmd) || "Text",
        tahun: safeCell(row, col.tahun),
        lokasiKampus: safeCell(row, col.lokasiKampus),
        subjek: safeCell(row, col.subjek),
        bahasa: safeCell(row, col.bahasa),
        dosenPembimbing: safeCell(row, col.pembimbing),
        validasi: safeCell(row, col.validasi),
        status: safeCell(row, col.status),
        catatan: safeCell(row, col.catatan),
        links: {
          cover: normalizeUrl(safeCell(row, col.cover)),
          abstrak: normalizeUrl(safeCell(row, col.abstrak)),
          bab1: normalizeUrl(safeCell(row, col.bab1)),
          daftarPustaka: normalizeUrl(safeCell(row, col.daftarPustaka)),
          fullText: normalizeUrl(safeCell(row, col.fullText)),
        },
      };

      return item;
    })
    .filter(isValidRepositoryItem);
}

export async function fetchRepositoryData() {
  const csvText = await fetchCsvText();

  if (!csvText) {
    return [];
  }

  const rows = parseCSV(csvText);
  const items = mapRowsToRepositoryItems(rows);

  return items;
}

export {
  GOOGLE_SHEET_CSV_URL,
  parseCSV,
  mapRowsToRepositoryItems,
};