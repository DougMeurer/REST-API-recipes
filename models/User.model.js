const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const ClientModel = mongoose.model("Client", clientSchema);

module.exports = ClientModel;
