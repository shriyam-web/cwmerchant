/**
 * Create Notification Script
 * 
 * This script helps create notifications for merchants.
 * 
 * Usage:
 * node scripts/createNotification.js
 * 
 * Then follow the prompts to create your notification.
 */

const mongoose = require('mongoose');
const readline = require('readline');

// Update this with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';

// Notification Schema (matching the model)
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

// Predefined notification templates
const templates = {
  '1': {
    title: 'Welcome to CityWitty!',
    message: 'Thank you for joining our merchant platform. Complete your profile to start receiving customers and showcase your business.',
    type: 'info',
    priority: 'medium',
    link: '/dashboard?tab=profile'
  },
  '2': {
    title: 'Payment Received',
    message: 'Your payment has been successfully processed. Thank you for your business!',
    type: 'success',
    priority: 'medium'
  },
  '3': {
    title: 'Complete Your Profile',
    message: 'Your merchant profile is incomplete. Please complete all required fields to improve your visibility and start receiving customers.',
    type: 'warning',
    priority: 'high',
    link: '/dashboard?tab=profile'
  },
  '4': {
    title: 'New Feature Released!',
    message: 'We\'ve just launched exciting new features. Check out your dashboard to explore what\'s new and improve your business performance.',
    type: 'announcement',
    priority: 'high',
    link: '/dashboard'
  },
  '5': {
    title: 'Scheduled Maintenance',
    message: 'Our systems will undergo maintenance. Some features may be temporarily unavailable. We apologize for any inconvenience.',
    type: 'info',
    priority: 'medium'
  },
  '6': {
    title: 'Account Verification Required',
    message: 'Action required: Please verify your account to continue using all features. This is important for security and compliance.',
    type: 'warning',
    priority: 'urgent',
    link: '/dashboard?tab=profile'
  }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createNotification() {
  try {
    console.log('\n🔔 CityWitty Notification Creator\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Choose template or custom
    console.log('Choose an option:');
    console.log('0. Create custom notification');
    console.log('1. Welcome Message');
    console.log('2. Payment Confirmation');
    console.log('3. Complete Profile Reminder');
    console.log('4. New Feature Announcement');
    console.log('5. Maintenance Notice');
    console.log('6. Account Verification');
    
    const choice = await question('\nEnter your choice (0-6): ');
    
    let notificationData;
    
    if (choice === '0') {
      // Custom notification
      console.log('\n📝 Creating Custom Notification\n');
      
      const title = await question('Title: ');
      const message = await question('Message: ');
      
      console.log('\nType:');
      console.log('1. info (blue)');
      console.log('2. success (green)');
      console.log('3. warning (yellow)');
      console.log('4. error (red)');
      console.log('5. announcement (purple)');
      const typeChoice = await question('Choose type (1-5): ');
      const types = ['info', 'success', 'warning', 'error', 'announcement'];
      const type = types[parseInt(typeChoice) - 1] || 'info';
      
      console.log('\nPriority:');
      console.log('1. low');
      console.log('2. medium');
      console.log('3. high');
      console.log('4. urgent');
      const priorityChoice = await question('Choose priority (1-4): ');
      const priorities = ['low', 'medium', 'high', 'urgent'];
      const priority = priorities[parseInt(priorityChoice) - 1] || 'medium';
      
      const link = await question('Action link (optional, press Enter to skip): ');
      
      notificationData = {
        title,
        message,
        type,
        priority,
        link: link || undefined
      };
    } else {
      // Use template
      notificationData = templates[choice];
      if (!notificationData) {
        console.log('❌ Invalid choice');
        return;
      }
      console.log('\n✨ Using template:', notificationData.title);
    }
    
    // Target audience
    console.log('\nTarget Audience:');
    console.log('1. All merchants');
    console.log('2. Specific merchant(s) - enter ID(s)');
    const targetChoice = await question('Choose target (1-2): ');
    
    let target_ids = null;
    if (targetChoice === '2') {
      const ids = await question('Enter merchant ID(s) separated by comma: ');
      target_ids = ids.split(',').map(id => id.trim()).filter(id => id);
    }
    
    // Status
    console.log('\nStatus:');
    console.log('1. draft (not visible)');
    console.log('2. sent (visible to merchants)');
    const statusChoice = await question('Choose status (1-2): ');
    const status = statusChoice === '1' ? 'draft' : 'sent';
    
    // Expiration (optional)
    const expiresChoice = await question('\nSet expiration date? (y/n): ');
    let expiresAt = undefined;
    if (expiresChoice.toLowerCase() === 'y') {
      const days = await question('Expire after how many days?: ');
      expiresAt = new Date(Date.now() + parseInt(days) * 24 * 60 * 60 * 1000);
    }
    
    // Create notification
    const notification = await Notification.create({
      ...notificationData,
      status,
      target_audience: 'merchant',
      target_ids,
      expiresAt
    });
    
    console.log('\n✅ Notification created successfully!\n');
    console.log('Details:');
    console.log('  ID:', notification._id);
    console.log('  Title:', notification.title);
    console.log('  Type:', notification.type);
    console.log('  Priority:', notification.priority);
    console.log('  Status:', notification.status);
    console.log('  Target:', target_ids ? `${target_ids.length} specific merchant(s)` : 'All merchants');
    if (expiresAt) {
      console.log('  Expires:', expiresAt.toLocaleString());
    }
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    rl.close();
  }
}

// Run the script
createNotification();