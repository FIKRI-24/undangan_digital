# PRD MASTER — UNDANGAN DIGITAL PERNIKAHAN
**Versi:** 1.0  
**Status:** Ready for AI Agent Implementation  
**Referensi visual utama:** https://undangandigitalhbkomp.com/widya-rian/?to=Fikri%20arahman%20dan%20partner  
**Target:** Membuat undangan digital baru dengan struktur, feel, alur, proporsi visual, komponen, dan interaksi yang sangat dekat dengan referensi, tetapi memakai identitas, foto, teks, rekening, musik, dan aset milik proyek sendiri.  
**Platform:** Web responsive, mobile-first  
**Stack yang direkomendasikan:** React + Vite, Node.js + Express, PostgreSQL  
**Bahasa UI:** Indonesia  

> CATATAN PENTING UNTUK AI AGENT:
> - Referensi digunakan sebagai acuan UI/UX, layout, ritme visual, section, animasi, dan interaksi.
> - Jangan menyalin foto pasangan, logo vendor, nomor rekening, alamat, cerita pribadi, musik, atau aset berhak cipta dari halaman referensi.
> - Semua konten pribadi harus berasal dari data proyek sendiri.
> - Nilai HEX dalam PRD adalah target visual yang sangat dekat berdasarkan karakter visual halaman referensi, bukan klaim CSS asli situs referensi.
> - Fokus pertama: mobile 360–430 px. Desktop merupakan perluasan dari desain mobile, bukan sebaliknya.

---

# 1. RINGKASAN PRODUK

Produk adalah website undangan pernikahan digital satu halaman yang dibuka dari link personal tamu.

Contoh URL:

```text
https://domain.com/fikri-nesya?to=Budi%20dan%20Partner
```

Parameter `to` dibaca oleh frontend dan ditampilkan pada cover:

```text
Kepada Yth.
Budi dan Partner
```

Tamu tidak perlu login.

Alur utama:

```text
Link WhatsApp
→ Cover Invitation
→ Open Invitation
→ Musik mulai
→ Hero Wedding
→ Quote / We Found Love
→ Groom & Bride
→ Save The Date
→ Countdown
→ Informasi Resepsi / Acara
→ Google Maps
→ Our Story
→ Our Gallery
→ Wedding Gift
→ Kirim Kado
→ Best Wish / RSVP
→ Daftar Ucapan
→ Closing
→ Footer
```

---

# 2. TUJUAN PRODUK

1. Menghasilkan undangan digital yang terasa premium, romantis, tradisional-modern, dan nyaman dibuka di HP.
2. Meniru pola interaksi dan struktur visual referensi sedekat mungkin.
3. Mendukung personalisasi nama tamu dari URL.
4. Mendukung musik setelah interaksi Open Invitation.
5. Mendukung countdown realtime.
6. Mendukung informasi lokasi dan tombol Maps.
7. Mendukung galeri foto.
8. Mendukung wedding gift dan copy rekening/alamat.
9. Mendukung RSVP dan ucapan tamu.
10. Menyimpan RSVP/wishes ke PostgreSQL.
11. Struktur kode harus reusable untuk dikembangkan menjadi multi-wedding dan multi-template.

---

# 3. TARGET PENGGUNA

## 3.1 Tamu Undangan
Dapat:
- membuka link tanpa login;
- melihat nama dirinya pada cover;
- membuka undangan;
- mendengar / pause musik;
- melihat profil pasangan;
- melihat tanggal, waktu, lokasi;
- membuka Maps;
- melihat story dan galeri;
- menyalin rekening;
- menyalin alamat hadiah;
- mengirim RSVP;
- mengirim ucapan;
- melihat daftar ucapan.

## 3.2 Pemilik Undangan
Versi awal belum memerlukan dashboard penuh. Data dapat berasal dari backend / seed / JSON konfigurasi.

Versi berikutnya dapat memiliki dashboard untuk:
- identitas pasangan;
- acara;
- galeri;
- musik;
- tamu;
- gift;
- RSVP;
- wishes;
- template.

---

# 4. HASIL MAPPING REFERENSI

Halaman referensi yang dianalisis memiliki urutan/fitur berikut:

