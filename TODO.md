# Fix Merchant Login 500 Error

## Tasks
- [x] Add password field to Partner schema (models/partner/partner.schema.ts)
- [x] Update registration API to hash password (app/api/partnerApplication/route.ts)
- [x] Fix businessName reference in login response (app/api/merchant/login/route.ts)
- [x] Remove double hashing from registration hook (hooks/usePartnerRegistration.ts)
- [x] Test login functionality after changes
