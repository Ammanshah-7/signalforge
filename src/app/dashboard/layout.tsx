import { Sidebar } from "@/components/dashboard/sidebar";
import { signOutAction } from "@/lib/auth-actions";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser();

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-end gap-3 text-sm text-zinc-400">
          <span>{user.email}</span>
          <form action={signOutAction}>
            <Button variant="outline" type="submit">Logout</Button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}