1. Cover “Wedding Invitation”.
2. Nama pasangan.
3. Sapaan “Kepada Yth.” dan nama tamu.
4. Tombol “OPEN INVITATION”.
5. Hero “THE WEDDING OF”.
6. Nama pasangan + tanggal format visual `DD . MM . YYYY`.
7. Monogram/inisial pasangan.
8. Section “We Found Love”.
9. Quote/ayat pernikahan.
10. Section “Groom & Bride”.
11. Pengantar undangan.
12. Foto mempelai pria.
13. Nama lengkap mempelai pria.
14. Informasi orang tua mempelai pria.
15. Instagram mempelai pria.
16. Simbol `&` pemisah.
17. Foto mempelai wanita.
18. Nama lengkap mempelai wanita.
19. Informasi orang tua mempelai wanita.
20. Instagram mempelai wanita.
21. Section “Save The Date”.
22. Countdown Days / Hours / Minutes / Seconds.
23. Section acara “Resepsi”.
24. Hari/tanggal.
25. Jam.
26. Nama venue.
27. Alamat venue.
28. Tombol Google Maps.
29. Section “Our Story”.
30. Tahap “Awal Bertemu”.
31. Tahap “Lamaran”.
32. Tahap “Menikah”.
33. Section “Our Gallery”.
34. Section “Wedding Gift”.
35. Paragraf pengantar hadiah.
36. Card rekening bank pertama.
37. Tombol Salin Rekening.
38. Card rekening bank kedua.
39. Tombol Salin Rekening.
40. Card e-wallet.
41. Tombol Salin Rekening/nomor.
42. Card alamat kirim kado.
43. Tombol Salin Alamat.
44. Section “Best Wish”.
45. Penjelasan ucapan + konfirmasi kehadiran.
46. Jumlah comments.
47. Ringkasan Hadir.
48. Ringkasan Tidak Hadir.
49. Ringkasan Masih Ragu.
50. Form nama.
51. Select status kehadiran.
52. Field ucapan.
53. Submit wish/RSVP.
54. Daftar ucapan.
55. Closing message.
56. Nama pasangan.
57. Footer copyright/vendor.
58. Tombol/pengendali musik mengambang.
59. Ornamen dekoratif floral/Minang pada beberapa section.
60. Layout dominan vertikal, one-page, mobile-first.

---

# 5. ARAH VISUAL

## 5.1 Style Keywords

```text
Modern Minang
Romantic
Elegant
Warm
Traditional
Premium
Soft Luxury
Editorial Wedding
Mobile Invitation
```

## 5.2 Karakter Referensi

- foto pasangan tradisional dengan warna hitam, emas, merah;
- floral merah tua, dusty pink, cream, hijau;
- background terang/cream;
- aksen burgundy/maroon;
- aksen emas;
- heading bergaya serif/script;
- whitespace cukup luas;
- dekorasi ornamental ditempatkan di tepi section;
- konten utama berada di kolom sempit seperti layar smartphone;
- banyak elemen center-aligned;
- animasi masuk saat scroll;
- kartu dan tombol menggunakan bentuk lembut/rounded.

---

# 6. DESIGN TOKENS

## 6.1 Warna

Gunakan token berikut sebagai target dasar:

```css
:root {
  --wine-900: #5E171B;
  --wine-800: #711D22;
  --wine-700: #7A2025;
  --burgundy-600: #922F35;

  --dusty-rose-500: #C98782;
  --dusty-rose-300: #D9A9A3;
  --rose-soft-200: #E8C4BD;

  --cream-100: #F8F2EA;
  --ivory-50: #FFFDF8;
  --paper: #FBF7F1;

  --gold-600: #B88A3D;
  --gold-500: #C7A15A;
  --gold-300: #E1C98E;

  --charcoal-900: #25201E;
  --black-soft: #161413;
  --muted: #756B66;

  --white: #FFFFFF;
}
```

### Pemakaian
- body utama: `--cream-100` / `--paper`;
- section terang: `--ivory-50`;
- heading: `--wine-700`;
- body text: `--charcoal-900`;
- muted text: `--muted`;
- primary button: burgundy + white;
- garis/divider: gold;
- card rekening: burgundy / charcoal / ivory tergantung bank;
- icon accent: gold / wine.

## 6.2 Typography

Rekomendasi:
- **Couple/script:** `Great Vibes` atau `Allura`;
- **Heading serif:** `Cormorant Garamond`;
- **Body sans:** `Poppins` atau `Montserrat`.

Font hierarchy:

```css
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 22px;
--title-sm: 28px;
--title-md: 36px;
--title-lg: 48px;
--script-mobile: 52px;
--script-desktop: 76px;
```

Line height body: `1.6–1.8`.

## 6.3 Spacing

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px
```

Section mobile:
```css
padding: 64px 20px;
```

Section desktop:
```css
padding: 88px 24px;
```

## 6.4 Container

```css
.invitation-shell {
  width: 100%;
  max-width: 480px;
  margin-inline: auto;
  min-height: 100vh;
  position: relative;
  overflow: clip;
}
```

Desktop:
- konten undangan tetap max-width 480–540 px;
- sisi kiri/kanan dapat diberi background dekoratif atau warna neutral;
- pengalaman harus tetap terasa seperti undangan mobile.

## 6.5 Radius

```text
button pill: 999px
card besar: 20–28px
card kecil: 14–18px
image portrait: 22–32px atau ornamental mask
```

## 6.6 Shadow

```css
box-shadow: 0 12px 34px rgba(45, 24, 20, 0.10);
```

Jangan gunakan shadow hitam terlalu keras.

---

# 7. RESPONSIVE TARGET

Prioritas pengujian:

```text
360 × 800
375 × 812
390 × 844
393 × 873
412 × 915
430 × 932
768 × 1024
1366 × 768
1440 × 900
```

Wajib:
- tidak ada horizontal scroll;
- nama pasangan tidak keluar viewport;
- tombol minimal tinggi 44px;
- foto tidak gepeng;
- object-position dapat dikonfigurasi per foto;
- section tetap terbaca pada layar kecil;
- fixed controls tidak menutupi RSVP button.

---

# 8. UI-01 — INVITATION COVER

## Tujuan
Membuat first impression sebelum isi undangan dapat di-scroll.

## Layout
Fullscreen fixed overlay:

```text
[background photo pasangan]

