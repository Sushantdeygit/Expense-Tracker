import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, enum: ["Rapido", "Metro", "Other"], required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    direction: {
      type: String,
      enum: ["HomeToOffice", "OfficeToHome"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
