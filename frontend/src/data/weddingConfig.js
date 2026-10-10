/**
 * WEDDING CONFIGURATION & DUMMY DATA
 * Based on PRD Sections 10, 11, 12, 13, 14, 15, 16, 17, 18, 37
 *
 * Neutral dummy identity: Raka & Alya
 */

export const weddingConfig = {
  slug: "raka-alya",
  title: "The Wedding of Raka & Alya",
  dateDisplay: "20 . 06 . 2027",
  dateFull: "Minggu, 20 Juni 2027",
  initialsGroom: "R",
  initialsBride: "A",

  // Photos
  heroPhoto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
  coverPhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  closingPhoto: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85",

  // Audio configuration
  music: {
    title: "Instrumental Romantic Wedding",
    url: "/audio/wedding.mp3",
  },

  // Groom Details (PRD Section 11)
  groom: {
    shortName: "Raka",
    fullName: "Raka Pratama, S.T.",
    familyLabel: "Putra pertama dari",
    father: "Bapak H. Bambang Sudiro",
    mother: "Ibu Hj. Sri Wahyuni",
    instagram: "rakapratama",
    instagramUrl: "https://instagram.com/rakapratama",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
  },

  // Bride Details (PRD Section 11)
  bride: {
    shortName: "Alya",
    fullName: "dr. Alya Putri Anandita",
    familyLabel: "Putri kedua dari",
    father: "Bapak Drs. H. Suryo Pranoto",
    mother: "Ibu Hj. Endang Rahayu",
    instagram: "alyaputri",
    instagramUrl: "https://instagram.com/alyaputri",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
  },

  // Quote / We Found Love (PRD Section 10)
  quote: {
    title: "We Found Love",
    text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.",
    source: "QS Ar-Rum : 21",
  },

  // Intro paragraph for couple section (PRD Section 11)
  invitationIntro:
    "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:",

  // Events (PRD Section 13)
  events: [
    {
      id: "event-akad",
      type: "Akad Nikah",
      date: "2027-06-20",
      dateLabel: "Minggu, 20 Juni 2027",
      startTime: "08.00",
      endTimeLabel: "10.00 WIB",
      timezone: "Asia/Jakarta",
      venue: "Masjid Raya Baiturrahman",
      address:
        "Jl. Khatib Sulaiman No. 88, Padang Utara, Kota Padang, Sumatera Barat",
      mapsUrl: "https://maps.google.com/?q=Padang+Sumatera+Barat",
    },
    {
      id: "event-resepsi",
      type: "Resepsi Pernikahan",
      date: "2027-06-20",
      dateLabel: "Minggu, 20 Juni 2027",
      startTime: "11.00",
      endTimeLabel: "16.00 WIB",
      timezone: "Asia/Jakarta",
      venue: "Grand Ballroom Balai Gadang",
      address:
        "Jl. Jenderal Sudirman No. 45, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat",
      mapsUrl: "https://maps.google.com/?q=Padang+Sumatera+Barat",
    },
  ],

  // Countdown (PRD Section 12)
  countdown: {
    // Setting target date in the future for realtime testing
    targetDateTime: "2027-06-20T08:00:00+07:00",
    timezone: "Asia/Jakarta",
    completedMessage: "Alhamdulillah, Acara Telah Berlangsung",
  },

  // Our Story (PRD Section 14)
  stories: [
    {
      id: 1,
      title: "Awal Bertemu",
      dateLabel: "14 Februari 2021",
      body: "Pertama kali kami saling mengenal di bangku perkuliahan. Dari perbincangan sederhana mengenai tugas dan kesamaan hobi, ikatan persahabatan kami perlahan mulai bertumbuh menjadi kedekatan yang istimewa.",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 2,
      title: "Lamaran",
      dateLabel: "18 Oktober 2026",
      body: "Setelah bertahun-tahun saling mengenal dan saling mendukung dalam suka maupun duka, dengan niat suci serta restu kedua keluarga tercinta, kami memutuskan untuk mengikat komitmen dalam prosesi lamaran yang khidmat.",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 3,
      title: "Menuju Halal",
      dateLabel: "20 Juni 2027",
      body: "Hari yang penuh doa dan harapan, saat kami mengikrarkan janji suci di hadapan Allah SWT dan disaksikan orang-orang tercinta untuk bersama mengarungi samudera rumah tangga yang sakinah, mawaddah, warahmah.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  // Gallery (PRD Section 15)
  gallery: [
    {
      id: "gal-1",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
      alt: "Foto Prewedding Raka & Alya 1",
      width: 1200,
      height: 1600,
      objectPosition: "50% 50%",
      aspectRatio: "3/4",
    },
    {
      id: "gal-2",
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
      alt: "Foto Prewedding Raka & Alya 2",
      width: 1200,
      height: 1600,
      objectPosition: "50% 50%",
      aspectRatio: "3/4",
    },
    {
      id: "gal-3",
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85",
      alt: "Foto Prewedding Raka & Alya 3",
      width: 1600,
      height: 1066,
      objectPosition: "50% 50%",
      aspectRatio: "16/9",
    },
    {
      id: "gal-4",
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=85",
      alt: "Foto Prewedding Raka & Alya 4",
      width: 1200,
      height: 1600,
      objectPosition: "50% 50%",
      aspectRatio: "3/4",
    },
  ],

  // Wedding Gift (PRD Section 16)
  gifts: [
    {
      id: "gift-1",
      type: "bank",
      provider: "MANDIRI",
      holder: "Raka Pratama",
      number: "1110012345678",
      logo: "/images/bank-mandiri.svg",
    },
    {
      id: "gift-2",
      type: "bank",
      provider: "BCA",
      holder: "dr. Alya Putri Anandita",
      number: "8720192831",
      logo: "/images/bank-bca.svg",
    },
    {
      id: "gift-3",
      type: "ewallet",
      provider: "DANA",
      holder: "Alya Putri",
      number: "081234567890",
      logo: "/images/dana.svg",
    },
  ],

  // Shipping Address for Physical Gift (PRD Section 17)
  giftShipping: {
    recipient: "Raka Pratama & Alya Putri",
    phone: "0812-3456-7890",
    address:
      "Jl. Mawar Indah No. 45, RT 02 / RW 05, Kel. Flamboyan Baru, Kec. Padang Barat, Kota Padang, Sumatera Barat 25114",
  },

  // RSVP / Wishes Initial Mock Data (PRD Section 18 & 19)
  wishesStats: {
    total: 21,
    hadir: 14,
    tidakHadir: 4,
    ragu: 3,
  },
  initialWishes: [
    {
      id: "w-1",
      name: "Drs. H. Mulyadi & Keluarga",
      attendance: "hadir",
      message:
        "Barakallahu lakum wa baraka alaikum wa jama'a bainakuma fii khair. Selamat menempuh hidup baru untuk Raka dan Alya.",
      createdAt: "10 menit yang lalu",
    },
  ],

  // Closing Section (PRD Section 20)
  closing: {
    message:
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
    gratitude: "Kami yang berbahagia,",
  },

  // Footer (PRD Section 21)
  footer: {
    brand: "Undangan Digital Eksklusif",
    tagline: "Dibuat dengan penuh cinta untuk Raka & Alya",
    year: 2027,
  },
};
