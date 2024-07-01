"use client";
import React, { useEffect, useState } from "react";
import { fetchTournaments, fetchPlayers } from "@/utils/requests";
import GolfLeaderboard from "@/components/GolfLeaderboard";
import Scorecard from "@/components/Scorecard";
import Loading from "@/components/Loading";

const GolfPage = () => {
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTournamentData = async () => {
    try {
      const tournamentData = await fetchTournaments({ current: true });
      setTournament(tournamentData);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      setError("Error fetching tournament");
    }
  };

  useEffect(() => {
    if (tournament === null) {
      fetchTournamentData();
    }
  }, [tournament]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const playersData = await fetchPlayers();
        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching players:", error);
        setError("Error fetching players");
      }
    };

    if (players.length === 0) {
      fetchPlayerData();
    }
  }, [players]);

  useEffect(() => {
    if (tournament === null || players.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [tournament, players]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  } else if (loading) {
    return <Loading loading={loading} />;
  } else {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
          <GolfLeaderboard tournament={tournament} players={players} />
          <h2 className="text-2xl font-bold text-center mt-8 mb-4">
            Scorecards
          </h2>
          <div className="overflow-x-auto">
            {tournament.scorecards.map((scorecard, index) => (
              <div key={index} className="min-w-full">
                <Scorecard
                  scorecard={scorecard}
                  players={players}
                  holes={tournament.holes}
                  onUpdate={fetchTournamentData} // Refresh data after updating score
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mt-8 mb-2">
                Past Champions
              </h2>
              <p className="text-center text-gray-600 mb-2">
                Visor Classic, September 12, 2020, Twin Ponds: Team Miers (-5)
              </p>
              <p className="text-center text-gray-600 mb-2">
                Visor Classic II, September 18, 2021, Twin Ponds: Team Castle
                (-6)
              </p>
              <p className="text-center text-gray-600 mb-2">
                Visor Classic III, August 27, 2022, Twin Ponds: Team Ball, Team
                Arline, Team Miers (-7)
              </p>
              <p className="text-center text-gray-600 mb-8">
                Visor Classic IV, August 26, 2023, Valley View: Team Miers (-8)
              </p>
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
                    teams has a lower score for that hole. For example, if Team
                    1 and Team 2 tie but Team 1 birdied the hole with handicap 1
                    while Team 2 parred, then Team 1 wins the tournament.
                  </li>
                  <li className="mb-1">
                    If more than two teams tie, perform the same action but
                    eliminate teams from contention as soon as they fall off the
                    pace. For example, Teams 1, 2, and 3 tie, Teams 1 and 2
                    parred hole with handicap 1 but Team 3 bogeyed, then Team 3
                    is out of the running for the tournament win.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default GolfPage;
