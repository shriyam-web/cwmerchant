import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  status: 'draft' | 'sent' | 'archived';
  target_audience: 'all' | 'merchant' | 'customer' | 'specific';
  target_ids: string[] | null; // null means all users of target_audience
  priority: 'low' | 'medium' | 'high' | 'urgent';
  link?: string; // Optional link for action
  icon?: string; // Optional icon name
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // Optional expiration date
  readBy?: string[]; // Array of user IDs who have read this notification
}

const NotificationSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'announcement'],
      default: 'info',
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'archived'],
      default: 'draft',
    },
    target_audience: {
      type: String,
      enum: ['all', 'merchant', 'customer', 'specific'],
      required: true,
    },
    target_ids: {
      type: [String],
      default: null,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    link: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
    readBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
NotificationSchema.index({ status: 1, target_audience: 1 });
NotificationSchema.index({ target_ids: 1 });
NotificationSchema.index({ createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;