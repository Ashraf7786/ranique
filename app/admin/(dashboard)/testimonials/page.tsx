import { TestimonialsDataTable } from "@/components/admin/TestimonialsDataTable";

export const metadata = {
  title: "Testimonials | Admin",
};

export default function TestimonialsAdminPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <TestimonialsDataTable />
    </div>
  );
}
