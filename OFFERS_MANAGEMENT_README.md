# Offers Management System - Implementation Guide

## Overview
The Offers Management system has been successfully implemented with full CRUD (Create, Read, Update, Delete) functionality, integrated with the MongoDB database using the `offlineDiscount` schema.

## Files Modified/Created

### 1. API Route: `/app/api/merchant/offers/route.ts`
**New File** - Handles all backend operations for offers management.

#### Endpoints:

- **GET** `/api/merchant/offers?merchantId={id}`
  - Fetches all offers for a specific merchant
  - Returns: `{ success: true, offers: [...] }`

- **POST** `/api/merchant/offers`
  - Creates a new offer
  - Body: `{ merchantId, category, offerTitle, offerDescription, discountValue, discountPercent, status, validUpto }`
  - Returns: `{ success: true, message: "Offer created successfully", offers: [...] }`

- **PUT** `/api/merchant/offers`
  - Updates an existing offer
  - Body: `{ merchantId, offerId, ...updateData }`
  - Returns: `{ success: true, message: "Offer updated successfully", offers: [...] }`

- **DELETE** `/api/merchant/offers?merchantId={id}&offerId={id}`
  - Deletes an offer
  - Returns: `{ success: true, message: "Offer deleted successfully", offers: [...] }`

### 2. Component: `/components/dashboard/offers-management.tsx`
**Updated** - Fully dynamic component with database integration.

## Schema Structure (offlineDiscount)

Based on `models/partner/offlineDiscount.schema.ts`:

```typescript
{
  category: String (required),
  offerTitle: String (required),
  offerDescription: String (required),
  discountValue: Number (required),
  discountPercent: Number (required),
  status: String (enum: ["Active", "Inactive"], default: "Active"),
  validUpto: Date (required)
}
```

## Features Implemented

### ✅ Create Offers
- Beautiful modal form with all required fields
- Real-time validation
- Support for both discount value (₹) and discount percent (%)
- Category selection
- Status selection (Active/Inactive)
- Date picker for validity period
- Loading states during submission

### ✅ Read/Display Offers
- Grid layout (responsive: 1 column on mobile, 2 on tablet, 3 on desktop)
- Beautiful card design for each offer
- Status badges (Active/Inactive/Expired)
- Category tags
- Automatic expiry detection
- Empty state with call-to-action
- Loading spinner while fetching data

### ✅ Update Offers
- Edit button on each offer card
- Pre-populated form with existing data
- Same validation as create
- Separate edit dialog
- Real-time updates

### ✅ Delete Offers
- Delete button on each offer card
- Confirmation dialog before deletion
- Instant UI update after deletion
- Error handling

## Form Fields

1. **Category** (Required)
   - Text input
   - Example: Electronics, Fashion, Food

2. **Offer Title** (Required)
   - Text input
   - Example: "20% Off on Electronics"

3. **Offer Description** (Required)
   - Textarea (3 rows)
   - Detailed description of the offer

4. **Discount Value** (Optional)
   - Number input (₹)
   - Example: 500

5. **Discount Percent** (Optional)
   - Number input (%)
   - Range: 0-100
   - Example: 20

6. **Status** (Required)
   - Dropdown select
   - Options: Active, Inactive
   - Default: Active

7. **Valid Until** (Required)
   - Date picker
   - Minimum: Today's date
   - Automatically marks as expired after this date

## Validation Rules

1. Category must not be empty
2. Offer title must not be empty
3. Offer description must not be empty
4. At least one of discountValue or discountPercent must be greater than 0
5. Discount percent cannot exceed 100%
6. Valid until date is required

## UI/UX Features

### Design Elements
- Gradient buttons (blue to indigo)
- Hover effects on cards
- Responsive grid layout
- Icon integration (Lucide React)
- Toast notifications for all actions
- Loading states and spinners
- Empty state illustration

