"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Calculator,
  Briefcase,
  MessageCircle,
  BookType,
  Monitor,
  Zap,
  Settings,
  Building,
  X,
  ChevronRight,
  Layers,
} from "lucide-react";

const subjectIcons = {
  Akuntansi: Calculator,
  Manajemen: Briefcase,
  "Ilmu Komunikasi": MessageCircle,
  "Sastra Inggris": BookType,
  "Teknik Informatika": Monitor,
  "Teknik Elektro": Zap,
  "Teknik Mesin": Settings,
  "Teknik Sipil": Building,
};

const subjectColors = {
  Akuntansi: "from-rose-500 to-pink-600",
  Manajemen: "from-blue-500 to-indigo-600",
  "Ilmu Komunikasi": "from-emerald-500 to-teal-600",
  "Sastra Inggris": "from-orange-500 to-amber-600",
  "Teknik Informatika": "from-violet-500 to-indigo-600",
  "Teknik Elektro": "from-amber-500 to-orange-600",
  "Teknik Mesin": "from-slate-500 to-slate-700",
  "Teknik Sipil": "from-cyan-500 to-teal-600",
};

export default function SubjectStats({ t, data = [], subjects = [] }) {
  const [showModal, setShowModal] = useState(false);

  const stats = useMemo(() => {
    return subjects
      .map((subject) => {
        const total = data.filter((item) =>
          item?.subjek?.toLowerCase().includes(subject.value.toLowerCase())
        ).length;

        return {
          ...subject,
          total,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [data, subjects]);

  const totalCollections = stats.reduce((sum, item) => sum + item.total, 0);
  const maxValue = Math.max(...stats.map((item) => item.total), 1);
  const topStats = stats.slice(0, 3);

  return (
    <>
      <section
        data-tour="stats"
        className="relative mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)] md:p-8"
      >
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300 md:text-[11px]">
              <BarChart3 className="h-3.5 w-3.5" />
              {t?.ui?.statsSubject || "Statistik Subjek"}
            </span>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
              {t?.ui?.totalCollectionsBySubject || "Total Koleksi per Subjek"}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400 md:text-base">
              {t?.ui?.statsSubjectDesc ||
                "Ringkasan jumlah koleksi berdasarkan program studi dalam bentuk grafik."}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 md:w-auto">
            <SummaryBox
              label={t?.ui?.totalCollection || "Total Koleksi"}
              value={totalCollections}
            />
            <SummaryBox
              label={t?.ui?.totalSubject || "Total Subjek"}
              value={stats.length}
            />
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          {topStats.map((subject, index) => (
            <SubjectBar
              key={subject.value}
              subject={subject}
              index={index}
              maxValue={maxValue}
              t={t}
            />
          ))}
        </div>

        <div className="relative z-10 mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800"
          >
            <Layers className="h-4 w-4" />
            <span>{t?.ui?.viewAllStats || "Lihat Semua Statistik"}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {showModal && (
        <StatsModal
          stats={stats}
          maxValue={maxValue}
          totalCollections={totalCollections}
          onClose={() => setShowModal(false)}
          t={t}
        />
      )}
    </>
  );
}

function SummaryBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function SubjectBar({ subject, index, maxValue, t }) {
  const Icon = subjectIcons[subject.value] || BarChart3;
  const gradient =
    subjectColors[subject.value] || "from-blue-500 to-indigo-600";
  const percent = Math.max((subject.total / maxValue) * 100, 8);

  return (
    <div className="w-full rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-left transition-all duration-300 dark:border-white/10 dark:bg-white/5 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              {t?.ui?.subjectLabel || "Subjek"}
            </p>
            <h3 className="truncate text-lg font-black text-slate-950 dark:text-white md:text-xl">
              {subject.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black leading-none text-slate-950 dark:text-white md:text-3xl">
            {subject.total}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t?.ui?.availableCollection || "koleksi"}
          </p>
        </div>
      </div>

      <div className="relative h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {t?.ui?.ranking || "Peringkat"} #{index + 1}
      </p>
    </div>
  );
}

function StatsModal({ stats, maxValue, totalCollections, onClose, t }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-white/10 md:px-7">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
              <BarChart3 className="h-3.5 w-3.5" />
              {t?.ui?.completeStats || "Statistik Lengkap"}
            </p>

            <h3 className="mt-3 text-2xl font-black text-slate-950 dark:text-white md:text-3xl">
              {t?.ui?.allRepositorySubjects || "Semua Subjek Repository"}
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t?.ui?.totalCollection || "Total Koleksi"} {totalCollections}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={t?.close || "Tutup"}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-5 md:p-7">
          <div className="space-y-4">
            {stats.map((subject, index) => (
              <SubjectBar
                key={subject.value}
                subject={subject}
                index={index}
                maxValue={maxValue}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}