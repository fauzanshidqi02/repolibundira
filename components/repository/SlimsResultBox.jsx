"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Building2,
  Calendar,
  ExternalLink,
  Hash,
  LibraryBig,
  Loader2,
  RefreshCcw,
  User,
} from "lucide-react";

function safeText(value, fallback = "-") {
  const text = String(value || "").trim();
  return text || fallback;
}

function truncateText(value = "", max = 95) {
  const text = safeText(value, "");

  if (text.length <= max) return text;

  return `${text.slice(0, max).trim()}...`;
}

export default function SlimsResultBox({
  t = {},
  keyword = "",
  slimsUrl = "",
  onTotalChange = () => {},
}) {
  const ui = t?.ui || {};

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(Boolean(keyword));
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const finalKeyword = safeText(keyword, "");

  const directUrl = useMemo(() => {
    if (slimsUrl) return slimsUrl;

    return `https://digilib.undira.ac.id/slims/index.php?keywords=${encodeURIComponent(
      finalKeyword
    )}&search=search`;
  }, [slimsUrl, finalKeyword]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadSlims() {
      if (!finalKeyword) {
        setBooks([]);
        setLoading(false);
        setError("");
        onTotalChange(0);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/slims-search?keywords=${encodeURIComponent(
            finalKeyword
          )}&limit=20`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!active) return;

        const nextBooks = Array.isArray(result.books) ? result.books : [];

        setBooks(nextBooks);
        setSource(result.source || "");
        onTotalChange(Number(result.total || nextBooks.length || 0));

        if (nextBooks.length === 0) {
          setError(
            result.message ||
              "Data buku belum bisa ditampilkan otomatis. Silakan buka hasil pencarian langsung di DIGILIB."
          );
        }
      } catch (err) {
        if (!active) return;

        setBooks([]);
        onTotalChange(0);
        setError(
          err?.name === "AbortError"
            ? ""
            : "Data buku belum bisa ditampilkan otomatis. Silakan buka hasil pencarian langsung di DIGILIB."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSlims();

    return () => {
      active = false;
      controller.abort();
    };
  }, [finalKeyword, retryKey, onTotalChange]);

  return (
    <section className="mb-10 overflow-hidden rounded-[28px] border border-blue-200 bg-white shadow-lg shadow-blue-950/5 dark:border-blue-400/20 dark:bg-white/5">
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6 py-6 dark:border-white/10 dark:from-blue-950/40 dark:via-slate-950 dark:to-slate-900 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-20 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-white/10 dark:text-blue-300">
              <LibraryBig className="h-4 w-4" />
              {ui.slimsLabel || "Koleksi Buku Perpustakaan"}
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
              {ui.slimsTitle || "Hasil dari Digital Library"}
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {ui.slimsKeyword || "Kata kunci:"}{" "}
              <span className="font-black text-slate-950 dark:text-white">
                {finalKeyword || "-"}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {source && !loading && books.length > 0 && (
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-300">
                Source: {source}
              </span>
            )}

            <button
              type="button"
              onClick={() => setRetryKey((prev) => prev + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>

            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              {ui.openSlims || "Buka DIGILIB"}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/5">
            <Loader2 className="mx-auto mb-4 h-9 w-9 animate-spin text-blue-700 dark:text-blue-300" />

            <h3 className="text-lg font-black text-slate-950 dark:text-white">
              Mengambil data DIGILIB...
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
              Sistem sedang mencoba membaca hasil katalog buku dari Digital Library Undira.
            </p>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {books.map((book, index) => (
              <SlimsBookCard
                key={`${book.title}-${book.url}-${index}`}
                book={book}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20">
                  <AlertCircle className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">
                    Data buku belum tampil otomatis.
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                    {error ||
                      "Silakan buka hasil pencarian langsung di DIGILIB untuk melihat koleksi buku yang sesuai."}
                  </p>
                </div>
              </div>

              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-800"
              >
                Buka DIGILIB
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SlimsBookCard({ book, index }) {
  const title = safeText(book.title, "Tanpa judul");
  const author = safeText(book.author, "-");
  const publisher = safeText(book.publisher, "-");
  const year = safeText(book.year, "-");
  const callNumber = safeText(book.callNumber, "-");
  const url = safeText(book.url, "#");

  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-950/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

      <div className="relative flex gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
          <BookOpen className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              Buku #{index + 1}
            </span>

            {year !== "-" && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {year}
              </span>
            )}
          </div>

          <h3 className="text-lg font-black leading-snug text-slate-950 dark:text-white">
            {truncateText(title, 105)}
          </h3>

          <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
            <MetaItem
              icon={<User className="h-4 w-4" />}
              label="Pengarang"
              value={author}
            />
            <MetaItem
              icon={<Building2 className="h-4 w-4" />}
              label="Penerbit"
              value={publisher}
            />
            <MetaItem
              icon={<Calendar className="h-4 w-4" />}
              label="Tahun"
              value={year}
            />
            <MetaItem
              icon={<Hash className="h-4 w-4" />}
              label="No. Panggil"
              value={callNumber}
            />
          </div>

          <div className="mt-5 flex justify-end">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition hover:bg-blue-700 hover:text-white dark:bg-white/10 dark:ring-white/10 dark:hover:bg-blue-700"
            >
              Lihat Detail
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function MetaItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 line-clamp-2 font-semibold text-slate-600 dark:text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}