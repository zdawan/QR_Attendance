"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/logo";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sendOtp = async () => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setOtpSent(true);
      setMessage("OTP sent to your email");
      setTimeLeft(300); // 5 minutes
    } else {
      setMessage("Failed to send OTP");
    }
  };

  useEffect(() => {
    if (!otpSent) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [otpSent]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const verifyOtp = () => {
    setMessage("Verified!");
    setVerified(true);
    setOtp("");
    setOtpSent(false);
    setTimeLeft(0);
  };

  const goToNext = () => {
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 p-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-black opacity-5 blur-2xl" />
        <div className="absolute bottom-16 right-12 grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-2 w-2 bg-black opacity-10 rounded-full" />
          ))}
        </div>
        <div className="absolute top-1/2 -left-40 w-[400px] h-[4px] bg-black opacity-10 rotate-45" />
        <div className="absolute top-20 right-20 h-32 w-32 border-2 border-black opacity-10 rounded-lg rotate-12" />
        <div className="absolute bottom-28 left-1/3 h-40 w-64 bg-black opacity-5 rotate-3 rounded-lg blur-sm" />
      </div>

      {/* Main UI */}
      <div className="container mx-auto max-w-md py-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center text-gray-700 hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Logo size="small" />
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardTitle>OTP Login</CardTitle>
            <CardDescription className="text-green-50">
              Secure access to your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <input
              type="email"
              placeholder="Enter email"
              className="border p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent && timeLeft > 0}
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={otpSent && timeLeft > 0}
            >
              Send OTP to {email}
            </button>

            {otpSent && timeLeft > 0 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="border p-2 w-full rounded"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Verify OTP
                </button>
                <p className="text-sm text-gray-600 text-center">
                  Time remaining:{" "}
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </p>
              </>
            )}

            {message && (
              <p className="text-sm text-gray-700 text-center">{message}</p>
            )}

            {verified && (
              <button
                onClick={goToNext}
                className="w-full mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Continue to Dashboard
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
