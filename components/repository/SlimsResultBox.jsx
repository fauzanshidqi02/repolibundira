"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Loader2 } from "lucide-react";

export default function SlimsResultBox({
  keyword = "",
  slimsUrl = "",
  onTotalChange = () => {},
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSlims() {
      setLoading(true);
      setBooks([]);
      onTotalChange(0);

      try {
        const response = await fetch(
          `/api/slims-search?keywords=${encodeURIComponent(keyword)}`
        );

        const result = await response.json();
        const items = Array.isArray(result.books) ? result.books : [];

        if (!active) return;

        setBooks(items);
        onTotalChange(Number(result.total || items.length || 0));
      } catch {
        if (!active) return;

        setBooks([]);
        onTotalChange(0);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSlims();

    return () => {
      active = false;
    };
  }, [keyword, onTotalChange]);

  return (
    <section className="mb-12 rounded-[30px] border border-blue-200 bg-white p-5 shadow-xl dark:border-blue-400/20 dark:bg-white/5 md:p-7">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">
            Koleksi Buku Perpustakaan
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            Hasil dari Digital Library
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Kata kunci: <b>{keyword || "-"}</b>
          </p>
        </div>

        <a
          href={slimsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-black text-white hover:bg-blue-800"
        >
          Buka DIGILIB
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Mengambil data SLiMS...
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {books.map((book, index) => (
            <a
              key={`${book.title}-${index}`}
              href={book.url || slimsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-blue-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-blue-500/10"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-white">
                <BookOpen className="h-5 w-5" />
              </div>

              <h3 className="line-clamp-2 text-sm font-black text-slate-950 dark:text-white">
                {book.title}
              </h3>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {book.author || "-"}
              </p>

              {(book.publisher || book.year || book.callNumber) && (
                <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  {book.publisher && book.publisher !== "-" && (
                    <p>Penerbit: {book.publisher}</p>
                  )}
                  {book.year && book.year !== "-" && <p>Tahun: {book.year}</p>}
                  {book.callNumber && book.callNumber !== "-" && (
                    <p>No. Panggil: {book.callNumber}</p>
                  )}
                </div>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          Data buku belum bisa ditampilkan otomatis. Silakan buka hasil
          pencarian langsung di SLiMS.
        </div>
      )}
    </section>
  );
}