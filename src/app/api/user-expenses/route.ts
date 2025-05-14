import connectDB from "@/app/lib/mongo";
import Expense from "@/app/models/Expense";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
  return Response.json(expenses);
}
