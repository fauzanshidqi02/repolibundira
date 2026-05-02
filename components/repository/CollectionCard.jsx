"use client";

import { Search } from "lucide-react";

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

export default function CollectionCard({
  item,
  index = 0,
  onClick,
  onSelectItem,
}) {
  const handleClick = () => {
    if (typeof onSelectItem === "function") {
      onSelectItem(item);
      return;
    }

    if (typeof onClick === "function") {
      onClick(item);
    }
  };

  if (!item) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-400/30"
      style={{
        animationDelay: `${index * 45}ms`,
      }}
    >
      <div
        className={`relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-gradient-to-br ${getCoverGradient(
          item.id
        )} p-5`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_38%)]" />
        <div className="absolute left-0 top-0 h-full w-2 bg-black/20" />

        <div className="relative z-10 w-full text-center">
          <p className="mb-5 text-[10px] font-black uppercase tracking-[0.32em] text-white/70">
            {item.tahun || "-"}
          </p>

          <h3 className="line-clamp-5 text-base font-black uppercase leading-snug text-white drop-shadow-sm md:text-lg">
            {item.judul || "Judul belum tersedia"}
          </h3>

          <div className="mx-auto my-5 h-0.5 w-14 rounded-full bg-white/40" />

          <p className="truncate text-xs font-bold text-white/85">
            {item.nama || item.pengarang || "-"}
          </p>
        </div>

        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md">
            <Search className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h4
            className="line-clamp-2 text-base font-black leading-snug text-slate-950 dark:text-white"
            title={item.judul}
          >
            {item.judul || "Judul belum tersedia"}
          </h4>

          <p className="mt-2 truncate text-sm font-semibold text-slate-500 dark:text-slate-400">
            {item.nama || item.pengarang || "-"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-700 dark:bg-white/10 dark:text-slate-300">
            {item.subjek || "Subjek"}
          </span>

          {item.dosenPembimbing && (
            <span className="inline-flex max-w-full truncate rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              {item.dosenPembimbing}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}