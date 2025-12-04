// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function GET() {
//   // Cookie delete
//   (await cookies()).delete("token");

//   return NextResponse.json({ success: true, message: "Logged out" });
// }
import { NextResponse } from "next/server";

export async function GET() {
  const AUTH0_DOMAIN = process.env.AUTH0_ISSUER_BASE_URL;
  const BASE_URL = process.env.AUTH0_BASE_URL;

  const logoutURL = `${AUTH0_DOMAIN}/v2/logout?returnTo=${encodeURIComponent(
    BASE_URL
  )}&client_id=${process.env.AUTH0_CLIENT_ID}`;

  return NextResponse.redirect(logoutURL);
}
