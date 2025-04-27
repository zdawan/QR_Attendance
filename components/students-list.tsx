"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, MoreHorizontal, Trash, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface StudentsListProps {
  students: any[]
  onDelete: (regNo: string) => void
  attendanceRecords: any[]
}

export default function StudentsList({ students, onDelete, attendanceRecords }: StudentsListProps) {
  const { toast } = useToast()
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [name, setName] = useState("")
  const [regNo, setRegNo] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEdit = (student: any) => {
    setEditingStudent(student)
    setName(student.name)
    setRegNo(student.regNo)
    setDepartmentId(student.departmentId)
    setIsAddingNew(false)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingStudent(null)
    setName("")
    setRegNo("")
    setDepartmentId("")
    setIsAddingNew(true)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    // Validate inputs
    if (!name || !regNo || !departmentId) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    // Get existing students
    const storedStudents = JSON.parse(localStorage.getItem("students") || "[]")

    if (isAddingNew) {
      // Check if reg no already exists
      if (storedStudents.some((s: any) => s.regNo === regNo)) {
        toast({
          title: "Error",
          description: "A student with this register number already exists",
          variant: "destructive",
        })
        return
      }

      // Add new student
      const newStudent = { name, regNo, departmentId }
      storedStudents.push(newStudent)
      localStorage.setItem("students", JSON.stringify(storedStudents))

      toast({
        title: "Success",
        description: "Student added successfully",
      })
    } else {
      // Update existing student
      const updatedStudents = storedStudents.map((s: any) => {
        if (s.regNo === editingStudent.regNo) {
          return { name, regNo, departmentId }
        }
        return s
      })
      localStorage.setItem("students", JSON.stringify(updatedStudents))

      toast({
        title: "Success",
        description: "Student updated successfully",
      })
    }

    // Close dialog and refresh
    setIsDialogOpen(false)
    window.location.reload()
  }

  const handleDelete = (student: any) => {
    // Check if student has attendance records
    const hasRecords = attendanceRecords.some((record) => record.regNo === student.regNo)

    if (hasRecords) {
      if (
        !confirm(
          "This student has attendance records. Deleting will also remove all their attendance records. Continue?",
        )
      ) {
        return
      }
    }

    onDelete(student.regNo)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student List</CardTitle>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          Add Student
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.length > 0 ? (
            students.map((student, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">
                      {student.regNo} - {student.departmentId}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(student)} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(student)}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                      Delete Student
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No students found</p>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isAddingNew ? "Add New Student" : "Edit Student"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Enter the details for the new student." : "Update the student information."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regNo">Register Number</Label>
              <Input
                id="regNo"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. 71812205101"
                disabled={!isAddingNew} // Can't change reg no for existing students
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Department ID</Label>
              <Input
                id="departmentId"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                placeholder="e.g. IT01, CSE02"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{isAddingNew ? "Add Student" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
