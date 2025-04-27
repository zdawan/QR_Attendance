"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Clock, QrCode } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import AdminHeader from "@/components/admin-header"
import QRCode from "@/components/qr-code"

export default function CreateSessionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [adminSession, setAdminSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [subjectCode, setSubjectCode] = useState("")
  const [expiryMinutes, setExpiryMinutes] = useState("5")
  const [sessionId, setSessionId] = useState("")
  const [qrData, setQrData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if admin is logged in
    const storedSession = localStorage.getItem("adminSession")
    if (!storedSession) {
      router.push("/admin/login")
      return
    }

    setAdminSession(JSON.parse(storedSession))

    // Generate a random session ID
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase()
    setSessionId(randomId)

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create QR code data
    const sessionData = {
      sessionId,
      subjectCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + Number.parseInt(expiryMinutes) * 60 * 1000).toISOString(),
      createdBy: adminSession.email,
    }

    setQrData(sessionData)

    // In a real app, this would be saved to a database
    // For this demo, we'll save to localStorage
    const storedSessions = JSON.parse(localStorage.getItem("sessions") || "[]")
    storedSessions.push(sessionData)
    localStorage.setItem("sessions", JSON.stringify(storedSessions))

    toast({
      title: "Session Created",
      description: "QR code has been generated successfully.",
    })

    setIsSubmitting(false)
  }

  const handleSaveSession = () => {
    router.push("/admin/dashboard")
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!adminSession) {
    return <div className="flex h-screen items-center justify-center">Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader email={adminSession.email} onLogout={handleLogout} />

      <main className="container mx-auto p-4 py-6">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle>Create Attendance Session</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreateSession} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionId">Session ID</Label>
                    <Input
                      id="sessionId"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      required
                      readOnly
                    />
                    <p className="text-xs text-gray-500">Auto-generated unique ID</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subjectCode">Subject Code / Department ID</Label>
                    <Input
                      id="subjectCode"
                      placeholder="e.g. IT01, CSE02"
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryMinutes">Expiry Time (minutes)</Label>
                    <Input
                      id="expiryMinutes"
                      type="number"
                      min="1"
                      max="60"
                      value={expiryMinutes}
                      onChange={(e) => setExpiryMinutes(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    disabled={isSubmitting || !!qrData}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            {qrData ? (
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <CardTitle>QR Code Generated</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 rounded-lg border-2 border-dashed border-gray-200">
                    <QRCode value={JSON.stringify(qrData)} size={200} level="H" includeMargin={true} />
                  </div>

                  <div className="mb-4 w-full rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-gray-500">Session ID:</div>
                      <div className="text-sm font-medium">{qrData.sessionId}</div>

                      <div className="text-sm text-gray-500">Subject Code:</div>
                      <div className="text-sm font-medium">{qrData.subjectCode}</div>

                      <div className="text-sm text-gray-500">Expires In:</div>
                      <div className="flex items-center text-sm font-medium">
                        <Clock className="mr-1 h-3 w-3 text-orange-500" />
                        {expiryMinutes} minutes
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    onClick={handleSaveSession}
                  >
                    Save & Return to Dashboard
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <div>
                  <QrCode className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No QR Code Generated</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Fill out the form and click "Generate QR Code" to create a new attendance session.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
