"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ScoreEntry from "./ScoreEntry";
import { updateScore } from "@/utils/requests";

const Scorecard = ({ scorecard, players, holes }) => {
  const [selectedHole, setSelectedHole] = useState(null);
  const [selectedScore, setSelectedScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Get player names from player IDs
  const getPlayerNames = (playerIds) => {
    return playerIds
      .map((id) => {
        const player = players.find((player) => player.player_id === id);
        return player ? player.name : "Unknown";
      })
      .join(", ");
  };

  // Calculate total score for the team
  const calculateTotalScore = (scores) => {
    return scores.reduce(
      (total, score) => total + (score.score !== 0 ? score.score : 0),
      0
    );
  };

  // Calculate total par
  const calculateTotalPar = (holes) => {
    return holes.reduce((total, hole) => total + hole.par, 0);
  };

  const playerNames = getPlayerNames(scorecard.playerIds);
  const totalPar = calculateTotalPar(holes);

  const handleHoleClick = (hole, score) => {
    if (!token) return;
    setSelectedHole(hole);
    if (score === 0) {
      setSelectedScore(hole.par);
    } else {
      setSelectedScore(score);
    }
    setShowModal(true);
  };

  const handleSaveScore = async (newScore) => {
    try {
      await updateScore({
        scorecard_id: scorecard.scorecard_id,
        holeNumber: selectedHole.holeNumber,
        score: newScore,
      });
      // Refresh the page to get the updated tournament data
      router.refresh();
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <div className="bg-white border border-green-700 rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-baseline space-x-2 mb-2">
        <h3 className="text-lg font-bold">{scorecard.team}</h3>
        <p className="text-xs font-medium text-gray-500">
          Tee Time: {scorecard.tee_time}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full mb-2">
          <thead className="bg-green-700 text-white border border-white">
            <tr>
              <th className="px-2 py-1 text-xs text-left font-medium uppercase tracking-wider border border-white">
                Hole
              </th>
              {holes.map((hole, index) => (
                <th
                  key={index}
                  className="px-2 py-1 text-xs font-medium uppercase tracking-wider border border-white"
                >
                  {hole.holeNumber}
                </th>
              ))}
              <th className="px-2 py-1 text-xs font-medium uppercase tracking-wider border border-white">
                Total
              </th>
            </tr>
            <tr className="bg-green-700 text-white border border-white">
              <td className="px-2 py-1 text-xs font-medium uppercase tracking-wider border border-white">
                Par
              </td>
              {holes.map((hole, index) => (
                <td
                  key={index}
                  className="px-2 py-1 text-xs font-medium text-center border border-white"
                >
                  {hole.par}
                </td>
              ))}
              <td className="px-2 py-1 text-xs font-medium text-center border border-white">
                {totalPar}
              </td>
            </tr>
            <tr className="bg-green-700 text-white border border-white">
              <td className="px-2 py-1 text-xs font-medium uppercase tracking-wider border border-white">
                Handicap
              </td>
              {holes.map((hole, index) => (
                <td
                  key={index}
                  className="px-2 py-1 text-xs font-medium text-center border border-white"
                >
                  {hole.handicap}
                </td>
              ))}
              <td className="px-2 py-1 text-xs font-medium text-center border border-white"></td>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-green-700">
              <td className="px-2 py-1 text-xs font-medium uppercase tracking-wider border border-green-700">
                {playerNames}
              </td>
              {scorecard.scores.map((score, index) => {
                const hole = holes.find(
                  (h) => h.holeNumber === score.holeNumber
                );
                const holePar = hole.par;
                const isBirdie = score.score !== 0 && score.score < holePar;
                const isBogey = score.score !== 0 && score.score > holePar;
                return (
                  <td
                    key={index}
                    className={`px-2 py-1 text-xs font-medium text-center border border-green-700 ${
                      token ? "cursor-pointer" : ""
                    }`}
                    onClick={() => handleHoleClick(hole, score.score)}
                  >
                    <span
                      className={isBirdie ? "circle" : isBogey ? "square" : ""}
                    >
                      {score.score !== 0 ? score.score : "-"}
                    </span>
                  </td>
                );
              })}
              <td className="px-2 py-1 text-xs font-medium text-center border border-green-700">
                {calculateTotalScore(scorecard.scores)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ScoreEntry
        show={showModal}
        hole={selectedHole}
        score={selectedScore}
        onSave={handleSaveScore}
        onClose={() => setShowModal(false)}
      />
      <style jsx>{`
        .circle {
          display: inline-block;
          width: 1.5em;
          height: 1.5em;
          line-height: 1.5em;
          text-align: center;
          border-radius: 50%;
          border: 1px solid black;
        }
        .square {
          display: inline-block;
          width: 1.5em;
          height: 1.5em;
          line-height: 1.5em;
          text-align: center;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
};

export default Scorecard;
