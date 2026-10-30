# HERA OS — Proje Genel Bakış

CLAUDE.md'nin taşıyamayacağı ayrıntı: mimari, klasörler, içerik şeması, komutlar, yayın.

---

## Stack

* **Vite 8** + **TypeScript** + **Preact 10** (+ `@preact/signals`) — D2
* Statik çıktı (`dist/`), sunucu yok — D3 (GitHub Pages)
* Fontlar paketle gelir (`src/assets/fonts`): Pixelify Sans, Plus Jakarta Sans, JetBrains Mono
* Geliştirme araçları: `sharp` (görsel içe aktarma), görünmez Chromium için kardeş projedeki Electron
  (`../Loomlight/node_modules/electron`, ya da `ELECTRON` ortam değişkeni) — yeni bağımlılık değil

## Klasörler

```
content/            site.json (kimlik, hakkımda, beceriler, sosyal, cv), projects/<slug>.json, videos.json
public/media/       proje görselleri (<slug>/cover.webp, cover-sm.webp, shot-N.webp), hera/avatar.webp
src/
  main.tsx, App.tsx  kök: duvar kağıdı + masaüstü + görev çubuğu + açılış kartı + derin bağlantı
  os/               pencere yöneticisi (store.ts), Window, Desktop, Taskbar(+Başlat), Boot, icons (16×16 piksel)
  apps/             About, Projects (gezgin), Project, Videos, Cv, Quick (hızlı bakış), Terminal, Contact, Trash,
                    registry.ts (bütün uygulamalar), ui.tsx (ortak parçalar)
  wallpaper/        scene.js (HeraSosyal/brand/scene.js kopyası), Wallpaper.tsx (canlı katman)
  lib/              content.ts (tipler + JSON), i18n.ts (tr/en)
  styles/           base (tokenlar), os, apps, print (CV yazdırma)
scripts/            verify-content, build-classic (JS'siz /cv/), verify-dist, shots (+shots-electron),
                    import-media, fetch-itch-media, seed-projects-2026-10 (tek seferlik kayıt)
docs/               bu dosya, tasks, worklog, decisions
```

## Nasıl çalışır

* **Pencere yöneticisi** (`os/store.ts`): `open(app, arg)` aynı pencereyi tekrar açmaz, öne getirir; odaktaki
  pencere adres çubuğuna yazılır (`#/cv`, `#/project/petalfall`, `#/projects/games`). Bağlantıyla gelen ziyaretçi
  açılış kartını görmez, doğrudan o pencereye düşer. Telefonda (≤720 px) pencereler tam ekran.
* **Uygulama eklemek**: `src/apps/<Ad>.tsx` + `registry.ts`'e bir satır (`desktop`/`start` sırası, boyut, simge).
* **Proje eklemek**: `content/projects/<slug>.json` (şema `scripts/verify-content.mjs`), görseller
  `node scripts/import-media.mjs` (kaynak listesi betikte) ya da `npm run media:itch -- <slug> <itch-url>`.
* **İşveren yolu**: görev çubuğunda sarı **Hızlı bakış**; masaüstündeki not; JS'siz `cv/` ve `en/cv/`
  (`build-classic.mjs`); CV.exe'de **Yazdır / PDF** (`print.css` yalnız CV'yi basar).
* **Hareket**: `prefers-reduced-motion`'da açılış kartı durağan, yapraklar düşmez, yıldızlar yalnız kırpışır
  (bu bilgisayarda Windows animasyonları kapalı → açık).

## Komutlar

| Komut | Ne |
|---|---|
| `npm run dev` | geliştirme sunucusu (5180) |
| `npm run verify` | içerik şeması + tsc + build + klasik CV + dist denetimi (JS ≤150 KB gzip) |
| `npm run shots [ad…]` | `dist/`'ten görünmez Chromium ekran görüntüleri → `TestResults/shots/` (pencere açmaz) |
| `node scripts/import-media.mjs [slug…]` | kardeş klasörlerden görseller → `public/media/` |

## Yayın (D3)

GitHub Actions (`.github/workflows/pages.yml`): `main`/`master`'a push → `npm ci && npm run build` → Pages.
`base: './'` sayesinde `heraklessii.github.io/<depo>/` altında da kendi alan adında da çalışır.
