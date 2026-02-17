/**
 * Mock data for the Emucon Demo page.
 * Mirrors the shape returned by GET /api/emucon/corners so the Live board
 * can render without a running backend.
 */

const emuconMockCorners = {
  entertainment: {
    id: "entertainment",
    nameEn: "Entertainment Corner",
    nameTr: "Eğlence Köşesi",
    cornerType: "entertainment",
    clubs: {
      club_gaming: {
        id: "club_gaming",
        nameEn: "EMU Gaming Society",
        nameTr: "DAÜ Oyun Topluluğu",
        events: {
          scheduled: [
            {
              id: "ev_1",
              nameEn: "Super Smash Bros Tournament",
              nameTr: "Super Smash Bros Turnuvası",
              description: "Open bracket – bring your own controller!",
              time: "10:00",
              startTime: "10:00",
              status: "completed",
              participantCount: 32,
            },
            {
              id: "ev_2",
              nameEn: "Mario Kart Showdown",
              nameTr: "Mario Kart Yarışması",
              description: "4-player Grand Prix, best of 3 cups",
              time: "13:00",
              startTime: "13:00",
              status: "live",
              participantCount: 16,
            },
            {
              id: "ev_3",
              nameEn: "Retro Arcade Free Play",
              nameTr: "Retro Arcade Serbest Oyun",
              description: "Classic cabinet games open to everyone",
              time: "16:00",
              startTime: "16:00",
              status: "upcoming",
              participantCount: 0,
            },
          ],
          continuous: [
            {
              id: "ev_4",
              nameEn: "Board Games Lounge",
              nameTr: "Kutu Oyunları Salonu",
              description: "Drop-in tabletop gaming area",
              time: "All Day",
              status: "live",
              participantCount: 12,
            },
          ],
          standTime: [],
        },
      },
      club_cosplay: {
        id: "club_cosplay",
        nameEn: "Cosplay & Fandom Club",
        nameTr: "Cosplay & Fandom Kulübü",
        events: {
          scheduled: [
            {
              id: "ev_5",
              nameEn: "Cosplay Contest",
              nameTr: "Cosplay Yarışması",
              description: "Best costume wins a grand prize",
              time: "14:30",
              startTime: "14:30",
              status: "upcoming",
              participantCount: 8,
            },
          ],
          continuous: [],
          standTime: [
            {
              id: "ev_6",
              nameEn: "Photo Booth & Props",
              nameTr: "Fotoğraf Köşesi & Aksesuarlar",
              description: "Strike a pose with themed backdrops",
              time: "All Day",
              status: "live",
              participantCount: 0,
            },
          ],
        },
      },
    },
  },
  artAndCreativity: {
    id: "artAndCreativity",
    nameEn: "Art & Creativity Corner",
    nameTr: "Sanat & Yaratıcılık Köşesi",
    cornerType: "artAndCreativity",
    clubs: {
      club_art: {
        id: "club_art",
        nameEn: "Fine Arts Society",
        nameTr: "Güzel Sanatlar Topluluğu",
        events: {
          scheduled: [
            {
              id: "ev_7",
              nameEn: "Live Mural Painting",
              nameTr: "Canlı Duvar Resmi Boyama",
              description: "Artists collaborate on a massive mural",
              time: "11:00",
              startTime: "11:00",
              status: "live",
              participantCount: 5,
            },
            {
              id: "ev_8",
              nameEn: "Caricature Booth",
              nameTr: "Karikatür Standı",
              description: "Get a free caricature drawn by our artists",
              time: "09:30",
              startTime: "09:30",
              status: "completed",
              participantCount: 22,
            },
          ],
          continuous: [
            {
              id: "ev_9",
              nameEn: "Interactive Art Wall",
              nameTr: "İnteraktif Sanat Duvarı",
              description: "Add your touch to the community canvas",
              time: "All Day",
              status: "live",
              participantCount: 40,
            },
          ],
          standTime: [],
        },
      },
      club_music: {
        id: "club_music",
        nameEn: "Music Club",
        nameTr: "Müzik Kulübü",
        events: {
          scheduled: [
            {
              id: "ev_10",
              nameEn: "Open Mic Session",
              nameTr: "Açık Mikrofon Oturumu",
              description: "Sing, play, or recite – the stage is yours",
              time: "15:00",
              startTime: "15:00",
              status: "upcoming",
              participantCount: 10,
            },
            {
              id: "ev_11",
              nameEn: "DJ Workshop",
              nameTr: "DJ Atölyesi",
              description: "Learn the basics of mixing and scratching",
              time: "12:00",
              startTime: "12:00",
              status: "completed",
              participantCount: 14,
            },
          ],
          continuous: [],
          standTime: [],
        },
      },
    },
  },
  techAndScience: {
    id: "techAndScience",
    nameEn: "Tech & Science Corner",
    nameTr: "Teknoloji & Bilim Köşesi",
    cornerType: "techAndScience",
    clubs: {
      club_robotics: {
        id: "club_robotics",
        nameEn: "Robotics Club",
        nameTr: "Robotik Kulübü",
        events: {
          scheduled: [
            {
              id: "ev_12",
              nameEn: "Robot Sumo Battle",
              nameTr: "Robot Sumo Savaşı",
              description: "Autonomous robots compete in the ring",
              time: "11:30",
              startTime: "11:30",
              status: "live",
              participantCount: 6,
            },
            {
              id: "ev_13",
              nameEn: "Drone Racing",
              nameTr: "Drone Yarışı",
              description: "FPV racing through an indoor obstacle course",
              time: "15:30",
              startTime: "15:30",
              status: "upcoming",
              participantCount: 4,
            },
          ],
          continuous: [
            {
              id: "ev_14",
              nameEn: "3D Printing Demo",
              nameTr: "3D Baskı Gösterimi",
              description: "Watch models come to life layer by layer",
              time: "All Day",
              status: "live",
              participantCount: 0,
            },
          ],
          standTime: [],
        },
      },
      club_ai: {
        id: "club_ai",
        nameEn: "AI & Data Science Society",
        nameTr: "YZ & Veri Bilimi Topluluğu",
        events: {
          scheduled: [
            {
              id: "ev_15",
              nameEn: "ChatBot Live Demo",
              nameTr: "ChatBot Canlı Demo",
              description: "See our custom LLM agent in action",
              time: "13:30",
              startTime: "13:30",
              status: "upcoming",
              participantCount: 0,
            },
            {
              id: "ev_16",
              nameEn: "Intro to Machine Learning",
              nameTr: "Makine Öğrenimine Giriş",
              description: "Beginner-friendly hands-on workshop",
              time: "10:30",
              startTime: "10:30",
              status: "completed",
              participantCount: 28,
            },
          ],
          continuous: [],
          standTime: [
            {
              id: "ev_17",
              nameEn: "AI Art Generator",
              nameTr: "YZ Sanat Üreteci",
              description: "Generate art with AI – take home a printout",
              time: "All Day",
              status: "live",
              participantCount: 0,
            },
          ],
        },
      },
    },
  },
};

/**
 * Mock participants list (used when clicking on an event's participant count).
 */
const emuconMockParticipants = [
  { id: "p1", name: "Ahmet Yılmaz" },
  { id: "p2", name: "Elif Kaya" },
  { id: "p3", name: "John Smith" },
  { id: "p4", name: "Maria Garcia" },
  { id: "p5", name: "Kemal Demir" },
  { id: "p6", name: "Sophie Chen" },
  { id: "p7", name: "Baran Oral" },
  { id: "p8", name: "Fatma Aksoy" },
];

export { emuconMockCorners, emuconMockParticipants };
