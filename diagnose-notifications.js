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
    console.log('\n📊 DATABASE DIAGNOSTICS\n');

    // Check total notifications
    const total = await Notification.countDocuments();
    console.log(`Total notifications: ${total}`);

    // Check by status
    const byStatus = await Notification.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('\nBy status:');
    byStatus.forEach(s => console.log(`  ${s._id}: ${s.count}`));

    // Check by target_audience
    const byAudience = await Notification.aggregate([
      { $group: { _id: '$target_audience', count: { $sum: 1 } } }
    ]);
    console.log('\nBy target_audience:');
    byAudience.forEach(a => console.log(`  ${a._id}: ${a.count}`));

    // Show all notifications
    const allNotifs = await Notification.find().lean();
    console.log(`\nAll ${allNotifs.length} Notifications:\n`);
    
    allNotifs.forEach((n, i) => {
      console.log(`${i + 1}. "${n.title}"`);
      console.log(`   Status: ${n.status}`);
      console.log(`   Target: ${n.target_audience}`);
      console.log(`   Target IDs: ${JSON.stringify(n.target_ids)}`);
      console.log(`   Type: ${n.type}`);
      console.log(`   Priority: ${n.priority}`);
      if (n.expiresAt) console.log(`   Expires: ${n.expiresAt}`);
      console.log('');
    });

    // Show what API would return
    console.log('\n🔍 API SIMULATION (for merchantId: "test-merchant")\n');
    const testMerchantId = 'test-merchant';
    const apiResults = await Notification.find({
      status: 'sent',
      target_audience: { $in: ['merchant', 'all'] },
      $and: [
        {
          $or: [
            { target_ids: null },
            { target_ids: { $in: [testMerchantId] } }
          ]
        },
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
          ]
        }
      ]
    }).lean();
    
    console.log(`Would return ${apiResults.length} notifications:`);
    apiResults.forEach((n, i) => {
      console.log(`  ${i + 1}. ${n.title}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
