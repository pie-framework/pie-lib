#!/bin/bash
# Pre-publish safety checks
# Run this BEFORE `lerna publish` to ensure everything is ready

set -e

echo "🔍 Pre-Publish Safety Checks"
echo "════════════════════════════════════════════════════════════"

# 1. Check for uncommitted changes
echo ""
echo "1️⃣  Checking for uncommitted changes..."
if [[ -n $(git status --porcelain) ]]; then
  echo "❌ ERROR: You have uncommitted changes!"
  echo ""
  git status --short
  echo ""
  echo "Please commit or stash all changes before publishing."
  exit 1
fi
echo "✅ Working directory is clean"

# 2. Check we're on the right branch
echo ""
echo "2️⃣  Checking git branch..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "   Current branch: $BRANCH"
if [[ "$BRANCH" == "master" ]] || [[ "$BRANCH" == "main" ]] || [[ "$BRANCH" == "develop" ]]; then
  echo "✅ On safe branch for publishing"
else
  echo "⚠️  WARNING: Not on main/master/develop branch"
  echo "   Proceeding anyway..."
fi

# 3. Run clean build
echo ""
echo "3️⃣  Running clean build (CJS + ESM)..."
yarn build
echo "✅ Build complete"

# 4. Run ESM integrity tests
echo ""
echo "4️⃣  Running ESM integrity tests..."
yarn test:esm
echo "✅ ESM tests passed"

# 5. Verify npm pack includes ESM files
echo ""
echo "5️⃣  Verifying ESM files will be published..."
# Find first non-private package with ESM
TEST_PKG=$(find packages -name package.json -type f -exec grep -l '"exports"' {} + | head -1 | xargs dirname)
if [[ -z "$TEST_PKG" ]]; then
  echo "⚠️  WARNING: No packages with exports field found"
else
  PKG_NAME=$(basename "$TEST_PKG")
  echo "   Testing package: $PKG_NAME"
  cd "$TEST_PKG"
  
  # Check if esm/ files would be included
  if npm pack --dry-run 2>&1 | grep -q "esm/"; then
    echo "✅ ESM files will be published"
  else
    echo "❌ ERROR: ESM files NOT in tarball!"
    echo ""
    echo "This means ESM bundles won't be accessible on npm/CDN."
    echo "Check the 'files' field in package.json or .npmignore"
    cd ../..
    exit 1
  fi
  cd ../..
fi

# 6. Summary
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ All pre-publish checks passed!"
echo ""
echo "Safe to publish with:"
echo "  lerna publish patch --yes"
echo "  lerna publish prepatch --preid esm --dist-tag esm-test --yes"
echo ""

