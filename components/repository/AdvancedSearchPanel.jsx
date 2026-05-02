"use client";

import { Search, SlidersHorizontal, UserRound, X } from "lucide-react";

export default function AdvancedSearchPanel({
  t,
  advSearch = {
    nama: "",
    nim: "",
    tahun: "",
    dosenPembimbing: "",
  },
  setAdvSearch = () => {},
  onClose = () => {},
  onApply = () => {},
  onReset = () => {},
}) {
  const safeAdvSearch = {
    nama: advSearch?.nama || "",
    nim: advSearch?.nim || "",
    tahun: advSearch?.tahun || "",
    dosenPembimbing: advSearch?.dosenPembimbing || "",
  };

  const handleChange = (field, value) => {
    setAdvSearch({
      ...safeAdvSearch,
      [field]: value,
    });
  };

  const handleResetOnlyAdvanced = () => {
    setAdvSearch({
      nama: "",
      nim: "",
      tahun: "",
      dosenPembimbing: "",
    });

    if (typeof onReset === "function") {
      onReset();
    }
  };

  return (
    <div className="mt-3 rounded-[28px] border border-slate-200 bg-white/95 p-5 text-left shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h4 className="flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
          <SlidersHorizontal className="h-5 w-5 text-blue-700 dark:text-blue-300" />
          <span>{t?.advancedSearch || "Pencarian Spesifik"}</span>
        </h4>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label={t?.close || "Tutup"}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 4 kolom rapi sejajar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdvancedInput
          label={t?.fields?.nama || "Nama Mahasiswa"}
          value={safeAdvSearch.nama}
          onChange={(value) => handleChange("nama", value)}
          placeholder="Contoh: Budi"
        />

        <AdvancedInput
          label={t?.fields?.nim || "NIM"}
          value={safeAdvSearch.nim}
          onChange={(value) => handleChange("nim", value)}
          placeholder="Contoh: 5211"
        />

        <AdvancedInput
          label={t?.fields?.tahun || "Tahun"}
          value={safeAdvSearch.tahun}
          onChange={(value) => handleChange("tahun", value)}
          placeholder="Contoh: 2024"
        />

        <AdvancedInput
          label={t?.fields?.dosenPembimbing || "Dosen Pembimbing"}
          value={safeAdvSearch.dosenPembimbing}
          onChange={(value) => handleChange("dosenPembimbing", value)}
          placeholder={
            t?.ui?.supervisorSearchPlaceholder || "Cari dosen pembimbing..."
          }
          icon={<UserRound className="h-4 w-4" />}
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={handleResetOnlyAdvanced}
          className="inline-flex justify-center rounded-2xl px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {t?.resetFilter || "Reset Filter"}
        </button>

        <button
          type="button"
          onClick={onApply}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-7 py-3 text-sm font-black text-white shadow-xl shadow-blue-700/20 transition hover:bg-blue-800"
        >
          <Search className="h-4 w-4" />
          <span>{t?.applyFilter || "Terapkan"}</span>
        </button>
      </div>
    </div>
  );
}

function AdvancedInput({ label, value, onChange, placeholder, icon }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 flex min-h-[32px] items-start gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {icon ? <span className="mt-[1px] shrink-0">{icon}</span> : null}
        <span className="leading-4">{label}</span>
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-300/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500"
      />
    </div>
  );
}