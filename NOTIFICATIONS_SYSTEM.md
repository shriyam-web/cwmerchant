# Notifications System Documentation

## Overview
The notification system allows administrators to send notifications to merchants through the dashboard. Notifications are displayed in a dedicated "Notifications" tab with real-time unread count badges.

## Features
- ✅ Dynamic notification filtering (All, Unread, by Type)
- ✅ Real-time unread count in sidebar badge
- ✅ Mark as read functionality
- ✅ Mark all as read option
- ✅ Search notifications by title/message
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Multiple notification types (Info, Success, Warning, Error, Announcement)
- ✅ Optional action links
- ✅ Expiration date support
- ✅ Target specific merchants or broadcast to all

## Database Schema

The notification model is located at: `models/Notification.ts`

### Fields:
```typescript
{
  title: string;              // Notification title
  message: string;            // Notification content
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  status: 'draft' | 'sent' | 'archived';
  target_audience: 'all' | 'merchant' | 'customer' | 'specific';
  target_ids: string[] | null;  // null = all users of target_audience
  priority: 'low' | 'medium' | 'high' | 'urgent';
  link?: string;              // Optional action link
  icon?: string;              // Optional icon name
  expiresAt?: Date;           // Optional expiration date
  readBy: string[];           // Array of user IDs who read this
  createdAt: Date;
  updatedAt: Date;
}
```

## How to Create Notifications

### Method 1: MongoDB Shell/Compass

#### Example 1: Send notification to ALL merchants
```javascript
db.notifications.insertOne({
  title: "New Feature Released!",
  message: "We've just launched our new analytics dashboard. Check it out now to see detailed insights about your business performance.",
  type: "announcement",
  status: "sent",
  target_audience: "merchant",
  target_ids: null,  // null means ALL merchants
  priority: "high",
  link: "/dashboard",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

#### Example 2: Send notification to SPECIFIC merchants
```javascript
db.notifications.insertOne({
  title: "Payment Received",
  message: "Your payment of ₹5,000 has been successfully processed. Thank you for your business!",
  type: "success",
  status: "sent",
  target_audience: "merchant",
  target_ids: ["merchant_id_1", "merchant_id_2", "merchant_id_3"],  // Specific merchant IDs
  priority: "medium",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

#### Example 3: Urgent warning notification
```javascript
db.notifications.insertOne({
  title: "Action Required: Complete Your Profile",
  message: "Your merchant profile is incomplete. Please complete all required fields within 48 hours to avoid account suspension.",
  type: "warning",
  status: "sent",
  target_audience: "merchant",
  target_ids: ["incomplete_merchant_id"],
  priority: "urgent",
  link: "/dashboard?tab=profile",
  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),  // Expires in 48 hours
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

#### Example 4: System maintenance notification
```javascript
db.notifications.insertOne({
  title: "Scheduled Maintenance",
  message: "Our systems will undergo maintenance on Dec 25, 2024, from 2:00 AM to 4:00 AM IST. Some features may be unavailable during this time.",
  type: "info",
  status: "sent",
  target_audience: "all",  // All users (merchants + customers)
  target_ids: null,
  priority: "medium",
  createdAt: new Date(),
  updatedAt: new Date(),
  readBy: []
})
```

### Method 2: Using Node.js Script

Create a file `scripts/sendNotification.js`:

```javascript
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

mongoose.connect('your_mongodb_connection_string');

async function sendNotification() {
  try {
    const notification = await Notification.create({
      title: "Welcome to CityWitty!",
      message: "Thank you for joining our merchant platform. Complete your profile to start receiving customers.",
      type: "info",
      status: "sent",
      target_audience: "merchant",
      target_ids: null,
      priority: "medium",
      link: "/dashboard?tab=profile"
    });
    
    console.log('Notification sent:', notification._id);
  } catch (error) {
    console.error('Error sending notification:', error);
  } finally {
    mongoose.connection.close();
  }
}

sendNotification();
```

Run with: `node scripts/sendNotification.js`

## Filtering Logic

The system automatically filters notifications for merchants based on:

1. **Status**: Only shows notifications with `status: "sent"`
2. **Target Audience**: Shows notifications where:
   - `target_audience === "merchant"` OR `target_audience === "all"`
3. **Target IDs**: Shows notification if:
   - `target_ids === null` (broadcast to all)
   - OR `target_ids` contains the merchant's ID
4. **Expiration**: Excludes expired notifications

## API Endpoints

### GET `/api/merchant/notifications`
Fetch notifications for a merchant

**Query Parameters:**
- `merchantId` (required): The merchant's ID

**Response:**
```json
{
  "success": true,
  "notifications": [...],
  "unreadCount": 5
}
```

### PATCH `/api/merchant/notifications`
Mark a notification as read

**Body:**
```json
{
  "notificationId": "notification_id",
  "merchantId": "merchant_id"
}
```

## Component Usage

The notification component is located at: `components/dashboard/notifications.tsx`

It's automatically integrated into the dashboard with:
- Sidebar menu item with unread badge
- Full notification list with filtering
- Search functionality
- Mark as read capabilities

## Notification Types & Styling

| Type | Color | Use Case |
|------|-------|----------|
| `info` | Blue | General information, updates |
| `success` | Green | Successful actions, payments received |
| `warning` | Yellow | Important warnings, action required |
| `error` | Red | Errors, critical issues |
| `announcement` | Purple | New features, major announcements |

## Priority Levels

| Priority | Badge Style | Use Case |
|----------|-------------|----------|
| `low` | Gray | Non-urgent information |
| `medium` | Blue | Standard notifications |
| `high` | Orange | Important, time-sensitive |
| `urgent` | Red (Animated) | Critical, immediate action required |

## Best Practices

1. **Clear Titles**: Use concise, action-oriented titles
2. **Specific Messages**: Provide clear context and actionable information
3. **Appropriate Priority**: Don't overuse "urgent" priority
4. **Expiration Dates**: Set expiration for time-sensitive notifications
5. **Action Links**: Include links when users need to take action
6. **Target Wisely**: Use specific targeting when possible to avoid spam

## Example Use Cases

### New Feature Announcement
```javascript
{
  title: "🎉 New Feature: Analytics Dashboard",
  type: "announcement",
  priority: "high",
  target_ids: null  // All merchants
}
```

### Payment Confirmation
```javascript
{
  title: "Payment Received",
  type: "success",
  priority: "medium",
  target_ids: ["specific_merchant_id"]
}
```

### Profile Completion Reminder
```javascript
{
  title: "Complete Your Profile",
  type: "warning",
  priority: "high",
  link: "/dashboard?tab=profile",
  target_ids: ["incomplete_merchant_ids"]
}
```

### System Maintenance
```javascript
{
  title: "Scheduled Maintenance",
  type: "info",
  priority: "medium",
  expiresAt: new Date("2024-12-25"),
  target_audience: "all"
}
```

## Testing

To test the notification system:

1. Create a test notification using MongoDB Compass or shell
2. Login as a merchant
3. Check the sidebar for the notification badge
4. Click "Notifications" to view
5. Test filtering, search, and mark as read functionality

## Future Enhancements

Potential improvements:
- Push notifications (browser/mobile)
- Email notifications
- Notification preferences per merchant
- Admin dashboard for creating notifications
- Bulk notification operations
- Notification templates
- Scheduled notifications
- Notification analytics