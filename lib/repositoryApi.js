import { parseCSV } from "./csv";
import { mockData } from "@/data/mockData";

const DEFAULT_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSaN7bsDC8VsR5NVneS0ZfWjSVR6MFUAndqVE58WxHiixSHVBwQEE0pP-bUZkjvZfwFbNBdq8jRexuc/pub?gid=519471870&single=true&output=csv";

const SHEET_CSV_URL =
  process.env.NEXT_PUBLIC_SHEET_CSV_URL || DEFAULT_SHEET_CSV_URL;

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function extractLink(value) {
  if (!value) return "#";

  let text = String(value).trim().replace(/["']/g, "");

  if (
    !text ||
    text === "-" ||
    text.toLowerCase() === "tidak" ||
    text.toLowerCase() === "kosong" ||
    text.length < 5
  ) {
    return "#";
  }

  const urlRegex = /(https?:\/\/[^\s,]+)/i;
  const match = text.match(urlRegex);

  if (match) {
    return match[0];
  }

  const firstWord = text.split(",")[0].split("\n")[0].trim();

  if (firstWord.length > 5 && !firstWord.includes(" ")) {
    return firstWord.startsWith("http") ? firstWord : `https://${firstWord}`;
  }

  return "#";
}

async function fetchCsvText() {
  const cacheBuster = Date.now();
  const sheetUrl = `${SHEET_CSV_URL}${
    SHEET_CSV_URL.includes("?") ? "&" : "?"
  }cb=${cacheBuster}`;

  const urls = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(
      sheetUrl
    )}&disableCache=true`,
    sheetUrl,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(sheetUrl)}`,
  ];

  let lastError = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Fetch gagal: ${response.status}`);
      }

      const text = await response.text();

      if (
        !text ||
        text.trim().toLowerCase().startsWith("<!doctype html>") ||
        text.trim().toLowerCase().startsWith("<html")
      ) {
        throw new Error("Response bukan CSV");
      }

      return text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gagal mengambil data Google Sheet");
}

export async function fetchRepositoryData() {
  try {
    const csvText = await fetchCsvText();
    const rows = parseCSV(csvText);

    if (!rows || rows.length <= 1) {
      throw new Error("Data Google Sheet kosong");
    }

    const headers = rows[0].map((header) => String(header || "").trim());

    const findCol = (keywords) => {
      return headers.findIndex((header) => {
        const cleanHeader = normalizeText(header);

        return keywords.some((keyword) => {
          const cleanKeyword = normalizeText(keyword);
          return cleanHeader.includes(cleanKeyword);
        });
      });
    };

    const cNim = findCol(["nim", "npm", "nomor induk mahasiswa"]);
    const cNama = findCol(["nama", "name", "mahasiswa"]);
    const cJudul = findCol(["judul", "title", "tugas akhir", "skripsi"]);
    const cPengarang = findCol(["pengarang", "author", "penulis"]);

    const cPernyataan = findCol([
      "pernyataan",
      "statement",
      "tanggung jawab",
    ]);

    const cDosenPembimbing = findCol([
      "pernyataan tanggung jawab dosen pembimbing",
      "dosen pembimbing",
      "pembimbing",
      "nama dosen pembimbing",
      "supervisor",
    ]);

    const cGmd = findCol(["gmd", "material", "jenis"]);
    const cTahun = findCol(["tahun", "year", "waktu"]);
    const cKampus = findCol(["kampus", "lokasi", "cabang"]);
    const cSubjek = findCol([
      "subjek",
      "jurusan",
      "prodi",
      "program studi",
    ]);
    const cBahasa = findCol(["bahasa", "language"]);
    const cValidasi = findCol(["validasi"]);
    const cPenolakan = findCol(["penolakan"]);

    const cOaiBaseUrl = findCol([
      "oai base url",
      "oai",
      "base url",
      "oai-pmh",
      "oai pmh",
      "repository oai",
    ]);

    let cHalamanJudul = findCol([
      "upload halaman judul",
      "halaman judul",
      "hal cover",
      "cover",
    ]);

    let cFullPdf = findCol([
      "upload full tugas akhir",
      "full tugas akhir",
      "full pdf",
      "full text",
      "fulltext",
    ]);

    let cAbstrak = findCol([
      "upload lampiran abstrak",
      "lampiran abstrak",
      "abstrak",
      "abstract",
    ]);

    let cBab1 = findCol([
      "upload bab 1",
      "upload bab i",
      "bab 1",
      "bab i",
    ]);

    let cDaftarPustaka = findCol([
      "upload daftar pustaka",
      "daftar pustaka",
      "pustaka",
      "bibliography",
    ]);

    if (cHalamanJudul === -1) cHalamanJudul = 14;
    if (cFullPdf === -1) cFullPdf = 15;
    if (cAbstrak === -1) cAbstrak = 18;
    if (cBab1 === -1) cBab1 = 19;
    if (cDaftarPustaka === -1) cDaftarPustaka = 20;

    // Fallback kolom I untuk Dosen Pembimbing
    // Index JavaScript: A = 0, B = 1, C = 2, ... I = 8
    const finalCDosenPembimbing =
      cDosenPembimbing !== -1 ? cDosenPembimbing : 8;

    const parsedData = rows
      .slice(1)
      .map((row, index) => {
        if (!row) return null;

        const nama = cNama !== -1 ? String(row[cNama] || "").trim() : "";
        const pengarang =
          cPengarang !== -1
            ? String(row[cPengarang] || "").trim()
            : nama;

        return {
          id: index,

          nim: cNim !== -1 ? String(row[cNim] || "").trim() : "",
          nama,
          judul: cJudul !== -1 ? String(row[cJudul] || "").trim() : "",
          pengarang,

          pernyataan:
            cPernyataan !== -1 ? String(row[cPernyataan] || "").trim() : "",

          dosenPembimbing: String(
            row[finalCDosenPembimbing] || ""
          ).trim(),

          // GMD tetap disimpan untuk kebutuhan lama, tapi tidak ditampilkan di modal.
          gmd: cGmd !== -1 ? String(row[cGmd] || "").trim() : "",

          tahun: cTahun !== -1 ? String(row[cTahun] || "").trim() : "",
          kampus: cKampus !== -1 ? String(row[cKampus] || "").trim() : "",
          subjek: cSubjek !== -1 ? String(row[cSubjek] || "").trim() : "",
          bahasa: cBahasa !== -1 ? String(row[cBahasa] || "").trim() : "",

          valValidasi:
            cValidasi !== -1 ? String(row[cValidasi] || "").trim() : "",
          valPenolakan:
            cPenolakan !== -1 ? String(row[cPenolakan] || "").trim() : "",

          halamanJudul: extractLink(row[cHalamanJudul]),
          fullPdf: extractLink(row[cFullPdf]),
          abstrak: extractLink(row[cAbstrak]),
          bab1: extractLink(row[cBab1]),
          daftarPustaka: extractLink(row[cDaftarPustaka]),

          oaiBaseUrl: cOaiBaseUrl !== -1 ? extractLink(row[cOaiBaseUrl]) : "#",
        };
      })
      .filter((item) => {
        if (!item || !item.judul || item.judul.trim() === "") {
          return false;
        }

        if (cPenolakan !== -1) {
          const value = item.valPenolakan.trim();

          if (
            value !== "" &&
            value !== "-" &&
            value.toLowerCase() !== "tidak" &&
            value.length > 2
          ) {
            return false;
          }
        }

        if (cValidasi !== -1) {
          const value = item.valValidasi.trim();

          if (value === "" || value === "-" || value.length < 5) {
            return false;
          }

          const isRejected = /\b(ditolak|revisi|gagal)\b/i.test(value);

          if (isRejected) {
            return false;
          }
        }

        return true;
      });

    if (parsedData.length > 0) {
      return parsedData;
    }

    throw new Error("Data hasil parsing kosong");
  } catch (error) {
    console.warn("Menggunakan mock data karena Google Sheet gagal:", error);
    return mockData;
  }
}

export default fetchRepositoryData;