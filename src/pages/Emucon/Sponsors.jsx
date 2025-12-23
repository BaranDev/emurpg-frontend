import { useEffect } from "react";
import {
  EmuconNavbar,
  EmuconDivider,
  EmuconContentCard,
  EmuconFooter,
  EmuconStatsRow,
  EmuconSectionHeader,
  EmuconParallax,
  SponsorHero,
  SponsorBenefitCard,
  SponsorTierCard,
  SponsorContactCTA,
  CrownIcon,
  ShieldIcon,
  StarIcon,
  PhoneIcon,
  ArtIcon,
  ScrollIcon,
} from "../../components/Emucon";

const benefits = [
  {
    icon: <CrownIcon className="text-forest-dark" size={20} />,
    title: "Stage Visibility",
    description:
      "Logo placement during 5 stage performances (2:00–7:00 PM). Your brand gets announced, seen, and photographed repeatedly.",
  },
  {
    icon: <ShieldIcon className="text-forest-dark" size={20} />,
    title: "Direct Engagement",
    description:
      "Interactive booth during peak hours. Run demos, collect leads, distribute samples, 5 hours of face-to-face brand building.",
  },
  {
    icon: <StarIcon className="text-forest-dark" size={20} />,
    title: "Social Amplification",
    description:
      "Pre-event campaigns, live coverage, post-event content. Your brand integrated into content that reaches thousands beyond attendees.",
  },
  {
    icon: <PhoneIcon className="text-forest-dark" size={20} />,
    title: "Shareable Moments",
    description:
      "Every competition winner, every performance, every photo op includes your branding. Students share it, you get organic reach.",
  },
  {
    icon: <ArtIcon className="text-forest-dark" size={20} />,
    title: "Custom Activations",
    description:
      "Design experiences that fit your brand. We integrate them into the festival, you get authentic engagement, not forced marketing.",
  },
  {
    icon: <ScrollIcon className="text-forest-dark" size={20} />,
    title: "Measurable Impact",
    description:
      "Post-event analytics: reach, engagement, social mentions, booth traffic. You'll know exactly what you got from your investment.",
  },
];

const stats = [
  { number: "42+", label: "Student Clubs (2025)" },
  { number: "5", label: "Hours Exposure" },
  { number: "50+", label: "Activities (2025)" },
  { number: "600+", label: "Attendees (2025)" },
  { number: "200K+", label: "Social Media Views (2025)" },
];

const businessMetrics = [
  { number: "18-26", label: "Target Age Range" },
  { number: "80%", label: "Social Media Active" },
  { number: "60%", label: "Follow Brands Online" },
  { number: "Multi-Channel", label: "Campaign Reach" },
];

const tiers = [
  {
    tier: "gold",
    name: "Gold Sponsor",
    subtitle: "Premium Partnership",
    features: [
      "Main stage naming rights",
      "Premium booth location",
      "Logo on all event materials",
      "Social media feature posts",
      "Dedicated announcement slots",
      "Post-event analytics report",
    ],
  },
  {
    tier: "silver",
    name: "Silver Sponsor",
    subtitle: "Enhanced Visibility",
    features: [
      "Activity area sponsorship",
      "Standard booth space",
      "Logo on select materials",
      "Social media mentions",
      "Stage announcements",
      "Post-event report",
    ],
  },
  {
    tier: "bronze",
    name: "Bronze Sponsor",
    subtitle: "Brand Presence",
    features: [
      "Logo placement on materials",
      "Social media mention",
      "Thank you announcement",
      "Prize partnership option",
    ],
  },
];

