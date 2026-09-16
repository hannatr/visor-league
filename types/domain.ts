export interface Player {
  _id?: string;
  player_id: number;
  name: string;
  in_league: boolean;
  start_year?: number;
}

export interface EventResult {
  player: number;
  raw: number;
  points: number;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  results: EventResult[];
}

export interface SeasonResult {
  _id?: string;
  season: number;
  current: boolean;
  events: Event[];
}

export interface HoleScore {
  holeNumber: number;
  score: number;
}

export interface Hole {
  holeNumber: number;
  par: number;
  handicap: number;
}

export interface Scorecard {
  scorecard_id: number;
  team: string;
  tee_time?: string;
  playerIds: number[];
  scores: HoleScore[];
}

export interface Tournament {
  _id?: string;
  year: number;
  title: string;
  date: string;
  current: boolean;
  course: string;
  time: string;
  winner?: string;
  holes: Hole[];
  scorecards: Scorecard[];
}

export interface DFSPlayer {
  name: string;
  scores: number[];
}

export interface DFSLeague {
  _id?: string;
  season: number;
  current: boolean;
  weeks: number;
  season_places: number;
  weekly_places: number;
  players: DFSPlayer[];
}

export type ActionStatusResponse = {
  status: number;
  error?: string;
  message?: string;
};

export type AdminLoginResult =
  { success: true; error?: undefined } | { success: false; error: string };
