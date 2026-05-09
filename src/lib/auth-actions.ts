"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/resend";

const authSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
});

export async function signUpAction(formData: FormData) {
  const parsed = authSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const supabase = createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    },
  });

  if (error) throw new Error(error.message);
  if (data.user?.email) {
    await sendWelcomeEmail(data.user.email, data.user.user_metadata?.name ?? null);
  }
  redirect("/dashboard");
}

export async function signInAction(formData: FormData) {
  const parsed = authSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const supabase = createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword(parsed);
  if (error) throw new Error(error.message);
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = z.string().email().parse(formData.get("email"));
  const supabase = createServerSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  });
  if (error) throw new Error(error.message);
}


