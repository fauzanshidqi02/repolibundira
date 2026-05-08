"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
// import SecurityGuard from "./SecurityGuard";
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

export default function RepositoryApp() {
  const [lang, setLang] = useState("id");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("Semua");

  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState(false);

  const [advSearch, setAdvSearch] = useState({
    nama: "",
    nim: "",
    tahun: "",
    dosenPembimbing: "",
  });

  const [selectedYear, setSelectedYear] = useState("Semua");
  const [selectedSupervisor, setSelectedSupervisor] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const sliderRef = useRef(null);
  const t = translations[lang];

  const subjects = useMemo(
    () => [
      {
        value: "Akuntansi",
        name: t.subjectsList.akuntansi,
        icon: <Calculator className="h-8 w-8 text-rose-500" />,
      },
      {
        value: "Manajemen",
        name: t.subjectsList.manajemen,
        icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      },
      {
        value: "Ilmu Komunikasi",
        name: t.subjectsList.komunikasi,
        icon: <MessageCircle className="h-8 w-8 text-emerald-500" />,
      },
      {
        value: "Sastra Inggris",
        name: t.subjectsList.sastra,
        icon: <BookType className="h-8 w-8 text-orange-500" />,
      },
      {
        value: "Teknik Informatika",
        name: t.subjectsList.informatika,
        icon: <Monitor className="h-8 w-8 text-indigo-500" />,
      },
      {
        value: "Teknik Elektro",
        name: t.subjectsList.elektro,
        icon: <Zap className="h-8 w-8 text-amber-500" />,
      },
      {
        value: "Teknik Mesin",
        name: t.subjectsList.mesin,
        icon: (
          <Settings className="h-8 w-8 text-slate-500 dark:text-slate-300" />
        ),
      },
      {
        value: "Teknik Sipil",
        name: t.subjectsList.sipil,
        icon: <Building className="h-8 w-8 text-teal-600" />,
      },
    ],
    [t]
  );

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const items = await fetchRepositoryData();

        if (!active) return;

        setData(Array.isArray(items) ? items : []);
        setLoading(false);
      } catch (error) {
        console.warn("Gagal mengambil data repository:", error);

        if (!active) return;

        setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer1 = setTimeout(() => setSplashFading(true), 900);
      const timer2 = setTimeout(() => setShowSplash(false), 1300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    return undefined;
  }, [loading]);

  const availableYears = useMemo(() => {
    const years = new Set();

    data.forEach((item) => {
      const year = item?.tahun?.trim();

      if (year) {
        years.add(year);
      }
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
      const supervisorQuery = selectedSupervisor.toLowerCase().trim();

      result = result.filter((item) =>
        item?.dosenPembimbing?.toLowerCase().includes(supervisorQuery)
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
    const slider = sliderRef.current;

    if (!slider || loading) return undefined;

    let isPaused = false;

    const interval = setInterval(() => {
      if (isPaused) return;

      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: 420,
          behavior: "smooth",
        });
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
  }, [loading, filteredData]);

  function openSearchPage() {
    const hasAdvSearch =
      advSearch.nama ||
      advSearch.nim ||
      advSearch.tahun ||
      advSearch.dosenPembimbing;

    if (searchQuery.trim() || selectedSubject !== "Semua" || hasAdvSearch) {
      setIsSearchPage(true);
      setCurrentPage(1);
      setIsAdvSearchOpen(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    openSearchPage();
  }

  function handleSubjectSelect(subject) {
    setSelectedSubject(subject);
    setSelectedSupervisor("Semua");
    setSelectedYear("Semua");
    setCurrentPage(1);
    setIsSearchPage(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetFilters() {
    setSearchQuery("");
    setSelectedSubject("Semua");

    setAdvSearch({
      nama: "",
      nim: "",
      tahun: "",
      dosenPembimbing: "",
    });

    setSelectedYear("Semua");
    setSelectedSupervisor("Semua");
    setCurrentPage(1);
  }

  function handleBackToHome() {
    setIsSearchPage(false);
    resetFilters();
    setIsAdvSearchOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handlePageChange(page) {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleYearFilterChange(value) {
    setSelectedYear(value);
    setCurrentPage(1);
  }

  function handleSupervisorSearchChange(value) {
    const nextValue = value.trim() ? value : "Semua";

    setSelectedSupervisor(nextValue);
    setCurrentPage(1);
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      {showSplash && <SplashScreen fading={splashFading} text={t.ui.loading} />}

      <Navbar
        lang={lang}
        onToggleLang={() => setLang(lang === "id" ? "en" : "id")}
        onBackHome={handleBackToHome}
        onToggleDark={toggleDarkMode}
        t={t}
      />

      {/* <SecurityGuard /> */}

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

              <SubjectStats
                t={t}
                data={data}
                subjects={subjects}
                onSelectSubject={handleSubjectSelect}
              />
            </main>
          </>
        ) : (
          <SearchPage
            t={t}
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

      <Footer />
    </div>
  );
}