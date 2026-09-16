import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export type AdminDoc = InferSchemaType<typeof AdminSchema>;

const Admin: Model<AdminDoc> =
  (models.Admin as Model<AdminDoc>) ||
  model<AdminDoc>("Admin", AdminSchema, "admin");

export default Admin;
