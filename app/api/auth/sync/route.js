import { getSession } from "@auth0/nextjs-auth0";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    // 1. Connect to MongoDB
    await dbConnect();

    // 2. Get Auth0 session (must be logged in)
    const session = await getSession();

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const auth0User = session.user;

    // 3. Check if the user exists in MongoDB
    let user = await User.findOne({ auth0Id: auth0User.sub });

    // 4. If not exists → create a new DB record
    if (!user) {
      user = await User.create({
        auth0Id: auth0User.sub,
        name: auth0User.name,
        email: auth0User.email,
        picture: auth0User.picture,
        role: "user", // default role
      });
    }

    // 5. Return MongoDB profile
    return Response.json(
      { success: true, user },
      { status: 200 }
    );
  } catch (err) {
    console.error("SYNC ERROR:", err);

    return Response.json(
      { error: "User sync failed" },
      { status: 500 }
    );
  }
}
