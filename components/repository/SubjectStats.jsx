"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Database,
  Layers,
  X,
  Search,
} from "lucide-react";

function safeText(value, fallback = "-") {
  const text = String(value || "").trim();
  return text || fallback;
}

function getSubjectCount(data = [], subjectValue = "") {
  const target = String(subjectValue || "").toLowerCase();

  return data.filter((item) =>
    String(item?.subjek || "")
      .toLowerCase()
      .includes(target)
  ).length;
}

export default function SubjectStats({ t = {}, data = [], subjects = [] }) {
  const stats = t?.stats || {};
  const [showModal, setShowModal] = useState(false);
  const [keyword, setKeyword] = useState("");

  const subjectStats = useMemo(() => {
    return subjects
      .map((subject) => ({
        ...subject,
        count: getSubjectCount(data, subject.value),
      }))
      .sort((a, b) => b.count - a.count);
  }, [data, subjects]);

  const totalCollections = Array.isArray(data) ? data.length : 0;
  const totalSubjects = subjectStats.filter(
    (subject) => subject.count > 0
  ).length;
  const maxCount = Math.max(...subjectStats.map((subject) => subject.count), 1);

  const mainStats = subjectStats.slice(0, 4);

  const filteredModalStats = subjectStats.filter((subject) => {
    const text = `${subject.name || ""} ${subject.value || ""}`.toLowerCase();
    return text.includes(keyword.toLowerCase());
  });

  return (
    <>
      <section
        id="subject-stats"
        data-tour="subject-stats"
        className="mb-12 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8"
      >
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
              <BarChart3 className="h-4 w-4" />
              {stats.badge || "Statistik Subjek"}
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {stats.title || "Total Koleksi per Subjek"}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              {stats.description ||
                "Ringkasan jumlah koleksi berdasarkan program studi dalam bentuk grafik."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
            <SummaryCard
              label={stats.totalCollections || "Total Koleksi"}
              value={totalCollections}
              icon={<Database className="h-5 w-5" />}
            />

            <SummaryCard
              label={stats.totalSubjects || "Total Subjek"}
              value={totalSubjects}
              icon={<Layers className="h-5 w-5" />}
            />
          </div>
        </div>

        <div className="space-y-5">
          {mainStats.map((subject, index) => (
            <StatRow
              key={subject.value}
              subject={subject}
              index={index}
              maxCount={maxCount}
              stats={stats}
            />
          ))}
        </div>

        {subjectStats.length > 4 && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Lihat Semua Subjek
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white text-slate-950 shadow-2xl dark:bg-slate-900 dark:text-white">
            <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-5 dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300">
                    Statistik Lengkap
                  </p>

                  <h3 className="text-2xl font-black tracking-tight">
                    Semua Koleksi per Subjek
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    Daftar lengkap jumlah koleksi berdasarkan program studi.
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
              <div className="space-y-5">
                {filteredModalStats.map((subject, index) => (
                  <StatRow
                    key={subject.value}
                    subject={subject}
                    index={index}
                    maxCount={maxCount}
                    stats={stats}
                  />
                ))}

                {filteredModalStats.length === 0 && (
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
        </div>
      )}
    </>
  );
}

function StatRow({ subject, index, maxCount, stats }) {
  const percentage = Math.max((subject.count / maxCount) * 100, 4);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-white/10 dark:ring-white/10">
            {subject.icon || <Layers className="h-7 w-7 text-blue-600" />}
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {stats.rank || "Peringkat"} #{index + 1}
            </p>

            <h3 className="mt-1 truncate text-lg font-black text-slate-950 dark:text-white">
              {safeText(subject.name || subject.value)}
            </h3>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-2xl font-black text-slate-950 dark:text-white">
            {Number(subject.count || 0).toLocaleString("id-ID")}
          </p>

          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            koleksi
          </p>
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-blue-700 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
        {icon}
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
        {Number(value || 0).toLocaleString("id-ID")}
      </p>
    </div>
  );
}