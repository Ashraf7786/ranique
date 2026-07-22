import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  const userName = session.user.name || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <AdminLayoutClient userName={userName} userInitial={userInitial}>
      {children}
    </AdminLayoutClient>
  );
}
