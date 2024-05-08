"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchResults, fetchPlayers } from "@/utils/requests";
import Leaderboard from "@/components/Leaderboard";
import EventResults from "@/components/EventResults";

const SeasonHistoryPage = () => {
  const { season } = useParams();
  const [results, setResults] = useState(null);
  const [players, setPlayers] = useState(null);
  // TODO actually use the loading state
  const [loading, setLoading] = useState(true);
  let content;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultsData = await fetchResults({ season: `${season}` });
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
            results={[results]}
            title={`Pick'em Leaderboard ${season}`}
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

export default SeasonHistoryPage;
