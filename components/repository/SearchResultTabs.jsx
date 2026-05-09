"use client";

export default function SearchResultTabs({
  activeTab = "repository",
  setActiveTab = () => {},
  repositoryTotal = 0,
  slimsTotal = 0,
}) {
  const tabs = [
    {
      key: "repository",
      label: "Tugas Akhir",
      total: repositoryTotal,
    },
    {
      key: "slims",
      label: "Koleksi Buku",
      total: slimsTotal,
    },
    {
      key: "ojs",
      label: "Artikel Jurnal",
      total: null,
      disabled: true,
    },
    {
      key: "scholar",
      label: "Google Scholar",
      total: null,
      disabled: true,
    },
  ];

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        Showing results for
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            disabled={tab.disabled}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm font-black transition ${
              activeTab === tab.key
                ? "border-b-2 border-blue-700 text-slate-950 dark:text-white"
                : "text-blue-700 hover:text-blue-900 dark:text-blue-300"
            } ${
              tab.disabled
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer"
            }`}
          >
            {tab.label}
            {tab.total !== null && (
              <span className="ml-1 font-semibold">
                ({Number(tab.total).toLocaleString("id-ID")})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}