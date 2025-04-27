import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, UserCog } from "lucide-react"
import Logo from "@/components/logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Background Illustrations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-400 opacity-10 blur-3xl"></div>

        {/* QR Code Pattern */}
        <div className="absolute top-20 left-10 h-32 w-32 border-4 border-white opacity-5 rounded-lg"></div>
        <div className="absolute bottom-20 right-10 h-24 w-24 border-4 border-white opacity-5 rounded-lg"></div>
        <div className="absolute top-1/2 left-1/4 h-16 w-16 border-4 border-white opacity-5 rounded-lg"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 pt-12">
          <div className="text-center">
            <Logo size="large" className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white md:text-6xl">Smart Attendance System</h1>
            <p className="mt-4 text-xl text-white opacity-90">Quick, secure, and hassle-free attendance tracking</p>
          </div>

          <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
            <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
              <CardContent className="p-0">
                <Link href="/student">
                  <div className="flex flex-col items-center p-8">
                    <div className="rounded-full bg-green-100 p-4">
                      <GraduationCap className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">Student</h2>
                    <p className="mt-2 text-center text-gray-600">Mark your attendance by scanning the QR code</p>
                    <Button className="mt-6 w-full bg-green-600 hover:bg-green-700">Mark Attendance</Button>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
              <CardContent className="p-0">
                <Link href="/admin/login">
                  <div className="flex flex-col items-center p-8">
                    <div className="rounded-full bg-blue-100 p-4">
                      <UserCog className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">Faculty/Admin</h2>
                    <p className="mt-2 text-center text-gray-600">Create sessions and manage attendance records</p>
                    <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700">Login</Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
