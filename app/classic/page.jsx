import React from "react";
import { fetchTournaments, fetchPlayers } from "@/utils/requests";
import GolfLeaderboard from "@/components/GolfLeaderboard";
import Scorecard from "@/components/Scorecard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function GolfPage() {
  const players = await fetchPlayers();
  const allTournaments = await fetchTournaments();

  // Separate current tournament from the rest
  const currentTournament = allTournaments.find(t => t.current) || null;
  const pastTournaments = allTournaments.filter(t => !t.current);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        {currentTournament ? (
          <>
            <GolfLeaderboard tournament={currentTournament} players={players} />
            <h2 className="text-2xl font-bold text-center mt-8 mb-4">Scorecards</h2>
            <div className="overflow-x-auto">
              {currentTournament.scorecards.map((scorecard, index) => (
                <div key={index} className="min-w-full">
                  <Scorecard
                    scorecard={scorecard}
                    players={players}
                    holes={currentTournament.holes}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mb-4 flex justify-center">
            <div className="w-full max-w-4xl bg-white border border-green-700 rounded-lg shadow-md pt-4 pb-8 px-4">
              <h2 className="text-xl font-bold">Counting down to the next Visor Classic </h2>
              <p>
                Actively waiting for the next Visor Classic to be set. Contact Christopher Ball if you have any questions.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-bold">Past Champions</h2>
              <p className="text-sm justify-left text-gray-600 italic mb-2">
                The Visor Classic is a long-running, historic tournament among
                mediocre golfers. In its founding year in 2020, tournament
                organizer Christopher Ball had the bright vision of a golf
                tournament among friends and decided a visor was the best way to
                shade it.
              </p>
              <p className="mb-2">
                Visor Classic, September 12, 2020, Twin Ponds: Team Miers (-5)
              </p>
              <p className="mb-2">
                Visor Classic II, September 18, 2021, Twin Ponds: Team Castle
                (-6)
              </p>
              <p className="mb-2">
                Visor Classic III, August 27, 2022, Twin Ponds: Team Ball, Team
                Arline, Team Miers (-7)
              </p>
              <p className="mb-2">
                Visor Classic IV, August 26, 2023, Valley View: Team Miers (-8)
              </p>
              {pastTournaments.map((tournament, index) => (
                <p key={tournament._id || index} className="mb-2">
                  <Link
                    href={`/classic/${tournament.year}`}
                    className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                  >
                    {tournament.title}
                  </Link>, {tournament.date}, {tournament.course}{tournament.winner && ` - ${tournament.winner}`}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-bold">Rules</h2>
              <p className="text-sm text-gray-600 italic">
                Last Updated: July 1, 2024
              </p>
              <p className="mt-2 text-md">
                Team Scramble. No requirement to use a ball from each team
                member.
              </p>
              <p className="mt-2 text-md">
                Tiebreaker Rules (only applies to 1st place):
              </p>
              <ul className="mt-1 list-disc pl-5">
                <li className="mb-1">
                  Back track from highest handicap hole until one of the tied
                  teams has a lower score for that hole. For example, if Team 1
                  and Team 2 tie but Team 1 birdied the hole with handicap 1
                  while Team 2 parred, then Team 1 wins the tournament.
                </li>
                <li className="mb-1">
                  If more than two teams tie, perform the same action but
                  eliminate teams from contention as soon as they fall off the
                  pace. For example, Teams 1, 2, and 3 tie, Teams 1 and 2 parred
                  hole with handicap 1 but Team 3 bogeyed, then Team 3 is out of
                  the running for the tournament win.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
