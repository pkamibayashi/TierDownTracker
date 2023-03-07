import { Schema, model } from "mongoose";

const machineSchema = new Schema({
  serialNumber: { type: String },
  parts: [{ type: Schema.Types.ObjectId, ref: "Part" }],
  userCreator: { type: Schema.Types.ObjectId, ref: "User" },
});

const machineModel = model("Machine", machineSchema);
export default machineModel;
