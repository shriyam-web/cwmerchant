import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get('merchantId');

    if (!merchantId) {
      return NextResponse.json(
        { success: false, message: 'Merchant ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // First, check total notifications in database
    const totalCount = await Notification.countDocuments();
    console.log('[API] Total notifications in DB:', totalCount);

    // Check notifications with sent status
    const sentCount = await Notification.countDocuments({ status: 'sent' });
    console.log('[API] Sent notifications in DB:', sentCount);

    // Fetch all sent notifications first (without other filters)
    const allSent = await Notification.find({ status: 'sent' }).lean();
    console.log('[API] All sent notifications:', allSent.length);

    // Now apply merchant-specific filters
    const now = new Date();
    const notifications = await Notification.find({
      status: 'sent',
      target_audience: { $in: ['merchant', 'all'] },
      $and: [
        {
          $or: [
            { target_ids: null },
            { target_ids: { $in: [merchantId] } }
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
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    console.log('[API] Filtered notifications for merchant:', notifications.length);

    // Format notifications and check read status
    const formattedNotifications = notifications.map((notif: any) => ({
      id: notif._id.toString(),
      title: notif.title,
      message: notif.message,
      type: notif.type,
      priority: notif.priority,
      link: notif.link,
      icon: notif.icon,
      createdAt: notif.createdAt,
      isRead: notif.readBy?.includes(merchantId) || false,
    }));

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      unreadCount: formattedNotifications.filter((n: any) => !n.isRead).length,
    });
  } catch (error: any) {
    console.error('[API] Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications', error: error.message },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(req: NextRequest) {
  try {
    const { notificationId, merchantId } = await req.json();

    if (!notificationId || !merchantId) {
      return NextResponse.json(
        { success: false, message: 'Notification ID and Merchant ID are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 }
      );
    }

    // Add merchantId to readBy array if not already present
    if (!Array.isArray(notification.readBy)) {
      notification.readBy = [];
    }
    if (!notification.readBy.includes(merchantId)) {
      notification.readBy.push(merchantId);
      await notification.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark notification as read', error: error.message },
      { status: 500 }
    );
  }
}