import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaScroll, FaGlobe, FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";

// Elegant geometric pattern
const PATTERN_BG = `data:image/svg+xml,${encodeURIComponent(`
  <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="#0f0f0f"/>
        <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#1a1a1a" stroke-width="1"/>
        <circle cx="40" cy="40" r="2" fill="#262626"/>
        <circle cx="0" cy="0" r="1" fill="#1f1f1f"/>
        <circle cx="80" cy="0" r="1" fill="#1f1f1f"/>
        <circle cx="0" cy="80" r="1" fill="#1f1f1f"/>
        <circle cx="80" cy="80" r="1" fill="#1f1f1f"/>
      </pattern>
    </defs>
    <rect width="80" height="80" fill="url(#grid)"/>
  </svg>
`)}`;

const EmuconRulesPage = () => {
  const [language, setLanguage] = useState("tr");

  useEffect(() => {
    document.title = "EMURPG - EMUCON Rules";
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "tr" ? "en" : "tr"));
  };

  return (
    <div
      className="min-h-screen text-gray-100 select-none"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: `url("${PATTERN_BG}")`,
      }}
    >
      {/* Header with Language Switcher */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-md border-b border-amber-500/20">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Back Button */}
            <motion.a
              href="/emucon"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 sm:gap-2 text-amber-400 hover:text-amber-300 transition-colors group shrink-0"
            >
              <FaArrowLeft className="text-sm sm:text-base group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium hidden sm:inline text-sm">
                {language === "tr" ? "Ana Sayfa" : "Homepage"}
              </span>
            </motion.a>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center min-w-0 flex-1"
            >
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent tracking-wider truncate">
                EMUCON 2025
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-500/60 tracking-widest uppercase mt-0.5 truncate">
                {language === "tr" ? "Etkinlik Kuralları" : "Event Rules"}
              </p>
            </motion.div>

            {/* Language Switcher */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full 
                         bg-gradient-to-r from-amber-500/10 to-amber-600/10
                         border border-amber-500/30 hover:border-amber-400/60
                         text-amber-400 hover:text-amber-300
                         transition-all duration-300 group shrink-0"
            >
              <FaGlobe className="text-base sm:text-lg group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-semibold text-xs sm:text-sm">
                {language === "tr" ? "EN" : "TR"}
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Event Banner */}
          <div className="relative mb-6 sm:mb-12 p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/5 border border-amber-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
            <div className="absolute top-0 left-0 w-20 sm:w-32 h-20 sm:h-32 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-28 sm:w-48 h-28 sm:h-48 bg-amber-600/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <FaScroll className="text-3xl sm:text-5xl text-amber-400 mx-auto mb-3 sm:mb-4 opacity-80" />
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-amber-300 mb-2 sm:mb-3 leading-tight">
                {language === "tr"
                  ? "Etkinlik Katılım Kuralları ve Sorumluluk Sözleşmesi"
                  : "Event Participation Rules and Liability Agreement"}
              </h2>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-amber-400">📅</span>
                  <span>
                    {language === "tr" ? "20 Aralık 2025" : "December 20, 2025"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-center">
                  <span className="text-amber-400">📍</span>
                  <span className="text-xs sm:text-sm">
                    {language === "tr"
                      ? "DAÜ Lala Mustafa Paşa Spor Sarayı"
                      : "EMU Lala Mustafa Pasha Sports Complex"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rules Content */}
          <motion.article
            key={language}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="prose prose-invert prose-amber max-w-none"
          >
            {language === "tr" ? <TurkishContent /> : <EnglishContent />}
          </motion.article>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/10 bg-black/50 py-6 sm:py-8 mt-10 sm:mt-16">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-amber-400/60 text-xs sm:text-sm">
            {language === "tr" ? "Fantastik Kurgu Kulübü" : "EMURPG Club"} •{" "}
            {language === "tr"
              ? "Doğu Akdeniz Üniversitesi"
              : "Eastern Mediterranean University"}
          </p>
          <p className="text-gray-600 text-[10px] sm:text-xs mt-1.5 sm:mt-2">
            {language === "tr" ? "Aralık 2025" : "December 2025"}
          </p>
        </div>
      </footer>
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <h2 className="text-lg sm:text-2xl font-bold text-amber-400 mt-8 sm:mt-12 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-amber-500/20 flex items-center gap-2 sm:gap-3">
    <span className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full shrink-0" />
    <span className="leading-tight">{children}</span>
  </h2>
);

SectionHeading.propTypes = {
  children: PropTypes.node.isRequired,
};

const Paragraph = ({ children }) => (
  <p className="text-gray-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-[15px]">
    {children}
  </p>
);

Paragraph.propTypes = {
  children: PropTypes.node.isRequired,
};

const TurkishContent = () => (
  <>
    <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 sm:p-6 rounded-lg sm:rounded-xl border-l-4 border-amber-500 mb-6 sm:mb-8">
      <p className="text-amber-200 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
        <strong>Düzenleyen:</strong> Doğu Akdeniz Üniversitesi Fantastik Kurgu
        Kulübü
      </p>
      <p className="text-amber-200 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
        <strong>Etkinlik Tarihi:</strong> 20 Aralık 2025
      </p>
      <p className="text-amber-200 font-medium text-sm sm:text-base">
        <strong>Etkinlik Yeri:</strong>{" "}
        <a
          href="https://maps.app.goo.gl/bprQpkqkQTjHKkM57"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="underline">DAÜ Lala Mustafa Paşa Spor Sarayı</span>
        </a>{" "}
        <span className="text-gray-500 text-xs sm:text-sm">(Google Maps)</span>
      </p>
    </div>

    <SectionHeading>1. GENEL HÜKÜMLER</SectionHeading>
    <Paragraph>
      İşbu sözleşme, EMUCON 2025 Festivali&apos;ne katılan tüm bireysel
      katılımcılar, kulüpler, satıcılar, sponsorlar ve ziyaretçiler için geçerli
      olan kuralları ve sorumlulukları belirlemektedir. Etkinlik alanına giriş
      yapan veya etkinliğe herhangi bir şekilde dahil olan her kişi ve kuruluş,
      işbu sözleşmede yer alan tüm şartları kabul etmiş sayılır.
    </Paragraph>
    <Paragraph>
      Fantastik Kurgu Kulübü ve etkinlik organizasyon komitesi, etkinliğin
      düzenlenmesi ve koordinasyonundan sorumlu olmakla birlikte, katılımcıların
      bireysel eylemlerinden, kulüplerin veya satıcıların yürüttüğü
      faaliyetlerden, üçüncü taraf hizmet sağlayıcılardan kaynaklanan herhangi
      bir durum veya zarardan sorumlu tutulamaz.
    </Paragraph>

    <SectionHeading>2. KATILIMCI SORUMLULUKLARI</SectionHeading>
    <Paragraph>
      Her katılımcı, etkinlik süresince kendi güvenliğinden birinci derecede
      sorumludur. Katılımcılar, kişisel eşyalarının güvenliğini sağlamakla
      yükümlüdür ve herhangi bir kayıp, çalınma veya hasar durumunda etkinlik
      organizasyonu sorumluluk kabul etmemektedir.
    </Paragraph>
    <Paragraph>
      Katılımcılar, etkinlik alanında bulunan ekipman, dekorasyon ve altyapı
      elemanlarına zarar vermekten kaçınmalıdır. Kasıtlı veya ihmalden
      kaynaklanan her türlü hasar, zarar veren kişi veya kulüp tarafından
      karşılanacaktır. Etkinlik görevlileri tarafından tespit edilen hasar
      durumlarında ilgili taraflardan tazminat talep edilme hakkı saklıdır.
    </Paragraph>
    <Paragraph>
      Katılımcıların etkinlik kurallarına uygun davranması, diğer katılımcılara
      saygılı olması ve güvenli bir ortamın sürdürülmesine katkıda bulunması
      beklenmektedir. Etkinlik görevlilerinin uyarılarına uymayan, güvenliği
      tehlikeye atan veya rahatsız edici davranışlar sergileyen katılımcılar,
      etkinlik alanından çıkarılma hakkına tabidir.
    </Paragraph>

    <SectionHeading>3. KULÜP VE STAND SORUMLULUKLARI</SectionHeading>
    <Paragraph>
      Etkinlikte stand açan, satış yapan veya herhangi bir aktivite düzenleyen
      kulüpler ve gruplar, kendi alanlarının düzeni, güvenliği ve temizliğinden
      tamamen sorumludur. Her kulüp, kendisine tahsis edilen alanı etkinlik
      kurallarına uygun şekilde kullanmakla yükümlüdür.
    </Paragraph>
    <Paragraph>
      Kulüpler tarafından gerçekleştirilen tüm satış işlemleri, ilgili kulübün
      kendi sorumluluğundadır. Ürün kalitesi, fiyatlandırma, ödeme işlemleri,
      ürün teslimatı ve satış sonrası hizmetlerden kaynaklanan her türlü sorun
      ve anlaşmazlıkta etkinlik organizasyonu taraf değildir. Alıcılar ve
      satıcılar arasında doğabilecek uyuşmazlıklar, ilgili taraflar arasında
      çözümlenmelidir.
    </Paragraph>
    <Paragraph>
      Kulüpler, satış yapacakları ürünlerin yasal düzenlemelere uygun
      olduğundan, sağlık ve güvenlik standartlarını karşıladığından ve gerekli
      izinlere sahip olduğundan emin olmakla yükümlüdür. Yasalara aykırı ürün
      satışından doğacak tüm yasal sorumluluk, satışı gerçekleştiren kulübe
      aittir.
    </Paragraph>
    <Paragraph>
      Stand sahipleri, kullandıkları elektrik ekipmanlarının güvenliğinden,
      yangın risklerinden ve kendi alanlarındaki her türlü güvenlik önleminden
      sorumludur. Kulüpler, etkinlik sonunda alanlarını temiz bırakmak ve tüm
      malzemelerini kaldırmakla yükümlüdür.
    </Paragraph>
    <Paragraph>
      Kulüpler, tanıtım ve reklam faaliyetlerini yalnızca kendi standları
      dahilinde gerçekleştirebilir. Stand alanı dışına reklam materyali, afiş,
      broşür veya tanıtım malzemesi taşınması, dağıtılması veya asılması
      yasaktır. Diğer standlara veya etkinlik alanının farklı bölümlerine
      giderek sözlü tanıtım yapmak, broşür dağıtmak veya herhangi bir şekilde
      reklam faaliyeti yürütmek kesinlikle yasaktır. Katılımcılar, etkinlik
      alanında dolaşırken diğer kulüplerin reklam yapmasına veya ürün satmaya
      çalışmasına maruz kalmamalıdır. Tüm tanıtım ve reklam faaliyetleri,
      kulübün tahsis edilmiş stand sınırları içerisinde kalmalıdır.
    </Paragraph>

    <SectionHeading>4. SAĞLIK VE GÜVENLİK</SectionHeading>
    <Paragraph>
      Katılımcılar, etkinlik alanında acil durum çıkışlarının yerini bilmeli ve
      acil durum prosedürlerine uymaya hazır olmalıdır. Herhangi bir acil durum,
      kaza veya sağlık sorunu yaşanması halinde, katılımcılar en yakın etkinlik
      görevlisine derhal bilgi vermelidir.
    </Paragraph>
    <Paragraph>
      Etkinlik organizasyonu, temel ilk yardım hizmetlerinin bulunmasını
      sağlamakla birlikte, katılımcıların sağlık durumlarından, kronik
      hastalıklarından, ilaç kullanımlarından veya özel sağlık ihtiyaçlarından
      sorumlu değildir. Katılımcılar, kendi sağlık durumlarını göz önünde
      bulundurarak etkinliğe katılmalı ve gerekli önlemleri almalıdır.
    </Paragraph>
    <Paragraph>
      Gıda alerjisi olan katılımcılar, yiyecek ve içecek alırken kendi
      sorumluluklarında hareket etmelidir. Satılan gıda ürünlerinin içerik
      bilgileri konusunda satıcılardan bilgi almak katılımcıların
      sorumluluğundadır.
    </Paragraph>

    <SectionHeading>5. FİKRİ MÜLKİYET VE MEDYA HAKLARI</SectionHeading>
    <Paragraph>
      Etkinlik süresince çekilecek fotoğraf, video ve diğer görsel-işitsel
      materyaller, etkinlik organizasyonu tarafından tanıtım, belgeleme ve
      sosyal medya paylaşımları amacıyla kullanılabilir. Etkinliğe katılarak,
      katılımcılar bu tür görüntülerin ticari olmayan amaçlarla kullanılmasına
      izin vermiş sayılırlar.
    </Paragraph>
    <Paragraph>
      Katılımcılar ve kulüpler, etkinlik alanında çektikleri görüntüleri sosyal
      medyada paylaşırken diğer katılımcıların mahremiyetine saygı
      göstermelidir. Başkalarının açık rızası olmadan çekilen ve paylaşılan
      görüntülerden kaynaklanan sorumluluk, görüntüyü çeken ve paylaşan kişiye
      aittir.
    </Paragraph>
    <Paragraph>
      Etkinlik kapsamında sergilenen, satılan veya sunulan tüm fikri ürünlerin
      telif hakları ilgili yaratıcılara aittir. Kulüpler ve katılımcılar,
      başkalarının fikri mülkiyet haklarını ihlal etmekten kaçınmalıdır.
    </Paragraph>

    <SectionHeading>6. İPTAL VE DEĞİŞİKLİK HAKLARI</SectionHeading>
    <Paragraph>
      Etkinlik organizasyonu, öngörülemeyen durumlar, hava koşulları, güvenlik
      endişeleri, doğal afetler veya yönetimsel kararlar nedeniyle etkinliği
      iptal etme, erteleme veya programda değişiklik yapma hakkını saklı tutar.
      Bu tür durumlarda katılımcılara mümkün olan en kısa sürede bilgilendirme
      yapılacaktır.
    </Paragraph>
    <Paragraph>
      Etkinlik iptali veya ertelemesi durumunda, organizasyon komitesi
      katılımcılara alternatif tarih önerisi sunmaya çalışacak olmakla birlikte,
      katılımcıların yapmış olduğu kişisel harcamalar, ulaşım masrafları veya
      konaklama giderlerinden sorumlu tutulamaz.
    </Paragraph>
    <Paragraph>
      Etkinlik programında, stand lokasyonlarında veya aktivite zamanlamasında
      yapılacak değişiklikler konusunda organizasyon komitesi tek yetkilidir. Bu
      değişiklikler, etkinliğin akışının iyileştirilmesi ve katılımcı
      memnuniyetinin artırılması amacıyla yapılacaktır.
    </Paragraph>

    <SectionHeading>7. YASAKLAR VE SINIRLAYICI HÜKÜMLER</SectionHeading>
    <Paragraph>
      Etkinlik alanına alkollü içecek, uyuşturucu madde, kesici-delici alet,
      patlayıcı madde ve güvenliği tehlikeye atacak her türlü malzeme sokmak
      kesinlikle yasaktır. Bu kurala uymayan katılımcılar etkinlik alanından
      çıkarılacak ve gerekli görülürse yetkili makamlara bildirilecektir.
    </Paragraph>
    <Paragraph>
      Sigara içimi, yalnızca belirlenmiş alanlarda mümkündür. Kapalı alan ve
      stand bölgelerinde sigara içmek yasaktır. Açık ateş kullanımı, izinsiz
      elektrik bağlantıları ve yangın riski oluşturabilecek faaliyetler
      kesinlikle yasaktır.
    </Paragraph>
    <Paragraph>
      Etkinlik alanında taciz, tehdit, ayrımcılık veya şiddet içeren
      davranışlara tolerans gösterilmeyecektir. Böyle durumlarla karşılaşan
      katılımcılar, derhal etkinlik güvenlik görevlilerine veya organizasyon
      komitesine başvurmalıdır.
    </Paragraph>

    <SectionHeading>8. SORUMLULUK REDDİ</SectionHeading>
    <Paragraph>
      Fantastik Kurgu Kulübü ve EMUCON organizasyon komitesi, etkinlik süresince
      meydana gelebilecek kaza, yaralanma, hastalık, kayıp veya hasardan sorumlu
      tutulamaz. Katılımcılar, etkinliğe kendi rızalarıyla katılmakta ve kendi
      sorumluluklarını kabul etmektedirler.
    </Paragraph>
    <Paragraph>
      Etkinlik alanında bulunan üçüncü taraf hizmet sağlayıcılar, satıcılar ve
      sponsorların sunduğu hizmet ve ürünlerden organizasyon komitesi sorumlu
      değildir. Bu taraflarla yapılacak işlemler, katılımcıların kendi
      sorumluluğundadır.
    </Paragraph>
    <Paragraph>
      Organizasyon komitesi, katılımcıların birbirleriyle veya üçüncü taraflarla
      yaptığı anlaşmalar, satış işlemleri veya diğer ticari faaliyetlerde taraf
      değildir ve bu işlemlerden doğacak herhangi bir uyuşmazlıkta sorumluluk
      kabul etmemektedir.
    </Paragraph>

    <SectionHeading>9. UYUŞMAZLIK ÇÖZÜMÜ</SectionHeading>
    <Paragraph>
      İşbu sözleşmeden kaynaklanan uyuşmazlıklar, öncelikle taraflar arasında
      dostane görüşmelerle çözümlenmeye çalışılacaktır. Uyuşmazlığın
      çözümlenemediği durumlarda, Kuzey Kıbrıs Türk Cumhuriyeti mahkemeleri
      yetkilidir.
    </Paragraph>
    <Paragraph>
      Katılımcılar, etkinlik kurallarına uymakla ve organizasyon görevlilerinin
      talimatlarını izlemekle yükümlüdür. Kural ihlalleri durumunda organizasyon
      komitesi, uyarı verme, etkinlik alanından çıkarma ve gerektiğinde yasal
      işlem başlatma hakkına sahiptir.
    </Paragraph>

    <SectionHeading>10. KABUL VE ONAY</SectionHeading>
    <Paragraph>
      Etkinliğe kayıt olan, stand açan, satış yapan veya herhangi bir şekilde
      etkinliğe katılan her birey ve kuruluş, işbu sözleşmede yer alan tüm
      maddeleri okuduğunu, anladığını ve kabul ettiğini beyan eder. Bu sözleşme,
      etkinlik tarihi olan 20 Aralık 2025 tarihinde yürürlüğe girer ve etkinlik
      sona erene kadar geçerliliğini korur.
    </Paragraph>
    <Paragraph>
      Organizasyon komitesi, bu sözleşmede değişiklik yapma hakkını saklı tutar.
      Yapılacak değişiklikler, etkinlik öncesinde katılımcılara duyurulacaktır.
    </Paragraph>

    <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-amber-500/20 text-center">
      <p className="text-amber-400 font-bold text-base sm:text-lg">
        Fantastik Kurgu Kulübü
      </p>
      <p className="text-gray-400 text-sm sm:text-base">
        Doğu Akdeniz Üniversitesi
      </p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1.5 sm:mt-2">
        Aralık 2025
      </p>
    </div>
  </>
);

const EnglishContent = () => (
  <>
    <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 sm:p-6 rounded-lg sm:rounded-xl border-l-4 border-amber-500 mb-6 sm:mb-8">
      <p className="text-amber-200 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
        <strong>Organized by:</strong> Eastern Mediterranean University EMURPG
        Club
      </p>
      <p className="text-amber-200 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
        <strong>Event Date:</strong> December 20, 2025
      </p>
      <p className="text-amber-200 font-medium text-sm sm:text-base">
        <strong>Event Venue:</strong>{" "}
        <a
          href="https://maps.app.goo.gl/bprQpkqkQTjHKkM57"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="underline">
            EMU Lala Mustafa Pasha Sports Complex
          </span>
        </a>{" "}
        <span className="text-gray-500 text-xs sm:text-sm">(Google Maps)</span>
      </p>
    </div>

    <SectionHeading>1. GENERAL PROVISIONS</SectionHeading>
    <Paragraph>
      This agreement defines the rules and responsibilities applicable to all
      individual participants, clubs, vendors, sponsors, and visitors attending
      EMUCON 2025 Festival. Any person or organization entering the event venue
      or participating in the event in any manner is deemed to have accepted all
      terms and conditions outlined in this agreement.
    </Paragraph>
    <Paragraph>
      While EMURPG Club and the event organizing committee are responsible for
      the organization and coordination of the event, they cannot be held liable
      for the individual actions of participants, activities conducted by clubs
      or vendors, or any situation or damage arising from third-party service
      providers.
    </Paragraph>

    <SectionHeading>2. PARTICIPANT RESPONSIBILITIES</SectionHeading>
    <Paragraph>
      Each participant is primarily responsible for their own safety throughout
      the event. Participants are obligated to ensure the security of their
      personal belongings, and the event organization accepts no responsibility
      in case of any loss, theft, or damage.
    </Paragraph>
    <Paragraph>
      Participants must refrain from damaging equipment, decorations, and
      infrastructure elements located within the event area. Any damage
      resulting from intentional acts or negligence shall be covered by the
      individual or club causing the damage. The right to claim compensation
      from the relevant parties is reserved in cases of damage identified by
      event officials.
    </Paragraph>
    <Paragraph>
      Participants are expected to behave in accordance with event rules, show
      respect to other participants, and contribute to maintaining a safe
      environment. Participants who fail to comply with warnings from event
      officials, endanger safety, or exhibit disruptive behavior are subject to
      removal from the event area.
    </Paragraph>

    <SectionHeading>3. CLUB AND BOOTH RESPONSIBILITIES</SectionHeading>
    <Paragraph>
      Clubs and groups operating booths, conducting sales, or organizing any
      activities at the event are fully responsible for the order, safety, and
      cleanliness of their designated areas. Each club is obligated to use the
      area allocated to them in accordance with event regulations.
    </Paragraph>
    <Paragraph>
      All sales transactions conducted by clubs are the sole responsibility of
      the respective club. The event organization is not a party to any issues
      and disputes arising from product quality, pricing, payment processes,
      product delivery, and after-sales services. Disputes that may arise
      between buyers and sellers must be resolved between the relevant parties.
    </Paragraph>
    <Paragraph>
      Clubs are obligated to ensure that the products they sell comply with
      legal regulations, meet health and safety standards, and possess the
      necessary permits. All legal liability arising from the sale of illegal
      products belongs to the club conducting the sale.
    </Paragraph>
    <Paragraph>
      Booth operators are responsible for the safety of electrical equipment
      they use, fire hazards, and all security measures within their area. Clubs
      are obligated to leave their areas clean and remove all materials at the
      conclusion of the event.
    </Paragraph>
    <Paragraph>
      Clubs may conduct promotional and advertising activities exclusively
      within their designated booth areas. Carrying, distributing, or posting
      advertising materials, posters, brochures, or promotional items outside
      the booth area is prohibited. Approaching other booths or different
      sections of the event area to conduct verbal promotions, distribute
      brochures, or engage in any form of advertising activity is strictly
      forbidden. Participants should not be subjected to solicitation or sales
      attempts from other clubs while moving around the event area. All
      promotional and advertising activities must remain within the boundaries
      of the club&apos;s allocated booth.
    </Paragraph>

    <SectionHeading>4. HEALTH AND SAFETY</SectionHeading>
    <Paragraph>
      Participants should be aware of the location of emergency exits within the
      event area and be prepared to comply with emergency procedures. In the
      event of any emergency, accident, or health issue, participants must
      immediately inform the nearest event official.
    </Paragraph>
    <Paragraph>
      While the event organization ensures the availability of basic first aid
      services, it is not responsible for participants&apos; health conditions,
      chronic illnesses, medication usage, or special health needs. Participants
      should attend the event considering their own health conditions and take
      necessary precautions.
    </Paragraph>
    <Paragraph>
      Participants with food allergies must act under their own responsibility
      when purchasing food and beverages. It is the participants&apos;
      responsibility to inquire about ingredient information from vendors.
    </Paragraph>

    <SectionHeading>5. INTELLECTUAL PROPERTY AND MEDIA RIGHTS</SectionHeading>
    <Paragraph>
      Photographs, videos, and other audiovisual materials captured during the
      event may be used by the event organization for promotional,
      documentation, and social media sharing purposes. By participating in the
      event, participants are deemed to have granted permission for such images
      to be used for non-commercial purposes.
    </Paragraph>
    <Paragraph>
      Participants and clubs should respect the privacy of other participants
      when sharing images captured at the event venue on social media.
      Responsibility for images captured and shared without others&apos;
      explicit consent belongs to the person capturing and sharing the image.
    </Paragraph>
    <Paragraph>
      Copyright of all intellectual products exhibited, sold, or presented
      within the scope of the event belongs to the respective creators. Clubs
      and participants must refrain from infringing on others&apos; intellectual
      property rights.
    </Paragraph>

    <SectionHeading>6. CANCELLATION AND MODIFICATION RIGHTS</SectionHeading>
    <Paragraph>
      The event organization reserves the right to cancel, postpone, or make
      changes to the program due to unforeseen circumstances, weather
      conditions, security concerns, natural disasters, or administrative
      decisions. In such cases, participants will be informed as soon as
      possible.
    </Paragraph>
    <Paragraph>
      In the event of cancellation or postponement, the organizing committee
      will attempt to offer participants an alternative date, but cannot be held
      responsible for participants&apos; personal expenses, transportation
      costs, or accommodation expenses.
    </Paragraph>
    <Paragraph>
      The organizing committee holds sole authority regarding changes to the
      event program, booth locations, or activity scheduling. These changes will
      be made to improve the event flow and increase participant satisfaction.
    </Paragraph>

    <SectionHeading>7. PROHIBITIONS AND RESTRICTIVE PROVISIONS</SectionHeading>
    <Paragraph>
      Bringing alcoholic beverages, narcotics, sharp objects, explosives, and
      any materials that may endanger safety into the event area is strictly
      prohibited. Participants who violate this rule will be removed from the
      event area and reported to relevant authorities if deemed necessary.
    </Paragraph>
    <Paragraph>
      Smoking is permitted only in designated areas. Smoking is prohibited in
      enclosed areas and booth sections. The use of open flames, unauthorized
      electrical connections, and activities that may create fire hazards are
      strictly forbidden.
    </Paragraph>
    <Paragraph>
      Harassment, threats, discrimination, or violent behavior will not be
      tolerated within the event area. Participants encountering such situations
      should immediately contact event security personnel or the organizing
      committee.
    </Paragraph>

    <SectionHeading>8. DISCLAIMER OF LIABILITY</SectionHeading>
    <Paragraph>
      EMURPG Club and the EMUCON organizing committee cannot be held responsible
      for accidents, injuries, illnesses, losses, or damages that may occur
      during the event. Participants are attending the event of their own free
      will and accept their own responsibilities.
    </Paragraph>
    <Paragraph>
      The organizing committee is not responsible for services and products
      offered by third-party service providers, vendors, and sponsors present at
      the event venue. Transactions conducted with these parties are the
      participants&apos; own responsibility.
    </Paragraph>
    <Paragraph>
      The organizing committee is not a party to agreements, sales transactions,
      or other commercial activities conducted between participants or with
      third parties, and accepts no responsibility for any disputes arising from
      such transactions.
    </Paragraph>

    <SectionHeading>9. DISPUTE RESOLUTION</SectionHeading>
    <Paragraph>
      Disputes arising from this agreement shall primarily be attempted to be
      resolved through amicable discussions between the parties. In cases where
      disputes cannot be resolved, the courts of the Turkish Republic of
      Northern Cyprus shall have jurisdiction.
    </Paragraph>
    <Paragraph>
      Participants are obligated to comply with event rules and follow
      instructions from organizing officials. In cases of rule violations, the
      organizing committee has the right to issue warnings, remove individuals
      from the event area, and initiate legal proceedings if necessary.
    </Paragraph>

    <SectionHeading>10. ACCEPTANCE AND ACKNOWLEDGMENT</SectionHeading>
    <Paragraph>
      Every individual and organization registering for the event, operating a
      booth, conducting sales, or participating in the event in any manner
      declares that they have read, understood, and accepted all articles
      contained in this agreement. This agreement enters into force on the event
      date of December 20, 2025, and remains valid until the conclusion of the
      event.
    </Paragraph>
    <Paragraph>
      The organizing committee reserves the right to make changes to this
      agreement. Any changes will be announced to participants before the event.
    </Paragraph>

    <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-amber-500/20 text-center">
      <p className="text-amber-400 font-bold text-base sm:text-lg">
        EMURPG Club
      </p>
      <p className="text-gray-400 text-sm sm:text-base">
        Eastern Mediterranean University
      </p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1.5 sm:mt-2">
        December 2025
      </p>
    </div>
  </>
);

export default EmuconRulesPage;
