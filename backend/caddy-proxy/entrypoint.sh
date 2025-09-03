#!/usr/bin/env sh
set -eu

MODE="${CADDY_MODE:-auto}"
CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS}"

log() { printf '[caddy-entrypoint] %s\n' "$*"; }

generate_http() {
  log "Generating HTTP config (dev mode)"
  {
    echo ":80 {"
    echo "  route {"
    echo "    header Access-Control-Allow-Origin \"${CORS_ALLOWED_ORIGINS}\""
    echo "    header Access-Control-Allow-Methods \"GET, POST, PUT, PATCH, DELETE, OPTIONS\""
    echo "    header Access-Control-Allow-Headers \"Authorization, Content-Type\""
    echo "    header Access-Control-Allow-Credentials \"true\""
    echo "    encode gzip"
    echo "    @options {"
    echo "      method OPTIONS"
    echo "    }"
    echo "    respond @options 204"
    echo "    handle /api/invoice/* {"
    echo "      reverse_proxy invoice-service:8082"
    echo "    }"
    echo "    handle /api/v1/* {"
    echo "      reverse_proxy admin-service:8081"
    echo "    }"
    echo "    handle /api/mail/* {"
    echo "      reverse_proxy mailing-service:8083"
    echo "    }"
    echo "  }"
    echo "}"
  } > /etc/caddy/Caddyfile
}


generate_https() {
  : "${CADDY_DOMAIN:?CADDY_DOMAIN is required in prod mode}"
  log "Generating HTTPS config for domain ${CADDY_DOMAIN} (prod mode)"
  {
    echo "{"
    if [ -n "${CADDY_EMAIL:-}" ]; then
      echo "  email ${CADDY_EMAIL}"
    fi
    echo "}"
    echo "${CADDY_DOMAIN} {"
    echo "  route {"
    echo "    header Access-Control-Allow-Origin \"${CORS_ALLOWED_ORIGINS}\""
    echo "    header Access-Control-Allow-Methods \"GET, POST, PUT, PATCH, DELETE, OPTIONS\""
    echo "    header Access-Control-Allow-Headers \"Authorization, Content-Type\""
    echo "    header Access-Control-Allow-Credentials \"true\""
    echo "    encode gzip"
    echo "    @options {"
    echo "      method OPTIONS"
    echo "    }"
    echo "    respond @options 204"
    echo "    handle /api/invoice/* {"
    echo "      reverse_proxy invoice-service:8082"
    echo "    }"
    echo "    handle /api/v1/* {"
    echo "      reverse_proxy admin-service:8081"
    echo "    }"
    echo "    handle /api/mail/* {"
    echo "      reverse_proxy mailing-service:8083"
    echo "    }"
    echo "  }"
    echo "}"
    echo ":80 {"
    echo "  encode gzip"
    echo "  redir https://${CADDY_DOMAIN}{uri} 308"
    echo "}"
  } > /etc/caddy/Caddyfile
}



case "$MODE" in
  dev) generate_http ;;
  prod) generate_https ;;
  auto)
    if [ -n "${CADDY_DOMAIN:-}" ]; then generate_https; else generate_http; fi
    ;;
  *)
    log "Unknown CADDY_MODE='$MODE' (use dev|prod|auto). Falling back to dev."
    generate_http
    ;;
esac

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