const EmuconSponsors = () => {
  useEffect(() => {
    document.title = "EMURPG - EMUCON 2026 Sponsors";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen text-emucon-text-primary select-none"
      style={{ background: "transparent", position: "relative", zIndex: 1 }}
    >
      {/* Parallax background */}
      <EmuconParallax />

      {/* Content wrapper - sits above parallax */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Navbar with back button */}
        <EmuconNavbar showBack scrollThreshold={200} />

        {/* Hero Section */}
        <SponsorHero />

        {/* Why Sponsor Section */}
        <section className="py-16 md:py-20 px-5 max-w-[1200px] mx-auto">
          <EmuconSectionHeader title="Why Sponsor EMUCON?" symbol="✦" />

          <EmuconContentCard goldBorder>
            {/* English content */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-gold text-forest-dark text-xs rounded font-semibold uppercase tracking-wider mb-4">
                English
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-4">
                The Numbers That Matter
              </h3>
              <p className="text-emucon-text-secondary mb-4">
                <strong className="text-gold-light">1,000+ attendees</strong>{" "}
                from 41+ student clubs. Five continuous hours of brand exposure
                during peak engagement windows (2:00 PM–7:00 PM). This isn’t
                passive advertising, it&apos;s active participation.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                <strong className="text-gold-light">
                  80% of attendees are active on social media.
                </strong>{" "}
                They post, they tag, they share. Your booth activation becomes
                content. Your logo on stage becomes a story. Every interaction
                multiplies your reach beyond the physical event.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                <strong className="text-gold-light">
                  Cost per impression: significantly lower than traditional
                  campus advertising.
                </strong>{" "}
                One sponsorship gets you stage visibility, booth space, social
                mentions, and organic content creation, all in a single,
                concentrated day.
              </p>
              <p className="text-emucon-text-secondary">
                <strong className="text-gold-light">Measurable ROI.</strong>{" "}
                Post-event analytics include booth traffic, social media reach,
                content impressions, and lead collection data. You’ll know
                exactly what you paid for.
              </p>
            </div>

            <EmuconDivider variant="gold" />

            {/* Turkish content */}
            <div>
              <span className="inline-block px-3 py-1 bg-gold text-forest-dark text-xs rounded font-semibold uppercase tracking-wider mb-4">
                Türkçe
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-4">
                Önemli Olan Rakamlar
              </h3>
              <p className="text-emucon-text-secondary mb-4">
                <strong className="text-gold-light">1.000+ katılımcı</strong>{" "}
                41+ öğrenci kulübünden. Beş saat kesintisiz marka görünürlüğü
                (14:00–19:00). Bu pasif reklam değil, aktif katılım.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                <strong className="text-gold-light">
                  Katılımcıların %80’i sosyal medyada aktif.
                </strong>{" "}
                Paylaşıyorlar, etiketliyorlar. Stand aktivasyonunuz içerik
                haline geliyor. Sahnedeki logonuz hikaye oluyor. Her etkileşim,
                erişiminizi fiziksel etkinliğin ötesine taşıyor.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                <strong className="text-gold-light">
                  Gösterim başına maliyet: geleneksel kampüs reklamlarından çok
                  daha düşük.
                </strong>{" "}
                Tek sponsorluk ile sahne görünürlüğü, stand alanı, sosyal medya
                sözler ve organik içerik oluşturma, hepsi tek bir yoğun günde.
              </p>
              <p className="text-emucon-text-secondary">
                <strong className="text-gold-light">
                  Ölçülebilir yatırım getirisi.
                </strong>{" "}
                Etkinlik sonrası analitik: stand trafiği, sosyal medya erişimi,
                içerik gösterimleri, potansiyel müşteri verileri. Ne için ödeme
                yaptığınızı tam olarak bileceksiniz.
              </p>
            </div>
          </EmuconContentCard>

          {/* Stats */}
          <EmuconStatsRow stats={stats} variant="gold" />

          {/* Business Metrics - Second Row */}
          <div className="mt-6">
            <EmuconStatsRow stats={businessMetrics} variant="gold" />
          </div>
        </section>

        <EmuconDivider variant="gold" />

        {/* Benefits Section */}
        <section className="py-16 md:py-20 px-5 max-w-[1200px] mx-auto">
          <EmuconSectionHeader title="Sponsor Benefits" symbol="✦" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {benefits.map((benefit, index) => (
              <SponsorBenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </section>

        <EmuconDivider variant="gold" />

        {/* Sponsorship Tiers Section */}
        <section className="py-16 md:py-20 px-5 max-w-[1200px] mx-auto">
          <EmuconSectionHeader title="Sponsorship Tiers" symbol="✦" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10">
            {tiers.map((tier, index) => (
              <SponsorTierCard
                key={index}
                tier={tier.tier}
                name={tier.name}
                subtitle={tier.subtitle}
                features={tier.features}
              />
            ))}
          </div>

          <p className="text-center text-emucon-text-muted mt-8 italic">
            Custom packages available for EMUCON 2026. Let&apos;s discuss what
            works best for your brand.
            <br />
            <span className="text-emucon-text-secondary">
              EMUCON 2026 için özel paketler mevcuttur. Markanız için en uygun
              olanı konuşalım.
            </span>
          </p>
        </section>

        <EmuconDivider variant="gold" />

        {/* Contact Section */}
        <section className="py-16 md:py-20 px-5 max-w-[1200px] mx-auto">
          <EmuconSectionHeader title="Get In Touch" symbol="✦" />
          <SponsorContactCTA />
        </section>

        {/* Footer */}
        <EmuconFooter logoVariant="yellow" />
      </div>
    </div>
  );
};

export default EmuconSponsors;
