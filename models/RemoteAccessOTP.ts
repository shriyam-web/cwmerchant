import mongoose from 'mongoose';

export interface IRemoteAccessOTP {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const RemoteAccessOTPSchema = new mongoose.Schema<IRemoteAccessOTP>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // TTL index - document auto-deletes after 600 seconds (10 minutes)
  },
});

// Create index for automatic deletion
RemoteAccessOTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export const RemoteAccessOTP =
  mongoose.models.RemoteAccessOTP || mongoose.model<IRemoteAccessOTP>('RemoteAccessOTP', RemoteAccessOTPSchema);