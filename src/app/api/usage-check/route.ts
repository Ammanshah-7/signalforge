import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getMonthlyScanCount, getUserSubscription } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/usage";

export async function GET() {
  try {
    const { user } = await requireUser();
    const subscription = await getUserSubscription(user.id);
    const plan = subscription?.plan ?? "starter";
    const used = await getMonthlyScanCount(user.id);
    const limit = PLAN_LIMITS[plan];
    const exceeded = used >= limit;

    return NextResponse.json({ plan, used, limit, exceeded });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

