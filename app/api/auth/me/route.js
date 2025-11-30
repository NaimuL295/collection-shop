// import { dbConnect } from "@/lib/dbConnect";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function GET() {
//   await dbConnect();

//   try {
//     const cookieStore = await cookies(); // ✅ await প্রয়োজন
//     const token = cookieStore.get("token")?.value;

//     if (!token) {
//       return Response.json({ user: null }, { status: 200 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select("-password");

//     return Response.json({ user }, { status: 200 });

//   } catch (error) {
//     console.error("Auth check error:", error);
//     return Response.json({ user: null }, { status: 200 });
//   }
// }
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  await dbConnect();

  try {
    const cookieStore = await cookies(); // ❗ must use await
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    return Response.json({ user }, { status: 200 });
  } catch (err) {
    console.log("Auth Check Error:", err);
    return Response.json({ user: null }, { status: 200 });
  }
}
