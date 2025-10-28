# 🔔 CityWitty Merchant Notification System

> A complete, production-ready notification system for the merchant dashboard with admin-friendly management and beautiful UI.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Files Structure](#files-structure)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Documentation](#documentation)

## 🌟 Overview

This notification system allows administrators to send targeted or broadcast notifications to merchants through their dashboard. Notifications appear in a dedicated tab with real-time unread count badges and rich filtering capabilities.

### What Merchants See:
- 🔔 **Badge in Sidebar**: Unread notification count (auto-hides when zero)
- 📱 **Dedicated Tab**: Full notification center with search and filters
- 🎨 **Color-Coded Types**: Info (blue), Success (green), Warning (yellow), Error (red), Announcement (purple)
- 🏷️ **Priority Levels**: Low, Medium, High, Urgent (with animation)
- ⏱️ **Smart Timestamps**: "5m ago", "2h ago", "3d ago"
- 🔗 **Action Links**: Direct links to relevant dashboard sections
- ✅ **Mark as Read**: Individual or bulk actions

### What Admins Can Do:
- 📢 **Broadcast**: Send to all merchants at once
- 🎯 **Target**: Send to specific merchants by ID
- ⏰ **Schedule**: Set expiration dates for time-sensitive notices
- 📝 **Draft**: Create and edit before sending
- 🗄️ **Archive**: Organize old notifications

## ✨ Features

✅ **Smart Filtering**
- By status (sent, draft, archived)
- By target audience (all, merchant, customer)
- By specific merchant IDs
- Automatic expiration handling

✅ **Rich UI**
- Responsive design (desktop, tablet, mobile)
- Search by title/message
- Filter by type (all, unread, info, success, warning, error, announcement)
- Empty state messages
- Loading states
- Smooth animations

✅ **Real-time Updates**
- Dynamic badge counts
- Auto-refresh on mark as read
- Instant UI updates

✅ **Admin-Friendly**
- Easy database insertion
- Interactive CLI tool
- Pre-built templates
- Comprehensive documentation

## 🚀 Quick Start

### For Developers - Setup (Already Done!)

The notification system is already integrated. Files created:
- ✅ Database model
- ✅ API endpoints
- ✅ UI component
- ✅ Dashboard integration
- ✅ Documentation

### For Admins - Send Your First Notification

#### Option 1: MongoDB Shell/Compass (Fastest)

```javascript
db.notifications.insertOne({
  title: "Welcome to CityWitty!",
  message: "Thank you for joining our platform. Complete your profile to get started.",
  type: "info",
  status: "sent",
  target_audience: "merchant",
  target_ids: null,  // null = ALL merchants
  priority: "medium",
  link: "/dashboard?tab=profile",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

#### Option 2: Interactive CLI Tool

```bash
# Set MongoDB URI in .env.local first
node scripts/createNotification.js
```

Follow the prompts to create your notification!

#### Option 3: Import Test Data

```bash
# Import 15 sample notifications for testing
node scripts/importTestNotifications.js
```

### For Merchants - View Notifications

1. Login to your dashboard
2. Look for the bell icon in the sidebar
3. Badge shows unread count (if any)
4. Click "Notifications" to view all
5. Click any notification to mark as read
6. Use search/filter to find specific ones

## 📁 Files Structure

```
project/
├── models/
│   └── Notification.ts                    # MongoDB schema
├── app/
│   └── api/
│       └── merchant/
│           └── notifications/
│               └── route.ts               # API endpoints
├── components/
│   └── dashboard/
│       ├── notifications.tsx              # Main UI component
│       └── sidebar.tsx                    # Modified (badge integration)
├── app/
│   └── dashboard/
│       └── page.tsx                       # Modified (component integration)
├── scripts/
│   ├── createNotification.js              # Interactive CLI tool
│   ├── importTestNotifications.js         # Import test data
│   └── testNotifications.json             # Sample notifications
└── docs/
    ├── NOTIFICATIONS_SYSTEM.md            # Full technical docs
    ├── NOTIFICATIONS_QUICK_REFERENCE.md   # Quick command reference
    ├── NOTIFICATIONS_IMPLEMENTATION_SUMMARY.md
    └── README_NOTIFICATIONS.md            # This file
```

## 📖 Usage Guide

### Creating Notifications

#### Broadcast to All Merchants
```javascript
{
  target_audience: "merchant",
  target_ids: null  // null = broadcast
}
```

#### Send to Specific Merchants
```javascript
{
  target_audience: "merchant",
  target_ids: ["merchant_id_1", "merchant_id_2"]
}
```

#### With Action Link
```javascript
{
  title: "Complete Your Profile",
  message: "Add missing information...",
  link: "/dashboard?tab=profile"  // Direct link
}
```

#### With Expiration
```javascript
{
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)  // 7 days
}
```

### Notification Types

| Type | Color | Icon | Use For |
|------|-------|------|---------|
| `info` | Blue | ℹ️ | General updates, news |
| `success` | Green | ✓ | Confirmations, approvals |
| `warning` | Yellow | ⚠️ | Warnings, reminders |
| `error` | Red | ✕ | Errors, urgent issues |
| `announcement` | Purple | 📢 | New features, major news |

### Priority Levels

| Priority | Badge | Use For |
|----------|-------|---------|
| `low` | Gray | Non-urgent info |
| `medium` | Blue | Standard notifications |
| `high` | Orange | Important, time-sensitive |
| `urgent` | Red (animated) | Critical, immediate action |

## 🔌 API Reference

### GET `/api/merchant/notifications`

Fetch notifications for a merchant.

**Query Parameters:**
- `merchantId` (required): Merchant's ID

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "...",
      "title": "Welcome!",
      "message": "...",
      "type": "info",
      "priority": "medium",
      "link": "/dashboard",
      "createdAt": "2024-12-19T10:00:00Z",
      "isRead": false
    }
  ],
  "unreadCount": 5
}
```

