"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Logo from "@/components/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (email === "faculty@institution.edu" && password === "faculty123") {
      localStorage.setItem(
        "adminSession",
        JSON.stringify({
          email,
          isLoggedIn: true,
          timestamp: new Date().toISOString(),
        })
      );

      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard!",
      });

      router.push("/admin/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-black opacity-5 blur-2xl" />
        <div className="absolute bottom-10 right-10 h-24 w-24 border-2 border-black opacity-10 rotate-12 rounded-md" />
        <div className="absolute top-1/2 left-1/3 h-48 w-48 bg-black opacity-5 rounded-full blur-md" />
        <div className="absolute top-10 right-1/4 h-12 w-12 border border-black opacity-10 rotate-45" />
        <div className="absolute bottom-20 left-16 grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-2 w-2 bg-black opacity-10 rounded-full" />
          ))}
        </div>
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
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex flex-col items-center">
              <Logo size="medium" className="mb-4" />
              <CardTitle className="text-center text-2xl">
                Faculty/Admin Login
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="faculty@institution.edu"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Demo Credentials:</p>
                <p>Email: faculty@institution.edu</p>
                <p>Password: faculty123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