Wedding Invitation

Rian & Widya / {{groom_short}} & {{bride_short}}

Kepada Yth.

{{guest_name}}

[ OPEN INVITATION ]
```

## Required elements
- background photo fullscreen;
- dark/soft overlay agar teks terbaca;
- title kecil “Wedding Invitation”;
- nama pasangan script;
- label “Kepada Yth.”;
- guest name dinamis;
- button Open Invitation.

## Behaviour
Sebelum dibuka:
- `body` locked;
- halaman tidak dapat scroll;
- audio belum mulai;
- cover berada di atas seluruh UI.

Saat button diklik:
1. disable button sementara;
2. jalankan transition cover;
3. unlock body;
4. `audio.play()`;
5. scroll posisi tetap di atas hero;
6. tampilkan floating music control.

## Transition
Target:
```text
opacity 1 → 0
scale 1 → 1.03
translateY 0 → -4%
duration 1000–1400ms
ease-out
```

## Acceptance
- guest name dari query param tampil benar;
- fallback jika kosong: “Bapak/Ibu/Saudara/i”;
- karakter `%20`, `+`, unicode harus terdecode;
- refresh membuka cover kembali kecuali nanti ditambahkan session preference.

---

# 9. UI-02 — HERO WEDDING

## Isi
```text
THE WEDDING OF
{{groom_short}} & {{bride_short}}
{{DD}} . {{MM}} . {{YYYY}}
{{groom_initial}}
{{bride_initial}}
```

## Visual
- hero mendekati 100svh;
- foto pasangan dominan;
- overlay gradient;
- teks center;
- inisial dapat disusun dekoratif;
- nama pasangan paling dominan.

## Background
`background-size: cover;`
`background-position` configurable dari data.

## Animation
- label fade-up;
- nama script fade/scale;
- date fade-up delay;
- monogram subtle scale.

---

# 10. UI-03 — WE FOUND LOVE / QUOTE

## Isi
- heading “We Found Love”;
- quote/ayat pernikahan;
- sumber ayat/quote;
- optional floral ornament.

Referensi menggunakan QS Ar-Rum: 21.

## Layout
- center aligned;
- body quote tidak terlalu lebar;
- whitespace besar;
- floral dapat masuk dari sudut kanan/kiri.

## Data
```json
{
  "title": "We Found Love",
  "quote": "...",
  "source": "QS Ar-Rum : 21"
}
```

---

# 11. UI-04 — GROOM & BRIDE

## Header
```text
Groom & Bride

Assalamualaikum Wr. Wb.

{{invitation_intro}}
```

## Groom block
```text
[portrait groom]

{{groom_full_name}}

Putra {{birth_order_label}} dari

{{groom_father}}
&
{{groom_mother}}

[Instagram]
```

## Separator
Script/serif ampersand besar:
```text
&
```

## Bride block
Sama seperti groom.

## Visual
- portrait besar;
- frame lembut atau ornamental;
- nama full serif/script;
- parental info body sans;
- Instagram berupa icon + username.

## Data
```json
{
  "groom": {
    "full_name": "",
    "short_name": "",
    "father": "",
    "mother": "",
    "family_label": "",
    "instagram": "",
    "photo": ""
  },
  "bride": {
    "full_name": "",
    "short_name": "",
    "father": "",
    "mother": "",
    "family_label": "",
    "instagram": "",
    "photo": ""
  }
}
```

---

# 12. UI-05 — SAVE THE DATE + COUNTDOWN

## Header
```text
Save The Date
```

## Countdown
Empat unit:
- Days
- Hours
- Minutes
- Seconds

Data dihitung realtime dari `event_datetime`.

## Mobile layout
Pilihan utama:
```text
[ DAYS ] [ HOURS ]
[ MIN  ] [ SEC   ]
```

Pada width yang cukup:
```text
[ DAYS ][ HOURS ][ MINUTES ][ SECONDS ]
```

## Timer rules
- update 1 detik;
- menggunakan timezone event;
- jika waktu sudah lewat tampilkan `00`;
- optional state “Acara telah berlangsung”.

## Accessibility
Gunakan `aria-live="off"` agar pembaruan setiap detik tidak mengganggu screen reader.

---

# 13. UI-06 — EVENT INFORMATION

Referensi utama menunjukkan section Resepsi dengan:
- hari/tanggal;
- jam;
- venue;
- alamat;
- Google Maps.

Sistem dibuat generik agar mendukung:
- akad;
- resepsi;
- acara tambahan.

## Event Card
```text
RESEPSI

Sabtu, 20 Juni 2026

11.00 WIB s/d Selesai

Pondok Biru

Alamat lengkap...

