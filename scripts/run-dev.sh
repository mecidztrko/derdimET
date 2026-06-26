#!/usr/bin/env bash
# Yerel geliştirme: .env dosyasını yükleyip Spring Boot'u dev profili ile başlatır.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
  echo "→ .env yüklendi"
else
  echo "→ .env bulunamadı; ortam değişkenleri ve application-dev.yml varsayılanları kullanılacak"
  echo "  İpucu: cp .env.example .env"
fi

export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-dev}"

exec mvn -q spring-boot:run "$@"
