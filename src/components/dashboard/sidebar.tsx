import Link from "next/link";

const items = [
  ["Overview", "/dashboard"],
  ["GEO Analyzer", "/dashboard/geo"],
  ["Buyer Intent", "/dashboard/intent"],
  ["Outreach", "/dashboard/outreach"],
  ["Competitors", "/dashboard/competitors"],
  ["Reports", "/dashboard/reports"],
  ["Billing", "/dashboard/billing"],
  ["Settings", "/dashboard/settings"],
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-border bg-card/40 p-4 lg:block">
      <h2 className="mb-4 text-lg font-semibold">SignalForge</h2>
      <nav className="space-y-1">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="block rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}