[ GOOGLE MAPS ]
```

## Icons
- calendar;
- clock;
- map pin.

## Button
Primary / outline burgundy-gold.

## Data
```json
{
  "events": [
    {
      "type": "Resepsi",
      "date": "2026-06-20",
      "start_time": "11:00",
      "end_time_label": "Selesai",
      "timezone": "Asia/Jakarta",
      "venue": "",
      "address": "",
      "maps_url": ""
    }
  ]
}
```

---

# 14. UI-07 — OUR STORY

Referensi memiliki tiga tahap:
1. Awal Bertemu
2. Lamaran
3. Menikah

## Layout
Timeline vertikal, card per cerita.

```text
OUR STORY

● Awal Bertemu
  {{date / period}}
  {{story}}

│

● Lamaran
  {{date / period}}
  {{story}}

│

● Menikah
  {{date / period}}
  {{story}}
```

## Visual
- alternating decorative cards optional;
- foto dapat ditempatkan pada satu atau beberapa tahap;
- line timeline gold/burgundy;
- node bulat;
- heading serif;
- story body 14–16px.

## Animation
Setiap node fade-up saat masuk viewport.

## Data
```json
{
  "stories": [
    {
      "title": "Awal Bertemu",
      "date_label": "",
      "body": "",
      "image": null
    }
  ]
}
```

---

# 15. UI-08 — OUR GALLERY

## Header
```text
Our Gallery
```

## Layout
Masonry-look / editorial grid:
- dua portrait kecil;
- satu landscape/full-width;
- kombinasi 2-column;
- jangan membuat grid monoton.

## Requirements
- 10–20 foto ideal;
- lazy loading;
- responsive;
- object-cover;
- image aspect ratio disimpan untuk mengurangi layout shift.

## Lightbox
Klik foto membuka modal:
- close;
- previous;
- next;
- keyboard ESC;
- swipe mobile optional;
- image counter optional.

## Data
```json
{
  "gallery": [
    {
      "src": "",
      "alt": "",
      "width": 1200,
      "height": 1600,
      "object_position": "50% 50%"
    }
  ]
}
```

---

# 16. UI-09 — WEDDING GIFT

## Header
```text
Wedding Gift
```

## Intro
Paragraf singkat bahwa doa/restu adalah hadiah utama dan hadiah cashless opsional.

## Gift Card Bank
```text
[LOGO BANK]

[chip decorative]

{{account_holder}}
{{account_number}}

[ SALIN REKENING ]
```

## E-wallet Card
Sama, tetapi label dapat DANA/OVO/GoPay/dll.

## Copy behaviour
Saat diklik:
```text
Salin Rekening
→ ✓ Berhasil disalin
→ kembali setelah 2 detik
```

Gunakan Clipboard API dengan fallback.

## Data
```json
{
  "gifts": [
    {
      "type": "bank",
      "provider": "MANDIRI",
      "holder": "",
      "number": "",
      "logo": ""
    },
    {
      "type": "ewallet",
      "provider": "DANA",
      "holder": "",
      "number": "",
      "logo": ""
    }
  ]
}
```

---

# 17. UI-10 — KIRIM KADO / ALAMAT HADIAH

## Card
```text
KIRIM KADO

{{couple_name}}

{{shipping_address}}

[ SALIN ALAMAT ]
```

## Copy state
Toast:
```text
Alamat berhasil disalin
```

## Data
```json
{
  "gift_shipping": {
    "recipient": "",
    "address": ""
  }
}
```

---

# 18. UI-11 — BEST WISH / RSVP

## Header
```text
Best Wish
```

Subtext:
```text
Sapa dan kirim ucapan beserta doa terbaik, sembari konfirmasi kehadiran.
```

## Stats
Tampilkan:
- total comments;
- Hadir;
- Tidak Hadir;
- Masih Ragu.

Contoh layout:
```text
21 Comments

[ 7 Hadir ] [ 4 Tidak Hadir ] [ 1 Masih Ragu ]
```

## Form
Field:
1. Nama
2. Konfirmasi Kehadiran
3. Ucapan
4. Submit

Status:
```text
hadir
tidak_hadir
ragu
```

## Optional
- jumlah tamu;
- guest code hidden;
- wedding_id hidden.

## Validation
- nama min 2 karakter;
- nama max 100;
- wish max 1000;
- attendance required;
- trim whitespace;
- sanitize output;
- rate limit backend.

## Success
- form reset;
- toast success;
- stats refresh;
- wish baru muncul tanpa full reload.

---

# 19. UI-12 — WISH LIST

## Card
```text
{{name}}

{{attendance_badge}}

{{message}}

{{relative_time}}
```

## Badge
- Hadir;
- Tidak Hadir;
- Masih Ragu.

Jangan gunakan warna neon.

## Pagination
- load awal 10;
- button “Muat Lebih Banyak”;
- endpoint pagination.

## Empty state
```text
Belum ada ucapan.
Jadilah yang pertama memberikan doa terbaik.
```

---

# 20. UI-13 — CLOSING

## Layout
Full-width image / photo pasangan.

Overlay 35–55%.

Content:
```text
Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila
Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

{{groom_short}} & {{bride_short}}

