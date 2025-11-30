import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Clean inputs
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Find user
    const user = await User.findOne({ email: cleanEmail });
    
    if (!user) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // ✅ CORRECT: Call on user instance
    const isMatch = await user.comparePassword(cleanPassword);
    
    if (!isMatch) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Create JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict"
    });

    return Response.json({
      success: true,
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email, 
        role: user.role 
      }
    }, { status: 200 });

  } catch (err) {
    console.error("Login Error:", err);
    return Response.json(
      { error: "Login failed" }, 
      { status: 500 }
    );
  }
}