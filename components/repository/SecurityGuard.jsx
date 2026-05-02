"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, X } from "lucide-react";

export default function SecurityGuard() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const showSecurityWarning = () => {
      setShowWarning(true);

      setTimeout(() => {
        setShowWarning(false);
      }, 2800);
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      showSecurityWarning();
    };

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      const blocked =
        key === "f12" ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && key === "u") ||
        (event.metaKey && event.altKey && ["i", "j", "c"].includes(key));

      if (blocked) {
        event.preventDefault();
        showSecurityWarning();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[999] w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-blue-200 bg-white p-4 shadow-2xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-950">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <ShieldAlert className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-slate-950 dark:text-white">
            Akses dibatasi
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
            Fitur klik kanan dan pintasan developer dinonaktifkan untuk menjaga
            kenyamanan akses repository.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowWarning(false)}
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}