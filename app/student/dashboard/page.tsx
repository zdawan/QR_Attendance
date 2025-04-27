"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Clock, QrCode, User } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import Logo from "@/components/logo"
import { Badge } from "@/components/ui/badge"

export default function StudentDashboardPage() {
  const router = useRouter()
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [studentName, setStudentName] = useState("")
  const [attendancePercentage, setAttendancePercentage] = useState(0)
  const [recentAttendance, setRecentAttendance] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get student info from localStorage
    const storedInfo = localStorage.getItem("studentInfo")
    if (!storedInfo) {
      router.push("/student")
      return
    }

    const studentData = JSON.parse(storedInfo)
    setStudentInfo(studentData)

    // Get all attendance records
    const storedRecords = JSON.parse(localStorage.getItem("attendanceRecords") || "[]")
    setAttendanceRecords(storedRecords)

    // Get all sessions
    const storedSessions = JSON.parse(localStorage.getItem("sessions") || "[]")
    setSessions(storedSessions)

    // Get student name from students list
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]")
    const student = storedStudents.find((s: any) => s.regNo === studentData.regNo)
    if (student) {
      setStudentName(student.name)
    }

    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (studentInfo && attendanceRecords.length > 0 && sessions.length > 0) {
      // Calculate attendance percentage
      const studentRecords = attendanceRecords.filter((record) => record.regNo === studentInfo.regNo)

      // Get sessions for this student's department
      const departmentSessions = sessions.filter((session) => session.subjectCode === studentInfo.departmentId)

      const percentage = departmentSessions.length > 0 ? (studentRecords.length / departmentSessions.length) * 100 : 0

      setAttendancePercentage(Math.round(percentage))

      // Get recent attendance (last 5)
      const recent = [...studentRecords]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)

      setRecentAttendance(recent)
    }
  }, [studentInfo, attendanceRecords, sessions])

  const handleMarkAttendance = () => {
    router.push("/student/scan")
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-4 relative overflow-hidden">
      {/* Background Illustrations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-400 opacity-10 blur-3xl"></div>
        <div className="absolute top-20 left-10 h-32 w-32 border-4 border-white opacity-5 rounded-lg"></div>
        <div className="absolute bottom-20 right-10 h-24 w-24 border-4 border-white opacity-5 rounded-lg"></div>
      </div>

      <div className="container mx-auto max-w-md py-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-white hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Logo size="small" />
        </div>

        <Card className="mb-6 border-none shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Student Dashboard</CardTitle>
                <CardDescription className="text-green-50">Your attendance overview</CardDescription>
              </div>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">{studentName || "Student"}</h3>
                <p className="text-sm text-gray-500">Reg No: {studentInfo.regNo}</p>
                <p className="text-sm text-gray-500">Department: {studentInfo.departmentId}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Attendance Percentage</span>
                  <span className="text-sm font-bold">{attendancePercentage}%</span>
                </div>
                <Progress value={attendancePercentage} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                onClick={handleMarkAttendance}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {recentAttendance.length > 0 ? (
              <div className="space-y-3">
                {recentAttendance.map((record, index) => {
                  const session = sessions.find((s) => s.sessionId === record.sessionId)
                  return (
                    <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            record.status === "present"
                              ? "bg-green-100"
                              : record.status === "flagged"
                                ? "bg-orange-100"
                                : "bg-red-100"
                          }`}
                        >
                          <CheckCircle
                            className={`h-4 w-4 ${
                              record.status === "present"
                                ? "text-green-600"
                                : record.status === "flagged"
                                  ? "text-orange-600"
                                  : "text-red-600"
                            }`}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{session ? session.subjectCode : record.sessionId}</p>
                          <p className="text-xs text-gray-500">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {new Date(record.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "flagged"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No attendance records found</p>
                <p className="text-sm text-gray-400 mt-1">Mark your attendance to see records here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
