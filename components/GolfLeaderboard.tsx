import type { Player, Tournament } from "@/types/domain";
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

type GolfLeaderboardProps = {
  tournament: Tournament;
  players: Player[];
};

export default function GolfLeaderboard({
  tournament,
  players,
}: GolfLeaderboardProps) {
  const calculateTotalScore = (
    scores: Tournament["scorecards"][number]["scores"],
  ) => {
    return scores.reduce(
      (total, score) => total + (score.score !== 0 ? score.score : 0),
      0,
    );
  };

  const calculateTotalPar = (
    scores: Tournament["scorecards"][number]["scores"],
    holes: Tournament["holes"],
  ) => {
    return scores.reduce(
      (total, score, index) =>
        total + (score.score !== 0 ? holes[index].par : 0),
      0,
    );
  };

  const getPlayerNames = (playerIds: number[]) => {
    return playerIds
      .map((id) => {
        const player = players.find((p) => p.player_id === id);
        return player ? player.name : "Unknown";
      })
      .join(", ");
  };

  const sortedScorecards = [...tournament.scorecards].sort((a, b) => {
    const totalScoreA = calculateTotalScore(a.scores);
    const totalScoreB = calculateTotalScore(b.scores);
    const totalParA = calculateTotalPar(a.scores, tournament.holes);
    const totalParB = calculateTotalPar(b.scores, tournament.holes);
    return totalScoreA - totalParA - (totalScoreB - totalParB);
  });

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-4xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {tournament.title}
          </CardTitle>
          <CardDescription className="text-center">
            {tournament.date}
          </CardDescription>
          <p className="text-center text-sm text-muted-foreground">
            {tournament.course} - {tournament.time}
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-4">
          <Table>
            <TableHeader>
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="bg-primary text-primary-foreground">
                  Team
                </TableHead>
                <TableHead className="bg-primary text-primary-foreground">
                  Players
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  Score
                </TableHead>
                <TableHead className="bg-primary text-center text-primary-foreground">
                  Thru
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedScorecards.map((scorecard, index) => {
                const totalScore = calculateTotalScore(scorecard.scores);
                const totalPar = calculateTotalPar(
                  scorecard.scores,
                  tournament.holes,
                );
                const relativeScore = totalScore - totalPar;
                const relativeScoreString =
                  relativeScore === 0
                    ? "E"
                    : relativeScore > 0
                      ? `+${relativeScore}`
                      : `${relativeScore}`;
                const holesPlayed = scorecard.scores.filter(
                  (score) => score.score !== 0,
                ).length;
                return (
                  <TableRow key={scorecard.scorecard_id ?? index}>
                    <TableCell className="font-medium">
                      {scorecard.team}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {getPlayerNames(scorecard.playerIds)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {relativeScoreString}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {holesPlayed}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
