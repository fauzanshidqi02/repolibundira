"use client";

import { Quote } from "lucide-react";

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export default function CitationBox({ item }) {
  const title = clean(item?.judul) || "Judul tidak tersedia";
  const author = clean(item?.pengarang || item?.nama) || "Penulis tidak tersedia";
  const year = clean(item?.tahun) || "n.d.";
  const institution = "Universitas Dian Nusantara";
  const place = clean(item?.kampus) || "Jakarta";

  const apa = `${author}. (${year}). ${title}. ${institution}.`;
  const mla = `${author}. "${title}." ${institution}, ${year}. ${place}.`;

  return (
    <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white">
          <Quote className="h-5 w-5" />
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-950 dark:text-white">
            Sitasi
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Format rujukan untuk koleksi ini.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h5 className="text-lg font-black text-slate-950 dark:text-white">
            Gaya APA
          </h5>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
            {apa}
          </p>
        </div>

        <div>
          <h5 className="text-lg font-black text-slate-950 dark:text-white">
            Gaya MLA
          </h5>
          <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
            {mla}
          </p>
        </div>
      </div>
    </div>
  );
}