{{date}}
```

Nama pasangan menggunakan script besar.

---

# 21. UI-14 — FOOTER

Versi proyek sendiri:

```text
Copyright © {{year}} {{brand}}
Made with love
```

Jangan menyalin brand/vendor referensi.

Optional:
- Instagram bisnis;
- WhatsApp;
- link portfolio.

---

# 22. UI-15 — FLOATING MUSIC PLAYER

## Behaviour
Audio hanya mulai setelah `Open Invitation` diklik karena kebijakan browser autoplay.

## Position
```css
position: fixed;
right: 16px;
bottom: 18px;
z-index: 50;
```

Jika ada bottom navigation, naikkan posisi agar tidak overlap.

## State
Playing:
- icon music/vinyl;
- rotate lembut.

Paused:
- rotation berhenti.

## Requirements
- click toggle;
- volume default wajar;
- loop optional;
- preload metadata;
- file musik milik proyek sendiri / berlisensi.

---

# 23. UI-16 — OPTIONAL BOTTOM NAVIGATION

Tidak wajib untuk meniru referensi, tetapi dapat dipakai jika diinginkan.

Menu:
```text
Home
Couple
Date
Gallery
Wishes
```

Jika dipakai:
- icon kecil;
- translucent cream;
- rounded pill;
- fixed bottom;
- smooth scroll.

Jika target meniru referensi seketat mungkin dan referensi tidak menonjolkan nav, feature ini dapat dimatikan via config.

---

# 24. ORNAMENT SYSTEM

Aset yang dibutuhkan versi proyek:
- floral burgundy;
- floral dusty rose;
- floral cream;
- daun hijau;
- divider gold;
- corner ornamental;
- optional motif Minang geometric;
- optional frame photo.

Naming:
```text
ornament-floral-top-left.webp
ornament-floral-top-right.webp
ornament-floral-bottom.webp
ornament-divider-gold.svg
ornament-minang-left.svg
ornament-minang-right.svg
```

Rules:
- PNG/WebP transparent;
- jangan menutupi body text;
- gunakan pointer-events none;
- decorative image harus `aria-hidden=true`;
- tampilkan sebagian keluar container untuk feel editorial.

---

# 25. ANIMATION SYSTEM

Rekomendasi: Framer Motion.

## Fade Up
```text
initial: opacity 0, y 28
animate: opacity 1, y 0
duration: 0.7s
```

## Scale Reveal
```text
initial: opacity 0, scale .96
animate: opacity 1, scale 1
duration: .8s
```

## Floral
```text
opacity 0 → 1
scale .92 → 1
rotate subtle optional
```

## Stagger
Child delay:
```text
80–140ms
```

## Rules
- jangan animasikan semuanya sekaligus;
- max duration umumnya <= 1s;
- honor `prefers-reduced-motion`;
- hindari parallax berat di mobile low-end.

---

# 26. USER FLOW DETAIL

```text
1. User menerima link.
2. Browser membuka /:slug?to=...
3. Frontend fetch wedding data.
4. Loading singkat bila dibutuhkan.
5. Cover tampil.
6. Guest name dibaca dari query param.
7. User klik Open Invitation.
8. Audio mulai.
9. Cover exit.
10. Hero visible.
11. User scroll.
12. Section masuk dengan reveal animation.
13. User klik Maps → external map.
14. User klik gallery → lightbox.
15. User klik copy rekening → clipboard + toast.
16. User isi RSVP.
17. Frontend validasi.
18. POST RSVP/wish.
19. Backend sanitize + save.
20. UI menampilkan wish baru.
21. Stats diperbarui.
22. User mencapai closing.
```

---

# 27. FRONTEND ARCHITECTURE

```text
frontend/
├── public/
│   ├── audio/
│   ├── images/
│   └── ornaments/
├── src/
│   ├── components/
│   │   ├── InvitationCover.jsx
│   │   ├── HeroSection.jsx
│   │   ├── QuoteSection.jsx
│   │   ├── CoupleSection.jsx
│   │   ├── Countdown.jsx
│   │   ├── EventSection.jsx
│   │   ├── StorySection.jsx
│   │   ├── GallerySection.jsx
│   │   ├── GalleryLightbox.jsx
│   │   ├── GiftSection.jsx
│   │   ├── GiftCard.jsx
│   │   ├── ShippingGiftCard.jsx
│   │   ├── RsvpSection.jsx
│   │   ├── WishStats.jsx
│   │   ├── WishList.jsx
│   │   ├── WishCard.jsx
│   │   ├── ClosingSection.jsx
│   │   ├── MusicPlayer.jsx
│   │   ├── Toast.jsx
│   │   └── BottomNavigation.jsx
│   ├── hooks/
│   │   ├── useCountdown.js
│   │   ├── useGuestName.js
│   │   ├── useAudio.js
│   │   └── useClipboard.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── globals.css
│   │   └── animations.css
│   ├── pages/
│   │   └── WeddingPage.jsx
│   ├── App.jsx
│   └── main.jsx
└── vite.config.js
```

---

# 28. BACKEND ARCHITECTURE

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── weddingController.js
│   │   └── rsvpController.js
│   ├── routes/
│   │   ├── weddingRoutes.js
│   │   └── rsvpRoutes.js
│   ├── services/
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── db/
│   │   └── pool.js
│   └── app.js
└── server.js
```

