"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Layers, X } from "lucide-react";

export default function SubjectBrowser({
  t,
  subjects = [],
  selectedSubject = "Semua",
  showAllSubjects = false,
  setShowAllSubjects = () => {},
  onSelectSubject = () => {},
}) {
  const [showMoreModal, setShowMoreModal] = useState(false);

  const visibleSubjects = subjects.slice(0, 7);
  const hasMoreSubjects = subjects.length > 7;

  const handleSelectSubject = (subjectValue) => {
    onSelectSubject(subjectValue);
    setShowMoreModal(false);
  };

  return (
    <>
      <section className="relative mb-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 md:text-[11px]">
              <Layers className="h-3.5 w-3.5" />
              {t?.ui?.studyProgramExplore || "Eksplorasi Program Studi"}
            </span>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {t?.subjectTitle || "Telusuri Subjek"}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
              {t?.ui?.subjectDesc ||
                "Jelajahi koleksi tugas akhir sesuai program studi."}
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleSubjects.map((subject) => (
            <SubjectCard
              key={subject.value}
              t={t}
              subject={subject}
              selectedSubject={selectedSubject}
              onSelectSubject={handleSelectSubject}
            />
          ))}

          {hasMoreSubjects && (
            <button
              type="button"
              onClick={() => setShowMoreModal(true)}
              className="group relative overflow-hidden rounded-[28px] border border-dashed border-blue-300 bg-blue-50/60 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl dark:border-blue-400/30 dark:bg-blue-500/10 dark:hover:bg-blue-500/15"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl" />

              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-white">
                <ChevronDown className="h-6 w-6" />
              </div>

              <div className="relative z-10 mt-5">
                <h3 className="text-xl font-black leading-tight text-slate-950 dark:text-white">
                  {t?.more || "Lainnya"}
                </h3>

                <p className="mt-3 min-h-[52px] text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {t?.ui?.showMoreSubjects ||
                    "Tampilkan lebih banyak subjek untuk memperluas penelusuran koleksi."}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-700 dark:text-blue-300">
                  <span>{t?.ui?.showAllSubjects || "Lihat semua subjek"}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </button>
          )}
        </div>
      </section>

      {showMoreModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-white/10 md:px-7">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
                  <Layers className="h-3.5 w-3.5" />
                  {t?.ui?.studyProgramExplore || "Eksplorasi Program Studi"}
                </span>

                <h3 className="mt-3 text-2xl font-black text-slate-950 dark:text-white md:text-3xl">
                  {t?.ui?.showAllSubjects || "Lihat semua subjek"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {t?.ui?.subjectDesc ||
                    "Jelajahi koleksi tugas akhir sesuai program studi."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMoreModal(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={t?.close || "Tutup"}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-5 md:p-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.value}
                    t={t}
                    subject={subject}
                    selectedSubject={selectedSubject}
                    onSelectSubject={handleSelectSubject}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SubjectCard({
  t,
  subject,
  selectedSubject,
  onSelectSubject,
  compact = false,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectSubject(subject.value)}
      className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        selectedSubject === subject.value
          ? "border-blue-300 bg-blue-50 dark:border-blue-400/30 dark:bg-blue-500/10"
          : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:border-blue-400/30 dark:hover:bg-white/10"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

      <div className="relative z-10">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm dark:bg-white/10 dark:text-white">
          {subject.icon}
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {t?.ui?.subjectLabel || "Subjek"}
        </p>

        <h3 className="mt-2 text-xl font-black leading-tight text-slate-950 dark:text-white">
          {subject.name}
        </h3>

        <p
          className={`mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400 ${
            compact ? "min-h-[42px]" : "min-h-[52px]"
          }`}
        >
          {t?.ui?.subjectCardDescPrefix ||
            "Jelajahi karya ilmiah dan tugas akhir pada bidang"}{" "}
          {subject.name.toLowerCase()}.
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-700 dark:bg-white/10 dark:text-slate-300">
            {t?.ui?.viewCollection || "Lihat Koleksi"}
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition group-hover:bg-blue-700 group-hover:text-white dark:bg-white/10 dark:text-slate-300">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  );
}