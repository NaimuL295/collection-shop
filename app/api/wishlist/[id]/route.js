import { dbConnect } from "@/lib/dbConnect";
import Wishlist from "@/models/Wishlist";
import { NextResponse } from "next/server";


export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: "Product ID and User ID are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Delete the wishlist item
    const result = await Wishlist.findOneAndDelete({
      userId,
      productId: id
    });

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item removed from wishlist",
      data: result
    });

  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}