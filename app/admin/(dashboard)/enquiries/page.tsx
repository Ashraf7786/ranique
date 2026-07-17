import { prisma } from "@/lib/prisma";
import { Bug, MessageSquare, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Enquiries & Bug Reports | Admin",
};

export default async function EnquiriesAdminPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Enquiries & Bug Reports</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm">
                <th className="py-4 px-6 font-medium text-gray-500">Type</th>
                <th className="py-4 px-6 font-medium text-gray-500">Name</th>
                <th className="py-4 px-6 font-medium text-gray-500">Contact</th>
                <th className="py-4 px-6 font-medium text-gray-500">Message</th>
                <th className="py-4 px-6 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.length > 0 ? (
                enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      {e.type === "BUG_REPORT" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider border border-red-100">
                          <Bug className="w-3.5 h-3.5" /> Bug
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                          <MessageSquare className="w-3.5 h-3.5" /> Query
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium whitespace-nowrap">
                      {e.name}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">
                        {new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div>{e.email}</div>
                      <div className="text-xs text-gray-400">{e.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-sm">
                      <p className="line-clamp-2">{e.message}</p>
                      {e.imageUrl && (
                        <a 
                          href={e.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-rose hover:text-brand-rose-dark mt-2 font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> View Screenshot
                        </a>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        e.status === 'RESOLVED' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
