# HERA OS — Worklog

Oturum kayıtları. Append-only: mevcut kayıtları silme, yalnızca yeni ekle.

---

Tarih: 2026-10-31
Oturum amacı: Eski 3D uçan ada portfolyosunu bırakıp HERA OS konseptiyle yeniden kurmak (kullanıcı kararı).
Yapılanlar:
- Eski sürüm tek commit + `ucan-ada` etiketi olarak arşivlendi; src/server/shared/three/Express kaldırıldı.
- İçerik (`content/`) ve görseller (`public/media/`) korundu.
- CLAUDE.md + docs (Muitoon düzeni: project_overview, tasks, worklog, decisions D1–D5).
Karar değişikliği: D1–D5.
Sonraki adım: P1 iskelet.

Tarih: 2026-10-31
Oturum amacı: P1–P3 — HERA OS iskeleti, uygulamalar ve içerik.
Yapılanlar:
- Vite + TypeScript + Preact; pencere yöneticisi (aç/odak/küçült/büyüt/sürükle/boyutlandır, hash ile derin bağlantı), masaüstü, görev çubuğu + Başlat, açılış kartı (oyun intro'sunun hareketi), 16×16 piksel simgeler, HERA gece dünyası duvar kağıdı (tam sayı piksel, yıldız + yaprak katmanı).
- Uygulamalar: Hakkımda, Projeler gezgini (Tümü/Oyunlar/Araçlar/Web), Proje penceresi (galeri, video, bağlantılar), Videolar (YouTube lite), CV.exe (beceriye tıkla → o beceriyi kullanan işler; Yazdır/PDF), Hızlı bakış, Terminal (help, ls, open, neofetch…), İletişim, Çöp kutusu (eski 3D site şakası).
- İçerik: 14 proje (Mirela's Cauldron, Loomlight, Muivly, Muiren, Muiply, Muiget, Muifly, Muiren Bot, Ved TR eklendi; Muita 9,99 $, Muitown 4,99 $ katalogla eşitlendi); sosyal hesaplar (YouTube, IG edit/kişisel/HERA, TikTok, GitHub, itch, LinkedIn); avatar = Instagram HERA avatarı.
- Klasik CV (dist/cv, dist/en/cv), verify zinciri, görünmez ekran görüntüsü aracı; JS 30 KB gzip.
- Bu bilgisayarda prefers-reduced-motion açık (Windows animasyonları kapalı): kart ve yıldızlar o modda da var; ekran görüntüleri hareketi taklit eder.
Karar değişikliği: yok (D1–D5).
Sonraki adım: kullanıcıdan CV bilgileri; GitHub deposu + Pages (onay).
