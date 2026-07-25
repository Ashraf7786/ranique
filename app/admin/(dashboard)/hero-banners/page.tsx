import { HeroBannersManager } from "@/components/admin/HeroBannersManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hero Banners | Ranique Admin",
};

export default function HeroBannersPage() {
  return (
    <div className="p-6 lg:p-8">
      <HeroBannersManager />
    </div>
  );
}