---

# 29. DATABASE

## 29.1 weddings
```text
id
slug UNIQUE
title
groom_short_name
groom_full_name
groom_father
groom_mother
groom_family_label
groom_instagram
groom_photo
bride_short_name
bride_full_name
bride_father
bride_mother
bride_family_label
bride_instagram
bride_photo
hero_photo
cover_photo
closing_photo
quote_text
quote_source
invitation_intro
music_url
timezone
status
created_at
updated_at
```

## 29.2 events
```text
id
wedding_id FK
type
date
start_time
end_time
end_time_label
venue
address
maps_url
sort_order
```

## 29.3 stories
```text
id
wedding_id FK
title
date_label
body
image_url
sort_order
```

## 29.4 gallery
```text
id
wedding_id FK
image_url
alt_text
width
height
object_position
sort_order
```

## 29.5 gifts
```text
id
wedding_id FK
type
provider
account_holder
account_number
logo_url
sort_order
```

## 29.6 gift_shipping
```text
id
wedding_id FK
recipient
address
```

## 29.7 guests
```text
id
wedding_id FK
name
phone nullable
invitation_code nullable
created_at
```

## 29.8 rsvps
```text
id
wedding_id FK
guest_id nullable
name
attendance
guest_count nullable
message
created_at
updated_at
```

Index:
```text
weddings.slug
rsvps.wedding_id
rsvps.created_at
guests.wedding_id
```

---

# 30. API CONTRACT

## GET /api/weddings/:slug
Mengambil seluruh data publik undangan.

Response:
```json
{
  "success": true,
  "data": {
    "wedding": {},
    "events": [],
    "stories": [],
    "gallery": [],
    "gifts": [],
    "gift_shipping": {}
  }
}
```

## GET /api/weddings/:slug/wishes?page=1&limit=10

Response:
```json
{
  "success": true,
  "data": {
    "items": [],
    "stats": {
      "total": 0,
      "hadir": 0,
      "tidak_hadir": 0,
      "ragu": 0
    },
    "pagination": {}
  }
}
```

## POST /api/weddings/:slug/rsvp

Request:
```json
{
  "name": "Budi",
  "attendance": "hadir",
  "guest_count": 2,
  "message": "Selamat..."
}
```

Response:
```json
{
  "success": true,
  "message": "Ucapan berhasil dikirim",
  "data": {}
}
```

---

# 31. PERSONALIZED GUEST

Helper:

```js
export function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("to");
  return value?.trim() || "Bapak/Ibu/Saudara/i";
}
```

Rules:
- decode URL;
- trim;
- max 120 chars;
- jangan render sebagai HTML;
- gunakan text node React biasa untuk menghindari XSS.

---

# 32. LOADING STATE

Jika fetch backend membutuhkan waktu:
- background cream;
- monogram pasangan;
- spinner kecil gold/burgundy;
- jangan memakai skeleton dashboard.

Timeout/error:
```text
Undangan belum dapat dimuat.
Silakan coba beberapa saat lagi.
[COBA LAGI]
```

---

# 33. TOAST SYSTEM

Digunakan untuk:
- nomor rekening disalin;
- alamat disalin;
- RSVP berhasil;
- RSVP gagal;
- jaringan error.

Position:
```text
top-center mobile
```
atau
```text
bottom-center di atas fixed controls
```

Duration:
`2200–3200ms`.

---

# 34. ACCESSIBILITY

Wajib:
- alt text semua foto non-dekoratif;
- button memakai elemen button;
- focus visible;
- color contrast cukup;
- modal lightbox focus trap;
- ESC menutup lightbox;
- `aria-label` untuk play/pause;
- reduced motion;
- input memiliki label;
- error validation tersambung ke field.

---

# 35. PERFORMANCE

Target mobile:
- LCP < 2.5–3.0s pada jaringan wajar;
- lazy load gallery;
- cover/hero image diprioritaskan;
- gunakan WebP/AVIF;
- responsive image `srcset`;
- audio jangan didownload penuh sebelum dibutuhkan bila tidak perlu;
- compress ornament;
- code splitting lightbox jika perlu;
- jangan menggunakan video background pada v1.

Image target:
- cover 150–350 KB ideal;
- gallery 100–300 KB per image;
- thumbnail bila dibutuhkan;
- width max sekitar 1600 px untuk web.

---

# 36. SECURITY

Backend:
- parameterized PostgreSQL query;
- sanitize/escape output;
- rate limit POST RSVP;
- max request body;
- validasi enum attendance;
- CORS terbatas;
- helmet;
- jangan expose DB credentials;
- logging error tanpa data sensitif;
- optional anti-spam honeypot.

Tidak boleh menyimpan HTML mentah dari field ucapan.

---

# 37. CONTENT CONFIG

Buat satu object/schema agar AI agent dapat mengisi data dummy terlebih dahulu:

