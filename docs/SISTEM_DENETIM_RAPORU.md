# derdimET — Sistem Denetim Raporu

**Tarih:** 29 Mayıs 2026  
**Kapsam:** Backend (Spring Boot), Frontend (React/Vite), MySQL/JPA, rol bazlı yetkilendirme, API ↔ UI eşlemesi  
**Yöntem:** Kod incelemesi, `scripts/smoke-api.sh` / `scripts/qa-api.sh`, `mvn test` (H2), endpoint–client karşılaştırması

---

## Özet

| Alan | Durum |
|------|--------|
| Alıcı (MEAT_BUYER) | Çalışıyor — smoke geçti |
| Satıcı (ANIMAL_SELLER) | Çalışıyor — smoke geçti |
| Kesimhane (SLAUGHTERHOUSE) | Çalışıyor — smoke geçti (önceden düzeltilen `/offers` yolu doğru) |
| Yönetici (ADMIN) | **Düzeltildi** — önceden kırıktı; yeni `/api/admin/*` uçları ve seed kullanıcısı eklendi |
| Mesajlar + sohbet teklifleri | Kod uyumlu; canlıda **backend yeniden başlatma** gerekir |
| Birim testler | `mvn test` — 4 test, **geçti** (H2 profili) |

---

## Rol matrisi

### 1. Alıcı (`MEAT_BUYER`)

| Özellik | API | Frontend | Durum |
|---------|-----|----------|--------|
| Oturum / profil | `GET/PATCH /api/me` | `useMe`, ayarlar | OK |
| Et ilanları arama | `GET /api/buyer/meat-sale-requests` | `BuyerSearch`, `BuyerHome` | OK |
| Teklif verme | `POST .../meat-sale-requests/{id}/offers` | `CreateMeatOfferModal` | OK (e-posta doğrulanmış) |
| Tekliflerim | `GET /api/buyer/meat-offers` | `BuyerOffers` | OK |
| Satın almalar | `GET /api/buyer/purchases` | `BuyerPurchases` | OK |
| Favori kesimhaneler | `GET /api/buyer/favorite-slaughterhouses` | `BuyerFavorites` | OK |
| Favori toggle (ilan) | `POST /api/favorites/toggle/{userId}` | `useToggleFavorite` | OK |
| Mesajlar | `/api/conversations*` | `BuyerMessages` | OK |
| Sohbet teklifleri | `GET .../conversations/{id}/offers` | `ChatConversationOffers` | OK (yeni kod; restart) |
| Bildirim özeti | `GET /api/notifications/summary` | sidebar badge | OK |
| E-posta doğrulama engeli | `AccountGuardService` | `buyer-unverified` seed | QA script ile doğrulandı |

**Not:** `GET /api/buyer/favorites` (satıcı favorileri) backend’de var; UI şu an et ilanları için `favorites/toggle` kullanıyor — işlevsel sorun yok.

---

### 2. Satıcı (`ANIMAL_SELLER`)

| Özellik | API | Frontend | Durum |
|---------|-----|----------|--------|
| Hayvan ilanları CRUD | `/api/seller/animal-listings` | `SellerListings` | OK |
| Pazar (diğer satıcılar) | `GET /api/seller/market-listings` | `SellerBrowse` | OK |
| Kesimhane alış talepleri | `GET /api/seller/animal-purchase-requests` | teklif akışı | OK |
| Satıcı teklifleri | `POST .../offers`, `GET /api/seller/animal-offers` | `SellerOffers` | OK |
| Gelen ilan teklifleri | `GET /api/seller/incoming-listing-offers` | `SellerOffers` | OK |
| Kabul / red | `POST /api/seller/listing-offers/{id}/accept\|reject` | mesaj + teklif UI | OK |
| Favori kesimhaneler | `GET/POST/DELETE /api/seller/profile/favorites` | `SellerSettings` | OK (aşağıda isimlendirme uyarısı) |
| Satış geçmişi | `GET /api/seller/profile/sales` | profil | OK |
| İlan detay | `GET /api/listings/animal/{id}` | modallar | OK |
| Mesajlar | `/api/conversations*` | `SellerMessages` | OK |

**İsimlendirme (kozmetik):** `FavoriteBuyerResponse.buyerId` aslında **kesimhane kullanıcı id**’sidir; frontend `SellerFavoriteSlaughterhouseDto.buyerId` ile aynı alanı kullanıyor — çalışır, okunabilirlik zayıf.

---

### 3. Kesimhane (`SLAUGHTERHOUSE`)

| Özellik | API | Frontend | Durum |
|---------|-----|----------|--------|
| Satıcı hayvan ilanları | `GET /api/slaughterhouse/animal-listings` | `SlaughterhouseBuyAnimals` | OK |
| İlana teklif | `POST .../animal-listings/{id}/offers` | modal | OK |
| Verdiğim teklifler | `GET /api/slaughterhouse/offers` | `SlaughterhouseOffers` | OK (eski yanlış path düzeltildi) |
| Hayvan alış talebi | `/api/slaughterhouse/animal-purchase-requests` | `SlaughterhousePurchaseRequests` | OK |
| Gelen satıcı teklifleri | `GET .../animal-purchase-requests/{id}/offers` | aynı sayfa | OK |
| Teklif kabul/red | `/api/slaughterhouse/animal-purchase-offers/{id}/...` | UI | OK |
| Et satış ilanları | `/api/slaughterhouse/meat-sale-requests` | `SlaughterhouseSellMeat` | OK |
| Alıcı et teklifleri | `/api/slaughterhouse/meat-offers` | dashboard / teklifler | OK |
| Profil favori/satış | `/api/slaughterhouse/profile/*` | ayarlar | OK |
| Mesajlar | `/api/conversations*` | `SlaughterhouseMessages` | OK |

