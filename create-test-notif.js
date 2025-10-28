const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) {
      MONGODB_URI = match[1].trim();
    }
  } catch (e) {
    console.log('Could not read .env.local');
  }
}

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error', 'announcement'], default: 'info' },
  status: { type: String, enum: ['draft', 'sent', 'archived'], default: 'draft' },
  target_audience: { type: String, enum: ['all', 'merchant', 'customer', 'specific'], required: true },
  target_ids: { type: [String], default: null },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  link: String,
  icon: String,
  expiresAt: Date,
  readBy: [String]
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'citywitty' });
    console.log('Connected to MongoDB');

    await Notification.deleteMany({});
    console.log('Cleared existing notifications');

    const testNotifications = [
      {
        title: 'Welcome to CityWitty!',
        message: 'Thank you for joining our merchant platform. Complete your profile to start.',
        type: 'info',
        status: 'sent',
        target_audience: 'merchant',
        target_ids: null,
        priority: 'medium'
      },
      {
        title: 'New Feature Announced',
        message: 'Check out our new analytics dashboard!',
        type: 'announcement',
        status: 'sent',
        target_audience: 'merchant',
        target_ids: null,
        priority: 'high'
      },
      {
        title: 'Payment Received',
        message: 'Your payment has been processed successfully.',
        type: 'success',
        status: 'sent',
        target_audience: 'merchant',
        target_ids: null,
        priority: 'medium'
      }
    ];

    const created = await Notification.insertMany(testNotifications);
    console.log(`Created ${created.length} test notifications`);
    
    const count = await Notification.countDocuments();
    console.log(`Total notifications in DB: ${count}`);
    
    await mongoose.connection.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