### Status Indicators
- **Active** (Green badge) - Offer is currently active
- **Inactive** (Gray badge) - Offer is manually disabled
- **Expired** (Red badge) - Offer validity date has passed

### Card Information Display
- Offer title (prominent)
- Status and category badges
- Description (truncated to 2 lines)
- Discount percent (if > 0)
- Discount value (if > 0)
- Valid until date (red if expired)

## Integration with Auth Context

The component uses `useMerchantAuth()` hook to:
- Get the current merchant's ID
- Ensure only authenticated merchants can manage offers
- Automatically fetch offers on component mount

## Error Handling

- Network errors are caught and displayed via toast
- API errors are properly handled and shown to users
- Form validation prevents invalid submissions
- Confirmation dialogs prevent accidental deletions

## Toast Notifications

Success messages:
- ✅ "Offer created successfully!"
- ✅ "Offer updated successfully!"
- ✅ "Offer deleted successfully!"

Error messages:
- ❌ "Category is required"
- ❌ "Offer title is required"
- ❌ "Please provide either discount value or discount percent"
- ❌ "Discount percent cannot exceed 100%"
- ❌ "Failed to create/update/delete offer"

## Testing the Implementation

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to Dashboard
- Login as a merchant
- Go to the Offers section in the dashboard

### 3. Test Create Operation
1. Click "Add New Offer" button
2. Fill in all required fields
3. Click "Create Offer"
4. Verify the offer appears in the grid

### 4. Test Edit Operation
1. Click the edit icon on any offer card
2. Modify some fields
3. Click "Update Offer"
4. Verify changes are reflected

### 5. Test Delete Operation
1. Click the delete icon on any offer card
2. Confirm the deletion
3. Verify the offer is removed from the grid

### 6. Test Validation
1. Try creating an offer without required fields
2. Try setting discount percent > 100
3. Verify appropriate error messages appear

## Database Storage

Offers are stored in the Partner collection under the `offlineDiscount` array field:

```javascript
{
  _id: ObjectId("..."),
  merchantId: "...",
  displayName: "...",
  // ... other partner fields
  offlineDiscount: [
    {
      category: "Electronics",
      offerTitle: "20% Off on Electronics",
      offerDescription: "Get 20% discount on all electronic items",
      discountValue: 0,
      discountPercent: 20,
      status: "Active",
      validUpto: ISODate("2025-02-28T00:00:00.000Z")
    },
    // ... more offers
  ]
}
```

## Future Enhancements (Optional)

1. **Analytics**
   - Track how many times an offer was viewed
   - Track how many times an offer was used
   - Add usage statistics to the cards

2. **Bulk Operations**
   - Select multiple offers
   - Bulk activate/deactivate
   - Bulk delete

3. **Advanced Filters**
   - Filter by status
   - Filter by category
   - Search by title
   - Sort by date, discount, etc.

4. **Offer Templates**
   - Save frequently used offer templates
   - Quick create from templates

5. **Notifications**
   - Email notifications when offers are about to expire
   - Remind merchants to renew popular offers

6. **QR Code Generation**
   - Generate QR codes for each offer
   - Customers can scan to view offer details

## Troubleshooting

### Issue: Offers not loading
- Check if merchant is logged in
- Verify merchantId is being passed correctly
- Check browser console for errors
- Verify MongoDB connection

### Issue: Create/Update not working
- Check network tab for API errors
- Verify all required fields are filled
- Check MongoDB connection
- Review server logs

### Issue: Delete not working
- Verify offerId is being passed correctly
- Check if confirmation dialog is appearing
- Review server logs for errors

## Code Quality

- ✅ TypeScript for type safety
- ✅ Proper error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Accessible form labels
- ✅ Clean code structure
- ✅ Reusable form component
- ✅ Proper state management

## Conclusion

The Offers Management system is now fully functional with:
- Complete CRUD operations
- Database integration
- Beautiful, responsive UI
- Comprehensive validation
- Error handling
- User-friendly notifications

The system is production-ready and can be extended with additional features as needed.