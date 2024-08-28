import React from "react";
import Link from "next/link";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const results = await fetchResults();
  const players = await fetchPlayers(true);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {results.length === 0 ? (
          <p>No Results</p>
        ) : (
          <>
            <Leaderboard
              players={players}
              results={results}
              title="History Leaderboard"
            />
            <div className="flex justify-center py-6">
              <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-center p-4">
                  Past Seasons
                </h2>
                <div className="mb-6 flex flex-col items-center">
                  {results.map((event) => {
                    if (!event.current) {
                      return (
                        <Link
                          className="text-green-700 font-bold text-lg hover:text-green-800"
                          key={event.season}
                          href={`/history/${event.season}`}
                        >
                          {event.season}
                        </Link>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
