import connectDB from "@/app/lib/mongo";
import User from "@/app/models/User";
export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  return Response.json({
    userId: user._id,
    email: user.email,
    fullName: user.fullName,
  });
}
