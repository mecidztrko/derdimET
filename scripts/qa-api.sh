#!/usr/bin/env bash
# Genişletilmiş QA — smoke sonrası e-posta doğrulama ve mesaj uçları.
set -euo pipefail

BASE_URL="${1:-http://localhost:8081}"
COOKIE_JAR="$(mktemp)"
trap 'rm -f "$COOKIE_JAR"' EXIT
PASS="${SMOKE_PASSWORD:-123456}"

login() {
  curl -sf -c "$COOKIE_JAR" -b "$COOKIE_JAR" \
    -H 'Content-Type: application/json' \
    -X POST "$BASE_URL/api/auth/session-login" \
    -d "{\"email\":\"$1\",\"password\":\"$PASS\"}" >/dev/null
}

expect_code() {
  local label="$1"
  local method="$2"
  local path="$3"
  local data="${4:-}"
  local expected="$5"
  local code
  if [[ "$method" == "GET" ]]; then
    code="$(curl -s -o /dev/null -w '%{http_code}' -b "$COOKIE_JAR" "$BASE_URL$path")"
  else
    code="$(curl -s -o /dev/null -w '%{http_code}' -b "$COOKIE_JAR" \
      -H 'Content-Type: application/json' \
      -X "$method" "$BASE_URL$path" ${data:+-d "$data"})"
  fi
  if [[ "$code" != "$expected" ]]; then
    echo "  ✗ $label ($path) beklenen HTTP $expected, gelen $code" >&2
    exit 1
  fi
  echo "  ✓ $label (HTTP $code)"
}

echo "derdimET QA → $BASE_URL"
"$(dirname "$0")/smoke-api.sh" "$BASE_URL"

echo ""
echo "E-posta doğrulama (buyer-unverified)"
login "buyer-unverified@derdimet.local"
SALE_ID="$(curl -sf -b "$COOKIE_JAR" "$BASE_URL/api/buyer/meat-sale-requests" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d[0]['id'] if d else '')" 2>/dev/null || true)"
if [[ -n "$SALE_ID" ]]; then
  expect_code "doğrulanmamış teklif engeli" POST \
    "/api/buyer/meat-sale-requests/${SALE_ID}/offers" \
    '{"pricePerKg":100,"quantity":5}' 403
else
  echo "  ⚠ Açık et ilanı yok, teklif engeli atlandı"
fi
expect_code "doğrulanmamış mesaj başlatma engeli" POST \
  "/api/conversations/with/1" '{}' 403

echo ""
echo "Mesajlar (buyer1)"
login "buyer1@derdimet.local"
expect_code "konuşma listesi" GET "/api/conversations" "" 200
expect_code "bildirimde unread alanı" GET "/api/notifications/summary" "" 200
UNREAD="$(curl -sf -b "$COOKIE_JAR" "$BASE_URL/api/notifications/summary" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['unreadMessages'] if 'unreadMessages' in d else -1)")"
if [[ "$UNREAD" == "-1" ]]; then
  echo "  ✗ Bildirim özeti unreadMessages alanı yok — backend'i yeniden derleyip başlatın" >&2
  exit 1
fi
echo "  ✓ unreadMessages=$UNREAD (buyer1)"

login "slaughterhouse1@derdimet.local"
SH_UNREAD="$(curl -sf -b "$COOKIE_JAR" "$BASE_URL/api/notifications/summary" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('unreadMessages', -1))")"
if [[ "$SH_UNREAD" == "-1" ]]; then
  echo "  ✗ Kesimhane bildirim özeti unreadMessages eksik" >&2
  exit 1
fi
echo "  ✓ slaughterhouse unreadMessages=$SH_UNREAD (seed mesajı beklenir ≥1)"

echo ""
echo "Tüm QA kontrolleri geçti."
