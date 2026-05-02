import { BookOpen, Globe, Moon } from "lucide-react";

export default function Navbar({ lang, onToggleLang, onBackHome, onToggleDark, t }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-blue-500/20 bg-blue-800/95 shadow-lg backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
        <button onClick={onBackHome} className="flex items-center gap-3 text-left">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
            <BookOpen className="h-6 w-6" />
          </span>
          <span className="text-white">
            <span className="block text-lg font-black leading-none tracking-[0.18em] md:text-xl">REPOLIB</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.32em] text-blue-100/80">UNDIRA</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            title={t.language}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-bold uppercase text-white transition hover:bg-white/20"
          >
            <Globe className="h-4 w-4" />
            {lang}
          </button>
          <button
            type="button"
            onClick={onToggleDark}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            title="Toggle dark mode"
          >
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
