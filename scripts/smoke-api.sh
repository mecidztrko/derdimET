#!/usr/bin/env bash
# API smoke test — DERDIMET_SEED=true ile çalışan sunucuya karşı üç rolü dener.
# Kullanım: ./scripts/smoke-api.sh [BASE_URL]
set -euo pipefail

BASE_URL="${1:-http://localhost:8081}"
COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT

PASS="${SMOKE_PASSWORD:-123456}"

preflight() {
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' \
    -H 'Content-Type: application/json' \
    -X POST "$BASE_URL/api/auth/session-login" \
    -d '{"email":"probe@invalid.local","password":"x"}' || true)"
  if [[ "$code" == "404" ]]; then
    echo "Hata: $BASE_URL üzerinde /api/auth/session-login yok (HTTP 404)." >&2
    echo "Muhtemelen eski bir backend çalışıyor. Projeyi yeniden derleyip başlatın:" >&2
    echo "  DERDIMET_SEED=true mvn spring-boot:run" >&2
    exit 1
  fi
}

login() {
  local email="$1"
  curl -sf -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    -H 'Content-Type: application/json' \
    -X POST "$BASE_URL/api/auth/session-login" \
    -d "{\"email\":\"$email\",\"password\":\"$PASS\"}" >/dev/null
  echo "  ✓ login $email"
}

get_ok() {
  local label="$1"
  local path="$2"
  local code
  code="$(curl -sf -o /dev/null -w '%{http_code}' -b "$COOKIE_JAR" "$BASE_URL$path")"
  if [[ "$code" != "200" ]]; then
    echo "  ✗ $label ($path) HTTP $code" >&2
    exit 1
  fi
  echo "  ✓ $label"
}

echo "derdimET API smoke → $BASE_URL"
preflight

echo "Alıcı (buyer1@derdimet.local)"
login "buyer1@derdimet.local"
get_ok "me" "/api/me"
get_ok "et ilanları" "/api/buyer/meat-sale-requests"
get_ok "tekliflerim" "/api/buyer/meat-offers"
get_ok "teklif arama" "/api/buyer/meat-offers?q=demo"
get_ok "bildirim özeti" "/api/notifications/summary"

echo "Satıcı (seller1@derdimet.local)"
login "seller1@derdimet.local"
get_ok "me" "/api/me"
get_ok "ilanlarım" "/api/seller/animal-listings"
get_ok "ilan arama" "/api/seller/animal-listings?q=simental"
get_ok "alış talepleri" "/api/seller/animal-purchase-requests"
get_ok "pazar" "/api/seller/market-listings"

echo "Kesimhane (slaughterhouse1@derdimet.local)"
login "slaughterhouse1@derdimet.local"
get_ok "me" "/api/me"
get_ok "hayvan ilanları" "/api/slaughterhouse/animal-listings"
get_ok "alış taleplerim" "/api/slaughterhouse/animal-purchase-requests"
get_ok "alış talebi arama" "/api/slaughterhouse/animal-purchase-requests?q=demo"
get_ok "et ilanlarım" "/api/slaughterhouse/meat-sale-requests"
get_ok "et ilanı arama" "/api/slaughterhouse/meat-sale-requests?q=et"
get_ok "bildirim özeti" "/api/notifications/summary"

echo ""
echo "Tüm smoke kontrolleri geçti."
