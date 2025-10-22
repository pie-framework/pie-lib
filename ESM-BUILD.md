# ESM Build Support

This repository now supports building ESM (ECMAScript Module) bundles alongside the existing CommonJS builds.

## Commands

```bash
# Build everything (CommonJS + ESM) - DEFAULT
yarn build

# Build only CommonJS
yarn build:cjs

# Build only ESM
yarn build:esm

# Run tests
node scripts/test-esm.mjs                    # Validate ESM bundles
node scripts/test-backward-compat.cjs        # Test backward compatibility
bash scripts/test-integration.sh             # Run all tests
```

## Structure

Each package that supports ESM will have:

```
packages/my-package/
├── lib/            # CommonJS build (existing)
├── esm/            # ESM build (new, gitignored)
├── src/            # Source files
└── package.json    # With exports field
```

## Package.json Configuration

```json
{
  "main": "lib/index.js",      // CommonJS (for old tools)
  "module": "src/index.js",    // Source ESM (for old bundlers)
  "exports": {
    ".": {
      "import": "./esm/index.js",   // ESM (for modern bundlers, esm.sh)
      "require": "./lib/index.js",  // CommonJS (for Node.js, PSLB)
      "default": "./esm/index.js"
    }
  }
}
```

## Backward Compatibility

✅ **Fully backward compatible**
- CommonJS builds (`lib/`) are preserved
- IIFE builds (via PSLB/webpack) continue to work
- Old tools that don't understand `exports` use `main` field
- `require()` routes to CommonJS via `exports.require`

## Publishing

When publishing packages:

1. Build everything:
   ```bash
   yarn build    # Builds both CommonJS (lib/) and ESM (esm/)
   ```

2. Publish to npm:
   ```bash
   lerna publish  # For production (builds both formats automatically)
   ```

Both `lib/` and `esm/` directories are included in the published package.

**Note:** `yarn build` now builds BOTH formats by default to prevent accidental incomplete publishes.

## Adding ESM Support to New Packages

1. Ensure package has `src/index.js` entry point
2. Run `yarn build:esm` (automatically includes package)
3. Run `node scripts/add-exports.js` to add exports field
4. Commit the updated `package.json`

## Blacklisted Packages

Some packages cannot be built as ESM:
- `demo` - Not a library package
- `pie-toolbox` - Special structure

These are skipped automatically by `build-esm.js`.

