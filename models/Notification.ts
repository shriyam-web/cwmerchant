import mongoose, { Schema, Document } from "mongoose";

export type NotificationType = "info" | "success" | "warning" | "error" | "announcement";
export type NotificationStatus = "draft" | "sent" | "archived";
export type NotificationTarget = "all" | "merchant" | "customer" | "user" | "franchise" | "specific";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface INotification extends Document {
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  target_audience: NotificationTarget;
  target_ids?: string[] | null;
  icon?: string;
  link?: string;
  priority: NotificationPriority;
  readBy: string[];
  expiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error", "announcement"],
      default: "info",
    },
    status: {
      type: String,
      enum: ["draft", "sent", "archived"],
      default: "sent",
    },
    target_audience: {
      type: String,
      enum: ["all", "merchant", "customer", "user", "franchise", "specific"],
      required: true,
      default: "merchant",
    },
    target_ids: {
      type: [String],
      default: [],
    },
    icon: { type: String, default: "" },
    link: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    readBy: {
      type: [String],
      default: [],
    },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
