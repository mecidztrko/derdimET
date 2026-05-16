#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v mvn >/dev/null 2>&1; then
  echo "mvn (Maven) bulunamadı. IntelliJ’den DerdimEtApplication çalıştırın."
  exit 1
fi

echo "Yerel MySQL’in 3306’da çalıştığından emin olun (derdimET veritabanı, kullanıcı application.properties ile aynı)."
for i in $(seq 1 40); do
  if (echo >/dev/tcp/127.0.0.1/3306) 2>/dev/null; then
    echo "MySQL portu açık."
    break
  fi
  if [[ "$i" -eq 40 ]]; then
    echo "3306’ya bağlanılamadı. MySQL’i başlatıp tekrar deneyin."
    exit 1
  fi
  sleep 1
done

exec mvn -q spring-boot:run
