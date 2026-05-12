"use client";

import { useMemo } from "react";
import {
  ExternalLink,
  GraduationCap,
  Search,
  Calendar,
  Quote,
  Globe2,
  FileText,
} from "lucide-react";

function safeText(value, fallback = "") {
  const text = String(value || "").trim();
  return text || fallback;
}

function buildScholarUrl({
  keyword = "",
  subject = "",
  year = "",
  mode = "general",
}) {
  let query = safeText(keyword || subject, "");

  if (mode === "undira") {
    query = `${query} "Universitas Dian Nusantara"`;
  }

  if (mode === "pdf") {
    query = `${query} filetype:pdf`;
  }

  if (mode === "citation") {
    query = `"${query}"`;
  }

  if (mode === "allintitle") {
    query = `allintitle: ${query}`;
  }

  const url = new URL("https://scholar.google.com/scholar");
  url.searchParams.set("q", query);

  if (year && year !== "Semua" && year !== "All Years") {
    url.searchParams.set("as_ylo", year);
    url.searchParams.set("as_yhi", year);
  }

  return url.href;
}

export default function GoogleScholarBox({
  t = {},
  keyword = "",
  subject = "",
  selectedYear = "Semua",
}) {
  const finalKeyword = safeText(keyword || subject, "");

  const scholarLinks = useMemo(
    () => [
      {
        title: "Cari Literatur Ilmiah",
        description:
          "Membuka hasil pencarian Google Scholar berdasarkan kata kunci yang sedang digunakan.",
        icon: <Search className="h-6 w-6" />,
        url: buildScholarUrl({
          keyword: finalKeyword,
          subject,
          year: selectedYear,
          mode: "general",
        }),
      },
      {
        title: "Cari Terkait Undira",
        description:
          "Mencari literatur yang memiliki hubungan dengan Universitas Dian Nusantara.",
        icon: <Globe2 className="h-6 w-6" />,
        url: buildScholarUrl({
          keyword: finalKeyword,
          subject,
          year: selectedYear,
          mode: "undira",
        }),
      },
      {
        title: "Cari Dokumen PDF",
        description:
          "Mencari kemungkinan dokumen PDF akademik yang sesuai dengan kata kunci.",
        icon: <FileText className="h-6 w-6" />,
        url: buildScholarUrl({
          keyword: finalKeyword,
          subject,
          year: selectedYear,
          mode: "pdf",
        }),
      },
      {
        title: "Cari Sitasi / Judul",
        description:
          "Mencari kata kunci sebagai frasa untuk membantu pelacakan judul atau sitasi.",
        icon: <Quote className="h-6 w-6" />,
        url: buildScholarUrl({
          keyword: finalKeyword,
          subject,
          year: selectedYear,
          mode: "citation",
        }),
      },
    ],
    [finalKeyword, subject, selectedYear]
  );

  return (
    <section className="mb-10 overflow-hidden rounded-[28px] border border-blue-200 bg-white shadow-lg shadow-blue-950/5 dark:border-blue-400/20 dark:bg-white/5">
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6 py-6 dark:border-white/10 dark:from-blue-950/40 dark:via-slate-950 dark:to-slate-900 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-20 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-blue-700 shadow-sm dark:border-blue-400/20 dark:bg-white/10 dark:text-blue-300">
              <GraduationCap className="h-4 w-4" />
              Google Scholar
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
              Telusuri Literatur Ilmiah
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              Kata kunci:{" "}
              <span className="font-black text-slate-950 dark:text-white">
                {finalKeyword || "-"}
              </span>
            </p>
          </div>

          {selectedYear && selectedYear !== "Semua" && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white">
              <Calendar className="h-4 w-4" />
              Tahun {selectedYear}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {!finalKeyword ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/5">
            <Search className="mx-auto mb-4 h-10 w-10 text-slate-300" />

            <h3 className="text-lg font-black text-slate-950 dark:text-white">
              Masukkan kata kunci pencarian.
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Google Scholar akan terbuka berdasarkan kata kunci, subjek, atau tahun yang dicari di Repolib.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {scholarLinks.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl hover:shadow-blue-950/5 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

                <div className="relative flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black leading-snug text-slate-950 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-700 group-hover:text-white dark:bg-white/10 dark:ring-white/10 dark:group-hover:bg-blue-700">
                      Buka Google Scholar
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}