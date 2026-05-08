"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

const CONSENT_KEY = "repolib-privacy-consent";

export default function PrivacyConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(CONSENT_KEY);

    if (!accepted) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  function acceptConsent() {
    localStorage.setItem(CONSENT_KEY, "true");
    setShow(false);
  }

  function declineConsent() {
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[120] w-[calc(100vw-2rem)] max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-slate-950 dark:text-white">
            Privacy Notice
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Kami menggunakan data terbatas untuk preferensi tampilan, statistik
            penggunaan, dan peningkatan layanan REPOLIB.
          </p>

          <button
            type="button"
            className="mt-2 text-sm font-bold text-blue-700 underline dark:text-blue-300"
          >
            Privacy Policy
          </button>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={declineConsent}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Decline
            </button>

            <button
              type="button"
              onClick={acceptConsent}
              className="rounded-full bg-blue-700 px-4 py-2 text-xs font-black text-white transition hover:bg-blue-800"
            >
              That&apos;s OK
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={declineConsent}
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}