"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, QrCode } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/logo";

export default function StudentPage() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    localStorage.setItem(
      "studentInfo",
      JSON.stringify({
        regNo,
        departmentId,
        timestamp: new Date().toISOString(),
      })
    );

    router.push("/student/otp");
  };

  return (
    <div className="min-h-screen bg-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-black opacity-5 blur-2xl" />
        <div className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-black opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-black opacity-5 blur-2xl" />
        <div className="absolute top-10 left-10 h-12 w-12 border border-black opacity-10 rotate-45" />
        <div className="absolute bottom-10 right-10 h-16 w-16 border border-black opacity-10 rounded-xl rotate-12" />
      </div>

      <div className="container mx-auto flex max-w-md flex-col items-center justify-center py-12 relative z-10">
        <Link
          href="/"
          className="mb-6 flex items-center text-black hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="w-full border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <div className="flex flex-col items-center">
              <Logo size="medium" className="mb-4" />
              <CardTitle className="text-center text-2xl">
                Student Attendance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regNo">Register Number</Label>
                <Input
                  id="regNo"
                  placeholder="Enter your register number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">
                  Department ID / Subject Code
                </Label>
                <Input
                  id="departmentId"
                  placeholder="e.g. IT01, CSE02"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                disabled={isSubmitting}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Proceed to Scan QR Code
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Your camera will open on the next screen</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
