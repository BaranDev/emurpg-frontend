/**
 * EmuconDemoHome – A self-contained demo version of the Emucon Landing Page.
 *
 * Uses mock routes so users can navigate between the home demo and live tracking demo.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { config } from "../../config";
import { Link } from "react-router-dom";
import { Radio, Info } from "lucide-react";
import {
  EmuconNavbar,
  EmuconDivider,
  EmuconContentCard,
  EmuconFooter,
  EmuconStatsRow,
  EmuconSectionHeader,
  EmuconParallax,
  EmuconHero,
  EmuconFeatureCard,
  EmuconSchedule,
  EmuconContactGrid,
  GamepadIcon,
  MusicIcon,
  ArtIcon,
  FoodIcon,
  CameraIcon,
  WorkshopIcon,
} from "../../components/Emucon";

const features = [
  {
    icon: GamepadIcon,
    title: "Gaming Tournaments",
    description:
      "Competitive matches, casual play, and everything in between. Multiple games, real prizes.",
    descriptionTr: "Oyun Turnuvaları - Rekabetçi maçlar, ödüller.",
  },
  {
    icon: MusicIcon,
    title: "Live Music",
    description:
      "Performances throughout the day. Acoustic sets, full bands, and maybe some surprises.",
    descriptionTr: "Canlı Müzik - Gün boyu performanslar.",
  },
  {
    icon: ArtIcon,
    title: "Art & Exhibitions",
    description:
      "Student artwork on display. Talk to the artists, maybe take something home.",
    descriptionTr: "Sanat & Sergiler - Öğrenci eserleri.",
  },
  {
    icon: FoodIcon,
    title: "Food & Drinks",
    description:
      "Multiple food stalls with everything from traditional dishes to comfort food classics.",
    descriptionTr: "Yiyecek & İçecek - Çeşitli yemek stantları.",
  },
  {
    icon: CameraIcon,
    title: "Photo Corners",
    description:
      "Professional setups, interesting backgrounds, proper lighting. Instagram-ready shots.",
    descriptionTr: "Fotoğraf Köşeleri - Profesyonel çekimler.",
  },
  {
    icon: WorkshopIcon,
    title: "Workshops",
    description:
      "Hands-on sessions. Art techniques, tech skills, creative exercises. Learn something new.",
    descriptionTr: "Atölyeler - Yeni şeyler öğren.",
  },
];

const stats = [
  { number: "42+", label: "Student Clubs / Öğrenci Kulübü" },
  { number: "50+", label: "Activities / Etkinlik" },
  { number: "5", label: "Stage Performances / Sahne Performansı" },
  { number: "FREE", label: "Entry / Giriş Ücretsiz" },
];

const SCROLL_ANIMATION_SPEED = 300;
const SECTION_IDS = [
  "emucon-section-hero",
  "emucon-section-about",
  "emucon-section-stats",
  "emucon-section-features",
  "emucon-section-visitors",
  "emucon-section-schedule",
  "emucon-section-contact",
  "emucon-section-footer",
];

const smoothScrollTo = (
  container,
  targetY,
  duration = SCROLL_ANIMATION_SPEED,
) => {
  const startY = container.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();
  const animateScroll = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    container.scrollTop = startY + distance * progress;
    if (progress < 1) requestAnimationFrame(animateScroll);
  };
  requestAnimationFrame(animateScroll);
};

const EmuconDemoHome = () => {
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const scrollQueueRef = useRef([]);
  const [showDetailedSchedule, setShowDetailedSchedule] = useState(false);

  useEffect(() => {
    document.title = "EMURPG - EMUCON (Demo)";
  }, []);

  const findClosestSection = useCallback((scrollTop) => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id));
    let closestIndex = 0;
    let closestDistance = Infinity;
    sections.forEach((section, index) => {
      if (section) {
        const distance = Math.abs(scrollTop - section.offsetTop);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });
    return closestIndex;
  }, []);

  const processScrollQueue = useCallback(() => {
    if (
      !config.ENABLE_SCROLL_SNAP ||
      isScrollingRef.current ||
      scrollQueueRef.current.length === 0
    )
      return;
    const container = containerRef.current;
    if (!container) return;
    const direction = scrollQueueRef.current.shift();
    const nextSection = Math.max(
      0,
      Math.min(SECTION_IDS.length - 1, currentSectionRef.current + direction),
    );
    if (nextSection !== currentSectionRef.current) {
      const targetElement = document.getElementById(SECTION_IDS[nextSection]);
      if (targetElement) {
        isScrollingRef.current = true;
        currentSectionRef.current = nextSection;
        smoothScrollTo(container, targetElement.offsetTop);
        setTimeout(() => {
          isScrollingRef.current = false;
          processScrollQueue();
        }, SCROLL_ANIMATION_SPEED + 100);
      }
    }
  }, []);

  const handleWheel = useCallback(
    (e) => {
      if (!config.ENABLE_SCROLL_SNAP) return;
      e.preventDefault();
      scrollQueueRef.current.push(e.deltaY > 0 ? 1 : -1);
      processScrollQueue();
    },
    [processScrollQueue],
  );

  useEffect(() => {
    if (!config.ENABLE_SCROLL_SNAP) return;
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      currentSectionRef.current = findClosestSection(container.scrollTop);
    }
    return () => container?.removeEventListener("wheel", handleWheel);
  }, [handleWheel, findClosestSection]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-emucon-text-primary overflow-x-hidden overflow-y-auto select-none"
      style={{
        background: "transparent",
        position: "relative",
        zIndex: 1,
        height: "100vh",
      }}
    >
      <EmuconParallax />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* DEMO BANNER */}
        <div className="fixed top-0 left-0 right-0 z-[2000] bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>DEMO MODE</strong> — This is a showcase with mock data.
          </span>
        </div>

        <EmuconNavbar
          scrollThreshold={300}
          scrollContainer={containerRef}
          backPath="/demo/emucon"
        />

        <section
          id="emucon-section-hero"
          className="min-h-screen flex flex-col pt-10"
        >
          <EmuconHero
            onViewSchedule={() => setShowDetailedSchedule(true)}
            livePath="/demo/emucon/live"
            rulesPath="#"
            sponsorsPath="#"
          />
        </section>

        <section
          id="emucon-section-about"
          className="min-h-[30vh] md:min-h-screen flex flex-col justify-center py-2 md:py-16 lg:py-20 px-2 md:px-5 max-w-[1200px] mx-auto"
        >
          <EmuconSectionHeader title="What is EMUCON?" />
          <EmuconContentCard className="p-2 md:p-6 lg:p-10 text-sm md:text-base">
            <div className="mb-2 md:mb-8">
              <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-1 md:mb-4">
                English
              </span>
              <p className="text-emucon-text-secondary text-xs md:text-base leading-relaxed">
                EMUCON is a one-day festival where 42+ student clubs take over
                the Sports Complex.
              </p>
            </div>
            <EmuconDivider />
            <div>
              <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-1 md:mb-4">
                Türkçe
              </span>
              <p className="text-emucon-text-secondary text-xs md:text-base leading-relaxed">
                EMUCON, 42+ öğrenci kulübünün Spor Kompleksi&apos;ni ele
                geçirdiği bir yıllık geleneksel festivaldir.
              </p>
            </div>
          </EmuconContentCard>
        </section>

        <section
          id="emucon-section-stats"
          className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-8 md:py-16 lg:py-20 px-5 max-w-[1200px] mx-auto"
        >
          <EmuconStatsRow stats={stats} />
        </section>

        <section
          id="emucon-section-features"
          className="min-h-[40vh] md:min-h-screen flex flex-col justify-center py-2 md:py-16 lg:py-20 px-2 md:px-5 max-w-[1200px] mx-auto"
        >
          <EmuconSectionHeader title="What's Happening?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mt-2 md:mt-10">
            {features.map((f, i) => (
              <EmuconFeatureCard
                key={i}
                icon={f.icon}
                title={f.title}
                description={f.description}
                descriptionTr={f.descriptionTr}
              />
            ))}
          </div>
        </section>

        <section
          id="emucon-section-schedule"
          className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-8 md:py-16 lg:py-20 px-5 max-w-[1200px] mx-auto"
        >
          <EmuconSectionHeader title="Schedule Overview" />
          <EmuconSchedule
            externalShowDetailedSchedule={showDetailedSchedule}
            setExternalShowDetailedSchedule={setShowDetailedSchedule}
          />
        </section>

        <section
          id="emucon-section-footer"
          className="min-h-[50vh] flex flex-col justify-end"
        >
          <EmuconFooter
            logoVariant="lightgray"
            scrollContainer={containerRef}
          />
        </section>
      </div>

      <style>{`
        section { overflow: hidden; }
        div[style*="overflow-y: auto"]::-webkit-scrollbar { width: 8px; }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-track { background: rgba(13, 31, 13, 0.3); }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb { background: rgba(74, 124, 74, 0.5); border-radius: 4px; }
        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb:hover { background: rgba(74, 124, 74, 0.7); }
      `}</style>
    </div>
  );
};

export default EmuconDemoHome;
