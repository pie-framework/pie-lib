#!/bin/bash

# Publish test packages with 'esmbeta' dist-tag
# Note: Build happens automatically via prepublishOnly hook
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

echo "Publishing with esmbeta dist-tag..."
echo "(Build will run automatically via prepublishOnly hook)"
echo ""

# Store initial state for rollback on failure
INITIAL_COMMIT=$(git rev-parse HEAD)

# Lerna publish prerelease with esmbeta tag
# prerelease: Increment prerelease number only
#   - First time: 1.0.0 → 1.0.1-esmbeta.0
#   - Next time: 1.0.1-esmbeta.0 → 1.0.1-esmbeta.1
#   - Next time: 1.0.1-esmbeta.1 → 1.0.1-esmbeta.2
# --preid esmbeta: Use 'esmbeta' as prerelease identifier
# --dist-tag esmbeta: Publish to 'esmbeta' tag instead of 'latest'
# --force-publish: Publish all packages even if no changes detected
# --no-push: Don't push to git yet (we'll do it manually after verification)
# --yes: Non-interactive, no prompts
if lerna publish prerelease \
  --preid esmbeta \
  --dist-tag esmbeta \
  --force-publish \
  --no-push \
  --yes; then
  
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "✅ Published to npm with 'esmbeta' dist-tag"
  echo "════════════════════════════════════════════════════════════"
  echo ""
  echo "📤 Pushing to git..."
  git push && git push --tags
  echo "✅ Git push complete"
else
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "❌ Publish failed!"
  echo "════════════════════════════════════════════════════════════"
  echo ""
  echo "🔄 Rolling back git changes..."
  
  # Delete any tags created since initial commit
  git tag -l | while read tag; do
    TAG_COMMIT=$(git rev-list -n 1 "$tag" 2>/dev/null || echo "")
    if [[ "$TAG_COMMIT" != "" ]] && ! git merge-base --is-ancestor "$TAG_COMMIT" "$INITIAL_COMMIT" 2>/dev/null; then
      echo "  Deleting tag: $tag"
      git tag -d "$tag"
    fi
  done
  
  # Reset to initial commit
  git reset --hard "$INITIAL_COMMIT"
  
  echo "✅ Rollback complete"
  echo ""
  echo "Please fix the issue and try again."
  exit 1
fi
echo ""
echo "To install these versions:"
echo "  yarn add @pie-lib/package-name@esmbeta"
echo ""
echo "To test on CDN:"
echo "  yarn test:esm:cdn"
echo ""

