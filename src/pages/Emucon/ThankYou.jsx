import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Camera, Users, Star, Home, Mail } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import {
  EmuconNavbar,
  EmuconFooter,
  EmuconParallax,
  EmuconSectionHeader,
  EmuconContentCard,
} from "../../components/Emucon";

const stats = [
  { number: "42+", label: "Student Clubs / Öğrenci Kulübü" },
  { number: "40+", label: "Activities / Etkinlik" },
  { number: "5", label: "Stage Performances / Sahne Performansları" },
  { number: "600+", label: "Visitors / Ziyaretçi" },
];

const EmuconThankYou = () => {
  useEffect(() => {
    document.title = "EMUCON 2025 - Thank You!";
  }, []);

  return (
    <div
      className="min-h-screen text-emucon-text-primary overflow-x-hidden overflow-y-auto select-none"
      style={{
        background: "transparent",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Parallax background */}
      <EmuconParallax />

      {/* Content wrapper */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Navbar */}
        <EmuconNavbar scrollThreshold={100} />

        {/* Hero Thank You Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated heart icon */}
            <div className="mb-8 animate-pulse">
              <Heart className="w-20 h-20 md:w-28 md:h-28 mx-auto text-red-400 fill-red-400" />
            </div>

            {/* Main title */}
            <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl text-gold-light mb-6 tracking-wide">
              THANK YOU!
            </h1>
            <h2 className="font-cinzel text-2xl md:text-3xl lg:text-4xl text-cream mb-4">
              TEŞEKKÜRLER!
            </h2>

            {/* Subtitle */}
            <p className="text-emucon-text-secondary text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              EMUCON 2025 was a massive success thanks to all of you!
            </p>
            <p className="text-emucon-text-secondary text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              EMUCON 2025, hepiniz sayesinde büyük bir başarı oldu!
            </p>

            <p className="text-emucon-text-secondary text-sm md:text-base mb-10 max-w-2xl mx-auto">
              Organized by{" "}
              <strong className="text-gold-light">EMURPG Club</strong> (Fantasy
              Fiction Club)
              <br />
              <strong className="text-gold-light">EMU RPG Kulübü</strong>{" "}
              (Fantastik Kurgu Kulübü) tarafından düzenlenmiştir.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-forest-dark/60 backdrop-blur-sm border border-forest-medium/50 rounded-xl p-4 md:p-6"
                >
                  <div className="font-cinzel text-3xl md:text-4xl text-gold-light mb-2">
                    {stat.number}
                  </div>
                  <div className="text-emucon-text-secondary text-xs md:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Return home button */}
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-forest-medium to-forest-dark hover:from-forest-light hover:to-forest-medium text-cream font-cinzel font-bold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 border border-gold-dark/30"
            >
              <Home className="w-5 h-5" />
              <span>Back to EMURPG / Ana Sayfaya Dön</span>
            </Link>
          </div>
        </section>

        {/* Message from organizers */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <EmuconSectionHeader title="A Message / Bir Mesaj" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* English message */}
            <EmuconContentCard>
              <span className="inline-block px-3 py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-4">
                English
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-4">
                Until Next Time
              </h3>
              <p className="text-emucon-text-secondary mb-4 text-sm md:text-base leading-relaxed">
                What an incredible day! EMUCON 2025 brought together 42+ student
                clubs, hundreds of visitors, and created memories that will last
                a lifetime.
              </p>
              <p className="text-emucon-text-secondary mb-4 text-sm md:text-base leading-relaxed">
                Thank you to every club that participated, every volunteer who
                helped, every performer who took the stage, and every visitor
                who made this festival come alive.
              </p>
              <p className="text-emucon-text-secondary text-sm md:text-base leading-relaxed">
                See you at{" "}
                <strong className="text-gold-light">EMUCON 2026</strong>!
              </p>
            </EmuconContentCard>

            {/* Turkish message */}
            <EmuconContentCard>
              <span className="inline-block px-3 py-1 bg-forest-medium text-gold-light text-xs rounded uppercase tracking-wider mb-4">
                Türkçe
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-4">
                Bir Dahaki Sefere
              </h3>
              <p className="text-emucon-text-secondary mb-4 text-sm md:text-base leading-relaxed">
                Ne inanılmaz bir gündü! EMUCON 2025, 42+ öğrenci kulübünü,
                yüzlerce ziyaretçiyi bir araya getirdi ve ömür boyu sürecek
                anılar yarattı.
              </p>
              <p className="text-emucon-text-secondary mb-4 text-sm md:text-base leading-relaxed">
                Katılan her kulübe, yardım eden her gönüllüye, sahneye çıkan her
                sanatçıya ve bu festivali canlandıran her ziyaretçiye teşekkür
                ederiz.
              </p>
              <p className="text-emucon-text-secondary text-sm md:text-base leading-relaxed">
                <strong className="text-gold-light">EMUCON 2026</strong>&apos;da
                görüşmek üzere!
              </p>
            </EmuconContentCard>
          </div>
        </section>

        {/* Highlights section */}
        <section className="py-16 px-4 max-w-4xl mx-auto">
          <EmuconSectionHeader title="Highlights / Öne Çıkanlar" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-forest-dark/60 backdrop-blur-sm border border-forest-medium/50 rounded-xl p-6 text-center">
              <Users className="w-12 h-12 mx-auto text-gold-light mb-4" />
              <h4 className="font-cinzel text-lg text-cream mb-2">Community</h4>
              <p className="text-emucon-text-secondary text-sm">
                42+ clubs came together / 42+ kulüp bir araya geldi
              </p>
            </div>

            <div className="bg-forest-dark/60 backdrop-blur-sm border border-forest-medium/50 rounded-xl p-6 text-center">
              <Star className="w-12 h-12 mx-auto text-gold-light mb-4" />
              <h4 className="font-cinzel text-lg text-cream mb-2">
                Performances
              </h4>
              <p className="text-emucon-text-secondary text-sm">
                Amazing stage shows / Harika sahne şovları
              </p>
            </div>

            <div className="bg-forest-dark/60 backdrop-blur-sm border border-forest-medium/50 rounded-xl p-6 text-center">
              <Camera className="w-12 h-12 mx-auto text-gold-light mb-4" />
              <h4 className="font-cinzel text-lg text-cream mb-2">Memories</h4>
              <p className="text-emucon-text-secondary text-sm">
                Countless photos taken / Sayısız fotoğraf çekildi
              </p>
            </div>
            <div className="bg-forest-dark/60 backdrop-blur-sm border border-forest-medium/50 rounded-xl p-6 text-center">
              <Star className="w-12 h-12 mx-auto text-gold-light mb-4" />
              <h4 className="font-cinzel text-lg text-cream mb-2">
                Competitions
              </h4>
              <p className="text-emucon-text-secondary text-sm">
                20+ rewards given in competitions / Yarışmalarda 20+ ödül
                verildi
              </p>
            </div>
          </div>
        </section>

        {/* Follow us section */}
        <section className="py-16 px-4 max-w-4xl mx-auto text-center">
          <EmuconSectionHeader title="Stay Connected / Takipte Kal" />

          <p className="text-emucon-text-secondary text-lg mb-8 mt-6">
            Follow us for updates on EMUCON 2026 and more!
            <br />
            EMUCON 2026 ve daha fazlası için bizi takip edin!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.instagram.com/emurpgclub/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <FaInstagram size={20} />
              <span>@emurpgclub</span>
            </a>

            <a
              href="mailto:emufrpclub@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-forest-medium to-forest-dark hover:from-forest-light hover:to-forest-medium text-cream font-bold rounded-xl transition-all duration-300 transform hover:scale-105 border border-gold-dark/30"
            >
              <Mail className="w-5 h-5" />
              <span>emufrpclub@gmail.com</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <EmuconFooter logoVariant="lightgray" />
      </div>
    </div>
  );
};

export default EmuconThankYou;
