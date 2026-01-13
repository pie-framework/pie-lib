# ESLint Upgrade Plan: v5 → v8

## Current State
- **ESLint**: `^5.12.0` (released 2019)
- **Parser**: `babel-eslint ^10.0.1` (deprecated)
- **Plugins**: 
  - `eslint-plugin-react ^7.12.3`
  - `eslint-config-prettier ^4.1.0`
  - `eslint-plugin-prettier ^3.0.1`

## Target State (Based on pie-elements)
- **ESLint**: `^8.57.0` (ESLint 8 - stable, well-tested)
- **Parser**: `@babel/eslint-parser ^7.23.0` (official Babel parser)
- **Plugin**: `eslint-plugin-react ^7.34.0`
- **Note**: Prettier integration removed from ESLint (run Prettier separately)

## Upgrade Steps

### Step 1: Update package.json dependencies

**Remove:**
```json
"babel-eslint": "^10.0.1",
"eslint-config-prettier": "^4.1.0",
"eslint-plugin-prettier": "^3.0.1",
```

**Update:**
```json
"eslint": "^8.57.0",  // was ^5.12.0
"eslint-plugin-react": "^7.34.0",  // was ^7.12.3
```

**Add:**
```json
"@babel/eslint-parser": "^7.23.0",
```

### Step 2: Update `.eslintrc.json`

**Key Changes:**
1. Change parser from `babel-eslint` to `@babel/eslint-parser`
2. Remove `plugin:prettier/recommended` from extends
3. Remove `prettier` plugin
4. Add `requireConfigFile: false` to parserOptions
5. Add `babelOptions` to parserOptions
6. Change `jsx-uses-vars` rule from boolean to `react/jsx-uses-vars: "warn"`
7. Remove `prettier/prettier` rule

**Updated `.eslintrc.json`:**
```json
{
  "parser": "@babel/eslint-parser",
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": false,
    "jest": true
  },
  "parserOptions": {
    "requireConfigFile": false,
    "ecmaFeatures": {
      "jsx": true
    },
    "babelOptions": {
      "presets": ["@babel/preset-react"]
    },
    "sourceType": "module"
  },
  "rules": {
    "quotes": ["warn", "single"],
    "strict": 0,
    "react/prop-types": "warn",
    "react/jsx-no-duplicate-props": "warn",
    "react/no-deprecated": "warn",
    "react/display-name": "warn",
    "react/jsx-uses-vars": "warn",
    "no-extra-semi": "warn",
    "no-dupe-keys": "warn",
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    "no-unused-vars": "warn",
    "constructor-super": "warn",
    "valid-typeof": "warn",
    "no-case-declarations": "warn",
    "no-console": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### Step 3: Update `scripts/.eslintrc.json`

**Key Changes:**
1. Change parser from `babel-eslint` to `@babel/eslint-parser`
2. Add `requireConfigFile: false` to parserOptions

**Updated `scripts/.eslintrc.json`:**
```json
{
  "parser": "@babel/eslint-parser",
  "extends": ["eslint:recommended"],
  "env": {
    "node": true
  },
  "parserOptions": {
    "requireConfigFile": false,
    "sourceType": "module"
  },
  "rules": {
    "quotes": ["warn", "single"],
    "strict": 0,
    "no-extra-semi": "warn",
    "no-dupe-keys": "warn",
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    "no-unused-vars": "warn",
    "constructor-super": "warn",
    "valid-typeof": "warn",
    "no-case-declarations": "warn",
    "no-console": "warn"
  }
}
```

### Step 4: Install dependencies

```bash
yarn install
```

### Step 5: Test the upgrade

```bash
# Run ESLint to check for any issues
yarn lint

# Fix auto-fixable issues
yarn lint --fix
```

### Step 6: Handle Prettier separately (if needed)

Since we're removing Prettier integration from ESLint, ensure Prettier runs separately:

```bash
# Check if prettier script exists
# If not, add to package.json scripts:
"format": "prettier --write \"**/*.{js,jsx,json,md}\""
```

## Breaking Changes & Migration Notes

### 1. Parser Change (`babel-eslint` → `@babel/eslint-parser`)
- **Impact**: Low - mostly transparent, but requires `requireConfigFile: false` if no `.babelrc`
- **Action**: Update parser in both `.eslintrc.json` files

### 2. Prettier Integration Removal
- **Impact**: Medium - Prettier will no longer run as part of ESLint
- **Action**: 
  - Remove `eslint-plugin-prettier` and `eslint-config-prettier`
  - Remove `plugin:prettier/recommended` from extends
  - Remove `prettier/prettier` rule
  - Run Prettier separately if needed

### 3. Rule Changes
- **Impact**: Low - mostly compatible
- **Action**: 
  - Change `jsx-uses-vars: true` → `react/jsx-uses-vars: "warn"`
  - Some deprecated rules may need updates

### 4. ESLint 8 New Rules
- **Impact**: Low - new rules are opt-in
- **Action**: Review any new warnings/errors after upgrade

## Potential Issues

1. **Parser Configuration**: If you have a `.babelrc` or `babel.config.js`, you may need to adjust `requireConfigFile` setting
2. **Prettier Conflicts**: If Prettier and ESLint rules conflict, they'll need to be resolved manually
3. **Deprecated Rules**: Some rules may be deprecated in ESLint 8
4. **Plugin Compatibility**: Ensure all ESLint plugins are compatible with ESLint 8

## Rollback Plan

If issues arise:
1. Revert `package.json` changes
2. Revert `.eslintrc.json` changes
3. Run `yarn install`
4. Investigate specific errors before retrying

## Testing Checklist

- [ ] ESLint runs without errors
- [ ] All existing code passes linting
- [ ] No new false positives
- [ ] Prettier still works (if used separately)
- [ ] CI/CD pipeline passes
- [ ] No performance degradation

## Next Steps (Optional - Future)

Consider upgrading to ESLint 9 in the future:
- ESLint 9 uses flat config format (new configuration system)
- Requires more significant changes
- Better performance and features
- Currently in beta/RC phase
