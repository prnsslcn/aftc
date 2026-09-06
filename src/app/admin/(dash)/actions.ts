"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth/session";

export async function logoutAdmin() {
  await destroySession();
  redirect("/admin/login");
}
