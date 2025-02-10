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
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

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

    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(expenses);
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

export async function POST(request: Request) {
  try {
    const user = await getUser(request);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const expense = await prisma.expense.create({
      data: {
        ...body,
        userId: user.id,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(expense);
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
