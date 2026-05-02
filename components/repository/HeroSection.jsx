import { ChevronDown, ChevronUp, Search, SlidersHorizontal } from "lucide-react";
import AdvancedSearchPanel from "./AdvancedSearchPanel";

export default function HeroSection({
  t,
  searchQuery,
  setSearchQuery,
  advSearch,
  setAdvSearch,
  isAdvSearchOpen,
  setIsAdvSearchOpen,
  handleSearchSubmit,
  resetFilters,
}) {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 md:py-24 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80')",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-slate-950/85 to-slate-950" />
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={handleSearchSubmit}
            className="overflow-hidden rounded-3xl bg-white p-2 shadow-2xl shadow-blue-950/30 ring-1 ring-white/30 dark:bg-slate-900 md:rounded-full"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="h-14 w-full rounded-2xl border-0 bg-transparent pl-14 pr-4 text-sm font-semibold text-slate-900 outline-none dark:text-white md:h-16"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-blue-700 px-7 text-sm font-black text-white transition hover:bg-blue-800 md:h-16 md:rounded-full"
              >
                <Search className="h-5 w-5" />
                {t.ui.searchCollection}
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-center md:justify-end">
            <button
              type="button"
              onClick={() => setIsAdvSearchOpen(!isAdvSearchOpen)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t.advancedSearch}
              {isAdvSearchOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>

          {isAdvSearchOpen && (
            <AdvancedSearchPanel
              t={t}
              advSearch={advSearch}
              setAdvSearch={setAdvSearch}
              onClose={() => setIsAdvSearchOpen(false)}
              onApply={(event) =>
                handleSearchSubmit(event || { preventDefault() {} })
              }
              onReset={resetFilters}
            />
          )}
        </div>
      </div>
    </section>
  );
}