# derdimET

Türkiye odaklı çiftlikten sofraya et ve hayvan pazarı — Spring Boot API + React (Vite) web arayüzü.

## Gereksinimler

- Java 17+
- Node 18+
- MySQL 8 (yerel veya Docker)

## Hızlı başlangıç

### 1. Veritabanı

MySQL’de `derdimET` veritabanını oluşturun. Bağlantı varsayılanları `src/main/resources/application.yml` içinde (ortam değişkenleriyle değiştirilebilir).

### 2. Backend

```bash
DERDIMET_SEED=true mvn spring-boot:run
```

- API: `http://localhost:8081`
- `DERDIMET_SEED=true` demo kullanıcı ve örnek ilanları yükler (yalnızca geliştirme).

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

## Test / QA

```bash
./scripts/smoke-api.sh              # temel API smoke (3 rol)
./scripts/qa-api.sh                 # smoke + doğrulama + mesajlar
mvn test                            # H2 ile integration testler
```

## Proje yapısı

| Dizin | Açıklama |
|-------|----------|
| `src/main/java` | Spring Boot API |
| `frontend/src` | React uygulaması |
| `scripts/` | Smoke ve QA shell scriptleri |
| `.github/workflows/` | CI |

## Ortam değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `SERVER_PORT` | HTTP port (varsayılan `8081`) |
| `DERDIMET_SEED` | `true` → demo veri |
| `SPRING_DATASOURCE_*` | MySQL bağlantısı |
