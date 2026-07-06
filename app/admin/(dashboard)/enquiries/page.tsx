import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Customer Enquiries | Admin",
};

export default async function EnquiriesAdminPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Customer Enquiries</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm">
                <th className="py-4 px-6 font-medium text-gray-500">Name</th>
                <th className="py-4 px-6 font-medium text-gray-500">Contact</th>
                <th className="py-4 px-6 font-medium text-gray-500">Message</th>
                <th className="py-4 px-6 font-medium text-gray-500">Date</th>
                <th className="py-4 px-6 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.length > 0 ? (
                enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {e.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div>{e.email}</div>
                      <div className="text-xs text-gray-400">{e.phone || 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-sm">
                      <p className="line-clamp-2">{e.message}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(e.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${e.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No enquiries found.
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
