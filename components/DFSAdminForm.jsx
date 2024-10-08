"use client";
import React, { useState } from "react";
import { updateDFSLeague } from "@/utils/requests";

const DFSAdminForm = ({ results }) => {
  const [week, setWeek] = useState(1);
  const [scores, setScores] = useState("");
  const [error, setError] = useState(null);

  const league = results[0];

  const preprocessScores = (rawScores) => {
    const lines = rawScores.trim().split("\n");
    const formattedScores = [];

    for (let line of lines) {
      const [name, score] = line.trim().split(/\s+/);

      // Check if both name and score are valid
      if (!name || isNaN(parseFloat(score))) {
        setError(`Invalid line: "${line}"`);
        return null; // Exit early if there's invalid input
      }

      formattedScores.push({ name, score: parseFloat(score) });
    }

    setError(null); // Clear any existing errors

    // Update the league object with the new scores
    for (let { name, score } of formattedScores) {
      const player = league.players.find((p) => p.name === name);

      if (player) {
        // Ensure the scores array has enough slots for the selected week
        if (player.scores.length < week) {
          player.scores = [
            ...player.scores,
            ...Array(week - player.scores.length).fill(0),
          ];
        }

        // Update the score for the selected week (0-based index for week)
        player.scores[week - 1] = score;
      } else {
        setError(`Player ${name} not found in the league`);
        return null; // Exit if player is not found
      }
    }

    return league; // Return the updated league object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the selected week already has scores
    const existingScores = league.players.some(
      (player) => player.scores[week - 1] !== undefined
    );

    if (existingScores) {
      const confirmation = window.confirm(
        `Scores for week ${week} already exist. Are you sure you want to overwrite them?`
      );

      if (!confirmation) {
        // If the admin cancels the action, return early
        return;
      }
    }

    // Preprocess the raw score input into the desired format
    const updatedLeague = preprocessScores(scores);
    if (!updatedLeague) return; // Stop submission if there's an error

    await updateDFSLeague({ league: updatedLeague });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">
        Admin - Add Scores
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Week
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          >
            {Array.from({ length: league.weeks }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Week {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Scores
          </label>
          <textarea
            className="mt-1 block w-full h-48 p-3 border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            value={scores}
            onChange={(e) => setScores(e.target.value)}
            placeholder="Paste scores here in the format: user1 102.3"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DFSAdminForm;
