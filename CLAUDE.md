# CLAUDE.md

# HERA OS — İlker Uçkun (heraklessi) portfolyosu

Portfolyo + etkileşimli CV, küçük bir "işletim sistemi" olarak: HERA'nın piksel gece dünyası masaüstü,
uygulamalar pencerelerde açılır (Hakkımda, Oyunlar, Araçlar, Videolar, CV, Terminal, İletişim). İşveren için
**Hızlı bakış** ve JavaScript'siz **klasik CV** sayfası aynı içerikten üretilir. Yayın: GitHub Pages (statik).

Öncelik sırası:

1. Ziyaretçinin aradığını bulması (işveren 2 tıkta CV + projeler; derin bağlantı `#/petalfall`, `#/cv`)
2. Özgünlük ve etkileşim (HERA markası, oynanabilir hissi)
3. Performans ve erişilebilirlik (telefonda akıcı, klavyeyle gezilebilir, `prefers-reduced-motion`)
4. İçerik eklemenin kolaylığı (kod yazmadan, `content/*.json`)

(Bu dosya kısa tutulur. Detay: `docs/project_overview.md`, `docs/tasks.md`, `docs/worklog.md`, `docs/decisions.md`)

---

# Çalışma Kuralları

## Genel

* Türkçe konuş. Aksiyon öncesi uzun açıklama yapma.
* Önce mevcut kodu incele, var olan sistemi genişlet; gereksiz yeniden yazım ve kod tekrarı yok.
* Her modül kendi sorumluluğunda kalır: `src/os/` (pencere yöneticisi, masaüstü, görev çubuğu) uygulamaların
  içeriğini bilmez; `src/apps/` pencere yöneticisine yalnız `os/store.ts` API'siyle dokunur.
* İçerik **yalnız** `content/` altında (`{ "tr", "en" }` iki dilli). Koda proje/CV bilgisi yazılmaz.
* Arayüz metni `src/lib/i18n.ts`'e iki dilli girer.
* Marka: `~/.claude/yayin/marka.md` (renk, font, ton). Proje adları/sloganları `~/.claude/yayin/katalog.md` ile çelişmez.

## Düzenleme Kuralları

* Mevcut dosyada Edit; Write yalnız yeni dosya ya da %60+ değişen dosya (gerekçe `docs/decisions.md`).
* 10+ satırlık yardımcı script `scripts/` altında kalıcı dosya (`verify-*`, `build-*`, `fetch-*`).

## Doğrulama ve Onay

### Dur ve Sor

* Dosya/görsel silme, yeni dependency ekleme
* `docs/decisions.md`'deki bir kararın tersine gitmek
* Kişisel bilgi eklemek (CV alanları yalnız kullanıcının verdiği bilgiyle doldurulur — tahmin yok)
* GitHub'a push / yayın (repo oluşturma, Pages ayarı)

### Doğrulama

* Her paketten sonra **`npm run verify`**: içerik şeması + TypeScript + build + klasik sayfa üretimi.
* Görsel değişiklikte **`npm run shots`** (görünmez Chromium, pencere açmaz) → `TestResults/shots/` ve bak.
  Kullanıcı bilgisayarı kullanırken ekranda pencere açan hiçbir doğrulama yapılmaz.
* "Çalışmalı" yetmez; "çalışıyor" doğrulanır.

## Context Yönetimi

Oturum başında oku: `docs/project_overview.md` (her zaman), `docs/tasks.md` (her zaman),
`docs/worklog.md` (yalnız son 3 kayıt), `docs/decisions.md` (karar değiştireceksen; `grep -n "^## "`).
Yeni kayıt: anlatı worklog'a; kullanıcıya kalan adım tasks.md'ye; mimari gerekçe decisions.md'ye.

### Worklog Formatı

```
Tarih: YYYY-MM-DD
Oturum amacı: <tek cümle>
Yapılanlar:
- madde
Karar değişikliği: ...
Sonraki adım: ...
```

(Append-only.)

---

## ⚡ HIZLI BAŞVURU

* Geliştirme → `npm run dev` · Doğrulama → `npm run verify` · Ekran görüntüsü → `npm run shots`
* Yeni proje → `content/projects/<slug>.json` + görseller `public/media/<slug>/`
* Yeni uygulama penceresi → `src/apps/<Ad>.tsx` + `src/apps/registry.ts`
* Mimari karar → decisions.md · Kullanıcıya kalan adım → tasks.md · Oturum sonu → worklog
* Eski 3D uçan ada sürümü: git etiketi `ucan-ada`
