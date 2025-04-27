"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, QrCode } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import QRCode from "@/components/qr-code"

interface QrScannerProps {
  onScan: (data: string) => void
  sessionData?: any
}

export default function QrScanner({ onScan, sessionData }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasCamera, setHasCamera] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQrCode, setShowQrCode] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize scanner
    if (containerRef.current) {
      scannerRef.current = new Html5Qrcode("qr-reader")
    }

    // Check if camera is available
    Html5Qrcode.getCameras()
      .then((devices) => {
        setHasCamera(devices && devices.length > 0)
        if (devices.length > 0) {
          startScanner()
        }
      })
      .catch((err) => {
        console.error("Error getting cameras", err)
        setHasCamera(false)
        setError("Camera access denied or no cameras found")
      })

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err) => console.error("Error stopping scanner:", err))
      }
    }
  }, [])

  const startScanner = () => {
    if (!scannerRef.current) return

    setIsScanning(true)
    setError(null)
    setShowQrCode(false)

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    }

    scannerRef.current
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText)
          // Don't stop scanner here to allow continuous scanning
        },
        (errorMessage) => {
          // QR code scanning error (ignored to prevent console spam)
        },
      )
      .catch((err) => {
        console.error("Error starting scanner:", err)
        setIsScanning(false)
        setError("Failed to start camera. Please check permissions.")
      })
  }

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false)
        })
        .catch((err) => {
          console.error("Error stopping scanner:", err)
        })
    }
  }

  const toggleScanner = () => {
    if (isScanning) {
      stopScanner()
    } else {
      startScanner()
    }
  }

  const toggleQrCode = () => {
    if (isScanning) {
      stopScanner()
    }
    setShowQrCode(!showQrCode)
  }

  return (
    <div className="flex flex-col items-center">
      {showQrCode && sessionData ? (
        <div className="flex flex-col items-center p-4">
          <div className="mb-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-4">
            <QRCode value={JSON.stringify(sessionData)} size={200} level="H" includeMargin={true} />
          </div>
          <div className="text-center text-sm text-gray-500 mb-4">
            <p>Session ID: {sessionData.sessionId}</p>
            <p>Subject: {sessionData.subjectCode}</p>
          </div>
          <Button variant="outline" onClick={toggleQrCode}>
            <Camera className="mr-2 h-4 w-4" />
            Switch to Scanner
          </Button>
        </div>
      ) : (
        <>
          <div
            id="qr-reader"
            ref={containerRef}
            style={{ width: "100%", maxWidth: "500px" }}
            className="overflow-hidden rounded-lg"
          ></div>

          {error && <div className="mt-2 text-center text-sm text-red-500">{error}</div>}

          {!hasCamera && (
            <div className="mt-4 text-center">
              <CameraOff className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No camera detected or access denied</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {hasCamera && (
              <Button type="button" variant="outline" onClick={toggleScanner}>
                {isScanning ? (
                  <>
                    <CameraOff className="mr-2 h-4 w-4" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </>
                )}
              </Button>
            )}

            {sessionData && (
              <Button type="button" variant="outline" onClick={toggleQrCode}>
                <QrCode className="mr-2 h-4 w-4" />
                View QR Code
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
