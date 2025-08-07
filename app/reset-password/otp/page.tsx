"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { API_URL } from "@/config"

export default function OTPVerificationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1)
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text/plain").slice(0, 6).split("")
    const newOtp = [...otp]
    pasted.forEach((d, i) => { if (i < 6) newOtp[i] = d })
    setOtp(newOtp)
  }

  const verifyOtp = async () => {
    setError("")
    setIsLoading(true)
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter all 6 digits of the OTP")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(API_URL`/api/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "OTP verification failed")

      toast({ title: "OTP Verified", description: "Redirecting to reset password..." })
      router.push(`/reset-password/new?email=${encodeURIComponent(email)}&otp=${otpValue}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to verify OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async () => {
    setError("")
    setIsLoading(true)

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(API_URL`/api/newpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join(""), new_password: newPassword }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Reset failed")

      toast({ title: "Success", description: "Password has been reset." })
      router.push("/login")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Reset failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {isVerified ? "Set New Password" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {isVerified ? "Enter your new password" : `Enter the 6-digit code sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}
          {!isVerified ? (
            <div className="space-y-4">
              <div className="flex gap-2 justify-center">
                {otp.map((d, i) => (
                  <Input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    className="h-12 w-12 text-center text-lg"
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                  />
                ))}
              </div>
              <Button className="w-full bg-indigo-600" onClick={verifyOtp} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button className="w-full" onClick={resetPassword} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : "Reset Password"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-gray-500 text-center">
          <p>
            Didn’t receive code? <Button variant="link" onClick={verifyOtp}>Resend</Button>
          </p>
          <p className="mt-2">
            <Link href="/login" className="text-primary hover:underline">Back to login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
