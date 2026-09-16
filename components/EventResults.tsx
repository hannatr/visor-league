"use client";

import { useState } from "react";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiMedalLine,
  RiTrophyLine,
} from "@remixicon/react";
import type { Event, Player } from "@/types/domain";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EventResultsProps = {
  event: Event;
  players: Player[];
};

export default function EventResults({ event, players }: EventResultsProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const findPlayerName = (playerId: number) => {
    const player = players.find((p) => p.player_id === playerId);
    return player ? player.name : "Unknown Player";
  };

  const areAllPointsZero = () => {
    return event.results.every((result) => result.points === 0);
  };

  const placeIcons = [
    <RiTrophyLine key={1} className="size-4 text-yellow-400" />,
    <RiMedalLine key={2} className="size-4 text-zinc-300" />,
    <RiMedalLine key={3} className="size-4 text-amber-700" />,
  ];

  return (
    <div className="my-8 flex justify-center">
      <Card className="relative w-full max-w-4xl overflow-hidden">
        <CardHeader className="relative">
          <CardTitle className="text-center text-xl">
            Event {event.id}: {event.name}
          </CardTitle>
          <CardDescription className="text-center">
            {event.description}
          </CardDescription>
          <p className="text-center text-sm text-muted-foreground">
            {event.date}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand event" : "Collapse event"}
          >
            {isCollapsed ? <RiArrowDownLine /> : <RiArrowUpLine />}
          </Button>
        </CardHeader>
        {isCollapsed ? (
          areAllPointsZero() ? (
            <div className="bg-primary px-4 py-3 text-center text-primary-foreground">
              Event in Progress...
            </div>
          ) : (
            <div className="flex justify-between bg-primary px-4 py-3 text-primary-foreground">
              {event.results.slice(0, 3).map((result, index) => (
                <div key={result.player} className="flex items-center gap-2">
                  {placeIcons[index]}
                  <span>
                    {findPlayerName(result.player)} ({result.points})
                  </span>
                </div>
              ))}
            </div>
          )
        ) : (
          <CardContent className="px-0 pb-4">
            <Table>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="bg-primary text-primary-foreground">
                    Place
                  </TableHead>
                  <TableHead className="bg-primary text-primary-foreground">
                    Player
                  </TableHead>
                  <TableHead className="bg-primary text-primary-foreground">
                    Raw
                  </TableHead>
                  <TableHead className="bg-primary text-primary-foreground">
                    Points
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.results.map((result, index) => (
                  <TableRow key={result.player}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {findPlayerName(result.player)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.raw}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {result.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
