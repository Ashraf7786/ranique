import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if ((session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  const userId = (session.user as any).id;

  const [user, monthlyOrderCount, totalOrderCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        isEmailVerified: true,
        createdAt: true,
      },
    }),
    // Orders in the last 30 days
    prisma.order.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        status: { not: "CANCELLED" },
      },
    }),
    // Total lifetime orders (non-cancelled)
    prisma.order.count({
      where: {
        userId,
        status: { not: "CANCELLED" },
      },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  // Determine membership tier
  let membershipTier: "standard" | "elite" | "gold" = "standard";
  if (monthlyOrderCount >= 30) {
    membershipTier = "gold";
  } else if (monthlyOrderCount >= 10) {
    membershipTier = "elite";
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <AccountSidebar
            user={user}
            membershipTier={membershipTier}
            totalOrders={totalOrderCount}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
