const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

console.log('Starting test...');

// Read .env.local file manually
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envMatch = envContent.match(/MONGODB_URI=(.+)/);
    if (envMatch) {
      MONGODB_URI = envMatch[1].trim();
    }
  } catch (e) {
    console.error('Error reading env file:', e.message);
  }
}

console.log('MONGODB_URI found:', !!MONGODB_URI);
if (MONGODB_URI) {
  console.log('URI preview:', MONGODB_URI.substring(0, 50) + '...');
}

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error', 'announcement'], default: 'info' },
  status: { type: String, enum: ['draft', 'sent', 'archived'], default: 'draft' },
  target_audience: { type: String, enum: ['all', 'merchant', 'customer', 'specific'], required: true },
  target_ids: { type: [String], default: null },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  link: { type: String },
  icon: { type: String },
  expiresAt: { type: Date },
  readBy: { type: [String], default: [] }
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: 'citywitty'
    });
    console.log('✅ Connected to MongoDB');

    const count = await Notification.countDocuments();
    console.log(`Total notifications in DB: ${count}`);

    const sent = await Notification.countDocuments({ status: 'sent' });
    console.log(`Sent notifications: ${sent}`);

    if (sent === 0) {
      console.log('\nNo notifications found. Creating test notification...');
      const testNotif = await Notification.create({
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        status: 'sent',
        target_audience: 'merchant',
        target_ids: null,
        priority: 'medium'
      });
      console.log('✅ Created test notification:', testNotif._id);
    }

    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();
