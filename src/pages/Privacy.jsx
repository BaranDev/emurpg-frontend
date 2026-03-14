import { useState } from "react";
const Privacy = () => {
  const [language, setLanguage] = useState("en");

  const content = {
    en: {
      title:
        "EMURPG Club - Privacy Policy, Terms of Participation & Liability Waiver",
      intro: {
        title: "Introduction & Scope",
        text: "EMURPG Club (hereinafter 'the Club') is a student organization operating under Eastern Mediterranean University (EMU). The Club's sole purpose is to organize and coordinate tabletop role-playing game (TTRPG) and tabletop board game events for students. By registering for or attending any Club event, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy, Terms of Participation, and Liability Waiver in its entirety.",
      },
      clubRole: {
        title: "Role & Limitations of the Club",
        intro:
          "The Club serves exclusively as an organizer and coordinator of events. The Club explicitly does NOT:",
        items: [
          "Own, operate, or manage any event venues",
          "Provide security services or personnel",
          "Provide medical or emergency services",
          "Provide food, beverages, or catering services",
          "Guarantee the safety or security of any venue",
          "Supervise or control individual participant behavior",
          "Provide transportation to or from events",
          "Provide insurance coverage for participants",
          "Act as a legal guardian for any participant",
        ],
        note: "All venue-related matters including but not limited to safety, security, emergency procedures, accessibility, fire safety, and facility conditions are the sole responsibility of the venue owner/operator and/or Eastern Mediterranean University.",
      },
      collect: {
        title: "Information We Collect",
        intro:
          "To comply with Eastern Mediterranean University's activity reporting requirements and manage event registrations, we collect:",
        items: [
          "Student ID number (for verification of university enrollment status)",
          "Full legal name as registered with the university",
          "Faculty/Department affiliation",
          "Event participation and attendance records",
          "Game table assignments and preferences",
          "Contact information (email) for event communications only",
        ],
      },
      usage: {
        title: "How We Use Your Information",
        items: [
          "Generate mandatory attendance reports for EMU Activity Center",
          "Verify participant eligibility (active student status)",
          "Manage event capacity and table assignments",
          "Send essential event-related communications",
          "Create anonymized statistical reports for university administration",
          "Comply with university policies and legal requirements",
        ],
      },
      security: {
        title: "Data Security & Storage",
        intro: "Regarding the security of your information:",
        items: [
          "Data is stored on secure, encrypted cloud infrastructure",
          "Access is restricted to authorized Club administrators only",
          "No financial information, passwords, or sensitive personal data is collected",
          "Data is used exclusively for stated purposes and university reporting",
          "We do not sell, trade, or share data with third parties except as required by university policy or law",
          "The Club implements reasonable security measures but cannot guarantee absolute security against unauthorized access",
        ],
      },
      retention: {
        title: "Data Retention & Deletion",
        text: "Personal information is retained only for the duration necessary to fulfill university reporting requirements (typically one academic year) and is securely deleted thereafter. Participants may request access to, correction of, or deletion of their personal data at any time by contacting the Club administration. Deletion requests will be honored except where retention is required by university policy or applicable law.",
      },
      liability: {
        title: "Limitation of Liability & Assumption of Risk",
        intro: "By participating in Club events, you acknowledge and agree:",
        items: [
          "Participation in all Club events is entirely voluntary and at your own risk",
          "The Club, its officers, members, volunteers, and EMU are not liable for any personal injury, death, property damage, theft, or loss arising from participation in events",
          "You are solely responsible for your own health, safety, and well-being during events",
          "You are responsible for any damage you cause to venue property or equipment",
          "The Club is not responsible for disputes, conflicts, or altercations between participants",
          "The Club is not liable for any allergic reactions, food-related illnesses, or health issues",
          "The Club is not responsible for lost, stolen, or damaged personal belongings including but not limited to dice, miniatures, rulebooks, electronics, and gaming materials",
          "You waive any right to bring legal action against the Club for any reason related to event participation",
        ],
      },
      thirdParty: {
        title: "Third-Party Services & Venue Responsibility",
        intro: "Please be aware of the following regarding third parties:",
        items: [
          "Event venues are owned and operated by third parties (EMU, private establishments, etc.)",
          "Security, emergency response, and first aid are provided by the venue or university authorities",
          "Food and beverages, if available, are provided by third-party vendors or participants themselves",
          "The Club has no control over and assumes no responsibility for third-party services, products, or facilities",
          "Any complaints regarding venue conditions, services, or safety should be directed to the venue operator",
          "Transportation to/from events is the sole responsibility of each participant",
        ],
      },
      conduct: {
        title: "Code of Conduct & Participant Responsibilities",
        intro: "All participants must:",
        items: [
          "Behave respectfully toward all other participants, Game Masters, and venue staff",
          "Follow all venue rules, university policies, and applicable laws",
          "Not engage in harassment, discrimination, bullying, or threatening behavior",
          "Not bring weapons, illegal substances, or prohibited items to events",
          "Not consume alcohol unless explicitly permitted by venue policy and applicable law",
          "Report any safety concerns, incidents, or rule violations to Club administrators immediately",
          "Take responsibility for their own actions and their consequences",
          "Respect intellectual property rights of game publishers and content creators",
          "Not engage in gambling or exchange of money during games",
        ],
        note: "The Club reserves the right to remove any participant who violates these rules without refund or compensation, and to ban repeat offenders from future events.",
      },
      health: {
        title: "Health, Safety & Medical Disclaimer",
        intro: "Regarding health and safety matters:",
        items: [
          "The Club does not provide medical services, first aid, or emergency response",
          "Participants with medical conditions should take necessary personal precautions",
          "In case of medical emergency, contact venue security or call emergency services directly",
          "The Club is not responsible for any health issues arising during or after events",
          "Participants are responsible for their own medications and medical devices",
          "Events may involve extended sitting periods; participants should take breaks as needed",
          "The Club does not guarantee allergen-free environments or food",
        ],
      },
      intellectual: {
        title: "Intellectual Property & Content",
        intro: "Regarding intellectual property:",
        items: [
          "Game systems, rulesets, and materials used belong to their respective publishers",
          "The Club does not claim ownership of any third-party intellectual property",
          "Participants are responsible for legally obtaining their own game materials",
          "Photos or videos taken at events may be used for Club promotional purposes unless you opt out",
          "Custom content created during games remains the property of its creator",
          "The Club is not responsible for copyright infringement by individual participants",
        ],
      },
      minors: {
        title: "Minors & Parental Consent",
        text: "Events are primarily intended for EMU students (18+). If any event permits minors (under 18), a parent or legal guardian must provide written consent and assumes full responsibility for the minor. The Club does not act as a guardian or supervisor for any participant regardless of age.",
      },
      force: {
        title: "Force Majeure & Event Cancellation",
        text: "The Club reserves the right to cancel, postpone, or modify events due to circumstances beyond its control including but not limited to: natural disasters, weather conditions, public health emergencies, venue unavailability, university directives, civil unrest, or insufficient registration. The Club shall not be liable for any costs, damages, or inconvenience resulting from such cancellations or modifications.",
      },
      disputes: {
        title: "Dispute Resolution & Governing Law",
        text: "Any disputes arising from participation in Club events shall first be addressed through informal negotiation with Club administration. If unresolved, disputes shall be subject to the jurisdiction of the Turkish Republic of Northern Cyprus courts and governed by applicable local laws. By participating, you waive any right to participate in class action lawsuits against the Club.",
      },
      amendments: {
        title: "Amendments & Updates",
        text: "The Club reserves the right to modify this policy at any time. Continued participation in events after policy updates constitutes acceptance of the revised terms. Participants are encouraged to review this policy periodically. Material changes will be announced through official Club communication channels.",
      },
      acceptance: {
        title: "Acceptance of Terms",
        text: "BY REGISTERING FOR OR ATTENDING ANY EMURPG CLUB EVENT, YOU CONFIRM THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO ALL TERMS IN THIS DOCUMENT. YOU ACKNOWLEDGE THAT THIS AGREEMENT CONSTITUTES A LEGALLY BINDING CONTRACT AND THAT YOU ARE WAIVING CERTAIN LEGAL RIGHTS. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT REGISTER FOR OR ATTEND CLUB EVENTS.",
      },
      footer: {
        lastUpdated: "Last updated:",
        contact: "For questions regarding this policy, contact:",
        version: "Document Version:",
      },
    },
    tr: {
      title:
        "EMU RPG Kulübü - Gizlilik Politikası, Katılım Şartları ve Sorumluluk Reddi",
      intro: {
        title: "Giriş ve Kapsam",
        text: "EMU RPG Kulübü (bundan sonra 'Kulüp' olarak anılacaktır) Doğu Akdeniz Üniversitesi (DAÜ) bünyesinde faaliyet gösteren bir öğrenci kuruluşudur. Kulübün tek amacı öğrenciler için masa üstü rol yapma oyunu (TTRPG) ve masa üstü oyun etkinlikleri düzenlemek ve koordine etmektir. Herhangi bir Kulüp etkinliğine kaydolarak veya katılarak, bu Gizlilik Politikasını, Katılım Şartlarını ve Sorumluluk Reddini tamamen okuduğunuzu, anladığınızı ve bunlara bağlı olmayı kabul ettiğinizi beyan etmiş olursunuz.",
      },
      clubRole: {
        title: "Kulübün Rolü ve Sınırlılıkları",
        intro:
          "Kulüp yalnızca etkinliklerin organizatörü ve koordinatörü olarak hizmet vermektedir. Kulüp açıkça aşağıdakileri YAPMAMAKTADIR:",
        items: [
          "Herhangi bir etkinlik mekanına sahip olmak, işletmek veya yönetmek",
          "Güvenlik hizmetleri veya personeli sağlamak",
          "Tıbbi veya acil durum hizmetleri sağlamak",
          "Yiyecek, içecek veya ikram hizmetleri sağlamak",
          "Herhangi bir mekanın güvenliğini garanti etmek",
          "Bireysel katılımcı davranışlarını denetlemek veya kontrol etmek",
          "Etkinliklere ulaşım sağlamak",
          "Katılımcılar için sigorta kapsamı sağlamak",
          "Herhangi bir katılımcı için yasal vasi olarak hareket etmek",
        ],
        note: "Güvenlik, emniyet, acil durum prosedürleri, erişilebilirlik, yangın güvenliği ve tesis koşulları dahil ancak bunlarla sınırlı olmayan tüm mekanla ilgili konular yalnızca mekan sahibinin/işletmecisinin ve/veya Doğu Akdeniz Üniversitesi'nin sorumluluğundadır.",
      },
      collect: {
        title: "Topladığımız Bilgiler",
        intro:
          "Doğu Akdeniz Üniversitesi'nin etkinlik raporlama gereksinimlerine uymak ve etkinlik kayıtlarını yönetmek için aşağıdaki bilgileri topluyoruz:",
        items: [
          "Öğrenci numarası (üniversite kayıt durumunun doğrulanması için)",
          "Üniversitede kayıtlı tam yasal isim",
          "Fakülte/Bölüm bilgisi",
          "Etkinlik katılım ve devam kayıtları",
          "Oyun masası atamaları ve tercihleri",
          "Yalnızca etkinlik iletişimleri için iletişim bilgileri (e-posta)",
        ],
      },
      usage: {
        title: "Bilgilerinizi Nasıl Kullanıyoruz",
        items: [
          "DAÜ Aktivite Merkezi için zorunlu katılım raporları oluşturma",
          "Katılımcı uygunluğunu doğrulama (aktif öğrenci statüsü)",
          "Etkinlik kapasitesi ve masa atamalarını yönetme",
          "Temel etkinlik iletişimlerini gönderme",
          "Üniversite yönetimi için anonimleştirilmiş istatistik raporları oluşturma",
          "Üniversite politikaları ve yasal gerekliliklere uyum sağlama",
        ],
      },
      security: {
        title: "Veri Güvenliği ve Depolama",
        intro: "Bilgilerinizin güvenliği hakkında:",
        items: [
          "Veriler güvenli, şifrelenmiş bulut altyapısında saklanır",
          "Erişim yalnızca yetkili Kulüp yöneticileriyle sınırlıdır",
          "Finansal bilgi, şifre veya hassas kişisel veri toplanmaz",
          "Veriler yalnızca belirtilen amaçlar ve üniversite raporlaması için kullanılır",
          "Üniversite politikası veya yasa gereği dışında verileri üçüncü taraflarla satmaz, takas etmez veya paylaşmayız",
          "Kulüp makul güvenlik önlemleri uygulamakta ancak yetkisiz erişime karşı mutlak güvenlik garanti edememektedir",
        ],
      },
      retention: {
        title: "Veri Saklama ve Silme",
        text: "Kişisel bilgiler yalnızca üniversite raporlama gereksinimlerini karşılamak için gerekli süre boyunca (genellikle bir akademik yıl) saklanır ve sonrasında güvenli bir şekilde silinir. Katılımcılar istedikleri zaman Kulüp yönetimine başvurarak kişisel verilerine erişim, düzeltme veya silme talebinde bulunabilirler. Silme talepleri, üniversite politikası veya yürürlükteki yasa gereği saklama gerekmedikçe yerine getirilecektir.",
      },
      liability: {
        title: "Sorumluluk Sınırlaması ve Risk Kabulü",
        intro:
          "Kulüp etkinliklerine katılarak aşağıdakileri kabul ve beyan edersiniz:",
        items: [
          "Tüm Kulüp etkinliklerine katılım tamamen gönüllüdür ve kendi riskiniz altındadır",
          "Kulüp, yöneticileri, üyeleri, gönüllüleri ve DAÜ, etkinliklere katılımdan kaynaklanan herhangi bir kişisel yaralanma, ölüm, mal hasarı, hırsızlık veya kayıptan sorumlu değildir",
          "Etkinlikler sırasında kendi sağlığınız, güvenliğiniz ve refahınızdan yalnızca siz sorumlusunuz",
          "Mekan mülküne veya ekipmanlarına verdiğiniz herhangi bir hasardan siz sorumlusunuz",
          "Kulüp, katılımcılar arasındaki anlaşmazlık, çatışma veya kavgalardan sorumlu değildir",
          "Kulüp, herhangi bir alerjik reaksiyon, gıda kaynaklı hastalık veya sağlık sorunlarından sorumlu değildir",
          "Kulüp; zar, minyatür, kural kitapları, elektronik cihazlar ve oyun malzemeleri dahil ancak bunlarla sınırlı olmayan kayıp, çalıntı veya hasarlı kişisel eşyalardan sorumlu değildir",
          "Etkinlik katılımıyla ilgili herhangi bir nedenle Kulübe karşı yasal işlem başlatma hakkınızdan feragat edersiniz",
        ],
      },
      thirdParty: {
        title: "Üçüncü Taraf Hizmetleri ve Mekan Sorumluluğu",
        intro: "Üçüncü taraflarla ilgili aşağıdakileri lütfen dikkate alınız:",
        items: [
          "Etkinlik mekanları üçüncü taraflara (DAÜ, özel işletmeler vb.) aittir ve onlar tarafından işletilmektedir",
          "Güvenlik, acil müdahale ve ilk yardım mekan veya üniversite yetkilileri tarafından sağlanmaktadır",
          "Yiyecek ve içecekler, mevcutsa, üçüncü taraf satıcılar veya katılımcıların kendileri tarafından sağlanmaktadır",
          "Kulüp, üçüncü taraf hizmetleri, ürünleri veya tesisleri üzerinde kontrol sahibi değildir ve bunlar için sorumluluk kabul etmemektedir",
          "Mekan koşulları, hizmetler veya güvenlikle ilgili şikayetler mekan işletmecisine yönlendirilmelidir",
          "Etkinliklere ulaşım her katılımcının kendi sorumluluğundadır",
        ],
      },
      conduct: {
        title: "Davranış Kuralları ve Katılımcı Sorumlulukları",
        intro: "Tüm katılımcılar:",
        items: [
          "Tüm diğer katılımcılara, Oyun Yöneticilerine ve mekan personeline saygıyla davranmalıdır",
          "Etkinlik sırasında, öbür katılımcıları rahatsız edecek davranışlardan (izinsiz temas, yüksek sesle konuşma, samimi olmayan fiziksel yakınlık vb.) kaçınmalıdır",
          "Tüm mekan kurallarına, üniversite politikalarına ve yürürlükteki yasalara uymalıdır",
          "Taciz, ayrımcılık, zorbalık veya tehditkar davranışlarda bulunmamalıdır",
          "Etkinliklere silah, yasadışı maddeler veya yasaklı eşyalar getirmemelidir",
          "Mekan politikası ve yürürlükteki yasalar tarafından açıkça izin verilmedikçe alkol tüketmemelidir",
          "Herhangi bir güvenlik endişesi, olay veya kural ihlalini derhal Kulüp yöneticilerine bildirmelidir",
          "Kendi eylemleri ve sonuçlarından sorumlu olmalıdır",
          "Oyun yayıncıları ve içerik üreticilerinin fikri mülkiyet haklarına saygı göstermelidir",
          "Oyunlar sırasında kumar veya para alışverişi yapmamalıdır",
        ],
        note: "Kulüp, bu kuralları ihlal eden herhangi bir katılımcıyı iade veya tazminat olmaksızın uzaklaştırma ve tekrar edenleri gelecekteki etkinliklerden yasaklama hakkını saklı tutar.",
      },
      health: {
        title: "Sağlık, Güvenlik ve Tıbbi Sorumluluk Reddi",
        intro: "Sağlık ve güvenlik konularında:",
        items: [
          "Kulüp tıbbi hizmetler, ilk yardım veya acil müdahale sağlamaz",
          "Tıbbi rahatsızlığı olan katılımcılar gerekli kişisel önlemleri almalıdır",
          "Tıbbi acil durumlarda doğrudan mekan güvenliğine başvurun veya acil servisleri arayın",
          "Kulüp, etkinlikler sırasında veya sonrasında ortaya çıkan herhangi bir sağlık sorunundan sorumlu değildir",
          "Katılımcılar kendi ilaç ve tıbbi cihazlarından sorumludur",
          "Etkinlikler uzun süreli oturma dönemleri içerebilir; katılımcılar gerektiğinde mola almalıdır",
          "Kulüp, alerjen içermeyen ortamlar veya yiyecekler garanti etmemektedir",
        ],
      },
      intellectual: {
        title: "Fikri Mülkiyet ve İçerik",
        intro: "Fikri mülkiyet hakkında:",
        items: [
          "Kullanılan oyun sistemleri, kurallar ve materyaller ilgili yayıncılara aittir",
          "Kulüp, herhangi bir üçüncü taraf fikri mülkiyeti üzerinde hak talep etmemektedir",
          "Katılımcılar kendi oyun materyallerini yasal yollarla edinmekten sorumludur",
          "Etkinliklerde çekilen fotoğraf veya videolar, vazgeçmediğiniz sürece Kulüp tanıtım amaçlı kullanılabilir",
          "Oyunlar sırasında oluşturulan özel içerikler yaratıcısının mülkiyetinde kalır",
          "Kulüp, bireysel katılımcıların telif hakkı ihlallerinden sorumlu değildir",
        ],
      },
      minors: {
        title: "Küçükler ve Ebeveyn Onayı",
        text: "Etkinlikler öncelikle DAÜ öğrencileri (18+) için tasarlanmıştır. Herhangi bir etkinlik küçüklere (18 yaş altı) izin verirse, bir ebeveyn veya yasal vasi yazılı onay vermeli ve küçük için tam sorumluluk üstlenmelidir. Kulüp, yaşından bağımsız olarak herhangi bir katılımcı için vasi veya denetçi olarak hareket etmemektedir.",
      },
      force: {
        title: "Mücbir Sebepler ve Etkinlik İptali",
        text: "Kulüp, kontrolü dışındaki koşullar nedeniyle etkinlikleri iptal etme, erteleme veya değiştirme hakkını saklı tutar; bunlar arasında doğal afetler, hava koşulları, halk sağlığı acil durumları, mekan kullanılamazlığı, üniversite direktifleri, toplumsal olaylar veya yetersiz kayıt sayılabilir. Kulüp, bu tür iptal veya değişikliklerden kaynaklanan herhangi bir maliyet, hasar veya rahatsızlıktan sorumlu değildir.",
      },
      disputes: {
        title: "Uyuşmazlık Çözümü ve Yürürlükteki Hukuk",
        text: "Kulüp etkinliklerine katılımdan kaynaklanan herhangi bir anlaşmazlık önce Kulüp yönetimiyle gayri resmi müzakere yoluyla ele alınacaktır. Çözümlenmezse, anlaşmazlıklar Kuzey Kıbrıs Türk Cumhuriyeti mahkemelerinin yargı yetkisine tabi olacak ve yürürlükteki yerel yasalara göre yönetilecektir. Katılarak, Kulübe karşı toplu davalara katılma hakkınızdan feragat edersiniz.",
      },
      amendments: {
        title: "Değişiklikler ve Güncellemeler",
        text: "Kulüp bu politikayı istediğinde değiştirme hakkını saklı tutar. Politika güncellemelerinden sonra etkinliklere devam eden katılım, revize edilmiş şartların kabulünü oluşturur. Katılımcıların bu politikayı düzenli olarak gözden geçirmeleri önerilir. Önemli değişiklikler resmi Kulüp iletişim kanalları aracılığıyla duyurulacaktır.",
      },
      acceptance: {
        title: "Şartların Kabulü",
        text: "HERHANGİ BİR EMU RPG KULÜBÜ ETKİNLİĞİNE KAYDOLARAK VEYA KATILARAK, BU BELGEDEKİ TÜM ŞARTLARI OKUDUĞUNUZU, ANLADIĞINIZI VE KABUL ETTİĞİNİZİ ONAYLARSINIZ. BU SÖZLEŞMENİN YASAL OLARAK BAĞLAYICI BİR SÖZLEŞME OLDUĞUNU VE BELİRLİ YASAL HAKLARINIZDAN FERAGAT ETTİĞİNİZİ KABUL EDERSİNİZ. BU ŞARTLARI KABUL ETMİYORSANIZ, KULÜP ETKİNLİKLERİNE KAYDOLMAYIN VEYA KATILMAYIN.",
      },
      footer: {
        lastUpdated: "Son güncelleme:",
        contact: "Bu politika hakkında sorularınız için iletişim:",
        version: "Belge Sürümü:",
      },
    },
  };
  const lastUpdateDate = "03/12/2025";
  const documentVersion = "2.0";
  return (
    <div className="min-h-screen bg-medieval-pattern py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Main Content Container */}
        <div className="bg-gray-900 bg-opacity-90 rounded-2xl p-10 shadow-2xl border border-yellow-600/30 backdrop-blur-sm">
          {/* Header with Language Selector */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 text-center">
              {content[language].title}
            </h1>
            <button
              onClick={() => setLanguage(language === "en" ? "tr" : "en")}
              className="bg-black/40 text-yellow-500 border border-yellow-600/20 px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-600/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              {language === "en" ? "Türkçe" : "English"}
            </button>
          </div>

          <div className="w-32 h-1 bg-gradient-to-r from-yellow-600 to-yellow-500 mx-auto rounded-full mb-12" />

          {/* Content Sections */}
          <div className="space-y-8 text-gray-300">
            {/* Introduction Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].intro.title}
                </h2>
                <p className="leading-relaxed">
                  {content[language].intro.text}
                </p>
              </div>
            </section>

            {/* Club Role & Limitations Section - IMPORTANT */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-red-900/20 rounded-xl p-8 border border-red-600/40">
                <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                  {content[language].clubRole.title}
                </h2>
                <p className="mb-6 leading-relaxed font-semibold">
                  {content[language].clubRole.intro}
                </p>
                <ul className="list-none space-y-3 mb-6">
                  {content[language].clubRole.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-yellow-400 italic border-l-4 border-yellow-500 pl-4">
                  {content[language].clubRole.note}
                </p>
              </div>
            </section>

            {/* Liability Section - CRITICAL */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-red-900/20 rounded-xl p-8 border border-red-600/40">
                <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                  {content[language].liability.title}
                </h2>
                <p className="mb-6 leading-relaxed font-semibold">
                  {content[language].liability.intro}
                </p>
                <ul className="list-none space-y-3">
                  {content[language].liability.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Third Party Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-orange-900/20 rounded-xl p-8 border border-orange-600/30">
                <h2 className="text-2xl font-bold text-orange-400 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                  {content[language].thirdParty.title}
                </h2>
                <p className="mb-6 leading-relaxed">
                  {content[language].thirdParty.intro}
                </p>
                <ul className="list-none space-y-3">
                  {content[language].thirdParty.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-2">*</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Code of Conduct Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-blue-900/20 rounded-xl p-8 border border-blue-600/30">
                <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  {content[language].conduct.title}
                </h2>
                <p className="mb-6 leading-relaxed">
                  {content[language].conduct.intro}
                </p>
                <ul className="list-none space-y-3 mb-6">
                  {content[language].conduct.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">*</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-yellow-400 italic border-l-4 border-yellow-500 pl-4">
                  {content[language].conduct.note}
                </p>
              </div>
            </section>

            {/* Health & Medical Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-purple-900/20 rounded-xl p-8 border border-purple-600/30">
                <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                  {content[language].health.title}
                </h2>
                <p className="mb-6 leading-relaxed">
                  {content[language].health.intro}
                </p>
                <ul className="list-none space-y-3">
                  {content[language].health.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-400 mr-2">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
                      <span className="text-yellow-500 mr-2">*</span>
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
                      <span className="text-yellow-500 mr-2">*</span>
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
                      <span className="text-yellow-500 mr-2">*</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Data Retention Section */}
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

            {/* Intellectual Property Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].intellectual.title}
                </h2>
                <p className="mb-6 leading-relaxed">
                  {content[language].intellectual.intro}
                </p>
                <ul className="list-none space-y-3">
                  {content[language].intellectual.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">*</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Minors Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].minors.title}
                </h2>
                <p className="leading-relaxed">
                  {content[language].minors.text}
                </p>
              </div>
            </section>

            {/* Force Majeure Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].force.title}
                </h2>
                <p className="leading-relaxed">
                  {content[language].force.text}
                </p>
              </div>
            </section>

            {/* Dispute Resolution Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].disputes.title}
                </h2>
                <p className="leading-relaxed">
                  {content[language].disputes.text}
                </p>
              </div>
            </section>

            {/* Amendments Section */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-black/40 rounded-xl p-8 border border-yellow-600/20">
                <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  {content[language].amendments.title}
                </h2>
                <p className="leading-relaxed">
                  {content[language].amendments.text}
                </p>
              </div>
            </section>

            {/* Acceptance Section - FINAL IMPORTANT */}
            <section className="transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-green-900/30 rounded-xl p-8 border-2 border-green-600/50">
                <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  {content[language].acceptance.title}
                </h2>
                <p className="leading-relaxed font-semibold text-green-200">
                  {content[language].acceptance.text}
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-yellow-600/30 text-gray-400 text-center">
            <p className="text-sm">
              {content[language].footer.version} {documentVersion}
            </p>
            <p className="text-sm mt-2">
              {content[language].footer.lastUpdated} {lastUpdateDate}
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
