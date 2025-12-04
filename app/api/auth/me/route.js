import { getSession } from "@auth0/nextjs-auth0/edge";

export async function GET(req) {
  try {
    const session = await getSession(req);

    if (!session?.user) {
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json({ user: session.user }, { status: 200 });

  } catch (err) {
    return Response.json({ error: "Failed to load session" }, { status: 500 });
  }
}
