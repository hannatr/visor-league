"use client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";

const HistoryPage = () => {
  const [results, setResults] = useState(null);
  const [players, setPlayers] = useState(null);
  // TODO actually use the loading state
  const [loading, setLoading] = useState(true);
  let content;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsData = await fetchResults();
        setResults(resultsData);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (results === null) {
      fetchData();
    }
  }, [results]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const playersData = await fetchPlayers();
        setPlayers(playersData);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    if (players === null) {
      fetchPlayerData();
    }
  }, [players]);

  if (results === null || players === null) {
    content = <div>No results available.</div>;
  } else {
    content = (
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
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
        </div>
      </div>
    );
  }
  return content;
};

export default HistoryPage;
