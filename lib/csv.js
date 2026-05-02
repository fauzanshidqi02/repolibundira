export function parseCSV(str) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < str.length; i += 1) {
    const char = str[i];

    if (char === '"') {
      if (inQuotes && str[i + 1] === '"') {
        currentCell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && str[i + 1] === "\n") i += 1;
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.length > 1 || currentRow[0] !== "") rows.push(currentRow);

  return rows;
}

function findColumn(headers, keywords) {
  return headers.findIndex((header) => {
    const cleanHeader = header.replace(/[^a-z0-9]/g, "");
    return keywords.some((keyword) => {
      const cleanKeyword = keyword.replace(/[^a-z0-9]/g, "");
      return cleanHeader.includes(cleanKeyword);
    });
  });
}

function getValue(row, index) {
  if (index === -1 || !row || index >= row.length) return "";
  return String(row[index] || "").trim();
}

function getLink(index, row) {
  if (index === -1 || !row || index >= row.length || !row[index]) return "#";
  const value = String(row[index]).trim().replace(/["']/g, "");

  if (!value || value === "-" || value.toLowerCase() === "tidak" || value.length < 5) return "#";

  const urlMatch = value.match(/(https?:\/\/[^\s,]+)/i);
  if (urlMatch) return urlMatch[0];

  const firstToken = value.split(",")[0].split("\n")[0].trim();
  if (firstToken.length > 5 && !firstToken.includes(" ")) {
    return firstToken.startsWith("http") ? firstToken : `https://${firstToken}`;
  }

  return "#";
}

export function parseRepositoryCsv(csvText) {
  const rows = parseCSV(csvText);
  if (rows.length <= 1) return [];

  const headers = rows[0].map((header) => String(header || "").toLowerCase().trim());

  const cNim = findColumn(headers, ["nim", "npm", "nomor induk mahasiswa"]);
  const cNama = findColumn(headers, ["nama", "name", "mahasiswa"]);
  const cJudul = findColumn(headers, ["judul", "title", "tugas akhir", "skripsi"]);
  const cPengarang = findColumn(headers, ["pengarang", "author", "penulis"]);
  const cPernyataan = findColumn(headers, ["pernyataan", "statement", "tanggung jawab"]);
  const cGmd = findColumn(headers, ["gmd", "material", "jenis"]);
  const cTahun = findColumn(headers, ["tahun", "year", "waktu"]);
  const cKampus = findColumn(headers, ["kampus", "lokasi", "cabang"]);
  const cSubjek = findColumn(headers, ["subjek", "jurusan", "prodi", "program studi"]);
  const cValidasi = findColumn(headers, ["validasi"]);
  const cPenolakan = findColumn(headers, ["penolakan"]);

  let cHalamanJudul = findColumn(headers, ["upload halaman judul", "halaman judul", "cover"]);
  let cFullPdf = findColumn(headers, ["upload full tugas akhir", "full tugas akhir", "full pdf"]);
  let cAbstrak = findColumn(headers, ["upload lampiran abstrak", "lampiran abstrak", "abstrak"]);
  let cBab1 = findColumn(headers, ["upload bab 1", "upload bab i", "bab 1", "bab i"]);
  let cDaftarPustaka = findColumn(headers, ["upload daftar pustaka", "daftar pustaka", "pustaka"]);

  // Fallback sesuai posisi kolom pada file lama.
  if (cHalamanJudul === -1) cHalamanJudul = 14;
  if (cFullPdf === -1) cFullPdf = 15;
  if (cAbstrak === -1) cAbstrak = 18;
  if (cBab1 === -1) cBab1 = 19;
  if (cDaftarPustaka === -1) cDaftarPustaka = 20;

  return rows
    .slice(1)
    .map((row, index) => {
      const nama = getValue(row, cNama);

      return {
        id: index,
        nim: getValue(row, cNim),
        nama,
        judul: getValue(row, cJudul),
        pengarang: getValue(row, cPengarang) || nama,
        pernyataan: getValue(row, cPernyataan),
        gmd: getValue(row, cGmd),
        tahun: getValue(row, cTahun),
        kampus: getValue(row, cKampus),
        subjek: getValue(row, cSubjek),
        bahasa: "Indonesia",
        valValidasi: getValue(row, cValidasi),
        valPenolakan: getValue(row, cPenolakan),
        halamanJudul: getLink(cHalamanJudul, row),
        fullPdf: getLink(cFullPdf, row),
        abstrak: getLink(cAbstrak, row),
        bab1: getLink(cBab1, row),
        daftarPustaka: getLink(cDaftarPustaka, row),
      };
    })
    .filter((item) => {
      if (!item || !item.judul || item.judul.trim() === "") return false;

      if (cPenolakan !== -1) {
        const penolakan = item.valPenolakan.trim();
        if (penolakan !== "" && penolakan !== "-" && penolakan.toLowerCase() !== "tidak" && penolakan.length > 2) {
          return false;
        }
      }

      if (cValidasi !== -1) {
        const validasi = item.valValidasi.trim();
        if (validasi === "" || validasi === "-" || validasi.length < 5) return false;
        if (/\b(ditolak|revisi|gagal)\b/i.test(validasi)) return false;
      }

      return true;
    });
}
