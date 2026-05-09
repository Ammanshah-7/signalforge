import { Card } from "@/components/ui/card";

const metrics = [
  { label: "GEO Score", value: "74%" },
  { label: "Intent Signals", value: "68%" },
  { label: "Competitor Visibility", value: "62%" },
  { label: "Outreach Replies", value: "29%" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <p className="text-sm text-zinc-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}


