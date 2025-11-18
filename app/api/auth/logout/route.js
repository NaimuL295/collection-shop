import { NextResponse } from "next/server";

export async function POST(req) {
  const res = NextResponse.json({ message: "Logged out successfully" });

  // Clear the JWT cookie
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // expire immediately
    sameSite: "strict",
  });

  return res;
}
