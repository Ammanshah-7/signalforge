import Link from "next/link";
import { signInAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form action={signInAction} className="glass w-full max-w-md space-y-4 rounded-2xl border border-border p-6">
        <h1 className="text-2xl font-semibold">Login</h1>
        <Input type="email" name="email" required placeholder="Email" />
        <Input type="password" name="password" required minLength={8} placeholder="Password" />
        <Button className="w-full" type="submit">Sign in</Button>
        <p className="text-sm text-zinc-400">
          No account? <Link href="/signup" className="underline">Create one</Link> · <Link href="/forgot-password" className="underline">Forgot password</Link>
        </p>
      </form>
    </div>
  );
}


