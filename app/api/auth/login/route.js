import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return new Response(JSON.stringify({ error: "User not found" }), { status: 400 });

    // Compare password
    const match = await bcrypt.compare(password.trim(), user.password);
    if (!match)
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 400 });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(JSON.stringify({ success: true, user: { id: user._id, email: user.email } }), {
      status: 200,
      headers: {
        "Set-Cookie": `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Login failed" }), { status: 500 });
  }
}
