# Jest 24 → 29 Upgrade Plan

## Current State

**Versions:**
- Jest: 24.1.0 (January 2019, ~6 years old)
- React: 18.2.0
- React Testing Library: 16.3.0
- @testing-library/jest-dom: 5.16.5

**Issues with Jest 24:**
1. ❌ Cannot use global `@testing-library/jest-dom` setup (must import in every test file)
2. ❌ Missing 70% faster test initialization from jest-circus runner
3. ❌ Outdated test runner (jest-jasmine2)
4. ❌ Limited ESM support
5. ❌ Missing modern fake timers
6. ❌ Poor compatibility with React 18 patterns

## Target State

**Upgrade to Jest 29.7.0** (latest stable)

**Benefits:**
- ✅ Global jest-dom matcher setup
- ✅ jest-circus test runner (much faster)
- ✅ Better ESM module support
- ✅ Modern fake timers by default
- ✅ Better error messages and stack traces
- ✅ Improved TypeScript support
- ✅ Async transformer support

## Migration Steps

### Phase 1: Preparation (Low Risk)

1. **Audit Current Test Status**
   ```bash
   yarn test 2>&1 | tee test-output-before-upgrade.txt
   ```
   - Document current pass/fail rates
   - Identify any tests using deprecated Jest APIs

2. **Update Node Version** (if needed)
   - Jest 29 requires Node 14+
   - Current requirement: Node >=12.0.0
   - Recommended: Update to Node 18 LTS

3. **Review Breaking Changes**
   - Default test runner: jest-jasmine2 → jest-circus
   - Default test environment: jsdom → node (already configured correctly)
   - Modern fake timers now default
   - Deprecated APIs removed

### Phase 2: Dependency Updates

1. **Update Jest and Related Packages**

   Update in `package.json`:
   ```json
   {
     "devDependencies": {
       "jest": "^29.7.0",
       "babel-jest": "^29.7.0",
       "@types/jest": "^29.5.0"
     }
   }
   ```

2. **Install New Dependencies**

   Jest 29 requires separate jsdom environment:
   ```bash
   yarn add -D jest-environment-jsdom@^29.7.0
   ```

3. **Optional: Add node-notifier**
   ```bash
   yarn add -D node-notifier@^10.0.0
   ```

### Phase 3: Configuration Updates

1. **Update `jest.config.js`**

   Current config is mostly compatible, but add explicit environment:
   ```javascript
   module.exports = {
     testRegex: 'src/.*/?__tests__/.*.test\\.jsx?$',
     setupFilesAfterEnv: ['./jest.setup.js'],

     // Explicit jsdom environment (required in Jest 29)
     testEnvironment: 'jsdom',
     testEnvironmentOptions: {
       url: 'http://localhost',
     },

     // Recommended: Use jest-circus (new default, but explicit is better)
     testRunner: 'jest-circus/runner',

     verbose: false,
     testPathIgnorePatterns: ['node_modules', '.*/lib/.*'],

     transformIgnorePatterns: [
       'node_modules/(?!(@mui|@emotion|@testing-library|@dnd-kit|@tiptap)/)',
     ],

     resolver: '<rootDir>/jest-resolver.js',

     moduleNameMapper: {
       '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
       '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
       '^@pie-lib/(.*)$': '<rootDir>/packages/$1/src',
     },

     collectCoverageFrom: [
       'packages/*/src/**/*.{js,jsx}',
       '!packages/*/src/**/*.d.ts',
       '!packages/*/src/**/__tests__/**',
       '!packages/*/src/**/__mocks__/**',
     ],
   };
   ```

2. **Update `jest.setup.js`**

   **MAJOR BENEFIT: Enable global jest-dom setup!**

   Add at the top:
   ```javascript
   // Global jest-dom matchers (Jest 29+ supports this properly)
   import '@testing-library/jest-dom';

   // Rest of existing setup...
   Object.defineProperty(window, 'matchMedia', { ... });
   // ... existing mocks
   ```

   This means we can **remove `import '@testing-library/jest-dom'` from all test files!**

### Phase 4: Code Changes

