import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";


export async function GET(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user by ID
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}
