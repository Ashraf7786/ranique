import Link from "next/link";
import { LayoutDashboard, Package, Tags, Box, Settings, Users, ArrowLeft, ShoppingCart, MessageSquare, Inbox } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
    redirect("/admin/login");
  }

  const userInitial = session.user.name ? session.user.name.charAt(0).toUpperCase() : "A";
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="font-serif text-xl font-bold text-brand-ink">Ranique Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-400" />
            Dashboard
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <ShoppingCart className="w-5 h-5 text-gray-400" />
            Orders
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Package className="w-5 h-5 text-gray-400" />
            Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Tags className="w-5 h-5 text-gray-400" />
            Categories
          </Link>
          <Link href="/admin/brands" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Box className="w-5 h-5 text-gray-400" />
            Brands
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Users className="w-5 h-5 text-gray-400" />
            Customers
          </Link>
          <Link href="/admin/testimonials" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            Testimonials
          </Link>
          <Link href="/admin/enquiries" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Inbox className="w-5 h-5 text-gray-400" />
            Enquiries
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="font-sans text-sm text-gray-500">Welcome, {session.user.name || "Admin"}</div>
          <div className="w-8 h-8 rounded-full bg-brand-rose text-white flex items-center justify-center font-bold text-sm">
            {userInitial}
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
