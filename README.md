# derdimET

Türkiye odaklı çiftlikten sofraya et ve hayvan pazarı — Spring Boot API + React (Vite) web arayüzü.

## Gereksinimler

- Java 17+
- Node 18+
- MySQL 8 (yerel veya Docker)

## Hızlı başlangıç

### 1. Ortam değişkenleri

```bash
cp .env.example .env
# .env içinde SPRING_DATASOURCE_PASSWORD ve gerekirse diğer değerleri düzenleyin
```

MySQL’de `derdimET` veritabanını oluşturun.

### 2. Backend

```bash
./scripts/run-dev.sh              # normal geliştirme
./scripts/run-dev-seed.sh         # demo kullanıcı + örnek ilanlar
```

- API: `http://localhost:8081`
- Varsayılan profil: `dev` (`SPRING_PROFILES_ACTIVE`)
- Demo seed yalnızca `dev` profilinde ve `DERDIMET_SEED=true` iken çalışır

Alternatif (IntelliJ / manuel):

```bash
DERDIMET_SEED=true mvn spring-boot:run
```

### 3. Frontend

```bash
cd frontend && npm install && npm run dev
```

- UI: `http://localhost:5173` (Vite proxy → `:8081`)

Üretim build (Spring static):

```bash
cd frontend && npm run build
# Çıktı: src/main/resources/static/auth/
```

## Demo hesaplar (`DERDIMET_SEED=true`)

| Rol | E-posta | Şifre |
|-----|---------|--------|
| Alıcı | `buyer1@derdimet.local` | `123456` |
| Alıcı (doğrulanmamış) | `buyer-unverified@derdimet.local` | `123456` |
| Satıcı | `seller1@derdimet.local` | `123456` |
| Kesimhane | `slaughterhouse1@derdimet.local` | `123456` |
| Yönetici | `admin@derdimet.local` | `123456` |

Yönetici paneli: giriş sonrası rol seçicide **Profil / yönetim** kartı; hayvan alış ilanı oluşturma kesimhane adına yapılır.

## Test / QA

```bash
./scripts/smoke-api.sh              # temel API smoke (3 rol)
./scripts/qa-api.sh                 # smoke + doğrulama + mesajlar
mvn test                            # integration testler (H2)
mvn verify                          # testler + JaCoCo coverage raporu
```

Coverage raporu: `target/site/jacoco/index.html`

### Integration test kapsamı

| Test sınıfı | Kapsam |
|-------------|--------|
| `AuthIntegrationTest` | Kayıt, giriş, JWT, yetkisiz erişim, rol engeli |
| `AnimalMarketFlowIntegrationTest` | Hayvan ilanı → teklif → kabul → `AnimalDeal` |
| `MeatMarketFlowIntegrationTest` | Et ilanı → teklif → kabul → `Order` |
| `AccountGuardIntegrationTest` | Doğrulanmamış hesap teklif engeli |
| `MessagingIntegrationTest` | Sohbet açma, mesaj gönderme |
| `MarketServiceIntegrationTest` | Servis katmanı iş akışları |
| `ApiIntegrationTest` | Swagger, correlation ID, altyapı |

## Proje yapısı

| Dizin | Açıklama |
|-------|----------|
| `src/main/java` | Spring Boot API |
| `src/main/resources/application*.yml` | Ortam profilleri (`dev`, `prod`, `test`) |
| `frontend/src` | React uygulaması |
| `scripts/` | Geliştirme, smoke ve QA scriptleri |
| `.github/workflows/` | CI |

## Ortam yönetimi

| Profil | Kullanım | Dosya |
|--------|----------|-------|
| `dev` | Yerel geliştirme (varsayılan) | `application-dev.yml` |
| `prod` | Sunucu / üretim | `application-prod.yml` |
| `test` | `mvn test` (H2) | `application-test.yml` |

Hassas değerler repoda tutulmaz. Şablon: `.env.example` → kopyalayıp `.env` oluşturun.

### Ortam değişkenleri

