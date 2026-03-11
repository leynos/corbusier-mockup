#!/usr/bin/env bash
# Run Playwright E2E tests inside a container via Podman.
#
# The WSL2/Fedora host cannot install the Chromium binary that
# Playwright needs, so this script delegates browser execution to the
# official Playwright container image, which ships with browsers
# pre-installed.
#
# Prerequisites:
#   - Podman (or Docker — swap `podman` for `docker` below)
#   - A running dev server on the host (e.g. `bun dev`)
#
# Usage:
#   scripts/e2e-container.sh            # run all E2E tests
#   scripts/e2e-container.sh --grep "sidebar"  # filter tests

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BASE_URL="${PLAYWRIGHT_BASE_URL:-http://localhost:5173}"

# Derive the image tag from the installed @playwright/test version
# so the container's browser binaries match the test runner exactly.
PW_VERSION="$(node -e "console.log(require('@playwright/test/package.json').version)")"
IMAGE="${PLAYWRIGHT_IMAGE:-mcr.microsoft.com/playwright:v${PW_VERSION}-jammy}"

# ── Pre-flight: is the dev server reachable? ──────────────────────
check_server() {
  local host port
  host="$(echo "$BASE_URL" | sed -E 's|https?://([^:/]+).*|\1|')"
  port="$(echo "$BASE_URL" | sed -E 's|.*:([0-9]+).*|\1|')"
  port="${port:-5173}"
  if ! timeout 1 bash -c "echo >/dev/tcp/$host/$port" 2>/dev/null; then
    echo "ERROR: Dev server not reachable at $BASE_URL" >&2
    echo "Start it first:  bun dev" >&2
    exit 1
  fi
}
check_server

# ── Run tests inside the container ────────────────────────────────
# --network=host: container shares the host network stack, so
#   localhost inside the container reaches the host dev server.
# PLAYWRIGHT_BROWSERS_PATH: tells Playwright where to find the
#   pre-installed browsers inside the container image.
# PLAYWRIGHT_SKIP_WEBSERVER: prevents the config from trying to
#   launch `bun dev` inside the container (bun isn't available).
exec podman run --rm -i \
  --network=host \
  -e "PLAYWRIGHT_BROWSERS_PATH=/ms-playwright" \
  -e "PLAYWRIGHT_SKIP_BROWSER_GC=1" \
  -e "PLAYWRIGHT_BASE_URL=$BASE_URL" \
  -e "PLAYWRIGHT_SKIP_WEBSERVER=1" \
  -v "$PROJECT_DIR:/work:Z" \
  -w /work \
  "$IMAGE" \
  npx playwright test "$@"
