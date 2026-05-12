"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Calculator,
  MessageCircle,
  BookType,
  Monitor,
  Zap,
  Settings,
  Building,
} from "lucide-react";

import { translations } from "@/data/translations";
import { fetchRepositoryData } from "@/lib/repositoryApi";

import Navbar from "./Navbar";
import GuidedTour from "./GuidedTour";
import PrivacyConsent from "./PrivacyConsent";
import SplashScreen from "./SplashScreen";
import HeroSection from "./HeroSection";
import SubjectBrowser from "./SubjectBrowser";
import CollectionSlider from "./CollectionSlider";
import SubjectStats from "./SubjectStats";
import SearchPage from "./SearchPage";
import DetailModal from "./DetailModal";
import Footer from "./Footer";

const ITEMS_PER_PAGE = 10;
const AUTO_REFRESH_INTERVAL = 30000;
const SKIP_SPLASH_KEY = "repolib-skip-splash";

export default function RepositoryApp({ forceSearchPage = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState("id");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState("Semua");
  const [selectedSupervisor, setSelectedSupervisor] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [isSearchPage, setIsSearchPage] = useState(forceSearchPage);
  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState(false);

  const [advSearch, setAdvSearch] = useState({
    nama: "",
    nim: "",
    tahun: "",
    dosenPembimbing: "",
  });

  const [showSplash, setShowSplash] = useState(false);
  const [splashFading, setSplashFading] = useState(false);
  const [tourFinished, setTourFinished] = useState(forceSearchPage);

  const sliderRef = useRef(null);
  const t = translations[lang] || translations.id;

  useEffect(() => {
    const shouldSkipSplash =
      forceSearchPage ||
      window.sessionStorage.getItem(SKIP_SPLASH_KEY) === "true";

    setShowSplash(!shouldSkipSplash);
    setMounted(true);
  }, [forceSearchPage]);

  const finishTour = useCallback(() => {
    setTourFinished(true);
  }, []);

  const subjects = useMemo(
    () => [
      {
        value: "Akuntansi",
        name: t.subjectsList?.akuntansi || "Akuntansi",
        icon: <Calculator className="h-8 w-8 text-rose-500" />,
      },
      {
        value: "Manajemen",
        name: t.subjectsList?.manajemen || "Manajemen",
        icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      },
      {
        value: "Ilmu Komunikasi",
        name: t.subjectsList?.komunikasi || "Ilmu Komunikasi",
        icon: <MessageCircle className="h-8 w-8 text-emerald-500" />,
      },
      {
        value: "Sastra Inggris",
        name: t.subjectsList?.sastra || "Sastra Inggris",
        icon: <BookType className="h-8 w-8 text-orange-500" />,
      },
      {
        value: "Teknik Informatika",
        name: t.subjectsList?.informatika || "Teknik Informatika",
        icon: <Monitor className="h-8 w-8 text-indigo-500" />,
      },
      {
        value: "Teknik Elektro",
        name: t.subjectsList?.elektro || "Teknik Elektro",
        icon: <Zap className="h-8 w-8 text-amber-500" />,
      },
      {
        value: "Teknik Mesin",
        name: t.subjectsList?.mesin || "Teknik Mesin",
        icon: (
          <Settings className="h-8 w-8 text-slate-500 dark:text-slate-300" />
        ),
      },
      {
        value: "Teknik Sipil",
        name: t.subjectsList?.sipil || "Teknik Sipil",
        icon: <Building className="h-8 w-8 text-teal-600" />,
      },
    ],
    [t]
  );

  function skipSplashForThisTab() {
    window.sessionStorage.setItem(SKIP_SPLASH_KEY, "true");
    setShowSplash(false);
    setSplashFading(false);
  }

  function makeSearchUrl({
    keyword = "",
    subject = "Semua",
    year = "Semua",
    dosen = "Semua",
    adv = {
      nama: "",
      nim: "",
      tahun: "",
      dosenPembimbing: "",
    },
  }) {
    const params = new URLSearchParams();

    if (keyword?.trim()) params.set("keyword", keyword.trim());
    if (subject && subject !== "Semua") params.set("subject", subject);
    if (year && year !== "Semua") params.set("year", year);
    if (dosen && dosen !== "Semua") params.set("dosen", dosen);

    if (adv?.nama?.trim()) params.set("nama", adv.nama.trim());
    if (adv?.nim?.trim()) params.set("nim", adv.nim.trim());
    if (adv?.tahun?.trim()) params.set("tahun", adv.tahun.trim());
    if (adv?.dosenPembimbing?.trim()) {
      params.set("pembimbing", adv.dosenPembimbing.trim());
    }

    const query = params.toString();
    return query ? `/search?${query}` : "/search";
  }

  useEffect(() => {
    if (!mounted) return;

    const keyword = searchParams.get("keyword") || "";
    const subject = searchParams.get("subject") || "Semua";
    const year = searchParams.get("year") || "Semua";
    const dosen = searchParams.get("dosen") || "Semua";

    const nama = searchParams.get("nama") || "";
    const nim = searchParams.get("nim") || "";
    const tahun = searchParams.get("tahun") || "";
    const pembimbing = searchParams.get("pembimbing") || "";

    const hasParams =
      keyword ||
      subject !== "Semua" ||
      year !== "Semua" ||
      dosen !== "Semua" ||
      nama ||
      nim ||
      tahun ||
      pembimbing;

    if (forceSearchPage || hasParams) {
      setSearchQuery(keyword);
      setSelectedSubject(subject);
      setSelectedYear(year);
      setSelectedSupervisor(dosen);
      setAdvSearch({
        nama,
        nim,
        tahun,
        dosenPembimbing: pembimbing,
      });

      setIsSearchPage(true);
      setCurrentPage(1);
      skipSplashForThisTab();
      setTourFinished(true);
    }
  }, [forceSearchPage, mounted, searchParams]);

  useEffect(() => {
    if (!mounted) return;

    let active = true;

    const loadData = async () => {
      try {
        const items = await fetchRepositoryData();

        if (!active) return;

        setData(Array.isArray(items) ? items : []);
      } catch (error) {
        console.warn("Gagal mengambil data repository:", error);

        if (!active) return;

        setData([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(loadData, AUTO_REFRESH_INTERVAL);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (forceSearchPage || isSearchPage) {
      skipSplashForThisTab();
      setTourFinished(true);
      return undefined;
    }

    if (!loading && showSplash) {
      const timer1 = setTimeout(() => setSplashFading(true), 900);
      const timer2 = setTimeout(() => {
        setShowSplash(false);
        window.sessionStorage.setItem(SKIP_SPLASH_KEY, "true");
      }, 1300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    return undefined;
  }, [loading, forceSearchPage, isSearchPage, showSplash, mounted]);

  const availableYears = useMemo(() => {
    const years = new Set();

    data.forEach((item) => {
      const year = item?.tahun?.trim();
      if (year) years.add(year);
    });

    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [data]);

  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? data : [];

    if (selectedSubject !== "Semua") {
      result = result.filter((item) =>
        item?.subjek?.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (item) =>
          item?.judul?.toLowerCase().includes(query) ||
          item?.nama?.toLowerCase().includes(query) ||
          item?.nim?.toLowerCase().includes(query) ||
          item?.subjek?.toLowerCase().includes(query) ||
          item?.pengarang?.toLowerCase().includes(query) ||
          item?.tahun?.toLowerCase().includes(query) ||
          item?.dosenPembimbing?.toLowerCase().includes(query)
      );
    }

    if (advSearch.nama.trim()) {
      const query = advSearch.nama.toLowerCase();

      result = result.filter((item) =>
        item?.nama?.toLowerCase().includes(query)
      );
    }

    if (advSearch.nim.trim()) {
      const query = advSearch.nim.toLowerCase();

      result = result.filter((item) =>
        item?.nim?.toLowerCase().includes(query)
      );
    }

    if (advSearch.tahun.trim()) {
      const query = advSearch.tahun.toLowerCase();

      result = result.filter((item) =>
        item?.tahun?.toLowerCase().includes(query)
      );
    }

    if (advSearch.dosenPembimbing.trim()) {
      const query = advSearch.dosenPembimbing.toLowerCase();

      result = result.filter((item) =>
        item?.dosenPembimbing?.toLowerCase().includes(query)
      );
    }

    if (selectedYear !== "Semua") {
      result = result.filter((item) => item?.tahun?.trim() === selectedYear);
    }

    if (selectedSupervisor !== "Semua" && selectedSupervisor.trim()) {
      const query = selectedSupervisor.toLowerCase().trim();

      result = result.filter((item) =>
        item?.dosenPembimbing?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [
    data,
    searchQuery,
    selectedSubject,
    advSearch,
    selectedYear,
    selectedSupervisor,
  ]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (!mounted) return undefined;

    const slider = sliderRef.current;

    if (!slider || loading) return undefined;

    let isPaused = false;

    const interval = setInterval(() => {
      if (isPaused) return;

      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: 420, behavior: "smooth" });
      }
    }, 4200);

    const pause = () => {
      isPaused = true;
    };

    const resume = () => {
      isPaused = false;
    };

    slider.addEventListener("mouseenter", pause);
    slider.addEventListener("mouseleave", resume);
    slider.addEventListener("touchstart", pause, { passive: true });
    slider.addEventListener("touchend", resume);

    return () => {
      clearInterval(interval);
      slider.removeEventListener("mouseenter", pause);
      slider.removeEventListener("mouseleave", resume);
      slider.removeEventListener("touchstart", pause);
      slider.removeEventListener("touchend", resume);
    };
  }, [loading, filteredData, mounted]);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const keyword = searchQuery.trim();

    setSelectedSubject("Semua");
    setSelectedYear("Semua");
    setSelectedSupervisor("Semua");
    setAdvSearch({
      nama: "",
      nim: "",
      tahun: "",
      dosenPembimbing: "",
    });

    setIsSearchPage(true);
    setCurrentPage(1);
    setIsAdvSearchOpen(false);
    skipSplashForThisTab();
    setTourFinished(true);

    router.push(
      makeSearchUrl({
        keyword,
        subject: "Semua",
        year: "Semua",
        dosen: "Semua",
        adv: {
          nama: "",
          nim: "",
          tahun: "",
          dosenPembimbing: "",
        },
      })
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubjectSelect(subject) {
    setSearchQuery("");
    setSelectedSubject(subject);
    setSelectedYear("Semua");
    setSelectedSupervisor("Semua");
    setAdvSearch({
      nama: "",
      nim: "",
      tahun: "",
      dosenPembimbing: "",
    });

    setCurrentPage(1);
    setIsSearchPage(true);
    skipSplashForThisTab();
    setTourFinished(true);

    router.push(
      makeSearchUrl({
        keyword: "",
        subject,
        year: "Semua",
        dosen: "Semua",
        adv: {
          nama: "",
          nim: "",
          tahun: "",
          dosenPembimbing: "",
        },
      })
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetFilters() {
    setSearchQuery("");
    setSelectedSubject("Semua");
    setSelectedYear("Semua");
    setSelectedSupervisor("Semua");
    setCurrentPage(1);

    setAdvSearch({
      nama: "",
      nim: "",
      tahun: "",
      dosenPembimbing: "",
    });

    if (isSearchPage || forceSearchPage) {
      router.replace("/search");
    }
  }

  function handleBackToHome() {
    setIsSearchPage(false);
    setSearchQuery("");
    setSelectedSubject("Semua");
    setSelectedYear("Semua");
    setSelectedSupervisor("Semua");
    setCurrentPage(1);
    setIsAdvSearchOpen(false);
    skipSplashForThisTab();
    setTourFinished(true);

    setAdvSearch({
      nama: "",
      nim: "",
      tahun: "",
      dosenPembimbing: "",
    });

    router.push("/");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleYearFilterChange(value) {
    setSelectedYear(value);
    setCurrentPage(1);

    router.push(
      makeSearchUrl({
        keyword: searchQuery,
        subject: selectedSubject,
        year: value,
        dosen: selectedSupervisor,
        adv: advSearch,
      })
    );
  }

  function handleSupervisorSearchChange(value) {
    const nextValue = value.trim() ? value : "Semua";

    setSelectedSupervisor(nextValue);
    setCurrentPage(1);

    router.push(
      makeSearchUrl({
        keyword: searchQuery,
        subject: selectedSubject,
        year: selectedYear,
        dosen: nextValue,
        adv: advSearch,
      })
    );
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      {showSplash && !isSearchPage && !forceSearchPage && (
        <SplashScreen fading={splashFading} text={t.ui?.loading || "Loading"} />
      )}

      <Navbar
        lang={lang}
        onToggleLang={() => setLang(lang === "id" ? "en" : "id")}
        onBackHome={handleBackToHome}
        onToggleDark={toggleDarkMode}
        t={t}
      />

      {!showSplash && !forceSearchPage && !isSearchPage && (
        <GuidedTour onFinish={finishTour} />
      )}

      <div className="pt-16 md:pt-20">
        {!isSearchPage ? (
          <>
            <HeroSection
              t={t}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              advSearch={advSearch}
              setAdvSearch={setAdvSearch}
              isAdvSearchOpen={isAdvSearchOpen}
              setIsAdvSearchOpen={setIsAdvSearchOpen}
              handleSearchSubmit={handleSearchSubmit}
              resetFilters={resetFilters}
            />

            <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
              <SubjectBrowser
                t={t}
                subjects={subjects}
                selectedSubject={selectedSubject}
                showAllSubjects={showAllSubjects}
                setShowAllSubjects={setShowAllSubjects}
                onSelectSubject={handleSubjectSelect}
              />

              <CollectionSlider
                t={t}
                loading={loading}
                items={filteredData.slice(0, 12)}
                sliderRef={sliderRef}
                onSelectItem={setSelectedItem}
              />

              <SubjectStats t={t} data={data} subjects={subjects} />
            </main>
          </>
        ) : (
          <SearchPage
            t={t}
            loading={loading}
            subjects={subjects}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            advSearch={advSearch}
            setAdvSearch={setAdvSearch}
            isAdvSearchOpen={isAdvSearchOpen}
            setIsAdvSearchOpen={setIsAdvSearchOpen}
            handleSearchSubmit={handleSearchSubmit}
            handleBackToHome={handleBackToHome}
            resetFilters={resetFilters}
            selectedSubject={selectedSubject}
            selectedYear={selectedYear}
            setSelectedYear={handleYearFilterChange}
            availableYears={availableYears}
            selectedSupervisor={selectedSupervisor}
            setSelectedSupervisor={handleSupervisorSearchChange}
            filteredData={filteredData}
            currentItems={currentItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSelectItem={setSelectedItem}
          />
        )}
      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          t={t}
        />
      )}

      {!showSplash && tourFinished && <PrivacyConsent />}

      <Footer />
    </div>
  );
}