1. **Remove jest-dom imports from all test files**

   Before:
   ```javascript
   import { render, screen } from '@testing-library/react';
   import '@testing-library/jest-dom';  // ← REMOVE THIS

   test('example', () => {
     render(<Component />);
     expect(screen.getByRole('button')).toBeInTheDocument();
   });
   ```

   After:
   ```javascript
   import { render, screen } from '@testing-library/react';
   // jest-dom is now global!

   test('example', () => {
     render(<Component />);
     expect(screen.getByRole('button')).toBeInTheDocument();
   });
   ```

2. **Check for Deprecated Jest APIs**

   Search and replace if found:
   - `jest.addMatchers()` → Use custom matchers differently
   - `jest.resetModuleRegistry()` → `jest.resetModules()`
   - `jest.runTimersToTime()` → `jest.advanceTimersByTime()`

3. **Update Fake Timers (if any)**

   If any tests use timers:
   ```javascript
   // Old way (still works but deprecated)
   jest.useFakeTimers('legacy');

   // New way (recommended)
   jest.useFakeTimers();
   ```

### Phase 5: Testing & Validation

1. **Run full test suite**
   ```bash
   yarn test 2>&1 | tee test-output-after-upgrade.txt
   ```

2. **Compare results**
   ```bash
   diff test-output-before-upgrade.txt test-output-after-upgrade.txt
   ```

3. **Fix any regressions**
   - Most tests should work identically
   - jest-circus may expose timing issues (usually bugs we want to catch)
   - Check for any timer-related test failures

4. **Performance validation**
   ```bash
   time yarn test
   ```
   - Should be noticeably faster due to jest-circus

### Phase 6: Cleanup

1. **Remove explicit jest-dom imports**
   ```bash
   # Find all files with jest-dom imports
   grep -r "import '@testing-library/jest-dom'" packages/

   # Remove them (they're now global)
   find packages/ -name "*.test.js*" -exec sed -i.bak "/import '@testing-library\/jest-dom'/d" {} \;
   find packages/ -name "*.bak" -delete
   ```

2. **Update documentation**
   - Update migration docs to reflect Jest 29
   - Document that jest-dom is now global
   - Update test-utils README if needed

## Rollback Plan

If issues arise:

1. **Quick rollback:**
   ```bash
   git checkout package.json yarn.lock
   yarn install
   ```

2. **Preserve changes:**
   - Keep test fixes/improvements
   - Only revert Jest version changes

## Estimated Effort

- **Preparation:** 30 minutes
- **Dependency updates:** 15 minutes
- **Configuration changes:** 30 minutes
- **Code cleanup:** 1-2 hours (automated)
- **Testing & validation:** 2-3 hours
- **Total:** ~4-6 hours

## Risk Assessment

**Low Risk:**
- Jest 29 is stable and mature
- Most breaking changes don't affect our usage
- Easy rollback if needed
- Tests are already using RTL (not Enzyme)

**Medium Risk:**
- jest-circus may expose race conditions (good to find!)
- Some snapshot updates may be needed

## Success Criteria

- [ ] All tests pass (or same pass/fail rate as before)
- [ ] Test execution is faster
- [ ] No `import '@testing-library/jest-dom'` in test files
- [ ] No deprecation warnings in console
- [ ] CI/CD pipeline passes

## Additional Improvements (Post-Upgrade)

Once Jest 29 is stable:

1. **Enable coverage thresholds**
   ```javascript
   coverageThreshold: {
     global: {
       statements: 70,
       branches: 60,
       functions: 70,
       lines: 70,
     },
   },
   ```

2. **Add watch mode plugins**
   ```bash
   yarn add -D jest-watch-typeahead
   ```

3. **Consider jest-axe for accessibility testing**
   ```bash
   yarn add -D jest-axe
   ```

## References

- [Jest 27 Release Notes](https://jestjs.io/blog/2021/05/25/jest-27)
- [Jest 28 Release Notes](https://jestjs.io/blog/2022/04/25/jest-28)
- [Jest 29 Release Notes](https://jestjs.io/blog/2022/08/25/jest-29)
- [React Testing Library Setup](https://testing-library.com/docs/react-testing-library/setup)
