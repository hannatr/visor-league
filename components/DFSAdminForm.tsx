"use client";

import { useState, type FormEvent } from "react";
import { updateDFSLeague } from "@/utils/requests";
import type { DFSLeague } from "@/types/domain";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type DFSAdminFormProps = {
  results: DFSLeague[];
};

export default function DFSAdminForm({ results }: DFSAdminFormProps) {
  const [week, setWeek] = useState(1);
  const [scores, setScores] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const league = results.find((r) => r.current === true) || results[0];

  if (!league) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Admin - Add Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              No current DFS league found. Create or mark a league as current
              before adding scores.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const preprocessScores = (rawScores: string): DFSLeague | null => {
    const lines = rawScores.trim().split("\n");
    const formattedScores: { name: string; score: number }[] = [];

    for (const line of lines) {
      const [name, score] = line.trim().split(/\s+/);

      if (!name || isNaN(parseFloat(score))) {
        setError(`Invalid line: "${line}"`);
        return null;
      }

      formattedScores.push({ name, score: parseFloat(score) });
    }

    setError(null);

    const nextLeague: DFSLeague = {
      ...league,
      players: league.players.map((p) => ({
        name: p.name,
        scores: [...p.scores],
      })),
    };

    for (const { name, score } of formattedScores) {
      const player = nextLeague.players.find((p) => p.name === name);

      if (player) {
        if (player.scores.length < week) {
          player.scores = [
            ...player.scores,
            ...Array(week - player.scores.length).fill(0),
          ];
        }
        player.scores[week - 1] = score;
      } else {
        setError(`Player ${name} not found in the league`);
        return null;
      }
    }

    return nextLeague;
  };

  const submitLeague = async () => {
    const updatedLeague = preprocessScores(scores);
    if (!updatedLeague) return;

    const response = await updateDFSLeague({ league: updatedLeague });

    if (response.status === 200) {
      setStatusMessage("DFS League updated successfully!");
      setError(null);
    } else {
      setError(response.error ?? "Error updating DFS League");
      setStatusMessage(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const existingScores = league.players.some(
      (player) => player.scores[week - 1] !== undefined,
    );

    if (existingScores) {
      setConfirmOpen(true);
      return;
    }

    await submitLeague();
  };

  return (
    <>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Admin - Add Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="week">Week</Label>
              <Select
                value={String(week)}
                onValueChange={(value) => {
                  if (value != null) setWeek(Number(value));
                }}
              >
                <SelectTrigger id="week" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: league.weeks }, (_, index) => (
                    <SelectItem key={index + 1} value={String(index + 1)}>
                      Week {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="scores">Scores</Label>
              <Textarea
                id="scores"
                className="min-h-48"
                value={scores}
                onChange={(e) => setScores(e.target.value)}
                placeholder="Paste scores here in the format: user1 102.3"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {statusMessage && (
              <Alert>
                <AlertDescription>{statusMessage}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Overwrite week {week}?</AlertDialogTitle>
            <AlertDialogDescription>
              Scores for week {week} already exist. Are you sure you want to
              overwrite them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setConfirmOpen(false);
                await submitLeague();
              }}
            >
              Overwrite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
