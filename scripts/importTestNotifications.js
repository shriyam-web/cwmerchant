/**
 * Import Test Notifications Script
 * 
 * This script imports sample notifications from testNotifications.json
 * to help you quickly test the notification system.
 * 
 * Usage:
 * node scripts/importTestNotifications.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envMatch = envContent.match(/MONGODB_URI=(.+)/);
    if (envMatch) {
      MONGODB_URI = envMatch[1].trim();
    }
  } catch (e) {
    // ignore
  }
}

MONGODB_URI = MONGODB_URI || 'mongodb://localhost:27017/your_database';

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['info', 'success', 'warning', 'error', 'announcement'],
    default: 'info'
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'archived'],
    default: 'draft'
  },
  target_audience: { 
    type: String, 
    enum: ['all', 'merchant', 'customer', 'specific'],
    required: true
  },
  target_ids: { type: [String], default: null },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  link: { type: String },
  icon: { type: String },
  expiresAt: { type: Date },
  readBy: { type: [String], default: [] }
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

async function importNotifications() {
  try {
    console.log('\n📦 Importing Test Notifications\n');
    console.log('MongoDB URI:', MONGODB_URI.substring(0, 50) + '...');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Read test notifications file
    const filePath = path.join(__dirname, 'testNotifications.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse and process notifications
    const notifications = JSON.parse(fileContent);
    const now = new Date();
    const expires7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const processedNotifications = notifications.map(notif => {
      // Replace placeholders
      if (notif.createdAt === '{{NOW}}') {
        notif.createdAt = now;
      }
      if (notif.updatedAt === '{{NOW}}') {
        notif.updatedAt = now;
      }
      if (notif.expiresAt === '{{EXPIRES_7_DAYS}}') {
        notif.expiresAt = expires7Days;
      }
      return notif;
    });

    // Clear existing test notifications (optional)
    console.log('Clearing existing notifications...');
    await Notification.deleteMany({});
    console.log('✅ Cleared\n');

    // Insert new notifications
    console.log(`Importing ${processedNotifications.length} notifications...`);
    const result = await Notification.insertMany(processedNotifications);
    
    console.log(`\n✅ Successfully imported ${result.length} notifications!\n`);
    
    // Summary
    console.log('Summary:');
    const byType = result.reduce((acc, notif) => {
      acc[notif.type] = (acc[notif.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    
    console.log('\n🎉 Ready to test! Login to your merchant dashboard to see notifications.\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ENOENT') {
      console.error('\n📝 Make sure testNotifications.json exists in the scripts folder!');
    }
  } finally {
    await mongoose.connection.close();
  }
}

// Run the script
importNotifications();