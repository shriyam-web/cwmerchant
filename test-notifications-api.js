const mongoose = require('mongoose');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: String,
  status: String,
  target_audience: String,
  target_ids: [String],
  priority: String,
  link: String,
  icon: String,
  expiresAt: Date,
  readBy: [String]
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

async function testNotifications() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    const total = await Notification.countDocuments();
    console.log(`Total notifications in DB: ${total}`);

    const sent = await Notification.countDocuments({ status: 'sent' });
    console.log(`Sent notifications: ${sent}`);

    const merchant = await Notification.countDocuments({ target_audience: 'merchant' });
    console.log(`Merchant audience notifications: ${merchant}`);

    const sample = await Notification.find({ status: 'sent' }).limit(3).lean();
    console.log(`\nSample notifications:`);
    sample.forEach(n => {
      console.log(`  - ${n.title}`);
      console.log(`    target_audience: ${n.target_audience}`);
      console.log(`    target_ids: ${JSON.stringify(n.target_ids)}`);
      console.log(`    status: ${n.status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testNotifications();
