"use client";

import { useEffect, useMemo } from "react";
import {
  X,
  User,
  FileText,
  MapPin,
  Globe2,
  Layers,
  ExternalLink,
  Download,
  Quote,
} from "lucide-react";

function safeText(value, fallback = "-") {
  const text = String(value || "").trim();
  return text || fallback;
}

function normalizeUrl(value = "") {
  let text = String(value || "").trim();

  if (!text) return "";

  text = text.replace(/^<|>$/g, "").trim();

  const foundUrl = text.match(/https?:\/\/[^\s"'<>]+/i)?.[0] || "";

  if (!foundUrl) return "";

  try {
    return decodeURIComponent(foundUrl);
  } catch {
    return foundUrl;
  }
}

function truncateText(value = "", max = 90) {
  const text = safeText(value, "");

  if (text.length <= max) return text;

  return `${text.slice(0, max).trim()}...`;
}

function getDocumentLink(item, key) {
  const links = item?.links || {};

  const candidates = [
    item?.[key],
    links?.[key],

    key === "cover" ? item?.halCover : "",
    key === "cover" ? item?.halamanCover : "",
    key === "cover" ? item?.halamanJudul : "",

    key === "abstrak" ? item?.abstract : "",
    key === "abstrak" ? item?.lampiranAbstrak : "",

    key === "bab1" ? item?.bab_1 : "",
    key === "bab1" ? item?.babI : "",
    key === "bab1" ? item?.chapter1 : "",

    key === "daftarPustaka" ? item?.bibliography : "",
    key === "daftarPustaka" ? item?.references : "",

    key === "fullText" ? item?.fulltext : "",
    key === "fullText" ? item?.full_text : "",
    key === "fullText" ? item?.fullPdf : "",
  ];

  for (const candidate of candidates) {
    const url = normalizeUrl(candidate);

    if (url) return url;
  }

  return "";
}

export default function DetailModal({ item, onClose = () => {}, t = {} }) {
  const detail = t?.detail || {};

  const documentLinks = useMemo(
    () => ({
      cover: getDocumentLink(item, "cover"),
      abstrak: getDocumentLink(item, "abstrak"),
      bab1: getDocumentLink(item, "bab1"),
      daftarPustaka: getDocumentLink(item, "daftarPustaka"),
      fullText: getDocumentLink(item, "fullText"),
    }),
    [item]
  );

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!item) return null;

  const title = safeText(item.judul || item.title, "Tanpa Judul");
  const year = safeText(item.tahun || item.year, "-");
  const subject = safeText(item.subjek || item.subject, "-");
  const studentName = safeText(item.nama || item.studentName, "-");
  const nim = safeText(item.nim || item.studentId, "-");
  const author = safeText(item.pengarang || item.author || item.nama, "-");
  const campus = safeText(item.lokasiKampus || item.campusLocation, "-");
  const language = safeText(item.bahasa || item.language, "Indonesia");
  const supervisor = safeText(
    item.dosenPembimbing || item.supervisor || item.pembimbing,
    "-"
  );

  const citationText = `${author}. (${year}). ${title}. Universitas Dian Nusantara.`;

  async function handleCopyCitation() {
    try {
      await navigator.clipboard.writeText(citationText);
      alert("Sitasi berhasil disalin.");
    } catch {
      alert(citationText);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[28px] bg-white text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-xl font-black tracking-tight">
            {detail.title || "Detail Tugas Akhir"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={detail.close || "Tutup"}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-70px)] overflow-y-auto px-6 pb-8 pt-6">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <div className="h-[280px] overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-800 to-slate-950 p-6 text-white shadow-xl shadow-blue-950/20">
              <div className="flex h-full flex-col items-center justify-between text-center">
                <p className="text-xs font-black tracking-[0.35em] text-blue-100">
                  {year}
                </p>

                <div>
                  <h3 className="text-lg font-black uppercase leading-snug tracking-wide">
                    {truncateText(title, 90)}
                  </h3>

                  <div className="mx-auto my-5 h-px w-16 bg-white/40" />

                  <p className="text-sm font-black text-blue-100">
                    {truncateText(studentName, 35)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-4xl">
                {title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {year}
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  {subject}
                </span>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-6 md:grid-cols-2">
              <InfoItem
                icon={<User className="h-5 w-5" />}
                label={detail.studentName || "Nama Mahasiswa"}
                value={studentName}
              />

              <InfoItem
                icon={<FileText className="h-5 w-5" />}
                label={detail.nim || "NIM"}
                value={nim}
              />

              <InfoItem
                icon={<User className="h-5 w-5" />}
                label={detail.author || "Pengarang"}
                value={author}
              />

              <InfoItem
                icon={<MapPin className="h-5 w-5" />}
                label={detail.campusLocation || "Lokasi Kampus"}
                value={campus}
              />

              <InfoItem
                icon={<Globe2 className="h-5 w-5" />}
                label={detail.language || "Bahasa"}
                value={language}
              />

              <InfoItem
                icon={<Layers className="h-5 w-5" />}
                label={detail.supervisor || "Dosen Pembimbing"}
                value={supervisor}
              />
            </div>
          </section>

          <div className="my-8 h-px bg-slate-200 dark:bg-white/10" />

          <section>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-slate-950 dark:text-white">
              {detail.availableDocuments || "Dokumen Tersedia"}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <DocumentButton
                label={detail.cover || "Text (Hal Cover)"}
                url={documentLinks.cover}
                unavailableText={
                  detail.documentUnavailable || "Dokumen Belum Tersedia"
                }
              />

              <DocumentButton
                label={detail.abstract || "Text (Abstrak)"}
                url={documentLinks.abstrak}
                unavailableText={
                  detail.documentUnavailable || "Dokumen Belum Tersedia"
                }
              />

              <DocumentButton
                label={detail.chapterOne || "Text (BAB 1)"}
                url={documentLinks.bab1}
                unavailableText={
                  detail.documentUnavailable || "Dokumen Belum Tersedia"
                }
              />

              <DocumentButton
                label={detail.bibliography || "Text (Daftar Pustaka)"}
                url={documentLinks.daftarPustaka}
                unavailableText={
                  detail.documentUnavailable || "Dokumen Belum Tersedia"
                }
              />

              <DocumentButton
                label={detail.fullText || "Text (Full Text)"}
                url={documentLinks.fullText}
                icon={<Download className="h-5 w-5" />}
                unavailableText={
                  detail.documentUnavailable || "Dokumen Belum Tersedia"
                }
              />

              <button
                type="button"
                onClick={handleCopyCitation}
                className="flex min-h-[64px] items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-black text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
              >
                <Quote className="h-5 w-5" />
                {detail.citation || "Sitasi"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 text-slate-400">{icon}</div>

      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-2 text-sm font-black text-slate-950 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function DocumentButton({ label, url, icon, unavailableText }) {
  const available = Boolean(url);

  if (!available) {
    return (
      <button
        type="button"
        disabled
        className="flex min-h-[64px] cursor-not-allowed flex-col items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-4 text-sm font-black text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
      >
        <span className="flex items-center gap-2">
          {icon || <FileText className="h-5 w-5" />}
          <span className="line-through">{label}</span>
        </span>

        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
          {unavailableText || "Dokumen Belum Tersedia"}
        </span>
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-[64px] items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-black text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
    >
      {icon || <FileText className="h-5 w-5" />}
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}