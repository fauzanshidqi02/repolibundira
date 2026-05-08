"use client";

import { ChevronLeft, ChevronRight, FileText, User, Calendar, Layers } from "lucide-react";
import CollectionCard from "./CollectionCard";

export default function CollectionSlider({
  t,
  loading = false,
  items = [],
  sliderRef,
  onSelectItem = () => {},
}) {
  const scrollLeft = () => {
    if (!sliderRef?.current) return;

    sliderRef.current.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!sliderRef?.current) return;

    sliderRef.current.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  };

  return (
    <section
      data-tour="collection"
      className="relative mb-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:p-8"
    >
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 md:text-[11px]">
            <FileText className="h-3.5 w-3.5" />
            Repository Update
          </span>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
            {t?.collectionTitle || "Koleksi Terbaru dan Diperbarui"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
            {t?.collectionDesc ||
              "Daftar koleksi terbaru yang tersedia di repository."}
          </p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={scrollLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="custom-scrollbar relative z-10 flex gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[420px] min-w-[320px] animate-pulse rounded-[28px] bg-slate-100 dark:bg-white/5"
            />
          ))
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <div key={item.id || index} className="min-w-[320px] max-w-[320px]">
              <CollectionCard
                item={item}
                index={index}
                onSelectItem={onSelectItem}
              />
            </div>
          ))
        ) : (
          <div className="w-full rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-white/10 dark:bg-white/5">
            <FileText className="mx-auto mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {t?.noResults || "Tidak ada data yang ditemukan."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}