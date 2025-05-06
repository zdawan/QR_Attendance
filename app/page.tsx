import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, UserCog } from "lucide-react";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Black Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Large black circle top-left */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-black opacity-5 blur-2xl" />

        {/* Tech dot grid bottom-right */}
        <div className="absolute bottom-16 right-12 grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-2 w-2 bg-black opacity-10 rounded-full" />
          ))}
        </div>

        {/* Angled bar */}
        <div className="absolute top-1/2 -left-40 w-[400px] h-[4px] bg-black opacity-10 rotate-45" />

        {/* Framed box */}
        <div className="absolute top-20 right-20 h-32 w-32 border-2 border-black opacity-10 rounded-lg rotate-12" />

        {/* Subtle rectangle */}
        <div className="absolute bottom-28 left-1/3 h-40 w-64 bg-black opacity-5 rotate-3 rounded-lg blur-sm" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 pt-12">
          <div className="text-center">
            <Logo size="large" className="mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
              Smart Attendance System
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Quick, secure, and hassle-free attendance tracking
            </p>
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
                    <p className="mt-2 text-center text-gray-600">
                      Mark your attendance by scanning the QR code
                    </p>
                    <Button className="mt-6 w-full bg-green-600 hover:bg-green-700">
                      Mark Attendance
                    </Button>
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
                    <p className="mt-2 text-center text-gray-600">
                      Create sessions and manage attendance records
                    </p>
                    <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
                      Login
                    </Button>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
