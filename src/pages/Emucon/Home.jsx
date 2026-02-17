import { useState, useEffect, useRef, useCallback } from "react";
import { config } from "../../config";
import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
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

// Scroll animation speed in milliseconds
const SCROLL_ANIMATION_SPEED = 300;

// Section IDs for scroll snapping
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

// Custom linear easing scroll function
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

    // Linear easing
    const easeProgress = progress;

    container.scrollTop = startY + distance * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

const EmuconHome = () => {
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const currentSectionRef = useRef(0);
  const scrollQueueRef = useRef([]);
  const [showDetailedSchedule, setShowDetailedSchedule] = useState(false);

  useEffect(() => {
    document.title = "EMURPG - EMUCON 2025";
  }, []);

  // Find closest section based on scroll position
  const findClosestSection = useCallback((scrollTop) => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id));

    let closestIndex = 0;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
      if (section) {
        const sectionTop = section.offsetTop;
        const distance = Math.abs(scrollTop - sectionTop);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    return closestIndex;
  }, []);

  // Handle wheel events for custom smooth scrolling
  // Only allow one scroll per animation, queue up extra scrolls
  const processScrollQueue = useCallback(() => {
    if (!config.ENABLE_SCROLL_SNAP) return;
    if (isScrollingRef.current || scrollQueueRef.current.length === 0) return;
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
      const container = containerRef.current;
      if (!container) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      scrollQueueRef.current.push(direction);
      processScrollQueue();
    },
    [processScrollQueue],
  );

  // Handle touch events for mobile
  const touchStartRef = useRef(0);

  const handleTouchStart = useCallback((e) => {
    if (!config.ENABLE_SCROLL_SNAP) return;
    touchStartRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (!config.ENABLE_SCROLL_SNAP) return;
      const container = containerRef.current;
      if (!container) return;
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStartRef.current - touchEnd;
      // Minimum swipe distance (50px)
      if (Math.abs(diff) < 50) return;
      const direction = diff > 0 ? 1 : -1;
      scrollQueueRef.current.push(direction);
      processScrollQueue();
    },
    [processScrollQueue],
  );

  // Home has a large hero; on wide screens the document height can shift after
  // initial paint (images/fonts), which can throw off EmuconParallax's maxScroll
  // calculation and make the sky look "misplaced". Nudge a few re-measures.
  useEffect(() => {
    if (!config.ENABLE_SCROLL_SNAP) return;
    const remeasure = () => window.dispatchEvent(new Event("resize"));

    remeasure();
    const t1 = window.setTimeout(remeasure, 200);
    const t2 = window.setTimeout(remeasure, 800);
    const t3 = window.setTimeout(remeasure, 1800);

    window.addEventListener("load", remeasure);

    // Setup custom scroll handling
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });

      // Initialize current section based on scroll position
      currentSectionRef.current = findClosestSection(container.scrollTop);
    }

    return () => {
      window.removeEventListener("load", remeasure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);

      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd, findClosestSection]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-emucon-text-primary overflow-x-hidden overflow-y-auto select-none"
      style={{
        background: "transparent",
        position: "relative",
        zIndex: 1,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Parallax background - fixed behind content */}
      <EmuconParallax />

      {/* Content wrapper - sits above parallax */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Navbar - appears on scroll */}
        <EmuconNavbar scrollThreshold={300} scrollContainer={containerRef} />

        {/* Hero Section */}
        <section
          id="emucon-section-hero"
          className="min-h-screen flex flex-col select-none"
        >
          <EmuconHero onViewSchedule={() => setShowDetailedSchedule(true)} />
        </section>

        {/* What is EMUCON Section */}
        <section
          id="emucon-section-about"
          className="min-h-[30vh] md:min-h-screen flex flex-col justify-center py-2 md:py-16 lg:py-20 px-2 md:px-5 max-w-[1200px] mx-auto select-none"
        >
          <EmuconSectionHeader title="What is EMUCON?" />

          <EmuconContentCard className="p-2 md:p-6 lg:p-10 text-sm md:text-base">
            {/* English content */}
            <div className="mb-2 md:mb-8">
              <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-1 md:mb-4">
                English
              </span>
              <h3 className="font-cinzel text-base md:text-xl lg:text-2xl text-cream mb-1 md:mb-4">
                The Ultimate Campus Festival
              </h3>
              <p className="text-emucon-text-secondary text-xs md:text-base mb-1 md:md-4 leading-relaxed">
                EMUCON is a one-day festival where 42+ student clubs take over
                the Sports Complex from 2:00 PM to 8:00 PM for gaming
                tournaments, live music, art exhibitions, food stalls, and
                everything creative happening on campus, all in one place.
              </p>
              <p className="text-emucon-text-secondary text-xs md:text-base mb-1 md:mb-4 leading-relaxed">
                This isn&apos;t your typical university event where you sit
                quietly and clap politely. EMUCON is designed to be interactive,
                energetic, and genuinely fun. Walk in, explore whatever catches
                your attention, stay as long as you want. It&apos;s completely
                free and open to everyone.
              </p>
              <p className="text-emucon-text-secondary text-xs md:text-base leading-relaxed">
                Our goal is to make this an annual tradition, a festival that
                celebrates student creativity and brings together the entire
                campus community.
              </p>
            </div>

            <EmuconDivider />

            {/* Turkish content */}
            <div>
              <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-1 md:mb-4">
                Türkçe
              </span>
              <h3 className="font-cinzel text-base md:text-xl lg:text-2xl text-cream mb-1 md:mb-4">
                Kampüsün En Büyük Festivali
              </h3>
              <p className="text-emucon-text-secondary text-xs md:text-base mb-1 md:mb-4 leading-relaxed">
                EMUCON, 42+ öğrenci kulübünün Spor Kompleksi&apos;ni 14:00-20:00
                arası ele geçirdiği, oyun turnuvalarından canlı müziğe, sanat
                sergilerinden yemek stantlarına kadar her şeyin tek bir yerde
                toplandığı bir günlük festivaldir.
              </p>
              <p className="text-emucon-text-secondary text-xs md:text-base mb-1 md:mb-4 leading-relaxed">
                Bu sıradan bir üniversite etkinliği değil. EMUCON interaktif,
                enerjik ve gerçekten eğlenceli olacak şekilde tasarlandı. İçeri
                gir, ilgini çeken her şeyi keşfet, istediğin kadar kal. Tamamen
                ücretsiz ve herkese açık.
              </p>
              <p className="text-emucon-text-secondary text-xs md:text-base leading-relaxed">
                Amacımız bunu yıllık bir gelenek haline getirmek, öğrenci
                yaratıcılığını kutlayan ve tüm kampüs topluluğunu bir araya
                getiren bir festival.
              </p>
            </div>
          </EmuconContentCard>
        </section>

        {/* Stats Section */}
        <section
          id="emucon-section-stats"
          className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-8 md:py-16 lg:py-20 px-5 max-w-[1200px] mx-auto select-none"
        >
          <EmuconStatsRow stats={stats} />
        </section>

        {/* What's Happening Section */}
        <section
          id="emucon-section-features"
          className="min-h-[40vh] md:min-h-screen flex flex-col justify-center py-2 md:py-16 lg:py-20 px-2 md:px-5 max-w-[1200px] mx-auto select-none"
        >
          <EmuconSectionHeader title="What's Happening?" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mt-2 md:mt-10">
            {features.map((feature, index) => (
              <EmuconFeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                descriptionTr={feature.descriptionTr}
              />
            ))}
          </div>
        </section>

        {/* For Visitors Section */}
        <section
          id="emucon-section-visitors"
          className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-8 md:py-16 lg:py-20 px-5 max-w-[1200px] mx-auto select-none"
        >
          <EmuconSectionHeader title="For Visitors" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-10">
            {/* English card */}
            <EmuconContentCard>
              <span className="inline-block px-3 py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-2 md:mb-4">
                English
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-2 md:mb-4">
                Just Show Up
              </h3>
              <p className="text-emucon-text-secondary mb-2 md:mb-4 text-sm md:text-base">
                No tickets. No registration. Just walk in whenever works for
                you. The event runs from 2:00 PM to 8:00 PM, so there&apos;s
                plenty to see and do.
              </p>
              <p className="text-emucon-text-secondary mb-2 md:mb-4 text-sm md:text-base">
                The event kicks off at 2:00 PM with stage performances and club
                activities. Mid-afternoon (3:00-5:00 PM) features more
                performances and activities. Late afternoon (5:00-8:00 PM) is
                when the energy peaks with the final performances and
                activities.
              </p>
              <p className="text-emucon-text-secondary text-sm md:text-base">
                <strong className="text-cream">What to bring:</strong> Some cash
                for food or merchandise. Your phone for photos. Comfortable
                shoes. That&apos;s it.
              </p>
            </EmuconContentCard>

            {/* Turkish card */}
            <EmuconContentCard>
              <span className="inline-block px-3 py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-2 md:mb-4">
                Türkçe
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-2 md:mb-4">
                Sadece Gel
              </h3>
              <p className="text-emucon-text-secondary mb-2 md:mb-4 text-sm md:text-base">
                Bilet yok. Kayıt yok. Sana uygun olan zaman gelmen yeterli.
                Etkinlik 14:00&apos;ten 20:00&apos;ye kadar devam ediyor.
              </p>
              <p className="text-emucon-text-secondary mb-2 md:mb-4 text-sm md:text-base">
                Etkinlik 14:00&apos;te sahne performansları ve kulüp
                aktiviteleri ile başlıyor. Öğleden sonra (15:00-17:00) daha
                fazla performans ve aktiviteler var. Akşama doğru (17:00-20:00)
                enerji zirve yapıyor ve final performansları gerçekleşiyor.
              </p>
              <p className="text-emucon-text-secondary text-sm md:text-base">
                <strong className="text-cream">Ne getirmeli:</strong> Yiyecek
                veya hediyelik eşya için biraz nakit. Fotoğraflar için
                telefonun. Rahat ayakkabılar. Bu kadar.
              </p>
            </EmuconContentCard>
          </div>
        </section>

        {/* Schedule Section */}
        <section
          id="emucon-section-schedule"
          className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-8 md:py-16 lg:py-20 px-5 max-w-[1200px] mx-auto select-none"
        >
          <EmuconSectionHeader title="Schedule Overview" />
          <EmuconSchedule
            externalShowDetailedSchedule={showDetailedSchedule}
            setExternalShowDetailedSchedule={setShowDetailedSchedule}
          />
        </section>

        {/* Contact Section */}
        <section
          id="emucon-section-contact"
          className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-8 md:py-16 lg:py-20 px-5 max-w-[1200px] mx-auto select-none"
        >
          <EmuconSectionHeader title="Contact / İletişim" />
          <EmuconContactGrid />
        </section>

        {/* Footer */}
        <section
          id="emucon-section-footer"
          className="min-h-[50vh] flex flex-col justify-end select-none"
        >
          <EmuconFooter
            logoVariant="lightgray"
            scrollContainer={containerRef}
          />
        </section>
      </div>

      {/* Custom scroll styling */}
      <style>{`
        /* Ensure sections don't overflow and cause issues */
        section {
          overflow: hidden;
        }
        
        /* Custom scrollbar styling */
        div[style*="overflow-y: auto"]::-webkit-scrollbar {
          width: 8px;
        }
        
        div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
          background: rgba(13, 31, 13, 0.3);
        }
        
        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
          background: rgba(74, 124, 74, 0.5);
          border-radius: 4px;
        }
        
        div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb:hover {
          background: rgba(74, 124, 74, 0.7);
        }
        
        @media (min-width: 768px) and (min-aspect-ratio: 3/2) {
          #emucon-section-hero > section,
          #emucon-section-hero {
            justify-content: flex-start !important;
            padding-top: clamp(3.5rem, 10vh, 7rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EmuconHome;
