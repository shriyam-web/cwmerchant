"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "./navbar";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(300); // 5 mins in seconds
    const [showPassword, setShowPassword] = useState(false);

    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    // OTP Countdown Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === "otp" && otpTimer > 0) {
            timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [otpTimer, step]);

    // Step 1: Send OTP
    const sendOtp = async () => {
        if (!email.trim()) {
            setMessage("⚠️ Please enter your email address.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage("✅ 4 Digit OTP sent to your business email.");
                setStep("otp");
                setOtp(["", "", "", ""]);
                setOtpTimer(300);
            } else setMessage("❌ " + data.error);
        } catch (err) {
            console.error(err);
            setMessage("❌ Server error while sending OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const verifyOtp = async () => {
        const otpCode = otp.join("");
        if (otpCode.length < 4) {
            setMessage("⚠️ Please enter all OTP digits.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), otp: otpCode }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage("✅ OTP verified. Enter your new password.");
                setStep("reset");
            } else setMessage("❌ " + data.error);
        } catch (err) {
            console.error(err);
            setMessage("❌ Server error while verifying OTP.");
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const resendOtp = () => sendOtp();

    // Step 3: Reset Password
    const resetPassword = async () => {
        const passwordValid = validatePassword(newPassword);
        if (!newPassword || !confirmPassword) {
            setMessage("⚠️ Please fill in all password fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("❌ Passwords do not match.");
            return;
        }
        if (!passwordValid.valid) {
            setMessage("❌ " + passwordValid.message);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), newPassword }),
            });
            const data = await res.json();
            if (data.success) {
                setStep("success");
                setMessage("");
            } else setMessage("❌ " + data.error);
        } catch (err) {
            console.error(err);
            setMessage("❌ Server error while resetting password.");
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (pw: string) => {
        if (pw.length < 8) return { valid: false, message: "Password must be at least 8 characters." };
        if (!/[A-Z]/.test(pw)) return { valid: false, message: "Include at least 1 uppercase letter." };
        if (!/[0-9]/.test(pw)) return { valid: false, message: "Include at least 1 number." };
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return { valid: false, message: "Include at least 1 special character." };
        return { valid: true, message: "Strong password" };
    };

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus next input
        if (value && index < 3) otpRefs.current[index + 1]?.focus();
        // Focus previous if empty
        if (!value && index > 0) otpRefs.current[index - 1]?.focus();
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <Navbar />
            <div className="max-w-md mx-auto p-6 mt-6 border rounded-lg shadow-md bg-white">
                {/* Breadcrumb */}
                {/* <a href="/login"> <p className="text-sm text-gray-500 mb-4"> ← Back to Login </p> </a>
                <br /> */}

                <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
                    Forgot Password
                </h2>

                {/* Email Step */}
                {step === "email" && (
                    <>
                        <input
                            type="email"
                            placeholder="Enter your registered business email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* OTP Step */}
                {step === "otp" && (
                    <>
                        <div className="flex justify-between mb-3">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, i)}
                                    ref={(el) => (otpRefs.current[i] = el)}
                                    className="w-14 h-14 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">OTP expires in: {formatTime(otpTimer)}</p>
                        <button
                            onClick={verifyOtp}
                            disabled={loading}
                            className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition mb-2"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            onClick={resendOtp}
                            disabled={otpTimer > 0}
                            className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 transition"
                        >
                            Resend OTP
                        </button>
                    </>
                )}

                {/* Reset Password Step */}
                {step === "reset" && (
                    <>
                        <div className="relative mb-3">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        {/* Password Suggestion Checklist */}
                        <div className="mb-3 text-sm space-y-1">
                            <p className={`flex items-center ${newPassword.length >= 8 ? "text-green-600" : "text-red-600"}`}>
                                {newPassword.length >= 8 ? "✅" : "❌"} Minimum 8 characters
                            </p>
                            <p className={`flex items-center ${/[A-Z]/.test(newPassword) ? "text-green-600" : "text-red-600"}`}>
                                {/[A-Z]/.test(newPassword) ? "✅" : "❌"} At least 1 uppercase letter
                            </p>
                            <p className={`flex items-center ${/[0-9]/.test(newPassword) ? "text-green-600" : "text-red-600"}`}>
                                {/[0-9]/.test(newPassword) ? "✅" : "❌"} At least 1 number
                            </p>
                            <p className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : "text-red-600"}`}>
                                {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "✅" : "❌"} At least 1 special character
                            </p>
                        </div>

                        {/* Password Strength Meter */}
                        {newPassword && (
                            <div className="mb-2 h-2 w-full bg-gray-200 rounded">
                                <div
                                    className={`h-2 rounded ${validatePassword(newPassword).valid
                                        ? "bg-green-500 w-full"
                                        : "bg-red-500 w-1/2"
                                        }`}
                                ></div>
                            </div>
                        )}

                        <button
                            onClick={resetPassword}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </>
                )}


                {/* Success Step */}
                {step === "success" && (
                    <div className="text-center">
                        <p className="text-green-600 font-semibold text-lg mb-4">
                            ✅ Password reset successful!
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
                        >
                            Go Back to Login
                        </a>
                    </div>
                )}

                {/* Message */}
                {message && (
                    <p
                        className={`mt-3 text-sm text-center ${message.startsWith("✅")
                            ? "text-green-600"
                            : message.startsWith("⚠️")
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </>
    );
}
