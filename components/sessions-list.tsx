"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Download, Edit, MoreHorizontal, QrCode, Trash, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import QRCode from "@/components/qr-code"
import { useRouter } from "next/navigation"

interface SessionsListProps {
  sessions: any[]
  onDelete: (sessionId: string) => void
  attendanceRecords: any[]
  students: any[]
}

export default function SessionsList({ sessions, onDelete, attendanceRecords, students }: SessionsListProps) {
  const router = useRouter()
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const [qrSession, setQrSession] = useState<any>(null)
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)

  const toggleExpand = (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null)
    } else {
      setExpandedSession(sessionId)
    }
  }

  const isSessionActive = (expiresAt: string) => {
    return new Date(expiresAt) > new Date()
  }

  const handleViewQr = (session: any) => {
    setQrSession(session)
    setIsQrDialogOpen(true)
  }

  const handleEditSession = (sessionId: string) => {
    // In a real app, this would navigate to an edit page
    // For this demo, we'll just show an alert
    alert(`Edit session ${sessionId} - This would navigate to an edit page in a real app`)
  }

  const handleDeleteSession = (sessionId: string) => {
    // Check if session has attendance records
    const hasRecords = attendanceRecords.some((record) => record.sessionId === sessionId)

    if (hasRecords) {
      if (
        !confirm(
          "This session has attendance records. Deleting will also remove all related attendance records. Continue?",
        )
      ) {
        return
      }
    }

    onDelete(sessionId)
  }

  const getSessionAttendance = (sessionId: string) => {
    return attendanceRecords.filter((record) => record.sessionId === sessionId)
  }

  const exportSessionAttendance = (sessionId: string) => {
    const records = getSessionAttendance(sessionId)
    if (records.length === 0) {
      alert("No attendance records for this session")
      return
    }

    // Create CSV content
    let csvContent = "Register Number,Name,Department,Timestamp,Status\n"

    records.forEach((record) => {
      const student = students.find((s) => s.regNo === record.regNo)
      const studentName = student ? student.name : "Unknown"

      csvContent += `${record.regNo},${studentName},${record.departmentId},${record.timestamp},${record.status}\n`
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `attendance_session_${sessionId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session, index) => {
          const sessionAttendance = getSessionAttendance(session.sessionId)

          return (
            <Card
              key={index}
              className={`overflow-hidden transition-all duration-300 ${
                expandedSession === session.sessionId ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <CardHeader className="bg-gray-50 pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-lg">{session.subjectCode}</CardTitle>
                    <div
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                        isSessionActive(session.expiresAt) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isSessionActive(session.expiresAt) ? "Active" : "Expired"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(session.sessionId)}>
                      {expandedSession === session.sessionId ? "Hide Details" : "Show Details"}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewQr(session)} className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          View QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditSession(session.sessionId)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit Session
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => exportSessionAttendance(session.sessionId)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Export Attendance
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSession(session.sessionId)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                          Delete Session
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {expandedSession === session.sessionId && (
                <CardContent className="p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Session ID</div>
                      <div className="font-mono text-sm font-medium">{session.sessionId}</div>

                      <div className="text-sm text-gray-500">Created At</div>
                      <div className="text-sm">{new Date(session.createdAt).toLocaleString()}</div>

                      <div className="text-sm text-gray-500">Expires At</div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-3 w-3 text-orange-500" />
                        {new Date(session.expiresAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-medium">Attendance Summary</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="mr-1 h-3 w-3" />
                          {sessionAttendance.length} Students
                        </div>
                      </div>

                      {sessionAttendance.length > 0 ? (
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {sessionAttendance.map((record, idx) => {
                            const student = students.find((s) => s.regNo === record.regNo)
                            return (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span>{student ? student.name : record.regNo}</span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    record.status === "present"
                                      ? "bg-green-100 text-green-800"
                                      : record.status === "flagged"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {record.status}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-center text-sm text-gray-500">
                          No attendance records for this session yet
                        </div>
                      )}

                      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => handleViewQr(session)}>
                        <QrCode className="mr-2 h-4 w-4" />
                        View QR Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <QrCode className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">No sessions created yet</p>
            <Button
              className="mt-4 bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/admin/sessions/create")}
            >
              Create Your First Session
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session QR Code</DialogTitle>
          </DialogHeader>

          {qrSession && (
            <div className="flex flex-col items-center p-4">
              <div className="mb-4 rounded-lg border-2 border-dashed border-gray-200">
                <QRCode value={JSON.stringify(qrSession)} size={200} level="H" includeMargin={true} />
              </div>

              <div className="w-full space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Session ID:</div>
                  <div className="font-medium">{qrSession.sessionId}</div>

                  <div className="text-gray-500">Subject Code:</div>
                  <div className="font-medium">{qrSession.subjectCode}</div>

                  <div className="text-gray-500">Status:</div>
                  <div
                    className={`font-medium ${
                      isSessionActive(qrSession.expiresAt) ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isSessionActive(qrSession.expiresAt) ? "Active" : "Expired"}
                  </div>
                </div>

                <p className="mt-4 text-center text-sm text-gray-500">
                  Students can scan this QR code to mark their attendance
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
