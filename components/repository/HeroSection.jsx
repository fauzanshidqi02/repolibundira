"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import AdvancedSearchPanel from "./AdvancedSearchPanel";

export default function HeroSection({
  t,
  searchQuery = "",
  setSearchQuery = () => {},
  advSearch = {
    nama: "",
    nim: "",
    tahun: "",
    dosenPembimbing: "",
  },
  setAdvSearch = () => {},
  isAdvSearchOpen = false,
  setIsAdvSearchOpen = () => {},
  handleSearchSubmit = () => {},
  resetFilters = () => {},
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-12 text-white md:pt-16">
      <div className="absolute inset-0 bg-[url('/library-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-slate-950/90 to-slate-950" />

      <div className="relative z-10 mx-auto flex min-h-[340px] w-full max-w-7xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 md:min-h-[420px] lg:px-8">
        <form
          data-tour="search"
          onSubmit={handleSearchSubmit}
          className="relative z-20 w-full max-w-4xl"
        >
          <div className="flex flex-col gap-3">
            <div className="relative flex min-h-[72px] overflow-hidden rounded-[34px] border border-white/20 bg-white shadow-2xl shadow-blue-950/30 transition focus-within:ring-4 focus-within:ring-blue-400/30 md:rounded-full">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={
                    t?.searchPlaceholder ||
                    "Masukkan kata kunci judul, nama, NIM, prodi, atau tahun..."
                  }
                  className="h-full min-h-[72px] w-full border-0 bg-transparent pl-16 pr-4 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-500 focus:ring-0 md:text-base"
                />
              </div>

              <button
                type="submit"
                className="m-2 inline-flex min-w-[150px] items-center justify-center gap-2 rounded-[28px] bg-blue-700 px-6 py-4 text-sm font-black text-white transition hover:bg-blue-800 md:rounded-full"
              >
                <Search className="h-5 w-5" />
                <span>{t?.ui?.searchCollection || "Cari Koleksi"}</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                data-tour="advanced"
                type="button"
                onClick={() => setIsAdvSearchOpen(!isAdvSearchOpen)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white shadow-lg backdrop-blur-md transition hover:bg-white/15"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>{t?.advancedSearch || "Pencarian Spesifik"}</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    isAdvSearchOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </form>

        {isAdvSearchOpen && (
          <div className="relative z-30 mt-4 w-full max-w-6xl">
            <AdvancedSearchPanel
              t={t}
              advSearch={advSearch}
              setAdvSearch={setAdvSearch}
              onClose={() => setIsAdvSearchOpen(false)}
              onApply={handleSearchSubmit}
              onReset={resetFilters}
            />
          </div>
        )}
      </div>
    </section>
  );
}