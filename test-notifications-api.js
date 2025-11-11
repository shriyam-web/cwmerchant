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

    const allSent = await Notification.find({ status: 'sent' }).lean();
    console.log(`\nAll sent notifications (${allSent.length}):`);
    allSent.forEach((n, i) => {
      console.log(`  ${i+1}. ${n.title}`);
      console.log(`     status: ${n.status}`);
      console.log(`     target_audience: ${n.target_audience}`);
      console.log(`     target_ids: ${JSON.stringify(n.target_ids)}`);
      console.log(`     ---`);
    });

    // Check all notifications regardless of status
    const all = await Notification.find({}).lean();
    console.log(`\nAll notifications (${all.length}):`);
    all.forEach((n, i) => {
      console.log(`  ${i+1}. ${n.title} - status: ${n.status}, expiresAt: ${n.expiresAt}, target_audience: ${n.target_audience}`);
    });

    const withTargetIds = await Notification.find({ status: 'sent', target_ids: { $ne: null, $exists: true } }).lean();
    console.log(`\nNotifications with target_ids set (${withTargetIds.length}):`);
    withTargetIds.forEach((n, i) => {
      console.log(`  ${i+1}. ${n.title} - target_ids: ${JSON.stringify(n.target_ids)}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testNotifications();
