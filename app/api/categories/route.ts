import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { headers } from "next/headers";
import { initFirebaseAdmin } from "@/lib/firebase-admin";

// Initialize Firebase Admin only once
let initialized = false;
try {
  if (!initialized) {
    initFirebaseAdmin();
    initialized = true;
  }
} catch (error) {}

async function getUser(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    const token = authHeader?.split("Bearer ")[1];

    if (!token) {
      return null;
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const email = decodedToken.email;

    if (!email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return await prisma.user.create({
        data: {
          email,
          name: decodedToken.name || email.split("@")[0],
        },
      });
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUser(request);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's categories or create default ones if none exist
    let categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Food", color: "#FF5733", icon: "🍽️" },
        { name: "Transport", color: "#33FF57", icon: "🚗" },
        { name: "Entertainment", color: "#3357FF", icon: "🎮" },
        { name: "Shopping", color: "#FF33F5", icon: "🛍️" },
        { name: "Bills", color: "#33FFF5", icon: "📃" },
      ];

      categories = await Promise.all(
        defaultCategories.map((category) =>
          prisma.category.create({
            data: {
              ...category,
              userId: user.id,
            },
          })
        )
      );
    }

    return NextResponse.json(categories);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error?.message || "Unknown error",
      }),
      { status: 500 }
    );
  }
}
