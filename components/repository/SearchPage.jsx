"use client";

import {
  ArrowLeft,
  Calendar,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";

import AdvancedSearchPanel from "./AdvancedSearchPanel";
import CollectionCard from "./CollectionCard";
import Pagination from "./Pagination";

export default function SearchPage({
  t,
  subjects = [],
  searchQuery = "",
  setSearchQuery = () => {},
  advSearch = {
    nama: "",
    nim: "",
    pengarang: "",
    tahun: "",
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
  const safeAdvSearch = {
    nama: advSearch?.nama || "",
    nim: advSearch?.nim || "",
    pengarang: advSearch?.pengarang || "",
    tahun: advSearch?.tahun || "",
  };

  const hasAdvancedFilter =
    safeAdvSearch.nama ||
    safeAdvSearch.nim ||
    safeAdvSearch.pengarang ||
    safeAdvSearch.tahun;

  const selectedSubjectName =
    subjects.find((subject) => subject.value === selectedSubject)?.name ||
    selectedSubject;

  const yearOptions = Array.isArray(availableYears)
    ? availableYears.filter(Boolean)
    : [];

  const supervisorInputValue =
    selectedSupervisor && selectedSupervisor !== "Semua"
      ? selectedSupervisor
      : "";

  return (
    <div className="min-h-[75vh] bg-slate-50 py-10 dark:bg-slate-950 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <button
            type="button"
            onClick={handleBackToHome}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-white/10 dark:bg-white/5 dark:text-blue-300 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            {t?.ui?.backHome || "Kembali ke Beranda"}
          </button>

          <div className="relative w-full md:max-w-xl">
            <form
              onSubmit={handleSearchSubmit}
              className="relative z-20 overflow-hidden rounded-3xl border border-slate-200 bg-white p-1.5 shadow-md transition focus-within:ring-2 focus-within:ring-blue-300 dark:border-white/10 dark:bg-slate-900 md:rounded-full"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery || ""}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t?.ui?.searchAgain || "Cari lagi..."}
                    className="h-12 w-full rounded-2xl border-0 bg-transparent pl-12 pr-3 text-sm font-semibold text-slate-950 outline-none dark:text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsAdvSearchOpen(!isAdvSearchOpen)}
                  className={`inline-flex h-12 items-center justify-center px-4 transition ${
                    isAdvSearchOpen
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-slate-500 hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"
                  }`}
                  title={t?.advancedSearch || "Pencarian Spesifik"}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-700 px-7 text-sm font-black text-white transition hover:bg-blue-800 sm:rounded-full"
                >
                  {t?.ui?.searchBtn || "Cari"}
                </button>
              </div>
            </form>

            {isAdvSearchOpen && (
              <div className="absolute right-0 top-[110%] z-50 w-full">
                <AdvancedSearchPanel
                  t={t}
                  advSearch={safeAdvSearch}
                  setAdvSearch={setAdvSearch}
                  onClose={() => setIsAdvSearchOpen(false)}
                  onApply={(event) =>
                    handleSearchSubmit(event || { preventDefault() {} })
                  }
                  onReset={resetFilters}
                />
              </div>
            )}
          </div>
        </div>

        {/* Result Header */}
        <div className="mb-8 border-b border-slate-200 pb-6 dark:border-white/10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
                {t?.ui?.searchResults || "Hasil Pencarian"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                {t?.ui?.found || "Ditemukan"}{" "}
                <strong className="text-blue-700 dark:text-blue-300">
                  {filteredData.length}
                </strong>{" "}
                {t?.ui?.collections || "koleksi"}
                {searchQuery && (
                  <>
                    {" "}
                    {t?.ui?.forKeyword || "untuk kata kunci"}{" "}
                    <strong className="text-slate-950 dark:text-white">
                      "{searchQuery}"
                    </strong>
                  </>
                )}
                {selectedSubject !== "Semua" && (
                  <>
                    {" "}
                    {t?.ui?.onSubject || "pada subjek"}{" "}
                    <strong className="text-slate-950 dark:text-white">
                      {selectedSubjectName}
                    </strong>
                  </>
                )}
                {selectedYear !== "Semua" && (
                  <>
                    {" "}
                    <span>
                      | {t?.ui?.yearFilter || "Tahun:"}{" "}
                      <strong className="text-slate-950 dark:text-white">
                        {selectedYear}
                      </strong>
                    </span>
                  </>
                )}
                {supervisorInputValue && (
                  <>
                    {" "}
                    <span>
                      |{" "}
                      {t?.ui?.supervisorActiveLabel ||
                        t?.ui?.supervisorFilter ||
                        "Dosen Pembimbing:"}{" "}
                      <strong className="text-slate-950 dark:text-white">
                        {supervisorInputValue}
                      </strong>
                    </span>
                  </>
                )}
                {hasAdvancedFilter && (
                  <> {t?.ui?.withFilter || "(dengan filter spesifik)"}</>
                )}
              </p>
            </div>

            {/* Filter Group */}
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              {/* Filter Tahun */}
              <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5 sm:w-auto">
                <label
                  htmlFor="year-filter"
                  className="flex shrink-0 items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{t?.ui?.yearFilter || "Tahun:"}</span>
                </label>

                <select
                  id="year-filter"
                  value={selectedYear || "Semua"}
                  onChange={(event) => {
                    setSelectedYear(event.target.value);
                  }}
                  className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent text-sm font-black text-slate-950 outline-none focus:ring-0 dark:text-white"
                >
                  <option value="Semua">
                    {t?.ui?.allYears || "Semua Tahun"}
                  </option>

                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Dosen Pembimbing */}
              <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:ring-2 focus-within:ring-blue-300 dark:border-white/10 dark:bg-white/5 sm:w-[390px]">
                <label
                  htmlFor="supervisor-search"
                  className="flex shrink-0 items-center gap-2 text-sm font-black text-slate-500 dark:text-slate-400"
                >
                  <UserRound className="h-4 w-4" />
                  <span>{t?.ui?.supervisorFilter || "Dosen:"}</span>
                </label>

                <input
                  id="supervisor-search"
                  type="text"
                  value={supervisorInputValue}
                  onChange={(event) => {
                    setSelectedSupervisor(event.target.value);
                  }}
                  placeholder={
                    t?.ui?.supervisorSearchPlaceholder ||
                    "Cari dosen pembimbing..."
                  }
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm font-black text-slate-950 outline-none placeholder:font-semibold placeholder:text-slate-400 focus:ring-0 dark:text-white dark:placeholder:text-slate-500"
                />

                {supervisorInputValue && (
                  <button
                    type="button"
                    onClick={() => setSelectedSupervisor("")}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/15 dark:hover:text-white"
                    title={
                      t?.ui?.clearSupervisorFilter || "Hapus filter dosen"
                    }
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Result Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <CollectionCard
                key={item.id}
                item={item}
                index={index}
                onSelectItem={onSelectItem}
              />
            ))
          ) : (
            <div className="col-span-full rounded-[28px] border border-dashed border-slate-300 bg-white px-5 py-16 text-center dark:border-white/10 dark:bg-white/5">
              <Search className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />

              <p className="text-lg font-black text-slate-800 dark:text-white">
                {t?.noResults || "Tidak ada data yang ditemukan."}
              </p>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t?.ui?.tryOther ||
                  "Coba gunakan kata kunci lain atau periksa filter pencarian spesifik Anda."}
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
              >
                {t?.ui?.clearSearch || "Hapus Pencarian & Filter"}
              </button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}