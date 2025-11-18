import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";



export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // Check validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

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
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return res;
  } catch (error) {
    console.log("Register API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
