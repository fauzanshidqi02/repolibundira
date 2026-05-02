"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Sparkles,
  UserRound,
} from "lucide-react";

const accentStyles = [
  {
    bg: "from-blue-600 via-indigo-600 to-slate-950",
    glow: "bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-300",
    pill: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  },
  {
    bg: "from-emerald-600 via-teal-700 to-slate-950",
    glow: "bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-300",
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    bg: "from-violet-600 via-purple-700 to-slate-950",
    glow: "bg-violet-500/20",
    text: "text-violet-700 dark:text-violet-300",
    pill: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
  {
    bg: "from-orange-500 via-amber-700 to-slate-950",
    glow: "bg-orange-500/20",
    text: "text-orange-700 dark:text-orange-300",
    pill: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
  },
];

export default function CollectionSlider({
  t,
  loading,
  items,
  sliderRef,
  onSelectItem,
}) {
  const scrollSlider = (direction) => {
    if (!sliderRef?.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative mt-14 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:p-8">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 md:text-[11px]">
            <Sparkles className="h-3.5 w-3.5" />
            Repository Update
          </span>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
            {t.collectionTitle}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
            {t.collectionDesc}
          </p>
        </div>

        {!loading && items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-blue-400/30"
              aria-label="Geser kiri"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollSlider("right")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-blue-400/30"
              aria-label="Geser kanan"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10">
        {loading ? (
          <LoadingState t={t} />
        ) : items.length > 0 ? (
          <div
            ref={sliderRef}
            className="hide-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3"
          >
            {items.map((item, index) => (
              <RepositoryUpdateCard
                key={item.id}
                item={item}
                index={index}
                onSelectItem={onSelectItem}
              />
            ))}
          </div>
        ) : (
          <EmptyState t={t} />
        )}
      </div>
    </section>
  );
}

function RepositoryUpdateCard({ item, index, onSelectItem }) {
  const accent = accentStyles[index % accentStyles.length];

  return (
    <button
      type="button"
      onClick={() => onSelectItem(item)}
      className="group relative min-h-[280px] w-[300px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 text-left shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:bg-white hover:shadow-2xl hover:shadow-slate-300/70 dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-400/30 dark:hover:bg-white/10 sm:w-[360px] md:w-[420px]"
    >
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accent.bg}`}
      />

      <div className={`absolute right-8 top-8 h-28 w-28 rounded-full ${accent.glow} blur-3xl`} />

      <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-between p-5 md:p-6">
        <div>
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur-md">
              <FileText className="h-7 w-7" />
            </div>

            <div className="rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur-md">
              {item.tahun || "-"}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950/80">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-black ${accent.pill}`}>
                {item.subjek || "Subjek belum tersedia"}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500 dark:bg-white/5 dark:text-slate-400">
                Tugas Akhir
              </span>
            </div>

            <h3 className="line-clamp-3 text-lg font-black leading-snug text-slate-950 dark:text-white md:text-xl">
              {item.judul || "Judul belum tersedia"}
            </h3>

            <div className="mt-5 grid gap-3">
              <MetaItem
                icon={<UserRound className="h-4 w-4" />}
                label="Mahasiswa"
                value={item.nama || item.pengarang || "-"}
              />

              <MetaItem
                icon={<CalendarDays className="h-4 w-4" />}
                label="Tahun"
                value={item.tahun || "-"}
              />

              <MetaItem
                icon={<Layers className="h-4 w-4" />}
                label="Program Studi"
                value={item.subjek || "-"}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${accent.glow.replace("/20", "")}`} />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Klik untuk melihat detail
            </span>
          </div>

          <span
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:translate-x-1 dark:bg-white dark:text-slate-950`}
          >
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </button>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-bold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function LoadingState({ t }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
        <BookOpen className="h-7 w-7 animate-pulse" />
      </div>

      <p className="font-bold text-slate-500 dark:text-slate-400">
        {t.ui.loading}
      </p>
    </div>
  );
}

function EmptyState({ t }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-white/10 dark:bg-white/5">
      <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />

      <p className="text-lg font-black text-slate-800 dark:text-white">
        {t.noResults}
      </p>
    </div>
  );
}