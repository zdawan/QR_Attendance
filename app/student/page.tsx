"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, QrCode } from "lucide-react"
import Link from "next/link"
import Logo from "@/components/logo"

export default function StudentPage() {
  const router = useRouter()
  const [regNo, setRegNo] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Store the student info in localStorage for the QR scanner to use
    localStorage.setItem(
      "studentInfo",
      JSON.stringify({
        regNo,
        departmentId,
        timestamp: new Date().toISOString(),
      }),
    )

    // Navigate to the student dashboard
    router.push("/student/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4 relative overflow-hidden">
      {/* Background Illustrations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-400 opacity-10 blur-3xl"></div>

        {/* QR Code Pattern */}
        <div className="absolute top-20 left-10 h-32 w-32 border-4 border-white opacity-5 rounded-lg"></div>
        <div className="absolute bottom-20 right-10 h-24 w-24 border-4 border-white opacity-5 rounded-lg"></div>
      </div>

      <div className="container mx-auto flex max-w-md flex-col items-center justify-center py-12 relative z-10">
        <Link href="/" className="mb-6 flex items-center text-white hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="w-full border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <div className="flex flex-col items-center">
              <Logo size="medium" className="mb-4" />
              <CardTitle className="text-center text-2xl">Student Attendance</CardTitle>
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
                <Label htmlFor="departmentId">Department ID / Subject Code</Label>
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
  )
}
