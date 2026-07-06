import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OfferDataTable } from "@/components/admin/OfferDataTable";

export default async function AdminOffersPage() {
  const offers = await prisma.productOffer.findMany({
    include: {
      product: {
        include: {
          images: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Product Offers</h1>
        <Link 
          href="/admin/offers/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-brand-ink text-white font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Offer
        </Link>
      </div>

      <OfferDataTable initialOffers={offers} />
    </div>
  );
}
