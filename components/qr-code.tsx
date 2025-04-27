"use client"

import type React from "react"
import { useEffect, useState } from "react"

export default function QRCode({
  value,
  size = 200,
  level = "H",
  includeMargin = true,
}: {
  value: string
  size?: number
  level?: "L" | "M" | "Q" | "H"
  includeMargin?: boolean
}) {
  const [qrCodeElement, setQrCodeElement] = useState<React.ReactNode>(
    <div className="flex h-[200px] w-[200px] items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600"></div>
    </div>,
  )

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        // Import the QRCodeSVG component specifically
        const { QRCodeSVG } = await import("qrcode.react")

        if (QRCodeSVG) {
          setQrCodeElement(<QRCodeSVG value={value} size={size} level={level as any} includeMargin={includeMargin} />)
        } else {
          throw new Error("QRCodeSVG component not found")
        }
      } catch (error) {
        console.error("Error loading QR code:", error)
        setQrCodeElement(
          <div className="flex h-[200px] w-[200px] items-center justify-center bg-white text-red-500">
            Failed to load QR code
          </div>,
        )
      }
    }

    loadQRCode()
  }, [value, size, level, includeMargin])

  return <div className="flex items-center justify-center rounded-lg bg-white p-4">{qrCodeElement}</div>
}
