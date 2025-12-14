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
    title: "Stage Presence",
    description:
      "Logo placement, announcements, and dedicated sponsor moments during main stage programming throughout the day.",
  },
  {
    icon: <ShieldIcon className="text-forest-dark" size={20} />,
    title: "Booth Activation",
    description:
      "Set up an interactive booth, run product demos, collect leads, or create brand experiences visitors will remember.",
  },
  {
    icon: <StarIcon className="text-forest-dark" size={20} />,
    title: "Prize Partnerships",
    description:
      "Associate your brand with competition winners. Provide prizes that get photographed and shared across social media.",
  },
  {
    icon: <PhoneIcon className="text-forest-dark" size={20} />,
    title: "Social Integration",
    description:
      "Features in our pre-event campaigns, live event coverage, and post-event content across all platforms.",
  },
  {
    icon: <ArtIcon className="text-forest-dark" size={20} />,
    title: "Creative Freedom",
    description:
      "Design custom activations that fit your brand. We'll help integrate them seamlessly into the festival experience.",
  },
  {
    icon: <ScrollIcon className="text-forest-dark" size={20} />,
    title: "Post-Event Report",
    description:
      "Receive detailed metrics on reach, engagement, and brand visibility from the event and associated campaigns.",
  },
];

const stats = [
  { number: "26", label: "Participating Clubs" },
  { number: "9", label: "Hours of Exposure" },
  { number: "18-26", label: "Target Age Range" },
  { number: "Multi", label: "Channel Campaigns" },
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
                Direct Access to Your Target Audience
              </h3>
              <p className="text-emucon-text-secondary mb-4">
                EMUCON puts your brand in front of 18-26 year old university
                students who are digitally native, socially active, and at a
                formative stage where brand preferences get established.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                Unlike typical campus events, EMUCON runs for nine continuous
                hours with constantly rotating visitors. This means sustained
                visibility, not just a brief appearance. Your brand becomes part
                of their experience—not just something they see, but something
                they interact with.
              </p>
              <p className="text-emucon-text-secondary">
                Every activity is designed to be shareable. Gaming competitions,
                photo corners, live performances—participants naturally create
                content that extends your reach well beyond the event itself.
              </p>
            </div>

            <EmuconDivider variant="gold" />

            {/* Turkish content */}
            <div>
              <span className="inline-block px-3 py-1 bg-gold text-forest-dark text-xs rounded font-semibold uppercase tracking-wider mb-4">
                Türkçe
              </span>
              <h3 className="font-cinzel text-xl md:text-2xl text-cream mb-4">
                Hedef Kitlenize Doğrudan Erişim
              </h3>
              <p className="text-emucon-text-secondary mb-4">
                EMUCON, markanızı dijital dünyada aktif, sosyal medyada etkin ve
                marka tercihlerinin oluştuğu dönemdeki 18-26 yaş arası
                üniversite öğrencilerinin karşısına çıkarır.
              </p>
              <p className="text-emucon-text-secondary mb-4">
                Tipik kampüs etkinliklerinin aksine, EMUCON sürekli değişen
                ziyaretçilerle dokuz saat boyunca kesintisiz devam eder. Bu,
                sadece kısa bir görünürlük değil, sürekli görünürlük demektir.
                Markanız deneyimin bir parçası haline gelir.
              </p>
              <p className="text-emucon-text-secondary">
                Her aktivite paylaşılabilir olacak şekilde tasarlandı. Oyun
                yarışmaları, fotoğraf köşeleri, canlı performanslar—katılımcılar
                doğal olarak etkinliğin çok ötesine uzanan içerikler üretir.
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
