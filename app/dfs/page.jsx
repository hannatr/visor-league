import React from "react";
import FDLeaderboard from "@/components/FDLeaderboard";
import { fetchDFSResults } from "@/utils/requests";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DFSPage() {
  const results = await fetchDFSResults({ query: { current: true } });
  const allResults = await fetchDFSResults();

  // Separate current league from past leagues
  const pastLeagues = allResults.filter(r => !r.current);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <p>No Current DFS League Results</p>
        ) : (
          <FDLeaderboard results={results} title="DFS League Leaderboard" />
        )}
      </div>

      <div className="flex justify-center">
          <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-bold">Past League Results</h2>
              <p className="text-sm text-left text-gray-600 italic mb-2">
                The Visor DFS League is a long-running, competitive league among friends. The following is a list
                of past leagues for the history books.
              </p>
              {pastLeagues.map((league, index) => (
                <p key={league._id || index} className="mb-2">
                  <Link
                    href={`/dfs/${league.season}`}
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                  >
                    {league.season}
                  </Link>
                </p>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
