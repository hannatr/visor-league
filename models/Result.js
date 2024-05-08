import { Schema, model, models } from "mongoose";

const EventResultSchema = new Schema({
  // TODO reference the player collection
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

const ResultSchema = new Schema({
  season: { type: Number, required: true },
  current: { type: Boolean, required: true, default: false },
  events: [EventSchema],
});

const Result = models.Result || model("Result", ResultSchema);

export default Result;
