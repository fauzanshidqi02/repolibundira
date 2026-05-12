"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const TOUR_DONE_KEY = "repolib-tour-done";
const TOUR_SKIP_SESSION_KEY = "repolib-tour-skip-session";

function getVisibleElement(selector) {
  if (typeof window === "undefined") return null;

  const elements = Array.from(document.querySelectorAll(selector));

  return (
    elements.find((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    }) || null
  );
}

function getTargetRect(selector) {
  const element = getVisibleElement(selector);

  if (!element) return null;

  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
  };
}

function getTooltipStyle(targetRect) {
  if (typeof window === "undefined") return {};

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const cardWidth = viewportWidth < 640 ? viewportWidth - 32 : 380;
  const cardHeight = 230;
  const gap = 18;

  if (!targetRect) {
    return {
      width: cardWidth,
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  let top = targetRect.bottom + gap;
  let left = targetRect.left;

  if (top + cardHeight > viewportHeight - 16) {
    top = targetRect.top - cardHeight - gap;
  }

  if (top < 16) top = 16;

  if (left + cardWidth > viewportWidth - 16) {
    left = viewportWidth - cardWidth - 16;
  }

  if (left < 16) left = 16;

  return {
    width: cardWidth,
    top,
    left,
  };
}

export default function GuidedTour({ onFinish = () => {} }) {
  const steps = useMemo(
    () => [
      {
        title: "Kolom Pencarian",
        description:
          "Gunakan bagian ini untuk mencari judul tugas akhir, nama mahasiswa, NIM, program studi, atau tahun.",
        selector: '[data-tour="search-box"]',
      },
      {
        title: "Pencarian Spesifik",
        description:
          "Klik ikon filter untuk pencarian yang lebih detail, misalnya berdasarkan nama, NIM, tahun, atau dosen pembimbing.",
        selector:
          '[data-tour="advanced-search-button"], [data-tour="advanced-search-mobile-button"]',
      },
      {
        title: "Telusuri Subjek",
        description:
          "Bagian ini membantu pengunjung melihat koleksi berdasarkan program studi.",
        selector: '[data-tour="subject-browser"], #subject-browser',
      },
      {
        title: "Koleksi Terbaru",
        description:
          "Di sini pengunjung bisa melihat koleksi tugas akhir yang terbaru atau diperbarui.",
        selector: '[data-tour="collection-slider"], #collection-slider',
      },
      {
        title: "Statistik Subjek",
        description:
          "Bagian ini menampilkan ringkasan jumlah koleksi berdasarkan program studi.",
        selector: '[data-tour="subject-stats"], #subject-stats',
      },
    ],
    []
  );

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  const currentStep = steps[stepIndex];

  useEffect(() => {
    setMounted(true);

    const alreadyDone = window.localStorage.getItem(TOUR_DONE_KEY) === "true";
    const skippedThisSession =
      window.sessionStorage.getItem(TOUR_SKIP_SESSION_KEY) === "true";

    if (!alreadyDone && !skippedThisSession) {
      const timer = window.setTimeout(() => {
        setActive(true);
      }, 500);

      return () => window.clearTimeout(timer);
    }

    onFinish();

    return undefined;
  }, [onFinish]);

  useEffect(() => {
    if (!mounted || !active || !currentStep) return undefined;

    let timer = null;

    function updateTarget() {
      const element = getVisibleElement(currentStep.selector);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }

      timer = window.setTimeout(() => {
        setTargetRect(getTargetRect(currentStep.selector));
      }, 380);
    }

    updateTarget();

    window.addEventListener("resize", updateTarget);
    window.addEventListener("scroll", updateTarget, true);

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", updateTarget, true);
    };
  }, [mounted, active, currentStep]);

  if (!mounted || !active) return null;

  const isLastStep = stepIndex === steps.length - 1;
  const tooltipStyle = getTooltipStyle(targetRect);

  function closeForNow() {
    window.sessionStorage.setItem(TOUR_SKIP_SESSION_KEY, "true");
    setActive(false);
    onFinish();
  }

  function finishTour() {
    window.localStorage.setItem(TOUR_DONE_KEY, "true");
    setActive(false);
    onFinish();
  }

  function nextStep() {
    if (isLastStep) {
      finishTour();
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function previousStep() {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {targetRect ? (
        <>
          <div
            className="absolute rounded-[28px] border-4 border-blue-400 bg-transparent shadow-[0_0_0_9999px_rgba(2,6,23,0.72)] transition-all duration-300"
            style={{
              top: targetRect.top - 10,
              left: targetRect.left - 10,
              width: targetRect.width + 20,
              height: targetRect.height + 20,
            }}
          />

          <div
            className="absolute rounded-full bg-blue-700 px-4 py-2 text-xs font-black text-white shadow-xl"
            style={{
              top: Math.max(targetRect.top - 48, 16),
              left: Math.max(targetRect.left, 16),
            }}
          >
            Bagian ini
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-slate-950/75" />
      )}

      <div
        className="pointer-events-auto absolute rounded-[28px] bg-white p-5 text-slate-950 shadow-2xl"
        style={tooltipStyle}
      >
        <button
          type="button"
          onClick={closeForNow}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
          aria-label="Tutup panduan"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-blue-700">
          Panduan Repolib
        </p>

        <h3 className="pr-8 text-xl font-black tracking-tight">
          {currentStep.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {currentStep.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <span
                key={step.title}
                className={`h-2 rounded-full transition-all ${
                  index === stepIndex ? "w-7 bg-blue-700" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previousStep}
              disabled={stepIndex === 0}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-blue-700 px-5 text-sm font-black text-white transition hover:bg-blue-800"
            >
              {isLastStep ? "Selesai" : "Lanjut"}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={closeForNow}
          className="mt-4 text-xs font-black text-slate-500 transition hover:text-blue-700"
        >
          Ulangi panduan nanti
        </button>
      </div>
    </div>
  );
}