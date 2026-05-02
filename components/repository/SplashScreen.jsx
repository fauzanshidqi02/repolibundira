import { BookOpen } from "lucide-react";

export default function SplashScreen({ fading, text }) {
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 dark:bg-slate-950 ${fading ? "opacity-0" : "opacity-100"}`}>
      <div className="mb-6 rounded-[2rem] bg-blue-700 p-5 shadow-2xl shadow-blue-500/30 animate-soft-pulse">
        <BookOpen className="h-16 w-16 text-white" />
      </div>
      <h1 className="text-xl font-black tracking-[0.35em] text-slate-900 dark:text-white">REPOLIB</h1>
      <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}
