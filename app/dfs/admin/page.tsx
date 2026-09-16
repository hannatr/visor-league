import DFSAdminForm from "@/components/DFSAdminForm";
import { fetchDFSResults } from "@/utils/requests";
import { isAdminAuthenticated } from "@/utils/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DFSAdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const results = await fetchDFSResults({ current: true });

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <DFSAdminForm results={results} />
      </div>
    </div>
  );
}
