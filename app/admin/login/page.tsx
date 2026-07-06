import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Admin Login | Ranique",
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user && (session.user as any).role === 'ADMIN') {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-ink">
            Ranique Admin
          </h2>
          <p className="mt-2 text-sm text-brand-slate">
            Sign in to access the control panel
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
