"use client";
import React, { useEffect, useState } from "react";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";
import EventResults from "@/components/EventResults";
import Loading from "@/components/Loading";

const HomePage = () => {
  const [results, setResults] = useState(null);
  const [players, setPlayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let content;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsData = await fetchResults({ current: true });
        setResults(resultsData);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Error fetching results");
      }
    };

    if (results === null) {
      fetchData();
    }
  }, [results]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const playersData = await fetchPlayers(true);
        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching players:", error);
        setError("Error fetching players");
      }
    };

    if (players === null) {
      fetchPlayerData();
    }
  }, [players]);

  useEffect(() => {
    if (results === null || players === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [results, players]);

  if (error) {
    content = <div className="text-red-500 text-center mt-4">{error}</div>;
  } else if (loading) {
    content = <Loading loading={loading} />;
  } else {
    content = (
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
          <Leaderboard
            players={players}
            results={[results]}
            title={`Pick'em Leaderboard ${results.season}`}
          />
          {results.events.map((event) => (
            <EventResults key={event.id} event={event} players={players} />
          ))}
        </div>
      </div>
    );
  }
  return content;
};

export default HomePage;
