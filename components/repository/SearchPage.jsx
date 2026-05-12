"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Search,
  SlidersHorizontal,
  User,
  X,
  FileText,
} from "lucide-react";

import SlimsResultBox from "./SlimsResultBox";
import GoogleScholarBox from "./GoogleScholarBox";

function safeText(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}

function truncateText(value = "", max = 80) {
  const text = safeText(value, "");

  if (text.length <= max) return text;

  return `${text.slice(0, max).trim()}...`;
}

function getCardGradient(index) {
  const gradients = [
    "from-blue-900 to-slate-950",
    "from-violet-900 to-slate-950",
    "from-emerald-900 to-slate-950",
    "from-indigo-900 to-slate-950",
    "from-slate-800 to-slate-950",
  ];

  return gradients[index % gradients.length];
}

function getExternalKeyword(searchQuery, selectedSubject) {
  const query = safeText(searchQuery, "");
  const subject = safeText(selectedSubject, "");

  if (query) return query;
  if (subject && subject !== "Semua" && subject !== "All") return subject;

  return "";
}

export default function SearchPage({
  t = {},
  loading = false,
  subjects = [],
  searchQuery = "",
  setSearchQuery = () => {},
  advSearch = {},
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
  const ui = t?.ui || {};
  const searchText = t?.search || {};

  const [activeResultTab, setActiveResultTab] = useState("repo");
  const [slimsTotal, setSlimsTotal] = useState(0);
  const [slimsCountLoading, setSlimsCountLoading] = useState(false);
  const [supervisorInput, setSupervisorInput] = useState(
    selectedSupervisor === "Semua" ? "" : selectedSupervisor
  );

  const lastSearchSignature = useRef("");

  const externalKeyword = useMemo(
    () => getExternalKeyword(searchQuery, selectedSubject),
    [searchQuery, selectedSubject]
  );

  const directSlimsUrl = useMemo(() => {
    return `https://digilib.undira.ac.id/slims/index.php?keywords=${encodeURIComponent(
      externalKeyword
    )}&search=search`;
  }, [externalKeyword]);

  useEffect(() => {
    const signature = JSON.stringify({
      searchQuery,
      selectedSubject,
      selectedYear,
      selectedSupervisor,
      advSearch,
    });

    if (!lastSearchSignature.current) {
      lastSearchSignature.current = signature;
      return;
    }

    if (lastSearchSignature.current !== signature) {
      lastSearchSignature.current = signature;
      setActiveResultTab("repo");
    }
  }, [searchQuery, selectedSubject, selectedYear, selectedSupervisor, advSearch]);

  useEffect(() => {
    setSupervisorInput(selectedSupervisor === "Semua" ? "" : selectedSupervisor);
  }, [selectedSupervisor]);

  useEffect(() => {
    if (!externalKeyword) {
      setSlimsTotal(0);
      setSlimsCountLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSlimsCountLoading(true);

      try {
        const response = await fetch(
          `/api/slims-search?keywords=${encodeURIComponent(
            externalKeyword
          )}&limit=24`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await response.json();
        const books = Array.isArray(result.books) ? result.books : [];
        const total = Number(result.total || books.length || 0);

        setSlimsTotal(total);
      } catch (error) {
        if (error?.name !== "AbortError") {
          setSlimsTotal(0);
        }
      } finally {
        setSlimsCountLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [externalKeyword]);

  const tabs = [
    {
      key: "repo",
      label: "Tugas Akhir",
      count: filteredData.length,
      loading: false,
      disabled: false,
    },
    {
      key: "slims",
      label: "Koleksi Buku Digilib",
      count: slimsTotal,
      loading: slimsCountLoading,
      disabled: false,
    },
    {
      key: "journal",
      label: "Artikel Jurnal",
      count: null,
      loading: false,
      disabled: true,
    },
    {
      key: "scholar",
      label: "Google Scholar",
      count: null,
      loading: false,
      disabled: false,
    },
  ];

  function handleSupervisorSubmit(event) {
    event.preventDefault();
    setSelectedSupervisor(supervisorInput.trim() || "Semua");
  }

  function handleClearAll() {
    setSupervisorInput("");
    setSlimsTotal(0);
    setActiveResultTab("repo");
    resetFilters();
  }

  function handleTabClick(tabKey) {
    setActiveResultTab(tabKey);
  }

  function renderTabCount(tab) {
    if (tab.loading) return " (...)";

    if (typeof tab.count === "number") {
      return ` (${Number(tab.count).toLocaleString("id-ID")})`;
    }

    return "";
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
      <div className="mb-9 flex flex-col gap-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <button
            type="button"
            onClick={handleBackToHome}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-md ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-blue-50 dark:bg-white/10 dark:text-blue-300 dark:ring-white/10 dark:hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            {searchText.backHome || "Kembali ke Beranda"}
          </button>

          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white p-2 shadow-md dark:border-white/10 dark:bg-white/5"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchText.searchAgain || "Cari lagi..."}
                className="h-12 w-full bg-transparent pl-12 pr-4 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAdvSearchOpen(!isAdvSearchOpen)}
              className="hidden h-12 w-12 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-blue-700 dark:hover:bg-white/10 sm:flex"
              aria-label="Filter"
            >
              {isAdvSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <SlidersHorizontal className="h-5 w-5" />
              )}
            </button>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-blue-700 px-7 text-sm font-black text-white transition hover:bg-blue-800"
            >
              {ui.searchBtn || "Cari"}
            </button>
          </form>
        </div>

        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
            {searchText.title || "Hasil Pencarian"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Ditemukan{" "}
            <span className="font-black text-blue-700">
              {Number(filteredData.length || 0).toLocaleString("id-ID")}
            </span>{" "}
            koleksi
            {searchQuery ? (
              <>
                {" "}
                untuk kata kunci{" "}
                <span className="font-black text-slate-950 dark:text-white">
                  "{searchQuery}"
                </span>
              </>
            ) : null}
            {selectedSubject && selectedSubject !== "Semua" ? (
              <>
                {" "}
                pada subjek{" "}
                <span className="font-black text-slate-950 dark:text-white">
                  {selectedSubject}
                </span>
              </>
            ) : null}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="hidden lg:block" />

          <div className="flex min-w-[230px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5">
            <Calendar className="h-5 w-5 text-slate-400" />

            <label className="text-sm font-black text-slate-500">Tahun:</label>

            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-950 outline-none dark:text-white"
            >
              <option value="Semua">Semua Tahun</option>

              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={handleSupervisorSubmit}
            className="flex min-w-[320px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <User className="h-5 w-5 text-slate-400" />

            <label className="text-sm font-black text-slate-500">Dosen:</label>

            <input
              type="text"
              value={supervisorInput}
              onChange={(event) => setSupervisorInput(event.target.value)}
              placeholder="Cari dosen pembimbing..."
              className="min-w-0 flex-1 bg-transparent text-sm font-black text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
            />
          </form>
        </div>

        {isAdvSearchOpen && (
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-700" />

              <h2 className="text-lg font-black text-slate-950 dark:text-white">
                Pencarian Spesifik
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <AdvancedInput
                label="Nama"
                value={advSearch.nama || ""}
                onChange={(value) =>
                  setAdvSearch((prev) => ({ ...prev, nama: value }))
                }
                placeholder="Nama mahasiswa"
              />

              <AdvancedInput
                label="NIM"
                value={advSearch.nim || ""}
                onChange={(value) =>
                  setAdvSearch((prev) => ({ ...prev, nim: value }))
                }
                placeholder="NIM"
              />

              <AdvancedInput
                label="Tahun"
                value={advSearch.tahun || ""}
                onChange={(value) =>
                  setAdvSearch((prev) => ({ ...prev, tahun: value }))
                }
                placeholder="Tahun"
              />

              <AdvancedInput
                label="Pembimbing"
                value={advSearch.dosenPembimbing || ""}
                onChange={(value) =>
                  setAdvSearch((prev) => ({
                    ...prev,
                    dosenPembimbing: value,
                  }))
                }
                placeholder="Dosen pembimbing"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-800"
              >
                Terapkan Filter
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                Hapus Pencarian & Filter
              </button>
            </div>
          </div>
        )}

        <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
            Showing Results For
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {tabs.map((tab) => {
              const isActive = activeResultTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  disabled={tab.disabled}
                  onClick={() => {
                    if (!tab.disabled) handleTabClick(tab.key);
                  }}
                  className={`text-sm font-black transition ${
                    isActive
                      ? "text-slate-950 underline decoration-blue-700 decoration-2 underline-offset-8 dark:text-white"
                      : tab.disabled
                        ? "cursor-not-allowed text-blue-300/70"
                        : "text-blue-700 hover:text-blue-900 dark:text-blue-300"
                  }`}
                >
                  {tab.label}
                  {renderTabCount(tab)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeResultTab === "repo" && (
        <RepositoryResults
          loading={loading}
          currentItems={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onSelectItem={onSelectItem}
          resetFilters={handleClearAll}
        />
      )}

      {activeResultTab === "slims" && (
        <SlimsResultBox
          t={t}
          keyword={externalKeyword}
          slimsUrl={directSlimsUrl}
          onTotalChange={setSlimsTotal}
        />
      )}

      {activeResultTab === "scholar" && (
        <GoogleScholarBox
          t={t}
          keyword={externalKeyword}
          subject={selectedSubject}
          selectedYear={selectedYear}
        />
      )}

      {activeResultTab === "journal" && <ComingSoonBox title="Artikel Jurnal" />}
    </main>
  );
}

function AdvancedInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-blue-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
      />
    </label>
  );
}

function RepositoryResults({
  loading,
  currentItems,
  currentPage,
  totalPages,
  onPageChange,
  onSelectItem,
  resetFilters,
}) {
  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700" />

        <h3 className="text-xl font-black text-slate-950 dark:text-white">
          Sedang memuat data repository...
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Mohon tunggu sebentar, sistem sedang mengambil data tugas akhir.
        </p>
      </div>
    );
  }

  if (!currentItems || currentItems.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
        <Search className="mx-auto mb-5 h-14 w-14 text-slate-300" />

        <h3 className="text-xl font-black text-slate-950 dark:text-white">
          Tidak ada data yang ditemukan.
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
          Coba gunakan kata kunci lain atau periksa filter pencarian spesifik Anda.
        </p>

        <button
          type="button"
          onClick={resetFilters}
          className="mt-6 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-800"
        >
          Hapus Pencarian & Filter
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {currentItems.map((item, index) => (
          <RepositoryCard
            key={item.id || `${item.judul}-${index}`}
            item={item}
            index={index}
            onSelectItem={onSelectItem}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            if (
              totalPages > 8 &&
              page !== 1 &&
              page !== totalPages &&
              Math.abs(page - currentPage) > 2
            ) {
              if (page === 2 || page === totalPages - 1) {
                return (
                  <span
                    key={`dots-${page}`}
                    className="px-2 text-sm font-black text-slate-400"
                  >
                    ...
                  </span>
                );
              }

              return null;
            }

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-10 min-w-10 rounded-full px-4 text-sm font-black transition ${
                  isActive
                    ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}

function RepositoryCard({ item, index, onSelectItem }) {
  const title = safeText(item.judul || item.title, "Tanpa Judul");
  const year = safeText(item.tahun || item.year, "-");
  const subject = safeText(item.subjek || item.subject, "-");
  const studentName = safeText(
    item.nama || item.studentName || item.pengarang,
    "-"
  );
  const supervisor = safeText(
    item.dosenPembimbing || item.supervisor || item.pembimbing,
    "-"
  );

  return (
    <button
      type="button"
      onClick={() => onSelectItem(item)}
      className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
    >
      <div
        className={`flex h-[230px] flex-col items-center justify-between bg-gradient-to-br ${getCardGradient(
          index
        )} p-6 text-center text-white`}
      >
        <p className="text-xs font-black tracking-[0.35em] text-white/80">
          {year}
        </p>

        <div>
          <h3 className="text-lg font-black uppercase leading-snug tracking-wide">
            {truncateText(title, 86)}
          </h3>

          <div className="mx-auto my-5 h-px w-16 bg-white/40" />

          <p className="text-sm font-black text-white/85">
            {truncateText(studentName, 30)}
          </p>
        </div>
      </div>

      <div className="p-5">
        <h3 className="min-h-[48px] text-base font-black leading-snug text-slate-950 dark:text-white">
          {truncateText(title, 58)}
        </h3>

        <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          {truncateText(studentName, 36)}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">
            {subject}
          </span>

          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            {truncateText(supervisor, 24)}
          </span>
        </div>
      </div>
    </button>
  );
}

function ComingSoonBox({ title }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
      <FileText className="mx-auto mb-5 h-12 w-12 text-slate-300" />

      <h3 className="text-xl font-black text-slate-950 dark:text-white">
        {title} sedang disiapkan.
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
        Integrasi akan ditambahkan pada tahap pengembangan berikutnya.
      </p>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-600 dark:bg-white/10 dark:text-white">
        <ExternalLink className="h-4 w-4" />
        Coming Soon
      </div>
    </div>
  );
}