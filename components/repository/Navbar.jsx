"use client";

import { BookOpen, Globe2, Moon } from "lucide-react";

export default function Navbar({
  lang = "id",
  onToggleLang = () => {},
  onBackHome = () => {},
  onToggleDark = () => {},
  t = {},
}) {
  const brandTitle = t?.brand?.title || "REPOLIB";
  const brandSubtitle = t?.brand?.subtitle || "UNDIRA";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-blue-500/20 bg-blue-800/95 shadow-lg shadow-blue-950/10 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackHome}
          className="group flex items-center gap-3 text-left"
          aria-label="Kembali ke Beranda"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white shadow-lg shadow-blue-950/10 ring-1 ring-white/10 transition group-hover:scale-105 group-hover:bg-white/20 sm:h-12 sm:w-12">
            <BookOpen className="h-6 w-6" />
          </span>

          <span className="leading-none">
            <span className="block text-lg font-black tracking-[0.22em] text-white sm:text-xl">
              {brandTitle}
            </span>
            <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.38em] text-blue-100/80 sm:text-[10px]">
              {brandSubtitle}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-3 text-sm font-black text-white ring-1 ring-white/10 transition hover:bg-white/20"
            aria-label="Ganti Bahasa"
          >
            <Globe2 className="h-4 w-4" />
            <span>{lang === "id" ? "ID" : "EN"}</span>
          </button>

          <button
            type="button"
            onClick={onToggleDark}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/10 transition hover:bg-white/20"
            aria-label="Toggle Dark Mode"
          >
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}