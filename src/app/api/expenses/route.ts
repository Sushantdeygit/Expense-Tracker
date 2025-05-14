import connectDB from "@/app/lib/mongo";
import Expense from "@/app/models/Expense";

export async function POST(req: Request) {
  await connectDB();
  const { userId, label, date, amount, direction } = await req.json();
  const expense = await Expense.create({
    user: userId,
    label,
    date,
    amount,
    direction,
  });
  return Response.json(expense);
}
