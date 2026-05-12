"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
} from "lucide-react";

function safeText(value, fallback = "-") {
  const text = String(value || "").trim();
  return text || fallback;
}

function truncateText(value = "", max = 60) {
  const text = safeText(value, "");

  if (text.length <= max) return text;

  return `${text.slice(0, max).trim()}...`;
}

function getCardGradient(index) {
  const gradients = [
    "from-blue-900 to-slate-950",
    "from-violet-900 to-slate-950",
    "from-emerald-900 to-slate-950",
    "from-indigo-900 to-slate-950",
    "from-slate-800 to-slate-950",
  ];

  return gradients[index % gradients.length];
}

export default function CollectionSlider({
  t = {},
  loading = false,
  items = [],
  sliderRef = null,
  onSelectItem = () => {},
}) {
  const collection = t?.collection || {};

  function scrollSlider(direction) {
    const slider = sliderRef?.current;

    if (!slider) return;

    slider.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="collection-slider"
      data-tour="collection-slider"
      className="mb-12"
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-300">
            <BookOpen className="h-4 w-4" />
            {collection.badge || "Repository Update"}
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
            {collection.title || "Koleksi Terbaru dan Diperbarui"}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            {collection.description ||
              "Daftar koleksi terbaru yang tersedia di repository."}
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollSlider("left")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            aria-label="Geser kiri"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollSlider("right")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            aria-label="Geser kanan"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`collection-skeleton-${index}`}
              className="h-[360px] min-w-[270px] animate-pulse rounded-[24px] bg-slate-200 dark:bg-white/10 sm:min-w-[310px]"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div
          ref={sliderRef}
          className="scrollbar-hide flex snap-x gap-6 overflow-x-auto scroll-smooth pb-3"
        >
          {items.map((item, index) => {
            const title = safeText(item.judul || item.title, "Tanpa Judul");
            const year = safeText(item.tahun || item.year, "-");
            const subject = safeText(item.subjek || item.subject, "-");
            const studentName = safeText(
              item.nama || item.studentName || item.pengarang,
              "-"
            );
            const supervisor = safeText(
              item.dosenPembimbing || item.supervisor || item.pembimbing,
              "-"
            );

            return (
              <button
                key={item.id || `${title}-${index}`}
                type="button"
                onClick={() => onSelectItem(item)}
                className="group min-w-[270px] snap-start overflow-hidden rounded-[24px] border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5 sm:min-w-[310px]"
              >
                <div
                  className={`flex h-[220px] flex-col items-center justify-between bg-gradient-to-br ${getCardGradient(
                    index
                  )} p-6 text-center text-white`}
                >
                  <p className="text-xs font-black tracking-[0.35em] text-white/80">
                    {year}
                  </p>

                  <div>
                    <h3 className="text-lg font-black uppercase leading-snug tracking-wide">
                      {truncateText(title, 88)}
                    </h3>

                    <div className="mx-auto my-5 h-px w-16 bg-white/40" />

                    <p className="text-sm font-black text-white/85">
                      {truncateText(studentName, 32)}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-2 text-lg font-black leading-snug text-slate-950 dark:text-white">
                    {truncateText(title, 58)}
                  </h3>

                  <div className="mt-4 space-y-3">
                    <InfoLine
                      icon={<User className="h-4 w-4" />}
                      text={truncateText(studentName, 36)}
                    />

                    <InfoLine
                      icon={<GraduationCap className="h-4 w-4" />}
                      text={truncateText(supervisor, 36)}
                    />

                    <InfoLine
                      icon={<Calendar className="h-4 w-4" />}
                      text={year}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">
                      {subject}
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 transition group-hover:bg-blue-700 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/20">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-white/5">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />

          <h3 className="text-lg font-black text-slate-950 dark:text-white">
            Belum ada koleksi yang dapat ditampilkan.
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Data akan tampil setelah repository berhasil dimuat.
          </p>
        </div>
      )}
    </section>
  );
}

function InfoLine({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
      <span className="text-slate-400">{icon}</span>
      <span>{text}</span>
    </div>
  );
}