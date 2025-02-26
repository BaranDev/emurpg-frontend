import React, { useState } from "react";
const Privacy = () => {
  const [language, setLanguage] = useState("en");

  const content = {
    en: {
      title: "EMU RPG Club Privacy Policy",
      collect: {
        title: "Information We Collect",
        intro:
          "To comply with Eastern Mediterranean University's activity reporting requirements, we collect and store the following information:",
        items: [
          "Student ID number (for verification of university enrollment)",
          "Name and surname",
          "Event participation records",
          "Game table assignments",
          "Basic contact information (for event communications)",
        ],
      },
      usage: {
        title: "How We Use Your Information",
        items: [
          "Generate attendance reports for EMU Activity Center",
          "Track event participation statistics",
          "Manage game table assignments",
          "Facilitate event communications",
          "Create anonymized statistical reports",
        ],
      },
      security: {
        title: "Data Security",
        intro: "We take the security of your information seriously:",
        items: [
          "All data is stored in a secure, encrypted database",
          "Access is strictly limited to authorized club administrators",
          "Data is only used for university reporting purposes",
          "No sensitive personal information is stored",
          "Data is regularly reviewed and unnecessary information is removed",
        ],
      },
      retention: {
        title: "Data Retention",
        text: "Information is retained only for the duration necessary to fulfill university reporting requirements and is securely deleted thereafter. Students can request the removal of their information at any time by contacting the club administration.",
      },
      footer: {
        lastUpdated: "Last updated:",
        contact: "For any privacy-related questions, please contact:",
      },
    },
    tr: {
      title: "EMU RPG Kulübü Gizlilik Politikası",
      collect: {
        title: "Topladığımız Bilgiler",
        intro:
          "Doğu Akdeniz Üniversitesi'nin etkinlik raporlama gereksinimlerine uymak için aşağıdaki bilgileri topluyoruz ve saklıyoruz:",
        items: [
          "Öğrenci numarası (üniversite kaydının doğrulanması için)",
          "Ad ve soyad",
          "Etkinlik katılım kayıtları",
          "Oyun masası atamaları",
          "Temel iletişim bilgileri (etkinlik iletişimleri için)",
        ],
      },
      usage: {
        title: "Bilgilerinizi Nasıl Kullanıyoruz",
        items: [
          "DAÜ Aktivite Merkezi için katılım raporları oluşturma",
          "Etkinlik katılım istatistiklerini takip etme",
          "Oyun masası atamalarını yönetme",
          "Etkinlik iletişimlerini kolaylaştırma",
          "Anonim istatistik raporları oluşturma",
        ],
      },
      security: {
        title: "Veri Güvenliği",
        intro: "Bilgilerinizin güvenliğini ciddiye alıyoruz:",
        items: [
          "Tüm veriler güvenli, şifrelenmiş bir veritabanında saklanır",
          "Erişim sadece yetkili kulüp yöneticileriyle sınırlıdır",
          "Veriler sadece üniversite raporlama amaçları için kullanılır",
          "Hassas kişisel bilgiler saklanmaz",
          "Veriler düzenli olarak gözden geçirilir ve gereksiz bilgiler kaldırılır",
        ],
      },
      retention: {
        title: "Veri Saklama",
        text: "Bilgiler sadece üniversite raporlama gereksinimlerini yerine getirmek için gerekli süre boyunca saklanır ve sonrasında güvenli bir şekilde silinir. Öğrenciler istedikleri zaman kulüp yönetimine başvurarak bilgilerinin kaldırılmasını talep edebilirler.",
      },
      footer: {
        lastUpdated: "Son güncelleme:",
        contact: "Gizlilikle ilgili sorularınız için lütfen iletişime geçin:",
      },
    },
  };
  const lastUpdateDate = "08/12/2024";
  return (
    <div className="min-h-screen bg-medieval-pattern py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Main Content Container */}
        <div className="bg-gray-900 bg-opacity-90 rounded-2xl p-10 shadow-2xl border border-yellow-600/30 backdrop-blur-sm">
          {/* Header with Language Selector */}
          <div className="flex grid justify-center items-center mb-12">
            <h1 className="text-4xl font-bold text-yellow-500">
              {content[language].title}
            </h1>
            <button
              onClick={() => setLanguage(language === "en" ? "tr" : "en")}
              className="bg-black/40 text-yellow-500 border border-yellow-600/20 px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-600/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              {language === "en" ? "TR" : "EN"}
            </button>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto rounded-full mb-12" />

          {/* Content Sections */}
          <div className="space-y-12 text-gray-300">
            {/* Retention Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].retention.title}
                </h2>
                <p className="leading-relaxed">
                  {content[language].retention.text}
                </p>
              </div>
            </section>
            {/* Information Collection Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].collect.title}
                </h2>
                <p className="mb-6 leading-relaxed">
                  {content[language].collect.intro}
                </p>
                <ul className="list-none space-y-3">
                  {content[language].collect.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Usage Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].usage.title}
                </h2>
                <ul className="list-none space-y-3">
                  {content[language].usage.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Security Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].security.title}
                </h2>
                <p className="mb-6 leading-relaxed">
                  {content[language].security.intro}
                </p>
                <ul className="list-none space-y-3">
                  {content[language].security.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-yellow-600/30 text-gray-400 text-center">
            <p className="text-sm">
              {content[language].footer.lastUpdated} {lastUpdateDate}{" "}
            </p>
            <p className="mt-4 text-sm">
              {content[language].footer.contact}
              <a
                href="mailto:emufrpclub@gmail.com"
                className="text-yellow-500 hover:text-yellow-400 ml-1 transition-colors duration-300"
              >
                emufrpclub@gmail.com
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
