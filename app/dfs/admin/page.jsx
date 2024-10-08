import React from "react";
import DFSAdminForm from "@/components/DFSAdminForm";
import { fetchDFSResults } from "@/utils/requests";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DFSAdminPage() {
  const isAuthenticated = cookies().get("admin-auth")?.value === "true";

  if (!isAuthenticated) {
    redirect("/login");
  }

  // Fetch the results after successful authentication
  const results = await fetchDFSResults();

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <DFSAdminForm results={results} />
      </div>
    </div>
  );
}
