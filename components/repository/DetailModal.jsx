"use client";

import React from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  User,
  X,
} from "lucide-react";

export default function DetailModal({ item, onClose, t }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-white/10 md:px-6">
          <h3 className="text-xl font-black text-slate-950 dark:text-white md:text-2xl">
            {t.details}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={t.close}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-6 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="hidden w-52 shrink-0 md:block">
              <MiniCover item={item} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black uppercase leading-tight tracking-tight text-slate-950 dark:text-white md:text-4xl">
                {item.judul || "-"}
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {item.tahun || "-"}
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-300">
                  {item.subjek || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 rounded-[24px] border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5 md:grid-cols-2">
            <DetailRow
              icon={<User />}
              label={t.fields.nama}
              value={item.nama}
            />

            <DetailRow
              icon={<FileText />}
              label={t.fields.nim}
              value={item.nim}
            />

            <DetailRow
              icon={<User />}
              label={t.fields.pengarang}
              value={item.pengarang}
            />

            <DetailRow
              icon={<MapPin />}
              label={t.fields.kampus}
              value={item.kampus}
            />

            <DetailRow
              icon={<Globe />}
              label={t.fields.bahasa}
              value={item.bahasa}
            />

            <DetailRow
              icon={<User />}
              label={t.fields.dosenPembimbing}
              value={item.dosenPembimbing}
            />
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6 dark:border-white/10">
            <h4 className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-slate-800 dark:text-white">
              {t.ui.availableDocuments || "Dokumen Tersedia"}
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DocLinkButton
                href={item.halamanJudul}
                icon={FileText}
                label={t.actions.viewCover}
                emptyLabel={t.ui.emptyData}
              />

              <DocLinkButton
                href={item.abstrak}
                icon={FileText}
                label={t.actions.viewAbstrak}
                emptyLabel={t.ui.emptyData}
              />

              <DocLinkButton
                href={item.bab1}
                icon={FileText}
                label={t.actions.viewBab1}
                emptyLabel={t.ui.emptyData}
              />

              <DocLinkButton
                href={item.daftarPustaka}
                icon={FileText}
                label={t.actions.viewPustaka}
                emptyLabel={t.ui.emptyData}
              />

              {item.oaiBaseUrl && item.oaiBaseUrl !== "#" && (
                <DocLinkButton
                  href={item.oaiBaseUrl}
                  icon={ExternalLink}
                  label={t.actions.viewOaiBaseUrl}
                  emptyLabel={t.ui.emptyData}
                />
              )}
            </div>

            <div className="mt-4">
              <DocLinkButton
                href={item.fullPdf}
                icon={Download}
                label={t.actions.viewFullPdf}
                primary
                emptyLabel={t.ui.emptyData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCover({ item }) {
  const gradients = [
    "from-blue-700 to-slate-950",
    "from-violet-700 to-slate-950",
    "from-emerald-700 to-slate-950",
    "from-indigo-700 to-slate-950",
    "from-rose-700 to-slate-950",
  ];

  const gradient = gradients[item.id % gradients.length];

  return (
    <div
      className={`relative flex aspect-[3/4] w-full overflow-hidden rounded-[24px] bg-gradient-to-br ${gradient} p-5 shadow-2xl`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <p className="mb-5 text-[11px] font-black uppercase tracking-[0.32em] text-white/70">
          {item.tahun || "-"}
        </p>

        <h4 className="line-clamp-6 text-lg font-black uppercase leading-snug text-white">
          {item.judul || "-"}
        </h4>

        <div className="my-5 h-0.5 w-14 rounded-full bg-white/40" />

        <p className="line-clamp-2 text-xs font-bold text-white/80">
          {item.nama || item.pengarang || "-"}
        </p>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex shrink-0 text-slate-400 dark:text-slate-500">
        {React.cloneElement(icon, {
          size: 19,
        })}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-slate-950 dark:text-slate-100">
          {value && String(value).trim() !== "" ? value : "-"}
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
  emptyLabel = "Data Kosong di Sheet",
}) {
  const isAvailable = href && href !== "#";

  if (!isAvailable) {
    return (
      <div className="flex w-full cursor-not-allowed flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-center opacity-80 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
          <Icon className="h-4 w-4" />
          <span className="text-sm font-black line-through">{label}</span>
        </div>

        <span className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-500">
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-4 text-sm font-black text-white shadow-xl shadow-blue-700/20 transition hover:bg-blue-800"
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
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-center text-sm font-black text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <ExternalLink className="h-4 w-4" />
    </a>
  );
}