'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Mail, X, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface EmailVerificationBannerProps {
    merchantId: string;
    email: string;
    onVerified: () => void;
}

export function EmailVerificationBanner({ merchantId, email, onVerified }: EmailVerificationBannerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = async () => {
        try {
            setSending(true);
            const response = await fetch('/api/merchant/verify-email/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchantId })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || 'OTP sent to your email!');
                setOtpSent(true);
                setIsDialogOpen(true);
            } else {
                toast.error(data.error || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setVerifying(true);
            const response = await fetch('/api/merchant/verify-email/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchantId, otp })
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || 'Email verified successfully!');
                setIsDialogOpen(false);
                setOtp('');
                setOtpSent(false);
                onVerified();
            } else {
                toast.error(data.error || 'Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        setOtp('');
        await handleSendOtp();
    };

    return (
        <>
            {/* Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="flex-shrink-0 mt-0.5">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-orange-900 mb-1">
                                Email Verification Required
                            </h3>
                            <p className="text-sm text-orange-800 mb-3">
                                Please verify your email address <strong>{email}</strong> to unlock all features and ensure secure communication.
                            </p>
                            <Button
                                onClick={handleSendOtp}
                                disabled={sending}
                                size="sm"
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Verify Email Now
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Verification Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-600" />
                            Verify Your Email
                        </DialogTitle>
                        <DialogDescription>
                            We've sent a 6-digit OTP to <strong>{email}</strong>. Please enter it below to verify your email address.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="text-sm font-medium">
                                Enter OTP
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                }}
                                maxLength={6}
                                className="text-center text-2xl tracking-widest font-mono"
                                autoComplete="off"
                            />
                            <p className="text-xs text-gray-500">
                                OTP is valid for 10 minutes
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleVerifyOtp}
                                disabled={verifying || otp.length !== 6}
                                className="flex-1"
                            >
                                {verifying ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Verify
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleResendOtp}
                                disabled={sending}
                                variant="outline"
                            >
                                {sending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Resend'
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}