| Değişken | Zorunlu (prod) | Açıklama |
|----------|----------------|----------|
| `SPRING_PROFILES_ACTIVE` | Evet | `dev` veya `prod` |
| `SPRING_DATASOURCE_URL` | Evet | MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Evet | Veritabanı kullanıcısı |
| `SPRING_DATASOURCE_PASSWORD` | Evet | Veritabanı şifresi |
| `DERDIMET_JWT_SECRET` | Evet | En az 32 karakter; üretimde güçlü rastgele değer |
| `DERDIMET_CORS_ALLOWED_ORIGIN_PATTERNS` | Evet | Virgülle ayrılmış origin listesi (`*` prod'da yasak) |
| `SERVER_PORT` | Hayır | HTTP port (varsayılan `8081`) |
| `DERDIMET_SEED` | Hayır | `true` → demo veri (yalnızca `dev`) |
| `DERDIMET_SWAGGER_ENABLED` | Hayır | `false` → OpenAPI / Swagger UI kapalı (prod varsayılanı) |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hayır | Dev: `update`, prod: `none` |
| `DERDIMET_MAIL_ENABLED` | Hayır | `true` → SMTP ile e-posta (şifre sıfırlama, doğrulama) |
| `SPRING_MAIL_HOST` | Mail açıksa | SMTP sunucusu |
| `SPRING_MAIL_USERNAME` / `SPRING_MAIL_PASSWORD` | Mail açıksa | SMTP kimlik bilgileri |
| `DERDIMET_PUSH_ENABLED` | Hayır | `true` → FCM push bildirimleri |
| `DERDIMET_FCM_SERVER_KEY` | Push açıksa | Firebase Cloud Messaging sunucu anahtarı |

Üretimde eksik veya güvensiz değerler `ProductionEnvironmentValidator` tarafından başlangıçta reddedilir.

## Yeni API uçları (portföy özellikleri)

| Alan | Uç | Açıklama |
|------|-----|----------|
| Auth | `POST /api/auth/password/change` | Giriş yapmış kullanıcı şifre değiştirir |
| İşletme | `POST /api/business-verification` | İşletme doğrulama belgesi gönderir |
| Admin | `GET /api/admin/business-verification` | Bekleyen doğrulama talepleri |
| Değerlendirme | `POST /api/reviews` | Kullanıcıya yorum bırakır |
| Değerlendirme | `GET /api/users/{id}/reviews` | Kullanıcı yorumları |
| Stok | `GET /api/slaughterhouse/stock` | Kesimhane stok listesi |
| Bildirim | `PUT /api/notifications/preferences` | Push tercihleri |
| Bildirim | `POST /api/notifications/device-token` | Mobil cihaz FCM token kaydı |

E-posta ve push varsayılan olarak kapalıdır (`DERDIMET_MAIL_ENABLED=false`, `DERDIMET_PUSH_ENABLED=false`); yerel geliştirmede log'a düşer.

## API dokümantasyonu (Swagger)

Geliştirme ve test ortamında SpringDoc OpenAPI etkindir:

| URL | Açıklama |
|-----|----------|
| `http://localhost:8081/swagger-ui.html` | Swagger UI — uçları deneyebilirsiniz |
| `http://localhost:8081/v3/api-docs` | OpenAPI 3 JSON |

**JWT ile deneme:** `POST /api/auth/login` → `Authorize` → `Bearer <token>`.

Uçlar role göre gruplandırılmıştır: `auth`, `buyer`, `seller`, `slaughterhouse`, `admin`, `shared`, `all`.

Üretimde (`prod` profili) Swagger varsayılan olarak kapalıdır.

## Loglama ve observability

| Ortam | Format | Correlation ID |
|-------|--------|----------------|
| `dev` | Düz metin (konsol) | `[corr=...]` log satırında |
| `prod` | JSON (`logstash-logback-encoder`) | `@timestamp`, `correlationId`, `httpMethod`, `httpPath`, `httpStatus`, `durationMs` |
| `test` | Düz metin | Aynı MDC alanları |

Her HTTP yanıtında `X-Request-Id` başlığı döner. İstemci gönderirse aynen yansıtılır; göndermezse sunucu UUID üretir.

API hata gövdelerinde `correlationId` alanı bulunur — destek ve hata ayıklama için kullanılır.

`/api/**` istekleri tek satırlık erişim logu üretir: `HTTP GET /api/me -> 401 (3 ms)`.
