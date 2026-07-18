import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { prisma } from "@/lib/prisma";
import { Megaphone } from "lucide-react";

export default async function AnnouncementPage() {
  const announcement = await prisma.announcement.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-rose/10 rounded-xl text-brand-rose">
          <Megaphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-ink">Announcement Bar</h1>
          <p className="text-gray-500 mt-1">Manage the top scrolling offer banner displayed on the storefront.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-border p-6">
        <AnnouncementForm initialData={announcement ? JSON.parse(JSON.stringify(announcement)) : null} />
      </div>
    </div>
  );
}
