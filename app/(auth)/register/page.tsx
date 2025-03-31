import { RegistrationForm } from "@/components/auth/registration-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function RegisterPage() {
  return (
    <AuthLayout title="Create an Account">
      <RegistrationForm />
    </AuthLayout>
  )
}

