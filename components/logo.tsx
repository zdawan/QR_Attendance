import Image from "next/image"

interface LogoProps {
  size?: "small" | "medium" | "large"
  withText?: boolean
  className?: string
}

export default function Logo({ size = "medium", withText = true, className = "" }: LogoProps) {
  const sizes = {
    small: 32,
    medium: 48,
    large: 64,
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <Image
          src="/images/logo.png"
          alt="Smart Attendance Logo"
          width={sizes[size]}
          height={sizes[size]}
          className="object-contain"
          priority
        />
      </div>
      {withText && (
        <div className="ml-2 flex flex-col">
          <span className="text-lg font-bold leading-tight text-primary">SMART</span>
          <span className="text-sm font-semibold leading-tight text-primary">ATTENDANCE</span>
        </div>
      )}
    </div>
  )
}
