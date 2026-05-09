"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Calendar,
  User,
  Loader2,
} from "lucide-react";

import AdvancedSearchPanel from "./AdvancedSearchPanel";
import CollectionCard from "./CollectionCard";
import SlimsResultBox from "./SlimsResultBox";

function getPaginationItems(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage > 4) pages.push("...");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) pages.push(page);

  if (currentPage < totalPages - 3) pages.push("...");

  pages.push(totalPages);

  return pages;
}

export default function SearchPage({
  t,
  loading = false,
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
  handleBackToHome = () => {},
  resetFilters = () => {},
  selectedSubject = "Semua",
  selectedYear = "Semua",
  setSelectedYear = () => {},
  availableYears = [],
  selectedSupervisor = "Semua",
  setSelectedSupervisor = () => {},
  filteredData = [],
  currentItems = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onSelectItem = () => {},
}) {
  const [activeTab, setActiveTab] = useState("repository");
  const [slimsTotal, setSlimsTotal] = useState(0);
  const [slimsTotalLoading, setSlimsTotalLoading] = useState(false);

  const slimsKeyword = useMemo(() => {
    if (searchQuery?.trim()) return searchQuery.trim();
    if (selectedSubject && selectedSubject !== "Semua") return selectedSubject;
    if (advSearch?.nama?.trim()) return advSearch.nama.trim();
    if (advSearch?.nim?.trim()) return advSearch.nim.trim();
    if (advSearch?.tahun?.trim()) return advSearch.tahun.trim();
    if (advSearch?.dosenPembimbing?.trim()) {
      return advSearch.dosenPembimbing.trim();
    }

    return "";
  }, [searchQuery, selectedSubject, advSearch]);

  const slimsUrl = useMemo(() => {
    return `https://digilib.undira.ac.id/slims/index.php?keywords=${encodeURIComponent(
      slimsKeyword
    )}&search=search`;
  }, [slimsKeyword]);

  useEffect(() => {
    let active = true;

    async function prefetchSlimsTotal() {
      if (!slimsKeyword) {
        setSlimsTotal(0);
        return;
      }

      setSlimsTotalLoading(true);

      try {
        const response = await fetch(
          `/api/slims-search?keywords=${encodeURIComponent(slimsKeyword)}`
        );

        const result = await response.json();
        const books = Array.isArray(result.books) ? result.books : [];
        const total = Number(result.total || books.length || 0);

        if (!active) return;

        setSlimsTotal(total);
      } catch {
        if (!active) return;

        setSlimsTotal(0);
      } finally {
        if (active) setSlimsTotalLoading(false);
      }
    }

    prefetchSlimsTotal();

    return () => {
      active = false;
    };
  }, [slimsKeyword]);

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const totalRepository = Array.isArray(filteredData) ? filteredData.length : 0;
  const isRepositoryPreparing = loading && currentItems.length === 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={handleBackToHome}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 dark:border-white/10 dark:bg-white/5 dark:text-blue-300 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {t?.ui?.backHome || "Kembali ke Beranda"}
          </button>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-md dark:border-white/10 dark:bg-white/5"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t?.ui?.searchAgain || "Cari lagi..."}
                className="h-14 w-full border-0 bg-transparent pl-13 pr-4 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAdvSearchOpen(!isAdvSearchOpen)}
              className="hidden items-center justify-center px-4 text-slate-500 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300 sm:flex"
              aria-label={t?.advancedSearch || "Pencarian Spesifik"}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            <button
              type="submit"
              className="m-1.5 rounded-[22px] bg-blue-700 px-6 text-sm font-black text-white transition hover:bg-blue-800"
            >
              {t?.ui?.searchBtn || "Cari"}
            </button>
          </form>
        </div>

        {isAdvSearchOpen && (
          <div className="mb-8">
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

        <section className="mb-6 border-b border-slate-200 pb-7 dark:border-white/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
                {t?.ui?.searchResults || "Hasil Pencarian"}
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {isRepositoryPreparing ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
                    Memuat koleksi tugas akhir...
                  </span>
                ) : (
                  <>
                    {t?.ui?.found || "Ditemukan"}{" "}
                    <span className="font-black text-blue-700 dark:text-blue-300">
                      {totalRepository}
                    </span>{" "}
                    {t?.ui?.collections || "koleksi"}
                    {searchQuery?.trim() ? (
                      <>
                        {" "}
                        {t?.ui?.forKeyword || "untuk kata kunci"}{" "}
                        <span className="font-black text-slate-950 dark:text-white">
                          &quot;{searchQuery.trim()}&quot;
                        </span>
                      </>
                    ) : null}
                    {selectedSubject !== "Semua" ? (
                      <>
                        {" "}
                        {t?.ui?.onSubject || "pada subjek"}{" "}
                        <span className="font-black text-slate-950 dark:text-white">
                          {selectedSubject}
                        </span>
                      </>
                    ) : null}
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex min-h-[54px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <Calendar className="h-5 w-5 text-slate-400" />

                <span className="text-sm font-black text-slate-500 dark:text-slate-300">
                  {t?.ui?.yearFilter || "Tahun:"}
                </span>

                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                  className="min-w-[130px] border-0 bg-transparent text-sm font-black text-slate-950 outline-none focus:ring-0 dark:text-white"
                >
                  <option value="Semua">
                    {t?.ui?.allYears || "Semua Tahun"}
                  </option>

                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex min-h-[54px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                <User className="h-5 w-5 text-slate-400" />

                <span className="text-sm font-black text-slate-500 dark:text-slate-300">
                  {t?.ui?.supervisorFilter || "Dosen:"}
                </span>

                <input
                  type="text"
                  value={
                    selectedSupervisor === "Semua" ? "" : selectedSupervisor
                  }
                  onChange={(event) =>
                    setSelectedSupervisor(event.target.value)
                  }
                  placeholder={
                    t?.ui?.supervisorSearchPlaceholder ||
                    "Cari dosen pembimbing..."
                  }
                  className="min-w-[220px] border-0 bg-transparent text-sm font-black text-slate-950 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white"
                />
              </label>
            </div>
          </div>
        </section>

        <ResultTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          repositoryTotal={isRepositoryPreparing ? "..." : totalRepository}
          slimsTotal={slimsTotalLoading ? "..." : slimsTotal}
        />

        {activeTab === "repository" && (
          <section className="mb-10">
            {isRepositoryPreparing ? (
              <SoftLoadingBox />
            ) : currentItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                  {currentItems.map((item, index) => (
                    <CollectionCard
                      key={item.id || `${item.judul}-${index}`}
                      item={item}
                      index={index}
                      onSelectItem={onSelectItem}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    {paginationItems.map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-black text-slate-400"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => onPageChange(page)}
                          className={`flex h-10 min-w-10 items-center justify-center rounded-full px-4 text-sm font-black transition ${
                            currentPage === page
                              ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <NoResultBox t={t} resetFilters={resetFilters} />
            )}
          </section>
        )}

        {activeTab === "slims" && (
          <SlimsResultBox
            keyword={slimsKeyword}
            slimsUrl={slimsUrl}
            onTotalChange={setSlimsTotal}
          />
        )}

        {activeTab === "ojs" && <ComingSoonBox title="Artikel Jurnal OJS" />}

        {activeTab === "scholar" && <ComingSoonBox title="Google Scholar" />}
      </div>
    </main>
  );
}

function ResultTabs({
  activeTab,
  setActiveTab,
  repositoryTotal = 0,
  slimsTotal = 0,
}) {
  const tabs = [
    {
      key: "repository",
      label: "Tugas Akhir",
      total: repositoryTotal,
      disabled: false,
    },
    {
      key: "slims",
      label: "Koleksi Buku Digilib",
      total: slimsTotal,
      disabled: false,
    },
    {
      key: "ojs",
      label: "Artikel Jurnal",
      total: null,
      disabled: true,
    },
    {
      key: "scholar",
      label: "Google Scholar",
      total: null,
      disabled: true,
    },
  ];

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Showing results for
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            disabled={tab.disabled}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm font-black transition ${
              activeTab === tab.key
                ? "border-b-2 border-blue-700 text-slate-950 dark:text-white"
                : "text-blue-700 hover:text-blue-900 dark:text-blue-300"
            } ${
              tab.disabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer"
            }`}
          >
            {tab.label}
            {tab.total !== null && (
              <span className="ml-1 font-semibold">
                (
                {tab.total === "..."
                  ? "..."
                  : Number(tab.total).toLocaleString("id-ID")}
                )
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function SoftLoadingBox() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />

      <h2 className="text-lg font-black text-slate-950 dark:text-white">
        Memuat koleksi tugas akhir...
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
        Sistem sedang mengambil data terbaru dari repository.
      </p>
    </div>
  );
}

function NoResultBox({ t, resetFilters }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
      <Search className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />

      <h2 className="text-xl font-black text-slate-950 dark:text-white">
        {t?.noResults || "Tidak ada data yang ditemukan."}
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
        {t?.ui?.tryOther ||
          "Coba gunakan kata kunci lain atau periksa filter pencarian spesifik Anda."}
      </p>

      <button
        type="button"
        onClick={resetFilters}
        className="mt-5 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-800"
      >
        {t?.ui?.clearSearch || "Hapus Pencarian & Filter"}
      </button>
    </div>
  );
}

function ComingSoonBox({ title }) {
  return (
    <section className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
      <h2 className="text-xl font-black text-slate-950 dark:text-white">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
        Fitur ini disiapkan untuk integrasi tahap berikutnya.
      </p>
    </section>
  );
}