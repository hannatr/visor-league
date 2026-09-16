"use client";

import { useState } from "react";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiMedalLine,
  RiThumbDownLine,
  RiTrophyLine,
} from "@remixicon/react";
import type { Player, SeasonResult } from "@/types/domain";
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

type LeaderboardProps = {
  players: Player[];
  results: SeasonResult[];
  title: string;
  showFirstSeason?: boolean;
};

type SortKey =
  "points" | "firsts" | "seconds" | "thirds" | "lasts" | "firstSeason";

export default function Leaderboard({
  players,
  results,
  title,
  showFirstSeason = false,
}: LeaderboardProps) {
  const events = results.reduce(
    (acc, result) => [...acc, ...result.events],
    [] as SeasonResult["events"],
  );

  const countPositions = (
    playerId: number,
    placement: "first" | "second" | "third" | "last",
  ) => {
    return events.reduce((count, event) => {
      const result = event.results.find((r) => r.player === playerId);
      let targetPoints = event.results.length;
      if (placement === "second") targetPoints -= 1;
      if (placement === "third") targetPoints -= 2;
      if (placement === "last") targetPoints = 1;

      if (result && result.points === targetPoints) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const playerStats = players.map((player) => {
    const totalPoints = events.reduce((acc, event) => {
      const result = event.results.find((r) => r.player === player.player_id);
      return acc + (result ? result.points : 0);
    }, 0);

    return {
      ...player,
      points: totalPoints,
      firsts: countPositions(player.player_id, "first"),
      seconds: countPositions(player.player_id, "second"),
      thirds: countPositions(player.player_id, "third"),
      lasts: countPositions(player.player_id, "last"),
      firstSeason: player.start_year ?? 2023,
    };
  });

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  }>({
    key: "points",
    direction: "descending",
  });

  const sortedPlayers = [...playerStats].sort((a, b) => {
    const aVal =
      sortConfig.key === "firstSeason"
        ? (a.start_year ?? 2023)
        : a[sortConfig.key];
    const bVal =
      sortConfig.key === "firstSeason"
        ? (b.start_year ?? 2023)
        : b[sortConfig.key];
    if (aVal < bVal) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "descending";
    if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <RiArrowUpLine data-icon="inline-end" className="size-3.5" />
    ) : (
      <RiArrowDownLine data-icon="inline-end" className="size-3.5" />
    );
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-4">
          <Table>
            <TableHeader>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="bg-primary text-primary-foreground">
                  Name
                </TableHead>
                {showFirstSeason && (
                  <TableHead className="bg-primary text-center text-primary-foreground">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                      onClick={() => handleSort("firstSeason")}
                    >
                      First Season {getSortIcon("firstSeason")}
                    </Button>
                  </TableHead>
                )}
                <TableHead className="bg-primary text-center text-primary-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                    onClick={() => handleSort("points")}
                  >
                    Points {getSortIcon("points")}
                  </Button>
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                    onClick={() => handleSort("firsts")}
                  >
                    <RiTrophyLine
                      data-icon="inline-start"
                      className="size-3.5 text-yellow-400"
                    />
                    1st {getSortIcon("firsts")}
                  </Button>
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                    onClick={() => handleSort("seconds")}
                  >
                    <RiMedalLine
                      data-icon="inline-start"
                      className="size-3.5 text-zinc-300"
                    />
                    2nd {getSortIcon("seconds")}
                  </Button>
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                    onClick={() => handleSort("thirds")}
                  >
                    <RiMedalLine
                      data-icon="inline-start"
                      className="size-3.5 text-amber-700"
                    />
                    3rd {getSortIcon("thirds")}
                  </Button>
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-primary-foreground hover:bg-transparent hover:text-primary-foreground"
                    onClick={() => handleSort("lasts")}
                  >
                    <RiThumbDownLine
                      data-icon="inline-start"
                      className="size-3.5 text-red-400"
                    />
                    Last {getSortIcon("lasts")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player) => (
                <TableRow key={player.player_id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  {showFirstSeason && (
                    <TableCell className="text-center text-muted-foreground">
                      {player.firstSeason}
                    </TableCell>
                  )}
                  <TableCell className="text-center text-muted-foreground">
                    {player.points}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {player.firsts}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {player.seconds}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {player.thirds}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {player.lasts}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
