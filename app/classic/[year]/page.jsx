import React from "react";
import { fetchTournaments, fetchPlayers } from "@/utils/requests";
import GolfLeaderboard from "@/components/GolfLeaderboard";
import Scorecard from "@/components/Scorecard";

export const dynamic = "force-dynamic";

export default async function TournamentYearPage({ params }) {
  const { year } = params;
  const players = await fetchPlayers();
  const tournaments = await fetchTournaments({ season: year });
  
  // Find the tournament for this specific year
  const tournament = tournaments.find(t => t.year === parseInt(year)) || null;

  if (!tournament) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tournament Not Found</h1>
            <p className="text-gray-600">
              No tournament found for the year {year}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">        
        <GolfLeaderboard tournament={tournament} players={players} />
        
        <h2 className="text-2xl font-bold text-center mt-8 mb-4">Scorecards</h2>
        <div className="overflow-x-auto">
          {tournament.scorecards.map((scorecard, index) => (
            <div key={index} className="min-w-full">
              <Scorecard
                scorecard={scorecard}
                players={players}
                holes={tournament.holes}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 