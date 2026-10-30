# HERA OS — Kararlar

Bağlayıcı mimari kararlar ve gerekçeleri. Tersine gidilecekse kullanıcı onayı alınır. Her kararın sonunda `Revisit:`.
Okurken: `grep -n "^## " docs/decisions.md`.

---

## D1 — Konsept: HERA OS (2026-10-31, kullanıcı)
Site küçük bir işletim sistemi: masaüstü (HERA piksel gece dünyası), pencereli uygulamalar, görev çubuğu, başlat menüsü,
terminal. Eski 3D uçan ada sürümü bırakıldı (kullanıcı: "daha farklı bir şey"), git etiketi `ucan-ada`'da duruyor.
İşveren yolu oyunsu yolu beklemez: görev çubuğunda **Hızlı bakış** (CV + öne çıkan projeler tek pencerede) ve
JS'siz **klasik CV** (`/cv/`). Revisit: ziyaretçi verisi "işveren CV'yi bulamıyor" derse.

## D2 — Teknoloji: Vite + TypeScript + Preact (+ signals) (2026-10-31)
Pencere yöneticisi durum tutar (açık pencereler, odak, konum, küçültme); vanilla DOM ile bu el yapımı bir framework'e
dönüşür. Preact ~4 KB, JSX okunur; @preact/signals durum için. Three.js ve Express kaldırıldı (statik yayın).
Revisit: bundle 150 KB gzip'i aşarsa.

## D3 — Yayın: GitHub Pages, statik (2026-10-31, kullanıcı)
`npm run build` → `dist/` (SPA + `cv/index.html` klasik sayfa). `heraklessii.github.io` kök deposu Mirela'nın gizlilik
sayfaları ve app-ads.txt için kullanılıyor → portfolyo ayrı depo (proje sitesi, `base` ayarlı). İletişim: e-posta
kopyala/mailto + sosyal bağlantılar; form servisi (Formspree vb.) kullanıcı hesap açarsa eklenir.
Revisit: kendi alan adı alınınca (CNAME, base '/').

## D4 — İçerik JSON'da, iki dilli (2026-10-31)
`content/site.json` (kimlik, hakkımda, sosyal, CV), `content/projects/*.json`, `content/videos.json`. Arayüz ve
klasik sayfa aynı kaynaktan okur; `scripts/verify-content.mjs` şemayı denetler. CV alanları yalnız kullanıcının
verdiği bilgiyle doldurulur. Revisit: içerik 30 projeyi aşarsa.

## D5 — Duvar kağıdı: HERA piksel gece dünyası, koddan (2026-10-31)
`HeraSosyal/brand/scene.js` sahnesinin TypeScript kopyası (`src/wallpaper/`): tam sayı piksel ölçeği, yıldız
kırpışması ve yaprak düşüşü canvas'ta; `prefers-reduced-motion`'da durağan. Marka ile aynı dünya (Instagram, intro).
Revisit: düşük uçlu telefonda 30 fps altına inerse.
