import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { ClockIcon, CalendarIcon, ScrollIcon } from "./EmuconIcons";
import {
  X,
  Clock,
  MapPin,
  Infinity as InfinityIcon,
  Music,
  Sparkles,
  Heart,
  Users,
  Palette,
  Cpu,
  FlaskConical,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { config } from "../../config";

// Helpers to compute duration from start/end times
const parseTimeToMinutes = (t) => {
  if (!t) return null;
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (m) {
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const ampm = m[3].toUpperCase();
    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;
    return hh * 60 + mm;
  }
  const m2 = t.match(/(\d{1,2}):(\d{2})/);
  if (m2) return parseInt(m2[1], 10) * 60 + parseInt(m2[2], 10);
  return null;
};

const getDurationText = (item) => {
  if (item.duration) return item.duration;
  if (item.start && item.end) {
    const s = parseTimeToMinutes(item.start);
    const e = parseTimeToMinutes(item.end);
    if (s != null && e != null) {
      let diff = e - s;
      if (diff <= 0) diff += 24 * 60; // wrap midnight safety
      return `${diff} min`;
    }
  }
  return null;
};

// Fallback schedule items (used when API is unavailable)
const FALLBACK_SCHEDULE_ITEMS = [
  {
    start: "2:00 PM",
    end: "2:20 PM",
    event: "Opening / Doors Open",
    eventTr: "Acilis / Kapilar Acilir",
    type: "opening",
  },
  {
    start: "2:20 PM",
    end: "3:00 PM",
    event: "Mixed Club Activities",
    eventTr: "Karma Kulup Etkinligi",
    type: "activity",
  },
  {
    start: "3:00 PM",
    end: "3:15 PM",
    event: "Folk Dance Club",
    eventTr: "Halk Danslari Kulubu",
    duration: "15 min",
    type: "performance",
  },
  {
    start: "3:15 PM",
    end: "4:00 PM",
    event: "Mixed Club Activities",
    eventTr: "Karma Kulup Etkinligi",
    type: "activity",
  },
  {
    start: "4:00 PM",
    end: "4:15 PM",
    event: "International Performing Arts",
    eventTr: "Uluslararasi Sahne Sanatlari",
    duration: "15 min",
    type: "performance",
  },
  {
    start: "4:15 PM",
    end: "5:00 PM",
    event: "Mixed Club Activities",
    eventTr: "Karma Kulup Etkinligi",
    type: "activity",
  },
  {
    start: "5:00 PM",
    end: "5:30 PM",
    event: "Stand Time",
    eventTr: "Stand Suresi",
    type: "stand",
    duration: "30 min",
  },
  {
    start: "5:30 PM",
    end: "5:35 PM",
    event: "EMU Crows Dance Group Part 1",
    eventTr: "EMU Crows Dans Grubu Bolum 1",
    duration: "5 min",
    type: "performance",
  },
  {
    start: "5:35 PM",
    end: "6:20 PM",
    event: "Music Club Competition",
    eventTr: "Muzik Kulubu Yarismasi",
    duration: "45 min",
    type: "performance",
  },
  {
    start: "6:20 PM",
    end: "7:10 PM",
    event: "Mixed Club Activities",
    eventTr: "Karma Kulup Etkinligi",
    type: "activity",
  },
  {
    start: "7:10 PM",
    end: "7:15 PM",
    event: "EMU Crows Dance Group Part 2",
    eventTr: "EMU Crows Dans Grubu Bolum 2",
    duration: "5 min",
    type: "performance",
  },
  {
    start: "7:15 PM",
    end: "7:25 PM",
    event: "EMU Dance Community",
    eventTr: "DAU Dans Toplulugu",
    duration: "10 min",
    type: "performance",
  },
  {
    start: "7:25 PM",
    end: "8:10 PM",
    event: "Mixed Club Activities",
    eventTr: "Karma Kulup Etkinligi",
    type: "activity",
  },
  {
    start: "8:10 PM",
    end: "8:15 PM",
    event: "Event Close & Thanks",
    eventTr: "Etkinlik Kapanisi & Tesekkur",
    type: "closing",
  },
];

// Fallback detailed schedule (used when API is unavailable)
const FALLBACK_DETAILED_SCHEDULE = {
  entertainment: {
    scheduled: [],
    continuous: [],
    standTime: [],
  },
  diversity: {
    scheduled: [],
    continuous: [],
    standTime: [],
  },
  healthAndLifestyle: {
    scheduled: [],
    continuous: [],
    standTime: [],
  },
  folkAndSocial: {
    scheduled: [],
    continuous: [],
    standTime: [],
  },
  art: {
    scheduled: [],
    continuous: [],
    standTime: [],
  },
  technology: {
    scheduled: [],
    continuous: [],
    standTime: [],
  },
  science: {
    scheduled: [],
    continuous: [],
    standTime: [],
  },
};

// Detailed schedule by corner/time
const detailedSchedule = {
  entertainment: {
    scheduled: [
      {
        time: "14:20-15:00",
        club: "Havacılık Kulübü",
        activity:
          "Memes yarışması (popüler formatlarla üret, paylaş, oyla; en yaratıcı içerikler öne çıkar)",
        clubEn: "Aviation Club",
        activityEn:
          "Memes contest (create with popular formats, share, vote; top entries get highlighted)",
      },
      {
        time: "15:15-16:00",
        club: "Fantastik Kurgu Kulübü",
        activity:
          "Kutu oyunu yarışması (mini turnuva; hızlı eşleşmeler, kısa turlar ve skor akışı)",
        clubEn: "EMURPG Club",
        activityEn:
          "Board game contest (mini tournament; quick matchups, short rounds, simple scoring)",
      },
      {
        time: "16:15-17:00",
        club: "Game Design Community",
        activity:
          "Nintendo yarışması (mini oyun challenge; sırayla deneme turları ve puanlama)",
        clubEn: "Game Design Community",
        activityEn:
          "Nintendo contest (mini-game challenge; rotation rounds with quick scoring)",
      },
      {
        time: "18:15-19:00",
        club: "Satranç Kulübü",
        activity:
          "Satranç Jenga (denge + strateji; görev/hamle mantığıyla kuleyi devirmeden ilerle)",
        clubEn: "Chess Club",
        activityEn:
          "Chess Jenga (balance + strategy; solve the prompt and keep the tower standing)",
      },
      {
        time: "19:30-20:10",
        club: "Havacılık Kulübü",
        activity:
          "Fotoğraf köşesi (havacılık temalı alan; hızlı hatıra çekimi, prop/aksesuarlarla)",
        clubEn: "Aviation Club",
        activityEn:
          "Photo corner (aviation-themed spot; quick souvenir shots with props)",
      },
    ],
    continuous: [
      {
        club: "Oyun Tasarım Topluluğu",
        clubEn: "Game Design Community",
        activity:
          "Oyun demo alanı (sürekli; isteyen gir-çık yapar, hızlı deneme turları)",
        activityEn:
          "Game demo area (continuous; drop-in playtests with quick rounds)",
      },
      {
        club: "Havacılık Kulübü",
        clubEn: "Aviation Club",
        activity:
          "Dart atış alanı (sürekli; hızlı denemeler, küçük skor tablosu ile)",
        activityEn:
          "Dart throwing area (continuous; quick tries with a small scoreboard)",
      },
    ],
    standTime: [
      {
        club: "Fantastik Kurgu Kulübü",
        activity:
          "GEEK soru yarışması (stand zamanı; hızlı tur, kısa sorular, puan akışı)",
        clubEn: "EMURPG Club",
        activityEn:
          "GEEK quiz (booth time; fast rounds, short questions, simple scoring)",
      },
    ],
  },

  diversity: {
    scheduled: [
      {
        time: "14:20-15:00",
        club: "Queer Dayanışma Kulübü",
        activity:
          "Tişört baskı (tasarla & bas; kişiselleştir, hızlı kurutma/teslim akışı)",
        clubEn: "Queer Solidarity Club",
        activityEn:
          "T-shirt printing (design & print; personalize with a quick pickup flow)",
      },
      {
        time: "15:15-16:00",
        club: "Özel Eğitim Kulübü",
        activity:
          "Duyularla deneyim alanı (istasyon etkinliği; rehberli mini deneyler)",
        clubEn: "Special Education Club",
        activityEn:
          "Sensory experience area (station activity; guided mini experiences)",
      },
      {
        time: "16:15-17:00",
        club: "Çocuk Hakları Kulübü",
        activity:
          "Hak Kutusu (seç, oku, paylaş; kısa sohbetlerle günlük hayata bağla)",
        clubEn: "Children's Rights Club",
        activityEn:
          "Rights Box (pick, read, share; connect rights to daily life in short chats)",
      },
      {
        time: "18:15-19:00",
        club: "Queer Dayanışma Kulübü",
        activity:
          "Tişört baskı (tasarla & bas; önceki tasarımlardan ilham + yeni üretim)",
        clubEn: "Queer Solidarity Club",
        activityEn:
          "T-shirt printing (design & print; build on ideas and create new pieces)",
      },
      {
        time: "19:30-20:10",
        club: "Özel Eğitim Kulübü",
        activity:
          "Disleksi ile okuma (deneyim & farkındalık; kısa uygulamalarla empati)",
        clubEn: "Special Education Club",
        activityEn:
          "Reading with dyslexia (experience & awareness; quick exercises for empathy)",
      },
    ],
    continuous: [],
    standTime: [],
  },

  healthAndLifestyle: {
    scheduled: [
      {
        time: "14:20-15:00",
        club: "Beslenme ve Diyetetik Kulübü",
        activity:
          "Ağırlık tahmini yarışması (en yakın tahmin; hızlı turlar ve mini ödül)",
        clubEn: "Nutrition & Dietetics Club",
        activityEn:
          "Weight guessing contest (closest guess wins; quick rounds, small prize)",
      },
      {
        time: "15:15-16:00",
        club: "Bayrak Futbolu Kulübü",
        activity:
          "Bayrak çekme yarışması (flag pulling; kısa eşleşmelerle tempolu akış)",
        clubEn: "Flag Football Club",
        activityEn:
          "Flag pulling contest (fast matchups with a quick-flow format)",
      },
      {
        time: "16:15-17:00",
        club: "Fizyoterapi ve Rehabilitasyon Kulübü",
        activity:
          "Calisthenics yarışması (mini parkur; güvenli limitlerle eğlenceli challenge)",
        clubEn: "Physiotherapy and Rehabilitation Club",
        activityEn:
          "Calisthenics contest (mini course; fun challenge within safe limits)",
      },
      {
        time: "18:15-19:00",
        club: "Beslenme ve Diyetetik Kulübü",
        activity:
          "Parmak boyama (renkli mini atölye; ortak pano/tuval çalışması)",
        clubEn: "Nutrition & Dietetics Club",
        activityEn:
          "Finger painting (colorful mini workshop; shared canvas/panel piece)",
      },
      {
        time: "19:30-20:10",
        club: "Fizyoterapi ve Rehabilitasyon Kulübü",
        activity:
          "Denge testleri (ölçüm & skor; kısa değerlendirme ve eğlenceli denemeler)",
        clubEn: "Physiotherapy and Rehabilitation Club",
        activityEn:
          "Balance tests (measure & score; quick assessment with fun attempts)",
      },
    ],
    continuous: [
      {
        club: "Fizyoterapi ve Rehabilitasyon Kulübü",
        activity: "Vücut ölçümleri (sürekli; hızlı ölçüm + kısa bilgilendirme)",
        clubEn: "Physiotherapy and Rehabilitation Club",
        activityEn:
          "Body measurements (continuous; quick checks + brief feedback)",
      },
      {
        club: "Yoga Kulübü",
        activity:
          "Yoga eğitimi ve danışmanlık (sürekli; nefes/temel duruş önerileri)",
        clubEn: "Yoga Club",
        activityEn:
          "Yoga education and guidance (continuous; breathing + basic pose tips)",
      },
    ],
    standTime: [],
  },

  folkAndSocial: {
    scheduled: [
      {
        time: "14:20-15:00",
        club: "Uluslararası İlişkiler Kulübü",
        activity:
          "Minigame istasyonu (kısa oyunlar; hızlı kurallar, kolay katılım)",
        clubEn: "International Relations Club",
        activityEn:
          "Minigame station (quick games; easy rules and fast participation)",
      },
      {
        time: "15:15-16:00",
        club: "Psikolojik Danışmanlık ve Rehberlik Kulübü",
        activity:
          "Red/Green Flag (kart oyunu / seçimler; senaryo seç, tartış, paylaş)",
        clubEn: "Psychological Counseling and Guidance Club",
        activityEn:
          "Red/Green Flag (card game / choices; pick scenarios, discuss, share)",
      },
      {
        time: "16:15-17:00",
        club: "Fikir ve Münazara Kulübü",
        activity:
          "Quiz (hızlı sorular & puan; mini turlar, takım/solo formatı)",
        clubEn: "Debate and Discussion Club",
        activityEn:
          "Quiz (quick questions & scoring; mini rounds, team or solo format)",
      },
      {
        time: "18:15-19:00",
        club: "Psikolojik Danışmanlık ve Rehberlik Kulübü",
        activity:
          "Zaman kapsülü (not bırakma etkinliği; hedef/dilek yaz, geleceğe mesaj bırak)",
        clubEn: "Psychological Counseling and Guidance Club",
        activityEn:
          "Time capsule (leave a note activity; write a goal/wish and leave a future message)",
      },
    ],
    continuous: [
      {
        club: "Psikolojik Danışmanlık ve Rehberlik Kulübü",
        activity:
          "Motivasyon duvarı (sürekli; kısa mesaj bırak, başkalarının notlarını oku)",
        clubEn: "Psychological Counseling and Guidance Club",
        activityEn:
          "Motivation wall (continuous; leave a note and read others’ messages)",
      },
      {
        club: "Psikoloji Öğrencileri Kulübü",
        activity:
          "His ağacı (duygu etiketi bırak; günün hissini seç ve ağaca ekle)",
        clubEn: "Psychology Students Club",
        activityEn:
          "Emotion tree (leave an emotion tag; choose today’s feeling and add it)",
      },
      {
        club: "Psikolojik Danışmanlık ve Rehberlik Kulübü",
        activity: "Askıda çiçek (mesaj bırakma; minik notlarla pozitif zincir)",
        clubEn: "Psychological Counseling and Guidance Club",
        activityEn:
          "Suspended flower (leave a message; small notes that build a positive chain)",
      },
    ],
    standTime: [],
  },

  art: {
    scheduled: [
      {
        time: "14:20-15:00",
        club: "Edebiyat Kulübü",
        activity:
          "Edebiyat quiz (mini bilgi yarışması; kısa sorularla hızlı turlar)",
        clubEn: "Literature Club",
        activityEn:
          "Literature quiz (mini trivia; fast rounds with short questions)",
      },
      {
        time: "15:15-16:00",
        club: "Fotoğrafçılık Kulübü",
        activity:
          "Fotoğraf çekimi (anı kareleri; hızlı poz alanı + kısa yönlendirme)",
        clubEn: "Photography Club",
        activityEn:
          "Photo shooting (memory moments; quick pose spot + light guidance)",
      },
      {
        time: "16:15-17:00",
        club: "Uluslararası Dans Kulübü",
        activity:
          "Karaoke (sahne & katılım; sırayla performans, seyirci desteği)",
        clubEn: "International Dance Club",
        activityEn:
          "Karaoke (stage & participation; rotation performances, audience support)",
      },
      {
        time: "18:15-19:00",
        club: "Sinema Kulübü",
        activity:
          "Sürpriz etkinlik (sinema temalı; kısa oyun/mini aktivite formatı)",
        clubEn: "Cinema Club",
        activityEn:
          "Surprise activity (cinema-themed; quick game/mini activity format)",
      },
    ],
    continuous: [
      {
        club: "Edebiyat Kulübü",
        activity:
          '"Bir Cümle Bırak" Ağacı (sürekli; alıntı/mesaj yaz, ağaca as, oku)',
        clubEn: "Literature Club",
        activityEn:
          '"Leave a Sentence" Tree (continuous; write & hang a message/quote, then read others)',
      },
      {
        club: "Edebiyat Kulübü",
        activity:
          "Kolektif hikaye (sürekli; sırayla satır ekle, ortak hikayeyi büyüt)",
        clubEn: "Literature Club",
        activityEn:
          "Collective story (continuous; add a line and grow a shared story)",
      },
    ],
    standTime: [],
  },

  technology: {
    scheduled: [
      {
        time: "14:20-15:00",
        club: "Endüstri Mühendisliği Kulübü",
        activity:
          "Endüstri quiz (hızlı mühendislik soruları; mini turlar & puanlama)",
        clubEn: "Industrial Engineering Club",
        activityEn:
          "Industrial quiz (quick engineering questions; mini rounds & scoring)",
      },
      {
        time: "15:15-16:00",
        club: "IEEE Öğrenci Topluluğu",
        activity: "Robot gösterisi (multi demo; kısa anlatım + mini etkileşim)",
        clubEn: "IEEE Student Branch",
        activityEn:
          "Robot demonstration (multi demo; short intro + light interaction)",
      },
      {
        time: "16:15-17:00",
        club: "Yazılım ve Yapay Zeka Geliştirme Kulübü",
        activity:
          "Anı fotoğrafı (hatıra çekimi alanı; hızlı çekim + eğlenceli çıktı)",
        clubEn: "Software and AI Development Club",
        activityEn:
          "Memory photo (souvenir shooting area; quick shot + fun output)",
      },
      {
        time: "18:15-19:00",
        club: "American Society of Mechanical Engineers (ASME)",
        activity:
          "ASME quiz (mekanik mini test; kısa sorular, mini skor tablosu)",
        clubEn: "American Society of Mechanical Engineers (ASME)",
        activityEn:
          "ASME quiz (mechanical mini test; quick questions with a small scoreboard)",
      },
    ],
    continuous: [
      {
        club: "American Society of Mechanical Engineers (ASME)",
        activity:
          "Proje gösterisi (sürekli; prototip/afişler, süreç anlatımı, mini soru-cevap)",
        clubEn: "American Society of Mechanical Engineers (ASME)",
        activityEn:
          "Project showcase (continuous; prototypes/posters, process explanations, mini Q&A)",
      },
      {
        club: "Matematik Kulübü",
        activity:
          "İntegral sorusu (mini meydan okuma; seviye seç, çöz, hızlı kontrol)",
        clubEn: "Mathematics Club",
        activityEn:
          "Integral question (mini challenge; choose a level, solve, quick check)",
      },
    ],
    standTime: [],
  },

  science: {
    scheduled: [
      {
        time: "14:20-15:00",
        club: "Çevre ve Doğa Bilimleri Kulübü",
        activity:
          "Analiz deneyi (çevre mini etkinliği; gözlem + kısa bilgilendirme)",
        clubEn: "Environment and Natural Sciences Club",
        activityEn:
          "Analysis experiment (environment mini activity; observe + quick info)",
      },
      {
        time: "18:15-19:00",
        club: "Çevre ve Doğa Bilimleri Kulübü",
        activity:
          "Doğal filtrasyon (mini deney; filtreleme adımlarını gör ve öğren)",
        clubEn: "Environment and Natural Sciences Club",
        activityEn:
          "Natural filtration (mini experiment; see and learn the filtration steps)",
      },
      {
        time: "19:30-20:10",
        club: "Çevre ve Doğa Bilimleri Kulübü",
        activity:
          "Quiz (çevre & doğa bilgi yarışı; hızlı sorular ve küçük ödül akışı)",
        clubEn: "Environment and Natural Sciences Club",
        activityEn:
          "Quiz (environment & nature trivia; fast questions with a small prize flow)",
      },
    ],
    continuous: [],
    standTime: [],
  },
};

// Translations
const translations = {
  tr: {
    title: "Detaylı Etkinlik Programı",
    subtitle: "Detailed Activity Schedule",
    categories: {
      scheduled: "Süreli",
      scheduledDesc: "Belirli saatlerde",
      stand: "Stant Zamanı",
      standDesc: "Stant süresinde",
      continuous: "Sürekli",
      continuousDesc: "Etkinlik boyunca",
    },
    footer: "20 Aralık | 14:00-20:00 | Lala Mustafa Paşa Spor Sarayı",
  },
  en: {
    title: "Detailed Activity Schedule",
    subtitle: "Detaylı Etkinlik Programı",
    categories: {
      scheduled: "Scheduled",
      scheduledDesc: "Specific times",
      stand: "Stand Time",
      standDesc: "During stand periods",
      continuous: "Continuous",
      continuousDesc: "Throughout event",
    },
    footer: "December 20 | 14:00-20:00 | Lala Mustafa Paşa Sports Hall",
  },
};

// Category Badge Component
const CategoryBadge = ({ type, lang = "tr" }) => {
  const t = translations[lang].categories;
  const configs = {
    scheduled: {
      bg: "bg-amber-500/20",
      border: "border-amber-500/40",
      text: "text-amber-400",
      icon: Clock,
      label: t.scheduled,
    },
    stand: {
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      icon: MapPin,
      label: t.stand,
    },
    continuous: {
      bg: "bg-stone-400/20",
      border: "border-stone-400/40",
      text: "text-stone-300",
      icon: InfinityIcon,
      label: t.continuous,
    },
  };
  const config = configs[type];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded ${config.bg} ${config.border} ${config.text} border`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
};

CategoryBadge.propTypes = {
  type: PropTypes.oneOf(["scheduled", "stand", "continuous"]),
  lang: PropTypes.oneOf(["tr", "en"]),
};

// Language Switcher Component
const LanguageSwitcher = ({ lang, setLang }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
      <button
        onClick={() => setLang("tr")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          lang === "tr"
            ? "bg-amber-500/30 text-amber-400 border border-amber-500/40"
            : "text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent"
        }`}
      >
        TR
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          lang === "en"
            ? "bg-amber-500/30 text-amber-400 border border-amber-500/40"
            : "text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent"
        }`}
      >
        EN
      </button>
    </div>
  );
};

LanguageSwitcher.propTypes = {
  lang: PropTypes.oneOf(["tr", "en"]).isRequired,
  setLang: PropTypes.func.isRequired,
};

// Schedule Card Component
const ScheduleCard = ({
  title,
  titleEn,
  data,
  icon: Icon,
  accentColor = "amber",
  lang = "tr",
  expandedEvent,
  setExpandedEvent,
}) => {
  const colorMap = {
    amber: {
      header: "from-amber-600/30 to-amber-900/20",
      border: "border-amber-500/30",
      accent: "text-amber-400",
    },
    emerald: {
      header: "from-emerald-600/30 to-emerald-900/20",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
    },
    rose: {
      header: "from-rose-600/30 to-rose-900/20",
      border: "border-rose-500/30",
      accent: "text-rose-400",
    },
    violet: {
      header: "from-violet-600/30 to-violet-900/20",
      border: "border-violet-500/30",
      accent: "text-violet-400",
    },
    cyan: {
      header: "from-cyan-600/30 to-cyan-900/20",
      border: "border-cyan-500/30",
      accent: "text-cyan-400",
    },
    orange: {
      header: "from-orange-600/30 to-orange-900/20",
      border: "border-orange-500/30",
      accent: "text-orange-400",
    },
  };
  const colors = colorMap[accentColor];
  const displayTitle = lang === "tr" ? title : titleEn;
  const displaySubtitle = lang === "tr" ? titleEn : title;

  const handleEventClick = (eventData, type) => {
    const eventId = `${type}-${eventData.club}-${eventData.activity}`;
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
    }
  };

  return (
    <div
      className={`rounded-lg overflow-hidden border ${colors.border} bg-black/20`}
    >
      <div
        className={`bg-gradient-to-r ${colors.header} px-3 py-2 flex items-center gap-2`}
      >
        <Icon size={16} className={colors.accent} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${colors.accent} truncate`}>
            {displayTitle}
          </h4>
          <p className="text-[10px] text-stone-400 italic truncate">
            {displaySubtitle}
          </p>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {data.scheduled &&
          data.scheduled.map((item, idx) => {
            const eventId = `scheduled-${item.club}-${item.activity}`;
            const isExpanded = expandedEvent === eventId;

            return (
              <div key={idx}>
                <div
                  onClick={() => handleEventClick(item, "scheduled")}
                  className="flex items-start justify-between gap-3 py-2 px-3 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-200 truncate">
                      {lang === "tr" ? item.club : item.clubEn}
                    </p>
                    <p className="text-xs text-stone-400 truncate">
                      {lang === "tr" ? item.activity : item.activityEn}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[10px] text-stone-400 font-mono">
                      {item.time}
                    </span>
                    <div className="flex items-center gap-1">
                      <CategoryBadge type="scheduled" lang={lang} />
                      {isExpanded ? (
                        <ChevronUp size={12} className="text-stone-400" />
                      ) : (
                        <ChevronDown size={12} className="text-stone-400" />
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-2 p-3 rounded bg-white/10 border border-white/20">
                    <h5 className="text-sm font-medium text-stone-200 mb-2">
                      {lang === "tr" ? item.club : item.clubEn}
                    </h5>
                    <p className="text-xs text-stone-400 mb-2">
                      {lang === "tr" ? item.activity : item.activityEn}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-stone-500">
                      <Clock size={10} />
                      <span>{item.time}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        {data.standTime && data.standTime.length > 0 && (
          <>
            <div className="text-[10px] font-semibold text-stone-400 px-3 py-1.5 mt-2 uppercase">
              {lang === "tr" ? "Stand Zamanı" : "Stand Time"}
            </div>
            {data.standTime.map((item, idx) => {
              const eventId = `standTime-${item.club}-${item.activity}`;
              const isExpanded = expandedEvent === eventId;

              return (
                <div key={idx}>
                  <div
                    onClick={() => handleEventClick(item, "standTime")}
                    className="flex items-start justify-between gap-3 py-2 px-3 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-stone-200 truncate">
                        {lang === "tr" ? item.club : item.clubEn}
                      </p>
                      <p className="text-xs text-stone-400 truncate">
                        {lang === "tr" ? item.activity : item.activityEn}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <CategoryBadge type="stand" lang={lang} />
                      {isExpanded ? (
                        <ChevronUp size={12} className="text-stone-400" />
                      ) : (
                        <ChevronDown size={12} className="text-stone-400" />
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 p-3 rounded bg-white/10 border border-white/20">
                      <h5 className="text-sm font-medium text-stone-200 mb-2">
                        {lang === "tr" ? item.club : item.clubEn}
                      </h5>
                      <p className="text-xs text-stone-400">
                        {lang === "tr" ? item.activity : item.activityEn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
        {data.continuous && data.continuous.length > 0 && (
          <>
            <div className="text-[10px] font-semibold text-stone-400 px-3 py-1.5 mt-2 uppercase">
              {lang === "tr" ? "Sürekli" : "Continuous"}
            </div>
            {data.continuous.map((item, idx) => {
              const eventId = `continuous-${item.club}-${
                item.activity || "no-activity"
              }`;
              const isExpanded = expandedEvent === eventId;

              return (
                <div key={idx}>
                  <div
                    onClick={() => handleEventClick(item, "continuous")}
                    className="flex items-start justify-between gap-3 py-2 px-3 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-stone-200 truncate">
                        {lang === "tr" ? item.club : item.clubEn}
                      </p>
                      {item.activity && (
                        <p className="text-xs text-stone-400 truncate">
                          {lang === "tr" ? item.activity : item.activityEn}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <CategoryBadge type="continuous" lang={lang} />
                      {isExpanded ? (
                        <ChevronUp size={12} className="text-stone-400" />
                      ) : (
                        <ChevronDown size={12} className="text-stone-400" />
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 p-3 rounded bg-white/10 border border-white/20">
                      <h5 className="text-sm font-medium text-stone-200 mb-2">
                        {lang === "tr" ? item.club : item.clubEn}
                      </h5>
                      <p className="text-xs text-stone-400">
                        {item.activity
                          ? lang === "tr"
                            ? item.activity
                            : item.activityEn
                          : lang === "tr"
                          ? "Sürekli etkinlik"
                          : "Continuous event"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

ScheduleCard.propTypes = {
  title: PropTypes.string.isRequired,
  titleEn: PropTypes.string,
  data: PropTypes.object.isRequired,
  icon: PropTypes.elementType.isRequired,
  accentColor: PropTypes.string,
  lang: PropTypes.oneOf(["tr", "en"]),
  expandedEvent: PropTypes.string,
  setExpandedEvent: PropTypes.func,
};

// Detailed Schedule Modal Component
const DetailedScheduleModal = ({
  showDetailedSchedule,
  setShowDetailedSchedule,
  detailedSchedule,
  onRefresh,
  isRefreshing,
}) => {
  const [lang, setLang] = useState("tr");
  const [expandedEvent, setExpandedEvent] = useState(null);
  const t = translations[lang];

  if (!showDetailedSchedule) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
      onClick={() => setShowDetailedSchedule(false)}
    >
      <div
        className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-xl flex flex-col"
        style={{
          background:
            "linear-gradient(160deg, rgba(20, 35, 20, 0.98), rgba(10, 22, 10, 0.99))",
          border: "1px solid rgba(180, 140, 40, 0.35)",
          boxShadow:
            "0 0 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0 px-4 md:px-6 pt-4 pb-3 border-b border-amber-500/20 overflow-visible">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-amber-700/20 border border-amber-500/40 flex items-center justify-center">
                <Calendar size={20} className="text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-amber-400 tracking-wide">
                  {t.title}
                </h2>
                <p className="text-xs text-stone-400 italic">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher lang={lang} setLang={setLang} />
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10 z-20 overflow-visible disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh"
                title={lang === "tr" ? "Yenile" : "Refresh"}
              >
                <RefreshCw
                  size={16}
                  strokeWidth={2.5}
                  className={`text-amber-400 hover:text-amber-300 pointer-events-none flex-shrink-0 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
              <button
                onClick={() => setShowDetailedSchedule(false)}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10 z-20 overflow-visible"
                aria-label="Close"
              >
                <X
                  size={18}
                  strokeWidth={2.5}
                  className="text-white/90 hover:text-white pointer-events-none flex-shrink-0"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {/* Legend - Compact */}
          <div className="mb-5 p-3 md:p-4 rounded-lg bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-stone-500/10 border border-white/10">
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <div className="flex items-center gap-1.5 md:gap-2.5">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-gradient-to-br from-amber-500/40 to-amber-600/20 border border-amber-500/50 flex items-center justify-center">
                  <Clock size={12} className="md:w-4 md:h-4 text-amber-400" />
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-amber-400">
                    {t.categories.scheduled}
                  </span>
                  <span className="text-xs text-stone-500 ml-2">
                    {t.categories.scheduledDesc}
                  </span>
                </div>
                <div className="md:hidden">
                  <span className="text-xs font-medium text-amber-400">
                    {t.categories.scheduled}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2.5">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-gradient-to-br from-emerald-500/40 to-emerald-600/20 border border-emerald-500/50 flex items-center justify-center">
                  <MapPin
                    size={12}
                    className="md:w-4 md:h-4 text-emerald-400"
                  />
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-emerald-400">
                    {t.categories.stand}
                  </span>
                  <span className="text-xs text-stone-500 ml-2">
                    {t.categories.standDesc}
                  </span>
                </div>
                <div className="md:hidden">
                  <span className="text-xs font-medium text-emerald-400">
                    {t.categories.stand}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2.5">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-gradient-to-br from-stone-400/40 to-stone-500/20 border border-stone-400/50 flex items-center justify-center">
                  <InfinityIcon
                    size={12}
                    className="md:w-4 md:h-4 text-stone-300"
                  />
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-stone-300">
                    {t.categories.continuous}
                  </span>
                  <span className="text-xs text-stone-500 ml-2">
                    {t.categories.continuousDesc}
                  </span>
                </div>
                <div className="md:hidden">
                  <span className="text-xs font-medium text-stone-300">
                    {t.categories.continuous}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ScheduleCard
              title="Eğlence Köşesi"
              titleEn="Entertainment Corner"
              data={detailedSchedule.entertainment}
              icon={Music}
              accentColor="amber"
              lang={lang}
              expandedEvent={expandedEvent}
              setExpandedEvent={setExpandedEvent}
            />
            <ScheduleCard
              title="Farkındalık Köşesi"
              titleEn="Diversity Corner"
              data={detailedSchedule.diversity}
              icon={Sparkles}
              accentColor="violet"
              lang={lang}
              expandedEvent={expandedEvent}
              setExpandedEvent={setExpandedEvent}
            />
            <ScheduleCard
              title="Sağlık ve Yaşam Köşesi & Spor Köşesi"
              titleEn="Health & Lifestyle Corner + Sports Corner"
              data={detailedSchedule.healthAndLifestyle}
              icon={Heart}
              accentColor="rose"
              lang={lang}
              expandedEvent={expandedEvent}
              setExpandedEvent={setExpandedEvent}
            />
            <ScheduleCard
              title="Halk ve Sosyal Köşesi"
              titleEn="Folk & Social Corner"
              data={detailedSchedule.folkAndSocial}
              icon={Users}
              accentColor="orange"
              lang={lang}
              expandedEvent={expandedEvent}
              setExpandedEvent={setExpandedEvent}
            />
            <ScheduleCard
              title="Sanat Köşesi"
              titleEn="Art Corner"
              data={detailedSchedule.art}
              icon={Palette}
              accentColor="cyan"
              lang={lang}
              expandedEvent={expandedEvent}
              setExpandedEvent={setExpandedEvent}
            />

            {/* Technology + Science Combined */}
            <div className="rounded-lg p-3 bg-gradient-to-br from-amber-500/10 to-emerald-500/5 border border-amber-500/25">
              <div className="space-y-3">
                <ScheduleCard
                  title="Teknoloji Köşesi"
                  titleEn="Technology Corner"
                  data={detailedSchedule.technology}
                  icon={Cpu}
                  accentColor="emerald"
                  lang={lang}
                  expandedEvent={expandedEvent}
                  setExpandedEvent={setExpandedEvent}
                />
                <div className="flex items-center gap-2 px-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-amber-500/50" />
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                </div>
                <ScheduleCard
                  title="Bilim Köşesi"
                  titleEn="Science Corner"
                  data={detailedSchedule.science}
                  icon={FlaskConical}
                  accentColor="emerald"
                  lang={lang}
                  expandedEvent={expandedEvent}
                  setExpandedEvent={setExpandedEvent}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 px-4 md:px-6 py-3 border-t border-amber-500/20 bg-black/30">
          <p className="text-center text-xs text-stone-500">
            EMUCON 2025 | {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
};

DetailedScheduleModal.propTypes = {
  showDetailedSchedule: PropTypes.bool.isRequired,
  setShowDetailedSchedule: PropTypes.func.isRequired,
  detailedSchedule: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isRefreshing: PropTypes.bool,
};

const EmuconSchedule = () => {
  const [showDetailedSchedule, setShowDetailedSchedule] = useState(false);
  const [scheduleItems, setScheduleItems] = useState(FALLBACK_SCHEDULE_ITEMS);
  const [dynamicDetailedSchedule, setDynamicDetailedSchedule] =
    useState(detailedSchedule);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backendUrl = config.backendUrl;

  // Fetch main schedule items from API
  const fetchMainSchedule = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/emucon/schedule/main`);
      if (response.ok) {
        const data = await response.json();
        if (data.scheduleItems && data.scheduleItems.length > 0) {
          setScheduleItems(data.scheduleItems);
        }
      }
    } catch (error) {
      console.error("Failed to fetch main schedule, using fallback:", error);
    }
  }, [backendUrl]);

  // Fetch detailed schedule from API
  const fetchDetailedSchedule = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/emucon/schedule`);
      if (response.ok) {
        const data = await response.json();
        if (data.schedule) {
          // Transform API response to match component structure
          const transformedSchedule = {};

          // Map corner types to component keys
          const cornerMapping = {
            entertainment: "entertainment",
            awareness: "diversity", // diversity in UI
            healthAndLifestyle: "healthAndLifestyle",
            folkAndSocial: "folkAndSocial",
            art: "art",
            technology: "technology",
            science: "science",
          };

          // Initialize with fallback structure
          Object.keys(cornerMapping).forEach((key) => {
            transformedSchedule[cornerMapping[key]] = {
              scheduled: [],
              continuous: [],
              standTime: [],
            };
          });

          // Process API data - data.schedule is an object, not an array
          for (const [cornerKey, cornerData] of Object.entries(data.schedule)) {
            const mappedKey = cornerMapping[cornerKey] || cornerKey;

            if (transformedSchedule[mappedKey]) {
              // The API already provides scheduled, continuous, standTime arrays
              if (cornerData.scheduled) {
                transformedSchedule[mappedKey].scheduled =
                  cornerData.scheduled.map((event) => ({
                    time:
                      event.time || `${event.startTime}-${event.endTime}` || "",
                    club: event.clubNameTr || "",
                    clubEn: event.clubNameEn || "",
                    activity: event.nameTr || "",
                    activityEn: event.nameEn || "",
                  }));
              }

              if (cornerData.continuous) {
                transformedSchedule[mappedKey].continuous =
                  cornerData.continuous.map((event) => ({
                    club: event.clubNameTr || "",
                    clubEn: event.clubNameEn || "",
                    activity: event.nameTr || "",
                    activityEn: event.nameEn || "",
                  }));
              }

              if (cornerData.standTime) {
                transformedSchedule[mappedKey].standTime =
                  cornerData.standTime.map((event) => ({
                    club: event.clubNameTr || "",
                    clubEn: event.clubNameEn || "",
                    activity: event.nameTr || "",
                    activityEn: event.nameEn || "",
                  }));
              }
            }
          }

          // Only update if we have meaningful data
          const hasData = Object.values(transformedSchedule).some(
            (corner) =>
              corner.scheduled.length > 0 ||
              corner.continuous.length > 0 ||
              corner.standTime.length > 0
          );

          if (hasData) {
            setDynamicDetailedSchedule(transformedSchedule);
          }
        }
      }
    } catch (error) {
      console.error(
        "Failed to fetch detailed schedule, using fallback:",
        error
      );
    }
  }, [backendUrl]);

  // Handle refresh button click
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchMainSchedule(), fetchDetailedSchedule()]);
    setIsRefreshing(false);
  }, [fetchMainSchedule, fetchDetailedSchedule]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMainSchedule(), fetchDetailedSchedule()]);
      setIsLoading(false);
    };
    fetchData();
  }, [fetchMainSchedule, fetchDetailedSchedule]);

  // Hide navbar and prevent scroll when modal is open
  useEffect(() => {
    if (showDetailedSchedule) {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [showDetailedSchedule]);

  return (
    <>
      <div
        className="relative rounded-xl p-4 md:p-6 lg:p-10 text-center border border-forest-medium/70 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(26, 46, 26, 0.75), rgba(13, 31, 13, 0.9))",
        }}
      >
        {/* Top edge highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(107,155,107,0.3), transparent)",
          }}
        />

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-forest-light/30 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-14 h-14 border-t-2 border-r-2 border-forest-light/30 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-14 h-14 border-b-2 border-l-2 border-forest-light/30 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-forest-light/30 rounded-br-xl" />

        {/* Inner decorative border */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border border-forest-light/10 rounded-lg pointer-events-none" />

        {/* Event stats banner */}
        <div className="relative mb-6">
          <div
            className="inline-flex items-center gap-4 px-6 py-3 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(201, 162, 39, 0.2), rgba(45, 74, 45, 0.5))",
              border: "1px solid rgba(201, 162, 39, 0.4)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold-light">
                42+
              </div>
              <div className="text-xs text-cream/80">Clubs / Kulüp</div>
            </div>
            <div className="w-px h-10 bg-forest-light/30"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold-light">
                40+
              </div>
              <div className="text-xs text-cream/80">Events / Etkinlik</div>
            </div>
          </div>
        </div>

        {/* Header with calendar icon */}
        <div className="relative mb-4 md:mb-6 lg:mb-8">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(45, 74, 45, 0.4), rgba(26, 46, 26, 0.5))",
              border: "1px solid rgba(74, 124, 74, 0.3)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <div
              className="p-2 rounded-md"
              style={{
                background: "rgba(201, 162, 39, 0.15)",
                border: "1px solid rgba(201, 162, 39, 0.25)",
              }}
            >
              <CalendarIcon size={20} className="text-gold-light" />
            </div>
            <div className="text-center">
              <h3 className="font-cinzel text-xl md:text-2xl text-cream">
                December 20, 2025
              </h3>
              <p className="text-gold-light text-sm mt-1">14:00 - 20:00</p>
            </div>
          </div>
        </div>

        {/* Schedule timeline */}
        <div className="relative py-4">
          {/* Connecting line - desktop */}
          <div
            className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 transform -translate-y-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(74,124,74,0.4) 20%, rgba(74,124,74,0.4) 80%, transparent)",
            }}
          />

          {/* Schedule items */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-5 ">
            {scheduleItems.map((item, index) => (
              <div
                key={index}
                className={`group relative flex flex-col items-center w-full md:w-auto px-4 md:px-5 lg:px-6 py-3 md:py-4 lg:py-5 rounded-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:min-w-[120px] lg:min-w-[140px] ${
                  item.type === "performance" ? "ring-2 ring-gold-light/30" : ""
                }`}
                style={{
                  background:
                    item.type === "performance"
                      ? "linear-gradient(145deg, rgba(201, 162, 39, 0.15), rgba(45, 74, 45, 0.6))"
                      : "linear-gradient(145deg, rgba(45, 74, 45, 0.6), rgba(26, 46, 26, 0.8))",
                  border:
                    item.type === "performance"
                      ? "1px solid rgba(201, 162, 39, 0.4)"
                      : "1px solid rgba(74, 124, 74, 0.35)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                {/* Performance badge */}
                {item.type === "performance" && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gold-light text-forest-dark text-[10px] font-bold rounded uppercase">
                    Stage
                  </div>
                )}

                {/* Inner highlight */}
                <div className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Time badge */}
                <div
                  className="flex items-center gap-2 mb-2 md:mb-3 px-2 md:px-3 py-1 md:py-1.5 rounded-md"
                  style={{
                    background:
                      item.type === "performance"
                        ? "rgba(201, 162, 39, 0.20)"
                        : "rgba(201, 162, 39, 0.12)",
                    border:
                      item.type === "performance"
                        ? "1px solid rgba(201, 162, 39, 0.35)"
                        : "1px solid rgba(201, 162, 39, 0.2)",
                  }}
                >
                  <ClockIcon
                    size={14}
                    className="text-gold-light/80 group-hover:text-gold-light transition-colors"
                  />
                  <span className="text-gold-light font-semibold text-sm md:text-base">
                    {item.start && item.end
                      ? `${item.start} - ${item.end}`
                      : item.time}
                  </span>
                </div>

                {/* Event name */}
                <span
                  className={`text-center leading-tight font-medium ${
                    item.type === "performance"
                      ? "text-gold-light text-sm md:text-base"
                      : "text-cream text-sm md:text-base"
                  }`}
                >
                  {item.event}
                </span>
                <span className="text-emucon-text-muted text-xs mt-1">
                  {item.eventTr}
                </span>

                {/* Duration / Total time */}
                {(() => {
                  const displayDuration = getDurationText(item);
                  return (
                    displayDuration && (
                      <span className="text-[10px] text-gold-light/70 mt-1 font-medium">
                        {displayDuration}
                      </span>
                    )
                  );
                })()}

                {/* Dot connector */}
                <div className="hidden lg:block absolute -bottom-2.5 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                      item.type === "performance"
                        ? "bg-gold-light/60 group-hover:bg-gold-light border-gold"
                        : "bg-forest-light/40 group-hover:bg-gold/50 border-forest-medium"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer section */}
        <div
          className="mt-6 md:mt-8 lg:mt-10 pt-4 md:pt-5 lg:pt-6 mx-4 md:mx-8 rounded-lg"
          style={{
            borderTop: "1px solid rgba(74, 124, 74, 0.25)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
            <div
              className="p-1.5 rounded"
              style={{ background: "rgba(74, 124, 74, 0.2)" }}
            >
              <ScrollIcon size={14} className="text-forest-light/60" />
            </div>
            <span className="text-forest-light/60 text-xs uppercase tracking-wider font-medium">
              Schedule Notice
            </span>
          </div>
          <p className="text-emucon-text-secondary text-sm md:text-base leading-relaxed">
            This plan can be changed. Detailed schedule will be announced closer
            to the event.
          </p>
          <p className="text-emucon-text-muted text-xs md:text-sm mt-2 italic">
            Detaylı program etkinliğe yakın duyurulacaktır. Program değişebilir.
          </p>

          {/* Detailed schedule button */}
          <button
            onClick={() => setShowDetailedSchedule(true)}
            className="mt-4 px-6 py-3 rounded-lg font-semibold text-forest-dark transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, rgb(201, 162, 39), rgb(180, 140, 30))",
              boxShadow: "0 4px 12px rgba(201, 162, 39, 0.3)",
            }}
          >
            View Detailed Schedule / Detaylı Program
          </button>
        </div>
      </div>

      {/* Detailed Schedule Modal */}
      <DetailedScheduleModal
        showDetailedSchedule={showDetailedSchedule}
        setShowDetailedSchedule={setShowDetailedSchedule}
        detailedSchedule={dynamicDetailedSchedule}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </>
  );
};

export default EmuconSchedule;
