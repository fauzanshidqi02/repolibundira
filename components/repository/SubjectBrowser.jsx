"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Layers,
  Search,
  X,
} from "lucide-react";

function safeText(value, fallback = "-") {
  const text = String(value || "").trim();
  return text || fallback;
}

export default function SubjectBrowser({
  t = {},
  subjects = [],
  selectedSubject = "Semua",
  showAllSubjects = false,
  setShowAllSubjects = () => {},
  onSelectSubject = () => {},
}) {
  const subjectText = t?.subjects || {};

  const [showModal, setShowModal] = useState(false);
  const [keyword, setKeyword] = useState("");

  const mainSubjects = useMemo(() => {
    return Array.isArray(subjects) ? subjects.slice(0, 4) : [];
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    const query = keyword.toLowerCase().trim();

    if (!query) return subjects;

    return subjects.filter((subject) => {
      const text = `${subject?.name || ""} ${subject?.value || ""}`.toLowerCase();
      return text.includes(query);
    });
  }, [subjects, keyword]);

  function handleSelectSubject(subjectValue) {
    onSelectSubject(subjectValue);
    setShowModal(false);
    setShowAllSubjects(false);
  }

  return (
    <>
      <section
        id="subject-browser"
        data-tour="subject-browser"
        className="mb-12 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8"
      >
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
              <Layers className="h-4 w-4" />
              {subjectText.badge || "Eksplorasi Program Studi"}
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {subjectText.title || "Telusuri Subjek"}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              {subjectText.description ||
                "Jelajahi koleksi tugas akhir sesuai program studi."}
            </p>
          </div>

          {subjects.length > 4 && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              {subjectText.showAll || "Lihat Semua Subjek"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mainSubjects.map((subject) => (
            <SubjectCard
              key={subject.value}
              subject={subject}
              subjectText={subjectText}
              selectedSubject={selectedSubject}
              onSelectSubject={handleSelectSubject}
            />
          ))}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[28px] bg-white text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white">
            <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-5 dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300">
                    {subjectText.badge || "Eksplorasi Program Studi"}
                  </p>

                  <h3 className="text-2xl font-black tracking-tight">
                    Semua Subjek
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Pilih program studi untuk melihat koleksi tugas akhir yang tersedia.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label="Tutup"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="relative mt-5">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Cari subjek..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-blue-300 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
                />
              </div>
            </div>

            <div className="max-h-[calc(90vh-190px)] overflow-y-auto p-6">
              {filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSubjects.map((subject) => (
                    <SubjectCard
                      key={subject.value}
                      subject={subject}
                      subjectText={subjectText}
                      selectedSubject={selectedSubject}
                      onSelectSubject={handleSelectSubject}
                      compact
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-white/10 dark:bg-white/5">
                  <Search className="mx-auto mb-4 h-10 w-10 text-slate-300" />

                  <h4 className="text-lg font-black">
                    Subjek tidak ditemukan.
                  </h4>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Coba gunakan kata kunci lain.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SubjectCard({
  subject,
  subjectText,
  selectedSubject,
  onSelectSubject,
  compact = false,
}) {
  const isActive = selectedSubject === subject.value;
  const subjectName = safeText(subject.name || subject.value);

  return (
    <button
      type="button"
      onClick={() => onSelectSubject(subject.value)}
      className={`group rounded-[24px] border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:bg-white/10 ${
        compact ? "min-h-[190px]" : "min-h-[220px]"
      } ${
        isActive
          ? "border-blue-400 bg-blue-50 shadow-lg shadow-blue-700/10 dark:border-blue-400/40 dark:bg-blue-500/10"
          : "border-slate-200 bg-slate-50/70 hover:border-blue-300 hover:bg-white dark:border-white/10 dark:bg-white/5"
      }`}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-white/10 dark:ring-white/10">
            {subject.icon || <Layers className="h-8 w-8 text-blue-600" />}
          </div>

          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            {subjectText.label || "Subjek"}
          </p>

          <h3 className="text-xl font-black leading-tight text-slate-950 dark:text-white">
            {subjectName}
          </h3>

          {!compact && (
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Jelajahi karya ilmiah dan tugas akhir pada bidang{" "}
              {subjectName.toLowerCase()}.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">
            {subjectText.viewCollection || "Lihat Koleksi"}
          </span>

          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition group-hover:bg-blue-700 group-hover:text-white dark:bg-white/10 dark:text-white dark:ring-white/10">
            <ChevronRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </button>
  );
}