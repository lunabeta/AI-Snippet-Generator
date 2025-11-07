import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We sent a confirmation link to your email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please click the confirmation link in your email to activate your account. You can then sign in to access
              your snippet generator.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">Return to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
