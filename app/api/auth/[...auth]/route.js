import { auth } from "@auth/core";
import Auth0 from "@auth/auth0-next";

const config = {
  providers: [Auth0()],
  secret: process.env.NEXTAUTH_SECRET,
};

export function GET(req) {
  return auth(req, config);
}

export function POST(req) {
  return auth(req, config);
}