### PATCH `/api/merchant/notifications`

Mark notification as read.

**Body:**
```json
{
  "notificationId": "notification_id",
  "merchantId": "merchant_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

## 🧪 Testing

### Step 1: Import Test Data
```bash
node scripts/importTestNotifications.js
```

This imports 15 diverse sample notifications covering all types and priorities.

### Step 2: Login as Merchant
- Login to your dashboard
- Navigate to different pages
- Check if badge appears in sidebar

### Step 3: Test Features
- ✓ Click "Notifications" tab
- ✓ Verify 15 notifications appear
- ✓ Test search functionality
- ✓ Test filter dropdown
- ✓ Click a notification (should mark as read)
- ✓ Verify badge count decreases
- ✓ Click "Mark All as Read"
- ✓ Verify badge disappears

### Step 4: Test Edge Cases
- ✓ Empty state (delete all notifications)
- ✓ Search with no results
- ✓ Filter with no matches
- ✓ Expired notifications (don't show)

## 📚 Documentation

### Quick References
- **`NOTIFICATIONS_QUICK_REFERENCE.md`**: MongoDB commands, examples, pro tips
- **`NOTIFICATIONS_SYSTEM.md`**: Complete technical documentation
- **`NOTIFICATIONS_IMPLEMENTATION_SUMMARY.md`**: What was built, how it works

### Code Examples

#### Create Welcome Notification
```javascript
db.notifications.insertOne({
  title: "Welcome to CityWitty! 🎉",
  message: "Thank you for joining us. Complete your profile to get started.",
  type: "info",
  status: "sent",
  target_audience: "merchant",
  target_ids: null,
  priority: "medium",
  link: "/dashboard?tab=profile",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

#### Create Payment Confirmation
```javascript
db.notifications.insertOne({
  title: "Payment Received ✓",
  message: "Your payment of ₹5,000 has been processed successfully.",
  type: "success",
  status: "sent",
  target_audience: "merchant",
  target_ids: ["specific_merchant_id"],
  priority: "medium",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

#### Create Urgent Warning
```javascript
db.notifications.insertOne({
  title: "Action Required! 🔴",
  message: "Please verify your email within 48 hours to avoid account suspension.",
  type: "error",
  status: "sent",
  target_audience: "merchant",
  target_ids: ["merchant_id"],
  priority: "urgent",
  link: "/dashboard?tab=profile",
  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

## 🎯 Common Use Cases

### 1. Onboarding New Merchants
```javascript
// Welcome message with profile completion link
{
  title: "Welcome to CityWitty!",
  type: "info",
  priority: "high",
  link: "/dashboard?tab=profile"
}
```

### 2. Profile Completion Reminders
```javascript
// For merchants with incomplete profiles
{
  title: "Complete Your Profile",
  type: "warning",
  priority: "high",
  target_ids: ["incomplete_merchant_ids"]
}
```

### 3. Payment Confirmations
```javascript
// Individual payment notifications
{
  title: "Payment Received",
  type: "success",
  priority: "medium",
  target_ids: ["merchant_id"]
}
```

### 4. Feature Announcements
```javascript
// Broadcast new features
{
  title: "New Feature Released!",
  type: "announcement",
  priority: "high",
  target_ids: null  // All merchants
}
```

### 5. System Maintenance
```javascript
// Inform about downtime
{
  title: "Scheduled Maintenance",
  type: "info",
  priority: "medium",
  expiresAt: new Date("2024-12-25")
}
```

## 🔧 Troubleshooting

### Notifications Not Showing?

**Check:**
1. ✓ `status` is `"sent"` (not "draft")
2. ✓ `target_audience` includes `"merchant"`
3. ✓ `target_ids` is `null` or includes merchant ID
4. ✓ `expiresAt` is not in the past
5. ✓ MongoDB connection is working

**Solution:**
```bash
# View all sent notifications in MongoDB
db.notifications.find({ status: "sent" }).pretty()
```

### Badge Not Updating?

**Check:**
1. ✓ Refresh the page
2. ✓ Check browser console for errors
3. ✓ Verify API response includes `unreadCount`

**Solution:**
```javascript
// Check unread notifications for specific merchant
db.notifications.find({
  status: "sent",
  readBy: { $ne: "merchant_id_here" }
}).count()
```

### Can't Mark as Read?

**Check:**
1. ✓ Merchant is logged in
2. ✓ Notification ID is correct
3. ✓ API endpoint is accessible

**Solution:**
Check browser network tab for failed requests.

## 🎨 Customization

### Change Colors
Edit `components/dashboard/notifications.tsx`:
```typescript
const getTypeStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';  // Customize here
    // ...
  }
};
```

### Add New Notification Type
1. Update model: `models/Notification.ts`
2. Update component: `components/dashboard/notifications.tsx`
3. Add icon and styles

### Change Badge Position
Edit `components/dashboard/sidebar.tsx`:
```typescript
const menuItems = [
  { id: 'overview', label: 'Overview', ... },
  { id: 'notifications', label: 'Notifications', ... },  // Move this line
  // ...
];
```

## 📈 Monitoring

### View Notification Stats
```javascript
// Total notifications
db.notifications.count()

// By status
db.notifications.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// By type
db.notifications.aggregate([
  { $group: { _id: "$type", count: { $sum: 1 } } }
])

// Unread notifications
db.notifications.find({
  status: "sent",
  readBy: { $size: 0 }
}).count()
```

## 🚀 Future Enhancements

Ideas for future versions:
- [ ] Admin web UI for creating notifications
- [ ] Browser push notifications
- [ ] Email integration for urgent notifications
- [ ] Notification templates in database
- [ ] Scheduled delivery
- [ ] Read receipts and analytics
- [ ] Rich text / markdown support
- [ ] Notification categories
- [ ] User preferences

## ❓ FAQ

**Q: How do I send to specific merchants?**
A: Set `target_ids: ["merchant_id_1", "merchant_id_2"]`

**Q: How do I broadcast to all?**
A: Set `target_ids: null`

**Q: Can notifications expire?**
A: Yes, set `expiresAt: new Date("2024-12-31")`

**Q: How do I create drafts?**
A: Set `status: "draft"` (won't be visible until "sent")

**Q: Can I edit notifications?**
A: Yes, use MongoDB `updateOne()` or Compass editor

**Q: How do I delete notifications?**
A: Use `deleteOne()` or set `status: "archived"`

## 🤝 Support

For issues or questions:
1. Check the documentation files
2. Review troubleshooting section
3. Check MongoDB logs
4. Verify API responses in browser console

## 🎉 Conclusion

The notification system is ready to use! Start by importing test data, then create your own notifications as needed.

**Next Steps:**
1. ✅ Import test notifications
2. ✅ Test all features
3. ✅ Create real notifications
4. ✅ Train admin team
5. ✅ Monitor usage

---

**Built with ❤️ for CityWitty Merchant Dashboard**

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** December 2024