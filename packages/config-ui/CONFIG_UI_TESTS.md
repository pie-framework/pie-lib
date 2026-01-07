# Config-UI Package - Test Fixes Plan

## Current Status
- **Tests Passing**: 37/71 (52%)
- **Tests Failing**: 33 (48%)
- **Migration Status**: Enzyme to RTL migration in progress

## Root Causes of Failures

### 1. MUI v5 Role Changes
Material-UI v5 changed the accessibility roles for several components:
- **Switch**: Changed from `role="checkbox"` to `role="switch"`
- **Number TextField**: Changed from `role="textbox"` to `role="spinbutton"`
- **Other input variants**: May have different roles than MUI v4

### 2. Value Type Changes
MUI v5 is stricter about value types:
- **Number inputs**: Now expect numeric values (e.g., `5`) instead of strings (e.g., `"5"`)
- **onChange events**: May pass different value types in event handlers

### 3. MUI v5 API Changes
Components may have different props or behaviors:
- Removed or renamed props
- Different default values
- Changed event signatures

### 4. ARIA Attribute Changes
MUI v5 improved accessibility, which affects test queries:
- More specific ARIA labels
- Additional ARIA attributes
- Better semantic HTML structure

## Fix Strategy

### Phase 1: Role-Based Query Updates (Priority: High)
**Goal**: Update all RTL queries to use correct MUI v5 roles

Files already partially fixed:
- [x] `src/__tests__/settings-panel.test.js` - Switch role updated
- [x] `src/__tests__/number-text-field.test.jsx` - Spinbutton role updated

Files still needing fixes:
- [ ] `src/__tests__/langs.test.jsx`
- [ ] `src/__tests__/two-choice.test.js`
- [ ] `src/choice-configuration/__tests__/feedback-menu.test.jsx`
- [ ] `src/choice-configuration/__tests__/index.test.jsx`
- [ ] `src/feedback-config/__tests__/feedback-config.test.jsx`
- [ ] `src/feedback-config/__tests__/feedback-selector.test.jsx`
- [ ] `src/layout/__tests__/config.layout.test.jsx`
- [ ] `src/tags-input/__tests__/index.test.jsx`

Common replacements:
```javascript
// OLD: MUI v4
screen.getByRole('checkbox') // for Switch
screen.getByRole('textbox')  // for number input

// NEW: MUI v5
screen.getByRole('switch')     // for Switch
screen.getByRole('spinbutton') // for number input
```

### Phase 2: Value Type Corrections (Priority: High)
**Goal**: Ensure test expectations match MUI v5 value types

Actions:
1. Change string values to numbers for numeric inputs
2. Update onChange mock assertions
3. Fix value comparisons in tests

Example:
```javascript
// OLD
expect(input).toHaveValue('5');
onChange.mockCalled.toHaveBeenCalledWith({ target: { value: '5' } });

// NEW
expect(input).toHaveValue(5);
// onChange signature may have changed - verify actual behavior
```

### Phase 3: Component-Specific Fixes (Priority: Medium)
**Goal**: Address component-specific MUI v5 changes

#### Tags Input Component
File: `src/tags-input/__tests__/index.test.jsx`
- May need different query strategies
- Chip removal might have changed
- Input interaction may be different

#### Feedback Configuration
Files:
- `src/feedback-config/__tests__/feedback-config.test.jsx`
- `src/feedback-config/__tests__/feedback-selector.test.jsx`
- May have nested component changes
- Dropdown/Select behavior might differ

#### Choice Configuration
Files:
- `src/choice-configuration/__tests__/feedback-menu.test.jsx`
- `src/choice-configuration/__tests__/index.test.jsx`
- Menu interaction may have changed
- Checkbox/radio behavior updates

### Phase 4: Integration Test Updates (Priority: Low)
**Goal**: Ensure complex component interactions work correctly

Actions:
1. Review tests that involve multiple components
2. Check form submission flows
3. Verify state updates propagate correctly
4. Test component composition scenarios

## Detailed File-by-File Plan

### High Priority Files (Blocking Many Tests)

