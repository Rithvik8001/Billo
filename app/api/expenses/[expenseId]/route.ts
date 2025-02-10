import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { updateExpenseSchema } from "@/lib/validations/expense";

export async function GET(
  req: Request,
  { params }: { params: { expenseId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: {
        id: params.expenseId,
        userId: user.id,
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    if (!expense) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { expenseId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = updateExpenseSchema.parse(json);

    const expense = await prisma.expense.findUnique({
      where: {
        id: params.expenseId,
        userId: user.id,
      },
    });

    if (!expense) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        id: params.expenseId,
      },
      data: {
        amount: body.amount,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        categoryId: body.categoryId,
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
            icon: true,
          },
        },
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("[EXPENSE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { expenseId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: {
        id: params.expenseId,
        userId: user.id,
      },
    });

    if (!expense) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await prisma.expense.delete({
      where: {
        id: params.expenseId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EXPENSE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
