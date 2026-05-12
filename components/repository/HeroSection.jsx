"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import AdvancedSearchPanel from "./AdvancedSearchPanel";

export default function HeroSection({
  t = {},
  searchQuery = "",
  setSearchQuery = () => {},
  advSearch = {},
  setAdvSearch = () => {},
  isAdvSearchOpen = false,
  setIsAdvSearchOpen = () => {},
  handleSearchSubmit = () => {},
  resetFilters = () => {},
}) {
  const hero = t?.hero || {};
  const ui = t?.ui || {};

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-24 text-white md:pt-28">
      {/* Background ringan */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(37,99,235,0.18),_transparent_30%),linear-gradient(135deg,_#0f172a_0%,_#020617_45%,_#0b1f5e_100%)]" />

      {/* Animasi blur ringan */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-16 top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute right-0 top-8 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-8 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-pulse"
          style={{ animationDuration: "7s" }}
        />
      </div>

      {/* Grid halus */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative mx-auto flex min-h-[280px] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 md:min-h-[320px] md:py-14 lg:px-8">
        <div className="w-full max-w-4xl">
          <form
            data-tour="search-box"
            onSubmit={handleSearchSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm"
          >
            <div className="flex flex-col gap-3 rounded-[1.6rem] bg-white p-2 shadow-inner sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[1.4rem] px-4 py-3 text-slate-800">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={
                    hero.searchPlaceholder ||
                    "Telusuri tugas akhir, buku, artikel, penulis, prodi, atau tahun..."
                  }
                  className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none md:text-base"
                />
              </div>

              <button
                data-tour="advanced-search-button"
                type="button"
                onClick={() => setIsAdvSearchOpen(!isAdvSearchOpen)}
                className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] text-slate-500 transition hover:bg-slate-100 hover:text-blue-700 sm:flex"
                aria-label={hero.advancedSearch || "Pencarian Spesifik"}
                title={hero.advancedSearch || "Pencarian Spesifik"}
              >
                {isAdvSearchOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <SlidersHorizontal className="h-5 w-5" />
                )}
              </button>

              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-[1.3rem] bg-blue-700 px-8 text-sm font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 active:scale-[0.98] md:text-base"
              >
                {ui.searchBtn || "Cari"}
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-center sm:hidden">
            <button
              data-tour="advanced-search-mobile-button"
              type="button"
              onClick={() => setIsAdvSearchOpen(!isAdvSearchOpen)}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white ring-1 ring-white/10 transition hover:bg-white/20"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {hero.advancedSearch || "Pencarian Spesifik"}
            </button>
          </div>

          {isAdvSearchOpen && (
            <div className="mx-auto mt-8 max-w-4xl">
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
      </div>
    </section>
  );
}