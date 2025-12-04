// import { dbConnect } from "@/lib/dbConnect";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { email, password } = await req.json();

//     // Validation
//     if (!email || !password) {
//       return Response.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Clean inputs
//     const cleanEmail = email.trim().toLowerCase();
//     const cleanPassword = String(password).trim();

//     // Find user
//     const user = await User.findOne({ email: cleanEmail });
    
//     if (!user) {
//       return Response.json(
//         { error: "Invalid credentials" },
//         { status: 400 }
//       );
//     }

//     // ✅ CORRECT: Call on user instance
//     const isMatch = await user.comparePassword(cleanPassword);
    
//     if (!isMatch) {
//       return Response.json(
//         { error: "Invalid credentials" },
//         { status: 400 }
//       );
//     }

//     // Create JWT
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
//       maxAge: 60 * 60 * 24 * 7,
//       sameSite: "strict"
//     });

//     return Response.json({
//       success: true,
//       user: { 
//         id: user._id, 
//         name: user.name,
//         email: user.email, 
//         role: user.role 
//       }
//     }, { status: 200 });

//   } catch (err) {
//     console.error("Login Error:", err);
//     return Response.json(
//       { error: "Login failed" }, 
//       { status: 500 }
//     );
//   }
// }


export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }

    // Auth0 OAuth Token endpoint
    const res = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "password",
        username: email,
        password: password,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        scope: "openid profile email",
      }),
    });

    const data = await res.json();

    if (data.error) {
      return Response.json(
        {
          success: false,
          error: data.error_description || "Invalid credentials",
        },
        { status: 401 }
      );
    }

    return Response.json({ success: true, token: data.access_token });
  } catch (err) {
    return Response.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
