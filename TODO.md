# TODO: Show Merchant Logo in Sidebar

## Tasks
- [ ] Modify components/dashboard/sidebar.tsx to display merchant logo if available near name and email

## Details
- Replace the avatar div with an img tag if merchantInfo.logo exists
- Keep fallback to first letter avatar if no logo
- Ensure proper styling: w-14 h-14 rounded-full border-4 border-white object-contain
- Test the display in sidebar

## Completed Tasks
- [x] Add "Store Images" tab in profile-settings.tsx with upload functionality to Cloudinary
  - Created app/api/upload-store-images/route.ts for multiple image uploads
  - Updated components/dashboard/profile-settings.tsx to include store images management
  - Allows uploading up to 3 store images, displaying them with remove option
  - Integrates with existing profile save functionality
