"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import Logo from "@/components/logo"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface AdminHeaderProps {
  email: string
  onLogout: () => void
}

export default function AdminHeader({ email, onLogout }: AdminHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard">
            <Logo size="medium" />
          </Link>
          <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 md:inline-block">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-sm text-gray-600 md:block">
            Logged in as <span className="font-medium">{email}</span>
          </div>

          <Button variant="ghost" size="sm" onClick={onLogout} className="hidden md:flex">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 pt-10">
                <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-4">
                  <Logo size="medium" />
                  <span className="text-sm text-gray-600">Admin Panel</span>
                </div>
                <div className="text-center text-sm text-gray-600">
                  Logged in as <span className="font-medium">{email}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={onLogout} className="mt-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
