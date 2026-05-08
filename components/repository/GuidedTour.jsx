"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, X, ChevronLeft, ChevronRight, MousePointer2 } from "lucide-react";

const TOUR_STORAGE_KEY = "repolib-tour-seen";

const steps = [
  {
    target: "search",
    title: "Kolom Pencarian",
    desc: "Gunakan bagian ini untuk mencari judul, nama mahasiswa, NIM, prodi, atau tahun.",
  },
  {
    target: "advanced",
    title: "Pencarian Spesifik",
    desc: "Klik tombol ini untuk pencarian berdasarkan nama, NIM, tahun, atau dosen pembimbing.",
  },
  {
    target: "subject",
    title: "Telusuri Subjek",
    desc: "Pilih program studi untuk melihat koleksi tugas akhir sesuai bidangnya.",
  },
  {
    target: "collection",
    title: "Koleksi Terbaru",
    desc: "Bagian ini menampilkan koleksi tugas akhir terbaru di repository.",
  },
  {
    target: "stats",
    title: "Statistik Subjek",
    desc: "Bagian ini menampilkan jumlah koleksi berdasarkan program studi.",
  },
];

export default function GuidedTour({ onFinish = () => {} }) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [mounted, setMounted] = useState(false);

  const currentStep = steps[stepIndex];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const hasSeenTour = window.localStorage.getItem(TOUR_STORAGE_KEY);

    if (hasSeenTour) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex(0);
      setActive(true);
      window.localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }, 800);

    return () => clearTimeout(timer);
  }, [mounted, onFinish]);

  useEffect(() => {
    if (!active) return;

    const updateRect = () => {
      const element = document.querySelector(
        `[data-tour="${currentStep.target}"]`
      );

      if (!element) {
        setRect(null);
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });

      setTimeout(() => {
        const box = element.getBoundingClientRect();

        setRect({
          top: box.top,
          left: box.left,
          right: box.right,
          bottom: box.bottom,
          width: box.width,
          height: box.height,
        });
      }, 500);
    };

    updateRect();

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [active, stepIndex, currentStep.target]);

  const tooltipPosition = useMemo(() => {
    if (typeof window === "undefined") {
      return { top: 120, left: 16 };
    }

    const tooltipWidth = 380;
    const tooltipHeight = 260;
    const margin = 16;
    const safeTop = 80;

    if (!rect) {
      return { top: 120, left: margin };
    }

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top;

    if (spaceBelow >= tooltipHeight + 40) {
      top = rect.bottom + 24;
    } else if (spaceAbove >= tooltipHeight + 40) {
      top = rect.top - tooltipHeight - 24;
    } else {
      top = Math.max(safeTop, window.innerHeight - tooltipHeight - margin);
    }

    top = Math.min(
      Math.max(top, safeTop),
      window.innerHeight - tooltipHeight - margin
    );

    let left = rect.left;

    left = Math.min(
      Math.max(left, margin),
      window.innerWidth - tooltipWidth - margin
    );

    return { top, left };
  }, [rect]);

  const labelPosition = useMemo(() => {
    if (typeof window === "undefined" || !rect) {
      return { top: 100, left: 16 };
    }

    const top =
      rect.top - 48 < 70
        ? Math.min(rect.bottom + 16, window.innerHeight - 60)
        : rect.top - 48;

    const left = Math.min(Math.max(rect.left + 8, 16), window.innerWidth - 150);

    return { top, left };
  }, [rect]);

  function nextStep() {
    if (stepIndex + 1 >= steps.length) {
      closeTour();
      return;
    }

    setStepIndex((prev) => prev + 1);
  }

  function prevStep() {
    if (stepIndex === 0) return;
    setStepIndex((prev) => prev - 1);
  }

  function startTour() {
    setStepIndex(0);
    setActive(true);
  }

  function closeTour() {
    setActive(false);
    setStepIndex(0);
    setRect(null);
    onFinish();
  }

  if (!mounted) return null;

  return (
    <>
      {active && (
        <div className="fixed inset-0 z-[999]">
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px]" />

          {rect && (
            <>
              <div
                className="absolute z-[1000] rounded-[28px] border-4 border-blue-400 bg-transparent shadow-[0_0_0_9999px_rgba(2,6,23,0.65),0_0_45px_rgba(59,130,246,1)] transition-all duration-300"
                style={{
                  top: rect.top - 12,
                  left: rect.left - 12,
                  width: rect.width + 24,
                  height: rect.height + 24,
                }}
              />

              <div
                className="absolute z-[1001] flex items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-xs font-black text-white shadow-2xl"
                style={{
                  top: labelPosition.top,
                  left: labelPosition.left,
                }}
              >
                <MousePointer2 className="h-4 w-4" />
                Bagian ini
              </div>
            </>
          )}

          <div
            className="absolute z-[1002] w-[calc(100vw-2rem)] max-w-sm rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-slate-950"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">
                  Panduan REPOLIB
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                  {currentStep.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeTour}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Tutup panduan"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              {currentStep.desc}
            </p>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex gap-1.5">
                {steps.map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === stepIndex
                        ? "w-7 bg-blue-700"
                        : "w-2 bg-slate-300 dark:bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={stepIndex === 0}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={nextStep}
                  className="flex h-10 items-center justify-center gap-2 rounded-full bg-blue-700 px-4 text-sm font-black text-white transition hover:bg-blue-800"
                >
                  {stepIndex + 1 >= steps.length ? "Selesai" : "Lanjut"}
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem(TOUR_STORAGE_KEY);
                setStepIndex(0);
                setActive(true);
              }}
              className="mt-4 text-xs font-bold text-slate-400 transition hover:text-blue-700 dark:hover:text-blue-300"
            >
              Ulangi panduan nanti
            </button>
          </div>
        </div>
      )}
    </>
  );
}