import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Wishlist from "@/models/Wishlist";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, product } = body;

    if (!userId || !product || !product._id) {
      return NextResponse.json(
        { success: false, message: "User ID and product data are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      userId,
      productId: product._id
    });

    if (existingItem) {
      return NextResponse.json(
        { success: false, message: "Product already in wishlist" },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({
      userId,
      productId: product._id,
      product: product
    });

    await wishlistItem.save();

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      data: wishlistItem
    }, { status: 201 });

  } catch (error) {
    console.error("Add to wishlist error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Product already in wishlist" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}