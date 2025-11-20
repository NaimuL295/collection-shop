
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400 });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
      "Content-Type": "application/json",
    },
  });
}
