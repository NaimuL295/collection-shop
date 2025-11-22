import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

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
    return new Response(JSON.stringify({ error: "Registration failed" }), { status: 500 });
  }
}
