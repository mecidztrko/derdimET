#!/usr/bin/env bash
# Demo veri ile yerel geliştirme sunucusu.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-dev}"
export DERDIMET_SEED=true

exec mvn -q spring-boot:run "$@"
