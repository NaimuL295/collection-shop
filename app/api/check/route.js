import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "✅ MongoDB connected successfully!" });
  } catch (error) {
    return NextResponse.json(
      { message: "❌ Connection failed", error: error.message },
      { status: 500 }
    );
  }
}
export async function POST(){
  try {
    await NextResponse
  } catch (error) {
    
  }
}
