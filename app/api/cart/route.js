// app/api/cart/route.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/token";
import DbConnect from "@/lib/Db/DbConnect";
import Cart from "@/models/cart";
import Product from "@/models/product";
import { resolvePrice } from "@/lib/pricing/resolvePrice";

export async function GET(req) {
  try {
    const authCookie = req.cookies.get("auth_token");
    if (!authCookie) {
      return NextResponse.json(
        { cart: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(authCookie.value);
    if (!payload) {
      return NextResponse.json(
        { cart: null, error: "Invalid token" },
        { status: 401 }
      );
    }

    await DbConnect();

    const cart = await Cart.findOne({
      userId: payload.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({
        cart: { items: [], subtotal: 0 },
      });
    }

    const productIds = cart.items.map((i) => i.productId);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    let subtotal = 0;

    const items = cart.items.map((item) => {
      const product = productMap.get(item.productId.toString());

      if (!product) {
        return null;
      }

      const pricing = resolvePrice({
        product,
        role: payload.user.role,
        quantity: item.quantity,
      });

      subtotal += pricing.lineTotal;

      return {
        product: {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          images: product.images,
          stock: product.stock,
        },
        quantity: item.quantity,
        sellBy: item.sellBy,
        pricing,
      };
    }).filter(Boolean);

    return NextResponse.json({
      cart: {
        items,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
