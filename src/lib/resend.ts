import "server-only";
import { Resend } from "resend";
import { getEnv } from "@/lib/env";

function getClient() {
  const env = getEnv();
  return {
    resend: new Resend(env.RESEND_API_KEY),
    from: env.RESEND_FROM_EMAIL,
  };
}

export async function sendWelcomeEmail(email: string, name: string | null) {
  const { resend, from } = getClient();
  const displayName = name || "there";

  await resend.emails.send({
    from,
    to: email,
    subject: "Welcome to SignalForge",
    text: `Hi ${displayName},

Welcome to SignalForge. Your workspace is live and ready for GEO analysis, buyer intent detection, and AI outreach.

You can start by running a GEO scan on your main domain to benchmark AI discoverability.

â€” SignalForge`,
  });
}

export async function sendScanCompleteEmail(email: string, scanUrl: string, geoScore: number) {
  const { resend, from } = getClient();

  await resend.emails.send({
    from,
    to: email,
    subject: "Your SignalForge GEO scan is complete",
    text: `Your latest GEO scan has finished.

GEO Score: ${geoScore}
Report: ${scanUrl}

Review the recommendations in the report to improve AI visibility and buyer intent capture.

â€” SignalForge`,
  });
}


