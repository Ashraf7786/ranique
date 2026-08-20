"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PackageCheck,
  Download,
  RefreshCw,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShipOrder {
  id: string;
  status: string;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZip: string | null;
  totalAmount: number;
  paymentMethod: string;
  deliveryAwb: string | null;
  deliveryStatus: string;
  deliveryLabelUrl: string | null;
  itemCount: number;
}

interface StepState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

// ─── Step indicator ────────────────────────────────────────────────────────────

function Step({
  number,
  title,
  description,
  state,
}: {
  number: number;
  title: string;
  description: string;
  state: StepState;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300",
          state.status === "success"
            ? "bg-green-500 border-green-500 text-white"
            : state.status === "loading"
            ? "bg-brand-rose border-brand-rose text-white animate-pulse"
            : state.status === "error"
            ? "bg-red-500 border-red-500 text-white"
            : "bg-white border-gray-300 text-gray-400"
        )}
      >
        {state.status === "success" ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : state.status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : state.status === "error" ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          number
        )}
      </div>
      <div className="flex-1 pt-1">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        {state.message && (
          <p
            className={cn(
              "text-xs mt-1.5 font-medium px-2 py-1 rounded-md inline-block",
              state.status === "success"
                ? "bg-green-50 text-green-700"
                : state.status === "error"
                ? "bg-red-50 text-red-700"
                : "bg-blue-50 text-blue-700"
            )}
          >
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Order row card ────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onShip,
}: {
  order: ShipOrder;
  onShip: (order: ShipOrder) => void;
}) {
  const isManifested = !!order.deliveryAwb;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono font-bold text-sm text-brand-ink">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 text-2xs font-bold uppercase rounded-full",
                order.paymentMethod === "COD"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-brand-blush text-brand-rose"
              )}
            >
              {order.paymentMethod}
            </span>
            {isManifested && (
              <span className="px-2 py-0.5 text-2xs font-bold uppercase rounded-full bg-green-50 text-green-700 border border-green-200">
                ✓ Manifested
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {order.shippingName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.shippingCity}, {order.shippingState} — {order.shippingZip}
          </p>
          <p className="text-xs text-gray-500">
            {order.itemCount} item(s) &nbsp;·&nbsp; ₹
            {order.totalAmount.toLocaleString("en-IN")}
          </p>
          {order.deliveryAwb && (
            <p className="text-xs text-brand-rose font-mono mt-1">
              AWB: {order.deliveryAwb}
            </p>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={() => onShip(order)}
          className={cn(
            "flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-95",
            isManifested
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-brand-rose text-white hover:bg-brand-rose-dark shadow-sm"
          )}
        >
          <Truck className="w-4 h-4" />
          {isManifested ? "View / Label" : "Ship Order"}
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Shipping modal / workflow ─────────────────────────────────────────────────

function ShippingModal({
  order,
  onClose,
}: {
  order: ShipOrder;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [awb, setAwb] = useState<string>(order.deliveryAwb ?? "");
  const [labelUrl, setLabelUrl] = useState<string>(
    order.deliveryLabelUrl ?? ""
  );

  const [step1, setStep1] = useState<StepState>({
    status: order.deliveryAwb ? "success" : "idle",
    message: order.deliveryAwb
      ? `AWB assigned: ${order.deliveryAwb}`
      : "",
  });
  const [step2, setStep2] = useState<StepState>({
    status: order.deliveryLabelUrl ? "success" : "idle",
    message: order.deliveryLabelUrl ? "Label ready to download" : "",
  });

  // ── Step 1: Create manifest ────────────────────────────────────────────────
  const handleCreateManifest = async () => {
    setStep1({ status: "loading", message: "Registering shipment with Delhivery…" });
    try {
      const res = await fetch("/api/shipping/create-manifest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.remarks || data.error || `HTTP ${res.status}`);
      }
      setAwb(data.awb);
      setStep1({
        status: "success",
        message: `AWB assigned: ${data.awb}`,
      });
      startTransition(() => router.refresh());
    } catch (err: any) {
      setStep1({ status: "error", message: err.message });
    }
  };

  // ── Step 2: Fetch & download label ────────────────────────────────────────
  const handleFetchLabel = async () => {
    const targetAwb = awb || order.deliveryAwb;
    if (!targetAwb) return;

    setStep2({ status: "loading", message: "Fetching label PDF from Delhivery…" });
    try {
      const res = await fetch("/api/shipping/label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ awb: targetAwb }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ?? `HTTP ${res.status}`);
      }

      // Stream PDF into a blob and auto-download
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      setLabelUrl(blobUrl);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `delhivery_label_${targetAwb}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStep2({
        status: "success",
        message: `Label downloaded (${(blob.size / 1024).toFixed(0)} KB)`,
      });
      startTransition(() => router.refresh());
    } catch (err: any) {
      setStep2({ status: "error", message: err.message });
    }
  };

  const manifestDone = step1.status === "success";
  const labelDone = step2.status === "success";
  const canFetchLabel = manifestDone && (awb || order.deliveryAwb);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-ink to-brand-rose-dark px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-serif font-bold text-lg">
                Delhivery Shipping
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                Order #{order.id.slice(0, 8).toUpperCase()} &nbsp;·&nbsp;{" "}
                {order.shippingName}
              </p>
            </div>
          </div>
        </div>

        {/* Order summary strip */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-6 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-rose" />
            {order.shippingCity}, {order.shippingState} {order.shippingZip}
          </span>
          <span className="flex items-center gap-1.5">
            <PackageCheck className="w-3.5 h-3.5 text-brand-rose" />
            {order.itemCount} item(s) · ₹{order.totalAmount.toLocaleString("en-IN")}
          </span>
          <span
            className={cn(
              "ml-auto px-2 py-0.5 font-bold uppercase rounded-full text-2xs",
              order.paymentMethod === "COD"
                ? "bg-gray-200 text-gray-700"
                : "bg-brand-blush text-brand-rose"
            )}
          >
            {order.paymentMethod}
          </span>
        </div>

        {/* Steps */}
        <div className="px-6 py-6 space-y-6">
          {/* Info notice */}
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Complete both steps in order. First create the manifest to get the
              Air Waybill (AWB) from Delhivery, then fetch and print the
              shipping label.
            </p>
          </div>

          {/* Step 1 */}
          <div className="space-y-3">
            <Step
              number={1}
              title="Create Manifest"
              description="Register this shipment with Delhivery and get an AWB tracking number"
              state={step1}
            />
            {step1.status !== "success" && (
              <div className="ml-13 pl-1">
                <button
                  onClick={handleCreateManifest}
                  disabled={step1.status === "loading"}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-rose text-white text-sm font-semibold rounded-xl hover:bg-brand-rose-dark transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {step1.status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : step1.status === "error" ? (
                    <RefreshCw className="w-4 h-4" />
                  ) : (
                    <Truck className="w-4 h-4" />
                  )}
                  {step1.status === "error"
                    ? "Retry Manifest"
                    : "Create Manifest"}
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-l-2 border-dashed border-gray-200 ml-4 h-4" />

          {/* Step 2 */}
          <div className="space-y-3">
            <Step
              number={2}
              title="Download Shipping Label"
              description="Fetch the official Delhivery label PDF and print it for the package"
              state={step2}
            />
            <div className="ml-13 pl-1 flex flex-wrap gap-2">
              <button
                onClick={handleFetchLabel}
                disabled={!canFetchLabel || step2.status === "loading"}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-sm",
                  canFetchLabel && step2.status !== "loading"
                    ? "bg-brand-ink text-white hover:bg-brand-ink/90"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {step2.status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : step2.status === "success" ? (
                  <RefreshCw className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {step2.status === "success"
                  ? "Re-download Label"
                  : step2.status === "loading"
                  ? "Fetching…"
                  : "Download Label PDF"}
              </button>

              {labelUrl && step2.status === "success" && (
                <a
                  href={labelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Open in Browser
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {manifestDone && labelDone ? (
              <span className="flex items-center gap-1.5 text-green-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                All done — ready to hand over to Delhivery
              </span>
            ) : (
              <span className="text-gray-400">
                Complete both steps to finish shipping
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main panel ────────────────────────────────────────────────────────────────

export function DelhiveryPanel({ orders }: { orders: ShipOrder[] }) {
  const [selectedOrder, setSelectedOrder] = useState<ShipOrder | null>(null);

  const pendingOrders = orders.filter((o) => !o.deliveryAwb);
  const manifestedOrders = orders.filter((o) => !!o.deliveryAwb);

  return (
    <div>
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Ready to Ship
          </p>
          <p className="text-2xl font-serif font-bold text-brand-rose mt-1">
            {pendingOrders.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Manifested
          </p>
          <p className="text-2xl font-serif font-bold text-green-600 mt-1">
            {manifestedOrders.length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Total
          </p>
          <p className="text-2xl font-serif font-bold text-gray-900 mt-1">
            {orders.length}
          </p>
        </div>
      </div>

      {/* Pending section */}
      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-rose inline-block" />
            Accepted — Ready to Ship ({pendingOrders.length})
          </h2>
          <div className="space-y-3">
            {pendingOrders.map((o) => (
              <OrderCard key={o.id} order={o} onShip={setSelectedOrder} />
            ))}
          </div>
        </div>
      )}

      {/* Manifested section */}
      {manifestedOrders.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Manifested with Delhivery ({manifestedOrders.length})
          </h2>
          <div className="space-y-3">
            {manifestedOrders.map((o) => (
              <OrderCard key={o.id} order={o} onShip={setSelectedOrder} />
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No accepted orders to ship yet.</p>
          <p className="text-sm mt-1">
            Accept orders from the Orders page first, then they'll appear here.
          </p>
        </div>
      )}

      {/* Shipping modal */}
      {selectedOrder && (
        <ShippingModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
