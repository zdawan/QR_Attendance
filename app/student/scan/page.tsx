"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, Check, MapPin } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import QrScanner from "@/components/qr-scanner"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ScanPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [manualEntry, setManualEntry] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [attendanceMarked, setAttendanceMarked] = useState(false)
  const [isWithinRange, setIsWithinRange] = useState(false)
  const [locationChecked, setLocationChecked] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    // Get student info from localStorage
    const storedInfo = localStorage.getItem("studentInfo")
    if (!storedInfo) {
      router.push("/student")
      return
    }

    setStudentInfo(JSON.parse(storedInfo))

    // Get available sessions
    const storedSessions = JSON.parse(localStorage.getItem("sessions") || "[]")
    // Filter sessions that are still active and match the student's department
    const studentInfo = JSON.parse(storedInfo)
    const activeSessions = storedSessions.filter((session: any) => {
      const isActive = new Date(session.expiresAt) > new Date()
      const matchesDepartment = session.subjectCode === studentInfo.departmentId
      return isActive && matchesDepartment
    })
    setSessions(activeSessions)

    // Check location
    checkLocation()
  }, [router])

  const checkLocation = () => {
    setLocationChecked(true) // Mark as checked regardless of outcome

    if (!navigator.geolocation) {
      console.log("Geolocation not supported by this browser")
      toast({
        title: "Location Unavailable",
        description:
          "Your browser doesn't support geolocation. Attendance will be marked without location verification.",
      })
      setIsWithinRange(true) // Allow attendance without location in preview
      return
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const studentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(studentLocation)

          // Mock classroom location (in a real app, this would come from the database)
          const classroomLocation = {
            lat: position.coords.latitude + 0.0001, // Very close for testing
            lng: position.coords.longitude + 0.0001,
          }

          // Calculate distance (using a simple approximation for demo)
          const distance = calculateDistance(
            studentLocation.lat,
            studentLocation.lng,
            classroomLocation.lat,
            classroomLocation.lng,
          )

          // Check if within 50 meters
          const withinRange = distance <= 50
          setIsWithinRange(withinRange)

          if (!withinRange) {
            toast({
              title: "Location Warning",
              description: "You appear to be outside the classroom range (50m). Attendance may be flagged.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Location Verified",
              description: "You are within the classroom range.",
            })
          }
        },
        (error) => {
          console.error("Error getting location:", error)

          // For preview/demo purposes, allow attendance without location
          setIsWithinRange(true)

          let errorMessage = "Unable to get your location. "

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Location permission denied."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information unavailable."
              break
            case error.TIMEOUT:
              errorMessage += "Location request timed out."
              break
            default:
              errorMessage += "An unknown error occurred."
          }

          toast({
            title: "Location Error",
            description: errorMessage + " Proceeding without location verification.",
          })
        },
        { timeout: 10000, enableHighAccuracy: false },
      )
    } catch (e) {
      console.error("Geolocation error:", e)
      setIsWithinRange(true) // Allow attendance without location in preview
      toast({
        title: "Location Error",
        description: "Unable to access location services. Proceeding without location verification.",
      })
    }
  }

  // Simple distance calculation using Haversine formula (approximate)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in meters
  }

  const handleSessionSelect = (session: any) => {
    setSelectedSession(session)
    setSessionId(session.sessionId)
  }

  const handleQrCodeScanned = (data: string) => {
    try {
      // Assuming QR code contains a JSON string with session info
      const qrData = JSON.parse(data)
      setScanResult(data)

      // Mark attendance with the scanned data
      markAttendance(qrData.sessionId)
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "The QR code could not be processed. Please try again or use manual entry.",
        variant: "destructive",
      })
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    markAttendance(sessionId)
  }

  const markAttendance = async (sessionId: string) => {
    if (!studentInfo) {
      toast({
        title: "Error",
        description: "Missing student information.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Find the session
      const storedSessions = JSON.parse(localStorage.getItem("sessions") || "[]")
      const session = storedSessions.find((s: any) => s.sessionId === sessionId)

      if (!session) {
        throw new Error("Session not found")
      }

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        throw new Error("Session has expired")
      }

      const attendanceRecord = {
        sessionId,
        regNo: studentInfo.regNo,
        departmentId: studentInfo.departmentId,
        timestamp: new Date().toISOString(),
        location: location || { lat: 0, lng: 0 }, // Provide fallback location
        status: isWithinRange ? "present" : "flagged",
        isWithinRange,
      }

      // Get existing attendance records or initialize empty array
      const existingRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")

      // Check if student already marked attendance for this session
      const alreadyMarked = existingRecords.some(
        (record: any) => record.sessionId === sessionId && record.regNo === studentInfo.regNo,
      )

      if (alreadyMarked) {
        throw new Error("You have already marked attendance for this session")
      }

      existingRecords.push(attendanceRecord)

      // Save back to localStorage
      localStorage.setItem("attendanceRecords", JSON.stringify(existingRecords))

      // Show success message
      toast({
        title: "Success!",
        description: isWithinRange
          ? "Your attendance has been marked successfully."
          : "Attendance marked but flagged due to location.",
        variant: "default",
      })

      setAttendanceMarked(true)

      // Redirect to confirmation page after a delay
      setTimeout(() => {
        router.push("/student/success")
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!studentInfo) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (attendanceMarked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
        <Card className="w-full max-w-md border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-400 to-green-600 text-white">
            <CardTitle className="text-center text-2xl">Attendance Marked!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-4 rounded-full bg-green-100 p-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-center text-lg">Your attendance has been recorded successfully.</p>
            <p className="mt-2 text-center text-sm text-gray-500">Register Number: {studentInfo.regNo}</p>
            <Button
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => router.push("/")}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-4">
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center py-6">
        <Link href="/student/dashboard" className="mb-4 flex items-center text-white hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {locationChecked && !isWithinRange && (
          <Alert variant="destructive" className="mb-4">
            <MapPin className="h-4 w-4" />
            <AlertTitle>Location Warning</AlertTitle>
            <AlertDescription>
              You appear to be outside the classroom range (50m). Your attendance may be flagged for review.
            </AlertDescription>
          </Alert>
        )}

        <Card className="w-full border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
            <CardTitle className="text-center text-2xl">
              {selectedSession ? "Scan QR Code" : "Select Session"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!selectedSession ? (
              <div className="space-y-4">
                <h3 className="font-medium">Available Sessions:</h3>
                {sessions.length > 0 ? (
                  <div className="space-y-2">
                    {sessions.map((session, index) => (
                      <div
                        key={index}
                        className="cursor-pointer rounded-lg border p-3 hover:bg-gray-50"
                        onClick={() => handleSessionSelect(session)}
                      >
                        <div className="font-medium">{session.subjectCode}</div>
                        <div className="text-sm text-gray-500">
                          Expires: {new Date(session.expiresAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
                    <p className="text-gray-500">No active sessions available for your department.</p>
                  </div>
                )}

                <div className="pt-2 text-center">
                  <Button variant="outline" onClick={() => setManualEntry(true)} className="w-full">
                    Enter Session ID Manually
                  </Button>
                </div>
              </div>
            ) : !manualEntry ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <QrScanner onScan={handleQrCodeScanned} sessionData={selectedSession} />
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>Position the QR code within the frame to scan</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setSelectedSession(null)}>
                    Back to Sessions
                  </Button>

                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    onClick={() => setManualEntry(true)}
                  >
                    Enter ID Manually
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionId">Session ID</Label>
                  <Input
                    id="sessionId"
                    placeholder="Enter the session ID"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setManualEntry(false)
                      if (!selectedSession) setSelectedSession(null)
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {selectedSession ? "Use Camera" : "Back to Sessions"}
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-600"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
