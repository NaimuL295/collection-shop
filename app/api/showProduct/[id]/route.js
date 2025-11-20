// import { dbConnect } from '@/lib/dbConnect';
// import Product from '@/models/Product';
// import { NextResponse } from 'next/server';

// export async function GET(request, context) {
//   try {
//     await dbConnect();

//     // Next.js 16: unwrap params
//     const { id } = await context.params;
//     console.log("Received product ID:", id);

//     if (!id) {
//       return NextResponse.json(
//         { success: false, message: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     const product = await Product.findById(id);
//     console.log("Mongoose product result =>", product);

//     if (!product) {
//       return NextResponse.json(
//         { success: false, message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     // ❌ REMOVE this because product has no isActive field
//     // if (!product.isActive) {
//     //   return NextResponse.json(
//     //     { success: false, message: "Product is not available" },
//     //     { status: 404 }
//     //   );
//     // }

//     // 🔥 FIX: related products search (no isActive check)
//     const relatedProducts = await Product.find({
//       _id: { $ne: id },
//       category: product.category,
//       stock: { $gt: 0 }
//     })
//       .select("name price offerprice images rating reviewCount stock")
//       .limit(4)
//       .sort({ rating: -1, createdAt: -1 });

//     return NextResponse.json({
//       success: true,
//       data: product,
//       relatedProducts,
//     });

//   } catch (error) {
//     console.error("Error fetching product:", error);

//     if (error.name === "CastError") {
//       return NextResponse.json(
//         { success: false, message: "Invalid product ID format" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { dbConnect } from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } =await params;
    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID required" }, { status: 400 });
    }

    // Main product
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });

    // Related products (same category, exclude current product, limit 3)
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      stock: { $gt: 0 },
    })
      .limit(3)
      .select('name price offerprice images stock');

    return NextResponse.json({
      success: true,
      data: product,
      relatedProducts: relatedProducts,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
