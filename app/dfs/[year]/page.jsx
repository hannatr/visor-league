import React from "react";
import { fetchDFSResults } from "@/utils/requests";
import FDLeaderboard from "@/components/FDLeaderboard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DFSYearPage({ params }) {
  const { year } = params;
  const results = await fetchDFSResults({ query: { season: parseInt(year) } });
  
  // Find the DFS result for this specific year
  const league = results.find(r => r.season === parseInt(year)) || null;

  if (!league) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">DFS League Not Found</h1>
            <Link 
              href="/dfs"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Back to DFS League
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">        
        <FDLeaderboard results={[league]} title={`${league.season} DFS League Leaderboard`} />
      </div>
    </div>
  );
}
