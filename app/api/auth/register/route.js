// import { dbConnect } from "@/lib/dbConnect";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { name, email, password } = await req.json();

//     // Validation
//     if (!name || !email || !password) {
//       return Response.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Clean inputs
//     const cleanName = name.trim();
//     const cleanEmail = email.trim().toLowerCase();
//     const cleanPassword = password.trim();

//     // Check if user exists
//     const existingUser = await User.findOne({ email: cleanEmail });
//     if (existingUser) {
//       return Response.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // ✅ CLEAN: Let model handle hashing automatically
//     const user = await User.create({
//       name: cleanName,
//       email: cleanEmail,
//       password: cleanPassword, // Plain text - model will hash it
//     });

//     // Generate JWT
//     const token = jwt.sign(
//       { 
//         id: user._id, 
//         email: user.email,
//         role: user.role 
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Set cookie
//     const cookieStore = await cookies();
//     cookieStore.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//       sameSite: "strict"
//     });

//     return Response.json({
//       success: true,
//       user: { 
//         id: user._id, 
//         name: user.name,
//         email: user.email,
//         role: user.role 
//       },
//     }, { status: 201 });

//   } catch (err) {
//     console.error("Registration error:", err);
//     return Response.json(
//       { error: "Registration failed" }, 
//       { status: 500 }
//     );
//   }
// }




export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/dbconnections/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          email,
          password,
          name,
          connection: "Username-Password-Authentication",
        }),
      }
    );

    const data = await res.json();

    if (data.error) {
      return Response.json(
        { success: false, error: data.error_description },
        { status: 400 }
      );
    }

    return Response.json({ success: true, user: data });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
