"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [icp, setIcp] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signOutConfirm, setSignOutConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setProductName(data.product_name ?? "");
        setProductDescription(data.product_description ?? "");
        setIcp(data.icp ?? "");
        setWebsiteUrl(data.website_url ?? "");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("settings").upsert({
      user_id: user.id,
      display_name: displayName,
      product_name: productName,
      product_description: productDescription,
      icp,
      website_url: websiteUrl,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <div className="text-sm text-zinc-400 p-4">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Profile */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-semibold text-zinc-200">
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-zinc-400">Signed in as</p>
            <p className="text-sm font-medium">{email}</p>
          </div>
        </div>
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Display Name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />
        </div>
      </Card>

      {/* Product Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium">Product Settings</h2>
        <p className="text-sm text-zinc-400">
          These are used to personalize your GEO analysis and outreach generation.
        </p>
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Product Name</label>
          <Input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. SignalForge"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Product Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="One-line description of your product"
            className="min-h-20 w-full rounded-xl border border-input bg-card p-3 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Ideal Customer Profile</label>
          <textarea
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            placeholder="e.g. B2B SaaS founders with 10-100 employees"
            className="min-h-20 w-full rounded-xl border border-input bg-card p-3 text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Your Website URL</label>
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yoursite.com"
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Settings"}
        </Button>
      </Card>

      {/* Notifications */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium">Notifications</h2>
        <div className="space-y-3">
          {[
            "Email me when scan completes",
            "Email me when new intent signals found",
            "Weekly summary email",
          ].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">{label}</span>
              <div className="h-5 w-9 rounded-full bg-zinc-700 cursor-pointer" />
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500">Notification preferences coming soon.</p>
      </Card>

      {/* Billing */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-medium">Billing</h2>
        <p className="text-sm text-zinc-400">
          Manage your subscription and payment details.
        </p>
        <Button onClick={() => router.push("/dashboard/billing")}>
          Manage Billing
        </Button>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 space-y-4 border-red-900/50">
        <h2 className="text-lg font-medium text-red-400">Sign Out</h2>
        <p className="text-sm text-zinc-400">
          Sign out of your SignalForge account.
        </p>
        {signOutConfirm ? (
          <div className="space-y-2">
            <p className="text-sm text-red-400">Are you sure you want to sign out?</p>
            <div className="flex gap-2">
              <Button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, sign out
              </Button>
              <Button
                variant="outline"
                onClick={() => setSignOutConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setSignOutConfirm(true)}
            className="border-red-900 text-red-400 hover:bg-red-900/20"
          >
            Sign Out
          </Button>
        )}
      </Card>
    </div>
  );
}