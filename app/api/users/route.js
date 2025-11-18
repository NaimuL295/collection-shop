import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  await dbConnect();
  const users = await User.find({});
  return Response.json(users);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const newUser = await User.create(data);
  return Response.json(newUser, { status: 201 });
}
