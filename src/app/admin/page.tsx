import { redirect } from "next/navigation";
import { ADMIN_HOME } from "@/lib/admin-sections";

/* /admin → 대시보드. 인증 가드는 (dash) 레이아웃이 담당 */
export default function AdminIndexPage() {
  redirect(ADMIN_HOME);
}
