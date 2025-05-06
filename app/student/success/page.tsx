"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, MapPin, User } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [attendanceRecord, setAttendanceRecord] = useState<any>(null)

  useEffect(() => {
    const storedInfo = localStorage.getItem("studentInfo");
    if (!storedInfo) {
      router.push("/student");
      return;
    }

    setStudentInfo(JSON.parse(storedInfo));
    const attendanceRecords = JSON.parse(
      localStorage.getItem("attendanceRecords") || "[]"
    );
    if (attendanceRecords.length > 0) {
      const studentData = JSON.parse(storedInfo);
      const latestRecord = [...attendanceRecords]
        .filter((record) => record.regNo === studentData.regNo)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];

      if (latestRecord) {
        setAttendanceRecord(latestRecord);
      }
    }
  }, [router]);

  if (!studentInfo) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-green-100 p-4">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 animate-pulse-slow bg-green-200 bg-[radial-gradient(circle,_rgba(34,197,94,0.2)_20%,_transparent_80%)] opacity-30 blur-3xl" />

      <Card className="relative z-10 w-full max-w-md border-none shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-400 to-green-600 text-white">
          <CardTitle className="text-center text-2xl">
            Attendance Confirmed!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <Check className="h-12 w-12 text-green-600" />
          </div>

          <h2 className="mb-2 text-xl font-bold">Thank You!</h2>
          <p className="mb-4 text-center">
            Your attendance has been successfully recorded.
          </p>

          <div className="mb-6 w-full rounded-lg bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm text-gray-500">Register Number:</div>
              <div className="text-sm font-medium">{studentInfo.regNo}</div>

              <div className="text-sm text-gray-500">Department/Subject:</div>
              <div className="text-sm font-medium">
                {studentInfo.departmentId}
              </div>

              <div className="text-sm text-gray-500">Date & Time:</div>
              <div className="text-sm font-medium">
                {new Date().toLocaleString()}
              </div>

              {attendanceRecord && (
                <>
                  <div className="text-sm text-gray-500">Session ID:</div>
                  <div className="text-sm font-medium">
                    {attendanceRecord.sessionId}
                  </div>

                  <div className="text-sm text-gray-500">Status:</div>
                  <div
                    className={`text-sm font-medium ${
                      attendanceRecord.status === "present"
                        ? "text-green-600"
                        : attendanceRecord.status === "flagged"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {attendanceRecord.status}
                  </div>

                  {attendanceRecord.location && (
                    <>
                      <div className="text-sm text-gray-500">Location:</div>
                      <div className="flex items-center text-sm font-medium">
                        <MapPin className="mr-1 h-3 w-3 text-gray-400" />
                        {attendanceRecord.isWithinRange
                          ? "Within range"
                          : "Outside range"}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            onClick={() => router.push("/student/dashboard")}
          >
            <User className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
