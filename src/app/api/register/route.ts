import connectDB from "@/app/lib/mongo";
import User from "@/app/models/User";

export async function POST(req: Request) {
  await connectDB();
  const { email, fullName, password } = await req.json();

  console.log(email, fullName, password);

  const existing = await User.findOne({ email });
  if (existing)
    return new Response(JSON.stringify({ error: "User exists" }), {
      status: 400,
    });

  const newUser = await User.create({ email, fullName, password });
  return Response.json({
    message: "User Registered Successfully!!",
    userId: newUser,
  });
}
