import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

const normalizeStatus = (value: any): 'draft' | 'sent' | 'archived' => {
  if (value === undefined || value === null) {
    return 'sent';
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      return 'sent';
    }
    if (
      [
        'sent',
        'delivered',
        'completed',
        'success',
        'successful',
        'done',
        'published',
        'active',
        'live',
        'ready',
      ].includes(normalized)
    ) {
      return 'sent';
    }
    if (['draft', 'pending', 'queued', 'created', 'scheduled', 'processing'].includes(normalized)) {
      return 'draft';
    }
    if (['archived', 'cancelled', 'canceled', 'inactive', 'expired'].includes(normalized)) {
      return 'archived';
    }
  }
  return 'sent';
};

const addIdVariants = (set: Set<string>, value: any) => {
  if (value === undefined || value === null) {
    return;
  }
  const raw = typeof value === 'string' ? value : value?.toString?.();
  if (typeof raw !== 'string') {
    return;
  }
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '[object Object]') {
    return;
  }
  set.add(trimmed);
  set.add(trimmed.toLowerCase());
};

const extractIdStrings = (input: any): string[] => {
  const values = new Set<string>();
  const visited = new WeakSet<object>();
  const process = (value: any) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        process(item);
      }
      return;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        values.add(trimmed);
      }
      return;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      values.add(String(value));
      return;
    }
    if (typeof value === 'object') {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
      const direct = value?.toString?.();
      if (typeof direct === 'string' && direct.trim() && direct.trim() !== '[object Object]') {
        values.add(direct.trim());
      }
      const keys = ['_id', 'id', 'target_id', 'targetId', 'merchantId', 'merchant_id', 'value'];
      for (const key of keys) {
        if (key in value) {
          process((value as any)[key]);
        }
      }
      return;
    }
    const converted = value?.toString?.();
    if (typeof converted === 'string' && converted.trim() && converted.trim() !== '[object Object]') {
      values.add(converted.trim());
    }
  };
  process(input);
  return Array.from(values);
};

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantIdParam = searchParams.get('merchantId');
    const merchantId = merchantIdParam?.trim();

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

    const merchantObjectId = merchantId && Types.ObjectId.isValid(merchantId) ? new Types.ObjectId(merchantId) : null;
    const merchantVariants = new Set<string>();
    if (merchantId) {
      addIdVariants(merchantVariants, merchantId);
    }
    if (merchantObjectId) {
      addIdVariants(merchantVariants, merchantObjectId.toString());
    }

    const normalizeTargetIds = (raw: any): string[] => {
      if (!raw) return [];
      if (typeof raw === 'string') {
        return raw
          .split(',')
          .map((value) => value.trim())
          .filter((value) => value.length > 0);
      }
      return extractIdStrings(raw);
    };

    const normalizeAudience = (value: any): string => {
      if (typeof value === 'string') {
        return value.trim().toLowerCase();
      }
      return 'all';
    };

    const normalizeDate = (value: any): Date | null => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const now = new Date();
    const rawNotifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const notifications = rawNotifications.filter((notif: any) => {
      const statusSource = notif.status ?? notif.notification_status ?? notif.state;
      const status = normalizeStatus(statusSource);
      if (status === 'archived') {
        return false;
      }

      const audience = normalizeAudience(notif.target_audience ?? notif.targetAudience ?? 'all');
      const expiresAt = normalizeDate(notif.expiresAt ?? notif.expires_at);
      if (expiresAt && expiresAt.getTime() <= now.getTime()) {
        return false;
      }

      const targetIds = normalizeTargetIds(notif.target_ids ?? notif.targetIds ?? notif.targetID ?? []);
      const targetIdVariants = new Set<string>();
      for (const targetId of targetIds) {
        addIdVariants(targetIdVariants, targetId);
      }
      const hasMerchantMatch = Array.from(targetIdVariants).some((id) => merchantVariants.has(id));

      if (audience === 'all') {
        return status === 'sent';
      }

      if (audience === 'merchant') {
        if (targetIds.length === 0) {
          return status === 'sent';
        }
        return hasMerchantMatch;
      }

      if (audience === 'specific' || audience === 'merchant_specific' || audience === 'targeted') {
        return hasMerchantMatch;
      }

      return false;
    });

    console.log('[API] Filtered notifications for merchant:', notifications.length);

    const normalizeType = (value: any) => {
      if (typeof value !== 'string') return 'info';
      const normalized = value.toLowerCase();
      if (['info', 'success', 'warning', 'error', 'announcement'].includes(normalized)) {
        return normalized;
      }
      if (['alert', 'pending actions'].includes(normalized)) return 'warning';
      if (normalized === 'promotion') return 'announcement';
      if (normalized === 'update') return 'info';
      return 'info';
    };

    const normalizePriority = (value: any) => {
      if (typeof value !== 'string') return 'medium';
      const normalized = value.toLowerCase();
      if (['low', 'medium', 'high', 'urgent'].includes(normalized)) {
        return normalized;
      }
      return 'medium';
    };

    const formattedNotifications = notifications.map((notif: any) => {
      const createdAtSource = notif.createdAt || notif.created_at || new Date();
      const createdAt = new Date(createdAtSource).toISOString();
      const expiresAtDate = normalizeDate(notif.expiresAt ?? notif.expires_at);
      const statusSource = notif.status ?? notif.notification_status ?? notif.state;
      const status = normalizeStatus(statusSource);
      const readBy = Array.isArray(notif.readBy) ? notif.readBy : [];
      const normalizedReadBy = readBy.map((entry: any) => entry?.toString?.() ?? entry);
      const readByVariants = new Set<string>();
      for (const entry of normalizedReadBy) {
        addIdVariants(readByVariants, entry);
      }
      let isRead = Array.from(readByVariants).some((value) => merchantVariants.has(value));
      if (!isRead && Array.isArray(notif.is_read)) {
        isRead = notif.is_read.some((entry: any) => {
          const variants = new Set<string>();
          const targetIdValue = entry?.target_id?.toString?.() ?? entry?.target_id;
          addIdVariants(variants, targetIdValue);
          const hasMatch = Array.from(variants).some((value) => merchantVariants.has(value));
          return hasMatch && Boolean(entry?.read);
        });
      }

      return {
        id: notif._id.toString(),
        title: notif.title,
        message: notif.message,
        type: normalizeType(notif.type),
        priority: normalizePriority(notif.priority),
        link: notif.link,
        icon: notif.icon,
        createdAt,
        isRead,
        status,
        expiresAt: expiresAtDate ? expiresAtDate.toISOString() : null,
      };
    });

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

    const validTypes = ['info', 'success', 'warning', 'error', 'announcement'];
    if (typeof notification.type === 'string' && !validTypes.includes(notification.type)) {
      notification.type = 'info';
    }
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (typeof notification.priority === 'string' && !validPriorities.includes(notification.priority)) {
      notification.priority = 'medium';
    }

    const idVariants = new Set([
      merchantId,
      (() => {
        try {
          return Types.ObjectId.isValid(merchantId)
            ? new Types.ObjectId(merchantId).toString()
            : merchantId;
        } catch {
          return merchantId;
        }
      })(),
    ].filter(Boolean) as string[]);

    if (!Array.isArray(notification.readBy)) {
      notification.readBy = [];
    }
    const normalizedReadBy = notification.readBy.map((entry: any) => entry?.toString?.() ?? entry);
    const variantsToPersist = Array.from(idVariants).filter(Boolean);
    for (const variant of variantsToPersist) {
      if (!normalizedReadBy.includes(variant)) {
        notification.readBy.push(variant);
      }
    }

    const legacyRead = (notification as any).is_read;
    if (Array.isArray(legacyRead)) {
      const now = new Date();
      const existingEntry = legacyRead.find((entry: any) => {
        const targetIdValue = entry?.target_id?.toString?.() ?? entry?.target_id;
        const targetId = typeof targetIdValue === 'string' ? targetIdValue : targetIdValue?.toString?.();
        if (!targetId) return false;
        return variantsToPersist.includes(targetId);
      });
      if (existingEntry) {
        existingEntry.read = true;
        existingEntry.read_at = now;
      } else {
        legacyRead.push({
          target_id: merchantId,
          target_type: 'merchant',
          read: true,
          read_at: now,
        });
      }
      (notification as any).is_read = legacyRead;
      if (typeof (notification as any).markModified === 'function') {
        (notification as any).markModified('is_read');
      }
    }

    await notification.save();

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