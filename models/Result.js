import { Schema, model, models } from "mongoose";

const EventResultSchema = new Schema({
  player: { type: Number, required: true },
  raw: { type: Number, required: true },
  points: { type: Number, required: true },
});

const EventSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  results: [EventResultSchema],
});

const PlayerSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

const ResultSchema = new Schema({
  season: { type: Number, required: true },
  players: [PlayerSchema],
  events: [EventSchema],
});

const Result = models.Result || model("Result", ResultSchema);

export default Result;
