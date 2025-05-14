import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  monthlyLimit: { type: Number, default: 5000 },
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
