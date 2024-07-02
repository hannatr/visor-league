"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Loading from "@/components/Loading";
import Leaderboard from "@/components/Leaderboard";

const HistoryPage = () => {
  const [results, setResults] = useState(null);
  const [players, setPlayers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let content;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsData = await fetchResults();
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
            results={Array.isArray(results) ? results : [results]}
            title="History Leaderboard"
          />
          <div className="flex justify-center py-6">
            <div className="w-full max-w-4xl overflow-hidden bg-white border border-green-700 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-center p-4">
                Past Seasons
              </h2>
              <div className="mb-6 flex flex-col items-center">
                {Array.isArray(results) &&
                  results.map((event) => {
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
        </div>
      </div>
    );
  }

  return content;
};

export default HistoryPage;