---

### 4. Yönetici (`ADMIN`)

| Özellik | Önceki durum | Şimdiki durum |
|---------|--------------|---------------|
| Hayvan alış ilanı oluşturma | `POST /api/slaughterhouse/...` → **403** (admin kesimhane rolü yok) | `POST /api/admin/animal-purchase-requests` + kesimhane seçimi |
| Kesimhane listesi | Yok | `GET /api/admin/slaughterhouses` |
| Demo hesap | Yok | `admin@derdimet.local` / `123456` (seed) |
| Rol seçici | ADMIN tüm panellere girebilir | OK |
| Profil sayfası | `/dashboard` | `ProfileDashboardPage` + `AdminAnimalPurchaseForm` |

**SecurityConfig:** `/api/admin/**` → `hasRole("ADMIN")` artık gerçek controller ile eşleşiyor.

---

## Tespit edilen sorunlar ve yapılan düzeltmeler

| # | Sorun | Düzeltme |
|---|--------|----------|
| 1 | Admin paneli hayvan alış ilanı oluşturamıyordu (403) | `AdminMarketController`, `frontend/src/api/admin.ts`, formda kesimhane seçimi |
| 2 | `/api/admin/**` için controller yoktu | Aynı |
| 3 | Demo’da admin kullanıcı yoktu | Seed: `admin@derdimet.local` |
| 4 | Ölü endpoint: `GET /api/slaughterhouse/seller/incoming-offers` (yanlış rol + yanlış path) | Kaldırıldı; doğru uç: `/api/seller/incoming-listing-offers` |
| 5 | Kesimhane `listAnimalOffers` yanlış path (önceki oturum) | `/api/slaughterhouse/offers` |
| 6 | `AdminAnimalPurchaseController` sınıf adı yanıltıcı | Kesimhane controller’ı olarak kaldı; admin işleri `AdminMarketController` |

---

## Bilinen kısıtlar / yapılacaklar (düşük öncelik)

1. **`GET /api/listings/animal-request/{id}`** — backend var; `frontend/src/api/listings.ts` içinde helper yok. Detay modallar başka veriyle çalışıyorsa sorun yok; ayrı sayfa açılırsa client eklenmeli.
2. **Satıcı favori DTO alan adları** — `buyerId` → semantik olarak `slaughterhouseUserId` olmalı (breaking API; isteğe bağlı).
3. **Canlı sunucu senkronu** — `8081` üzerinde çalışan JVM eski bytecode ise yeni uçlar (admin, conversation offers) **404/403** verir. Çözüm:
   ```bash
   DERDIMET_SEED=true mvn spring-boot:run
   cd frontend && npm run build   # 8081/static/auth için
   ```
4. **Vite geliştirme cache** — uzun süre açık `5173` eski bundle gösterebilir; hard refresh veya `.vite` temizliği.
5. **`/api/buyer/favorites`** — satıcı favorileri; UI kullanmıyor (toggle tabanlı favoriler yeterli).

---

## Güvenlik ve veri katmanı

- **Roller:** Spring `hasRole("ANIMAL_SELLER" | "MEAT_BUYER" | "SLAUGHTERHOUSE" | "ADMIN")` — JWT + session cookie (`session-login`, `credentials: 'include'`).
- **Kayıt:** `ADMIN` rolü kayıt formundan engellenmiş (`UserRegistrationService`).
- **E-posta doğrulama:** Teklif, mesaj başlatma, favori ekleme — `AccountGuardService` (QA: `buyer-unverified`).
- **Veritabanı:** JPA entity’ler (`User`, `SellerAnimalListing`, `MeatSaleRequest`, `AnimalPurchaseRequest`, teklifler, `Conversation`, `Message`, `Order`) controller DTO’ları ile uyumlu; geliştirmede `ddl-auto=update` + seed.
- **CORS:** `/api/**` için açık pattern; cookie tabanlı oturumda frontend proxy veya aynı origin (`8081/auth`) tercih edilmeli.

---

## Test sonuçları

```text
./scripts/smoke-api.sh http://localhost:8081
  → Alıcı, Satıcı, Kesimhane: GEÇTİ
  → Admin: backend yeniden başlatılıp seed çalıştırılmadan GEÇMEZ (admin kullanıcı + yeni sınıflar)

./scripts/qa-api.sh http://localhost:8081
  → smoke + doğrulanmamış alıcı engeli + mesajlar: önceki çalıştırmada GEÇTİ

mvn test
  → GEÇTİ (ApiIntegrationTest, H2)
```

Admin smoke’u geçirmek için backend’i **yeniden derleyip** `DERDIMET_SEED=true` ile başlatın.

---

## Frontend ↔ Backend uyum özeti

Tüm `frontend/src/api/*.ts` çağrıları incelendi; kritik path uyumsuzluğu **kalmadı** (kesimhane offers ve admin hariç düzeltilmişti). Auth sayfaları doğrudan `fetch` ile `/api/auth/*` ve `/api/register` kullanıyor — backend ile uyumlu.

Statik üretim: `npm run build` → `src/main/resources/static/auth/` — Spring `8081/auth/` altında servis eder.

---

## Önerilen doğrulama adımları (sizin ortamınız)

1. Backend restart + seed  
2. `./scripts/smoke-api.sh` ve `./scripts/qa-api.sh`  
3. `admin@derdimet.local` ile giriş → Profil → hayvan alış ilanı oluştur  
4. `buyer1` ↔ `slaughterhouse1` mesajında sohbet teklifleri paneli  
5. Üç rol için çıkış (`/logout` → `?r=login`)  

---

*Bu rapor otomatik denetim ve kod düzeltmeleri sonrası oluşturulmuştur.*
