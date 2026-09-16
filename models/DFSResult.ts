import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const DFSPlayerSchema = new Schema(
  {
    name: { type: String, required: true },
    scores: [Number],
  },
  { _id: false },
);

const DFSResultSchema = new Schema({
  season: { type: Number, required: true },
  current: { type: Boolean, required: true, default: false },
  weeks: { type: Number, required: true },
  season_places: { type: Number, required: true },
  weekly_places: { type: Number, required: true },
  players: [DFSPlayerSchema],
});

export type DFSResultDoc = InferSchemaType<typeof DFSResultSchema>;

const DFSResult: Model<DFSResultDoc> =
  (models.DFSResult as Model<DFSResultDoc>) ||
  model<DFSResultDoc>("DFSResult", DFSResultSchema, "dfs-results");

export default DFSResult;
