#!/bin/bash
set -e

echo "🧪 Running comprehensive integration tests..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

run_test() {
  local name=$1
  local cmd=$2
  
  echo -e "${YELLOW}▶ ${name}${NC}"
  if eval "$cmd" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ${name} - PASSED${NC}"
  else
    echo -e "${RED}❌ ${name} - FAILED${NC}"
    FAILED=$((FAILED + 1))
  fi
  echo ""
}

# Test 1: ESM bundle validation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. ESM Bundle Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node scripts/test-esm.mjs
echo ""

# Test 2: Backward compatibility
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Backward Compatibility"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node scripts/test-backward-compat.cjs 2>&1 | tail -20
echo ""

# Test 3: Dynamic ESM import test
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Dynamic ESM Import Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node scripts/test-dynamic-import.mjs
echo ""

# Test 4: Package tarball test
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Package Tarball Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node scripts/test-pack.cjs
echo ""

# Test 5: Bundle size check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Bundle Size Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
node scripts/check-bundle-sizes.cjs
echo ""

# Test 6: Check for git dirty state
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Git State Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -z "$(git status --porcelain packages/*/esm)" ]; then
  echo -e "${GREEN}✅ No untracked ESM artifacts (esm/ is gitignored)${NC}"
else
  echo -e "${RED}❌ Found untracked ESM files (check .gitignore)${NC}"
  FAILED=$((FAILED + 1))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All integration tests passed!${NC}"
  echo ""
  echo "Ready to commit and publish:"
  echo "  1. git commit -m 'feat: Add ESM support'"
  echo "  2. lerna publish --preid esm --dist-tag esm"
  exit 0
else
  echo -e "${RED}❌ ${FAILED} test(s) failed${NC}"
  echo ""
  echo "Please fix the issues before committing."
  exit 1
fi

