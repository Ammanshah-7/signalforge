import { forgotPasswordAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form action={forgotPasswordAction} className="glass w-full max-w-md space-y-4 rounded-2xl border border-border p-6">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <Input type="email" name="email" required placeholder="Email" />
        <Button className="w-full" type="submit">Send link</Button>
      </form>
    </div>
  );
}


