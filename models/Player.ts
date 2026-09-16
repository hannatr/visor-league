import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const PlayerSchema = new Schema({
  player_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  in_league: { type: Boolean, required: true },
  start_year: { type: Number, required: false },
});

export type PlayerDoc = InferSchemaType<typeof PlayerSchema>;

const Player: Model<PlayerDoc> =
  (models.Player as Model<PlayerDoc>) ||
  model<PlayerDoc>("Player", PlayerSchema);

export default Player;
