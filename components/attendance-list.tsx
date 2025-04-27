"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, MapPin, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface AttendanceListProps {
  attendanceRecords: any[]
  sessions: any[]
  students: any[]
  onDelete: (index: number) => void
  onUpdateStatus: (index: number, status: string) => void
}

export default function AttendanceList({
  attendanceRecords,
  sessions,
  students,
  onDelete,
  onUpdateStatus,
}: AttendanceListProps) {
  const [editingRecord, setEditingRecord] = useState<{ record: any; index: number } | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getSessionName = (sessionId: string) => {
    const session = sessions.find((s) => s.sessionId === sessionId)
    return session ? `${session.subjectCode} (${sessionId})` : sessionId
  }

  const getStudentName = (regNo: string) => {
    const student = students.find((s) => s.regNo === regNo)
    return student ? student.name : regNo
  }

  const handleEdit = (record: any, index: number) => {
    setEditingRecord({ record, index })
    setNewStatus(record.status)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingRecord) {
      onUpdateStatus(editingRecord.index, newStatus)
      setIsDialogOpen(false)
      setEditingRecord(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {attendanceRecords.length > 0 ? (
            attendanceRecords.map((record, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3 pt-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getStudentName(record.regNo)}</span>
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
                  <p className="text-sm text-gray-500">Session: {getSessionName(record.sessionId)}</p>
                  <p className="text-xs text-gray-400">{new Date(record.timestamp).toLocaleString()}</p>
                  {record.location && (
                    <div className="flex items-center text-xs text-gray-400">
                      <MapPin className="mr-1 h-3 w-3" />
                      {record.isWithinRange ? "Within range" : "Outside range"}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(record, index)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => onDelete(index)}>
                    <Trash className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No attendance records found</p>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Attendance Status</DialogTitle>
            <DialogDescription>Change the attendance status for this record.</DialogDescription>
          </DialogHeader>

          {editingRecord && (
            <div className="space-y-4 py-4">
              <div>
                <p className="font-medium">{getStudentName(editingRecord.record.regNo)}</p>
                <p className="text-sm text-gray-500">Session: {getSessionName(editingRecord.record.sessionId)}</p>
                <p className="text-xs text-gray-400">{new Date(editingRecord.record.timestamp).toLocaleString()}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Attendance Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
