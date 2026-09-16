import { fetchTournaments, fetchPlayers } from "@/utils/requests";
import GolfLeaderboard from "@/components/GolfLeaderboard";
import Scorecard from "@/components/Scorecard";

export const dynamic = "force-dynamic";

export default async function TournamentYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const players = await fetchPlayers();
  const tournaments = await fetchTournaments({ season: year });

  const tournament =
    tournaments.find((t) => t.year === parseInt(year, 10)) || null;

  if (!tournament) {
    return (
      <div className="min-h-screen bg-muted/40">
        <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-4 font-heading text-3xl font-bold">
              Tournament Not Found
            </h1>
            <p className="text-muted-foreground">
              No tournament found for the year {year}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-7xl px-2 py-6 sm:px-6 lg:px-8">
        <GolfLeaderboard tournament={tournament} players={players} />

        <h2 className="mt-8 mb-4 text-center font-heading text-2xl font-bold">
          Scorecards
        </h2>
        <div className="overflow-x-auto">
          {tournament.scorecards.map((scorecard, index) => (
            <div key={scorecard.scorecard_id ?? index} className="min-w-full">
              <Scorecard
                scorecard={scorecard}
                players={players}
                holes={tournament.holes}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
