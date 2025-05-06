"use client"


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Calendar,
  Download,
  FileDown,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import { Filter, Search, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AdminHeader from "@/components/admin-header";
import SessionsList from "@/components/sessions-list";
import StudentsList from "@/components/students-list";
import AttendanceList from "@/components/attendance-list";
import { generateDemoSessions, generateDemoStudents } from "@/lib/demo-data";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [adminSession, setAdminSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sessions, setSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  useEffect(() => {
    const storedSession = localStorage.getItem("adminSession");
    if (!storedSession) {
      router.push("/admin/login");
      return;
    }

    setAdminSession(JSON.parse(storedSession));

    let storedSessions = localStorage.getItem("sessions");
    if (!storedSessions) {
      const demoSessions = generateDemoSessions();
      localStorage.setItem("sessions", JSON.stringify(demoSessions));
      storedSessions = JSON.stringify(demoSessions);
    }
    setSessions(JSON.parse(storedSessions));

    let storedStudents = localStorage.getItem("students");
    if (!storedStudents) {
      const demoStudents = generateDemoStudents();
      localStorage.setItem("students", JSON.stringify(demoStudents));
      storedStudents = JSON.stringify(demoStudents);
    }
    setStudents(JSON.parse(storedStudents));

    const storedRecords = localStorage.getItem("attendanceRecords");
    if (storedRecords) {
      setAttendanceRecords(JSON.parse(storedRecords));
    }

    setIsLoading(false);
  }, [router]);

  const refreshData = () => {
    const storedSessions = localStorage.getItem("sessions");
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }

    const storedStudents = localStorage.getItem("students");
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }

    const storedRecords = localStorage.getItem("attendanceRecords");
    if (storedRecords) {
      setAttendanceRecords(JSON.parse(storedRecords));
    }
  };

  const [studentSearch, setStudentSearch] = useState("");
  const [studentDeptFilter, setStudentDeptFilter] = useState("all");
  const [showStudentFilters, setShowStudentFilters] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/");
  };

  const handleCreateSession = () => {
    router.push("/admin/sessions/create");
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(
      (session) => session.sessionId !== sessionId
    );
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
    setSessions(updatedSessions);

    const updatedRecords = attendanceRecords.filter(
      (record) => record.sessionId !== sessionId
    );
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    setAttendanceRecords(updatedRecords);

    toast({
      title: "Session Deleted",
      description:
        "The session and related attendance records have been deleted.",
    });
  };

  const handleDeleteStudent = (regNo: string) => {
    const updatedStudents = students.filter(
      (student) => student.regNo !== regNo
    );
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    setStudents(updatedStudents);

    const updatedRecords = attendanceRecords.filter(
      (record) => record.regNo !== regNo
    );
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    setAttendanceRecords(updatedRecords);

    toast({
      title: "Student Deleted",
      description:
        "The student and related attendance records have been deleted.",
    });
  };

  const handleDeleteAttendance = (index: number) => {
    const updatedRecords = [...attendanceRecords];
    updatedRecords.splice(index, 1);
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    setAttendanceRecords(updatedRecords);

    toast({
      title: "Attendance Record Deleted",
      description: "The attendance record has been deleted.",
    });
  };

  const handleUpdateAttendance = (index: number, status: string) => {
    const updatedRecords = [...attendanceRecords];
    updatedRecords[index].status = status;
    localStorage.setItem("attendanceRecords", JSON.stringify(updatedRecords));
    setAttendanceRecords(updatedRecords);

    toast({
      title: "Attendance Updated",
      description: `The attendance status has been updated to ${status}.`,
    });
  };

  const exportAttendanceReport = () => {
    let csvContent = "Session ID,Register Number,Department,Timestamp,Status\n";

    attendanceRecords.forEach((record) => {
      csvContent += `${record.sessionId},${record.regNo},${record.departmentId},${record.timestamp},${record.status}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report Exported",
      description: "Attendance report has been downloaded as CSV.",
    });
  };

  const exportSessionsList = () => {
    let csvContent =
      "Session ID,Subject Code,Created At,Expires At,Created By\n";

    sessions.forEach((session) => {
      csvContent += `${session.sessionId},${session.subjectCode},${session.createdAt},${session.expiresAt},${session.createdBy}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sessions_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sessions Exported",
      description: "Sessions list has been downloaded as CSV.",
    });
  };

  const exportStudentsList = () => {
    let csvContent = "Name,Register Number,Department ID\n";

    students.forEach((student) => {
      csvContent += `${student.name},${student.regNo},${student.departmentId}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Students Exported",
      description: "Students list has been downloaded as CSV.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!adminSession) {
    return (
      <div className="flex h-screen items-center justify-center">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500 opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-purple-500 opacity-5 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-cyan-400 opacity-5 blur-2xl"></div>
        <div className="absolute top-20 right-20 h-32 w-32 border-4 border-blue-900 opacity-5 rounded-lg"></div>
        <div className="absolute bottom-40 left-20 h-24 w-24 border-4 border-blue-900 opacity-5 rounded-lg"></div>
      </div>

      <AdminHeader email={adminSession.email} onLogout={handleLogout} />

      <main className="container mx-auto p-4 py-6 relative z-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>

            <Button
              onClick={handleCreateSession}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              <Plus className="h-4 w-4" />
              <span>Create Session</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  <span className="text-2xl font-bold">{sessions.length}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportSessionsList}
                  className="text-blue-600"
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">{students.length}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportStudentsList}
                  className="text-green-600"
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-purple-600" />
                  <span className="text-2xl font-bold">
                    {attendanceRecords.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportAttendanceReport}
                  className="text-purple-600"
                >
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="overview"
          className="mt-6"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4 md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-white border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button
                  variant="outline"
                  onClick={exportAttendanceReport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.slice(0, 5).map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border-b border-gray-100 pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {students.find((s) => s.regNo === record.regNo)
                              ?.name || record.regNo}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(record.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "flagged"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No attendance records yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Subject Filter */}
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {Array.from(
                      new Set(sessions.map((s) => s.subjectCode))
                    ).map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-[160px]"
                />
              </div>

              {/* Export Button */}
              <Button
                variant="outline"
                onClick={exportSessionsList}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Sessions List</span>
              </Button>
            </div>

            {/* Filtered Sessions List */}
            <SessionsList
              sessions={sessions.filter((session) => {
                const subjectMatch =
                  subjectFilter === "all" ||
                  session.subjectCode === subjectFilter;
                const dateMatch =
                  !dateFilter ||
                  new Date(session.createdAt).toDateString() ===
                    new Date(dateFilter).toDateString();
                return subjectMatch && dateMatch;
              })}
              onDelete={handleDeleteSession}
              attendanceRecords={attendanceRecords}
              students={students}
            />
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            {/* Filter + Export Header */}
            <div className="mb-4 space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setShowStudentFilters(!showStudentFilters)}
                  className="gap-2 text-gray-700 hover:text-black"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  {showStudentFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={exportStudentsList}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Students List</span>
                </Button>
              </div>

              {/* Filter UI */}
              {showStudentFilters && (
                <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-4 shadow-sm">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name or reg no"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-9 w-[200px]"
                    />
                  </div>
                  <Select
                    value={studentDeptFilter}
                    onValueChange={setStudentDeptFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {Array.from(
                        new Set(students.map((s) => s.departmentId))
                      ).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <StudentsList
              students={students.filter((student) => {
                const matchSearch =
                  student.name
                    .toLowerCase()
                    .includes(studentSearch.toLowerCase()) ||
                  student.regNo
                    .toLowerCase()
                    .includes(studentSearch.toLowerCase());

                const matchDept =
                  studentDeptFilter === "all" ||
                  student.departmentId === studentDeptFilter;

                return matchSearch && matchDept;
              })}
              onDelete={handleDeleteStudent}
              attendanceRecords={attendanceRecords}
            />
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-800">
                  Live Attendance:
                </span>
                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  {attendanceRecords.length} marked
                </span>
              </div>

              <Button
                variant="outline"
                onClick={exportAttendanceReport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Attendance Report</span>
              </Button>
            </div>

            <AttendanceList
              attendanceRecords={attendanceRecords}
              sessions={sessions}
              students={students}
              onDelete={handleDeleteAttendance}
              onUpdateStatus={handleUpdateAttendance}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
