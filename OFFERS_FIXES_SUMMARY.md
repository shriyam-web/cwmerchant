# Offers Management - Bug Fixes Summary

## Issues Fixed

### 1. ✅ Edit and Delete Functions Not Working
**Problem:** The edit and delete operations were failing because the schema had `_id: false`, preventing MongoDB from generating unique IDs for subdocuments.

**Solution:**
- Changed `offlineDiscount.schema.ts` to enable `_id: true` for subdocuments
- Added better error logging in the API to track offer IDs
- Added console logging in frontend to debug API calls

**Files Modified:**
- `models/partner/offlineDiscount.schema.ts` - Changed `_id: false` to `_id: true`
- `app/api/merchant/offers/route.ts` - Added error logging for debugging
- `components/dashboard/offers-management.tsx` - Added console logs for edit/delete operations

---

### 2. ✅ Allow Either Discount Value OR Discount Percent
**Problem:** The validation was requiring both discount fields to be filled, but merchants should be able to enter just one.

**Solution:**
- Updated validation to only require at least ONE discount type (value OR percent) to be greater than 0
- Set default values to 0 for both discount fields in the schema
- Merchants can now enter:
  - Only discount value (e.g., ₹500 off)
  - Only discount percent (e.g., 20% off)
  - Both (e.g., ₹500 or 20% off, whichever is higher)

**Files Modified:**
- `app/api/merchant/offers/route.ts` - Updated validation logic
- `models/partner/offlineDiscount.schema.ts` - Added default: 0 for discount fields

---

### 3. ✅ Auto-Clear Valid Until Date When Status is Inactive
**Problem:** When merchants set an offer to "Inactive", the valid until date should be cleared automatically since inactive offers don't need an expiry date.

**Solution:**
- Modified the status dropdown to automatically clear `validUpto` when "Inactive" is selected
- Made the "Valid Until" field disabled when status is "Inactive"
- Updated the label to show "(Optional)" for inactive offers
- Updated validation to only require `validUpto` for Active offers

**Files Modified:**
- `components/dashboard/offers-management.tsx` - Updated status change handler and validation
- `app/api/merchant/offers/route.ts` - Updated backend validation

---

## Changes Summary

### Schema Changes (`models/partner/offlineDiscount.schema.ts`)
```typescript
// Before
{
    discountValue: { type: Number, required: true },
    discountPercent: { type: Number, required: true },
    validUpto: { type: Date, required: true },
},
{ _id: false }

// After
{
    discountValue: { type: Number, required: true, default: 0 },
    discountPercent: { type: Number, required: true, default: 0 },
    validUpto: { type: Date, required: false },
},
{ _id: true }  // Enable _id for subdocuments
```

### API Validation Changes (`app/api/merchant/offers/route.ts`)
- Removed `discountValue`, `discountPercent`, and `validUpto` from required fields array
- Added custom validation: At least one discount type must be > 0
- Added validation: `validUpto` only required for Active offers
- Added error logging for debugging edit/delete issues

### Component Changes (`components/dashboard/offers-management.tsx`)
- Status dropdown now clears `validUpto` when "Inactive" is selected
- Valid Until field is disabled when status is "Inactive"
- Label changes from "Valid Until *" to "Valid Until (Optional)" for inactive offers
- Validation only requires `validUpto` for Active offers
- Added console logging for debugging

---

## Testing Checklist

### Test Case 1: Create Offer with Only Discount Value
- [x] Create offer with discountValue = 500, discountPercent = 0
- [x] Verify offer is created successfully
- [x] Verify only discount value is displayed on the card

### Test Case 2: Create Offer with Only Discount Percent
- [x] Create offer with discountValue = 0, discountPercent = 20
- [x] Verify offer is created successfully
- [x] Verify only discount percent is displayed on the card

### Test Case 3: Create Inactive Offer
- [x] Set status to "Inactive"
- [x] Verify "Valid Until" field is disabled
- [x] Verify label shows "(Optional)"
- [x] Create offer without setting valid until date
- [x] Verify offer is created successfully

### Test Case 4: Edit Offer
- [x] Click edit button on any offer
- [x] Modify some fields
- [x] Click "Update Offer"
- [x] Check browser console for logs
- [x] Verify offer is updated successfully

### Test Case 5: Delete Offer
- [x] Click delete button on any offer
- [x] Confirm deletion
- [x] Check browser console for logs
- [x] Verify offer is removed from the list

### Test Case 6: Change Status from Active to Inactive
- [x] Edit an active offer
- [x] Change status to "Inactive"
- [x] Verify "Valid Until" field is cleared and disabled
- [x] Update the offer
- [x] Verify changes are saved

---

## Important Notes

1. **Database Migration**: Existing offers in the database may not have `_id` fields. After deploying these changes:
   - New offers will automatically get `_id` fields
   - Existing offers without `_id` may need to be recreated or migrated

2. **Backward Compatibility**: The changes maintain backward compatibility:
   - Offers with both discount types still work
   - Active offers with valid until dates still work
   - The UI gracefully handles missing discount values (shows only the ones > 0)

3. **Validation Rules**:
   - Category, title, and description are always required
   - At least ONE discount type (value OR percent) must be > 0
   - Valid until date is ONLY required for Active offers
   - Discount percent cannot exceed 100%

4. **Console Logging**: Added temporary console logs for debugging. These can be removed once the functionality is confirmed to be working correctly.

---

## Files Modified

1. ✅ `models/partner/offlineDiscount.schema.ts`
2. ✅ `app/api/merchant/offers/route.ts`
3. ✅ `components/dashboard/offers-management.tsx`
4. ✅ `app/api/merchant/offers/migrate/route.ts` (NEW - Migration endpoint)

---

## Migration Feature

### Problem
Existing offers in the database were created with `_id: false` and don't have unique identifiers. This prevents edit and delete operations from working.

### Solution
Created an automatic migration system:

1. **Migration API Endpoint** (`/api/merchant/offers/migrate`)
   - Detects offers without `_id` fields
   - Recreates them with MongoDB auto-generated IDs
   - Preserves all offer data

2. **Migration UI Banner**
   - Automatically appears when offers without IDs are detected
   - Shows count of offers needing migration
   - One-click migration button
   - Yellow warning banner with clear instructions

3. **Graceful Degradation**
   - Edit/Delete buttons are disabled for offers without IDs
   - Tooltip explains why buttons are disabled
   - Console logs help debug ID issues

### How to Use Migration

1. Login to merchant dashboard
2. Go to Offers section
3. If you see a yellow banner, click "Migrate Now"
4. Wait for migration to complete
5. All offers will now have edit/delete functionality

---

## Next Steps

1. ✅ Test all functionality in development environment
2. ✅ Check browser console for any errors during edit/delete operations
3. ✅ Verify database entries have `_id` fields for new offers
4. ✅ Use migration feature for existing offers
5. Remove console.log statements once confirmed working (optional)
6. Update main documentation if needed