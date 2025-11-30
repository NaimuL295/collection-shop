import { NextResponse } from "next/server";

import Wishlist from "@/models/Wishlist";
import  dbConnect  from "@/lib/dbConnect";
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { productId } = params;
    const userId = req.nextUrl.searchParams.get("userId");

    if (!productId || !userId) {
      return NextResponse.json(
        { success: false, message: "Product ID and User ID are required" },
        { status: 400 }
      );
    }

    const deleted = await Wishlist.findOneAndDelete({ productId, userId });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist Delete Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
