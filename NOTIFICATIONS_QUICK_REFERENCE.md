# Notifications Quick Reference

## 🚀 Quick Start - MongoDB Commands

### Send to ALL Merchants
```javascript
db.notifications.insertOne({
  title: "Your Title Here",
  message: "Your message here",
  type: "info",  // info | success | warning | error | announcement
  status: "sent",
  target_audience: "merchant",
  target_ids: null,  // null = ALL merchants
  priority: "medium",  // low | medium | high | urgent
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

### Send to Specific Merchants
```javascript
db.notifications.insertOne({
  title: "Your Title Here",
  message: "Your message here",
  type: "success",
  status: "sent",
  target_audience: "merchant",
  target_ids: ["merchant_id_1", "merchant_id_2"],  // Specific IDs
  priority: "high",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

### With Action Link
```javascript
db.notifications.insertOne({
  title: "Action Required",
  message: "Please complete your profile",
  type: "warning",
  status: "sent",
  target_audience: "merchant",
  target_ids: null,
  priority: "high",
  link: "/dashboard?tab=profile",  // Action link
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

### With Expiration
```javascript
db.notifications.insertOne({
  title: "Limited Time Offer",
  message: "Special discount available for 7 days",
  type: "announcement",
  status: "sent",
  target_audience: "merchant",
  target_ids: null,
  priority: "medium",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 days
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

## 📊 Useful Queries

### View All Sent Notifications
```javascript
db.notifications.find({ status: "sent" }).sort({ createdAt: -1 })
```

### View Notifications for Specific Merchant
```javascript
db.notifications.find({
  status: "sent",
  $or: [
    { target_ids: null },
    { target_ids: "merchant_id_here" }
  ]
})
```

### Count Unread Notifications
```javascript
db.notifications.find({
  status: "sent",
  readBy: { $ne: "merchant_id_here" }
}).count()
```

### Delete Old Notifications
```javascript
db.notifications.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }  // Older than 30 days
})
```

### Update Notification Status
```javascript
db.notifications.updateOne(
  { _id: ObjectId("notification_id") },
  { $set: { status: "archived" } }
)
```

## 🎨 Types & Colors

| Type | Color | Icon | Use For |
|------|-------|------|---------|
| `info` | Blue | ℹ️ | General information, updates |
| `success` | Green | ✓ | Confirmations, successful actions |
| `warning` | Yellow | ⚠️ | Warnings, action required |
| `error` | Red | ✕ | Errors, critical issues |
| `announcement` | Purple | 📢 | New features, announcements |

## 🏷️ Priority Levels

| Priority | Badge | Behavior | Use For |
|----------|-------|----------|---------|
| `low` | Gray | Normal | Non-urgent info |
| `medium` | Blue | Normal | Standard notifications |
| `high` | Orange | Normal | Important, time-sensitive |
| `urgent` | Red | Animated | Critical, immediate action |

## 💡 Common Examples

### Welcome New Merchant
```javascript
{
  title: "Welcome to CityWitty! 🎉",
  message: "Thank you for joining our platform. Complete your profile to get started.",
  type: "info",
  priority: "medium",
  link: "/dashboard?tab=profile"
}
```

### Payment Success
```javascript
{
  title: "Payment Received ✓",
  message: "Your payment of ₹5,000 has been successfully processed.",
  type: "success",
  priority: "medium"
}
```

### Profile Incomplete
```javascript
{
  title: "Complete Your Profile ⚠️",
  message: "Your profile is incomplete. Add missing information to improve visibility.",
  type: "warning",
  priority: "high",
  link: "/dashboard?tab=profile"
}
```

### New Feature
```javascript
{
  title: "New Feature: Analytics Dashboard 🚀",
  message: "Check out our new analytics to track your business performance!",
  type: "announcement",
  priority: "high",
  link: "/dashboard"
}
```

### Urgent Action
```javascript
{
  title: "Immediate Action Required! 🔴",
  message: "Your account needs verification within 24 hours to avoid suspension.",
  type: "error",
  priority: "urgent",
  link: "/dashboard?tab=profile"
}
```

## 🔧 Testing

### 1. Create Test Notification
```javascript
db.notifications.insertOne({
  title: "Test Notification",
  message: "This is a test notification to verify the system is working correctly.",
  type: "info",
  status: "sent",
  target_audience: "merchant",
  target_ids: ["YOUR_MERCHANT_ID"],  // Replace with your test merchant ID
  priority: "low",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

### 2. Login & Check
- Login to dashboard as merchant
- Look for notification badge in sidebar
- Click "Notifications" tab
- Verify notification appears

### 3. Test Features
- ✓ Search functionality
- ✓ Filter by type
- ✓ Mark as read
- ✓ Mark all as read
- ✓ View action links

## 🛠️ Node.js Script

Instead of manual commands, use the script:

```bash
# Set your MongoDB URI in .env.local
MONGODB_URI=mongodb://localhost:27017/your_database

# Run the script
node scripts/createNotification.js
```

Follow the interactive prompts to create notifications easily!

## 📝 Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | ✓ | String | Notification title (keep short) |
| `message` | ✓ | String | Notification content |
| `type` | ✓ | Enum | info, success, warning, error, announcement |
| `status` | ✓ | Enum | draft, sent, archived |
| `target_audience` | ✓ | Enum | all, merchant, customer, specific |
| `target_ids` | - | Array | null for all, or specific IDs |
| `priority` | ✓ | Enum | low, medium, high, urgent |
| `link` | - | String | Optional action link |
| `expiresAt` | - | Date | Optional expiration date |
| `readBy` | - | Array | Auto-managed, set empty [] |
| `createdAt` | ✓ | Date | Auto or manual timestamp |
| `updatedAt` | ✓ | Date | Auto or manual timestamp |

## ⚡ Pro Tips

1. **Use Clear Titles**: Max 50 characters recommended
2. **Actionable Messages**: Tell users what to do
3. **Set Appropriate Priority**: Don't overuse "urgent"
4. **Add Links**: When action is needed
5. **Target Wisely**: Use specific IDs when possible
6. **Set Expiration**: For time-sensitive notifications
7. **Test First**: Create draft, verify, then send

## 🔗 API Integration

If you want to create notifications programmatically:

```javascript
// Example: Create notification via API endpoint (you need to create this)
const response = await fetch('/api/admin/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Your Title",
    message: "Your message",
    type: "info",
    status: "sent",
    target_audience: "merchant",
    target_ids: null,
    priority: "medium"
  })
});
```

## 📱 Component Location

- **Model**: `models/Notification.ts`
- **API**: `app/api/merchant/notifications/route.ts`
- **Component**: `components/dashboard/notifications.tsx`
- **Integration**: `app/dashboard/page.tsx`
- **Sidebar**: `components/dashboard/sidebar.tsx`

---

**Need Help?** Check `NOTIFICATIONS_SYSTEM.md` for detailed documentation.