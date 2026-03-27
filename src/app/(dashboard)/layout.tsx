import { Suspense } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0" />}>
        <Sidebar />
      </Suspense>
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
