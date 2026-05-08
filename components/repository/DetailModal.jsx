"use client";

import React, { useState } from "react";
import {
  X,
  User,
  FileText,
  MapPin,
  Globe,
  Layers,
  Download,
  ExternalLink,
  Quote,
} from "lucide-react";

import CitationBox from "./CitationBox";

function getCoverGradient(id = 0) {
  const gradients = [
    "from-blue-700 to-slate-950",
    "from-violet-700 to-slate-950",
    "from-emerald-700 to-slate-950",
    "from-indigo-700 to-slate-950",
    "from-slate-700 to-slate-950",
    "from-purple-700 to-slate-950",
  ];

  return gradients[Math.abs(Number(id) || 0) % gradients.length];
}

export default function DetailModal({ item, onClose, t }) {
  const [showCitation, setShowCitation] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-white/10 md:px-7">
          <h3 className="text-xl font-black text-slate-950 dark:text-white md:text-2xl">
            {t?.details || "Detail Tugas Akhir"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={t?.close || "Tutup"}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-5 md:p-7">
          <div className="mb-8 flex flex-col gap-6 md:flex-row">
            <div
              className={`hidden aspect-[3/4] w-52 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${getCoverGradient(
                item.id
              )} p-5 shadow-xl md:flex`}
            >
              <div className="text-center">
                <p className="mb-5 text-[10px] font-black uppercase tracking-[0.32em] text-white/70">
                  {item.tahun || "-"}
                </p>

                <h4 className="line-clamp-6 text-lg font-black uppercase leading-snug text-white">
                  {item.judul || "-"}
                </h4>

                <div className="mx-auto my-5 h-0.5 w-14 rounded-full bg-white/40" />

                <p className="truncate text-xs font-bold text-white/85">
                  {item.nama || item.pengarang || "-"}
                </p>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black leading-tight text-slate-950 dark:text-white md:text-4xl">
                {item.judul || "-"}
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {item.tahun || "-"}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-300">
                  {item.subjek || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5 md:grid-cols-2 md:p-6">
            <DetailRow
              icon={<User />}
              label={t?.fields?.nama || "Nama Mahasiswa"}
              value={item.nama}
            />
            <DetailRow
              icon={<FileText />}
              label={t?.fields?.nim || "NIM"}
              value={item.nim}
            />
            <DetailRow
              icon={<User />}
              label={t?.fields?.pengarang || "Pengarang"}
              value={item.pengarang}
            />
            <DetailRow
              icon={<MapPin />}
              label={t?.fields?.kampus || "Lokasi Kampus"}
              value={item.kampus}
            />
            <DetailRow
              icon={<Globe />}
              label={t?.fields?.bahasa || "Bahasa"}
              value={item.bahasa}
            />
            <DetailRow
              icon={<Layers />}
              label={t?.fields?.dosenPembimbing || "Dosen Pembimbing"}
              value={item.dosenPembimbing}
            />
          </div>

          <div className="mt-8 border-t border-slate-200 pt-7 dark:border-white/10">
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-slate-950 dark:text-white">
              {t?.ui?.availableDocuments || "Dokumen Tersedia"}
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DocLinkButton
                href={item.halamanJudul}
                icon={FileText}
                label={t?.actions?.viewCover || "Text (Hal Cover)"}
                emptyLabel={t?.ui?.emptyData || "Dokumen Belum Tersedia"}
              />

              <DocLinkButton
                href={item.abstrak}
                icon={FileText}
                label={t?.actions?.viewAbstrak || "Text (Abstrak)"}
                emptyLabel={t?.ui?.emptyData || "Dokumen Belum Tersedia"}
              />

              <DocLinkButton
                href={item.bab1}
                icon={FileText}
                label={t?.actions?.viewBab1 || "Text (BAB 1)"}
                emptyLabel={t?.ui?.emptyData || "Dokumen Belum Tersedia"}
              />

              <DocLinkButton
                href={item.daftarPustaka}
                icon={FileText}
                label={t?.actions?.viewPustaka || "Text (Daftar Pustaka)"}
                emptyLabel={t?.ui?.emptyData || "Dokumen Belum Tersedia"}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DocLinkButton
                href={item.fullPdf}
                icon={Download}
                label={t?.actions?.viewFullPdf || "Text (Full Text)"}
                primary
                emptyLabel={t?.ui?.emptyData || "Dokumen Belum Tersedia"}
              />

              <button
                type="button"
                onClick={() => setShowCitation((current) => !current)}
                className={`flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl border px-5 py-4 text-center text-sm font-black transition hover:-translate-y-0.5 ${
                  showCitation
                    ? "border-blue-700 bg-blue-700 text-white shadow-xl shadow-blue-700/20 hover:bg-blue-800"
                    : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/15"
                }`}
              >
                <Quote className="h-5 w-5" />
                <span>Sitasi</span>
              </button>
            </div>

            {showCitation && <CitationBox item={item} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500">
        {React.cloneElement(icon, { size: 19 })}
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="break-words text-sm font-bold text-slate-950 dark:text-slate-100">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function DocLinkButton({
  href,
  icon: Icon,
  label,
  primary = false,
  emptyLabel = "Dokumen Belum Tersedia",
}) {
  const isAvailable = href && href !== "#";

  if (!isAvailable) {
    return (
      <div className="flex min-h-[58px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-center opacity-90 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <Icon className="h-4 w-4" />
          <span className="text-sm font-black line-through">{label}</span>
        </div>

        <span className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-rose-500">
          {emptyLabel}
        </span>
      </div>
    );
  }

  if (primary) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-4 text-center text-sm font-black text-white shadow-xl shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-center text-sm font-black text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/15"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}