import { Sidebar } from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="relative min-h-screen bg-[#080C10] lg:flex">
      {/* Ambient background layers */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        {/* Top-left radial */}
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
        {/* Bottom-right radial */}
        <div className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}