```json
{
  "slug": "demo-wedding",
  "groom": {
    "shortName": "Raka",
    "fullName": "Raka Pratama",
    "familyLabel": "Putra pertama dari",
    "father": "Bapak ...",
    "mother": "Ibu ...",
    "instagram": "@...",
    "photo": "/images/groom.webp"
  },
  "bride": {
    "shortName": "Alya",
    "fullName": "Alya Putri",
    "familyLabel": "Putri kedua dari",
    "father": "Bapak ...",
    "mother": "Ibu ...",
    "instagram": "@...",
    "photo": "/images/bride.webp"
  },
  "dateDisplay": "20 . 06 . 2027",
  "heroPhoto": "/images/hero.webp",
  "coverPhoto": "/images/cover.webp",
  "closingPhoto": "/images/closing.webp",
  "quote": {
    "title": "We Found Love",
    "text": "...",
    "source": "QS Ar-Rum : 21"
  },
  "events": [],
  "stories": [],
  "gallery": [],
  "gifts": [],
  "giftShipping": {},
  "music": "/audio/wedding.mp3"
}
```

---

# 38. IMPLEMENTATION PRIORITY

## P0 — Wajib sebelum dianggap selesai
- Invitation Cover
- guest parameter
- Open Invitation
- audio play/pause
- Hero
- We Found Love
- Groom & Bride
- countdown
- event information
- Maps
- Our Story
- Gallery
- Wedding Gift
- copy rekening
- copy alamat
- RSVP
- stats
- Wish List
- Closing
- responsive mobile
- PostgreSQL integration
- backend validation
- smooth animations

## P1 — Setelah P0 stabil
- lightbox gestures;
- bottom navigation;
- share invitation;
- add to calendar;
- guest_count;
- admin mini dashboard;
- theme config.

## P2 — Future SaaS
- multi wedding;
- multi template;
- custom domain;
- payment;
- customer dashboard;
- template marketplace;
- invitation analytics;
- WA guest generator;
- CSV guest import.

---

# 39. ACCEPTANCE CRITERIA GLOBAL

## Cover
- fullscreen;
- nama tamu benar;
- scroll locked;
- Open Invitation bekerja;
- cover exit smooth;
- musik mulai setelah click.

## Hero
- foto tajam;
- nama terbaca;
- tidak overflow;
- proporsi mendekati referensi.

## Couple
- kedua profil lengkap;
- foto portrait responsif;
- Instagram clickable.

## Countdown
- realtime;
- timezone benar;
- tidak menghasilkan angka negatif.

## Event
- tanggal/jam/venue/alamat jelas;
- Google Maps membuka tab/app.

## Story
- urutan benar;
- animasi tidak berlebihan;
- teks panjang tetap nyaman dibaca.

## Gallery
- responsive;
- lazy load;
- lightbox dapat ditutup.

## Gift
- rekening tampil;
- clipboard bekerja;
- feedback sukses terlihat.

## RSVP
- validation;
- data masuk PostgreSQL;
- refresh tidak diperlukan untuk melihat ucapan baru;
- stats akurat.

## Music
- tidak autoplay sebelum interaksi;
- toggle bekerja;
- tidak restart saat section berubah.

## Responsive
- lolos 360px;
- tidak ada horizontal overflow;
- fixed controls tidak menutupi form.

## Performance
- image compressed;
- main page tetap usable pada koneksi mobile.

---

# 40. TEST CASE WAJIB

1. Buka URL tanpa `?to=`.
2. Buka URL `?to=Fikri%20Arrahman`.
3. Buka URL `?to=Fikri+Arrahman+dan+Partner`.
4. Guest name sangat panjang.
5. Klik Open Invitation satu kali.
6. Klik dua kali cepat.
7. Audio play.
8. Audio pause.
9. Refresh.
10. Countdown sebelum event.
11. Countdown setelah event.
12. Maps.
13. Instagram.
14. Klik semua foto gallery.
15. ESC lightbox.
16. Copy rekening.
17. Copy alamat.
18. RSVP valid.
19. RSVP tanpa nama.
20. RSVP tanpa status.
21. Wish sangat panjang.
22. HTML/script pada wish.
23. Network offline.
24. API 500.
25. 100+ wishes pagination.
26. Mobile 360px.
27. Mobile 430px.
28. Tablet.
29. Desktop.
30. prefers-reduced-motion.

---

# 41. NON-GOALS V1

Jangan menghabiskan waktu pada:
- payment gateway;
- login customer;
- template editor drag-and-drop;
- WhatsApp automation;
- analytics kompleks;
- custom domain automation;
- multi-tenant billing;
- AI generator;
- video streaming.

Tujuan v1 adalah SATU undangan yang sangat bagus dan reusable.

---

# 42. DEFINITION OF DONE

Project dianggap selesai jika:

1. Tampilan mobile memiliki alur dan feel yang sangat dekat dengan referensi.
2. Semua section referensi utama tersedia.
3. Isi menggunakan data/aset milik proyek sendiri.
4. Guest URL personal berfungsi.
5. Cover + audio berfungsi.
6. Countdown realtime.
7. Maps berfungsi.
8. Gallery + lightbox berfungsi.
9. Copy gift/address berfungsi.
10. RSVP tersimpan ke PostgreSQL.
11. Wish list dan stats akurat.
12. Responsive 360–1440 px.
13. Tidak ada console error penting.
14. Tidak ada horizontal overflow.
15. API tervalidasi.
16. Build production berhasil.
17. Dokumentasi environment tersedia.

