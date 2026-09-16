"use client";

import { useState } from "react";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiDiamondLine,
  RiMedalLine,
  RiThumbDownLine,
  RiTrophyLine,
} from "@remixicon/react";
import type { DFSLeague } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type FDLeaderboardProps = {
  results: DFSLeague[];
  title: string;
};

type RowPlayer = {
  name: string;
  total: string;
  rank: number;
  [key: string]: string | number;
};

export default function FDLeaderboard({ results, title }: FDLeaderboardProps) {
  const league = results[0];
  const weeks = Object.keys(league.players[0].scores).length;

  const players: RowPlayer[] = league.players
    .map((player) => {
      const transformed: RowPlayer = { name: player.name, total: "0", rank: 0 };
      let total = 0;

      player.scores.forEach((result, index) => {
        transformed[`week ${index + 1}`] = result;
        total += result;
      });
      transformed.total = total.toFixed(2);
      return transformed;
    })
    .sort((a, b) => parseFloat(b.total) - parseFloat(a.total));

  players.forEach((player, index) => {
    player.rank = index + 1;
  });

  const highestScores = Array.from({ length: weeks }).map((_, weekIndex) => {
    return Math.max(
      ...players.map((player) => Number(player[`week ${weekIndex + 1}`])),
    );
  });

  const allScores = players.flatMap((player) =>
    Object.values(player).filter(
      (value): value is number => typeof value === "number" && value > 0,
    ),
  );
  const sortedAllScores = [...allScores].sort((a, b) => b - a);
  const secondHighestScore =
    sortedAllScores.length > 1 ? sortedAllScores[1] : null;
  const lowestScores = Array.from({ length: weeks }).map((_, weekIndex) => {
    return Math.min(
      ...players.map((player) => Number(player[`week ${weekIndex + 1}`])),
    );
  });
  const highestOverallScore = Math.max(...highestScores);

  const firstPlaceTotal = parseFloat(players[0].total);
  const lastPlaceTotal = parseFloat(
    players[league.season_places - 1]?.total || players[3].total,
  );

  const [sortConfig, setSortConfig] = useState({
    key: "total",
    direction: "descending" as "ascending" | "descending",
  });

  const sortedPlayers = [...players].sort((a, b) => {
    const aValue =
      typeof a[sortConfig.key] === "number"
        ? (a[sortConfig.key] as number)
        : parseFloat(String(a[sortConfig.key]));
    const bValue =
      typeof b[sortConfig.key] === "number"
        ? (b[sortConfig.key] as number)
        : parseFloat(String(b[sortConfig.key]));

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "descending";
    if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <RiArrowUpLine data-icon="inline-end" className="size-3.5" />
    ) : (
      <RiArrowDownLine data-icon="inline-end" className="size-3.5" />
    );
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-7xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-4">
          <Table>
            <TableHeader>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="sticky left-0 bg-primary text-center text-primary-foreground">
                  Rank
                </TableHead>
                <TableHead className="sticky left-12 bg-primary text-primary-foreground">
                  Name
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                    onClick={() => handleSort("total")}
                  >
                    Total {getSortIcon("total")}
                  </Button>
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  Off 1st
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  Off {league.season_places}th
                </TableHead>
                {Array.from({ length: weeks }).map((_, i) => (
                  <TableHead
                    key={i}
                    className="bg-primary text-center text-primary-foreground"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                      onClick={() => handleSort(`week ${i + 1}`)}
                    >
                      {`Week ${i + 1}`} {getSortIcon(`week ${i + 1}`)}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player, index) => (
                <TableRow key={`${player.name}-${index}`}>
                  <TableCell className="sticky left-0 bg-card text-center font-medium">
                    {player.rank}
                  </TableCell>
                  <TableCell className="sticky left-12 bg-card font-medium">
                    {player.name}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-center font-bold",
                      player.rank <= league.season_places && "bg-primary/20",
                    )}
                  >
                    {player.rank === 1 && (
                      <RiTrophyLine className="mr-1 inline size-3.5 text-yellow-500" />
                    )}
                    {player.rank === 2 && (
                      <RiMedalLine className="mr-1 inline size-3.5 text-zinc-400" />
                    )}
                    {player.rank === 3 && (
                      <RiMedalLine className="mr-1 inline size-3.5 text-amber-700" />
                    )}
                    {player.rank >= 4 &&
                      player.rank <= league.season_places && (
                        <RiMedalLine className="mr-1 inline size-3.5 text-red-500" />
                      )}
                    {player.total}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {parseFloat(player.total) - firstPlaceTotal >= 0
                      ? "-"
                      : (parseFloat(player.total) - firstPlaceTotal).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {parseFloat(player.total) - lastPlaceTotal >= 0
                      ? "-"
                      : (parseFloat(player.total) - lastPlaceTotal).toFixed(2)}
                  </TableCell>
                  {Array.from({ length: weeks }).map((_, weekIndex) => {
                    const score = Number(player[`week ${weekIndex + 1}`]);
                    const isHighest =
                      score === highestScores[weekIndex] &&
                      score != highestOverallScore;
                    const isOverallSecond =
                      secondHighestScore !== null &&
                      score === secondHighestScore &&
                      score != highestOverallScore;
                    const isLowest = score === lowestScores[weekIndex];
                    const isOverallHigh = score === highestOverallScore;

                    return (
                      <TableCell
                        key={weekIndex}
                        className={cn(
                          "text-center",
                          isHighest && "bg-primary/20 font-bold",
                          (isOverallHigh || isOverallSecond) &&
                            "bg-chart-1/30 font-bold",
                          !isHighest &&
                            !isOverallHigh &&
                            !isOverallSecond &&
                            "text-muted-foreground",
                        )}
                      >
                        {isOverallHigh && (
                          <RiDiamondLine className="mr-1 inline-block size-3.5 text-chart-2" />
                        )}
                        {isHighest && (
                          <RiTrophyLine className="mr-1 inline-block size-3.5 text-yellow-500" />
                        )}
                        {isOverallSecond && (
                          <RiDiamondLine className="mr-1 inline-block size-3.5 text-muted-foreground" />
                        )}
                        {isLowest && (
                          <RiThumbDownLine className="mr-1 inline-block size-3.5 text-destructive" />
                        )}
                        {score}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
