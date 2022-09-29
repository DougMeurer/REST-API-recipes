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
    profilePic: { type: String, default: "shorturl.at/bhM67" },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    passwordHash: { type: String, required: true },
    emailConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ClientModel = mongoose.model("Client", clientSchema);

module.exports = ClientModel;
