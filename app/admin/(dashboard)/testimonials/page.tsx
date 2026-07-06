import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Testimonials | Admin",
};

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Customer Testimonials</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-sm">
                <th className="py-4 px-6 font-medium text-gray-500">Name</th>
                <th className="py-4 px-6 font-medium text-gray-500">Rating</th>
                <th className="py-4 px-6 font-medium text-gray-500">Content</th>
                <th className="py-4 px-6 font-medium text-gray-500">Date</th>
                <th className="py-4 px-6 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.length > 0 ? (
                testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {t.name}
                    </td>
                    <td className="py-4 px-6 text-sm text-yellow-500 font-medium">
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">
                      {t.content}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No testimonials yet.
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
