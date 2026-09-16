"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ScoreEntry from "./ScoreEntry";
import { updateScore } from "@/utils/requests";
import type { Hole, Player, Scorecard as ScorecardType } from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ScorecardProps = {
  scorecard: ScorecardType;
  players: Player[];
  holes: Hole[];
};

export default function Scorecard({
  scorecard,
  players,
  holes,
}: ScorecardProps) {
  const [selectedHole, setSelectedHole] = useState<Hole | null>(null);
  const [selectedScore, setSelectedScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const getPlayerNames = (playerIds: number[]) => {
    return playerIds
      .map((id) => {
        const player = players.find((p) => p.player_id === id);
        return player ? player.name : "Unknown";
      })
      .join(", ");
  };

  const calculateTotalScore = (scores: ScorecardType["scores"]) => {
    return scores.reduce(
      (total, score) => total + (score.score !== 0 ? score.score : 0),
      0,
    );
  };

  const calculateTotalPar = (holeList: Hole[]) => {
    return holeList.reduce((total, hole) => total + hole.par, 0);
  };

  const playerNames = getPlayerNames(scorecard.playerIds);
  const totalPar = calculateTotalPar(holes);

  const handleHoleClick = (hole: Hole, score: number) => {
    if (!token) return;
    setSelectedHole(hole);
    if (score === 0) {
      setSelectedScore(hole.par);
    } else {
      setSelectedScore(score);
    }
    setShowModal(true);
  };

  const handleSaveScore = async (newScore: number) => {
    if (!selectedHole) return;
    try {
      await updateScore({
        token,
        scorecard_id: scorecard.scorecard_id,
        holeNumber: selectedHole.holeNumber,
        score: newScore,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-lg">{scorecard.team}</CardTitle>
          {scorecard.tee_time && (
            <p className="text-xs font-medium text-muted-foreground">
              Tee Time: {scorecard.tee_time}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="mb-2 min-w-full text-xs">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="border border-primary-foreground/30 px-2 py-1 text-left font-medium uppercase tracking-wider">
                  Hole
                </th>
                {holes.map((hole) => (
                  <th
                    key={hole.holeNumber}
                    className="border border-primary-foreground/30 px-2 py-1 font-medium uppercase tracking-wider"
                  >
                    {hole.holeNumber}
                  </th>
                ))}
                <th className="border border-primary-foreground/30 px-2 py-1 font-medium uppercase tracking-wider">
                  Total
                </th>
              </tr>
              <tr>
                <td className="border border-primary-foreground/30 px-2 py-1 font-medium uppercase tracking-wider">
                  Par
                </td>
                {holes.map((hole) => (
                  <td
                    key={`par-${hole.holeNumber}`}
                    className="border border-primary-foreground/30 px-2 py-1 text-center font-medium"
                  >
                    {hole.par}
                  </td>
                ))}
                <td className="border border-primary-foreground/30 px-2 py-1 text-center font-medium">
                  {totalPar}
                </td>
              </tr>
              <tr>
                <td className="border border-primary-foreground/30 px-2 py-1 font-medium uppercase tracking-wider">
                  Handicap
                </td>
                {holes.map((hole) => (
                  <td
                    key={`hcp-${hole.holeNumber}`}
                    className="border border-primary-foreground/30 px-2 py-1 text-center font-medium"
                  >
                    {hole.handicap}
                  </td>
                ))}
                <td className="border border-primary-foreground/30 px-2 py-1 text-center font-medium" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-2 py-1 font-medium uppercase tracking-wider">
                  {playerNames}
                </td>
                {scorecard.scores.map((score) => {
                  const hole = holes.find(
                    (h) => h.holeNumber === score.holeNumber,
                  );
                  if (!hole) return null;
                  const isBirdie = score.score !== 0 && score.score < hole.par;
                  const isBogey = score.score !== 0 && score.score > hole.par;
                  return (
                    <td
                      key={score.holeNumber}
                      className={cn(
                        "border border-border px-2 py-1 text-center font-medium",
                        token && "cursor-pointer hover:bg-muted",
                      )}
                      onClick={() => handleHoleClick(hole, score.score)}
                    >
                      <span
                        className={cn(
                          isBirdie &&
                            "inline-flex size-6 items-center justify-center rounded-full border border-foreground",
                          isBogey &&
                            "inline-flex size-6 items-center justify-center border border-foreground",
                        )}
                      >
                        {score.score !== 0 ? score.score : "-"}
                      </span>
                    </td>
                  );
                })}
                <td className="border border-border px-2 py-1 text-center font-medium">
                  {calculateTotalScore(scorecard.scores)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScoreEntry
          key={
            selectedHole && showModal
              ? `${selectedHole.holeNumber}-${selectedScore}`
              : "closed"
          }
          show={showModal}
          hole={selectedHole}
          score={selectedScore}
          onSave={handleSaveScore}
          onClose={() => setShowModal(false)}
        />
      </CardContent>
    </Card>
  );
}
