import { Metadata } from "next";
import { TransactionDataTable } from "@/components/admin/TransactionDataTable";

export const metadata: Metadata = {
  title: "Transactions | Admin Dashboard",
};

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
        <p className="text-gray-500 mt-1">
          Monitor all incoming revenue, track payment statuses, and review Razorpay transactions.
        </p>
      </div>

      <TransactionDataTable />
    </div>
  );
}
