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
    console.log('\n🔍 DATABASE DEBUG DIAGNOSTICS\n');
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, { dbName: 'citywitty' });
    console.log('✅ Connected to MongoDB\n');

    // 1. Check total notifications
    const totalCount = await Notification.countDocuments();
    console.log(`[1] Total notifications in DB: ${totalCount}`);

    // 2. Check sent status notifications
    const sentCount = await Notification.countDocuments({ status: 'sent' });
    console.log(`[2] Notifications with status='sent': ${sentCount}`);

    // 3. Check target_audience breakdown
    const merchantAudience = await Notification.countDocuments({ target_audience: 'merchant' });
    const allAudience = await Notification.countDocuments({ target_audience: 'all' });
    console.log(`[3] Target audience breakdown:`);
    console.log(`    - target_audience='merchant': ${merchantAudience}`);
    console.log(`    - target_audience='all': ${allAudience}`);

    // 4. Show all notifications
    const allNotifs = await Notification.find().lean();
    console.log(`\n[4] Detailed list of ALL ${allNotifs.length} notifications:\n`);
    
    allNotifs.forEach((n, i) => {
      console.log(`  ${i + 1}. ${n.title}`);
      console.log(`     status: ${n.status}`);
      console.log(`     target_audience: ${n.target_audience}`);
      console.log(`     target_ids: ${JSON.stringify(n.target_ids)}`);
      console.log(`     expiresAt: ${n.expiresAt || 'Not set'}`);
      console.log('');
    });

    // 5. Test the API query
    console.log('\n[5] API Query Test (simulating merchant with id: "test-123")\n');
    const testMerchantId = 'test-123';
    const now = new Date();

    const query = {
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
            { expiresAt: { $gt: now } }
          ]
        }
      ]
    };

    console.log('Query object:');
    console.log(JSON.stringify(query, null, 2));
    console.log('');

    const apiResults = await Notification.find(query).lean();
    
    console.log(`✅ API Query returned ${apiResults.length} notifications:`);
    apiResults.forEach((n, i) => {
      console.log(`  ${i + 1}. ${n.title}`);
    });

    if (apiResults.length === 0 && allNotifs.length > 0) {
      console.log('\n⚠️  No results returned but notifications exist!');
      console.log('Checking why each notification was filtered out:\n');
      
      allNotifs.forEach((n, i) => {
        console.log(`Notification ${i + 1}: "${n.title}"`);
        console.log(`  - status='sent'? ${n.status === 'sent' ? '✅' : '❌ (is ' + n.status + ')'}`);
        console.log(`  - target_audience in ['merchant','all']? ${['merchant', 'all'].includes(n.target_audience) ? '✅' : '❌ (is ' + n.target_audience + ')'}`);
        console.log(`  - target_ids null? ${n.target_ids === null ? '✅' : '❌'}`);
        console.log(`  - target_ids includes test-123? ${n.target_ids?.includes(testMerchantId) ? '✅' : '❌'}`);
        console.log(`  - not expired? ${!n.expiresAt || n.expiresAt > now ? '✅' : '❌ (expires ' + n.expiresAt + ')'}`);
        console.log('');
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Diagnostics complete\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
