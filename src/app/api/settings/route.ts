import connectDB from "@/app/lib/mongo";
import Settings from "@/app/models/Settings";

export async function POST(req: Request) {
  await connectDB();
  const { userId, monthlyLimit } = await req.json();
  let setting = await Settings.findOne({ userId });

  if (setting) {
    setting.monthlyLimit = monthlyLimit;
    await setting.save();
  } else {
    setting = await Settings.create({ userId, monthlyLimit });
  }

  return Response.json(setting);
}
