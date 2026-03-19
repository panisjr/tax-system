# Tax Declaration New Page Validator Refactor
Current Working Directory: c:/Users/Symphonics Co. Ltd/Desktop/tax-system/app/property/new-td/page.tsx

## Steps (3/7 completed)

### 1. ✅ Gather file contents & analyze (search_files, read_file done)

### 2. ✅ Create TODO.md & confirm plan (this file)

### 3. ✅ Add new validators/masks to components/ui
   - masks.ts: `maskPin`, `maskArpNumber`, `maskLotNumber`, `maskDecimalNumeric`
   - validators.ts: `'pin'`, `'arp-number'`, `'lot-number'`, `'decimal-numeric'`
   - Fixed TypeScript errors (MaskKey, param types)

### 4. Replace Field → ValidatedInput in page.tsx [PENDING]
   - Delete all custom format funcs & Field component (~150 LOC)
   - Map: TD='td-number', PIN='pin', ARP='arp-number', Lot/Block/Survey='lot-number', numerics='decimal-numeric'
   - Readonly fields: 'text' readOnly

### 5. Update imports & numeric calculations [PENDING]
   - Import `ValidatedInput`, `cn`
   - Numeric onChange: parseFloat(v.replace(/,/g,'')) for calcs, format display

### 6. Test form & save [PENDING]
   - `npm run dev`
   - Verify masking, validation icons/errors, auto-calcs, API payload

### 7. Final cleanup & complete [PENDING]

**Progress: 3/7**
