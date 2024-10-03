import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const DFSPlayerSchema = new Schema({
  name: { type: String, required: true },
  scores: [Number], // Array of numbers
});

const DFSResultSchema = new Schema({
  season: { type: Number, required: true },
  current: { type: Boolean, required: true, default: false },
  weeks: { type: Number, required: true },
  players: [DFSPlayerSchema],
});

// Explicitly map the schema to the 'dfs-results' collection
const DFSResult =
  models.DFSResult || model("DFSResult", DFSResultSchema, "dfs-results");

export default DFSResult;
