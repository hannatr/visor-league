import { Schema, model, models } from "mongoose";

const HoleSchema = new Schema({
  holeNumber: { type: Number, required: true },
  par: { type: Number, required: true },
  handicap: { type: Number, required: true },
});

const ScoreSchema = new Schema({
  holeNumber: { type: Number, required: true },
  score: { type: Number, required: true, default: 0 },
});

const ScorecardSchema = new Schema({
  scorecard_id: { type: Number, required: true },
  team: { type: String, required: true },
  tee_time: { type: String, required: false },
  // TODO reference the player collection
  playerIds: [{ type: Number, required: true }],
  scores: [ScoreSchema],
});

const TournamentSchema = new Schema({
  year: { type: Number, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  current: { type: Boolean, required: true },
  course: { type: String, required: true },
  time: { type: String, required: true },
  winner: { type: String, required: false },
  holes: [HoleSchema],
  scorecards: [ScorecardSchema],
});

const Tournament = models.Tournament || model("Tournament", TournamentSchema);

export default Tournament;
