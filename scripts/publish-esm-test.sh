#!/bin/bash

# Publish test packages with 'esmbeta' dist-tag
# Non-interactive

set -e

echo "════════════════════════════════════════════════════════════"
echo "📦 Publishing @pie-lib packages with 'esmbeta' dist-tag"
echo "════════════════════════════════════════════════════════════"
echo ""

# Ensure we're in the right directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."

# Check for uncommitted changes
if [[ -n "$(git status --porcelain)" ]]; then
  echo "⚠️  WARNING: Uncommitted changes detected!"
  echo ""
  git status --short
  echo ""
  read -p "Continue anyway? (type 'yes'): " CONFIRM
  if [[ "$CONFIRM" != "yes" ]]; then
    echo "❌ Aborted"
    exit 1
  fi
fi

echo "Building packages..."
yarn build

echo ""
echo "Publishing with esmbeta dist-tag..."
echo ""

# Lerna publish prerelease with esmbeta tag
# prerelease: Increment prerelease number only
#   - First time: 1.0.0 → 1.0.1-esmbeta.0
#   - Next time: 1.0.1-esmbeta.0 → 1.0.1-esmbeta.1
#   - Next time: 1.0.1-esmbeta.1 → 1.0.1-esmbeta.2
# --preid esmbeta: Use 'esmbeta' as prerelease identifier
# --dist-tag esmbeta: Publish to 'esmbeta' tag instead of 'latest'
# --yes: Non-interactive, no prompts
lerna publish prerelease \
  --preid esmbeta \
  --dist-tag esmbeta \
  --yes

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Published to npm with 'esmbeta' dist-tag"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "To install these versions:"
echo "  yarn add @pie-lib/package-name@esmbeta"
echo ""
echo "To test on CDN:"
echo "  yarn test:esm:cdn"
echo ""