---

# 43. ENVIRONMENT

Frontend `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Backend `.env`:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/wedding_invitation
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Jangan commit secret production.

---

# 44. URUTAN KERJA UNTUK AI AGENT

AI AGENT WAJIB MENGERJAKAN BERURUTAN:

```text
PHASE 1
Setup React + Vite
→ tokens
→ global layout
→ dummy wedding config

PHASE 2
Cover
→ hero
→ quote
→ couple
→ event
→ countdown

PHASE 3
Story
→ gallery
→ gift
→ closing
→ music
→ animations

PHASE 4
Express
→ PostgreSQL
→ wedding public API

PHASE 5
RSVP API
→ validation
→ stats
→ wish list
→ pagination

PHASE 6
Responsive polish
→ performance
→ accessibility
→ testing

PHASE 7
Replace dummy assets/data
→ production build
→ deploy
```

Jangan membuat dashboard sebelum seluruh PHASE 1–6 stabil.

---

# 45. VISUAL POLISH CHECKLIST UNTUK AI AGENT

Sebelum menandai UI selesai, cek:
- cover benar-benar memenuhi layar;
- hero tidak terasa seperti landing page corporate;
- script font hanya digunakan untuk aksen/nama, bukan body panjang;
- burgundy tidak mendominasi seluruh layar;
- cream/ivory memberi ruang napas;
- gold hanya sebagai aksen;
- foto tradisional menjadi focal point;
- floral ditempatkan asymmetrical tetapi seimbang;
- heading center;
- card tidak terlalu banyak shadow;
- semua section memiliki vertical rhythm;
- animation smooth;
- tidak ada icon gaya dashboard/admin;
- button cenderung pill/elegant;
- footer minimal;
- mobile first.

---

# 46. CATATAN REFERENSI VISUAL

Dari halaman referensi:
- foto menggunakan pasangan dengan pakaian tradisional bernuansa hitam, emas, coklat, merah;
- dekorasi foto dan floral memberi aksen merah tua yang kuat;
- ornamen floral menggunakan kombinasi burgundy, dusty rose, cream, dan hijau;
- visual keseluruhan diarahkan ke nuansa wedding tradisional yang elegan;
- section-content menggunakan alur vertikal panjang;
- nama pasangan dan heading adalah elemen emosional utama;
- RSVP/gift tetap dibuat menyatu dengan tema wedding, bukan seperti form aplikasi bisnis.

Target implementasi harus mempertahankan karakter ini dengan aset milik proyek sendiri.

---

# 47. CATATAN HAK CIPTA / ASSET

AI agent:
- BOLEH meniru struktur UI, layout, spacing, hierarchy, jenis interaksi, dan pola animasi sebagai referensi desain.
- JANGAN mengunduh lalu memasukkan foto pasangan referensi ke proyek final.
- JANGAN memasukkan logo vendor referensi.
- JANGAN menyalin cerita pribadi pasangan referensi sebagai konten proyek.
- JANGAN menyalin rekening/alamat pribadi referensi.
- JANGAN menggunakan musik referensi tanpa izin.
- Buat ornament sendiri atau gunakan aset yang berlisensi.

---

# 48. OUTPUT YANG DIHARAPKAN DARI AI AGENT

Setelah membaca PRD ini, AI agent harus dapat menghasilkan:

```text
1. Frontend React wedding invitation
2. Responsive mobile-first UI
3. Semua section yang dipetakan
4. Design tokens
5. Animation system
6. Personal guest URL
7. Music player
8. Countdown
9. Maps
10. Story timeline
11. Gallery + lightbox
12. Gift cards + clipboard
13. RSVP form
14. Wish statistics
15. Wish list
16. Express REST API
17. PostgreSQL schema
18. Validation + rate limiting
19. Environment setup
20. Production-ready build
```

---

# 49. INSTRUKSI FINAL UNTUK AI AGENT

Gunakan halaman referensi sebagai target UX visual, tetapi jangan membuat interpretasi desain yang jauh dari referensi.

Prioritas:
```text
1. Mobile visual fidelity
2. Urutan section
3. Typography
4. Burgundy / cream / gold visual language
5. Floral/traditional ornament
6. Foto sebagai focal point
7. Smooth Open Invitation transition
8. Scroll reveal animation
9. RSVP / gift consistency
10. Clean backend architecture
```

Jika ada konflik antara “menambahkan fitur baru” dan “menjaga tampilan referensi”, prioritaskan menjaga tampilan referensi untuk versi 1.

Jangan menambahkan dashboard, navbar desktop besar, pricing section, feature cards, sidebar, atau elemen SaaS pada halaman undangan publik.

Halaman publik harus tetap terasa sebagai UNDANGAN PERNIKAHAN, bukan aplikasi bisnis.

---

# 50. END OF PRD

**Status spesifikasi:** Siap digunakan sebagai prompt/context file untuk AI coding agent.
