"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<"EMAIL" | "VERIFY">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpStatus, setOtpStatus] = useState<"IDLE" | "VERIFYING" | "VALID" | "INVALID">("IDLE");

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtpInline(otp);
    } else {
      setOtpStatus("IDLE");
      setIsOtpVerified(false);
    }
  }, [otp]);

  const verifyOtpInline = async (code: string) => {
    setOtpStatus("VERIFYING");
    try {
      const res = await fetch("/api/auth/verify-forgot-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      if (res.ok) {
        setOtpStatus("VALID");
        setIsOtpVerified(true);
      } else {
        setOtpStatus("INVALID");
        setIsOtpVerified(false);
      }
    } catch {
      setOtpStatus("INVALID");
      setIsOtpVerified(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reset email");

      setStep("VERIFY");
      setTimer(59);
      setSuccessMsg("If your email exists, an OTP has been sent.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpVerified) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      // Success
      alert("Password reset successfully! Please login with your new password.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-sand">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-serif font-bold text-brand-ink">
            {step === "EMAIL" ? "Reset Password" : "Set New Password"}
          </h2>
          <p className="mt-2 text-center text-sm text-brand-slate">
            {step === "EMAIL" 
              ? "Enter your email address and we'll send you an OTP to reset your password." 
              : successMsg}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        {step === "EMAIL" && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-rose focus:border-brand-rose transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-ink hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-ink transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Back to sign in
              </Link>
            </div>
          </form>
        )}

        {step === "VERIFY" && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifySubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider text-center">Enter 6-Digit OTP</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className={`appearance-none block w-full px-3 py-4 text-center text-2xl tracking-[0.5em] border rounded-lg focus:outline-none focus:ring-2 transition-colors font-mono ${
                    otpStatus === "VALID" ? "border-green-500 focus:ring-green-500 text-green-700" :
                    otpStatus === "INVALID" ? "border-red-500 focus:ring-red-500 text-red-700" :
                    "border-gray-200 focus:ring-brand-rose focus:border-brand-rose"
                  }`}
                  placeholder="000000"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  {otpStatus === "VERIFYING" && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
                  {otpStatus === "VALID" && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {otpStatus === "INVALID" && <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              </div>
              {otpStatus === "INVALID" && (
                <p className="mt-2 text-xs text-center text-red-500 font-medium">Enter a valid OTP</p>
              )}
              {otpStatus !== "INVALID" && (
                <p className="mt-2 text-xs text-center text-gray-500">
                  Please check your email (or the terminal) for the code.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                New Password <span className="text-[10px] text-gray-400 font-normal normal-case">(Min 8 chars)</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-rose focus:border-brand-rose transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !isOtpVerified || newPassword.length < 8}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-ink hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-ink transition-colors disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleEmailSubmit}
                disabled={timer > 0 || loading}
                className="text-sm font-medium text-brand-rose hover:text-brand-rose-dark disabled:text-gray-400 transition-colors"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
