import React from "react";
import FDLeaderboard from "@/components/FDLeaderboard";
import { fetchDFSResults, fetchPlayers } from "@/utils/requests";

export const dynamic = "force-dynamic";

export default async function DFSPage() {
  const results = await fetchDFSResults();
  const players = await fetchPlayers(true);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <p>No Results</p>
        ) : (
          <FDLeaderboard
            players={players}
            results={results}
            title="DFS League Leaderboard"
          />
        )}
      </div>
    </div>
  );
}
