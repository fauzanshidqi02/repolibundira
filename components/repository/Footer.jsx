import { BookOpen, MapPin, LibraryBig } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-40 mt-auto overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white dark:from-slate-950 dark:via-slate-950 dark:to-black">
      <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.08),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg dark:bg-white/[0.06]">
                  <BookOpen className="h-7 w-7" />
                </div>

                <div>
                  <h2 className="text-xl font-black uppercase tracking-[0.22em] text-white md:text-2xl">
                    REPOLIB
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-blue-100/70 dark:text-slate-400">
                    Universitas Dian Nusantara
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-justify text-sm leading-8 text-blue-50/90 dark:text-slate-300">
                Repository Perpustakaan Universitas Dian Nusantara yang
                menyediakan akses koleksi tugas akhir dan karya ilmiah mahasiswa
                secara digital.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-blue-50/90 dark:bg-white/[0.05] dark:text-slate-300">
                <LibraryBig className="h-4 w-4" />
                <span>Digital Repository Service</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:col-span-7">
            <CampusCard
              title="Kampus Tanjung Duren"
              address="Jl. Tj. Duren Bar. 2 No.1, RT.1/RW.5, Tj. Duren Utara, Kec. Grogol petamburan, Kota Jakarta Barat, DKI Jakarta 11470"
            />

            <CampusCard
              title="Kampus Cibubur"
              address="Jl. Rw. Dolar No.65, RT.003/RW.007, Jatiraden, Kec. Jatisampurna, Kota Bekasi, Jawa Barat 17433"
            />
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 dark:border-white/[0.08]">
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <p className="text-xs leading-6 text-blue-100/75 dark:text-slate-500">
              © 2026 REPOLIB UNDIRA. All rights reserved.
            </p>

            <p className="text-xs leading-6 text-blue-100/60 dark:text-slate-500">
              Perpustakaan Universitas Dian Nusantara
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CampusCard({ title, address }) {
  return (
    <div className="group rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.14] hover:shadow-2xl hover:shadow-blue-950/30 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07] dark:hover:shadow-black/40">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white dark:bg-white/[0.06]">
          <MapPin className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
            {title}
          </h3>

          <p className="mt-4 text-justify text-sm leading-8 text-blue-50/85 dark:text-slate-300">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
}