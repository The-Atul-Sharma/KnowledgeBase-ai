"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-900 border border-red-400 text-red-200 px-4 py-3 rounded">
      {message}
    </div>
  );
};

const EmailForm = ({ email, setEmail, loading, onSubmit }) => (
  <form className="mt-8 space-y-6" onSubmit={onSubmit}>
    <div>
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div>
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </div>
  </form>
);

const OTPForm = ({ email, otp, setOtp, loading, onVerify, onResetEmail }) => (
  <form className="mt-8 space-y-6" onSubmit={onVerify}>
    <div>
      <label htmlFor="otp" className="sr-only">
        OTP Code
      </label>
      <input
        id="otp"
        name="otp"
        type="text"
        required
        maxLength={6}
        className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
        placeholder="000000"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      />
      <p className="mt-2 text-center text-xs text-gray-400">
        Enter the 6-digit code sent to {email}
      </p>
    </div>
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onResetEmail}
        className="flex-1 py-2 px-4 border border-gray-700 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700"
      >
        Change Email
      </button>
      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  </form>
);

const useOTPAuth = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: null,
        },
      });

      if (error) throw error;
      setOtpSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (data?.session || data?.user) {
        router.push("/admin");
        router.refresh();
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/admin");
        router.refresh();
      } else {
        throw new Error("Session not created. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetEmail = () => {
    setOtpSent(false);
    setOtp("");
    setError(null);
  };

  return {
    email,
    setEmail,
    otp,
    setOtp,
    loading,
    error,
    otpSent,
    sendOTP,
    verifyOTP,
    resetEmail,
  };
};

export default function LoginPage() {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    loading,
    error,
    otpSent,
    sendOTP,
    verifyOTP,
    resetEmail,
  } = useOTPAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <Header hideFeatures={true} hideHome={true} />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in or Create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Enter your email address to continue
            </p>
          </div>

          <ErrorMessage message={error} />

          {!otpSent ? (
            <EmailForm
              email={email}
              setEmail={setEmail}
              loading={loading}
              onSubmit={sendOTP}
            />
          ) : (
            <OTPForm
              email={email}
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              onVerify={verifyOTP}
              onResetEmail={resetEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
}
