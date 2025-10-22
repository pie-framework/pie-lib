#!/bin/bash

# Add esmbeta dist-tag to all @pie-lib packages
# Run this after publishing if lerna didn't apply the tag

set -e

echo "════════════════════════════════════════════════════════════"
echo "🏷️  Adding 'esmbeta' dist-tag to @pie-lib packages"
echo "════════════════════════════════════════════════════════════"
echo ""

# Find all packages with their current versions
cd "$(dirname "$0")/.."

PACKAGES=$(find packages -name package.json -type f -not -path "*/node_modules/*")

for PKG_JSON in $PACKAGES; do
  PKG_DIR=$(dirname "$PKG_JSON")
  PKG_NAME=$(node -p "require('./$PKG_JSON').name")
  PKG_VERSION=$(node -p "require('./$PKG_JSON').version")
  IS_PRIVATE=$(node -p "require('./$PKG_JSON').private || false")
  
  # Skip private packages
  if [[ "$IS_PRIVATE" == "true" ]]; then
    continue
  fi
  
  # Only tag versions with -esmbeta suffix
  if [[ "$PKG_VERSION" == *"-esmbeta."* ]]; then
    echo "📦 $PKG_NAME@$PKG_VERSION"
    npm dist-tag add "$PKG_NAME@$PKG_VERSION" esmbeta
  fi
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ All esmbeta dist-tags added"
echo "════════════════════════════════════════════════════════════"
echo ""

