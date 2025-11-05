# Remote Access Login System

## Overview

The **Dual Login System** provides administrative remote access to any merchant account using OTP verification. This allows support staff to securely access merchant dashboards without requiring the merchant's password.

## Features

### 🔐 Security Features
- **Email Whitelist**: Only `citywittymerchant@gmail.com` can use remote access
- **OTP Verification**: 6-digit one-time password sent via email
- **Time-Limited**: OTPs expire after 10 minutes
- **Merchant ID Validation**: Must provide valid merchant ID
- **Status Checks**: Suspended accounts cannot be accessed
- **JWT Token Flag**: Remote access sessions are marked with `remoteAccess: true`
- **Auto-Cleanup**: OTPs are automatically deleted from database after expiry

### 🎨 User Experience
- **Automatic Mode Detection**: UI switches to remote access mode when admin email is detected
- **Visual Differentiation**: Orange/red theme for admin access vs blue for standard login
- **Real-time Timer**: Shows OTP expiration countdown
- **Resend Functionality**: Can request new OTP after 1 minute
- **Loading States**: Clear feedback during async operations
- **Toast Notifications**: User-friendly success/error messages

## How to Use

### For Admin/Support Staff

1. **Navigate to Login Page**: Go to `/login`

2. **Enter Admin Email**: Type `citywittymerchant@gmail.com`
   - UI automatically switches to remote access mode
   - Orange/red theme appears
   - Security warning is displayed

3. **Enter Merchant ID**: Provide the target merchant's ID
   - This should be obtained from the merchant or database

4. **Request OTP**: Click "Send OTP" button
   - OTP is sent to admin email
   - 10-minute countdown timer starts
   - Email field is locked to prevent changes

5. **Enter OTP**: Type the 6-digit code from email
   - Numbers only, auto-formatted
   - Resend option available after 1 minute

6. **Login**: Click "Verify & Login"
   - System verifies OTP and merchant ID
   - Logs you into the merchant's account
   - Redirects to merchant dashboard

### For Regular Merchants

- Standard login flow remains unchanged
- Email + Password authentication
- No impact from remote access system

## Technical Implementation

### Database Schema

**RemoteAccessOTP Model** (`models/RemoteAccessOTP.ts`):
```typescript
{
  email: String (unique, lowercase)
  otp: String (6 digits)
  expiresAt: Date
  createdAt: Date (with TTL index - auto-deletes after 600 seconds)
}
```

### API Endpoints

#### 1. Send OTP - `POST /api/auth/remote-access/send-otp`

**Request Body**:
```json
{
  "email": "citywittymerchant@gmail.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

**Features**:
- Validates email against whitelist
- Generates random 6-digit OTP
- Stores in MongoDB with 10-minute expiry
- Sends formatted email with OTP
- Uses TTL index for auto-cleanup

#### 2. Verify & Login - `POST /api/auth/remote-access/verify-login`

**Request Body**:
```json
{
  "email": "citywittymerchant@gmail.com",
  "otp": "123456",
  "merchantId": "MERCHANT_ID_HERE"
}
```

**Response**:
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "merchant": {
    "id": "...",
    "email": "merchant@example.com",
    "businessName": "Business Name",
    "role": "merchant",
    "merchantId": "...",
    "remoteAccess": true
  }
}
```

**Features**:
- Verifies OTP matches and hasn't expired
- Looks up merchant by merchantId
- Checks merchant account status
- Generates JWT with `remoteAccess: true` flag
- Deletes OTP after successful verification
- Returns merchant credentials for session

### UI Components

**Login Page** (`app/login/page.tsx`):
- Automatic mode switching based on email
- Conditional rendering of fields
- Real-time countdown timer
- Multi-step OTP flow
- Visual theme changes
- Security warnings

### Security Measures

1. **Email Validation**: Only whitelisted email accepted
2. **OTP Expiry**: 10-minute time limit
3. **Single Use**: OTP deleted after successful verification
4. **Merchant Validation**: Account must exist and be active
5. **JWT Flagging**: Remote sessions marked for audit trails
6. **Rate Limiting**: Resend throttled to prevent spam

## Testing

### Test the Flow

1. **Send OTP**:
```bash
POST /api/auth/remote-access/send-otp
{
  "email": "citywittymerchant@gmail.com"
}
```

2. **Check Email**: Look for 6-digit code

3. **Verify & Login**:
```bash
POST /api/auth/remote-access/verify-login
{
  "email": "citywittymerchant@gmail.com",
  "otp": "123456",
  "merchantId": "VALID_MERCHANT_ID"
}
```

4. **Access Dashboard**: Use returned token

### Expected Behaviors

✅ **Valid OTP + Valid Merchant**: Login successful  
❌ **Invalid OTP**: "Invalid OTP" error  
❌ **Expired OTP**: "OTP has expired" error  
❌ **Invalid Merchant ID**: "Merchant not found" error  
❌ **Suspended Account**: "This merchant account is suspended" error  
❌ **Wrong Email**: "Unauthorized email address" error

## Troubleshooting

### OTP Not Received
- Check spam/junk folder
- Verify email configuration in `.env.local`
- Check nodemailer logs
- Ensure `sendEmail` function is working

### OTP Expired
- Request new OTP
- OTPs are valid for 10 minutes only
- Check system time synchronization

### Merchant Not Found
- Verify merchantId is correct
- Check merchant exists in database
- Ensure merchantId field matches

### Cannot Access Suspended Account
- This is intentional for security
- Reactivate merchant account first
- Check merchant status in database

## Future Enhancements

### Recommended Improvements

1. **Audit Logging**
   - Log all remote access sessions
   - Track who accessed which accounts
   - Record actions performed during session

2. **Merchant Notifications**
   - Email merchant when remote access is used
   - In-app notification in dashboard
   - Audit trail visible to merchant

3. **Enhanced Security**
   - Shorter JWT expiry for remote sessions (e.g., 2 hours)
   - Session time limits
   - Activity monitoring

4. **Multiple Admin Emails**
   - Support team members
   - Role-based access control
   - Different permission levels

5. **IP Whitelisting**
   - Restrict to office IPs
   - VPN requirement
   - Geographic restrictions

6. **2FA Enhancement**
   - SMS OTP option
   - Authenticator app support
   - Backup codes

## Configuration

### Environment Variables

Required in `.env.local`:
```env
# JWT Secret
JWT_SECRET=your-secret-key

# Email Configuration (for nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Customize Admin Email

To change the whitelisted email, update these files:

1. **Login Page** (`app/login/page.tsx`):
```typescript
const ADMIN_EMAIL = 'your-admin@example.com';
```

2. **Send OTP API** (`app/api/auth/remote-access/send-otp/route.ts`):
```typescript
const ADMIN_EMAIL = 'your-admin@example.com';
```

3. **Verify Login API** (`app/api/auth/remote-access/verify-login/route.ts`):
```typescript
const ADMIN_EMAIL = 'your-admin@example.com';
```

## Support

For issues or questions:
1. Check merchant account status in database
2. Verify email configuration
3. Review API error logs
4. Test OTP delivery manually
5. Check MongoDB connection and indexes

---

**Last Updated**: 2025  
**Version**: 1.0  
**Status**: Production Ready ✅