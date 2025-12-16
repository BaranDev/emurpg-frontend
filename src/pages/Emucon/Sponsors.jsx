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
      "Interactive booth during peak hours. Run demos, collect leads, distribute samples—5 hours of face-to-face brand building.",
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
      "Every competition winner, every performance, every photo op includes your branding. Students share it—you get organic reach.",
  },
  {
    icon: <ArtIcon className="text-forest-dark" size={20} />,
    title: "Custom Activations",
    description:
      "Design experiences that fit your brand. We integrate them into the festival—you get authentic engagement, not forced marketing.",
  },
  {
    icon: <ScrollIcon className="text-forest-dark" size={20} />,
    title: "Measurable Impact",
    description:
      "Post-event analytics: reach, engagement, social mentions, booth traffic. You'll know exactly what you got from your investment.",
  },
];

const stats = [
  { number: "41", label: "Participating Clubs" },
  { number: "5", label: "Hours of Exposure" },
  { number: "40", label: "Activities" },
  { number: "5", label: "Stage Performances" },
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
      "VIP area access",
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
    document.title = "EMURPG - EMUCON Sponsors";
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
                41 Clubs. 5 Hours. Thousands of Students.
              </h3>
              <p className="text-emucon-text-secondary mb-4">
                EMUCON delivers direct access to 18-26 year old university students—digitally active, socially engaged, and making brand decisions that stick.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                Five continuous hours (2:00 PM–7:00 PM) means your brand isn't just seen—it's experienced. Students interact with your booth, see your logo on stage, hear your name during announcements, and share it on social media.
              </p>
              <p className="text-emucon-text-secondary">
                Every element is shareable: gaming tournaments, live performances, photo corners. Your visibility extends far beyond the event through organic social content.
              </p>
            </div>

            <EmuconDivider variant="gold" />

            {/* Turkish content */}
            <div>
              <span className="inline-block px-3 py-1 bg-gold text-forest-dark text-xs rounded font-semibold uppercase tracking-wider mb-4">
                Türkçe
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-4">
                41 Kulüp. 5 Saat. Binlerce Öğrenci.
              </h3>
              <p className="text-emucon-text-secondary mb-4">
                EMUCON, markanızı 18-26 yaş arası üniversite öğrencilerine ulaştırır—dijital dünyada aktif, sosyal medyada etkin, marka tercihlerini şimdi yapıyorlar.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                Beş saat kesintisiz görünürlük (14:00–19:00). Markanız sadece görülmez, deneyimlenir. Öğrenciler standınızla etkileşime girer, logonuzu sahnede görür, adınızı anons edilen her yerde duyar ve sosyal medyada paylaşır.
              </p>
              <p className="text-emucon-text-secondary">
                Her aktivite paylaşılabilir: oyun yarışmaları, canlı performanslar, fotoğraf köşeleri. Görünürlüğünüz organik sosyal içerikle etkinliğin çok ötesine uzanır.
              </p>
            </div>
          </EmuconContentCard>

          {/* Stats */}
          <EmuconStatsRow stats={stats} variant="gold" />
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
            Custom packages available. Let&apos;s discuss what works best for
            your brand.
            <br />
            <span className="text-emucon-text-secondary">
              Özel paketler mevcuttur. Markanız için en uygun olanı konuşalım.
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
