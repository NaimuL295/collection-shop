
// import Product from "@/models/Product";

import { dbConnect } from "@/lib/dbConnect";

// import { dbConnect } from "@/lib/dbConnect";
// import Product from "@/models/Product";

// export async function GET(request) {
//   await dbConnect();

//   const { searchParams } = new URL(request.url);
//   const q = searchParams.get("q");

//   const products = await Product.find({
//     name: { $regex: q, $options: "i" },
//   });

//   return Response.json({ success: true, products });
// }




;
 import Product from "@/models/Product";
export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query"); // ✅ fixed

  if (!query || typeof query !== "string") {
    return Response.json(
      { success: false, message: "Invalid or missing query" },
      { status: 400 }
    );
  }

  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  });

  return Response.json({ success: true, products });
}
