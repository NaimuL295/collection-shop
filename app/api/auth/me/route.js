
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  await dbConnect();

  try {
    const cookieStore =await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    return new Response(JSON.stringify({ user }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }
}
