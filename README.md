# heraklessi — gezilebilir 3D portfolyo

Ziyaretçi küçük bir karakterle gün batımındaki uçan bir adada geziyor; her proje adada bir
istasyon. Yaklaşıp **E**'ye basınca (ya da tıklayınca) proje paneli açılıyor: görseller,
açıklama, bağlantılar, tarayıcıda oynanabilir prototip, videolar ve iletişim formu.

- **3D dünya**: Three.js, tamamen prosedürel (model dosyası yok) → hızlı açılış
- **Klasik görünüm**: aynı içerik düz HTML olarak — arama motorları, WebGL'i olmayanlar,
  "hareketi azalt" diyenler ve tercih edenler için
- **İki dil**: Türkçe / İngilizce (sağ üstteki düğme)
- **Gece modu**, sakura yaprakları (gece ateş böceği), itilebilir top/sandıklar, dağılıp
  yeniden toplanan voxel isim

## Komutlar

```bash
npm install
npm run dev        # geliştirme: http://localhost:5173 (içerik değişince sayfa yenilenir)
npm run build      # içerik doğrulama + derleme + brotli/gzip
npm start          # üretim sunucusu: http://localhost:8787
npm run check      # yalnız içerik doğrulama
```

Üretim için `.env.example` → `.env` kopyala (`SITE_URL`, `DISCORD_WEBHOOK_URL`, `TRUST_PROXY`).

## Yeni proje eklemek (kod yazmadan)

1. **Görseller** — itch.io'daysa tek komut:
   ```bash
   npm run media:itch -- yeni-oyun https://heraklessi.itch.io/yeni-oyun
   ```
   Değilse görselleri `public/media/<slug>/` altına koy (`cover.webp`, `cover-sm.webp`, `shot-1.webp`…).
2. **Kayıt** — `content/projects/<slug>.json` oluştur (en kolayı mevcut birini kopyalamak).
   Dosya adı `slug` ile aynı olmalı. `_` ile başlayan dosyalar yok sayılır (taslak için).
3. `npm run build` — doğrulama hata verirse ne eksik olduğunu söyler.
4. (İsteğe bağlı) `node scripts/make-og.js` — paylaşım görselini günceller.

Proje adada otomatik yerini alır: halka genişler, yolu çizilir, haritaya ve klasik görünüme eklenir.

### Proje alanları

| Alan | Zorunlu | Açıklama |
|---|---|---|
| `slug` | ✓ | küçük harf/rakam/tire; URL'de `?p=<slug>` |
| `title` | ✓ | proje adı |
| `kind` | ✓ | `game` (torii kapısı) · `web` (portal) · `tool` / `app` (şövale) · `bot` / `other` (monolit) · `video` (sinema) |
| `tagline`, `description` | ✓ | metin ya da `{ "tr": "…", "en": "…" }` |
| `cover` | ✓ | büyük görsel; `thumb` küçüğü (istasyon panosu) |
| `order` |  | sıralama (küçük önce) |
| `color` |  | `#rrggbb` — istasyon ve panel vurgusu |
| `status`, `year`, `tags`, `platforms`, `highlights` |  | panel bilgileri (`highlights` iki dilli liste olabilir) |
| `gallery` |  | panel galerisi |
| `links` |  | `[{ "type": "primary", "label": {...}, "url": "https://…" }]` |
| `embed` |  | tarayıcıda çalıştır: `{ "type": "iframe", "src": "/play/<klasör>/index.html", "label": {...}, "note": {...} }` ya da `{ "type": "youtube", "id": "…" }` |
| `hidden` |  | `true` → yayından kaldırır |

**Tarayıcıda oynanabilir sürüm** (Unity WebGL, HTML5 oyun, web demo): dosyaları
`public/play/<klasör>/` altına koy ve `embed.src` ile göster. Sandbox'lı iframe içinde, sitenin
çerezlerine/DOM'una erişemeden çalışır.

**Yeni bir istasyon görünümü** istersen: `src/world/stations.js` → `KIND_BUILDERS`'a bir fonksiyon,
`shared/content.js` → `KINDS`'a adı.

### Videolar

`content/videos.json` — kategoriler ve YouTube ID'leri. `format: "short"` dikey, `"wide"` yatay.

## Mimari

```
content/            ← TEK veri kaynağı (site, projeler, videolar)
shared/content.js   ← yükleme + doğrulama (derleme ve npm run check kullanır)
shared/classic.js   ← içerikten SEO/klasik HTML üretimi (derlemede index.html'e basılır)
src/main.js         ← mod kararı (3D/klasik), yükleme ekranı, derin bağlantılar
src/ui/             ← paneller, HUD, iletişim formu, YouTube facade (DOM; three bilmez)
src/world/          ← 3D dünya (three; DOM bilmez — arayüzle yalnız hook'larla konuşur)
server/             ← Express: statik + /api/contact + güvenlik başlıkları
scripts/            ← dev, precompress, check-content, fetch-itch-media, make-og
```

### Performans

- İlk yük ~15 kB JS (gzip). Three.js (~140 kB) ayrı parça, yalnız 3D modda iner; klasik mod hiç indirmez.
- Çimen tek draw call (GPU'da rüzgâr + karakterin etrafında eğilme), ağaç/kaya/fener instanced.
- Uyarlanabilir kalite: FPS düşerse çözünürlük, sonra gölge ve çimen yoğunluğu azalır.
- Panel açıkken dünya 1/3 hızda çizilir; sekme gizliyken durur.
- Metin dosyaları derlemede brotli/gzip'lenir; hash'li dosyalar 1 yıl önbellekte.
- Görseller WebP; YouTube oynatıcısı yalnız tıklanınca yüklenir (youtube-nocookie).

### Güvenlik

- Sıkı CSP: `script-src 'self'` (inline script yok), dar `img/frame/font` listeleri, `object-src 'none'`, `base-uri 'none'`
- HSTS (üretim), `X-Frame-Options`, `nosniff`, COOP, CORP, kısıtlı `Permissions-Policy`
- İletişim: IP başına hız sınırı (15 dk'da 5, günde 20), 10 kB gövde sınırı, üretimde Origin kontrolü,
  bal küpü + zaman tuzağı (bota sessiz 200), alan doğrulama, kontrol karakteri temizliği,
  Discord'a `allowed_mentions: []` (kimse @everyone atamaz)
- Tüm arayüz metinleri `textContent` ile basılır (innerHTML yok); derleme HTML'i kaçışlı
- Gömülü oyunlar `sandbox="allow-scripts"` iframe'de
