import Link from "next/link";
import { signUpAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form action={signUpAction} className="glass w-full max-w-md space-y-4 rounded-2xl border border-border p-6">
        <h1 className="text-2xl font-semibold">Start Free Trial</h1>
        <Input type="email" name="email" required placeholder="Email" />
        <Input type="password" name="password" required minLength={8} placeholder="Password" />
        <Button className="w-full" type="submit">Create account</Button>
        <p className="text-sm text-zinc-400">Already have an account? <Link href="/login" className="underline">Sign in</Link></p>
      </form>
    </div>
  );
}


