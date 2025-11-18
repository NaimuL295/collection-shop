import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import User from "@/models/User";
import { signToken } from "@/utils/jwt";


export async function POST(req) {
  const { email, password } = await req.json();

  const user = User.find((u) => u.email === email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email });

  const res = NextResponse.json({
    message: "Login successful",
    user: { id: user.id, email: user.email },
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
