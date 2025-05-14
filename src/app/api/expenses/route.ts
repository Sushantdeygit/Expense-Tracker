import connectDB from "@/app/lib/mongo";
import Expense from "@/app/models/Expense";

export async function POST(req: Request) {
  await connectDB();
  const { userId, label, date, amount, direction } = await req.json();
  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }
  const expense = await Expense.create({
    user: userId,
    label,
    date,
    amount,
    direction,
  });
  return Response.json(expense);
}
export async function PATCH(req: Request) {
  await connectDB();

  const body = await req.json();
  const { userId, ...fieldsToUpdate } = body;

  if (!userId) {
    return Response.json({ error: "userId is required" }, { status: 400 });
  }

  const updatePayload: Record<string, any> = {};

  // Only add fields that are present in the request
  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    if (value !== undefined && value !== null) {
      updatePayload[key] = value;
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    return Response.json({ error: "No fields to update" }, { status: 400 });
  }

  const result = await Expense.updateMany(
    { user: userId },
    { $set: updatePayload }
  );

  return Response.json({
    message: "Expenses updated successfully",
    modifiedCount: result.modifiedCount,
  });
}