#### 1. langs.test.jsx
**Issue**: Likely failing due to Select/Dropdown role changes
**Fix Strategy**:
- Update role queries for Select component (may be `combobox` or `button`)
- Check if options rendering changed
- Verify onChange event structure

#### 2. two-choice.test.js
**Issue**: Radio/checkbox role or structure changes
**Fix Strategy**:
- Identify actual component used (Radio, RadioGroup, ToggleButton)
- Update role queries accordingly
- Check ARIA attributes

#### 3. settings-panel.test.js (Partially Fixed)
**Current**: Switch role updated
**Remaining**: May have other failing tests
**Next Steps**:
- Run tests again to see remaining failures
- Check for other component types in the panel

#### 4. number-text-field.test.jsx (Partially Fixed)
**Current**: Spinbutton role and numeric values updated
**Remaining**: May have other failing tests
**Next Steps**:
- Verify all number field tests pass
- Check min/max validation tests

### Medium Priority Files

#### 5. feedback-menu.test.jsx
**Issue**: Menu/Popover behavior changes
**Fix Strategy**:
- Update menu trigger queries
- Check if menu items have different roles
- Verify menu open/close behavior

#### 6. feedback-config.test.jsx
**Issue**: Composite component with multiple MUI elements
**Fix Strategy**:
- Update all child component queries
- Check data flow between components
- Verify conditional rendering

#### 7. feedback-selector.test.jsx
**Issue**: Selector component role changes
**Fix Strategy**:
- Identify selector type (Select, Autocomplete, etc.)
- Update queries accordingly
- Check option selection behavior

### Lower Priority Files

#### 8. config.layout.test.jsx
**Issue**: Layout component testing
**Fix Strategy**:
- Focus on structural assertions
- May need less role-specific queries
- Check CSS/styling if relevant

#### 9. tags-input/index.test.jsx
**Issue**: Chip input behavior
**Fix Strategy**:
- Update input field query
- Check chip rendering and removal
- Verify keyboard interaction (Enter, Backspace)

## Testing Approach

### Run Tests
```bash
# Run all config-ui tests
npx jest packages/config-ui/ --no-coverage

# Run specific test file
npx jest packages/config-ui/src/__tests__/langs.test.jsx --no-coverage

# Update snapshots (we removed most, but some may remain)
npx jest packages/config-ui/ --no-coverage -u

# Run with verbose output for debugging
npx jest packages/config-ui/src/__tests__/langs.test.jsx --no-coverage --verbose
```

### Debug Strategy
1. Run tests file by file to isolate issues
2. Use `screen.logTestingPlaygroundURL()` to explore the DOM
3. Use `screen.debug()` to see current render output
4. Check MUI v5 documentation for component changes
5. Compare with working tests in other packages

## Common MUI v5 Changes Reference

### Component Role Mapping
| Component | MUI v4 Role | MUI v5 Role |
|-----------|-------------|-------------|
| Switch | checkbox | switch |
| TextField (number) | textbox | spinbutton |
| Select | button/listbox | combobox |
| Menu | menu | menu (unchanged) |
| MenuItem | menuitem | menuitem (unchanged) |
| Checkbox | checkbox | checkbox (unchanged) |
| Radio | radio | radio (unchanged) |

### Value Type Changes
- Numeric TextField: String → Number
- Date inputs: May have stricter formats
- Controlled vs uncontrolled: More strict warnings

### Props Removed/Renamed
- Some style props moved to `sx`
- `color="primary"` may need different values
- Event handler signatures may differ

## Success Criteria
- All 71 tests passing
- No console warnings about deprecated props
- Tests use correct MUI v5 roles and queries
- Value types match component expectations
- Test code follows RTL best practices

## Next Steps
1. Run all config-ui tests to get current detailed failures
2. Start with langs.test.jsx (likely highest impact)
3. Work through high-priority files first
4. Document any new patterns discovered
5. Update this plan as we learn more about the failures
6. Cross-reference with MUI v5 migration guide as needed

## Useful Resources
- [MUI v5 Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [RTL Queries Priority](https://testing-library.com/docs/queries/about/#priority)
- [RTL Accessibility Queries](https://testing-library.com/docs/queries/byrole)
