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
      console.log(tournament.scorecards);
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
        </div>
      </div>
    );
  }
};

export default GolfPage;
