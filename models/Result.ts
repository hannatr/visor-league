import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

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

const ResultSchema = new Schema({
  season: { type: Number, required: true },
  current: { type: Boolean, required: true, default: false },
  events: [EventSchema],
});

export type ResultDoc = InferSchemaType<typeof ResultSchema>;

const Result: Model<ResultDoc> =
  (models.Result as Model<ResultDoc>) ||
  model<ResultDoc>("Result", ResultSchema);

export default Result;
