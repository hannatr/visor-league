import { Schema, model, models } from "mongoose";

const PlayerSchema = new Schema({
  player_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

const Player = models.Player || model("Player", PlayerSchema);

export default Player;
