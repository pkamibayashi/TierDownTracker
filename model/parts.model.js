import { Schema, model } from "mongoose";

const partSchema = new Schema(
  {
    partNumber: { type: String, required: true },
    machineSerialNumber: { type: String, required: true },
    partName: { type: String, required: true },
    userCreator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const partModel = model("Part", partSchema);
export default partModel;
