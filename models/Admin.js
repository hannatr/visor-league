import { Schema, model, models } from "mongoose";

const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = models.Admin || model("Admin", AdminSchema, "admin");

export default Admin;
